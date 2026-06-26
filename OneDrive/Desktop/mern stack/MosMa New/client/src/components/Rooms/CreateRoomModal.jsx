// ─── CreateRoomModal.jsx ──────────────────────────────────────────────────────
// Glassmorphic Modal to create new public or private chat channels.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import { X, Hash, Upload, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CreateRoomModal = ({ isOpen, onClose, onCreated }) => {
  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('public');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file must be under 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Please enter a room name');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', type);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await api.post('/api/rooms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        toast.success(`Channel #${name} created!`);
        if (onCreated) onCreated(response.data.data);
        onClose();
        // Reset states
        setName('');
        setDescription('');
        setType('public');
        setAvatarFile(null);
        setAvatarPreview('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error creating room';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">Create a Channel</h3>
          <button onClick={onClose} className="modal-close-btn" disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Avatar Upload (Room Icon) */}
          <div className="avatar-upload-section">
            <div className="avatar-preview-container" onClick={triggerFileSelect}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Room Icon Preview" className="avatar-img-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <Upload size={20} />
                </div>
              )}
              <div className="avatar-overlay">
                <span className="overlay-text">Icon</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden-file-input"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isSubmitting}
            />
            <span className="avatar-label" onClick={triggerFileSelect}>
              Set Channel Icon (Optional)
            </span>
          </div>

          {/* Room Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="room-name">Channel Name *</label>
            <div className="input-wrapper">
              <Hash className="input-icon" size={18} />
              <input
                id="room-name"
                type="text"
                placeholder="e.g. general-chat"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Room Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="room-desc">Description</label>
            <textarea
              id="room-desc"
              placeholder="What is this channel about?"
              className="form-input form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Room Type Selection */}
          <div className="form-group">
            <label className="form-label" htmlFor="room-type">Channel Type</label>
            <select
              id="room-type"
              className="form-input form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="public">Public (Anyone can browse and join)</option>
              <option value="private">Private (Invite only, hidden from discovery)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="spinner" size={16} />
                  <span>Creating...</span>
                </>
              ) : (
                'Create Channel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
