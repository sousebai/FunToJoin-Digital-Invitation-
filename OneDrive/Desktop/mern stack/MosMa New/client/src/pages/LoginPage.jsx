// ─── LoginPage.jsx ────────────────────────────────────────────────────────────
// Page container for login, styled with vibrant ambient gradients.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="auth-page-container">
      {/* Decorative background glow elements */}
      <div className="glow-circle glow-circle-purple"></div>
      <div className="glow-circle glow-circle-blue"></div>

      <div className="auth-branding">
        <h1 className="branding-logo">MosMa</h1>
        <p className="branding-tagline">
          The next-generation MERN social chat application.
        </p>
      </div>

      <div className="auth-card-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
