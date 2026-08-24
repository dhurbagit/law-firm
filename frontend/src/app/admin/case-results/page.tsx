'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  getAdminCaseResults, 
  createCaseResult, 
  updateCaseResult, 
  deleteCaseResult, 
  getAdminPracticeAreas, 
  getAdminAttorneys, 
  CaseResult, 
  PracticeArea, 
  Attorney 
} from '@/lib/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Scale, 
  Calendar, 
  UserCheck 
} from 'lucide-react';

export default function CaseResultsManagementPage() {
  const [caseResults, setCaseResults] = useState<CaseResult[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<CaseResult | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [verdict, setVerdict] = useState('');
  const [practiceAreaId, setPracticeAreaId] = useState<number | ''>('');
  const [leadAttorneyId, setLeadAttorneyId] = useState<number | ''>('');
  const [summary, setSummary] = useState('');
  const [caseYear, setCaseYear] = useState<number>(new Date().getFullYear());

  const fetchCasesData = useCallback(async () => {
    const token = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'))
      : null;

    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const [casesRes, pracRes, attRes] = await Promise.all([
        getAdminCaseResults(token),
        getAdminPracticeAreas(token),
        getAdminAttorneys(token),
      ]);
      if (casesRes.data) setCaseResults(casesRes.data);
      if (pracRes.data) setPracticeAreas(pracRes.data);
      if (attRes.data) setAttorneys(attRes.data);
    } catch (err) {
      console.error('Failed to load case results:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCasesData();
  }, [fetchCasesData]);

  const openCreateModal = () => {
    setEditingResult(null);
    setTitle('');
    setVerdict('');
    setPracticeAreaId(practiceAreas[0]?.id || '');
    setLeadAttorneyId(attorneys[0]?.id || '');
    setSummary('');
    setCaseYear(new Date().getFullYear());
    setModalOpen(true);
  };

  const openEditModal = (result: CaseResult) => {
    setEditingResult(result);
    setTitle(result.title);
    setVerdict(result.settlement_verdict);
    setPracticeAreaId(result.practice_area_id);
    setLeadAttorneyId(result.lead_attorney_id);
    setSummary(result.summary);
    setCaseYear(result.case_year);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    if (!practiceAreaId || !leadAttorneyId) {
      alert('Please select both a practice discipline and lead attorney.');
      return;
    }

    setModalLoading(true);

    const payload = {
      title,
      settlement_verdict: verdict,
      practice_area_id: Number(practiceAreaId),
      lead_attorney_id: Number(leadAttorneyId),
      summary,
      case_year: Number(caseYear),
    };

    try {
      if (editingResult) {
        const res = await updateCaseResult(token, editingResult.id, payload);
        if (res.success) {
          setAlertMsg(`Case record "${title}" updated successfully.`);
          setModalOpen(false);
          fetchCasesData();
        }
      } else {
        const res = await createCaseResult(token, payload);
        if (res.success) {
          setAlertMsg(`Landmark case record "${title}" created successfully.`);
          setModalOpen(false);
          fetchCasesData();
        }
      }
    } catch (err) {
      alert('Failed to save case result: ' + err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number, caseTitle: string) => {
    if (!confirm(`Are you sure you want to delete case result "${caseTitle}"?`)) return;

    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await deleteCaseResult(token, id);
      if (res.success) {
        setAlertMsg(`Case record "${caseTitle}" removed.`);
        fetchCasesData();
      }
    } catch (err: unknown) {
      setAlertMsg('Failed to delete case record: ' + String(err));
    }
  };

  return (
    <div className="d-flex flex-column gap-4 text-white">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
            Trial Track Record & Settlements
          </span>
          <h1 className="font-serif fs-2 fw-bold text-white mb-0">
            Landmark Verdicts Manager
          </h1>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="btn btn-danger btn-crimson btn-sm fw-bold px-3 py-2 rounded-3 text-white d-flex align-items-center gap-1 shadow"
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            <span>Add Landmark Verdict</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success bg-nepal-surface border border-sakura text-white p-3 rounded-3 d-flex align-items-center gap-2 shadow small mb-0">
          <CheckCircle2 className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Grid of Case Results */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 py-5 text-center text-white-50">
            <div className="spinner-border text-danger spinner-border-sm mb-2" role="status"></div>
            <div>Loading landmark case verdicts...</div>
          </div>
        ) : caseResults.map((result) => (
          <div key={result.id} className="col-12 col-md-6 col-lg-4">
            <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white d-flex flex-column justify-content-between h-100 hover-border-crimson">
              <div className="d-flex flex-column gap-2">
                
                {/* Verdict Highlight Badge & Year */}
                <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                  <span className="badge bg-crimson text-white font-serif fw-bold small px-3 py-2 rounded-pill shadow-sm">
                    {result.settlement_verdict}
                  </span>
                  <span className="text-white-50 small fw-bold d-flex align-items-center gap-1">
                    <Calendar className="text-nepal-blue" style={{ width: '14px', height: '14px' }} />
                    <span>{result.case_year}</span>
                  </span>
                </div>

                <h3 className="font-serif fs-5 fw-bold text-white mb-0 lh-snug">
                  {result.title}
                </h3>

                <p className="text-white-50 small line-clamp-3 mb-0 lh-base">
                  {result.summary}
                </p>

                {/* Attribution */}
                <div className="pt-2 d-flex flex-column gap-1 small text-white-50">
                  {result.practice_area && (
                    <div className="d-flex align-items-center gap-1 text-truncate">
                      <Scale className="text-nepal-blue flex-shrink-0" style={{ width: '14px', height: '14px' }} />
                      <span className="text-truncate">{result.practice_area.title}</span>
                    </div>
                  )}
                  {result.lead_attorney && (
                    <div className="text-crimson d-flex align-items-center gap-1 text-truncate fw-bold">
                      <UserCheck style={{ width: '14px', height: '14px' }} />
                      <span className="text-truncate">Lead: {result.lead_attorney.name}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Actions Bar */}
              <div className="pt-3 mt-3 border-top border-sakura d-flex align-items-center justify-content-end gap-1">
                <button
                  onClick={() => openEditModal(result)}
                  className="btn btn-outline-light btn-sm p-1 border-sakura"
                  title="Edit Case Result"
                >
                  <Edit style={{ width: '14px', height: '14px' }} />
                </button>
                <button
                  onClick={() => handleDelete(result.id, result.title)}
                  className="btn btn-outline-danger btn-sm p-1 border-crimson"
                  title="Delete Case Result"
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* CREATE & EDIT MODAL */}
      {modalOpen && (
        <div className="modal show d-block bg-black bg-opacity-75" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content bg-nepal-surface border border-sakura rounded-4 text-white p-3 p-md-4 shadow-lg">
              
              <div className="modal-header border-bottom border-sakura pb-3">
                <div>
                  <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                    CMS Verdict Record Editor
                  </span>
                  <h3 className="modal-title font-serif fs-4 fw-bold text-white">
                    {editingResult ? `Edit: ${editingResult.title}` : 'Add Landmark Verdict / Recovery'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-close btn-close-white"
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body py-4 d-flex flex-column gap-3">
                
                <div>
                  <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                    Case / Matter Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cross-Border Tech Acquisition Clearance & Antitrust Immunity"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Financial Recovery / Verdict Headline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $14,250,000 Jury Verdict"
                      value={verdict}
                      onChange={(e) => setVerdict(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Verdict / Settlement Year *
                    </label>
                    <input
                      type="number"
                      required
                      min={1990}
                      max={2030}
                      value={caseYear}
                      onChange={(e) => setCaseYear(Number(e.target.value))}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Practice Discipline *
                    </label>
                    <select
                      required
                      value={practiceAreaId}
                      onChange={(e) => setPracticeAreaId(e.target.value ? Number(e.target.value) : '')}
                      className="form-select cursor-pointer"
                    >
                      <option value="">Select Practice Area</option>
                      {practiceAreas.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Lead Trial Counsel *
                    </label>
                    <select
                      required
                      value={leadAttorneyId}
                      onChange={(e) => setLeadAttorneyId(e.target.value ? Number(e.target.value) : '')}
                      className="form-select cursor-pointer"
                    >
                      <option value="">Select Lead Attorney</option>
                      {attorneys.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.designation})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                    Executive Case Summary *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="form-control"
                    placeholder="Summarize the legal challenges, adversary resistance, courtroom strategy, and ultimate resolution..."
                  ></textarea>
                </div>

                <div className="modal-footer border-top border-sakura pt-3 d-flex align-items-center justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-outline-light btn-sm border-sakura"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="btn btn-danger btn-crimson btn-sm fw-bold shadow"
                  >
                    {modalLoading ? 'Saving...' : (editingResult ? 'Update Landmark Case' : 'Publish Landmark Case')}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
