// ─── api.js ──────────────────────────────────────────────────────────────────
// Axios instance configured for cross-domain API calls.
//
// DEPLOYMENT NOTES:
//   - Reads baseURL from import.meta.env.VITE_API_URL.
//   - withCredentials: true is REQUIRED for the browser to send and receive
//     secure httpOnly cookies (for JWT sessions) across different domains.
//   - Includes an interceptor to automatically catch 401 Unauthorized responses
//     and redirect the user to the login page (forces re-auth on session expiry).
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Crucial for cookie support
});

// Interceptor for responses (session validation)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns a 401 Unauthorized, clear session and redirect
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Session expired or invalid, redirecting to login...');
      // Avoid redirect loops if already on login/register pages
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
