'use client';

import React, { useState } from 'react';
import { submitConsultation, ConsultationPayload } from '@/lib/api';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Shield, 
  Phone, 
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
        setValidationErrors({});
      } else {
        setErrorMessage(response.message || 'Failed to submit case inquiry.');
        if (response.errors) {
          setValidationErrors(response.errors);
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('A network error occurred while sending your request. Please call our direct hotline at (212) 890-4400.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="case-evaluation" className="relative rounded-2xl bg-[#0B192C]/90 border border-[#C5A880]/30 shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
      {/* Top Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172A45] border border-[#C5A880]/30 text-[#DFC7A5] text-xs font-semibold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Strictly Confidential & Privileged</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
          {title}
        </h3>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Success State Confirmation Alert */}
      {successMessage && (
        <div className="mb-8 p-6 rounded-xl bg-[#063220] border border-emerald-500/40 text-white animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-lg text-emerald-300">
                Inquiry Received (File #{submittedId})
              </h4>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-2 text-xs text-emerald-200/80 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected under Preliminary Attorney-Client Confidentiality.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-white flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-red-200">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Legal Name <span className="text-[#C5A880]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#0A192F] border ${validationErrors.full_name ? 'border-red-500' : 'border-[#1E2D4A]'} focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-white placeholder-slate-500 text-sm outline-none transition`}
            />
            {validationErrors.full_name && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.full_name[0]}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address <span className="text-[#C5A880]">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. client@enterprise.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#0A192F] border ${validationErrors.email ? 'border-red-500' : 'border-[#1E2D4A]'} focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-white placeholder-slate-500 text-sm outline-none transition`}
            />
            {validationErrors.email && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.email[0]}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Direct Phone Number <span className="text-[#C5A880]">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +1 (212) 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-[#0A192F] border ${validationErrors.phone ? 'border-red-500' : 'border-[#1E2D4A]'} focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-white placeholder-slate-500 text-sm outline-none transition`}
            />
            {validationErrors.phone && (
              <p className="text-xs text-red-400 mt-1">{validationErrors.phone[0]}</p>
            )}
          </div>

          {/* Practice Area Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Practice Discipline <span className="text-[#C5A880]">*</span>
            </label>
            <select
              value={formData.practice_area_id || ''}
              onChange={(e) => setFormData({ ...formData, practice_area_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-4 py-3 rounded-lg bg-[#0A192F] border border-[#1E2D4A] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-white text-sm outline-none transition cursor-pointer"
            >
              <option value="" className="bg-[#0B192C] text-slate-300">General Legal Consultation</option>
              {practiceAreas.map((area) => (
                <option key={area.id} value={area.id} className="bg-[#0B192C] text-white py-1">
                  {area.title}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Case Details */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Summary of Legal Matter <span className="text-[#C5A880]">*</span>
            </label>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              Do not disclose highly sensitive passwords/secrets
            </span>
          </div>
          <textarea
            required
            rows={4}
            placeholder="Please provide an overview of your situation, relevant dates, and the specific assistance you require..."
            value={formData.case_details}
            onChange={(e) => setFormData({ ...formData, case_details: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg bg-[#0A192F] border ${validationErrors.case_details ? 'border-red-500' : 'border-[#1E2D4A]'} focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] text-white placeholder-slate-500 text-sm outline-none transition resize-none`}
          ></textarea>
          {validationErrors.case_details && (
            <p className="text-xs text-red-400 mt-1">{validationErrors.case_details[0]}</p>
          )}
        </div>

        {/* Disclaimer Checkbox / Notice */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            required
            id="agreement-checkbox"
            defaultChecked
            className="mt-1 accent-[#C5A880] rounded"
          />
          <label htmlFor="agreement-checkbox" className="text-xs text-slate-400 leading-relaxed">
            I understand that submitting this inquiry does not create an attorney-client relationship until a formal retainer agreement is executed. All communications are strictly confidential.
          </label>
        </div>

        {/* Action Button & Hotline Alternative */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg text-sm font-bold text-[#0A192F] bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] hover:brightness-110 shadow-lg shadow-[#C5A880]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0A192F]" />
                <span>Transmitting Securely...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#0A192F]" />
                <span>Request Case Evaluation</span>
              </>
            )}
          </button>

          <a 
            href="tel:12128904400"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#C5A880] transition"
          >
            <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Prefer to call? <strong>(212) 890-4400</strong></span>
          </a>
        </div>
      </form>
    </div>
  );
}
