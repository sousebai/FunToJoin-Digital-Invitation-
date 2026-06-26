// ─── PrivateRoute.jsx ─────────────────────────────────────────────────────────
// Route protection component for React Router.
//
// HOW IT WORKS:
//   - If auth context is loading (restoring session), shows page-level loading state.
//   - If the user is authenticated, renders the children components.
//   - If the user is not authenticated, redirects to the /login page.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader-container">
        <Loader2 className="spinner page-loader-spinner" size={48} />
        <p className="page-loader-text">Loading MosMa...</p>
      </div>
    );
  }

  // Redirect to login if user session is not found
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
