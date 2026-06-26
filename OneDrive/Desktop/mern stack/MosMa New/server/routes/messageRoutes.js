// ─── messageRoutes.js ─────────────────────────────────────────────────────────
// Message API routes configuration.
// Base path: /api/messages
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import {
  sendMessage,
  getRoomMessages,
  markMessageAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply route protection to all message endpoints
router.use(protect);

// GET /api/messages/room/:roomId (retrieve room historical messages)
router.get('/room/:roomId', getRoomMessages);

// POST /api/messages (send a message, supports optional image upload)
router.post('/', uploadSingle('image'), sendMessage);

// PUT /api/messages/:id/read (mark a message as read)
router.put('/:id/read', markMessageAsRead);

export default router;
