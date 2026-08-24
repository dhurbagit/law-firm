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
    <div className="space-y-6 font-sans bg-[#000000] text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-1 font-sans">
            Client Intake Management
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            Consultation Leads CRM
          </h1>
        </div>

        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001C4A] hover:bg-[#003893] border border-[#003893] text-xs font-bold text-white transition cursor-pointer font-sans"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Leads</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-xl bg-[#001C4A] border border-[#003893] text-xs text-white flex items-center gap-2 animate-in fade-in font-sans font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="p-5 rounded-2xl bg-[#00122E] border border-[#003893] space-y-4 shadow-xl font-sans">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#003893]/40 pb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-sans ${
                statusFilter === tab.value
                  ? 'bg-[#DC143C] text-white shadow'
                  : 'bg-[#001C4A] text-slate-300 hover:text-white border border-[#003893]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 font-sans">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#000000] border border-[#003893] focus:border-[#DC143C] text-xs text-white placeholder-slate-500 outline-none transition font-sans"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 rounded-xl bg-[#001C4A] text-slate-300 hover:text-white text-xs font-sans font-bold"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Leads Data Table */}
      <div className="rounded-2xl bg-[#00122E] border border-[#003893] overflow-hidden shadow-xl font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#000000] text-white uppercase font-bold text-[10px] tracking-wider border-b border-[#003893]/50">
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
            <tbody className="divide-y divide-[#003893]/30">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-sans">
                    <div className="w-6 h-6 border-2 border-[#DC143C] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span>Loading intake inquiries from MySQL...</span>
                  </td>
                </tr>
              ) : (!leadsData || leadsData.data.length === 0) ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-sans">
                    No consultation leads matching the filter criteria.
                  </td>
                </tr>
              ) : (
                leadsData.data.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#001C4A]/50 transition">
                    <td className="px-5 py-4 font-bold text-slate-400">#{lead.id}</td>
                    
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{lead.full_name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{lead.email}</div>
                      <div className="text-slate-400 text-[11px]">{lead.phone}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#001C4A] text-white border border-[#003893] text-[11px] font-bold whitespace-nowrap">
                        {lead.practice_area ? lead.practice_area.title : 'General Legal Inquiry'}
                      </span>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-300 text-xs leading-relaxed font-sans">
                        {lead.case_details}
                      </p>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border ${
                          lead.status === 'pending' ? 'bg-[#DC143C]/20 text-[#DC143C] border-[#DC143C]' :
                          lead.status === 'contacted' ? 'bg-[#003893]/30 text-white border-[#003893]' :
                          lead.status === 'scheduled' ? 'bg-[#003893] text-white border-[#DC143C]' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="pending" className="bg-[#000000] text-[#DC143C]">Pending</option>
                        <option value="contacted" className="bg-[#000000] text-white">Contacted</option>
                        <option value="scheduled" className="bg-[#000000] text-[#DC143C]">Scheduled</option>
                        <option value="closed" className="bg-[#000000] text-slate-400">Closed</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-[11px] text-slate-400 whitespace-nowrap font-sans">
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5 font-sans">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg bg-[#001C4A] hover:bg-[#003893] text-white transition cursor-pointer"
                        title="View Full Inquiry Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 rounded-lg bg-[#DC143C]/30 hover:bg-[#DC143C] text-white transition cursor-pointer"
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
          <div className="p-4 bg-[#000000] border-t border-[#003893]/40 flex items-center justify-between text-xs text-slate-400 font-sans">
            <span>
              Showing page {leadsData.meta.current_page} of {leadsData.meta.last_page} ({leadsData.meta.total} total inquiries)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg bg-[#001C4A] text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= leadsData.meta.last_page}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded-lg bg-[#001C4A] text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-2xl bg-[#00122E] border border-[#003893] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC143C] block mb-1 font-sans">
                  Confidential Inquiry File #{selectedLead.id}
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {selectedLead.full_name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-[#001C4A] text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#000000] border border-[#003893]/40 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Email Contact:</span>
                <div className="flex items-center gap-2 text-white">
                  <Mail className="w-3.5 h-3.5 text-[#DC143C]" />
                  <a href={`mailto:${selectedLead.email}`} className="hover:underline">{selectedLead.email}</a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Phone Number:</span>
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-3.5 h-3.5 text-[#DC143C]" />
                  <a href={`tel:${selectedLead.phone}`} className="hover:underline">{selectedLead.phone}</a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Practice Discipline:</span>
                <div className="text-[#DC143C] font-bold">
                  {selectedLead.practice_area ? selectedLead.practice_area.title : 'General Consultation'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Intake Date & Source:</span>
                <div className="text-slate-300">
                  {new Date(selectedLead.created_at).toLocaleString()} ({selectedLead.source})
                </div>
              </div>
            </div>

            {/* Case Details Body */}
            <div className="space-y-2 font-sans">
              <span className="text-xs uppercase font-bold text-slate-300 block">
                Submitted Legal Matter Details:
              </span>
              <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/40 text-xs sm:text-sm text-slate-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
                {selectedLead.case_details}
              </div>
            </div>

            {/* Status Transition Actions */}
            <div className="pt-4 border-t border-[#003893]/40 flex flex-wrap items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-300 font-bold">Change Status:</span>
                <div className="flex items-center gap-1.5">
                  {['pending', 'contacted', 'scheduled', 'closed'].map((st) => (
                    <button
                      key={st}
                      disabled={actionLoading}
                      onClick={() => handleStatusChange(selectedLead.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                        selectedLead.status === st
                          ? 'bg-[#DC143C] text-white'
                          : 'bg-[#001C4A] text-slate-200 hover:bg-[#003893]'
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
                className="px-3.5 py-1.5 rounded-lg bg-[#DC143C]/40 hover:bg-[#DC143C] border border-[#DC143C] text-white text-xs font-bold transition cursor-pointer"
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
