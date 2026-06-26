// ─── postController.js ────────────────────────────────────────────────────────
// NOTE: User model uses 'friends' (not 'following') and 'name' (not 'username').
// Handles all post-related operations: create, read, like, comment, delete.
// Routes are mounted at /api/posts in server.js.
// ─────────────────────────────────────────────────────────────────────────────

import Post from '../models/Post.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// ─── GET /api/posts/feed ─────────────────────────────────────────────────────
// Returns paginated posts from users the current user follows + their own posts.
export const getFeed = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    // Get the IDs of friends (the 'friends' field is this app's follow system)
    const currentUser = await User.findById(req.user._id).select('friends');
    const authorIds   = [req.user._id, ...(currentUser.friends || [])];

    const [posts, total] = await Promise.all([
      Post.find({ author: { $in: authorIds }, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .populate('comments.user', 'name avatar')
        .lean(),
      Post.countDocuments({ author: { $in: authorIds }, isDeleted: false }),
    ]);

    return successResponse(res, {
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error(`❌ getFeed error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching feed', 500);
  }
};

// ─── GET /api/posts ───────────────────────────────────────────────────────────
// Returns all public posts for the Explore page (newest first).
export const getAllPosts = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 12);
    const skip  = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name avatar')
        .populate('comments.user', 'name avatar')
        .lean(),
      Post.countDocuments({ isDeleted: false }),
    ]);

    return successResponse(res, {
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error(`❌ getAllPosts error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching posts', 500);
  }
};

// ─── GET /api/posts/user/:userId ──────────────────────────────────────────────
// Returns all non-deleted posts by a specific user (for profile page).
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar')
      .lean();

    return successResponse(res, posts);
  } catch (error) {
    console.error(`❌ getUserPosts error: ${error.message}`);
    return errorResponse(res, 'Server Error fetching user posts', 500);
  }
};

// ─── POST /api/posts ──────────────────────────────────────────────────────────
// Create a new post. Accepts multipart/form-data with 'caption' and optional 'image'.
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption && !req.file) {
      return errorResponse(res, 'Caption or image is required', 400);
    }

    let imageUrl = '';
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'mosmagram/posts');
        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error(`❌ Cloudinary post image upload failed: ${uploadErr.message}`);
        return errorResponse(res, 'Failed to upload image. Please try again.', 500);
      }
    }

    const post = await Post.create({
      author: req.user._id,
      caption: caption?.trim() || '',
      image: imageUrl,
    });

    // Return populated post so the frontend can render immediately
    const populated = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .lean();

    return successResponse(res, populated, 'Post created successfully', 201);
  } catch (error) {
    console.error(`❌ createPost error: ${error.message}`);
    return errorResponse(res, 'Server Error creating post', 500);
  }
};

// ─── POST /api/posts/:postId/like ─────────────────────────────────────────────
// Toggle like/unlike a post. Returns the new liked state and like count.
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      isDeleted: false,
    });

    if (!post) {
      return errorResponse(res, 'Post not found', 404);
    }

    const userId  = req.user._id.toString();
    const likeIdx = post.likes.findIndex((id) => id.toString() === userId);
    const liked   = likeIdx === -1; // Will be true after the toggle

    if (liked) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likeIdx, 1);
    }

    await post.save();

    return successResponse(res, { liked, likeCount: post.likes.length });
  } catch (error) {
    console.error(`❌ toggleLike error: ${error.message}`);
    return errorResponse(res, 'Server Error toggling like', 500);
  }
};

// ─── POST /api/posts/:postId/comment ──────────────────────────────────────────
// Add a comment to a post. Returns the newly created comment object.
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return errorResponse(res, 'Comment text is required', 400);
    }

    const post = await Post.findOne({
      _id: req.params.postId,
      isDeleted: false,
    });

    if (!post) {
      return errorResponse(res, 'Post not found', 404);
    }

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    // Re-populate to get the new comment with user details
    await post.populate('comments.user', 'username name avatar');

    const newComment = post.comments[post.comments.length - 1];

    return successResponse(res, newComment, 'Comment added', 201);
  } catch (error) {
    console.error(`❌ addComment error: ${error.message}`);
    return errorResponse(res, 'Server Error adding comment', 500);
  }
};

// ─── DELETE /api/posts/:postId ────────────────────────────────────────────────
// Soft-delete a post. Only the post's author can delete it.
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      isDeleted: false,
    });

    if (!post) {
      return errorResponse(res, 'Post not found', 404);
    }

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorised to delete this post', 403);
    }

    post.isDeleted = true;
    await post.save();

    return successResponse(res, null, 'Post deleted successfully');
  } catch (error) {
    console.error(`❌ deletePost error: ${error.message}`);
    return errorResponse(res, 'Server Error deleting post', 500);
  }
};
