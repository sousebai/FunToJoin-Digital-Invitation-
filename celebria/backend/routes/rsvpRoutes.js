const express = require('express');
const router = express.Router();
const {
  submitRsvp,
  getInvitationRsvps,
  exportRsvpsCsv,
  deleteRsvp
} = require('../controllers/rsvpController');
const { protect } = require('../middleware/auth');

// Public RSVP submission
router.post('/public/:slug', submitRsvp);

// Protected host RSVP management
router.use(protect);
router.get('/event/:invitationId', getInvitationRsvps);
router.get('/event/:invitationId/export', exportRsvpsCsv);
router.delete('/:id', deleteRsvp);

module.exports = router;
