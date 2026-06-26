// ─── postRoutes.js ────────────────────────────────────────────────────────────
// Post API routes. Mounted at /api/posts in server.js.
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import {
  getFeed,
  getAllPosts,
  getUserPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All post routes require authentication
router.use(protect);

// ─── Feed & Explore ──────────────────────────────────────────────────────────
// GET /api/posts/feed   — posts from followed users + own
router.get('/feed', getFeed);

// GET /api/posts        — all posts (explore page)
router.get('/', getAllPosts);

// ─── User Posts ───────────────────────────────────────────────────────────────
// GET /api/posts/user/:userId
router.get('/user/:userId', getUserPosts);

// ─── Create ───────────────────────────────────────────────────────────────────
// POST /api/posts       — create a new post (optional image upload)
router.post('/', uploadSingle('image'), createPost);

// ─── Like / Comment / Delete ─────────────────────────────────────────────────
// POST   /api/posts/:postId/like
router.post('/:postId/like', toggleLike);

// POST   /api/posts/:postId/comment
router.post('/:postId/comment', addComment);

// DELETE /api/posts/:postId
router.delete('/:postId', deletePost);

export default router;
