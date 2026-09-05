const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema({
  time: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'clock' }
}, { _id: false });

const registryLinkSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const invitationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    ceremonyType: {
      type: String,
      enum: ['wedding', 'graduation', 'gender_reveal', 'birthday', 'baby_shower', 'anniversary', 'party', 'other'],
      default: 'wedding'
    },
    hostNames: {
      type: String,
      required: [true, 'Please provide the host or couple name(s)'],
      trim: true
    },
    eventDate: {
      type: Date,
      required: [true, 'Please provide the event date']
    },
    eventTime: {
      type: String,
      default: '18:00'
    },
    timezone: {
      type: String,
      default: 'CET'
    },
    venueName: {
      type: String,
      required: [true, 'Please provide the venue name'],
      trim: true
    },
    venueAddress: {
      type: String,
      required: [true, 'Please provide the venue address'],
      trim: true
    },
    mapUrl: {
      type: String,
      default: ''
    },
    dressCode: {
      type: String,
      default: 'Cocktail & Festive'
    },
    dressCodeColors: {
      type: [String],
      default: ['#D4AF37', '#2C3E50', '#EAECEE', '#E67E22']
    },
    story: {
      type: String,
      default: 'We warmly invite you to share this unforgettable milestone with us.'
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    },
    theme: {
      id: { type: String, default: 'rose-gold' },
      primaryColor: { type: String, default: '#C59B27' },
      accentColor: { type: String, default: '#8E2800' },
      bgColor: { type: String, default: '#0F172A' },
      textColor: { type: String, default: '#F8FAFC' },
      fontFamily: { type: String, default: 'playfair' },
      envelopeColor: { type: String, default: '#1E293B' },
      musicUrl: { type: String, default: '' },
      musicTitle: { type: String, default: '' }
    },
    schedule: {
      type: [scheduleItemSchema],
      default: []
    },
    registryInfo: {
      title: { type: String, default: 'Wishing Well & Registry' },
      description: { type: String, default: 'Your presence is our greatest gift. However, if you wish to honor us with a gift, details are below.' },
      wishingWellNote: { type: String, default: '' },
      bankDetails: { type: String, default: '' },
      links: [registryLinkSchema]
    },
    settings: {
      allowPlusOnes: { type: Boolean, default: true },
      maxPlusOnes: { type: Number, default: 2 },
      showWishesWall: { type: Boolean, default: true },
      rsvpDeadline: { type: Date },
      contactEmail: { type: String, default: '' },
      contactPhone: { type: String, default: '' }
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published'
    },
    viewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Virtual for formatted date
invitationSchema.virtual('formattedDate').get(function () {
  if (!this.eventDate) return '';
  return this.eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('Invitation', invitationSchema);
