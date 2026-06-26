// ─── messageService.js ────────────────────────────────────────────────────────
// API calls for fetching message history (real-time sending via Socket.IO).
// ─────────────────────────────────────────────────────────────────────────────

import api from './api';

/**
 * Fetch message history for a specific room.
 * @param {string} roomId
 * @param {number} [page=1] — Pagination page number
 * @returns {Promise<{ messages: Message[], totalPages: number, currentPage: number }>}
 */
export const getRoomMessages = async (roomId, page = 1) => {
  const res = await api.get(`/api/messages/room/${roomId}?page=${page}&limit=50`);
  return res.data.data;
};

/**
 * Fetch direct messages between the current user and another user.
 * @param {string} userId
 * @param {number} [page=1]
 * @returns {Promise<{ messages: Message[], totalPages: number, currentPage: number }>}
 */
export const getDirectMessages = async (userId, page = 1) => {
  const res = await api.get(`/api/messages/dm/${userId}?page=${page}&limit=50`);
  return res.data.data;
};

/**
 * Delete a message by ID (sender or admin only).
 * @param {string} messageId
 * @returns {Promise<void>}
 */
export const deleteMessage = async (messageId) => {
  await api.delete(`/api/messages/${messageId}`);
};
