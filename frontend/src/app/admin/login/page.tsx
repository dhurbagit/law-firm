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
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 bg-nepal-dark text-white">
      <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 p-4 p-md-5 text-white w-100" style={{ maxWidth: '440px' }}>
        
        {/* Header */}
        <div className="text-center mb-4">
          <div 
            className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-blue border border-crimson text-white mx-auto mb-3 shadow"
            style={{ width: '54px', height: '54px' }}
          >
            <Scale style={{ width: '28px', height: '28px' }} />
          </div>
          <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            Apex Legal Counsel LLP
          </span>
          <h1 className="font-serif fs-3 fw-bold text-white mb-2">
            Administrative Portal
          </h1>
          <p className="text-white-50 small mb-0 lh-base">
            Authorized partner and administrator access only. All actions are logged and audited.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger bg-crimson border-0 text-white d-flex align-items-center gap-2 p-3 rounded-3 mb-4">
            <AlertCircle style={{ width: '18px', height: '18px' }} />
            <span className="small fw-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mb-3">
          <div>
            <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              Counsel / Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="admin@lawfirm.com"
            />
          </div>

          <div>
            <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-danger btn-crimson btn-lg w-100 fw-bold py-3 rounded-3 shadow d-flex align-items-center justify-content-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" style={{ width: '18px', height: '18px' }} />
                <span>Authenticating with Sanctum...</span>
              </>
            ) : (
              <>
                <span>Sign In to Operations Portal</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Quick Demo Sign In */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="btn btn-outline-light w-100 py-2 rounded-3 small fw-bold border-sakura text-white d-flex align-items-center justify-content-center gap-2"
          >
            <KeyRound className="text-crimson" style={{ width: '14px', height: '14px' }} />
            <span>1-Click Admin Access (Pre-Filled)</span>
          </button>
        </div>

        {/* Credentials note */}
        <div className="pt-3 border-top border-sakura text-center small text-white-50">
          <div className="p-2 rounded-2 bg-nepal-dark border border-sakura text-white-50 mb-2" style={{ fontSize: '11px' }}>
            <span className="text-crimson fw-bold d-block mb-1">Seeded Administrator Credentials:</span>
            <code>admin@lawfirm.com</code> &bull; <code>Password123!</code>
          </div>
          <Link href="/" className="text-white-50 text-decoration-none hover-crimson" style={{ fontSize: '11px' }}>
            ← Return to Public Law Firm Website
          </Link>
        </div>

      </div>
    </div>
  );
}
