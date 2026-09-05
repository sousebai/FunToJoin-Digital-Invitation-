import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, PlusCircle, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-stone-200/70 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-champagne-500 via-champagne-400 to-amber-200 flex items-center justify-center shadow-md shadow-champagne-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-stone-900 fill-stone-900" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                Celebria <span className="text-champagne-700 text-[10px] tracking-widest uppercase font-sans font-bold px-2 py-0.5 rounded-full bg-champagne-100 border border-champagne-300/60">Atelier</span>
              </span>
              <p className="text-[10px] text-stone-500 tracking-wider uppercase font-medium">Fine Digital Invitations</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#ceremonies" className="text-sm font-medium text-stone-600 hover:text-champagne-700 transition-colors">
              Ceremonies
            </Link>
            <Link to="/#features" className="text-sm font-medium text-stone-600 hover:text-champagne-700 transition-colors">
              Features
            </Link>
            <Link to="/invite/sophia-alexandre-wedding" className="text-sm font-medium text-champagne-800 hover:text-champagne-900 flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100/80 border border-champagne-300/60 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
              Live Demo
            </Link>
          </div>

          {/* User CTA / Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 px-3.5 py-2 rounded-xl hover:bg-stone-100/80 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-champagne-600" />
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className="flex items-center gap-2 text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-champagne-400" />
                  Create Ceremony
                </Link>
                <div className="flex items-center pl-3 border-l border-stone-200 space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 border border-champagne-300 flex items-center justify-center text-champagne-800 font-semibold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-stone-700 font-medium max-w-[120px] truncate">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-700 hover:text-stone-900 px-4 py-2 rounded-xl hover:bg-stone-100/80 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-stone-200 px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/#ceremonies"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 hover:text-champagne-700 py-1.5 font-medium"
          >
            Ceremonies
          </Link>
          <Link
            to="/invite/sophia-alexandre-wedding"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-champagne-800 font-medium py-1.5"
          >
            Live Wedding Demo
          </Link>
          {isAuthenticated ? (
            <div className="pt-3 border-t border-stone-200 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-stone-800 py-1.5 font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-champagne-600" />
                Dashboard
              </Link>
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-stone-900 font-semibold py-1.5"
              >
                <PlusCircle className="w-4 h-4 text-champagne-600" />
                Create Ceremony
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-rose-600 py-1.5 w-full text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user?.name})
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-stone-700 bg-stone-100 rounded-xl font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-white font-semibold bg-stone-900 rounded-xl"
              >
                Start Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}