// ─── apiResponse.js ───────────────────────────────────────────────────────────
// Standardized API response helpers.
//
// WHY use these helpers?
//   Every API response has the exact same shape: { success, message, data }.
//   This prevents the frontend from breaking due to inconsistent response formats.
//   ALL controllers MUST use these functions — never call res.json() directly.
//
// Response shape:
//   Success: { success: true,  message: "...", data: { ... } }
//   Error:   { success: false, message: "..." }
//
// Usage in a controller:
//   import { successResponse, errorResponse } from '../utils/apiResponse.js';
//   successResponse(res, user, 'User created', 201);
//   errorResponse(res, 'Email already exists', 400);
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send a success response.
 * @param {object} res      - Express response object
 * @param {any}    data     - Data payload to return (object, array, etc.)
 * @param {string} message  - Human-readable success message
 * @param {number} status   - HTTP status code (default: 200)
 */
export const successResponse = (res, data = null, message = 'Success', status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response.
 * @param {object} res      - Express response object
 * @param {string} message  - Human-readable error message
 * @param {number} status   - HTTP status code (default: 500)
 */
export const errorResponse = (res, message = 'Internal Server Error', status = 500) => {
  res.status(status).json({
    success: false,
    message,
  });
};
