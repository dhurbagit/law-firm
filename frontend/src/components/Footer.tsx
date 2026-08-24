import React from 'react';
import Link from 'next/link';
import { Scale, Phone, Mail, MapPin, ShieldCheck, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-nepal-dark border-top border-sakura text-white-50 small">
      {/* Upper Footer: Main Columns */}
      <div className="container-xl py-5">
        <div className="row g-4">
          
          {/* Col 1 & 2: Firm Authority Bio */}
          <div className="col-12 col-lg-5 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-blue border border-crimson shadow"
                style={{ width: '40px', height: '40px' }}
              >
                <Scale className="text-white" style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <span className="d-block font-serif fs-4 fw-bold text-white lh-1">
                  APEX <span className="text-crimson fw-light">LEGAL</span>
                </span>
                <span className="d-block text-uppercase fw-semibold text-white-50" style={{ fontSize: '9px', letterSpacing: '0.25em' }}>
                  Counselors at Law
                </span>
              </div>
            </div>

            <p className="text-white-50 small pe-lg-4 mb-4 lh-base">
              Apex Legal Counsel is a premier national trial and corporate law firm. With over $250 Million in verdicts and recoveries, we represent enterprises, innovators, and catastrophic injury victims across the United States.
            </p>

            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex align-items-center gap-2 text-white">
                <MapPin className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                <span>375 Park Avenue, 28th Floor, New York, NY 10152</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-white">
                <Phone className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                <span>Direct Legal Hotline: (212) 890-4400</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-white">
                <Mail className="text-crimson flex-shrink-0" style={{ width: '16px', height: '16px' }} />
                <span>Confidential Inquiries: inquiries@apexlegal.com</span>
              </div>
            </div>
          </div>

          {/* Col 3: Practice Disciplines */}
          <div className="col-12 col-sm-6 col-lg-2">
            <h5 className="font-serif text-white fw-bold text-uppercase fs-6 mb-3 text-crimson">
              Practice Areas
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <Link href="/practice-areas/corporate-law-mergers" className="text-white-50 text-decoration-none hover-crimson">
                  Corporate Law & M&A
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/personal-injury-catastrophic" className="text-white-50 text-decoration-none hover-crimson">
                  Catastrophic Injury
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/intellectual-property-patents" className="text-white-50 text-decoration-none hover-crimson">
                  Intellectual Property
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/white-collar-criminal-defense" className="text-white-50 text-decoration-none hover-crimson">
                  White Collar & Trial
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/commercial-real-estate-development" className="text-white-50 text-decoration-none hover-crimson">
                  Commercial Real Estate
                </Link>
              </li>
              <li>
                <Link href="/practice-areas/employment-labor-arbitration" className="text-white-50 text-decoration-none hover-crimson">
                  Executive Employment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div className="col-12 col-sm-6 col-lg-2">
            <h5 className="font-serif text-white fw-bold text-uppercase fs-6 mb-3 text-crimson">
              Firm Overview
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <Link href="/attorneys" className="text-white-50 text-decoration-none hover-crimson">
                  Distinguished Attorneys
                </Link>
              </li>
              <li>
                <Link href="/case-results" className="text-white-50 text-decoration-none hover-crimson">
                  Landmark Case Verdicts
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white-50 text-decoration-none hover-crimson">
                  Free Case Evaluation
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-white-50 text-decoration-none hover-crimson d-flex align-items-center gap-1">
                  <Lock className="text-crimson" style={{ width: '12px', height: '12px' }} />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trust Accreditations */}
          <div className="col-12 col-lg-3">
            <h5 className="font-serif text-white fw-bold text-uppercase fs-6 mb-3 text-crimson">
              Accreditations
            </h5>
            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded-3 bg-nepal-surface border border-sakura">
                <div className="d-flex align-items-center gap-2 text-white fw-bold small mb-1">
                  <ShieldCheck className="text-crimson" style={{ width: '16px', height: '16px' }} />
                  <span>AV Preeminent® Rated</span>
                </div>
                <p className="text-white-50 mb-0" style={{ fontSize: '11px' }}>
                  Highest Ethical Standing & Professional Excellence by Martindale-Hubbell.
                </p>
              </div>

              <div className="p-3 rounded-3 bg-nepal-surface border border-sakura">
                <span className="text-white fw-bold d-block small mb-1">The Best Lawyers in America®</span>
                <p className="text-white-50 mb-0" style={{ fontSize: '11px' }}>
                  Recognized Tier 1 Litigation & M&A practice across federal circuits.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Legal Disclaimers & Ethics Compliance */}
      <div className="bg-nepal-surface border-top border-sakura py-4">
        <div className="container-xl d-flex flex-column gap-3">
          <p className="text-white-50 mb-0" style={{ fontSize: '11px', lineHeight: '1.6' }}>
            <strong className="text-white">ATTORNEY ADVERTISING NOTICE:</strong> Prior results do not guarantee a similar outcome. The materials and information contained on this website are intended for general informational purposes only and do not constitute formal legal advice. Viewing this website or submitting a case inquiry does not form an attorney-client relationship.
          </p>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 border-top border-white-10 text-white-50" style={{ fontSize: '11px' }}>
            <span>© {new Date().getFullYear()} Apex Legal Counsel LLP. All Rights Reserved.</span>
            <div className="d-flex align-items-center gap-3">
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
