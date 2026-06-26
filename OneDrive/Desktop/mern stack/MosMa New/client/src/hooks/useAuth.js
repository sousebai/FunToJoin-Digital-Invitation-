// ─── useAuth.js ───────────────────────────────────────────────────────────────
// Custom hook that wraps AuthContext for clean component-level access.
// ─────────────────────────────────────────────────────────────────────────────

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — Access current user, auth state, login/logout/register helpers.
 * Usage:  const { user, isAuthenticated, login, logout } = useAuth();
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
};

export default useAuth;
