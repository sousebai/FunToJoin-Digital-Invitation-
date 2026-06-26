// ─── userService.js ───────────────────────────────────────────────────────────
// API calls for user profile and discovery.
// ─────────────────────────────────────────────────────────────────────────────

import api from './api';

/**
 * Get the authenticated user's own profile.
 * @returns {Promise<User>}
 */
export const getMyProfile = async () => {
  const res = await api.get('/api/users/profile');
  return res.data.data;
};

/**
 * Get a user's public profile by their ID.
 * @param {string} userId
 * @returns {Promise<User>}
 */
export const getUserById = async (userId) => {
  const res = await api.get(`/api/users/${userId}`);
  return res.data.data;
};

/**
 * Update the authenticated user's profile.
 * @param {FormData|Object} payload — Use FormData when uploading an avatar
 * @returns {Promise<User>}
 */
export const updateProfile = async (payload) => {
  const isFormData = payload instanceof FormData;
  const res = await api.put('/api/users/profile', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data.data;
};

/**
 * Follow a user.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const followUser = async (userId) => {
  await api.post(`/api/users/${userId}/follow`);
};

/**
 * Unfollow a user.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const unfollowUser = async (userId) => {
  await api.post(`/api/users/${userId}/unfollow`);
};

/**
 * Search users by name or username.
 * @param {string} query
 * @returns {Promise<User[]>}
 */
export const searchUsers = async (query) => {
  const res = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
  return res.data.data;
};

/**
 * Get online users (for sidebar presence indicators).
 * @returns {Promise<string[]>} Array of online user IDs
 */
export const getOnlineUsers = async () => {
  const res = await api.get('/api/users/online');
  return res.data.data;
};
