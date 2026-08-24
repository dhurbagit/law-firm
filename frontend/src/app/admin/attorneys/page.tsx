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
      setSelectedPracticeIds(selectedPracticeIds.filter(pid => pid !== id));
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
          setAlertMsg(`Attorney profile for ${name} updated successfully.`);
          setModalOpen(false);
          fetchAttorneysData();
        }
      } else {
        const res = await createAttorney(token, payload);
        if (res.success) {
          setAlertMsg(`Attorney profile for ${name} created successfully.`);
          setModalOpen(false);
          fetchAttorneysData();
        }
      }
    } catch (err: unknown) {
      alert('Error saving attorney: ' + err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number, attorneyName: string) => {
    if (!confirm(`Are you sure you want to delete the attorney record for "${attorneyName}"?`)) return;

    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await deleteAttorney(token, id);
      if (res.success) {
        setAlertMsg(`Attorney "${attorneyName}" removed.`);
        fetchAttorneysData();
      }
    } catch (err) {
      alert('Failed to delete attorney: ' + err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A880] block mb-1">
            Personnel & Partner Profiles
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            Attorneys Directory Manager
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] text-[#0A192F] text-xs font-bold shadow-lg shadow-[#C5A880]/20 transition hover:brightness-110 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Attorney</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Grid of Attorneys */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>Loading attorney profiles...</span>
          </div>
        ) : attorneys.map((attorney) => (
          <div 
            key={attorney.id}
            className="p-6 rounded-2xl bg-[#0B192C] border border-[#C5A880]/20 flex flex-col justify-between space-y-4 shadow-xl hover:border-[#C5A880]/40 transition group"
          >
            <div className="space-y-4">
              
              {/* Photo & Status Badge */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#0A192F] border border-[#C5A880]/30 overflow-hidden relative flex-shrink-0">
                  {attorney.photo_url ? (
                    <Image
                      src={attorney.photo_url}
                      alt={attorney.name}
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C5A880]">
                      <Scale className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] block truncate">
                      {attorney.designation}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      attorney.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      {attorney.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white truncate group-hover:text-[#DFC7A5]">
                    {attorney.name}
                  </h3>
                  <div className="text-xs text-slate-400 truncate mt-0.5">{attorney.email}</div>
                </div>
              </div>

              {/* Practice Areas Assigned */}
              {attorney.practice_areas && attorney.practice_areas.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {attorney.practice_areas.map((p) => (
                    <span 
                      key={p.id}
                      className="px-2 py-0.5 rounded bg-[#0A192F] text-[10px] text-slate-300 border border-white/5"
                    >
                      {p.title}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {attorney.bio}
              </p>

            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <a
                href={`/attorneys/${attorney.slug}`}
                target="_blank"
                className="text-xs text-[#C5A880] hover:text-[#DFC7A5] flex items-center gap-1 font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Bio</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(attorney)}
                  className="p-1.5 rounded-lg bg-[#172A45] hover:bg-[#1E2D4A] text-slate-300 hover:text-white transition cursor-pointer"
                  title="Edit Attorney"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(attorney.id, attorney.name)}
                  className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-300 transition cursor-pointer"
                  title="Delete Attorney"
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
          <div className="w-full max-w-3xl bg-[#0B192C] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                  CMS Attorney Editor
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {editingAttorney ? `Edit: ${editingAttorney.name}` : 'Add New Attorney Profile'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-[#172A45] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jonathan Sterling, Esq."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Title / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Managing Partner"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. j.sterling@apexlegal.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                    Direct Telephone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (212) 890-4401"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Photo Uploader Widget */}
              <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-3">
                <label className="block text-xs uppercase font-semibold text-slate-300">
                  Attorney Headshot Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#060D17] border border-[#C5A880]/30 overflow-hidden relative flex-shrink-0">
                    {photoUrl ? (
                      <Image src={photoUrl} alt="Preview" fill className="object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">No Photo</div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Photo URL or upload below..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#060D17] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172A45] hover:bg-[#1E2D4A] border border-[#C5A880]/30 text-slate-200 text-xs cursor-pointer font-medium">
                      <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Headshot File'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-300 mb-1">
                  Full Biography & Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A192F] border border-[#1E2D4A] text-white text-xs outline-none focus:border-[#C5A880] resize-none"
                  placeholder="Detailed background, notable litigation, judicial clerkships, and trial philosophy..."
                ></textarea>
              </div>

              {/* Dynamic Bar Admissions Tags */}
              <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-2">
                <label className="block text-xs uppercase font-semibold text-slate-300">
                  Bar Admissions & Federal Courts
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. New York State Bar (1996)"
                    value={newBarInput}
                    onChange={(e) => setNewBarInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBarAdmission(); }}}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#060D17] border border-[#1E2D4A] text-white text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addBarAdmission}
                    className="px-3 py-2 rounded-lg bg-[#172A45] text-slate-200 text-xs font-semibold"
                  >
                    Add Bar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {barAdmissions.map((bar, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#172A45] text-xs text-[#DFC7A5]">
                      <span>{bar}</span>
                      <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeBarAdmission(index)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Education Tags */}
              <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-2">
                <label className="block text-xs uppercase font-semibold text-slate-300">
                  Education & Law Degrees
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. J.D., Columbia Law School"
                    value={newEduInput}
                    onChange={(e) => setNewEduInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEducation(); }}}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#060D17] border border-[#1E2D4A] text-white text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-3 py-2 rounded-lg bg-[#172A45] text-slate-200 text-xs font-semibold"
                  >
                    Add Degree
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {education.map((edu, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#172A45] text-xs text-[#DFC7A5]">
                      <span>{edu}</span>
                      <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeEducation(index)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Practice Areas Pivot Assignment */}
              <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 space-y-2">
                <label className="block text-xs uppercase font-semibold text-slate-300">
                  Assign Practice Group Disciplines
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {practiceAreas.map((area) => {
                    const isSelected = selectedPracticeIds.includes(area.id);
                    return (
                      <button
                        type="button"
                        key={area.id}
                        onClick={() => togglePracticeArea(area.id)}
                        className={`px-3 py-2 rounded-lg text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#172A45] text-[#DFC7A5] border border-[#C5A880]/50'
                            : 'bg-[#060D17] text-slate-400 border border-transparent'
                        }`}
                      >
                        <span className="truncate">{area.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#C5A880] w-4 h-4"
                />
                <label htmlFor="active-toggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Publicly Active Profile (Displayed on Firm Website)
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
                  {modalLoading ? 'Saving Profile...' : (editingAttorney ? 'Update Attorney Profile' : 'Publish Attorney Profile')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
