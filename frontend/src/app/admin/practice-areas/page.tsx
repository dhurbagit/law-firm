'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  getAdminPracticeAreas, 
  createPracticeArea, 
  updatePracticeArea, 
  deletePracticeArea, 
  PracticeArea 
} from '@/lib/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X, 
  Scale, 
  Users, 
  Eye
} from 'lucide-react';

const availableIcons = [
  { name: 'Briefcase', label: 'Corporate' },
  { name: 'ShieldAlert', label: 'Personal Injury' },
  { name: 'Award', label: 'Intellectual Property' },
  { name: 'Gavel', label: 'Litigation / Criminal' },
  { name: 'Building2', label: 'Real Estate' },
  { name: 'Users', label: 'Employment' },
  { name: 'Scale', label: 'Antitrust / Justice' },
  { name: 'HeartPulse', label: 'Medical Malpractice' },
];

export default function PracticeAreasManagementPage() {
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<PracticeArea | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('Briefcase');
  const [shortSummary, setShortSummary] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [parentId, setParentId] = useState<number | null>(null);

  const fetchPracticeAreas = useCallback(async () => {
    const token = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'))
      : null;

    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const res = await getAdminPracticeAreas(token);
      if (res.data) setPracticeAreas(res.data);
    } catch (err) {
      console.error('Failed to load practice areas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPracticeAreas();
  }, [fetchPracticeAreas]);

  const openCreateModal = () => {
    setEditingArea(null);
    setTitle('');
    setIcon('Briefcase');
    setShortSummary('');
    setDescription('');
    setIsFeatured(false);
    setParentId(null);
    setModalOpen(true);
  };

  const openEditModal = (area: PracticeArea) => {
    setEditingArea(area);
    setTitle(area.title);
    setIcon(area.icon || 'Briefcase');
    setShortSummary(area.short_summary);
    setDescription(area.description);
    setIsFeatured(area.is_featured);
    setParentId(area.parent_id || null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    setModalLoading(true);

    const payload = {
      title,
      icon,
      short_summary: shortSummary,
      description,
      is_featured: isFeatured,
      parent_id: parentId,
    };

    try {
      if (editingArea) {
        const res = await updatePracticeArea(token, editingArea.id, payload);
        if (res.success) {
          setAlertMsg(`Practice area "${title}" updated successfully.`);
          setModalOpen(false);
          fetchPracticeAreas();
        }
      } else {
        const res = await createPracticeArea(token, payload);
        if (res.success) {
          setAlertMsg(`Practice area "${title}" created successfully.`);
          setModalOpen(false);
          fetchPracticeAreas();
        }
      }
    } catch (err) {
      alert('Failed to save practice area: ' + err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number, areaTitle: string) => {
    if (!confirm(`Are you sure you want to delete practice area "${areaTitle}"?`)) return;

    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await deletePracticeArea(token, id);
      if (res.success) {
        setAlertMsg(`Practice area "${areaTitle}" removed.`);
        fetchPracticeAreas();
      }
    } catch (err) {
      alert('Failed to delete practice area: ' + err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] block mb-1">
            Core Firm Disciplines
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            Practice Areas Manager
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] text-[#0A192F] text-xs font-bold shadow-lg shadow-[#C5A880]/20 transition hover:brightness-110 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Practice Discipline</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Grid of Practice Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>Loading practice disciplines...</span>
          </div>
        ) : practiceAreas.map((area) => (
          <div
            key={area.id}
            className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#C5A880]/40 transition group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0A192F] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {area.is_featured && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#C5A880]/20 text-[#DFC7A5] border border-[#C5A880]/30">
                      Core
                    </span>
                  )}
                  {area.parent && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300">
                      Sub-practice
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#DFC7A5] transition-colors">
                {area.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {area.short_summary}
              </p>

              {area.attorneys && area.attorneys.length > 0 && (
                <div className="pt-2 text-[11px] text-[#DFC7A5] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{area.attorneys.length} Dedicated Attorney{area.attorneys.length > 1 ? 's' : ''} Assigned</span>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <a
                href={`/practice-areas/${area.slug}`}
                target="_blank"
                className="text-xs text-[#C5A880] hover:text-[#DFC7A5] flex items-center gap-1 font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Page</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(area)}
                  className="p-1.5 rounded-lg bg-[#172A45] hover:bg-[#1E2D4A] text-slate-300 hover:text-white transition cursor-pointer"
                  title="Edit Practice Area"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(area.id, area.title)}
                  className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-300 transition cursor-pointer"
                  title="Delete Practice Area"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
                  CMS Practice Area Editor
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {editingArea ? `Edit: ${editingArea.title}` : 'Create New Practice Discipline'}
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Discipline Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Antitrust & Competition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Parent Practice Area (Optional)
                  </label>
                  <select
                    value={parentId || ''}
                    onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880] cursor-pointer"
                  >
                    <option value="" className="bg-[#0B192C] text-slate-400">None (Top-Level Discipline)</option>
                    {practiceAreas.filter(p => !editingArea || p.id !== editingArea.id).map(p => (
                      <option key={p.id} value={p.id} className="bg-[#0B192C] text-white">{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-300 mb-1.5">
                  Prestige Icon Symbol
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((ic) => (
                    <button
                      type="button"
                      key={ic.name}
                      onClick={() => setIcon(ic.name)}
                      className={`p-2 rounded-lg text-xs flex items-center gap-2 border transition cursor-pointer ${
                        icon === ic.name 
                          ? 'bg-[#172A45] border-[#C5A880] text-[#DFC7A5]' 
                          : 'bg-[#0A192F] border-transparent text-slate-400'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span className="truncate">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Short Summary */}
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                  Short Executive Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="One sentence overview for cards and meta descriptions..."
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                  Full Strategic Practice Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880] resize-none"
                  placeholder="Detailed regulatory scope, trial capabilities, and client representation details..."
                ></textarea>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-[#C5A880] w-4 h-4"
                />
                <label htmlFor="featured-toggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Featured Core Practice (Highlighted on Homepage & Header)
                </label>
              </div>

              {/* Submit Buttons */}
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
                  {modalLoading ? 'Saving...' : (editingArea ? 'Update Practice Discipline' : 'Publish Practice Discipline')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
