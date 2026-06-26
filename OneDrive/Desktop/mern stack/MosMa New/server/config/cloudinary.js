// ─── cloudinary.js ────────────────────────────────────────────────────────────
// Cloudinary configuration for image uploads (avatars, post images, room icons).
//
// DEPLOYMENT NOTE:
//   - Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
//     in server/.env (local) or Render.com Environment Variables (production).
//   - All 3 values are required. Missing any one will cause upload failures.
//   - Get values from: https://cloudinary.com → Dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
