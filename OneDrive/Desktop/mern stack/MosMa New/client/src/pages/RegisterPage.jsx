// ─── RegisterPage.jsx ─────────────────────────────────────────────────────────
// Page container for register, styled with vibrant ambient gradients.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="auth-page-container">
      {/* Decorative background glow elements */}
      <div className="glow-circle glow-circle-purple"></div>
      <div className="glow-circle glow-circle-blue"></div>

      <div className="auth-branding">
        <h1 className="branding-logo">MosMa</h1>
        <p className="branding-tagline">
          Connect, chat, and share with your circles in real-time.
        </p>
      </div>

      <div className="auth-card-wrapper">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
