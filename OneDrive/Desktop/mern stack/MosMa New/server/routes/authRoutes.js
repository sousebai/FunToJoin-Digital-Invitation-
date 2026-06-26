// ─── authRoutes.js ────────────────────────────────────────────────────────────
// Auth API routes configuration.
// Base path: /api/auth
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────────────────
// POST /api/auth/register (supports optional file upload for profile avatar)
router.post('/register', uploadSingle('avatar'), registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// ─── Protected Routes (Session Required) ──────────────────────────────────────
// POST /api/auth/logout (clears cookie, updates status to offline)
// Note: logout is intentionally NOT protected — anyone can clear their cookie.
// The logoutUser controller checks req.user internally (set by protect if valid).
router.post('/logout', logoutUser);

// GET /api/auth/me (returns current user profile)
router.get('/me', protect, getMe);

export default router;
