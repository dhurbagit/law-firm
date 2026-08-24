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
      <div className="min-vh-50 d-flex align-items-center justify-content-center text-white py-5">
        <div className="text-center">
          <div className="spinner-border text-danger mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="small text-uppercase fw-bold text-white-50" style={{ letterSpacing: '0.1em' }}>
            Gathering Real-Time Firm Intelligence...
          </p>
        </div>
      </div>
    );
  }

  // If error or unauthenticated state
  if (errorMsg && !data) {
    return (
      <div className="card bg-nepal-surface border border-crimson p-4 p-md-5 text-center text-white mx-auto my-5 shadow-lg" style={{ maxWidth: '500px' }}>
        <AlertCircle className="text-crimson mx-auto mb-3" style={{ width: '40px', height: '40px' }} />
        <h3 className="font-serif fs-4 fw-bold text-white mb-2">Operations Dashboard Offline</h3>
        <p className="text-white-50 small mb-4">{errorMsg}</p>
        <div className="d-flex align-items-center justify-content-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchAnalytics();
            }}
            className="btn btn-outline-light btn-sm fw-bold border-sakura text-white"
          >
            Retry Connection
          </button>
          <Link
            href="/admin/login"
            className="btn btn-danger btn-crimson btn-sm fw-bold text-white d-flex align-items-center gap-1 shadow"
          >
            <LogIn style={{ width: '14px', height: '14px' }} />
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
    <div className="d-flex flex-column gap-4 text-white">
      
      {/* Header with Title and Refresh */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
            Executive Command & Triage
          </span>
          <h1 className="font-serif fs-2 fw-bold text-white mb-0">
            Firm Operations Dashboard
          </h1>
        </div>

        <div>
          <button
            onClick={() => {
              setRefreshing(true);
              fetchAnalytics();
            }}
            disabled={refreshing}
            className="btn btn-outline-light btn-sm fw-bold border-sakura text-white d-flex align-items-center gap-2"
          >
            <RefreshCw className={refreshing ? 'animate-spin' : ''} style={{ width: '14px', height: '14px' }} />
            <span>{refreshing ? 'Refreshing...' : 'Live Refresh'}</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success bg-nepal-surface border border-sakura text-white p-3 rounded-3 d-flex align-items-center gap-2 shadow small mb-0">
          <CheckCircle2 className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="row g-3">
        
        {/* Total Inquiries */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-sm text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-bold text-white-50 small" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Total Inquiries</span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-dark border border-sakura text-nepal-blue"
                style={{ width: '32px', height: '32px' }}
              >
                <Inbox style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <div className="font-serif fs-2 fw-bold text-white mb-1">
              {leadsTotal}
            </div>
            <span className="text-white-50 small" style={{ fontSize: '11px' }}>Recorded across website & hotline</span>
          </div>
        </div>

        {/* Pending Triage */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-nepal-surface border border-crimson p-4 rounded-4 shadow-sm text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-bold text-crimson small" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Pending Triage</span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-dark border border-crimson text-crimson"
                style={{ width: '32px', height: '32px' }}
              >
                <Clock style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <div className="font-serif fs-2 fw-bold text-crimson mb-1">
              {leadsPending}
            </div>
            <span className="text-white-50 small" style={{ fontSize: '11px' }}>Awaiting partner review</span>
          </div>
        </div>

        {/* Scheduled Consultations */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-sm text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-bold text-white-50 small" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Scheduled Consults</span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-dark border border-sakura text-crimson"
                style={{ width: '32px', height: '32px' }}
              >
                <Calendar style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <div className="font-serif fs-2 fw-bold text-white mb-1">
              {leadsScheduled}
            </div>
            <span className="text-white-50 small" style={{ fontSize: '11px' }}>Retainer meetings booked</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-sm text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-uppercase fw-bold text-white-50 small" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Intake Conversion</span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-dark border border-sakura text-crimson"
                style={{ width: '32px', height: '32px' }}
              >
                <TrendingUp style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <div className="font-serif fs-2 fw-bold text-crimson mb-1">
              {conversionRate}
            </div>
            <span className="text-white-50 small" style={{ fontSize: '11px' }}>Leads scheduled or retained</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Intake Triage Stream + Practice Breakdown */}
      <div className="row g-4">
        
        {/* Left: Recent Inquiries Triage Stream (8 cols) */}
        <div className="col-12 col-lg-8">
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="font-serif fs-5 fw-bold text-white mb-1">
                  Recent Case Inquiries & Triage Stream
                </h3>
                <p className="text-white-50 small mb-0">
                  Quickly triage and advance inquiries without leaving the dashboard.
                </p>
              </div>
              <Link
                href="/admin/leads"
                className="text-crimson text-decoration-none small fw-bold d-flex align-items-center gap-1 hover-white"
              >
                <span>View Full CRM</span>
                <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {recentActivity.length === 0 ? (
                <div className="p-4 text-center text-white-50 small">
                  No recent inquiries recorded.
                </div>
              ) : (
                recentActivity.slice(0, 6).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 rounded-3 bg-nepal-dark border border-sakura d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
                  >
                    <div className="text-truncate">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-bold text-white small text-truncate">
                          {lead.full_name}
                        </span>
                        <span className={`badge rounded-pill small fw-bold text-uppercase ${
                          lead.status === 'pending' ? 'bg-crimson text-white' :
                          lead.status === 'contacted' ? 'bg-nepal-blue text-white' :
                          lead.status === 'scheduled' ? 'bg-success text-white' :
                          'bg-secondary text-white'
                        }`} style={{ fontSize: '9px' }}>
                          {lead.status}
                        </span>
                      </div>

                      <div className="small text-white-50 d-flex flex-wrap align-items-center gap-2" style={{ fontSize: '11px' }}>
                        <span>{lead.email}</span>
                        <span>•</span>
                        <span>{lead.phone}</span>
                        {lead.practice_area && (
                          <>
                            <span>•</span>
                            <span className="text-crimson fw-bold text-truncate">{lead.practice_area.title}</span>
                          </>
                        )}
                      </div>

                      <p className="small text-white-50 mb-0 mt-1 fst-italic text-truncate" style={{ fontSize: '11px' }}>
                        &ldquo;{lead.case_details}&rdquo;
                      </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      {lead.status === 'pending' && (
                        <button
                          onClick={() => handleQuickStatus(lead.id, 'contacted')}
                          disabled={updatingId === lead.id}
                          className="btn btn-outline-light btn-sm fw-bold border-sakura text-white"
                          style={{ fontSize: '11px' }}
                          title="Mark as Contacted"
                        >
                          Mark Contacted
                        </button>
                      )}

                      {(lead.status === 'pending' || lead.status === 'contacted') && (
                        <button
                          onClick={() => handleQuickStatus(lead.id, 'scheduled')}
                          disabled={updatingId === lead.id}
                          className="btn btn-danger btn-crimson btn-sm fw-bold text-white shadow"
                          style={{ fontSize: '11px' }}
                          title="Schedule Consultation"
                        >
                          Schedule
                        </button>
                      )}

                      <Link
                        href="/admin/leads"
                        className="btn btn-outline-light btn-sm fw-bold border-sakura text-white-50"
                        style={{ fontSize: '11px' }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Practice Breakdown & Firm Status (4 cols) */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          
          {/* Practice Area Distribution */}
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white">
            <h4 className="font-serif fs-6 fw-bold text-white mb-3">
              Inquiry Distribution by Discipline
            </h4>
            
            <div className="d-flex flex-column gap-3">
              {practiceDistribution.length === 0 ? (
                <p className="text-white-50 small mb-0">No practice area metrics recorded yet.</p>
              ) : (
                practiceDistribution.map((item) => (
                  <div key={item.id} className="d-flex flex-column gap-1">
                    <div className="d-flex align-items-center justify-content-between small">
                      <span className="text-white-50 text-truncate" style={{ maxWidth: '180px' }}>{item.title}</span>
                      <strong className="text-crimson">{item.leads_count} leads</strong>
                    </div>
                    <div className="progress" style={{ height: '6px', backgroundColor: '#00153B' }}>
                      <div 
                        className="progress-bar bg-crimson"
                        style={{ width: `${Math.min(100, (item.leads_count / Math.max(1, leadsTotal)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Firm Assets Summary Card */}
          <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white">
            <span className="text-uppercase text-crimson fw-bold small d-block mb-2" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
              CMS Asset Catalog
            </span>
            <div className="row g-2">
              <div className="col-6">
                <Link href="/admin/attorneys" className="card bg-nepal-dark border border-sakura p-3 rounded-3 text-decoration-none text-white h-100 hover-border-crimson">
                  <span className="text-uppercase text-white-50 fw-bold d-block" style={{ fontSize: '10px' }}>Attorneys</span>
                  <span className="font-serif fs-4 fw-bold text-white">{attorneysTotal}</span>
                </Link>
              </div>
              <div className="col-6">
                <Link href="/admin/practice-areas" className="card bg-nepal-dark border border-sakura p-3 rounded-3 text-decoration-none text-white h-100 hover-border-crimson">
                  <span className="text-uppercase text-white-50 fw-bold d-block" style={{ fontSize: '10px' }}>Practices</span>
                  <span className="font-serif fs-4 fw-bold text-white">{practicesTotal}</span>
                </Link>
              </div>
              <div className="col-6">
                <Link href="/admin/case-results" className="card bg-nepal-dark border border-sakura p-3 rounded-3 text-decoration-none text-white h-100 hover-border-crimson">
                  <span className="text-uppercase text-white-50 fw-bold d-block" style={{ fontSize: '10px' }}>Verdicts</span>
                  <span className="font-serif fs-4 fw-bold text-white">{caseResultsTotal}</span>
                </Link>
              </div>
              <div className="col-6">
                <Link href="/admin/settings" className="card bg-nepal-dark border border-sakura p-3 rounded-3 text-decoration-none text-white h-100 hover-border-crimson">
                  <span className="text-uppercase text-white-50 fw-bold d-block" style={{ fontSize: '10px' }}>Status</span>
                  <span className="badge bg-success text-white mt-1 d-inline-block">Healthy</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
