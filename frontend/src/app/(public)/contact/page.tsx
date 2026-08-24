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
      color: 'hover:text-[#0A66C2]',
      desc: 'Official firm announcements & supreme court briefs',
    },
    {
      name: 'Twitter / X Litigation Feed',
      label: 'X (Twitter)',
      url: 'https://www.x.com',
      icon: Share2,
      color: 'hover:text-[#1DA1F2]',
      desc: 'Live courtroom updates & appellate commentary',
    },
    {
      name: 'Martindale-Hubbell AV Preeminent',
      label: 'Martindale Profile',
      url: 'https://www.martindale.com',
      icon: Award,
      color: 'hover:text-crimson',
      desc: 'Verified Tier 1 litigation ranking & ethics rating',
    },
    {
      name: 'YouTube Legal Insights',
      label: 'YouTube',
      url: 'https://www.youtube.com',
      icon: Globe,
      color: 'hover:text-[#FF0000]',
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
    <div className="min-h-screen py-16 font-sans bg-nepal-dark text-white">
      
      {/* 1. HERO HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 font-sans">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nepal-surface border border-sakura-border text-white text-xs font-bold uppercase tracking-wider font-sans">
            <Mail className="w-4 h-4 text-crimson" />
            <span>Confidential Inquiries & Counsel Access</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Contact Apex Legal. <br />
            <span className="text-crimson">Direct Counsel & Immediate Triage.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal font-sans">
            Whether facing an urgent federal subpoena, high-exposure commercial litigation, or catastrophic injury, our senior partners provide decisive counsel 24/7/365.
          </p>
        </div>
      </div>

      {/* 2. PRIMARY CONTACT GRID (Form + Contact Information Cards) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Contact & Case Evaluation Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-nepal-surface border border-sakura-border shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
              
              {/* Form Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nepal-dark border border-sakura-border text-white text-xs font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-crimson" />
                  <span>256-Bit Encrypted & Privileged</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  Send a Confidential Inquiry
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed font-sans">
                  Complete the secure transmission form below. Senior trial counsel reviews all inquiries within 2 hours.
                </p>
              </div>

              {/* Success Alert */}
              {successMessage && (
                <div className="p-5 rounded-2xl bg-nepal-dark border border-sakura-border text-white animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-6 h-6 text-crimson flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs sm:text-sm">
                      <h4 className="font-serif font-bold text-white text-base">Inquiry Successfully Transmitted (File #{submittedId})</h4>
                      <p className="text-slate-200">{successMessage}</p>
                      <div className="pt-2 text-[11px] text-slate-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-nepal-blue" />
                        <span>Protected under preliminary attorney-client privilege.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-crimson/15 border border-crimson/40 text-xs text-slate-200 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-crimson flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* The Form */}
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                      Full Legal Name <span className="text-crimson">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white placeholder-slate-500 text-sm outline-none transition font-sans"
                    />
                    {validationErrors.full_name && (
                      <p className="text-xs text-crimson mt-1">{validationErrors.full_name[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                      Email Address <span className="text-crimson">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. e.vance@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white placeholder-slate-500 text-sm outline-none transition font-sans"
                    />
                    {validationErrors.email && (
                      <p className="text-xs text-crimson mt-1">{validationErrors.email[0]}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Inquiry Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                      Telephone <span className="text-crimson">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. (212) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white placeholder-slate-500 text-sm outline-none transition font-sans"
                    />
                    {validationErrors.phone && (
                      <p className="text-xs text-crimson mt-1">{validationErrors.phone[0]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                      Inquiry Nature
                    </label>
                    <select
                      value={formData.inquiry_type}
                      onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white text-sm outline-none transition cursor-pointer font-sans"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                    Primary Legal Practice Discipline
                  </label>
                  <select
                    value={formData.practice_area_id}
                    onChange={(e) => setFormData({ ...formData, practice_area_id: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white text-sm outline-none transition cursor-pointer font-sans"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
                    Matter Summary & Key Facts <span className="text-crimson">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide relevant dates, jurisdictions, opposing parties, and primary legal goals..."
                    value={formData.case_details}
                    onChange={(e) => setFormData({ ...formData, case_details: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-nepal-dark border border-sakura-border/60 focus:border-crimson focus:ring-1 focus:ring-crimson text-white placeholder-slate-500 text-sm outline-none transition resize-none font-sans"
                  />
                  {validationErrors.case_details && (
                    <p className="text-xs text-crimson mt-1">{validationErrors.case_details[0]}</p>
                  )}
                </div>

                {/* Privacy Lock Disclaimer */}
                <div className="p-3.5 rounded-xl bg-nepal-dark/60 border border-sakura-border/40 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-crimson" />
                    <span>Transmitted via encrypted TLS 1.3 protocol directly to trial counsel.</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold text-white bg-crimson hover:bg-crimson-hover border border-white/20 shadow-xl shadow-crimson/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Transmitting Inquiry to Counsel...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Confidential Inquiry</span>
                      <Send className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

          {/* RIGHT: Contact Information & Office Hubs */}
          <div className="lg:col-span-5 space-y-6 font-sans">
            
            {/* 24/7 Emergency Response Card */}
            <div className="p-7 rounded-3xl bg-nepal-surface border border-sakura-border shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-crimson">
                <Phone className="w-5 h-5 text-crimson" />
                <span className="text-xs uppercase font-bold tracking-wider">24/7 Crisis Hotline</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Immediate Urgent Response
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Available around the clock for emergency criminal investigations, search warrants, SEC subpoenas, or catastrophic injury intake.
              </p>
              <a
                href="tel:12128904400"
                className="block text-2xl sm:text-3xl font-serif font-extrabold text-crimson hover:text-white transition pt-1"
              >
                (212) 890-4400
              </a>
            </div>

            {/* General Direct Lines */}
            <div className="p-7 rounded-3xl bg-nepal-surface border border-sakura-border shadow-xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider text-crimson">
                Department Inquiries
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-nepal-dark border border-sakura-border/40">
                  <Mail className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white">Client Intake & Retainers</span>
                    <a href="mailto:inquiries@apexlegal.com" className="text-slate-300 hover:text-crimson transition">
                      inquiries@apexlegal.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-nepal-dark border border-sakura-border/40">
                  <Building className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white">Corporate Counsel & Board Inquiries</span>
                    <a href="mailto:corporate@apexlegal.com" className="text-slate-300 hover:text-crimson transition">
                      corporate@apexlegal.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-nepal-dark border border-sakura-border/40">
                  <Clock className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white">Operating Counsel Hours</span>
                    <span className="text-slate-300">Monday – Friday: 8:00 AM – 7:30 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Legal Accreditations Box */}
            <div className="p-7 rounded-3xl bg-nepal-surface border border-sakura-border shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider text-crimson">
                  Social Media & Legal Profiles
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400">Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-nepal-dark border border-sakura-border/40 hover:border-crimson hover:bg-nepal-blue/30 transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 text-crimson group-hover:text-white transition`} />
                          <span className="font-bold text-xs text-white group-hover:text-white">{social.label}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-crimson transition" />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{social.desc}</p>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. INTERACTIVE GOOGLE MAP & NATIONAL OFFICES SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 font-sans">
        <div className="p-8 sm:p-12 rounded-3xl bg-nepal-surface border border-sakura-border shadow-2xl space-y-8">
          
          {/* Header & Office Switcher Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sakura-border/40">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-crimson block mb-1">
                National Physical Presence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Interactive Office Locator & Directions
              </h2>
            </div>

            {/* Office Switcher Tabs */}
            <div className="flex items-center gap-2 bg-nepal-dark p-1.5 rounded-2xl border border-sakura-border">
              <button
                type="button"
                onClick={() => setActiveOffice('ny')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeOffice === 'ny'
                    ? 'bg-crimson text-white shadow-lg'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                New York HQ
              </button>
              <button
                type="button"
                onClick={() => setActiveOffice('dc')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeOffice === 'dc'
                    ? 'bg-crimson text-white shadow-lg'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Washington D.C.
              </button>
              <button
                type="button"
                onClick={() => setActiveOffice('sf')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeOffice === 'sf'
                    ? 'bg-crimson text-white shadow-lg'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                San Francisco
              </button>
            </div>
          </div>

          {/* Active Office Details + Google Map Embed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Office Card Info */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-nepal-dark border border-sakura-border/60 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nepal-surface border border-crimson/50 text-white text-[11px] font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-crimson" />
                  <span>{officeLocations[activeOffice].city}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white">
                  {officeLocations[activeOffice].title}
                </h3>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <MapPin className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
                    <span>{officeLocations[activeOffice].address}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-200">
                    <Phone className="w-4 h-4 text-crimson flex-shrink-0" />
                    <a href={`tel:${officeLocations[activeOffice].phone.replace(/[^0-9+]/g, '')}`} className="hover:text-crimson font-bold text-white">
                      {officeLocations[activeOffice].phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-200">
                    <Mail className="w-4 h-4 text-crimson flex-shrink-0" />
                    <a href={`mailto:${officeLocations[activeOffice].email}`} className="hover:text-crimson">
                      {officeLocations[activeOffice].email}
                    </a>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-300">
                    <Navigation className="w-4 h-4 text-nepal-blue flex-shrink-0 mt-0.5" />
                    <span>Transit: {officeLocations[activeOffice].transit}</span>
                  </div>
                </div>
              </div>

              {/* Directions Button */}
              <div className="pt-4 border-t border-sakura-border/40">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${officeLocations[activeOffice].mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-crimson hover:bg-crimson-hover transition shadow-lg shadow-crimson/20"
                >
                  <Navigation className="w-3.5 h-3.5 text-white" />
                  <span>Get Driving & Subway Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </a>
              </div>
            </div>

            {/* Right Interactive Google Map Embed */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-sakura-border/60 shadow-xl min-h-[380px] sm:min-h-[440px] relative bg-nepal-dark">
              <iframe
                title={`${officeLocations[activeOffice].city} Office Map`}
                src={officeLocations[activeOffice].mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-150 contrast-125"
              />
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
