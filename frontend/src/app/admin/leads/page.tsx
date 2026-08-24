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
    <div className="d-flex flex-column gap-4 text-white">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
            Client Intake Management
          </span>
          <h1 className="font-serif fs-2 fw-bold text-white mb-0">
            Consultation Leads CRM
          </h1>
        </div>

        <button
          onClick={fetchLeads}
          className="btn btn-outline-light btn-sm fw-bold border-sakura text-white d-flex align-items-center gap-2"
        >
          <RefreshCw style={{ width: '14px', height: '14px' }} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success bg-nepal-surface border border-sakura text-white p-3 rounded-3 d-flex align-items-center gap-2 shadow small mb-0">
          <CheckCircle2 className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white">
        
        {/* Status Tabs */}
        <div className="d-flex flex-wrap gap-2 pb-3 mb-3 border-bottom border-sakura">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              className={`btn btn-sm rounded-pill fw-bold px-3 py-1.5 ${
                statusFilter === tab.value
                  ? 'btn-danger btn-crimson text-white shadow'
                  : 'btn-outline-light border-sakura text-white-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
          <div className="position-relative flex-grow-1 w-100">
            <Search className="text-white-50 position-absolute top-50 start-0 translate-middle-y ms-3" style={{ width: '16px', height: '16px' }} />
            <input
              type="text"
              placeholder="Search by client name, email, phone, or case matter keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="form-control ps-5"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-outline-light btn-sm fw-bold border-sakura text-white"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Leads Data Table */}
      <div className="card bg-nepal-surface border border-sakura rounded-4 shadow-lg overflow-hidden text-white">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
            <thead className="bg-nepal-dark text-white text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Client Information</th>
                <th className="p-3">Practice Area</th>
                <th className="p-3">Summary of Matter</th>
                <th className="p-3">Intake Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="small text-white-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-5 text-center text-white-50">
                    <div className="spinner-border text-danger spinner-border-sm mb-2" role="status"></div>
                    <div className="small">Loading intake inquiries from MySQL...</div>
                  </td>
                </tr>
              ) : (!leadsData || leadsData.data.length === 0) ? (
                <tr>
                  <td colSpan={7} className="p-5 text-center text-white-50">
                    No consultation leads matching the filter criteria.
                  </td>
                </tr>
              ) : (
                leadsData.data.map((lead) => (
                  <tr key={lead.id}>
                    <td className="p-3 fw-bold text-white-50">#{lead.id}</td>
                    
                    <td className="p-3">
                      <div className="fw-bold text-white">{lead.full_name}</div>
                      <div className="text-white-50" style={{ fontSize: '11px' }}>{lead.email}</div>
                      <div className="text-white-50" style={{ fontSize: '11px' }}>{lead.phone}</div>
                    </td>

                    <td className="p-3">
                      <span className="badge bg-nepal-dark border border-sakura text-white small px-2 py-1">
                        {lead.practice_area ? lead.practice_area.title : 'General Legal Inquiry'}
                      </span>
                    </td>

                    <td className="p-3" style={{ maxWidth: '300px' }}>
                      <p className="text-white-50 mb-0 small line-clamp-2">
                        {lead.case_details}
                      </p>
                    </td>

                    <td className="p-3 text-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`form-select form-select-sm fw-bold text-uppercase ${
                          lead.status === 'pending' ? 'border-crimson text-crimson' :
                          lead.status === 'contacted' ? 'border-primary text-primary' :
                          lead.status === 'scheduled' ? 'border-success text-success' :
                          'text-white-50'
                        }`}
                        style={{ fontSize: '10px', width: 'auto' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    <td className="p-3 text-nowrap text-white-50" style={{ fontSize: '11px' }}>
                      {new Date(lead.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="p-3 text-end text-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="btn btn-outline-light btn-sm me-1 p-1 border-sakura"
                        title="View Full Inquiry Details"
                      >
                        <Eye style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="btn btn-outline-danger btn-sm p-1 border-crimson"
                        title="Delete Lead"
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
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
          <div className="p-3 bg-nepal-dark border-top border-sakura d-flex align-items-center justify-content-between small text-white-50">
            <span>
              Showing page {leadsData.meta.current_page} of {leadsData.meta.last_page} ({leadsData.meta.total} total)
            </span>
            <div className="btn-group">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="btn btn-outline-light btn-sm border-sakura"
              >
                <ChevronLeft style={{ width: '14px', height: '14px' }} />
              </button>
              <button
                disabled={currentPage >= leadsData.meta.last_page}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="btn btn-outline-light btn-sm border-sakura"
              >
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedLead && (
        <div className="modal show d-block bg-black bg-opacity-75" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content bg-nepal-surface border border-sakura rounded-4 text-white p-3 p-md-4 shadow-lg">
              
              {/* Modal Header */}
              <div className="modal-header border-bottom border-sakura pb-3">
                <div>
                  <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                    Confidential Inquiry File #{selectedLead.id}
                  </span>
                  <h3 className="modal-title font-serif fs-4 fw-bold text-white">
                    {selectedLead.full_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="btn-close btn-close-white"
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body py-4 d-flex flex-column gap-3">
                <div className="row g-3 p-3 rounded-3 bg-nepal-dark border border-sakura small text-white-50">
                  <div className="col-12 col-sm-6">
                    <span className="text-uppercase fw-bold text-white d-block" style={{ fontSize: '10px' }}>Email:</span>
                    <div className="d-flex align-items-center gap-1 text-white">
                      <Mail className="text-crimson" style={{ width: '14px', height: '14px' }} />
                      <a href={`mailto:${selectedLead.email}`} className="text-white text-decoration-none hover-crimson">{selectedLead.email}</a>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <span className="text-uppercase fw-bold text-white d-block" style={{ fontSize: '10px' }}>Phone:</span>
                    <div className="d-flex align-items-center gap-1 text-white">
                      <Phone className="text-crimson" style={{ width: '14px', height: '14px' }} />
                      <a href={`tel:${selectedLead.phone}`} className="text-white text-decoration-none hover-crimson">{selectedLead.phone}</a>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <span className="text-uppercase fw-bold text-white d-block" style={{ fontSize: '10px' }}>Practice Discipline:</span>
                    <span className="text-crimson fw-bold">
                      {selectedLead.practice_area ? selectedLead.practice_area.title : 'General Consultation'}
                    </span>
                  </div>

                  <div className="col-12 col-sm-6">
                    <span className="text-uppercase fw-bold text-white d-block" style={{ fontSize: '10px' }}>Intake Date & Source:</span>
                    <span className="text-white-50">
                      {new Date(selectedLead.created_at).toLocaleString()} ({selectedLead.source})
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-uppercase fw-bold text-white small d-block mb-2" style={{ fontSize: '11px' }}>
                    Submitted Legal Matter Details:
                  </span>
                  <div className="p-3 rounded-3 bg-nepal-dark border border-sakura small text-white-50 lh-base" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {selectedLead.case_details}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top border-sakura pt-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="small fw-bold text-white">Status:</span>
                  <div className="btn-group">
                    {['pending', 'contacted', 'scheduled', 'closed'].map((st) => (
                      <button
                        key={st}
                        disabled={actionLoading}
                        onClick={() => handleStatusChange(selectedLead.id, st)}
                        className={`btn btn-sm text-uppercase fw-bold ${
                          selectedLead.status === st ? 'btn-danger btn-crimson text-white shadow' : 'btn-outline-light border-sakura'
                        }`}
                        style={{ fontSize: '10px' }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  disabled={actionLoading}
                  className="btn btn-outline-danger btn-sm border-crimson"
                >
                  Delete File
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
