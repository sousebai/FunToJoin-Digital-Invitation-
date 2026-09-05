import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateEditInvitationPage from './pages/CreateEditInvitationPage';
import PublicInvitationPage from './pages/PublicInvitationPage';
import ManageGuestListPage from './pages/ManageGuestListPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const isPublicInvite = location.pathname.startsWith('/invite/');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2A26]">
      {/* Show Navbar on main app pages */}
      {!isPublicInvite && <Navbar />}

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Host Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateEditInvitationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <CreateEditInvitationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/rsvps/:invitationId"
            element={
              <ProtectedRoute>
                <ManageGuestListPage />
              </ProtectedRoute>
            }
          />

          {/* Public Guest Invitation Page */}
          <Route path="/invite/:slug" element={<PublicInvitationPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Show Footer on main app pages */}
      {!isPublicInvite && <Footer />}
    </div>
  );
}
