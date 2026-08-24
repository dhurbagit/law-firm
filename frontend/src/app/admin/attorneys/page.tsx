'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  getAdminAttorneys, 
  createAttorney, 
  updateAttorney, 
  deleteAttorney, 
  getAdminPracticeAreas, 
  uploadFile, 
  Attorney, 
  PracticeArea 
} from '@/lib/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X, 
  Upload, 
  Scale, 
  Eye,
  Check
} from 'lucide-react';

export default function AttorneysManagementPage() {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttorney, setEditingAttorney] = useState<Attorney | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [barAdmissions, setBarAdmissions] = useState<string[]>([]);
  const [newBarInput, setNewBarInput] = useState('');
  const [education, setEducation] = useState<string[]>([]);
  const [newEduInput, setNewEduInput] = useState('');
  const [selectedPracticeIds, setSelectedPracticeIds] = useState<number[]>([]);

  const fetchAttorneysData = useCallback(async () => {
    const token = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'))
      : null;

    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const [attRes, pracRes] = await Promise.all([
        getAdminAttorneys(token),
        getAdminPracticeAreas(token),
      ]);
      if (attRes.data) setAttorneys(attRes.data);
      if (pracRes.data) setPracticeAreas(pracRes.data);
    } catch (err) {
      console.error('Failed to load attorneys:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttorneysData();
  }, [fetchAttorneysData]);

  const openCreateModal = () => {
    setEditingAttorney(null);
    setName('');
    setDesignation('');
    setEmail('');
    setPhone('');
    setPhotoUrl('');
    setBio('');
    setIsActive(true);
    setBarAdmissions([]);
    setEducation([]);
    setSelectedPracticeIds([]);
    setModalOpen(true);
  };

  const openEditModal = (attorney: Attorney) => {
    setEditingAttorney(attorney);
    setName(attorney.name);
    setDesignation(attorney.designation);
    setEmail(attorney.email);
    setPhone(attorney.phone || '');
    setPhotoUrl(attorney.photo_url || '');
    setBio(attorney.bio);
    setIsActive(attorney.is_active);
    setBarAdmissions(attorney.bar_admissions || []);
    setEducation(attorney.education || []);
    setSelectedPracticeIds(attorney.practice_areas ? attorney.practice_areas.map(p => p.id) : []);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    setUploadingImage(true);
    try {
      const res = await uploadFile(token, files[0]);
      if (res.success && res.url) {
        setPhotoUrl(res.url);
      }
    } catch (err) {
      alert('Failed to upload image: ' + err);
    } finally {
      setUploadingImage(false);
    }
  };

  const addBarAdmission = () => {
    if (newBarInput.trim() && !barAdmissions.includes(newBarInput.trim())) {
      setBarAdmissions([...barAdmissions, newBarInput.trim()]);
      setNewBarInput('');
    }
  };

  const removeBarAdmission = (index: number) => {
    setBarAdmissions(barAdmissions.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (newEduInput.trim() && !education.includes(newEduInput.trim())) {
      setEducation([...education, newEduInput.trim()]);
      setNewEduInput('');
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const togglePracticeArea = (id: number) => {
    if (selectedPracticeIds.includes(id)) {
      setSelectedPracticeIds(selectedPracticeIds.filter(item => item !== id));
    } else {
      setSelectedPracticeIds([...selectedPracticeIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    setModalLoading(true);

    const payload = {
      name,
      designation,
      email,
      phone,
      photo_url: photoUrl,
      bio,
      is_active: isActive,
      bar_admissions: barAdmissions,
      education: education,
      practice_area_ids: selectedPracticeIds,
    };

    try {
      if (editingAttorney) {
        const res = await updateAttorney(token, editingAttorney.id, payload);
        if (res.success) {
          setAlertMsg(`Attorney "${name}" updated successfully.`);
          setModalOpen(false);
          fetchAttorneysData();
        }
      } else {
        const res = await createAttorney(token, payload);
        if (res.success) {
          setAlertMsg(`Attorney "${name}" created successfully.`);
          setModalOpen(false);
          fetchAttorneysData();
        }
      }
    } catch (err) {
      alert('Failed to save attorney: ' + err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number, attorneyName: string) => {
    if (!confirm(`Are you sure you want to delete ${attorneyName}?`)) return;
    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await deleteAttorney(token, id);
      if (res.success) {
        setAlertMsg(`Attorney "${attorneyName}" deleted.`);
        fetchAttorneysData();
      }
    } catch {
      setAlertMsg('Failed to delete attorney.');
    }
  };

  return (
    <div className="d-flex flex-column gap-4 text-white">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
            Staff & Leadership Roster
          </span>
          <h1 className="font-serif fs-2 fw-bold text-white mb-0">
            Attorneys & Partners Management
          </h1>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="btn btn-danger btn-crimson btn-sm fw-bold px-3 py-2 rounded-3 text-white d-flex align-items-center gap-1 shadow"
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            <span>Add New Attorney</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success bg-nepal-surface border border-sakura text-white p-3 rounded-3 d-flex align-items-center gap-2 shadow small mb-0">
          <CheckCircle2 className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Grid of Attorneys */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 py-5 text-center text-white-50">
            <div className="spinner-border text-danger spinner-border-sm mb-2" role="status"></div>
            <div>Loading attorney profiles...</div>
          </div>
        ) : attorneys.map((attorney) => (
          <div key={attorney.id} className="col-12 col-md-6 col-lg-4">
            <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 shadow-lg text-white d-flex flex-column justify-content-between h-100 hover-border-crimson">
              <div className="d-flex flex-column gap-3">
                
                {/* Photo & Status Badge */}
                <div className="d-flex align-items-start gap-3">
                  <div 
                    className="position-relative rounded-3 bg-nepal-dark border border-sakura overflow-hidden flex-shrink-0"
                    style={{ width: '64px', height: '64px' }}
                  >
                    {attorney.photo_url ? (
                      <Image
                        src={attorney.photo_url}
                        alt={attorney.name}
                        fill
                        className="object-fit-cover object-fit-top"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white">
                        <Scale className="text-crimson" style={{ width: '24px', height: '24px' }} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="text-uppercase text-crimson fw-bold small text-truncate" style={{ fontSize: '10px' }}>
                        {attorney.designation}
                      </span>
                      <span className={`badge ${attorney.is_active ? 'bg-nepal-blue text-white' : 'bg-secondary text-white'}`} style={{ fontSize: '9px' }}>
                        {attorney.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="font-serif fs-5 fw-bold text-white mb-0 text-truncate">
                      {attorney.name}
                    </h3>
                    <div className="text-white-50 small text-truncate" style={{ fontSize: '11px' }}>{attorney.email}</div>
                  </div>
                </div>

                {/* Practice Areas Assigned */}
                {attorney.practice_areas && attorney.practice_areas.length > 0 && (
                  <div className="d-flex flex-wrap gap-1">
                    {attorney.practice_areas.map((p) => (
                      <span 
                        key={p.id}
                        className="badge bg-nepal-dark border border-sakura text-white-50"
                        style={{ fontSize: '10px' }}
                      >
                        {p.title}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-white-50 small line-clamp-3 mb-0 lh-base">
                  {attorney.bio}
                </p>

              </div>

              {/* Actions Bar */}
              <div className="pt-3 mt-3 border-top border-sakura d-flex align-items-center justify-content-between small">
                <a
                  href={`/attorneys/${attorney.slug}`}
                  target="_blank"
                  className="text-crimson text-decoration-none fw-bold d-flex align-items-center gap-1 hover-white"
                >
                  <Eye style={{ width: '14px', height: '14px' }} />
                  <span>View Bio</span>
                </a>

                <div className="d-flex align-items-center gap-1">
                  <button
                    onClick={() => openEditModal(attorney)}
                    className="btn btn-outline-light btn-sm p-1 border-sakura"
                    title="Edit Attorney"
                  >
                    <Edit style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button
                    onClick={() => handleDelete(attorney.id, attorney.name)}
                    className="btn btn-outline-danger btn-sm p-1 border-crimson"
                    title="Delete Attorney"
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
            <div className="modal-content bg-nepal-surface border border-sakura rounded-4 text-white p-3 p-md-4 shadow-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
              
              {/* Modal Header */}
              <div className="modal-header border-bottom border-sakura pb-3">
                <div>
                  <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                    CMS Attorney Editor
                  </span>
                  <h3 className="modal-title font-serif fs-4 fw-bold text-white">
                    {editingAttorney ? `Edit: ${editingAttorney.name}` : 'Add New Attorney Profile'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-close btn-close-white"
                  aria-label="Close"
                ></button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="modal-body py-4 d-flex flex-column gap-3">
                
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jonathan Sterling, Esq."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Title / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Managing Partner"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. j.sterling@apexlegal.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                      Direct Telephone
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +1 (212) 890-4401"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Photo Uploader Widget */}
                <div className="p-3 rounded-3 bg-nepal-dark border border-sakura d-flex flex-column gap-2">
                  <label className="form-label text-uppercase fw-bold text-white small mb-0" style={{ fontSize: '11px' }}>
                    Attorney Headshot Image
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="position-relative rounded-3 bg-nepal-surface border border-sakura overflow-hidden flex-shrink-0"
                      style={{ width: '64px', height: '64px' }}
                    >
                      {photoUrl ? (
                        <Image src={photoUrl} alt="Preview" fill className="object-fit-cover object-fit-top" />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white-50" style={{ fontSize: '10px' }}>No Photo</div>
                      )}
                    </div>
                    
                    <div className="flex-grow-1 d-flex flex-column gap-2">
                      <input
                        type="text"
                        placeholder="Photo URL or upload below..."
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="form-control form-control-sm"
                      />
                      <label className="btn btn-outline-light btn-sm fw-bold border-sakura d-inline-flex align-items-center gap-1 align-self-start">
                        <Upload className="text-crimson" style={{ width: '14px', height: '14px' }} />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Headshot File'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="d-none"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px' }}>
                    Full Biography & Experience *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="form-control"
                    placeholder="Detailed background, notable litigation, judicial clerkships, and trial philosophy..."
                  ></textarea>
                </div>

                {/* Dynamic Bar Admissions Tags */}
                <div className="p-3 rounded-3 bg-nepal-dark border border-sakura d-flex flex-column gap-2">
                  <label className="form-label text-uppercase fw-bold text-white small mb-0" style={{ fontSize: '11px' }}>
                    Bar Admissions & Federal Courts
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. New York State Bar (1996)"
                      value={newBarInput}
                      onChange={(e) => setNewBarInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBarAdmission(); }}}
                      className="form-control form-control-sm"
                    />
                    <button
                      type="button"
                      onClick={addBarAdmission}
                      className="btn btn-outline-light btn-sm fw-bold border-sakura"
                    >
                      Add Bar
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {barAdmissions.map((bar, index) => (
                      <span key={index} className="badge bg-nepal-surface border border-sakura text-white d-inline-flex align-items-center gap-1 p-2">
                        <span>{bar}</span>
                        <X style={{ width: '12px', height: '12px', cursor: 'pointer' }} onClick={() => removeBarAdmission(index)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dynamic Education Tags */}
                <div className="p-3 rounded-3 bg-nepal-dark border border-sakura d-flex flex-column gap-2">
                  <label className="form-label text-uppercase fw-bold text-white small mb-0" style={{ fontSize: '11px' }}>
                    Education & Law Degrees
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. J.D., Columbia Law School"
                      value={newEduInput}
                      onChange={(e) => setNewEduInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEducation(); }}}
                      className="form-control form-control-sm"
                    />
                    <button
                      type="button"
                      onClick={addEducation}
                      className="btn btn-outline-light btn-sm fw-bold border-sakura"
                    >
                      Add Degree
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {education.map((edu, index) => (
                      <span key={index} className="badge bg-nepal-surface border border-sakura text-white d-inline-flex align-items-center gap-1 p-2">
                        <span>{edu}</span>
                        <X style={{ width: '12px', height: '12px', cursor: 'pointer' }} onClick={() => removeEducation(index)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practice Areas Pivot Assignment */}
                <div className="p-3 rounded-3 bg-nepal-dark border border-sakura d-flex flex-column gap-2">
                  <label className="form-label text-uppercase fw-bold text-white small mb-0" style={{ fontSize: '11px' }}>
                    Assign Practice Group Disciplines
                  </label>
                  <div className="row g-2">
                    {practiceAreas.map((area) => {
                      const isSelected = selectedPracticeIds.includes(area.id);
                      return (
                        <div key={area.id} className="col-12 col-sm-6">
                          <button
                            type="button"
                            onClick={() => togglePracticeArea(area.id)}
                            className={`btn btn-sm w-100 text-start d-flex align-items-center justify-content-between p-2 rounded-2 fw-bold ${
                              isSelected ? 'btn-primary text-white border-crimson shadow-sm' : 'btn-outline-light border-sakura text-white-50'
                            }`}
                            style={{ fontSize: '11px' }}
                          >
                            <span className="text-truncate">{area.title}</span>
                            {isSelected && <Check className="text-crimson" style={{ width: '14px', height: '14px' }} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="form-check pt-2">
                  <input
                    type="checkbox"
                    id="active-toggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="form-check-input"
                  />
                  <label htmlFor="active-toggle" className="form-check-label text-white small fw-bold">
                    Publicly Active Profile (Displayed on Firm Website)
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
                    {modalLoading ? 'Saving Profile...' : (editingAttorney ? 'Update Attorney Profile' : 'Publish Attorney Profile')}
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
