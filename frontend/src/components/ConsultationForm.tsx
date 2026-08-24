'use client';

import React, { useState } from 'react';
import { submitConsultation, ConsultationPayload } from '@/lib/api';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Shield, 
  Lock, 
  HelpCircle 
} from 'lucide-react';

interface ConsultationFormProps {
  defaultPracticeAreaId?: number;
  practiceAreas?: { id: number; title: string }[];
  title?: string;
  subtitle?: string;
  sourceContext?: string;
}

export function ConsultationForm({
  defaultPracticeAreaId,
  practiceAreas = [
    { id: 1, title: 'Corporate Law & M&A' },
    { id: 3, title: 'Personal Injury & Catastrophic Harm' },
    { id: 5, title: 'Intellectual Property & Patents' },
    { id: 6, title: 'White Collar & Investigations' },
    { id: 7, title: 'Commercial Real Estate & Land Use' },
    { id: 8, title: 'Executive Employment & Labor' },
    { id: 2, title: 'Antitrust & Competition' },
    { id: 4, title: 'Medical Malpractice & Pharma' },
  ],
  title = "Confidential Case Evaluation",
  subtitle = "Discuss your legal matter directly with our senior attorneys. Strict attorney-client privilege applies.",
  sourceContext = "website",
}: ConsultationFormProps) {
  const [formData, setFormData] = useState<ConsultationPayload>({
    full_name: '',
    email: '',
    phone: '',
    practice_area_id: defaultPracticeAreaId ?? 1,
    case_details: '',
    source: sourceContext,
  });

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const validate = (): boolean => {
    const errors: Record<string, string[]> = {};

    if (!formData.full_name.trim()) {
      errors.full_name = ['Full legal name is required.'];
    }

    if (!formData.email.trim()) {
      errors.email = ['Email address is required.'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ['Please provide a valid email format.'];
    }

    if (!formData.phone.trim()) {
      errors.phone = ['Telephone number is required for follow-up.'];
    }

    if (!formData.case_details.trim() || formData.case_details.trim().length < 10) {
      errors.case_details = ['Please provide at least 10 characters detailing your legal inquiry.'];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await submitConsultation({
        ...formData,
        practice_area_id: formData.practice_area_id ? Number(formData.practice_area_id) : null,
      });

      if (response.success) {
        setSubmittedId(response.lead_id || 1);
        setSuccessMessage(response.message || 'Your consultation inquiry has been transmitted securely.');
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          practice_area_id: defaultPracticeAreaId ?? 1,
          case_details: '',
          source: sourceContext,
        });
      } else {
        setErrorMessage(response.message || 'We could not process your inquiry at this time.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
        setErrorMessage('Please correct the marked errors below.');
      } else {
        setErrorMessage(error.response?.data?.message || 'A network error occurred. Please call our hotline.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="case-evaluation" className="relative rounded-2xl bg-[#00122E] border border-[#003893] shadow-2xl p-6 sm:p-10 backdrop-blur-xl font-sans">
      {/* Top Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001C4A] border border-[#003893] text-white text-xs font-bold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5 text-[#DC143C]" />
          <span>Strictly Confidential & Privileged</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
          {title}
        </h3>
        <p className="text-slate-300 text-sm mt-2 leading-relaxed font-sans">
          {subtitle}
        </p>
      </div>

      {/* Success State Alert */}
      {successMessage && (
        <div className="mb-8 p-6 rounded-xl bg-[#001C4A] border border-[#003893] text-white animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-7 h-7 text-[#DC143C] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-lg text-white">
                Inquiry Received (File #{submittedId})
              </h4>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-sans">
                {successMessage}
              </p>
              <div className="pt-2 text-xs text-slate-300 flex items-center gap-2 font-sans">
                <Lock className="w-3.5 h-3.5 text-[#003893]" />
                <span>Protected under Preliminary Attorney-Client Confidentiality.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#000000] border border-[#DC143C] text-white flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#DC143C] flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-200 font-sans">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-5 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Full Legal Name <span className="text-[#DC143C]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#000000] border ${validationErrors.full_name ? 'border-[#DC143C]' : 'border-[#003893]/60'} focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] text-white placeholder-slate-500 text-sm outline-none transition font-sans`}
            />
            {validationErrors.full_name && (
              <p className="text-xs text-[#DC143C] mt-1 font-sans">{validationErrors.full_name[0]}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Email Address <span className="text-[#DC143C]">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. client@enterprise.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#000000] border ${validationErrors.email ? 'border-[#DC143C]' : 'border-[#003893]/60'} focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] text-white placeholder-slate-500 text-sm outline-none transition font-sans`}
            />
            {validationErrors.email && (
              <p className="text-xs text-[#DC143C] mt-1 font-sans">{validationErrors.email[0]}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Direct Phone Number <span className="text-[#DC143C]">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +1 (212) 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#000000] border ${validationErrors.phone ? 'border-[#DC143C]' : 'border-[#003893]/60'} focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] text-white placeholder-slate-500 text-sm outline-none transition font-sans`}
            />
            {validationErrors.phone && (
              <p className="text-xs text-[#DC143C] mt-1 font-sans">{validationErrors.phone[0]}</p>
            )}
          </div>

          {/* Practice Area Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Practice Discipline <span className="text-[#DC143C]">*</span>
            </label>
            <select
              value={formData.practice_area_id || ''}
              onChange={(e) => setFormData({ ...formData, practice_area_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-4 py-3 rounded-lg bg-[#000000] border border-[#003893]/60 focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] text-white text-sm outline-none transition cursor-pointer font-sans"
            >
              <option value="" className="bg-[#000000] text-slate-300">General Legal Consultation</option>
              {practiceAreas.map((area) => (
                <option key={area.id} value={area.id} className="bg-[#000000] text-white py-1">
                  {area.title}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Case Details */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
            Brief Summary of Legal Matter <span className="text-[#DC143C]">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Please detail key parties involved, dates, jurisdictions, and goals..."
            value={formData.case_details}
            onChange={(e) => setFormData({ ...formData, case_details: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg bg-[#000000] border ${validationErrors.case_details ? 'border-[#DC143C]' : 'border-[#003893]/60'} focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] text-white placeholder-slate-500 text-sm outline-none transition resize-none font-sans`}
          />
          {validationErrors.case_details && (
            <p className="text-xs text-[#DC143C] mt-1 font-sans">{validationErrors.case_details[0]}</p>
          )}
        </div>

        {/* Confidentiality Notice */}
        <div className="p-4 rounded-xl bg-[#001C4A]/50 border border-[#003893]/40 flex items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
            <span>Encrypted 256-bit transmission to Apex Senior Partners.</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-white font-bold">
            <HelpCircle className="w-4 h-4 text-[#003893]" />
            <span>No fee unless we win</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-base font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] border border-white/20 shadow-xl shadow-[#DC143C]/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Transmitting Privileged Intake...</span>
            </>
          ) : (
            <>
              <span>Submit for Immediate Review</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
