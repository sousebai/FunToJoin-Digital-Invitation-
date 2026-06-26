// ─── roomService.js ───────────────────────────────────────────────────────────
// API calls for Chat Room CRUD operations.
// ─────────────────────────────────────────────────────────────────────────────

import api from './api';

/**
 * Fetch all public chat rooms.
 * @returns {Promise<Room[]>}
 */
export const getAllRooms = async () => {
  const res = await api.get('/api/rooms');
  return res.data.data;
};

/**
 * Fetch rooms the authenticated user has joined.
 * @returns {Promise<Room[]>}
 */
export const getMyRooms = async () => {
  const res = await api.get('/api/rooms/joined'); // ✅ correct path
  return res.data.data;
};

/**
 * Create a new chat room.
 * @param {{ name: string, description: string, isPrivate: boolean, password?: string }} payload
 * @returns {Promise<Room>}
 */
export const createRoom = async (payload) => {
  const res = await api.post('/api/rooms', payload);
  return res.data.data;
};

/**
 * Join a public or private room.
 * @param {string} roomId
 * @param {string} [password] — Required only for private rooms
 * @returns {Promise<Room>}
 */
export const joinRoom = async (roomId, password) => {
  const res = await api.post(`/api/rooms/${roomId}/join`, { password });
  return res.data.data;
};

/**
 * Leave a room.
 * @param {string} roomId
 * @returns {Promise<void>}
 */
export const leaveRoom = async (roomId) => {
  await api.post(`/api/rooms/${roomId}/leave`);
};

/**
 * Fetch details for a single room.
 * @param {string} roomId
 * @returns {Promise<Room>}
 */
export const getRoomById = async (roomId) => {
  const res = await api.get(`/api/rooms/${roomId}`);
  return res.data.data;
};
