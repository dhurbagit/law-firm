'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  getAdminLeads, 
  updateLeadStatus, 
  deleteLead, 
  ConsultationLead, 
  PaginatedResponse 
} from '@/lib/api';
import { 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  X, 
  Phone, 
  Mail, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function LeadsCrmPage() {
  const [leadsData, setLeadsData] = useState<PaginatedResponse<ConsultationLead> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Detail Modal
  const [selectedLead, setSelectedLead] = useState<ConsultationLead | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    const token = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'))
      : null;

    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const res = await getAdminLeads(token, {
        status: statusFilter || undefined,
        q: searchQuery || undefined,
        page: currentPage,
      });
      setLeadsData(res);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;
    setActionLoading(true);
    setAlertMsg(null);

    try {
      const res = await updateLeadStatus(token, leadId, newStatus);
      if (res.success) {
        setAlertMsg(`Lead #${leadId} status updated to ${newStatus}.`);
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus as ConsultationLead['status'] });
        }
        fetchLeads();
      }
    } catch {
      setAlertMsg('Failed to update lead status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (leadId: number) => {
    if (!confirm(`Are you sure you want to permanently delete Inquiry #${leadId}?`)) return;

    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;
    setActionLoading(true);

    try {
      const res = await deleteLead(token, leadId);
      if (res.success) {
        setAlertMsg(`Lead #${leadId} deleted successfully.`);
        setSelectedLead(null);
        fetchLeads();
      }
    } catch {
      setAlertMsg('Failed to delete lead.');
    } finally {
      setActionLoading(false);
    }
  };

  const statusTabs = [
    { label: 'All Inquiries', value: '' },
    { label: 'Pending Triage', value: 'pending' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Closed', value: 'closed' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] block mb-1">
            Client Intake Management
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            Consultation Leads CRM
          </h1>
        </div>

        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#172A45] hover:bg-[#1E2D4A] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC7A5] transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Leads</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="p-5 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 space-y-4 shadow-xl">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab.value
                  ? 'bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] text-[#0A192F] shadow'
                  : 'bg-[#0A192F] text-slate-300 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, or case matter keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] focus:border-[#C5A880] text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 rounded-xl bg-[#172A45] text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Leads Data Table */}
      <div className="rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A192F] text-[#DFC7A5] uppercase font-semibold text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Client Information</th>
                <th className="px-5 py-3.5">Practice Area</th>
                <th className="px-5 py-3.5">Summary of Matter</th>
                <th className="px-5 py-3.5">Intake Status</th>
                <th className="px-5 py-3.5">Submission Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span>Loading intake inquiries from MySQL...</span>
                  </td>
                </tr>
              ) : (!leadsData || leadsData.data.length === 0) ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No consultation leads matching the filter criteria.
                  </td>
                </tr>
              ) : (
                leadsData.data.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#172A45]/40 transition">
                    <td className="px-5 py-4 font-bold text-slate-400">#{lead.id}</td>
                    
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{lead.full_name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{lead.email}</div>
                      <div className="text-slate-400 text-[11px]">{lead.phone}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#0A192F] text-[#DFC7A5] border border-[#C5A880]/20 text-[11px] font-medium whitespace-nowrap">
                        {lead.practice_area ? lead.practice_area.title : 'General Legal Inquiry'}
                      </span>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-300 text-xs leading-relaxed">
                        {lead.case_details}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border ${
                          lead.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          lead.status === 'contacted' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                          lead.status === 'scheduled' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          'bg-slate-700/50 text-slate-400 border-slate-600'
                        }`}
                      >
                        <option value="pending" className="bg-[#0B192C] text-amber-300">Pending</option>
                        <option value="contacted" className="bg-[#0B192C] text-blue-300">Contacted</option>
                        <option value="scheduled" className="bg-[#0B192C] text-emerald-300">Scheduled</option>
                        <option value="closed" className="bg-[#0B192C] text-slate-400">Closed</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg bg-[#172A45] hover:bg-[#1E2D4A] text-slate-300 hover:text-white transition cursor-pointer"
                        title="View Full Inquiry Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-300 transition cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {leadsData && leadsData.meta && leadsData.meta.last_page > 1 && (
          <div className="p-4 bg-[#0A192F] border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing page {leadsData.meta.current_page} of {leadsData.meta.last_page} ({leadsData.meta.total} total inquiries)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg bg-[#172A45] disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= leadsData.meta.last_page}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded-lg bg-[#172A45] disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0B192C] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                  Confidential Inquiry File #{selectedLead.id}
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {selectedLead.full_name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-[#172A45] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0A192F] border border-white/5 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">Email Contact:</span>
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                  <a href={`mailto:${selectedLead.email}`} className="hover:underline">{selectedLead.email}</a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">Phone Number:</span>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                  <a href={`tel:${selectedLead.phone}`} className="hover:underline">{selectedLead.phone}</a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">Practice Discipline:</span>
                <div className="text-[#DFC7A5] font-medium">
                  {selectedLead.practice_area ? selectedLead.practice_area.title : 'General Consultation'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">Intake Date & Source:</span>
                <div className="text-slate-300">
                  {new Date(selectedLead.created_at).toLocaleString()} ({selectedLead.source})
                </div>
              </div>
            </div>

            {/* Case Details Body */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 block">
                Submitted Legal Matter Details:
              </span>
              <div className="p-4 rounded-xl bg-[#060D17] border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {selectedLead.case_details}
              </div>
            </div>

            {/* Status Transition Actions */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Change Status:</span>
                <div className="flex items-center gap-1.5">
                  {['pending', 'contacted', 'scheduled', 'closed'].map((st) => (
                    <button
                      key={st}
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(selectedLead.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                        selectedLead.status === st
                          ? 'bg-[#C5A880] text-[#0A192F]'
                          : 'bg-[#172A45] text-slate-300 hover:bg-[#1E2D4A]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDelete(selectedLead.id)}
                disabled={actionLoading}
                className="px-3.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-200 text-xs font-semibold transition cursor-pointer"
              >
                Delete File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
