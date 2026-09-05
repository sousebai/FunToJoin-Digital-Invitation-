const Rsvp = require('../models/Rsvp');
const Invitation = require('../models/Invitation');
const { Parser } = require('json2csv');

// @desc    Submit RSVP for an invitation (Guest)
// @route   POST /api/rsvps/public/:slug
// @access  Public
exports.submitRsvp = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      guestName,
      email,
      phone,
      status,
      plusOnes,
      plusOneNames,
      dietaryRestrictions,
      wishesMessage,
      songRequest
    } = req.body;

    if (!guestName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name.'
      });
    }

    // Find invitation
    let query = { slug: slug.toLowerCase() };
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const invitation = await Invitation.findOne(query);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found.'
      });
    }

    // Check RSVP deadline
    if (invitation.settings && invitation.settings.rsvpDeadline) {
      const deadline = new Date(invitation.settings.rsvpDeadline);
      if (new Date() > deadline) {
        return res.status(400).json({
          success: false,
          message: 'The RSVP deadline for this event has passed. Please contact the hosts directly.'
        });
      }
    }

    // Validate plus ones
    let validatedPlusOnes = parseInt(plusOnes, 10) || 0;
    const maxAllowed = (invitation.settings && invitation.settings.maxPlusOnes !== undefined)
      ? invitation.settings.maxPlusOnes
      : 2;

    if (invitation.settings && !invitation.settings.allowPlusOnes) {
      validatedPlusOnes = 0;
    } else if (validatedPlusOnes > maxAllowed) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed plus-ones is ${maxAllowed}.`
      });
    }

    const rsvp = await Rsvp.create({
      invitation: invitation._id,
      guestName,
      email: email || '',
      phone: phone || '',
      status: status || 'attending',
      plusOnes: status === 'attending' ? validatedPlusOnes : 0,
      plusOneNames: status === 'attending' ? (plusOneNames || []) : [],
      dietaryRestrictions: dietaryRestrictions || '',
      wishesMessage: wishesMessage || '',
      songRequest: songRequest || ''
    });

    res.status(201).json({
      success: true,
      message: status === 'attending'
        ? `Thank you, ${guestName}! Your RSVP has been confirmed. We can't wait to celebrate with you!`
        : `Thank you, ${guestName}. Your response has been received.`,
      rsvp
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all RSVPs for an invitation with detailed analytics (Host)
// @route   GET /api/rsvps/event/:invitationId
// @access  Private
exports.getInvitationRsvps = async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.invitationId);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (invitation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view RSVPs for this event'
      });
    }

    const rsvps = await Rsvp.find({ invitation: invitation._id }).sort({ createdAt: -1 });

    // Analytics breakdown
    const attendingList = rsvps.filter(r => r.status === 'attending');
    const declinedList = rsvps.filter(r => r.status === 'declined');
    const maybeList = rsvps.filter(r => r.status === 'maybe');

    const totalHeadcount = attendingList.reduce(
      (sum, r) => sum + 1 + (r.plusOnes || 0),
      0
    );

    const totalPlusOnes = attendingList.reduce(
      (sum, r) => sum + (r.plusOnes || 0),
      0
    );

    // Dietary restrictions summary
    const dietarySummary = {};
    attendingList.forEach(r => {
      if (r.dietaryRestrictions && r.dietaryRestrictions.trim() !== '') {
        const diet = r.dietaryRestrictions.trim();
        dietarySummary[diet] = (dietarySummary[diet] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      analytics: {
        totalResponses: rsvps.length,
        attendingCount: attendingList.length,
        declinedCount: declinedList.length,
        maybeCount: maybeList.length,
        totalHeadcount,
        totalPlusOnes,
        dietarySummary
      },
      invitation: {
        id: invitation._id,
        title: invitation.title,
        ceremonyType: invitation.ceremonyType,
        eventDate: invitation.eventDate,
        slug: invitation.slug
      },
      rsvps
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export RSVPs to CSV (Host)
// @route   GET /api/rsvps/event/:invitationId/export
// @access  Private
exports.exportRsvpsCsv = async (req, res, next) => {
  try {
    const invitation = await Invitation.findById(req.params.invitationId);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (invitation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to export this data'
      });
    }

    const rsvps = await Rsvp.find({ invitation: invitation._id }).sort({ createdAt: -1 });

    const fields = [
      { label: 'Guest Name', value: 'guestName' },
      { label: 'Status', value: 'status' },
      { label: 'Plus Ones', value: 'plusOnes' },
      { label: 'Plus One Names', value: (row) => (row.plusOneNames || []).join(', ') },
      { label: 'Total Party Size', value: (row) => row.status === 'attending' ? (1 + (row.plusOnes || 0)) : 0 },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Dietary Restrictions', value: 'dietaryRestrictions' },
      { label: 'Song Request', value: 'songRequest' },
      { label: 'Wishes Message', value: 'wishesMessage' },
      { label: 'Submitted Date', value: (row) => new Date(row.createdAt).toLocaleString() }
    ];

    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(rsvps);

    const filename = `guests-${invitation.slug || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete single RSVP (Host)
// @route   DELETE /api/rsvps/:id
// @access  Private
exports.deleteRsvp = async (req, res, next) => {
  try {
    const rsvp = await Rsvp.findById(req.params.id);

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found'
      });
    }

    const invitation = await Invitation.findById(rsvp.invitation);
    if (!invitation || invitation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this RSVP'
      });
    }

    await rsvp.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Guest RSVP entry removed successfully'
    });
  } catch (err) {
    next(err);
  }
};
