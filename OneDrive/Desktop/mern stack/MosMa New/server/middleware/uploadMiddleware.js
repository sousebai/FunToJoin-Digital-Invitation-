// ─── uploadMiddleware.js ──────────────────────────────────────────────────────
// File upload middleware using Multer + Cloudinary.
// Images are stored in memory temporarily, then uploaded to Cloudinary.
// No files are stored on the server disk.
//
// Usage in a route:
//   import { uploadSingle } from '../middleware/uploadMiddleware.js';
//   router.post('/profile', protect, uploadSingle('avatar'), controller);
//
// DEPLOYMENT NOTE:
//   - memoryStorage is used so files never touch the Render.com filesystem.
//     This avoids issues with ephemeral file systems on cloud platforms.
//   - Max file size is 10MB. Larger files are rejected with a clear error message.
//   - Only image file types are accepted (jpeg, jpg, png, gif, webp).
// ─────────────────────────────────────────────────────────────────────────────

import multer from 'multer';
import cloudinary from '../config/cloudinary.js'; // ✅ Use the pre-configured instance


// Store file in memory (Buffer), not on disk
const storage = multer.memoryStorage();

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// ─── Upload to Cloudinary helper ─────────────────────────────────────────────
// Wraps cloudinary upload in a Promise so it works with async/await.
// NOTE: We re-call cloudinary.config() here (lazily) because ES module imports
// run before dotenv.config() in server.js, meaning process.env is empty at
// module load time. By the time this function is called, dotenv has loaded.
export const uploadToCloudinary = (fileBuffer, folder = 'mosma') => {
  // Re-apply config every call to guarantee credentials are present
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// ─── Multer middleware exports ────────────────────────────────────────────────
// uploadSingle('fieldName') — for single file uploads (avatar, post image)
export const uploadSingle = (fieldName) => upload.single(fieldName);

// uploadMultiple('fieldName', maxCount) — for multiple file uploads (future use)
export const uploadMultiple = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);
