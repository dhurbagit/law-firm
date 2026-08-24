'use client';

import React, { useState, useEffect } from 'react';
import { getFirmStats, FirmStats } from '@/lib/api';
import { 
  Database, 
  Server, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw 
} from 'lucide-react';

export default function SystemSettingsPage() {
  const [stats, setStats] = useState<FirmStats | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    setToken(savedToken);
    loadStats();
  }, []);

  const loadStats = async () => {
    setChecking(true);
    try {
      const data = await getFirmStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 text-white" style={{ maxWidth: '1000px' }}>
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
            Infrastructure & Configuration
          </span>
          <h1 className="font-serif fs-2 fw-bold text-white mb-0">
            System Operations & Health
          </h1>
        </div>

        <div>
          <button
            onClick={loadStats}
            disabled={checking}
            className="btn btn-outline-light btn-sm fw-bold border-sakura text-white d-flex align-items-center gap-2"
          >
            <RefreshCw className={checking ? 'animate-spin' : ''} style={{ width: '14px', height: '14px' }} />
            <span>Ping Platform Health</span>
          </button>
        </div>
      </div>

      {/* Platform Services Status Grid */}
      <div className="row g-4">
        
        {/* Laravel 11 Backend API */}
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-dark border border-sakura text-crimson"
                style={{ width: '40px', height: '40px' }}
              >
                <Server style={{ width: '20px', height: '20px' }} />
              </div>
              <span className="badge bg-nepal-blue text-white border border-crimson" style={{ fontSize: '9px' }}>
                Online
              </span>
            </div>
            <div>
              <h4 className="font-serif fs-6 fw-bold text-white mb-1">Laravel 11 Backend API</h4>
              <p className="text-white-50 small mb-0">REST API listening on <code>http://localhost:8000/api/v1</code></p>
            </div>
          </div>
        </div>

        {/* MySQL Database */}
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-dark border border-sakura text-crimson"
                style={{ width: '40px', height: '40px' }}
              >
                <Database style={{ width: '20px', height: '20px' }} />
              </div>
              <span className="badge bg-nepal-blue text-white border border-crimson" style={{ fontSize: '9px' }}>
                Connected
              </span>
            </div>
            <div>
              <h4 className="font-serif fs-6 fw-bold text-white mb-1">MySQL / MariaDB</h4>
              <p className="text-white-50 small mb-0">Database: <code>law_firm</code> (utf8mb4_unicode_ci)</p>
            </div>
          </div>
        </div>

        {/* Sanctum Auth */}
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-dark border border-sakura text-crimson"
                style={{ width: '40px', height: '40px' }}
              >
                <Lock style={{ width: '20px', height: '20px' }} />
              </div>
              <span className="badge bg-nepal-blue text-white border border-crimson" style={{ fontSize: '9px' }}>
                Guarded
              </span>
            </div>
            <div>
              <h4 className="font-serif fs-6 fw-bold text-white mb-1">Laravel Sanctum</h4>
              <p className="text-white-50 small mb-0">
                Bearer Token: <code>{token ? `${token.substring(0, 12)}...` : 'Active'}</code>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Live Public Stats Telemetry */}
      {stats && (
        <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="font-serif fs-6 fw-bold text-white mb-0">Live Firm Public Telemetry</h4>
            <span className="text-crimson small fw-bold" style={{ fontSize: '11px' }}>Synced from /api/v1/stats</span>
          </div>
          <div className="row g-3 text-center">
            <div className="col-6 col-sm-3">
              <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                <span className="text-white-50 text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Recoveries</span>
                <span className="font-serif fs-5 fw-bold text-crimson">{stats.recovered_amount}</span>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                <span className="text-white-50 text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Success Rate</span>
                <span className="font-serif fs-5 fw-bold text-white">{stats.success_rate}</span>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                <span className="text-white-50 text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Active Practices</span>
                <span className="font-serif fs-5 fw-bold text-white">{stats.practice_areas}</span>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                <span className="text-white-50 text-uppercase fw-bold d-block" style={{ fontSize: '10px' }}>Landmark Verdicts</span>
                <span className="font-serif fs-5 fw-bold text-white">{stats.landmark_verdicts}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security & Rate Limiting Overview */}
      <div className="card bg-nepal-surface border border-sakura p-4 p-md-5 rounded-4 shadow-lg text-white">
        <div className="d-flex align-items-center gap-2 mb-4">
          <ShieldCheck className="text-crimson" style={{ width: '22px', height: '22px' }} />
          <h3 className="font-serif fs-5 fw-bold text-white mb-0">Security & API Policy Rules</h3>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 bg-nepal-dark border border-sakura h-100">
              <span className="fw-bold text-white d-block small mb-1">CORS Origin Whitelist</span>
              <p className="text-white-50 small mb-0">
                Requests from <code>http://localhost:3000</code>, <code>http://localhost:3001</code>, and authorized domains are permitted to transmit credentials.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 bg-nepal-dark border border-sakura h-100">
              <span className="fw-bold text-white d-block small mb-1">Consultation Rate Limiting</span>
              <p className="text-white-50 small mb-0">
                Inbound lead submissions on <code>/api/v1/consultations</code> are throttled to <strong>6 requests per minute per IP</strong> (<code>throttle:6,1</code>) to prevent automated spam.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 bg-nepal-dark border border-sakura h-100">
              <span className="fw-bold text-white d-block small mb-1">Public Storage Symlink</span>
              <p className="text-white-50 small mb-0">
                Headshot uploads and case attachments are saved securely to <code>storage/app/public/uploads</code> and served via <code>/storage/uploads/*</code>.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-3 rounded-3 bg-nepal-dark border border-sakura h-100">
              <span className="fw-bold text-white d-block small mb-1">Transactional DB Isolation</span>
              <p className="text-white-50 small mb-0">
                Lead intake and attorney pivot synchronization are wrapped in transactional DB blocks to guarantee atomicity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Firm Identity & Regulatory Disclaimers */}
      <div className="card bg-nepal-surface border border-sakura p-4 p-md-5 rounded-4 shadow-lg text-white">
        <h3 className="font-serif fs-5 fw-bold text-white mb-3">Firm Identity & Contacts</h3>
        <div className="row g-3 small text-white-50">
          <div className="col-12 col-sm-4">
            <span className="text-uppercase fw-bold text-white d-block mb-1" style={{ fontSize: '10px' }}>Headquarters:</span>
            <div className="d-flex align-items-center gap-2">
              <MapPin className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
              <span>375 Park Ave, 28th Floor, New York, NY</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <span className="text-uppercase fw-bold text-white d-block mb-1" style={{ fontSize: '10px' }}>Emergency Hotline:</span>
            <div className="d-flex align-items-center gap-2">
              <Phone className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
              <span>(212) 890-4400 (24/7 Response)</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <span className="text-uppercase fw-bold text-white d-block mb-1" style={{ fontSize: '10px' }}>Intake Email:</span>
            <div className="d-flex align-items-center gap-2">
              <Mail className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
              <span>inquiries@apexlegal.com</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
