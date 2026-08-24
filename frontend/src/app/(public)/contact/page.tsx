'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Navigation,
  Globe,
  Share2,
  Building,
  Award
} from 'lucide-react';
import { submitConsultation } from '@/lib/api';

export default function ContactPage() {
  const [activeOffice, setActiveOffice] = useState<'ny' | 'dc' | 'sf'>('ny');

  // Contact Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    practice_area_id: 1,
    inquiry_type: 'Case Evaluation',
    case_details: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const officeLocations = {
    ny: {
      city: 'New York City',
      title: 'Global Headquarters & Trial Center',
      address: '375 Park Avenue, 28th Floor, New York, NY 10152',
      phone: '(212) 890-4400',
      email: 'ny@apexlegal.com',
      hours: 'Mon – Fri: 8:00 AM – 7:30 PM EST (24/7 Crisis Hotline)',
      transit: 'Grand Central Terminal (4, 5, 6, 7, S) & 51st St (E, M)',
      mapQuery: '375+Park+Ave,+New+York,+NY+10152',
      mapEmbedUrl: 'https://maps.google.com/maps?q=375%20Park%20Avenue%2C%20New%20York%2C%20NY%2010152&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    dc: {
      city: 'Washington D.C.',
      title: 'Federal Regulatory & Appellate Group',
      address: '1401 Pennsylvania Avenue NW, Suite 900, Washington, DC 20004',
      phone: '(202) 670-3300',
      email: 'dc@apexlegal.com',
      hours: 'Mon – Fri: 8:30 AM – 6:30 PM EST',
      transit: 'Metro Center (Red, Blue, Orange, Silver Lines)',
      mapQuery: '1401+Pennsylvania+Ave+NW,+Washington,+DC+20004',
      mapEmbedUrl: 'https://maps.google.com/maps?q=1401%20Pennsylvania%20Avenue%20NW%2C%20Washington%2C%20DC%2020004&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    sf: {
      city: 'San Francisco',
      title: 'Silicon Valley & IP Defense Center',
      address: '555 California Street, 32nd Floor, San Francisco, CA 94104',
      phone: '(415) 990-1122',
      email: 'sf@apexlegal.com',
      hours: 'Mon – Fri: 8:00 AM – 6:00 PM PST',
      transit: 'Montgomery St Station (BART / Muni Metro)',
      mapQuery: '555+California+St,+San+Francisco,+CA+94104',
      mapEmbedUrl: 'https://maps.google.com/maps?q=555%20California%20Street%2C%20San%20Francisco%2C%20CA%2094104&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
  };

  const socialLinks = [
    {
      name: 'LinkedIn Legal Counsel',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com',
      icon: Globe,
      desc: 'Official firm announcements & supreme court briefs',
    },
    {
      name: 'Twitter / X Litigation Feed',
      label: 'X (Twitter)',
      url: 'https://www.x.com',
      icon: Share2,
      desc: 'Live courtroom updates & appellate commentary',
    },
    {
      name: 'Martindale-Hubbell AV Preeminent',
      label: 'Martindale Profile',
      url: 'https://www.martindale.com',
      icon: Award,
      desc: 'Verified Tier 1 litigation ranking & ethics rating',
    },
    {
      name: 'YouTube Legal Insights',
      label: 'YouTube',
      url: 'https://www.youtube.com',
      icon: Globe,
      desc: 'Partner mock trial breakdown & masterclasses',
    },
  ];

  const practiceOptions = [
    { id: 1, title: 'Corporate Law & Mergers (M&A)' },
    { id: 3, title: 'Catastrophic Personal Injury & Wrongful Death' },
    { id: 5, title: 'Intellectual Property & Patent Defense' },
    { id: 6, title: 'White Collar Criminal Defense & SEC Inquiries' },
    { id: 7, title: 'Commercial Real Estate & Land Development' },
    { id: 8, title: 'Executive Employment & Severance Arbitration' },
    { id: 2, title: 'Antitrust & Unfair Trade Litigation' },
    { id: 4, title: 'Medical Malpractice & Toxic Torts' },
  ];

  const validate = (): boolean => {
    const errors: Record<string, string[]> = {};
    if (!formData.full_name.trim()) errors.full_name = ['Full legal name is required.'];
    if (!formData.email.trim()) errors.email = ['Email address is required.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = ['Valid email format required.'];
    if (!formData.phone.trim()) errors.phone = ['Phone number is required for counsel follow-up.'];
    if (!formData.case_details.trim() || formData.case_details.trim().length < 10) {
      errors.case_details = ['Please provide at least 10 characters summarizing your inquiry.'];
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;
    setLoading(true);

    try {
      const response = await submitConsultation({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        practice_area_id: Number(formData.practice_area_id),
        case_details: `[${formData.inquiry_type}] ${formData.case_details}`,
        source: 'contact-page-portal',
      });

      if (response.success) {
        setSubmittedId(response.lead_id || 1);
        setSuccessMessage(response.message || 'Your inquiry has been transmitted directly to our managing partners under strict attorney-client confidentiality.');
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          practice_area_id: 1,
          inquiry_type: 'Case Evaluation',
          case_details: '',
        });
      } else {
        setErrorMessage(response.message || 'We could not process your inquiry at this moment.');
      }
    } catch {
      setErrorMessage('A network error occurred. Please call our 24/7 hotline directly at (212) 890-4400.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5 bg-nepal-dark text-white">
      
      {/* 1. HERO HEADER */}
      <div className="container-xl mb-5">
        <div style={{ maxWidth: '750px' }}>
          <div className="badge bg-nepal-surface border border-sakura text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-inline-flex align-items-center gap-2 mb-3">
            <Mail className="text-crimson" style={{ width: '16px', height: '16px' }} />
            <span>Confidential Inquiries & Counsel Access</span>
          </div>
          <h1 className="font-serif display-4 fw-bold text-white mb-3 lh-tight">
            Contact Apex Legal. <br />
            <span className="text-crimson">Direct Counsel & Immediate Triage.</span>
          </h1>
          <p className="text-white-50 fs-5 mb-0 leading-relaxed">
            Whether facing an urgent federal subpoena, high-exposure commercial litigation, or catastrophic injury, our senior partners provide decisive counsel 24/7/365.
          </p>
        </div>
      </div>

      {/* 2. PRIMARY CONTACT GRID (Form + Contact Cards) */}
      <div className="container-xl mb-5">
        <div className="row g-4 align-items-start">
          
          {/* LEFT: Contact & Case Evaluation Form */}
          <div className="col-12 col-lg-7">
            <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 p-4 p-md-5 text-white">
              
              {/* Form Header */}
              <div className="mb-4">
                <div className="badge bg-nepal-dark border border-sakura text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-inline-flex align-items-center gap-1 mb-3">
                  <ShieldCheck className="text-crimson" style={{ width: '14px', height: '14px' }} />
                  <span>256-Bit Encrypted & Privileged</span>
                </div>
                <h2 className="font-serif fs-2 fw-bold text-white mb-1">
                  Send a Confidential Inquiry
                </h2>
                <p className="text-white-50 small mb-0 lh-base">
                  Complete the secure transmission form below. Senior trial counsel reviews all inquiries within 2 hours.
                </p>
              </div>

              {/* Success Alert */}
              {successMessage && (
                <div className="alert bg-nepal-dark border border-sakura text-white p-4 rounded-3 mb-4 shadow">
                  <div className="d-flex align-items-start gap-3">
                    <CheckCircle2 className="text-crimson flex-shrink-0 mt-1" style={{ width: '28px', height: '28px' }} />
                    <div>
                      <h5 className="font-serif fw-bold text-white mb-1">Inquiry Successfully Transmitted (File #{submittedId})</h5>
                      <p className="text-white-50 small mb-2">{successMessage}</p>
                      <div className="small text-white-50 d-flex align-items-center gap-1">
                        <Lock className="text-nepal-blue" style={{ width: '14px', height: '14px' }} />
                        <span>Protected under preliminary attorney-client privilege.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="alert alert-danger bg-crimson border-0 text-white d-flex align-items-center gap-2 p-3 rounded-3 mb-4">
                  <AlertCircle style={{ width: '18px', height: '18px' }} />
                  <span className="small fw-semibold">{errorMessage}</span>
                </div>
              )}

              {/* The Form */}
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                
                {/* Row 1: Name & Email */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                      Full Legal Name <span className="text-crimson">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="form-control"
                    />
                    {validationErrors.full_name && (
                      <div className="text-crimson small mt-1">{validationErrors.full_name[0]}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                      Email Address <span className="text-crimson">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. e.vance@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control"
                    />
                    {validationErrors.email && (
                      <div className="text-crimson small mt-1">{validationErrors.email[0]}</div>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Inquiry Type */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                      Telephone <span className="text-crimson">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. (212) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-control"
                    />
                    {validationErrors.phone && (
                      <div className="text-crimson small mt-1">{validationErrors.phone[0]}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                      Inquiry Nature
                    </label>
                    <select
                      value={formData.inquiry_type}
                      onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                      className="form-select cursor-pointer"
                    >
                      <option value="Case Evaluation">Free Case Evaluation</option>
                      <option value="Corporate Retention">Corporate Retainer Inquiry</option>
                      <option value="Regulatory Crisis">Emergency Regulatory / Subpoena</option>
                      <option value="Media Inquiries">Press & Media Relations</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Practice Area Selection */}
                <div>
                  <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Primary Legal Practice Discipline
                  </label>
                  <select
                    value={formData.practice_area_id}
                    onChange={(e) => setFormData({ ...formData, practice_area_id: Number(e.target.value) })}
                    className="form-select cursor-pointer"
                  >
                    {practiceOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Row 4: Summary / Details */}
                <div>
                  <label className="form-label text-uppercase fw-bold text-white small" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    Matter Summary & Key Facts <span className="text-crimson">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide relevant dates, jurisdictions, opposing parties, and primary legal goals..."
                    value={formData.case_details}
                    onChange={(e) => setFormData({ ...formData, case_details: e.target.value })}
                    className="form-control"
                  />
                  {validationErrors.case_details && (
                    <div className="text-crimson small mt-1">{validationErrors.case_details[0]}</div>
                  )}
                </div>

                {/* Privacy Lock Disclaimer */}
                <div className="p-3 rounded-3 bg-nepal-dark border border-sakura d-flex align-items-center gap-2 text-white-50 small">
                  <Lock className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                  <span>Transmitted via encrypted TLS 1.3 protocol directly to trial counsel.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-danger btn-crimson btn-lg w-100 fw-bold py-3 rounded-3 shadow d-flex align-items-center justify-content-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" style={{ width: '20px', height: '20px' }} />
                      <span>Transmitting Inquiry to Counsel...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Confidential Inquiry</span>
                      <Send style={{ width: '16px', height: '16px' }} />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

          {/* RIGHT: Contact Information & Office Hubs */}
          <div className="col-12 col-lg-5 d-flex flex-column gap-4">
            
            {/* 24/7 Emergency Response Card */}
            <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 p-4 text-white">
              <div className="d-flex align-items-center gap-2 text-crimson mb-2">
                <Phone style={{ width: '18px', height: '18px' }} />
                <span className="small text-uppercase fw-bold" style={{ letterSpacing: '0.05em' }}>24/7 Crisis Hotline</span>
              </div>
              <h3 className="font-serif fs-4 fw-bold text-white mb-2">
                Immediate Urgent Response
              </h3>
              <p className="text-white-50 small mb-3 lh-base">
                Available around the clock for emergency criminal investigations, search warrants, SEC subpoenas, or catastrophic injury intake.
              </p>
              <a
                href="tel:12128904400"
                className="font-serif fs-3 fw-bold text-crimson text-decoration-none hover-white"
              >
                (212) 890-4400
              </a>
            </div>

            {/* General Direct Lines */}
            <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 p-4 text-white">
              <h4 className="font-serif fs-6 fw-bold text-uppercase text-crimson mb-3" style={{ letterSpacing: '0.1em' }}>
                Department Inquiries
              </h4>
              
              <div className="d-flex flex-column gap-3 small">
                <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-nepal-dark border border-sakura">
                  <Mail className="text-crimson flex-shrink-0 mt-1" style={{ width: '16px', height: '16px' }} />
                  <div>
                    <span className="d-block fw-bold text-white">Client Intake & Retainers</span>
                    <a href="mailto:inquiries@apexlegal.com" className="text-white-50 text-decoration-none hover-crimson">
                      inquiries@apexlegal.com
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-nepal-dark border border-sakura">
                  <Building className="text-crimson flex-shrink-0 mt-1" style={{ width: '16px', height: '16px' }} />
                  <div>
                    <span className="d-block fw-bold text-white">Corporate Counsel & Board Inquiries</span>
                    <a href="mailto:corporate@apexlegal.com" className="text-white-50 text-decoration-none hover-crimson">
                      corporate@apexlegal.com
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-nepal-dark border border-sakura">
                  <Clock className="text-crimson flex-shrink-0 mt-1" style={{ width: '16px', height: '16px' }} />
                  <div>
                    <span className="d-block fw-bold text-white">Operating Counsel Hours</span>
                    <span className="text-white-50">Monday – Friday: 8:00 AM – 7:30 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Legal Profiles */}
            <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 p-4 text-white">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="font-serif fs-6 fw-bold text-uppercase text-crimson mb-0" style={{ letterSpacing: '0.1em' }}>
                  Legal Directory Profiles
                </h4>
                <span className="badge bg-nepal-dark border border-sakura text-white-50 small">Verified</span>
              </div>

              <div className="row g-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <div key={social.name} className="col-12 col-sm-6">
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-3 bg-nepal-dark border border-sakura text-decoration-none d-flex flex-column justify-content-between h-100 hover-border-crimson"
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <div className="d-flex align-items-center gap-2 text-white">
                            <Icon className="text-crimson" style={{ width: '16px', height: '16px' }} />
                            <span className="fw-bold small">{social.label}</span>
                          </div>
                          <ExternalLink className="text-white-50" style={{ width: '12px', height: '12px' }} />
                        </div>
                        <p className="text-white-50 mb-0 text-truncate" style={{ fontSize: '10px' }}>{social.desc}</p>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. INTERACTIVE GOOGLE MAP & NATIONAL OFFICES SECTION */}
      <div className="container-xl mb-4">
        <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 p-4 p-md-5 text-white">
          
          {/* Header & Office Switcher Tabs */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 pb-4 mb-4 border-bottom border-sakura">
            <div>
              <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
                National Physical Presence
              </span>
              <h2 className="font-serif fs-2 fw-bold text-white mb-0">
                Interactive Office Locator & Directions
              </h2>
            </div>

            {/* Office Switcher Tabs */}
            <div className="btn-group p-1 bg-nepal-dark rounded-pill border border-sakura">
              <button
                type="button"
                onClick={() => setActiveOffice('ny')}
                className={`btn btn-sm rounded-pill fw-bold px-3 py-2 ${
                  activeOffice === 'ny' ? 'btn-danger btn-crimson text-white shadow' : 'text-white-50 border-0'
                }`}
              >
                New York HQ
              </button>
              <button
                type="button"
                onClick={() => setActiveOffice('dc')}
                className={`btn btn-sm rounded-pill fw-bold px-3 py-2 ${
                  activeOffice === 'dc' ? 'btn-danger btn-crimson text-white shadow' : 'text-white-50 border-0'
                }`}
              >
                Washington D.C.
              </button>
              <button
                type="button"
                onClick={() => setActiveOffice('sf')}
                className={`btn btn-sm rounded-pill fw-bold px-3 py-2 ${
                  activeOffice === 'sf' ? 'btn-danger btn-crimson text-white shadow' : 'text-white-50 border-0'
                }`}
              >
                San Francisco
              </button>
            </div>
          </div>

          {/* Active Office Details + Google Map Embed */}
          <div className="row g-4 align-items-stretch">
            
            {/* Left Office Card Info */}
            <div className="col-12 col-lg-5">
              <div className="p-4 rounded-4 bg-nepal-dark border border-sakura d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="badge bg-nepal-surface border border-crimson text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-inline-flex align-items-center gap-1 mb-3">
                    <MapPin className="text-crimson" style={{ width: '14px', height: '14px' }} />
                    <span>{officeLocations[activeOffice].city}</span>
                  </div>

                  <h3 className="font-serif fs-4 fw-bold text-white mb-3">
                    {officeLocations[activeOffice].title}
                  </h3>

                  <div className="d-flex flex-column gap-3 small text-white-50">
                    <div className="d-flex align-items-start gap-2 text-white">
                      <MapPin className="text-crimson flex-shrink-0 mt-1" style={{ width: '16px', height: '16px' }} />
                      <span>{officeLocations[activeOffice].address}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <Phone className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                      <a href={`tel:${officeLocations[activeOffice].phone.replace(/[^0-9+]/g, '')}`} className="text-white fw-bold text-decoration-none hover-crimson">
                        {officeLocations[activeOffice].phone}
                      </a>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <Mail className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                      <a href={`mailto:${officeLocations[activeOffice].email}`} className="text-white-50 text-decoration-none hover-crimson">
                        {officeLocations[activeOffice].email}
                      </a>
                    </div>

                    <div className="d-flex align-items-start gap-2">
                      <Navigation className="text-nepal-blue flex-shrink-0 mt-1" style={{ width: '16px', height: '16px' }} />
                      <span>Transit: {officeLocations[activeOffice].transit}</span>
                    </div>
                  </div>
                </div>

                {/* Directions Button */}
                <div className="pt-4 mt-3 border-top border-sakura">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${officeLocations[activeOffice].mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-danger btn-crimson w-100 py-3 rounded-3 fw-bold small text-white d-flex align-items-center justify-content-center gap-2 shadow"
                  >
                    <Navigation style={{ width: '16px', height: '16px' }} />
                    <span>Get Driving & Subway Directions</span>
                    <ExternalLink style={{ width: '14px', height: '14px' }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Interactive Google Map Embed */}
            <div className="col-12 col-lg-7">
              <div className="rounded-4 overflow-hidden border border-sakura shadow-lg h-100 bg-nepal-dark" style={{ minHeight: '380px' }}>
                <iframe
                  title={`${officeLocations[activeOffice].city} Office Map`}
                  src={officeLocations[activeOffice].mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-100 h-100 filter-saturate"
                />
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
