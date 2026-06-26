// ─── postService.js ───────────────────────────────────────────────────────────
// API calls for Feed posts (create, like, comment, fetch).
// ─────────────────────────────────────────────────────────────────────────────

import api from './api';

/**
 * Fetch the authenticated user's feed (posts from followed users + own).
 * @param {number} [page=1]
 * @returns {Promise<{ posts: Post[], totalPages: number, currentPage: number }>}
 */
export const getFeed = async (page = 1) => {
  const res = await api.get(`/api/posts/feed?page=${page}&limit=10`);
  return res.data.data;
};

/**
 * Fetch all posts (explore page).
 * @param {number} [page=1]
 * @returns {Promise<{ posts: Post[], totalPages: number }>}
 */
export const getAllPosts = async (page = 1) => {
  const res = await api.get(`/api/posts?page=${page}&limit=12`);
  return res.data.data;
};

/**
 * Fetch posts from a specific user.
 * @param {string} userId
 * @returns {Promise<Post[]>}
 */
export const getUserPosts = async (userId) => {
  const res = await api.get(`/api/posts/user/${userId}`);
  return res.data.data;
};

/**
 * Create a new post (with optional image upload).
 * @param {FormData} formData — Must include 'caption' and optionally 'image'
 * @returns {Promise<Post>}
 */
export const createPost = async (formData) => {
  const res = await api.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

/**
 * Like or unlike a post (toggle).
 * @param {string} postId
 * @returns {Promise<{ liked: boolean, likeCount: number }>}
 */
export const toggleLike = async (postId) => {
  const res = await api.post(`/api/posts/${postId}/like`);
  return res.data.data;
};

/**
 * Add a comment to a post.
 * @param {string} postId
 * @param {string} text
 * @returns {Promise<Comment>}
 */
export const addComment = async (postId, text) => {
  const res = await api.post(`/api/posts/${postId}/comment`, { text });
  return res.data.data;
};

/**
 * Delete a post.
 * @param {string} postId
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  await api.delete(`/api/posts/${postId}`);
};
