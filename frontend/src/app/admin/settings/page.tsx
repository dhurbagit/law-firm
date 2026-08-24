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
    <div className="space-y-8 max-w-5xl font-sans bg-[#000000] text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-1 font-sans">
            Infrastructure & Configuration
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            System Operations & Health
          </h1>
        </div>

        <button
          onClick={loadStats}
          disabled={checking}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001C4A] hover:bg-[#003893] border border-[#003893] text-xs font-bold text-white transition cursor-pointer font-sans"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          <span>Ping Platform Health</span>
        </button>
      </div>

      {/* Platform Services Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
        
        {/* Laravel 11 Backend API */}
        <div className="p-6 rounded-2xl bg-[#00122E] border border-[#003893] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
              <Server className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#003893] text-white border border-[#DC143C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></span> Online
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-base">Laravel 11 Backend API</h3>
            <p className="text-xs text-slate-300 mt-0.5">REST API listening on <code>http://localhost:8000/api/v1</code></p>
          </div>
        </div>

        {/* MySQL Database */}
        <div className="p-6 rounded-2xl bg-[#00122E] border border-[#003893] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
              <Database className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#003893] text-white border border-[#DC143C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></span> Connected
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-base">MySQL / MariaDB</h3>
            <p className="text-xs text-slate-300 mt-0.5">Database: <code>law_firm</code> (utf8mb4_unicode_ci)</p>
          </div>
        </div>

        {/* Sanctum Auth */}
        <div className="p-6 rounded-2xl bg-[#00122E] border border-[#003893] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
              <Lock className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#003893] text-white border border-[#DC143C] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></span> Guarded
            </span>
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-base">Laravel Sanctum</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Bearer Token: <code>{token ? `${token.substring(0, 12)}...` : 'Active'}</code>
            </p>
          </div>
        </div>

      </div>

      {/* Live Public Stats Telemetry */}
      {stats && (
        <div className="p-6 rounded-2xl bg-[#00122E] border border-[#003893] space-y-4 shadow-xl font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">Live Firm Public Telemetry</h3>
            <span className="text-[11px] text-[#DC143C] font-bold">Synced from /api/v1/stats</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#000000] border border-[#003893]/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Recoveries</span>
              <span className="font-serif text-lg font-bold text-[#DC143C]">{stats.recovered_amount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#000000] border border-[#003893]/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Success Rate</span>
              <span className="font-serif text-lg font-bold text-white">{stats.success_rate}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#000000] border border-[#003893]/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Practices</span>
              <span className="font-serif text-lg font-bold text-white">{stats.practice_areas}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#000000] border border-[#003893]/50">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Landmark Verdicts</span>
              <span className="font-serif text-lg font-bold text-white">{stats.landmark_verdicts}</span>
            </div>
          </div>
        </div>
      )}

      {/* Security & Rate Limiting Overview */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#00122E] border border-[#003893] space-y-6 shadow-xl font-sans">
        <div className="flex items-center gap-2.5 text-white">
          <ShieldCheck className="w-5 h-5 text-[#DC143C]" />
          <h2 className="font-serif text-xl font-bold text-white">Security & API Policy Rules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-1.5">
            <span className="font-bold text-white block">CORS Origin Whitelist</span>
            <p className="text-slate-300">
              Requests from <code>http://localhost:3000</code>, <code>http://localhost:3001</code>, and authorized domains are permitted to transmit credentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-1.5">
            <span className="font-bold text-white block">Consultation Rate Limiting</span>
            <p className="text-slate-300">
              Inbound lead submissions on <code>/api/v1/consultations</code> are throttled to <strong>6 requests per minute per IP</strong> (<code>throttle:6,1</code>) to prevent automated spam.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-1.5">
            <span className="font-bold text-white block">Public Storage Symlink</span>
            <p className="text-slate-300">
              Headshot uploads and case attachments are saved securely to <code>storage/app/public/uploads</code> and served via <code>/storage/uploads/*</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-1.5">
            <span className="font-bold text-white block">Transactional DB Isolation</span>
            <p className="text-slate-300">
              Lead intake and attorney pivot synchronization are wrapped in transactional DB blocks to guarantee atomicity.
            </p>
          </div>
        </div>
      </div>

      {/* Firm Identity & Regulatory Disclaimers */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#00122E] border border-[#003893] space-y-4 shadow-xl font-sans">
        <h2 className="font-serif text-xl font-bold text-white">Firm Identity & Contacts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-200 font-sans">
          <div className="space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Headquarters:</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
              <span>375 Park Ave, 28th Floor, New York, NY</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Emergency Hotline:</span>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
              <span>(212) 890-4400 (24/7 Response)</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Intake Email:</span>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
              <span>inquiries@apexlegal.com</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
