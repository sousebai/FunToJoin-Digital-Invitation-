const express = require('express');
const router = express.Router();
const {
  createInvitation,
  getUserInvitations,
  getInvitationById,
  getPublicInvitation,
  updateInvitation,
  deleteInvitation
} = require('../controllers/invitationController');
const { protect } = require('../middleware/auth');

// Public route for viewing invitation
router.get('/public/:slug', getPublicInvitation);

// Protected host routes
router.use(protect);
router.route('/')
  .get(getUserInvitations)
  .post(createInvitation);

router.route('/:id')
  .get(getInvitationById)
  .put(updateInvitation)
  .delete(deleteInvitation);

module.exports = router;
