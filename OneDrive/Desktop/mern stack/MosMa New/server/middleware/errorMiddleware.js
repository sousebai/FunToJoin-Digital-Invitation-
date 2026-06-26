// ─── errorMiddleware.js ───────────────────────────────────────────────────────
// Global Express error handling middleware.
// Must be registered LAST in server.js (after all routes).
//
// notFound — catches any request to an unregistered route and creates a 404 error.
// errorHandler — handles ALL errors thrown anywhere in the app.
//
// DEPLOYMENT NOTE:
//   - In production (NODE_ENV=production), stack traces are hidden from the response.
//     This prevents leaking internal server file paths to attackers.
//   - In development, stack traces ARE shown to help with debugging.
// ─────────────────────────────────────────────────────────────────────────────

// Catches requests to routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass to errorHandler below
};

// Handles all errors passed via next(error) or thrown in async controllers
export const errorHandler = (err, req, res, next) => {
  // If status is still 200 (default), something went wrong — use 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack trace in development — never in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
