import React from 'react';
import Link from 'next/link';
import { Scale, Phone, Mail, MapPin, ShieldCheck, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-[#003893]/50 text-slate-300 text-sm font-sans">
      {/* Upper Footer: Main Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Firm Authority Bio */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#003893] border border-[#DC143C] flex items-center justify-center shadow-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wide text-white">
                  APEX <span className="text-[#DC143C] font-light">LEGAL</span>
                </span>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-slate-400 font-semibold">
                  Counselors at Law
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Apex Legal Counsel is a premier national trial and corporate law firm. With over $250 Million in verdicts and recoveries, we represent enterprises, innovators, and catastrophic injury victims across the United States.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-white">
                <MapPin className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
                <span>375 Park Avenue, 28th Floor, New York, NY 10152</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <Phone className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
                <span>Direct Legal Hotline: (212) 890-4400</span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <Mail className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
                <span>Confidential Inquiries: inquiries@apexlegal.com</span>
              </div>
            </div>
          </div>

          {/* Col 3: Practice Disciplines */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-bold tracking-wider text-sm uppercase text-[#DC143C]">
              Practice Areas
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/practice-areas/corporate-law-mergers" className="hover:text-[#DC143C] transition">
                  Corporate Law & M&A
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/personal-injury-catastrophic" className="hover:text-[#DC143C] transition">
                  Catastrophic Injury & Wrongful Death
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/intellectual-property-patents" className="hover:text-[#DC143C] transition">
                  Intellectual Property & Patents
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/white-collar-criminal-defense" className="hover:text-[#DC143C] transition">
                  White Collar & Investigations
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/commercial-real-estate-development" className="hover:text-[#DC143C] transition">
                  Commercial Real Estate & Land Use
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/employment-labor-arbitration" className="hover:text-[#DC143C] transition">
                  Executive Employment & Labor
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-bold tracking-wider text-sm uppercase text-[#DC143C]">
              Firm Overview
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/attorneys" className="hover:text-[#DC143C] transition">
                  Distinguished Attorneys
                </Link>
              </li>
              <li>
                <Link href="/case-results" className="hover:text-[#DC143C] transition">
                  Landmark Case Verdicts
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#DC143C] transition">
                  Schedule Free Case Evaluation
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#DC143C] transition flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3 h-3 text-[#003893]" />
                  <span>Admin Operations Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust Accreditations */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-bold tracking-wider text-sm uppercase text-[#DC143C]">
              Accreditations
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#001C4A] border border-[#003893] space-y-1">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#DC143C]" />
                  <span>AV Preeminent® Rated</span>
                </div>
                <p className="text-[11px] text-slate-300">Highest Ethical Standing & Professional Excellence by Martindale-Hubbell.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#001C4A] border border-[#003893] space-y-1">
                <span className="text-white font-bold block">The Best Lawyers in America®</span>
                <p className="text-[11px] text-slate-300">Recognized Tier 1 Litigation & M&A practice across regional federal circuits.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Legal Disclaimers & Ethics Compliance */}
      <div className="bg-[#000000] border-t border-[#003893]/40 px-4 py-8 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="leading-relaxed">
            <strong className="text-white font-semibold">ATTORNEY ADVERTISING NOTICE:</strong> Prior results do not guarantee a similar outcome. The materials and information contained on this website are intended for general informational purposes only and do not constitute formal legal advice. Viewing this website or submitting a case inquiry does not form an attorney-client relationship.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 text-slate-400">
            <p>© {new Date().getFullYear()} Apex Legal Counsel LLP. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Representation</span>
              <span>•</span>
              <span>Bar Regulatory Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
