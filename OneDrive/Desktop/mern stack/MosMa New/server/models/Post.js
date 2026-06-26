// ─── Post.js ──────────────────────────────────────────────────────────────────
// Social media post model (Instagram/Facebook-style feed).
// Users can create posts with an optional image and caption.
// Other users can like and comment on posts.
//
// IMPORTANT:
//   - image stores a Cloudinary URL string.
//   - likes is an array of User IDs (toggle: add if not present, remove if present).
//   - comments are embedded subdocuments (not a separate collection) for simplicity.
//   - If comments grow very large (1000+), consider extracting to a Comment model.
//   - isDeleted enables soft deletion — filter out in all feed queries.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      default: '', // Cloudinary URL — posts can be text-only (no image required)
    },
    caption: {
      type: String,
      default: '',
      maxlength: [2200, 'Caption cannot exceed 2200 characters'],
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for feed queries — get posts by author, sorted by newest
postSchema.index({ author: 1, createdAt: -1 });
// Index for general feed — newest posts first
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;
