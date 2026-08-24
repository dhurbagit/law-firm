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

      {/* 2. STATS BANNER */}
      <StatsSection stats={stats} />

      {/* ============================================================
          3. FEATURED PRACTICE AREAS  ·  LIGHT ALABASTER CANVAS
          ============================================================ */}
      <section className="section-light position-relative overflow-hidden py-section">

        {/* Subtle watermark stickers */}
        <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div className="position-absolute" style={{ top: '-60px', left: '-60px', width: '360px', height: '360px', opacity: 0.04, transform: 'rotate(-12deg)', color: '#001F54' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ width: '100%', height: '100%' }}>
              <line x1="3" y1="22" x2="21" y2="22" />
              <line x1="6" y1="18" x2="6" y2="11" />
              <line x1="10" y1="18" x2="10" y2="11" />
              <line x1="14" y1="18" x2="14" y2="11" />
              <line x1="18" y1="18" x2="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </div>
          <div className="position-absolute" style={{ top: '30%', right: '-60px', width: '300px', height: '300px', opacity: 0.035, transform: 'rotate(12deg)', color: '#001F54' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" style={{ width: '100%', height: '100%' }}>
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" /><path d="M12 3v18" />
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </div>
        </div>

        <div className="container-xl position-relative" style={{ zIndex: 1 }}>

          {/* Section Header */}
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5 gap-4">
            <div style={{ maxWidth: '620px' }}>
              <div className="badge-category mb-3">Legal Capabilities &amp; Trial Bench</div>
              <h2 className="font-serif fw-bold mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#001F54' }}>
                Specialized Practice Disciplines
              </h2>
              <p className="mb-0" style={{ color: '#475569', lineHeight: 1.7 }}>
                Our senior partners lead dedicated legal practice groups tailored to high-exposure commercial
                litigation, federal regulatory compliance, and multi-million dollar corporate transactions.
              </p>
            </div>

            <Link
              href="/practice-areas"
              className="btn btn-outline-dark-brand px-4 py-3 rounded-3 d-flex align-items-center gap-2 flex-shrink-0"
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

      {/* ============================================================
          4. THE APEX TRIAL DIFFERENCE  ·  DARK SURFACE
          ============================================================ */}
      <section className="section-dark py-section border-top border-bottom border-sakura">
        <div className="container-xl">
          <div className="row align-items-center g-5">

            {/* Left: Content */}
            <div className="col-12 col-lg-7 d-flex flex-column gap-4">
              <span className="text-uppercase fw-bold small text-crimson" style={{ letterSpacing: '0.1em' }}>
                The Apex Standard
              </span>
              <h2 className="font-serif fw-bold text-white mb-0" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', lineHeight: 1.3 }}>
                Built For The Courtroom. <br />
                Respected Across The Negotiating Table.
              </h2>
              <p className="text-white-50 mb-0 lh-base">
                Most law firms seek quick, discounted settlements to avoid courtroom battles. At Apex Legal Counsel,
                every single case is prepared from day one for jury trial. Opposing counsel and insurance conglomerates
                know our track record, which gives our clients unparalleled leverage.
              </p>

              <div className="row g-3">
                {[
                  {
                    icon: Gavel,
                    title: 'Unmatched Trial Readiness',
                    desc: 'Over 45+ jury verdicts taken to verdict with a 98.6% favorable outcome rate.',
                  },
                  {
                    icon: Building,
                    title: 'Deep Regulatory Insight',
                    desc: 'Partners include former AUSAs and federal enforcement directors from SDNY.',
                  },
                  {
                    icon: Award,
                    title: 'Contingency Fee Protection',
                    desc: 'In personal injury matters, you pay zero legal fees unless we successfully recover.',
                  },
                  {
                    icon: Clock,
                    title: 'Direct Partner Access',
                    desc: 'Your legal strategy is guided by senior partners, never handed off to junior associates.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="col-12 col-sm-6">
                    <div className="p-3 rounded-3 bg-nepal-dark border border-sakura h-100">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-surface border border-sakura mb-2"
                        style={{ width: '36px', height: '36px', color: '#DC143C' }}
                      >
                        <Icon style={{ width: '18px', height: '18px' }} />
                      </div>
                      <h5 className="font-serif fw-bold text-white fs-6 mb-1">{title}</h5>
                      <p className="text-white-50 small mb-0">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image */}
            <div className="col-12 col-lg-5">
              <div className="position-relative rounded-4 overflow-hidden border border-sakura shadow-lg" style={{ height: '440px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                  alt="Apex Legal Headquarters"
                  fill
                  className="object-fit-cover"
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-3 m-3 rounded-3 bg-nepal-dark border border-sakura">
                  <span className="text-uppercase fw-bold d-block small text-crimson mb-1" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                    Tier 1 National Law Firm
                  </span>
                  <span className="font-serif fw-bold text-white fs-6">375 Park Avenue, 28th Floor, New York</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          5. DISTINGUISHED ATTORNEYS  ·  LIGHT ALABASTER CANVAS
          ============================================================ */}
      <section className="section-light py-section">
        <div className="container-xl">

          <div className="text-center mx-auto mb-5" style={{ maxWidth: '580px' }}>
            <div className="badge-category mb-3">Our Leadership</div>
            <h2 className="font-serif fw-bold mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', color: '#001F54' }}>
              Distinguished Partners &amp; Trial Litigators
            </h2>
            <p className="mb-0" style={{ color: '#475569' }}>
              Representing ivy-league academic backgrounds, judicial clerkships, and decades of trial leadership
              in federal and appellate courts.
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
              className="btn btn-outline-dark-brand px-5 py-3 rounded-pill fw-bold"
            >
              Explore All Attorney Credentials &amp; Bios →
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================
          6. LANDMARK VERDICTS  ·  LIGHT CANVAS
          ============================================================ */}
      <section className="section-light py-section border-top border-canvas">
        <div className="container-xl">

          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4 gap-3">
            <div>
              <div className="badge-category mb-3">Proven Track Record</div>
              <h2 className="font-serif fw-bold mb-0" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#001F54' }}>
                Landmark Verdicts &amp; Significant Recoveries
              </h2>
            </div>
            <Link
              href="/case-results"
              className="text-crimson text-decoration-none fw-bold small d-flex align-items-center gap-1 hover-white flex-shrink-0"
            >
              <span>View Full Case History</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
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

      {/* ============================================================
          7. CLIENT TESTIMONIALS  ·  LIGHT CANVAS (ALT SHADE)
          ============================================================ */}
      <section className="py-section" style={{ backgroundColor: '#EEF2F7' }}>
        <div className="container-xl">

          <div className="text-center mx-auto mb-5" style={{ maxWidth: '540px' }}>
            <div className="badge-category mb-3">Client Endorsements</div>
            <h2 className="font-serif fw-bold mb-0" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#001F54' }}>
              Trusted When Survival Is on the Line
            </h2>
          </div>

          <div className="row g-4">
            {[
              {
                quote: 'When our SaaS intellectual property was misappropriated by rogue competitors, Marcus Croft secured an emergency federal injunction in 72 hours. Their technical depth saved our company.',
                name: 'CTO & Founder',
                firm: 'Enterprise AI Infrastructure Firm',
              },
              {
                quote: "Eleanor Vance and her trial team fought tenaciously against three corporate insurance carriers after my catastrophic trucking accident. The $14.2M verdict secured my family\u2019s lifelong medical care.",
                name: 'Michael R.',
                firm: 'Catastrophic Injury Client',
              },
              {
                quote: 'Victoria Hayes took charge of an aggressive federal regulatory inquiry targeting our executive suite. Her strategic engagement led to a complete declination without charges.',
                name: 'General Counsel',
                firm: 'Publicly Traded Financial Entity',
              },
            ].map(({ quote, name, firm }) => (
              <div key={name} className="col-12 col-md-4">
                <div className="card-light h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <Quote className="text-crimson mb-3" style={{ width: '28px', height: '28px', opacity: 0.7 }} />
                    <p className="small lh-base mb-4 fst-italic" style={{ color: '#334155' }}>
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-top border-canvas">
                    <span className="font-serif fw-bold d-block small" style={{ color: '#001F54' }}>{name}</span>
                    <span style={{ color: '#64748B', fontSize: '11px' }}>{firm}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================
          8. CASE EVALUATION FORM  ·  LIGHT CANVAS
          ============================================================ */}
      <section className="section-light py-section border-top border-canvas">
        <div className="container-xl" style={{ maxWidth: '860px' }}>

          {/* Section intro */}
          <div className="text-center mb-5">
            <div className="badge-category mb-3">Free Confidential Consultation</div>
            <h2 className="font-serif fw-bold mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#001F54' }}>
              Request a Case Evaluation
            </h2>
            <p className="mb-0" style={{ color: '#475569', maxWidth: '540px', margin: '0 auto' }}>
              Speak directly with our senior partners. All submissions are protected under preliminary attorney-client privilege.
            </p>
          </div>

          {/* Form card on white surface */}
          <ConsultationForm
            practiceAreas={practiceAreas.map(p => ({ id: p.id, title: p.title }))}
          />
        </div>
      </section>

    </div>
  );
}
