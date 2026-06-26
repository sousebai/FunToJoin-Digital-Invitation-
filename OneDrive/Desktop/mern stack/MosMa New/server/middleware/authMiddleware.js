// ─── authMiddleware.js ────────────────────────────────────────────────────────
// Protects backend routes by verifying the httpOnly JWT cookie.
//
// HOW IT WORKS:
//   1. Reads cookie named 'mosma_token' (via cookie-parser).
//   2. Decodes the token using JWT_SECRET.
//   3. Fetches the corresponding user from the database, excluding the password.
//   4. Appends the User object to the request context (req.user = user).
//   5. Passes execution to the next controller or middleware.
//
// RETURNS:
//   401 Unauthorized if the cookie is missing, expired, or invalid.
// ─────────────────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  // Read the token from the httpOnly cookies
  if (req.cookies && req.cookies.mosma_token) {
    token = req.cookies.mosma_token;
  }

  // Fallback: Check Authorization header (useful for mobile apps or tests)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If token is missing, reject request immediately
  if (!token) {
    return errorResponse(res, 'Not authorized, login required', 401);
  }

  try {
    // Decode the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details, excluding the password
    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return errorResponse(res, 'User session invalid, please login again', 401);
    }

    // Process is authorized, proceed to the next handler
    next();
  } catch (error) {
    console.error(`❌ Token verification failed: ${error.message}`);
    return errorResponse(res, 'Session expired or token invalid, please login again', 401);
  }
};
