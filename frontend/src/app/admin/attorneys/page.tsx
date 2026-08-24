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
    <div className="space-y-6 font-sans bg-[#000000] text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-1 font-sans">
            Staff & Leadership Roster
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
            Attorneys & Partners Management
          </h1>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B00E2F] text-xs font-bold text-white shadow-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Attorney</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-xl bg-[#001C4A] border border-[#003893] text-xs text-white flex items-center gap-2 animate-in fade-in font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Grid of Attorneys */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-[#DC143C] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>Loading attorney profiles...</span>
          </div>
        ) : attorneys.map((attorney) => (
          <div 
            key={attorney.id}
            className="p-6 rounded-2xl bg-[#00122E] border border-[#003893] flex flex-col justify-between space-y-4 shadow-xl hover:border-[#DC143C] transition group"
          >
            <div className="space-y-4">
              
              {/* Photo & Status Badge */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#000000] border border-[#003893] overflow-hidden relative flex-shrink-0">
                  {attorney.photo_url ? (
                    <Image
                      src={attorney.photo_url}
                      alt={attorney.name}
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <Scale className="w-6 h-6 text-[#DC143C]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC143C] block truncate">
                      {attorney.designation}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      attorney.is_active ? 'bg-[#003893] text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {attorney.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white truncate group-hover:text-[#DC143C]">
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
                      className="px-2 py-0.5 rounded bg-[#001C4A] text-[10px] text-slate-200 border border-[#003893]/40"
                    >
                      {p.title}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans">
                {attorney.bio}
              </p>

            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#003893]/40 flex items-center justify-between font-sans">
              <a
                href={`/attorneys/${attorney.slug}`}
                target="_blank"
                className="text-xs text-[#DC143C] hover:text-white flex items-center gap-1 font-bold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Bio</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(attorney)}
                  className="p-1.5 rounded-lg bg-[#001C4A] hover:bg-[#003893] text-white transition cursor-pointer"
                  title="Edit Attorney"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(attorney.id, attorney.name)}
                  className="p-1.5 rounded-lg bg-[#DC143C]/30 hover:bg-[#DC143C] text-white transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-3xl bg-[#00122E] border border-[#003893] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC143C] block mb-1">
                  CMS Attorney Editor
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {editingAttorney ? `Edit: ${editingAttorney.name}` : 'Add New Attorney Profile'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-[#001C4A] text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-200 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jonathan Sterling, Esq."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#000000] border border-[#003893] text-white text-xs outline-none focus:border-[#DC143C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-200 mb-1">
                    Title / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Managing Partner"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#000000] border border-[#003893] text-white text-xs outline-none focus:border-[#DC143C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-200 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. j.sterling@apexlegal.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#000000] border border-[#003893] text-white text-xs outline-none focus:border-[#DC143C]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-200 mb-1">
                    Direct Telephone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +1 (212) 890-4401"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#000000] border border-[#003893] text-white text-xs outline-none focus:border-[#DC143C]"
                  />
                </div>
              </div>

              {/* Photo Uploader Widget */}
              <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/40 space-y-3">
                <label className="block text-xs uppercase font-bold text-slate-200">
                  Attorney Headshot Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#001C4A] border border-[#003893] overflow-hidden relative flex-shrink-0">
                    {photoUrl ? (
                      <Image src={photoUrl} alt="Preview" fill className="object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Photo</div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Photo URL or upload below..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#000000] border border-[#003893] text-white text-xs outline-none focus:border-[#DC143C]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001C4A] hover:bg-[#003893] border border-[#003893] text-white text-xs cursor-pointer font-bold">
                      <Upload className="w-3.5 h-3.5 text-[#DC143C]" />
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
                <label className="block text-xs uppercase font-bold text-slate-200 mb-1">
                  Full Biography & Experience *
                </label>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#000000] border border-[#003893] text-white text-xs outline-none focus:border-[#DC143C] resize-none"
                  placeholder="Detailed background, notable litigation, judicial clerkships, and trial philosophy..."
                ></textarea>
              </div>

              {/* Dynamic Bar Admissions Tags */}
              <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/40 space-y-2">
                <label className="block text-xs uppercase font-bold text-slate-200">
                  Bar Admissions & Federal Courts
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. New York State Bar (1996)"
                    value={newBarInput}
                    onChange={(e) => setNewBarInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBarAdmission(); }}}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#000000] border border-[#003893] text-white text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addBarAdmission}
                    className="px-3 py-2 rounded-lg bg-[#001C4A] text-white text-xs font-bold"
                  >
                    Add Bar
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {barAdmissions.map((bar, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#001C4A] text-xs text-white">
                      <span>{bar}</span>
                      <X className="w-3 h-3 cursor-pointer hover:text-[#DC143C]" onClick={() => removeBarAdmission(index)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Education Tags */}
              <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/40 space-y-2">
                <label className="block text-xs uppercase font-bold text-slate-200">
                  Education & Law Degrees
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. J.D., Columbia Law School"
                    value={newEduInput}
                    onChange={(e) => setNewEduInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEducation(); }}}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#000000] border border-[#003893] text-white text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-3 py-2 rounded-lg bg-[#001C4A] text-white text-xs font-bold"
                  >
                    Add Degree
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {education.map((edu, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#001C4A] text-xs text-white">
                      <span>{edu}</span>
                      <X className="w-3 h-3 cursor-pointer hover:text-[#DC143C]" onClick={() => removeEducation(index)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Practice Areas Pivot Assignment */}
              <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/40 space-y-2">
                <label className="block text-xs uppercase font-bold text-slate-200">
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
                        className={`px-3 py-2 rounded-lg text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#003893] text-white border border-[#DC143C]'
                            : 'bg-[#001C4A] text-slate-300 border border-transparent'
                        }`}
                      >
                        <span className="truncate">{area.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#DC143C]" />}
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
                  className="accent-[#DC143C] w-4 h-4"
                />
                <label htmlFor="active-toggle" className="text-xs text-slate-200 font-bold cursor-pointer">
                  Publicly Active Profile (Displayed on Firm Website)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#003893]/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#001C4A] text-slate-200 text-xs font-bold hover:bg-[#003893] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B00E2F] text-white text-xs font-bold shadow-lg shadow-[#DC143C]/20 cursor-pointer disabled:opacity-50"
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
