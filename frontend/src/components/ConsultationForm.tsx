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
    <div id="case-evaluation" className="card-light rounded-4 p-4 p-md-5">
      {/* Top Header */}
      <div className="mb-4">
        <div className="badge-category d-inline-flex align-items-center gap-1 mb-3">
          <Shield style={{ width: '13px', height: '13px', color: '#DC143C' }} />
          <span>Strictly Confidential &amp; Privileged</span>
        </div>
        <h3 className="font-serif fs-2 fw-bold mb-2" style={{ color: '#001F54' }}>
          {title}
        </h3>
        <p className="small mb-0 lh-base" style={{ color: '#475569' }}>
          {subtitle}
        </p>
      </div>

      {/* Success State Alert */}
      {successMessage && (
        <div className="alert border rounded-3 mb-4 p-4" style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC !important' }}>
          <div className="d-flex align-items-start gap-3">
            <CheckCircle2 style={{ width: '24px', height: '24px', color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h5 className="font-serif fw-bold mb-1" style={{ color: '#001F54' }}>
                Inquiry Received (File #{submittedId})
              </h5>
              <p className="small mb-2 lh-base" style={{ color: '#475569' }}>
                {successMessage}
              </p>
              <div className="small d-flex align-items-center gap-1" style={{ color: '#64748B' }}>
                <Lock style={{ width: '13px', height: '13px', color: '#003893' }} />
                <span>Protected under Preliminary Attorney-Client Privilege.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="alert bg-crimson border-0 text-white d-flex align-items-center gap-2 p-3 rounded-3 mb-4">
          <AlertCircle style={{ width: '18px', height: '18px' }} />
          <span className="small fw-semibold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

        {/* Labels — use dark text for light card */}
        <style>{`
          #case-evaluation .form-label { color: #001F54 !important; }
          #case-evaluation .form-control,
          #case-evaluation .form-select {
            background-color: #F8FAFC;
            color: #0F172A;
            border: 1px solid #CBD5E1;
          }
          #case-evaluation .form-control:focus,
          #case-evaluation .form-select:focus {
            background-color: #FFFFFF;
            color: #0F172A;
            border-color: #DC143C;
            box-shadow: 0 0 0 0.2rem rgba(220,20,60,0.15);
          }
          #case-evaluation .form-control::placeholder {
            color: #94A3B8;
          }
        `}</style>
        
        {/* Row 1: Full Name & Email */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label text-uppercase fw-bold small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              Full Legal Name <span className="text-crimson">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Robert H. Montgomery"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className={`form-control ${validationErrors.full_name ? 'is-invalid border-crimson' : ''}`}
            />
            {validationErrors.full_name && (
              <div className="text-crimson small mt-1">{validationErrors.full_name[0]}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-uppercase fw-bold small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              Email Address <span className="text-crimson">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. r.montgomery@enterprise.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`form-control ${validationErrors.email ? 'is-invalid border-crimson' : ''}`}
            />
            {validationErrors.email && (
              <div className="text-crimson small mt-1">{validationErrors.email[0]}</div>
            )}
          </div>
        </div>

        {/* Row 2: Phone & Practice Area */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label text-uppercase fw-bold small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              Direct Telephone <span className="text-crimson">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. (212) 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`form-control ${validationErrors.phone ? 'is-invalid border-crimson' : ''}`}
            />
            {validationErrors.phone && (
              <div className="text-crimson small mt-1">{validationErrors.phone[0]}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-uppercase fw-bold small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              Primary Legal Area of Concern
            </label>
            <select
              value={formData.practice_area_id || ''}
              onChange={(e) => setFormData({ ...formData, practice_area_id: e.target.value ? Number(e.target.value) : null })}
              className="form-select cursor-pointer"
            >
              {practiceAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Case Details */}
        <div>
          <label className="form-label text-uppercase fw-bold small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
            Brief Summary of Legal Matter <span className="text-crimson">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Please detail key parties involved, dates, jurisdictions, and goals..."
            value={formData.case_details}
            onChange={(e) => setFormData({ ...formData, case_details: e.target.value })}
            className={`form-control ${validationErrors.case_details ? 'is-invalid border-crimson' : ''}`}
          />
          {validationErrors.case_details && (
            <div className="text-crimson small mt-1">{validationErrors.case_details[0]}</div>
          )}
        </div>

        <div className="p-3 rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-3 small" style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1 !important' }}>
          <div className="d-flex align-items-center gap-2" style={{ color: '#475569' }}>
            <Lock className="text-crimson flex-shrink-0" style={{ width: '15px', height: '15px' }} />
            <span>Encrypted 256-bit transmission to Apex Senior Partners.</span>
          </div>
          <div className="d-none d-sm-flex align-items-center gap-1 fw-bold" style={{ color: '#001F54' }}>
            <HelpCircle style={{ width: '15px', height: '15px', color: '#003893' }} />
            <span>No fee unless we win</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-danger btn-crimson btn-lg w-100 fw-bold py-3 rounded-3 shadow d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" style={{ width: '20px', height: '20px' }} />
              <span>Transmitting Privileged Intake...</span>
            </>
          ) : (
            <>
              <span>Submit for Immediate Review</span>
              <Send style={{ width: '16px', height: '16px' }} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
