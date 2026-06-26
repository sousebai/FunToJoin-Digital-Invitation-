// ─── CreatePostModal.jsx ──────────────────────────────────────────────────────
// Modal to create a new post with optional image and caption.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import { createPost } from '../../services/postService';
import { validateCaption } from '../../utils/validators';
import toast from 'react-hot-toast';

const CreatePostModal = ({ onClose, onCreated }) => {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captionError, setCaptionError] = useState('');
  const fileRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !caption.trim()) {
      toast.error('Add an image or caption before posting');
      return;
    }
    const { valid, error } = validateCaption(caption);
    if (!valid) {
      setCaptionError(error);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption.trim());
      if (imageFile) formData.append('image', imageFile);
      const newPost = await createPost(formData);
      onCreated(newPost);
      toast.success('Post published! 🎉');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {/* Drop zone */}
          <div
            className={`post-drop-zone ${imagePreview ? 'has-image' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="post-drop-preview" />
            ) : (
              <div className="post-drop-placeholder">
                <span className="post-drop-icon">🖼️</span>
                <p>Drag & drop or <strong>click</strong> to upload an image</p>
                <p className="post-drop-hint">PNG, JPG, WEBP — max 5 MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />

          {/* Caption */}
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Write a caption…"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                setCaptionError('');
              }}
              maxLength={500}
              rows={3}
            />
            <div className="caption-meta">
              {captionError && <span className="form-error">{captionError}</span>}
              <span className="char-count">{caption.length}/500</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publishing…' : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
