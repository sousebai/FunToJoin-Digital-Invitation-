// ─── generateToken.js ─────────────────────────────────────────────────────────
// Creates a JWT and sends it as a secure httpOnly cookie.
//
// WHY httpOnly cookies instead of localStorage?
//   - localStorage is accessible by JavaScript → vulnerable to XSS attacks.
//   - httpOnly cookies cannot be read by JavaScript → XSS-proof.
//
// DEPLOYMENT NOTE — Cross-domain cookie requirements (Vercel ↔ Render):
//   - secure: true    → Cookie only sent over HTTPS (required in production)
//   - sameSite: 'None' → Required for cross-domain cookies (different origins)
//   - In development, sameSite: 'Lax' and secure: false are used instead
//     because localhost uses HTTP and same-domain.
//   - The frontend MUST use axios with { withCredentials: true } on every request.
//
// This function is called in authController.js after successful register/login.
// ─────────────────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Sign the JWT with user ID and secret
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  // Send token as httpOnly cookie — cannot be accessed by client-side JavaScript
  res.cookie('mosma_token', token, {
    httpOnly: true,
    secure: isProduction,                          // HTTPS only in production
    sameSite: isProduction ? 'None' : 'Lax',      // Cross-domain in prod, same-domain in dev
    maxAge: 7 * 24 * 60 * 60 * 1000,              // 7 days in milliseconds
    path: '/',                                     // Cookie accessible on all routes
  });

  return token; // Also returned so it can be used if needed
};

export default generateToken;
