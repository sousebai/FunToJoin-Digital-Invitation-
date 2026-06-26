// ─── RegisterForm.jsx ─────────────────────────────────────────────────────────
// Premium glassmorphism registration form component with avatar image preview.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, FileText, Upload, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle avatar file selection & create local preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile image size must be under 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
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
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    // Build FormData since file upload is involved
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('bio', bio);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const result = await register(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Welcome to MosMa! Account created.');
      navigate('/feed'); // Redirect on success
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join MosMa to chat, share posts, and connect instantly</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Avatar Upload (Interactive Circular Area) */}
        <div className="avatar-upload-section">
          <div className="avatar-preview-container" onClick={triggerFileSelect}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar Preview" className="avatar-img-preview" />
            ) : (
              <div className="avatar-placeholder">
                <Upload size={24} className="upload-icon" />
              </div>
            )}
            <div className="avatar-overlay">
              <span className="overlay-text">Upload</span>
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
            Set Profile Photo (Optional)
          </span>
        </div>

        {/* Name Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name *</label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address *</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password (min 6 chars) *</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Bio Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="bio">Bio / Status (Optional)</label>
          <div className="input-wrapper">
            <FileText className="input-icon" size={18} />
            <input
              id="bio"
              type="text"
              placeholder="Tell us about yourself..."
              className="form-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="spinner" size={18} />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Get Started</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
