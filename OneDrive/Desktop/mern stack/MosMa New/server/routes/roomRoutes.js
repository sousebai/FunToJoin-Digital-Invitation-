// ─── roomRoutes.js ────────────────────────────────────────────────────────────
// Chat room management API routes.
// Base path: /api/rooms
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import {
  createRoom,
  getRooms,
  getJoinedRooms,
  getRoomDetails,
  joinRoom,
  leaveRoom,
  deleteRoom,
  getOrCreateDirectMessageRoom,
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply route protection to all room endpoints
router.use(protect);

// GET /api/rooms (list all browseable public rooms)
router.get('/', getRooms);

// GET /api/rooms/joined (list rooms/DMs user has joined)
router.get('/joined', getJoinedRooms);

// POST /api/rooms (create a public/private room, support icon file upload)
router.post('/', uploadSingle('avatar'), createRoom);

// POST /api/rooms/direct (start/get direct 1-on-1 DM with user)
router.post('/direct', getOrCreateDirectMessageRoom);

// GET /api/rooms/:id (retrieve specific room details + members)
router.get('/:id', getRoomDetails);

// POST /api/rooms/:id/join (join a public room)
router.post('/:id/join', joinRoom);

// POST /api/rooms/:id/leave (leave a public/private room)
router.post('/:id/leave', leaveRoom);

// DELETE /api/rooms/:id (delete a room, admin only)
router.delete('/:id', deleteRoom);

export default router;
