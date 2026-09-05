const Invitation = require('../models/Invitation');
const Rsvp = require('../models/Rsvp');

// Helper to generate a clean slug from title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

const generateUniqueSlug = async (title, currentId = null) => {
  let baseSlug = slugify(title) || 'ceremony';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Invitation.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId.toString())) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// @desc    Create new invitation
// @route   POST /api/invitations
// @access  Private
exports.createInvitation = async (req, res, next) => {
  try {
    const {
      title,
      ceremonyType,
      hostNames,
      eventDate,
      eventTime,
      timezone,
      venueName,
      venueAddress,
      mapUrl,
      dressCode,
      dressCodeColors,
      story,
      coverImage,
      theme,
      schedule,
      registryInfo,
      settings,
      status
    } = req.body;

    if (!title || !hostNames || !eventDate || !venueName || !venueAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, hosts, event date, and venue details.'
      });
    }

    const slug = await generateUniqueSlug(title);

    const invitation = await Invitation.create({
      user: req.user.id,
      title,
      slug,
      ceremonyType: ceremonyType || 'wedding',
      hostNames,
      eventDate,
      eventTime: eventTime || '18:00',
      timezone: timezone || 'CET',
      venueName,
      venueAddress,
      mapUrl: mapUrl || '',
      dressCode: dressCode || 'Cocktail & Festive',
      dressCodeColors: dressCodeColors || ['#D4AF37', '#2C3E50', '#EAECEE', '#E67E22'],
      story: story || '',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      theme: theme || { id: 'rose-gold' },
      schedule: schedule || [],
      registryInfo: registryInfo || {},
      settings: settings || {},
      status: status || 'published'
    });

    res.status(201).json({
      success: true,
      message: 'Invitation created successfully!',
      invitation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all invitations created by logged-in user with RSVP stats
// @route   GET /api/invitations
// @access  Private
exports.getUserInvitations = async (req, res, next) => {
  try {
    const invitations = await Invitation.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Calculate RSVP stats for each invitation
    const invitationsWithStats = await Promise.all(
      invitations.map(async (inv) => {
        const rsvps = await Rsvp.find({ invitation: inv._id });

        const attending = rsvps.filter(r => r.status === 'attending').length;
        const declined = rsvps.filter(r => r.status === 'declined').length;
        const maybe = rsvps.filter(r => r.status === 'maybe').length;
        const totalHeadcount = rsvps
          .filter(r => r.status === 'attending')
          .reduce((sum, r) => sum + 1 + (r.plusOnes || 0), 0);

        return {
          ...inv.toObject(),
          stats: {
            totalRsvps: rsvps.length,
            attending,
            declined,
            maybe,
            totalHeadcount
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: invitationsWithStats.length,
      invitations: invitationsWithStats
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single invitation by ID (for edit / host view)
// @route   GET /api/invitations/:id
// @access  Private
exports.getInvitationById = async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (invitation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this invitation'
      });
    }

    res.status(200).json({
      success: true,
      invitation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public invitation by slug (Guest-facing view)
// @route   GET /api/invitations/public/:slug
// @access  Public
exports.getPublicInvitation = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Search by slug or by ObjectId if valid ObjectId
    let query = { slug: slug.toLowerCase() };
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const invitation = await Invitation.findOne(query);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Celebration invitation not found'
      });
    }

    // Increment view counter asynchronously
    Invitation.findByIdAndUpdate(invitation._id, { $inc: { viewsCount: 1 } }).exec();

    // Fetch public wishes / messages if enabled
    let wishes = [];
    if (invitation.settings && invitation.settings.showWishesWall) {
      wishes = await Rsvp.find({
        invitation: invitation._id,
        wishesMessage: { $exists: true, $ne: '' }
      })
        .select('guestName wishesMessage createdAt status')
        .sort({ createdAt: -1 })
        .limit(50);
    }

    res.status(200).json({
      success: true,
      invitation,
      wishes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update invitation
// @route   PUT /api/invitations/:id
// @access  Private
exports.updateInvitation = async (req, res, next) => {
  try {
    let invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (invitation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this invitation'
      });
    }

    // If title changed, optionally update slug if requested
    if (req.body.title && req.body.title !== invitation.title && !req.body.preserveSlug) {
      req.body.slug = await generateUniqueSlug(req.body.title, invitation._id);
    }

    invitation = await Invitation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Invitation updated successfully!',
      invitation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete invitation and associated RSVPs
// @route   DELETE /api/invitations/:id
// @access  Private
exports.deleteInvitation = async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (invitation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this invitation'
      });
    }

    // Cascade delete RSVPs
    await Rsvp.deleteMany({ invitation: invitation._id });
    await invitation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Invitation and all RSVP entries deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};
