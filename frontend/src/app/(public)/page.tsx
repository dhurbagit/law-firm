import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getFirmStats, 
  getPracticeAreas, 
  getAttorneys, 
  getCaseResults 
} from '@/lib/api';
import { CourtroomHero } from '@/components/CourtroomHero';
import { StatsSection } from '@/components/StatsSection';
import { PracticeAreaCard } from '@/components/PracticeAreaCard';
import { AttorneyCard } from '@/components/AttorneyCard';
import { CaseResultCard } from '@/components/CaseResultCard';
import { ConsultationForm } from '@/components/ConsultationForm';
import { 
  ArrowRight, 
  Award, 
  Gavel, 
  Clock, 
  Building,
  Quote
} from 'lucide-react';

export default async function HomePage() {
  const [stats, practiceAreas, attorneys, caseResults] = await Promise.all([
    getFirmStats(),
    getPracticeAreas({ featured: true }),
    getAttorneys(),
    getCaseResults(),
  ]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-nepal-dark text-white">
      
      {/* 1. INTERACTIVE ANIMATED COURTROOM HERO */}
      <CourtroomHero />

      {/* 2. STATS SECTION */}
      <StatsSection stats={stats} />

      {/* 3. FEATURED PRACTICE AREAS */}
      <section className="py-5 border-bottom border-sakura position-relative overflow-hidden">
        
        {/* Court Item Background Stickers / Watermarks */}
        <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none user-select-none overflow-hidden z-0">
          <div className="position-absolute text-white" style={{ top: '-48px', left: '-48px', width: '380px', height: '380px', opacity: 0.035, transform: 'rotate(-12deg)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-100 h-100">
              <line x1="3" y1="22" x2="21" y2="22" />
              <line x1="6" y1="18" x2="6" y2="11" />
              <line x1="10" y1="18" x2="10" y2="11" />
              <line x1="14" y1="18" x2="14" y2="11" />
              <line x1="18" y1="18" x2="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </div>

          <div className="position-absolute text-white" style={{ top: '30%', right: '-64px', width: '320px', height: '320px', opacity: 0.03, transform: 'rotate(12deg)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-100 h-100">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" />
              <path d="M12 3v18" />
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </div>

          <div className="position-absolute text-white" style={{ bottom: '-64px', left: '33%', width: '280px', height: '280px', opacity: 0.025, transform: 'rotate(-45deg)' }}>
            <Gavel className="w-100 h-100 stroke-1" />
          </div>
        </div>

        <div className="container-xl position-relative z-1 py-4">
          
          {/* Header */}
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5 gap-4">
            <div style={{ maxWidth: '650px' }}>
              <div className="badge bg-nepal-surface border border-sakura text-crimson px-3 py-2 rounded-pill small fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>
                Legal Capabilities & Trial Bench
              </div>
              <h2 className="font-serif display-5 fw-bold text-white mb-2">
                Specialized Practice Disciplines
              </h2>
              <p className="text-white-50 lead fs-6 mb-0">
                Our senior partners lead dedicated legal practice groups tailored to high-exposure commercial litigation, federal regulatory compliance, and multi-million dollar corporate transactions.
              </p>
            </div>

            <Link
              href="/practice-areas"
              className="btn btn-outline-light btn-lg px-4 py-3 rounded-3 fw-bold text-white bg-nepal-surface border-sakura shadow d-flex align-items-center gap-2 flex-shrink-0"
            >
              <span>View All 8 Practice Areas</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>

          {/* Practice Area Cards Grid */}
          <div className="row g-4">
            {practiceAreas.map((area) => (
              <div key={area.id} className="col-12 col-md-6 col-lg-4">
                <PracticeAreaCard practiceArea={area} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. THE APEX TRIAL DIFFERENCE */}
      <section className="py-5 bg-nepal-surface border-bottom border-sakura">
        <div className="container-xl py-4">
          <div className="row align-items-center g-5">
            
            {/* Left Column Content */}
            <div className="col-12 col-lg-7 d-flex flex-column gap-4">
              <span className="text-uppercase text-crimson fw-bold small" style={{ letterSpacing: '0.1em' }}>
                The Apex Standard
              </span>
              <h2 className="font-serif display-6 fw-bold text-white mb-0 lh-base">
                Built For The Courtroom. <br />
                Respected Across The Negotiating Table.
              </h2>
              <p className="text-white-50 fs-6 mb-0 lh-base">
                Most law firms seek quick, discounted settlements to avoid courtroom battles. At Apex Legal Counsel, every single case is prepared from day one for jury trial. Opposing counsel and insurance conglomerates know our track record, which gives our clients unparalleled leverage.
              </p>

              <div className="row g-3 pt-2">
                <div className="col-12 col-sm-6">
                  <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                    <div className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-surface border border-sakura text-crimson mb-2" style={{ width: '36px', height: '36px' }}>
                      <Gavel style={{ width: '18px', height: '18px' }} />
                    </div>
                    <h5 className="font-serif fw-bold text-white fs-6 mb-1">Unmatched Trial Readiness</h5>
                    <p className="text-white-50 small mb-0">Over 45+ jury verdicts taken to verdict with a 98.6% favorable outcome rate.</p>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                    <div className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-surface border border-sakura text-crimson mb-2" style={{ width: '36px', height: '36px' }}>
                      <Building style={{ width: '18px', height: '18px' }} />
                    </div>
                    <h5 className="font-serif fw-bold text-white fs-6 mb-1">Deep Regulatory Insight</h5>
                    <p className="text-white-50 small mb-0">Partners include former AUSAs and federal enforcement directors from SDNY.</p>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                    <div className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-surface border border-sakura text-crimson mb-2" style={{ width: '36px', height: '36px' }}>
                      <Award style={{ width: '18px', height: '18px' }} />
                    </div>
                    <h5 className="font-serif fw-bold text-white fs-6 mb-1">Contingency Fee Protection</h5>
                    <p className="text-white-50 small mb-0">In personal injury matters, you pay zero legal fees unless we successfully recover.</p>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 rounded-3 bg-nepal-dark border border-sakura">
                    <div className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-surface border border-sakura text-crimson mb-2" style={{ width: '36px', height: '36px' }}>
                      <Clock style={{ width: '18px', height: '18px' }} />
                    </div>
                    <h5 className="font-serif fw-bold text-white fs-6 mb-1">Direct Partner Access</h5>
                    <p className="text-white-50 small mb-0">Your legal strategy is guided by senior partners, never handed off to junior associates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="col-12 col-lg-5">
              <div className="position-relative rounded-4 overflow-hidden border border-sakura shadow-lg" style={{ height: '440px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                  alt="Apex Legal Headquarters"
                  fill
                  className="object-fit-cover"
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-4 m-3 rounded-3 bg-nepal-dark border border-sakura">
                  <span className="text-uppercase text-crimson fw-bold d-block small mb-1" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Tier 1 National Law Firm</span>
                  <span className="font-serif fw-bold text-white fs-6">375 Park Avenue, 28th Floor, New York</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DISTINGUISHED ATTORNEYS */}
      <section className="py-5 bg-nepal-dark border-bottom border-sakura">
        <div className="container-xl py-4">
          
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <span className="text-uppercase text-crimson fw-bold small d-block mb-2" style={{ letterSpacing: '0.1em' }}>
              Our Leadership
            </span>
            <h2 className="font-serif display-6 fw-bold text-white mb-2">
              Distinguished Partners & Trial Litigators
            </h2>
            <p className="text-white-50 small mb-0">
              Representing ivy-league academic backgrounds, judicial clerkships, and decades of trial leadership in federal and appellate courts.
            </p>
          </div>

          <div className="row g-4">
            {attorneys.map((attorney) => (
              <div key={attorney.id} className="col-12 col-sm-6 col-lg-3">
                <AttorneyCard attorney={attorney} />
              </div>
            ))}
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/attorneys"
              className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-bold text-white bg-nepal-surface border-sakura shadow"
            >
              <span>Explore All Attorney Credentials & Bios →</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 6. LANDMARK VERDICTS BANNER */}
      <section className="py-5 bg-nepal-surface border-bottom border-sakura">
        <div className="container-xl py-4">
          
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4 gap-3">
            <div>
              <span className="text-uppercase text-crimson fw-bold small d-block mb-2" style={{ letterSpacing: '0.1em' }}>
                Proven Track Record
              </span>
              <h2 className="font-serif display-6 fw-bold text-white mb-0">
                Landmark Verdicts & Significant Recoveries
              </h2>
            </div>
            <Link
              href="/case-results"
              className="text-crimson text-decoration-none fw-bold small d-flex align-items-center gap-1 hover-white"
            >
              <span>View Full Case History</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>

          <div className="row g-4">
            {caseResults.slice(0, 3).map((res) => (
              <div key={res.id} className="col-12 col-md-4">
                <CaseResultCard result={res} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      <section className="py-5 bg-nepal-dark border-bottom border-sakura">
        <div className="container-xl py-4">
          
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '550px' }}>
            <span className="text-uppercase text-crimson fw-bold small d-block mb-2" style={{ letterSpacing: '0.1em' }}>
              Client Endorsements
            </span>
            <h2 className="font-serif display-6 fw-bold text-white mb-0">
              Trusted When Survival Is on the Line
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="sakura-glass-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <Quote className="text-crimson mb-3 opacity-50" style={{ width: '32px', height: '32px' }} />
                  <p className="text-white-50 small lh-base mb-4 fst-italic">
                    &ldquo;When our SaaS intellectual property was misappropriated by rogue competitors, Marcus Croft secured an emergency federal injunction in 72 hours. Their technical depth saved our company.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-top border-sakura">
                  <span className="font-serif fw-bold text-white d-block small">CTO & Founder</span>
                  <span className="text-white-50" style={{ fontSize: '11px' }}>Enterprise AI Infrastructure Firm</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="sakura-glass-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <Quote className="text-crimson mb-3 opacity-50" style={{ width: '32px', height: '32px' }} />
                  <p className="text-white-50 small lh-base mb-4 fst-italic">
                    &ldquo;Eleanor Vance and her trial team fought tenaciously against three corporate insurance carriers after my catastrophic trucking accident. The $14.2M verdict secured my family&apos;s lifelong medical care.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-top border-sakura">
                  <span className="font-serif fw-bold text-white d-block small">Michael R.</span>
                  <span className="text-white-50" style={{ fontSize: '11px' }}>Catastrophic Injury Client</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="sakura-glass-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <Quote className="text-crimson mb-3 opacity-50" style={{ width: '32px', height: '32px' }} />
                  <p className="text-white-50 small lh-base mb-4 fst-italic">
                    &ldquo;Victoria Hayes took charge of an aggressive federal regulatory inquiry targeting our executive suite. Her strategic engagement led to a complete declination without charges.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-top border-sakura">
                  <span className="font-serif fw-bold text-white d-block small">General Counsel</span>
                  <span className="text-white-50" style={{ fontSize: '11px' }}>Publicly Traded Financial Entity</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. EMBEDDED CASE EVALUATION SECTION */}
      <section className="py-5 bg-nepal-surface">
        <div className="container-xl py-4" style={{ maxWidth: '900px' }}>
          <ConsultationForm 
            practiceAreas={practiceAreas.map(p => ({ id: p.id, title: p.title }))}
          />
        </div>
      </section>

    </div>
  );
}
