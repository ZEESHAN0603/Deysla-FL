import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(username.trim(), password);
      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(res.error || 'Invalid credentials. Access denied.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background ambient gradient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-400/15 to-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card container */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium mb-4 shadow-xs">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-blue-600" />
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>DEYSLA Security Gateway</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/assets/logo.png" alt="DEYSLA" className="h-9 w-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                Admin Portal
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Internal Operations & Product Catalogue Management
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/60">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Administrator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator ID"
                  required
                  autoFocus
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition font-sans shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition font-mono shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Server-enforced timing-safe HMAC authorization</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/en"
            className="text-xs text-slate-500 hover:text-slate-800 transition underline underline-offset-4"
          >
            ← Return to Public DEYSLA Website
          </a>
        </div>
      </div>
    </div>
  );
}
