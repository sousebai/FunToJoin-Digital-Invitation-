// ─── PostCard.jsx ─────────────────────────────────────────────────────────────
// Feed post card: avatar, image, caption, like button, comment section.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { timeAgo } from '../../utils/formatDate';
import { toggleLike, addComment } from '../../services/postService';
import toast from 'react-hot-toast';

const PostCard = ({ post, currentUserId, onPostUpdated }) => {
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [submitting, setSubmitting] = useState(false);

  const authorName = post.author?.name || 'Unknown';
  const authorAvatar = post.author?.avatar;
  const initials = authorName.charAt(0).toUpperCase();

  const handleLike = async () => {
    try {
      // Optimistic UI
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      const data = await toggleLike(post._id);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      // Revert on failure
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      toast.error('Could not update like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await addComment(post._id, commentText.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch {
      toast.error('Could not post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="post-card">
      {/* Post header */}
      <div className="post-card-header">
        <div className="post-author-avatar">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="post-author-info">
          <span className="post-author-name">{authorName}</span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {/* Post image */}
      {post.imageUrl && (
        <div className="post-image-container">
          <img src={post.imageUrl} alt="post" className="post-image" />
        </div>
      )}

      {/* Post caption */}
      {post.caption && (
        <div className="post-caption">
          <span className="post-caption-author">{authorName}</span>{' '}
          {post.caption}
        </div>
      )}

      {/* Action bar */}
      <div className="post-actions">
        <button
          className={`post-like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          title={liked ? 'Unlike' : 'Like'}
        >
          {liked ? '❤️' : '🤍'} <span>{likeCount}</span>
        </button>

        <button
          className="post-comment-btn"
          onClick={() => setShowComments((prev) => !prev)}
        >
          💬 <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="post-comments">
          {comments.length === 0 && (
            <p className="no-comments">No comments yet. Be first!</p>
          )}
          {comments.map((c, idx) => (
            <div key={c._id || idx} className="comment-item">
              <span className="comment-author">{c.user?.name || 'User'}</span>{' '}
              <span className="comment-text">{c.text}</span>
              <span className="comment-time">{timeAgo(c.createdAt)}</span>
            </div>
          ))}

          {/* Add comment */}
          <form className="comment-form" onSubmit={handleComment}>
            <input
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment…"
              maxLength={300}
            />
            <button
              type="submit"
              className="comment-submit"
              disabled={submitting || !commentText.trim()}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default PostCard;
