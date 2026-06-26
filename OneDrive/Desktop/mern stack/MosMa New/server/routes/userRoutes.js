// ─── userRoutes.js ────────────────────────────────────────────────────────────
// User management API routes.
// Base path: /api/users
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import {
  getUsers,
  getUserProfile,
  updateProfile,
  manageFriendRequest,
  unfriendUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply route protection middleware to all user endpoints
router.use(protect);

// GET /api/users (search or list users)
router.get('/', getUsers);

// GET /api/users/profile/:id (retrieve profile of a specific user)
router.get('/profile/:id', getUserProfile);

// PUT /api/users/profile (edit profile information, support avatar file uploads)
router.put('/profile', uploadSingle('avatar'), updateProfile);

// POST /api/users/friend-request/:id (send or accept a friend request)
router.post('/friend-request/:id', manageFriendRequest);

// DELETE /api/users/friend/:id (remove a friend)
router.delete('/friend/:id', unfriendUser);

export default router;
