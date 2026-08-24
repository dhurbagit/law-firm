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
    <div className="min-h-screen flex items-center justify-center p-4 hero-pattern bg-[#060D17]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0A192F] border border-[#C5A880]/30 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
        
        {/* Top ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#172A45] to-[#0A192F] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880] mx-auto mb-4 shadow-xl">
            <Scale className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C5A880] block">
            Apex Legal Counsel LLP
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrative Portal
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Authorized partner and administrator access only. All actions are logged and audited.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5">
              Counsel / Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#060D17] border border-[#1E2D4A] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-white text-sm outline-none transition"
              placeholder="admin@lawfirm.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#060D17] border border-[#1E2D4A] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-white text-sm outline-none transition"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-[#0A192F] bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] hover:brightness-110 shadow-lg shadow-[#C5A880]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="pt-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#DFC7A5] bg-[#172A45] hover:bg-[#1E2D4A] border border-[#C5A880]/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>1-Click Admin Access (Pre-Filled)</span>
          </button>
        </div>

        {/* Credentials note */}
        <div className="pt-4 border-t border-white/5 space-y-2 text-center text-xs text-slate-400">
          <div className="p-3 rounded-lg bg-[#060D17] border border-white/5 text-[11px] text-slate-400">
            <span className="text-[#C5A880] font-semibold block mb-1">Seeded Administrator Credentials:</span>
            <code>admin@lawfirm.com</code> &bull; <code>Password123!</code>
          </div>
          <Link href="/" className="inline-block text-[11px] text-slate-400 hover:text-[#C5A880] transition pt-1">
            ← Return to Public Law Firm Website
          </Link>
        </div>

      </div>
    </div>
  );
}
