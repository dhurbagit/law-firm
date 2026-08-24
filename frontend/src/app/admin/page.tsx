'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getAdminAnalytics, 
  updateLeadStatus, 
  AdminAnalyticsData 
} from '@/lib/api';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  ArrowUpRight,
  AlertCircle,
  LogIn
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    const token = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'))
      : null;

    if (!token) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const res = await getAdminAnalytics(token);
      if (res && res.success && res.data) {
        setData(res.data);
        setErrorMsg(null);
      } else if (res && !res.success) {
        // Token invalid or unauthenticated
        sessionStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token');
        setErrorMsg('Session expired or unauthorized. Please sign in again.');
      }
    } catch (err: unknown) {
      console.error('Failed to load analytics:', err);
      setErrorMsg('Unable to retrieve real-time operations data from Laravel API. Please verify backend server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleQuickStatus = async (leadId: number, newStatus: string) => {
    const token = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'))
      : null;

    if (!token) {
      router.push('/admin/login');
      return;
    }

    setUpdatingId(leadId);
    setAlertMsg(null);

    try {
      const res = await updateLeadStatus(token, leadId, newStatus);
      if (res && res.success) {
        setAlertMsg(`Lead #${leadId} marked as "${newStatus}".`);
        fetchAnalytics();
      }
    } catch {
      setAlertMsg('Failed to update lead status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#C5A880]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            Gathering Real-Time Firm Intelligence...
          </p>
        </div>
      </div>
    );
  }

  // If error or unauthenticated state
  if (errorMsg && !data) {
    return (
      <div className="p-8 rounded-2xl bg-[#0B192C] border border-amber-500/30 text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-bold text-white">Operations Dashboard Offline</h2>
          <p className="text-xs text-slate-300">{errorMsg}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setLoading(true);
              fetchAnalytics();
            }}
            className="px-4 py-2 rounded-xl bg-[#172A45] hover:bg-[#1E2D4A] text-xs font-semibold text-[#DFC7A5] transition cursor-pointer"
          >
            Retry Connection
          </button>
          <Link
            href="/admin/login"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] text-xs font-bold text-[#0A192F] hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Admin</span>
          </Link>
        </div>
      </div>
    );
  }

  // Safe metrics fallback
  const leadsTotal = data?.leads_total ?? 0;
  const leadsPending = data?.leads_pending ?? 0;
  const leadsScheduled = data?.leads_scheduled ?? 0;
  const conversionRate = data?.conversion_rate ?? '0.0%';
  const recentActivity = data?.recent_activity ?? [];
  const practiceDistribution = data?.practice_distribution ?? [];
  const attorneysTotal = data?.attorneys_total ?? 0;
  const practicesTotal = data?.practice_areas_total ?? 0;
  const caseResultsTotal = data?.case_results_total ?? 0;

  return (
    <div className="space-y-8">
      
      {/* Header with Title and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] block mb-1">
            Executive Command & Triage
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            Firm Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchAnalytics();
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#172A45] hover:bg-[#1E2D4A] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC7A5] transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Live Refresh'}</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Inquiries */}
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#172A45] flex items-center justify-center text-[#C5A880]">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white mb-1">
            {leadsTotal}
          </div>
          <span className="text-[11px] text-slate-400">Recorded across website & hotline</span>
        </div>

        {/* Pending Triage */}
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-amber-500/30 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending Triage</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-300 mb-1">
            {leadsPending}
          </div>
          <span className="text-[11px] text-amber-200/70">Awaiting partner review</span>
        </div>

        {/* Scheduled Consultations */}
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-emerald-500/30 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Scheduled Consults</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-300 mb-1">
            {leadsScheduled}
          </div>
          <span className="text-[11px] text-emerald-200/70">Retainer meetings booked</span>
        </div>

        {/* Conversion Rate */}
        <div className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/30 relative overflow-hidden group shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DFC7A5]">Intake Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-[#172A45] flex items-center justify-center text-[#C5A880]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#DFC7A5] mb-1">
            {conversionRate}
          </div>
          <span className="text-[11px] text-slate-400">Leads scheduled or retained</span>
        </div>

      </div>

      {/* Main Grid: Recent Intake Triage Stream + Practice Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Inquiries Triage Stream (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">
                Recent Case Inquiries & Triage Stream
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quickly triage and advance inquiries without leaving the dashboard.
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs text-[#C5A880] hover:text-[#DFC7A5] font-semibold flex items-center gap-1"
            >
              <span>View Full CRM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No recent inquiries recorded.
              </div>
            ) : (
              recentActivity.slice(0, 6).map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl bg-[#0A192F] border border-white/5 hover:border-[#C5A880]/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">
                        {lead.full_name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        lead.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        lead.status === 'contacted' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        lead.status === 'scheduled' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-slate-700/50 text-slate-400 border border-slate-600'
                      }`}>
                        {lead.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>{lead.email}</span>
                      <span>•</span>
                      <span>{lead.phone}</span>
                      {lead.practice_area && (
                        <>
                          <span>•</span>
                          <span className="text-[#DFC7A5] font-medium truncate">{lead.practice_area.title}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1 italic pt-0.5">
                      &ldquo;{lead.case_details}&rdquo;
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {lead.status === 'pending' && (
                      <button
                        onClick={() => handleQuickStatus(lead.id, 'contacted')}
                        disabled={updatingId === lead.id}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/30 text-blue-200 text-[11px] font-semibold transition cursor-pointer"
                        title="Mark as Contacted"
                      >
                        Mark Contacted
                      </button>
                    )}

                    {(lead.status === 'pending' || lead.status === 'contacted') && (
                      <button
                        onClick={() => handleQuickStatus(lead.id, 'scheduled')}
                        disabled={updatingId === lead.id}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-200 text-[11px] font-semibold transition cursor-pointer"
                        title="Schedule Consultation"
                      >
                        Schedule
                      </button>
                    )}

                    <Link
                      href="/admin/leads"
                      className="px-2.5 py-1.5 rounded-lg bg-[#172A45] hover:bg-[#1E2D4A] border border-white/10 text-slate-300 text-[11px] transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Practice Breakdown & Firm Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Practice Area Distribution */}
          <div className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white">
              Inquiry Distribution by Discipline
            </h3>
            
            <div className="space-y-3">
              {practiceDistribution.length === 0 ? (
                <p className="text-xs text-slate-500">No practice area metrics recorded yet.</p>
              ) : (
                practiceDistribution.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[200px]">{item.title}</span>
                      <span className="text-[#DFC7A5] font-bold">{item.leads_count} inquiries</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0A192F] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#DFC7A5] to-[#C5A880] rounded-full"
                        style={{ width: `${Math.min(100, (item.leads_count / Math.max(1, leadsTotal)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Firm Assets Summary Card */}
          <div className="p-6 rounded-2xl bg-[#060D17] border border-[#C5A880]/20 space-y-3">
            <span className="text-xs uppercase font-bold text-[#C5A880] block">CMS Asset Catalog</span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link href="/admin/attorneys" className="p-3 rounded-xl bg-[#0A192F] border border-white/5 hover:border-[#C5A880]/40 transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attorneys</span>
                <span className="font-serif text-xl font-bold text-white">{attorneysTotal}</span>
              </Link>
              <Link href="/admin/practice-areas" className="p-3 rounded-xl bg-[#0A192F] border border-white/5 hover:border-[#C5A880]/40 transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Practices</span>
                <span className="font-serif text-xl font-bold text-white">{practicesTotal}</span>
              </Link>
              <Link href="/admin/case-results" className="p-3 rounded-xl bg-[#0A192F] border border-white/5 hover:border-[#C5A880]/40 transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verdicts</span>
                <span className="font-serif text-xl font-bold text-white">{caseResultsTotal}</span>
              </Link>
              <Link href="/admin/settings" className="p-3 rounded-xl bg-[#0A192F] border border-white/5 hover:border-[#C5A880]/40 transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Healthy
                </span>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
