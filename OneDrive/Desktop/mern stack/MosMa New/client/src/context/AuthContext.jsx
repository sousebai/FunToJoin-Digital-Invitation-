// ─── AuthContext.jsx ─────────────────────────────────────────────────────────
// Global authentication state provider.
//
// HOW IT WORKS:
//   - On initialization, checks session by hitting GET /api/auth/me.
//   - Stores 'user' profile details globally.
//   - Exposes login, register, and logout handlers.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/api/auth/me');
        if (response.data && response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.log('ℹ️ No active session found.');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data && response.data.success) {
        setUser(response.data.data);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Server error during login';
      return { success: false, message: msg };
    }
  };

  // Register handler (takes FormData for avatar uploads)
  const register = async (formData) => {
    try {
      const response = await api.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.success) {
        setUser(response.data.data);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Server error during registration';
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout request error:', error);
    } finally {
      setUser(null);
    }
  };

  // Update user profile cache
  const updateProfileCache = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfileCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
