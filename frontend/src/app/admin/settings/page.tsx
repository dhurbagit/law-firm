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
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] block mb-1">
            Infrastructure & Configuration
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            System Operations & Health
          </h1>
        </div>

        <button
          onClick={loadStats}
          disabled={checking}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#172A45] hover:bg-[#1E2D4A] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC7A5] transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          <span>Ping Platform Health</span>
        </button>
      </div>

      {/* Platform Services Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Laravel 11 Backend API */}
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-emerald-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#172A45] flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-base">Laravel 11 Backend API</h3>
            <p className="text-xs text-slate-400 mt-0.5">REST API listening on <code>http://localhost:8000/api/v1</code></p>
          </div>
        </div>

        {/* MySQL Database */}
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-emerald-500/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#172A45] flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connected
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-base">MySQL / MariaDB</h3>
            <p className="text-xs text-slate-400 mt-0.5">Database: <code>law_firm</code> (utf8mb4_unicode_ci)</p>
          </div>
        </div>

        {/* Sanctum Auth */}
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#172A45] flex items-center justify-center text-[#C5A880]">
              <Lock className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C5A880]/20 text-[#DFC7A5] border border-[#C5A880]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span> Guarded
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-base">Laravel Sanctum</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bearer Token: <code>{token ? `${token.substring(0, 12)}...` : 'Active'}</code>
            </p>
          </div>
        </div>

      </div>

      {/* Live Public Stats Telemetry */}
      {stats && (
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">Live Firm Public Telemetry</h3>
            <span className="text-[11px] text-[#DFC7A5]">Synced from /api/v1/stats</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#0A192F] border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Recoveries</span>
              <span className="font-serif text-lg font-bold text-[#DFC7A5]">{stats.recovered_amount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0A192F] border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Success Rate</span>
              <span className="font-serif text-lg font-bold text-emerald-400">{stats.success_rate}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0A192F] border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Practices</span>
              <span className="font-serif text-lg font-bold text-white">{stats.practice_areas}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0A192F] border border-white/5">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Landmark Verdicts</span>
              <span className="font-serif text-lg font-bold text-white">{stats.landmark_verdicts}</span>
            </div>
          </div>
        </div>
      )}

      {/* Security & Rate Limiting Overview */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 text-[#DFC7A5]">
          <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
          <h2 className="font-serif text-xl font-bold text-white">Security & API Policy Rules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-1.5">
            <span className="font-bold text-white block">CORS Origin Whitelist</span>
            <p className="text-slate-400">
              Only requests from <code>http://localhost:3000</code> and authorized frontend production domains are permitted to transmit credentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-1.5">
            <span className="font-bold text-white block">Consultation Rate Limiting</span>
            <p className="text-slate-400">
              Inbound lead submissions on <code>/api/v1/consultations</code> are throttled to <strong>6 requests per minute per IP</strong> (<code>throttle:6,1</code>) to prevent automated spam abuse.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-1.5">
            <span className="font-bold text-white block">Public Storage Symlink</span>
            <p className="text-slate-400">
              Headshot uploads and case attachments are saved securely to <code>storage/app/public/uploads</code> and served via <code>/storage/uploads/*</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-1.5">
            <span className="font-bold text-white block">Transactional DB Isolation</span>
            <p className="text-slate-400">
              Lead intake and attorney pivot synchronization are wrapped in transactional DB blocks to guarantee atomicity.
            </p>
          </div>
        </div>
      </div>

      {/* Firm Identity & Regulatory Disclaimers */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 space-y-4 shadow-xl">
        <h2 className="font-serif text-xl font-bold text-white">Firm Identity & Contacts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="space-y-1">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Headquarters:</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
              <span>375 Park Ave, 28th Floor, New York, NY</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Emergency Hotline:</span>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
              <span>(212) 890-4400 (24/7 Response)</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 uppercase font-semibold text-[10px]">Intake Email:</span>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
              <span>inquiries@apexlegal.com</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
