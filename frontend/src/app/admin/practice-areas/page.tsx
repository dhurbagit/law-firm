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
    <div className="d-flex flex-column gap-4 text-white">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
            Core Firm Disciplines
          </span>
          <h1 className="font-serif fs-2 fw-bold text-white mb-0">
            Practice Areas Manager
          </h1>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="btn btn-danger btn-crimson btn-sm fw-bold px-3 py-2 rounded-3 text-white d-flex align-items-center gap-1 shadow"
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            <span>Create Practice Discipline</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success bg-nepal-surface border border-sakura text-white p-3 rounded-3 d-flex align-items-center gap-2 shadow small mb-0">
          <CheckCircle2 className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Grid of Practice Areas */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 py-5 text-center text-white-50">
            <div className="spinner-border text-danger spinner-border-sm mb-2" role="status"></div>
            <div>Loading practice disciplines...</div>
          </div>
        ) : practiceAreas.map((area) => (
          <div key={area.id} className="col-12 col-md-6 col-lg-4">
            <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white d-flex flex-column justify-content-between h-100 hover-border-crimson">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-dark border border-sakura text-crimson"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <Scale style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    {area.is_featured && (
                      <span className="badge bg-crimson text-white" style={{ fontSize: '9px' }}>
                        Core
                      </span>
                    )}
                    {area.parent && (
                      <span className="badge bg-nepal-blue text-white" style={{ fontSize: '9px' }}>
                        Sub-practice
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-serif fs-5 fw-bold text-white mb-0">
                  {area.title}
                </h3>

                <p className="text-white-50 small line-clamp-3 mb-0 lh-base">
                  {area.short_summary}
                </p>

                {area.attorneys && area.attorneys.length > 0 && (
                  <div className="pt-2 text-white fw-bold d-flex align-items-center gap-1 small" style={{ fontSize: '11px' }}>
                    <Users className="text-crimson" style={{ width: '14px', height: '14px' }} />
                    <span>{area.attorneys.length} Dedicated Attorney{area.attorneys.length > 1 ? 's' : ''} Assigned</span>
                  </div>
                )}
              </div>

              {/* Actions Bar */}
              <div className="pt-3 mt-3 border-top border-sakura d-flex align-items-center justify-content-between small">
                <a
                  href={`/practice-areas/${area.slug}`}
                  target="_blank"
                  className="text-crimson text-decoration-none fw-bold d-flex align-items-center gap-1 hover-white"
                >
                  <Eye style={{ width: '14px', height: '14px' }} />
                  <span>View Public Page</span>
                </a>

                <div className="d-flex align-items-center gap-1">
                  <button
                    onClick={() => openEditModal(area)}
                    className="btn btn-outline-light btn-sm p-1 border-sakura"
                    title="Edit Practice Area"
                  >
                    <Edit style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button
                    onClick={() => handleDelete(area.id, area.title)}
                    className="btn btn-outline-danger btn-sm p-1 border-crimson"
                    title="Delete Practice Area"
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
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
                    CMS Practice Area Editor
                  </span>
                  <h3 className="modal-title font-serif fs-4 fw-bold text-white">
                    {editingArea ? `Edit: ${editingArea.title}` : 'Create New Practice Discipline'}
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
                
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Discipline Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Antitrust & Competition"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Parent Practice Area (Optional)
                    </label>
                    <select
                      value={parentId || ''}
                      onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                      className="form-select cursor-pointer"
                    >
                      <option value="">None (Top-Level Discipline)</option>
                      {practiceAreas.filter(p => !editingArea || p.id !== editingArea.id).map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="form-label text-uppercase fw-bold text-white small mb-1" style={{ fontSize: '11px' }}>
                    Prestige Icon Symbol
                  </label>
                  <div className="row g-2">
                    {availableIcons.map((ic) => (
                      <div key={ic.name} className="col-6 col-sm-3">
                        <button
                          type="button"
                          onClick={() => setIcon(ic.name)}
                          className={`btn btn-sm w-100 d-flex align-items-center gap-1 p-2 rounded-2 fw-bold text-truncate ${
                            icon === ic.name 
                              ? 'btn-primary text-white border-crimson' 
                              : 'btn-outline-light border-sakura text-white-50'
                          }`}
                          style={{ fontSize: '11px' }}
                        >
                          <Scale className="text-crimson flex-shrink-0" style={{ width: '14px', height: '14px' }} />
                          <span className="text-truncate">{ic.label}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Short Summary */}
                <div>
                  <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                    Short Executive Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="One sentence overview for cards and meta descriptions..."
                    value={shortSummary}
                    onChange={(e) => setShortSummary(e.target.value)}
                    className="form-control"
                  />
                </div>

                {/* Long Description */}
                <div>
                  <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                    Full Strategic Practice Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    placeholder="Detailed regulatory scope, trial capabilities, and client representation details..."
                  ></textarea>
                </div>

                {/* Featured Toggle */}
                <div className="form-check pt-1">
                  <input
                    type="checkbox"
                    id="featured-toggle"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="form-check-input"
                  />
                  <label htmlFor="featured-toggle" className="form-check-label text-white small fw-bold">
                    Featured Core Practice (Highlighted on Homepage & Header)
                  </label>
                </div>

                {/* Submit Buttons */}
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
                    {modalLoading ? 'Saving...' : (editingArea ? 'Update Practice Discipline' : 'Publish Practice Discipline')}
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
