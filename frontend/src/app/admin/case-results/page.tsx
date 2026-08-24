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
  X, 
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
    } catch (err) {
      alert('Failed to delete case record: ' + err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] block mb-1">
            Trial Track Record & Settlements
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            Landmark Verdicts Manager
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] text-[#0A192F] text-xs font-bold shadow-lg shadow-[#C5A880]/20 transition hover:brightness-110 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Landmark Case / Verdict</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Grid of Case Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>Loading landmark case verdicts...</span>
          </div>
        ) : caseResults.map((result) => (
          <div
            key={result.id}
            className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#C5A880]/40 transition group"
          >
            <div className="space-y-3">
              
              {/* Verdict Highlight Badge & Year */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-[#172A45] text-[#DFC7A5] border border-[#C5A880]/30 font-serif font-bold text-xs">
                  {result.settlement_verdict}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{result.case_year}</span>
                </span>
              </div>

              <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#DFC7A5] transition-colors leading-snug">
                {result.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {result.summary}
              </p>

              {/* Attribution */}
              <div className="pt-2 space-y-1 text-xs">
                {result.practice_area && (
                  <div className="text-slate-300 flex items-center gap-1.5 truncate">
                    <Scale className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
                    <span className="truncate">{result.practice_area.title}</span>
                  </div>
                )}
                {result.lead_attorney && (
                  <div className="text-[#DFC7A5] flex items-center gap-1.5 truncate font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
                    <span className="truncate">Lead: {result.lead_attorney.name}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-1.5">
              <button
                onClick={() => openEditModal(result)}
                className="p-1.5 rounded-lg bg-[#172A45] hover:bg-[#1E2D4A] text-slate-300 hover:text-white transition cursor-pointer"
                title="Edit Case Result"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(result.id, result.title)}
                className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-300 transition cursor-pointer"
                title="Delete Case Result"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* CREATE & EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0B192C] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                  CMS Verdict Record Editor
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {editingResult ? `Edit: ${editingResult.title}` : 'Add Landmark Verdict / Recovery'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-[#172A45] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                  Case / Matter Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cross-Border Tech Acquisition Clearance & Antitrust Immunity"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Financial Recovery / Verdict Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $14,250,000 Jury Verdict"
                    value={verdict}
                    onChange={(e) => setVerdict(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Verdict / Settlement Year *
                  </label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={2030}
                    value={caseYear}
                    onChange={(e) => setCaseYear(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Practice Discipline *
                  </label>
                  <select
                    required
                    value={practiceAreaId}
                    onChange={(e) => setPracticeAreaId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880] cursor-pointer"
                  >
                    <option value="" className="bg-[#0B192C] text-slate-400">Select Practice Area</option>
                    {practiceAreas.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0B192C] text-white">{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Lead Trial Counsel *
                  </label>
                  <select
                    required
                    value={leadAttorneyId}
                    onChange={(e) => setLeadAttorneyId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880] cursor-pointer"
                  >
                    <option value="" className="bg-[#0B192C] text-slate-400">Select Lead Attorney</option>
                    {attorneys.map(a => (
                      <option key={a.id} value={a.id} className="bg-[#0B192C] text-white">{a.name} ({a.designation})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                  Executive Case Summary *
                </label>
                <textarea
                  rows={4}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880] resize-none"
                  placeholder="Summarize the legal challenges, adversary resistance, courtroom strategy, and ultimate resolution..."
                ></textarea>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#172A45] text-slate-300 text-xs font-semibold hover:bg-[#1E2D4A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] text-[#0A192F] text-xs font-bold shadow-lg shadow-[#C5A880]/20 hover:brightness-110 cursor-pointer disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : (editingResult ? 'Update Landmark Case' : 'Publish Landmark Case')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
