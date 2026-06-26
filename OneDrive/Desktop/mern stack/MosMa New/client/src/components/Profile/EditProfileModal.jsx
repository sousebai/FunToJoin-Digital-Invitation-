// ─── EditProfileModal.jsx ─────────────────────────────────────────────────────
// Modal to edit name, bio, and avatar photo.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import { updateProfile } from '../../services/userService';
import { validateName } from '../../utils/validators';
import toast from 'react-hot-toast';

const EditProfileModal = ({ user, onClose, onUpdated }) => {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const fileRef = useRef(null);

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Avatar must be under 3 MB');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, error } = validateName(name);
    if (!valid) {
      setNameError(error);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('bio', bio.trim());
      if (avatarFile) formData.append('avatar', avatarFile);
      const updatedUser = await updateProfile(formData);
      onUpdated(updatedUser);
      toast.success('Profile updated!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Avatar picker */}
          <div className="avatar-picker">
            <div
              className="avatar-preview-large"
              onClick={() => fileRef.current?.click()}
              title="Change photo"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" />
              ) : (
                <span>{name.charAt(0).toUpperCase()}</span>
              )}
              <div className="avatar-overlay">📷</div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarSelect}
            />
            <p className="avatar-hint">Click to change photo</p>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              className={`form-input ${nameError ? 'input-error' : ''}`}
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              maxLength={30}
              placeholder="Your name"
            />
            {nameError && <p className="form-error">{nameError}</p>}
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={3}
              placeholder="Tell people about yourself…"
            />
            <span className="char-count">{bio.length}/150</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
