const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    invitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invitation',
      required: true,
      index: true
    },
    guestName: {
      type: String,
      required: [true, 'Please enter your full name'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['attending', 'declined', 'maybe'],
      required: [true, 'Please select your attendance status'],
      default: 'attending'
    },
    plusOnes: {
      type: Number,
      default: 0,
      min: [0, 'Plus-ones cannot be negative']
    },
    plusOneNames: {
      type: [String],
      default: []
    },
    dietaryRestrictions: {
      type: String,
      default: ''
    },
    wishesMessage: {
      type: String,
      default: '',
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    songRequest: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Virtual for total party size
rsvpSchema.virtual('totalPartySize').get(function () {
  if (this.status !== 'attending') return 0;
  return 1 + (this.plusOnes || 0);
});

module.exports = mongoose.model('Rsvp', rsvpSchema);
