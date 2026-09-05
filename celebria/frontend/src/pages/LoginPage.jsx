import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@celebria.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-champagne-100 text-champagne-800 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-stone-500 font-serif italic">Sign in to manage your invitations and guest RSVPs</p>
        </div>

        {/* Form Container */}
        <div className="glass-card border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-card-soft space-y-6">
          
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-champagne-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-champagne-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4 text-champagne-400" />
            </button>
          </form>

          {/* Quick Demo Credentials for Defense */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-champagne-50 hover:bg-champagne-100/80 border border-champagne-200 text-champagne-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-champagne-700" />
              Click to Auto-Fill Demo Account (Graduation Defense)
            </button>
          </div>

        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-champagne-700 hover:text-champagne-800 font-bold underline underline-offset-2">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}