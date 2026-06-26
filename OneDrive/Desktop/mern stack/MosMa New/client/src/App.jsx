// ─── App.jsx ──────────────────────────────────────────────────────────────────
// React Application Router — MosMa Social Media App
// All 6 steps implemented. Placeholders replaced with real pages.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

// ── Pages ────────────────────────────────────────────────────────────────────
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage     from './pages/FeedPage';
import ChatPage     from './pages/ChatPage';
import RoomsPage    from './pages/RoomsPage';
import ProfilePage  from './pages/ProfilePage';

// ── Route guard ──────────────────────────────────────────────────────────────
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            {/* ── Global Toast Notifications ───────────────────────────────── */}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: 'var(--bg-secondary)' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: 'var(--bg-secondary)' },
                },
              }}
            />

            <Routes>
              {/* ── Public Routes ───────────────────────────────────────── */}
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ── Protected Routes (requires JWT auth cookie) ────────────── */}
              <Route element={<PrivateRoute />}>
                {/* Home / Feed */}
                <Route path="/feed"           element={<FeedPage />} />

                {/* Chat rooms (Step 4) */}
                <Route path="/chat"           element={<ChatPage />} />

                {/* Browse / create rooms (Step 3) */}
                <Route path="/rooms"          element={<RoomsPage />} />

                {/* Own profile */}
                <Route path="/profile"        element={<ProfilePage />} />

                {/* Another user's profile */}
                <Route path="/profile/:id"    element={<ProfilePage />} />

                {/* Default: redirect / to feed */}
                <Route path="/"               element={<Navigate to="/feed" replace />} />
              </Route>

              {/* ── Catch-all ──────────────────────────────────────────── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
