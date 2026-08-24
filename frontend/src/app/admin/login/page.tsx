'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminLogin } from '@/lib/api';
import { Scale, AlertCircle, Loader2, ArrowRight, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@lawfirm.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await adminLogin({ email, password });
      if (res && res.success && res.token) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_token', res.token);
        }
        router.push('/admin');
      } else {
        setError(res.message || 'Invalid administrative credentials provided.');
      }
    } catch {
      setError('Unable to authenticate with Laravel Sanctum API. Please verify the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@lawfirm.com');
    setPassword('Password123!');
    setLoading(true);
    setError(null);

    try {
      const res = await adminLogin({ email: 'admin@lawfirm.com', password: 'Password123!' });
      if (res && res.success && res.token) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_token', res.token);
        }
        router.push('/admin');
      } else {
        setError(res.message || 'Authentication error.');
      }
    } catch {
      setError('Unable to connect to Laravel Sanctum API on http://localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-pattern bg-nepal-dark font-sans text-white">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-nepal-surface border border-sakura-border shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
        
        {/* Top ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-nepal-blue/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-nepal-blue border border-crimson flex items-center justify-center text-white mx-auto mb-4 shadow-xl">
            <Scale className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-crimson block font-sans">
            Apex Legal Counsel LLP
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrative Portal
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Authorized partner and administrator access only. All actions are logged and audited.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-crimson/15 border border-crimson/40 text-xs text-slate-200 flex items-start gap-2.5 animate-in fade-in font-sans">
            <AlertCircle className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-200 mb-1.5 font-sans">
              Counsel / Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white text-sm outline-none transition font-sans"
              placeholder="admin@lawfirm.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-200 mb-1.5 font-sans">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white text-sm outline-none transition font-sans"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-crimson hover:bg-crimson-hover border border-white/20 shadow-lg shadow-crimson/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-sans"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Sanctum...</span>
              </>
            ) : (
              <>
                <span>Sign In to Operations Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Sign In */}
        <div className="pt-2 font-sans">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-nepal-dark hover:bg-nepal-blue border border-sakura-border transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-crimson" />
            <span>1-Click Admin Access (Pre-Filled)</span>
          </button>
        </div>

        {/* Credentials note */}
        <div className="pt-4 border-t border-sakura-border/40 space-y-2 text-center text-xs text-slate-300 font-sans">
          <div className="p-3 rounded-lg bg-nepal-dark border border-sakura-border/40 text-[11px] text-slate-300">
            <span className="text-crimson font-bold block mb-1">Seeded Administrator Credentials:</span>
            <code>admin@lawfirm.com</code> &bull; <code>Password123!</code>
          </div>
          <Link href="/" className="inline-block text-[11px] text-slate-400 hover:text-white transition pt-1">
            ← Return to Public Law Firm Website
          </Link>
        </div>

      </div>
    </div>
  );
}
