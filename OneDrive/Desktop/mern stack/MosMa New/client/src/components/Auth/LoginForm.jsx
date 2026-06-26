// ─── LoginForm.jsx ────────────────────────────────────────────────────────────
// Premium glassmorphism login form component.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Welcome back to MosMa!');
      navigate('/feed'); // Redirect to feed page on login
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Connect with friends, start chat rooms, and share posts</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Email Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
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
          <div className="label-row">
            <label className="form-label" htmlFor="password">Password</label>
          </div>
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

        {/* Remember Me */}
        <div className="auth-options">
          <label className="checkbox-label">
            <input type="checkbox" className="auth-checkbox" />
            <span className="checkbox-text">Keep me logged in</span>
          </label>
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
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          New to MosMa?{' '}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
