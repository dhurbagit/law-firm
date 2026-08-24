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
    <div className="flex flex-col min-h-screen font-sans bg-nepal-dark text-white">
      
      {/* 1. INTERACTIVE ANIMATED COURTROOM HERO (Transitioning Background & Striking Gavel "Order, Order") */}
      <CourtroomHero />

      {/* 2. STATS SECTION */}
      <StatsSection stats={stats} />

      {/* 3. FEATURED PRACTICE AREAS */}
      <section className="py-24 border-b border-sakura-border relative overflow-hidden">
        
        {/* Court Item Background Stickers / Watermarks */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <div className="absolute -top-12 -left-12 w-96 h-96 text-white/[0.035] -rotate-12">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
              <line x1="3" y1="22" x2="21" y2="22" />
              <line x1="6" y1="18" x2="6" y2="11" />
              <line x1="10" y1="18" x2="10" y2="11" />
              <line x1="14" y1="18" x2="14" y2="11" />
              <line x1="18" y1="18" x2="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </div>

          <div className="absolute top-1/3 -right-16 w-80 h-80 text-white/[0.03] rotate-12">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" />
              <path d="M12 3v18" />
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </div>

          <div className="absolute -bottom-16 left-1/3 w-72 h-72 text-white/[0.025] -rotate-45">
            <Gavel className="w-full h-full stroke-[0.8]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A2540] border border-[#003893]/60 text-xs font-bold text-crimson uppercase tracking-widest">
                <span>Legal Capabilities & Trial Bench</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Specialized Practice Disciplines
              </h2>
              <p className="text-slate-200 text-base leading-relaxed font-normal">
                Our senior partners lead dedicated legal practice groups tailored to high-exposure commercial litigation, federal regulatory compliance, and multi-million dollar corporate transactions.
              </p>
            </div>

            <Link
              href="/practice-areas"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A2540] hover:bg-crimson border border-[#003893]/60 hover:border-crimson text-sm font-bold text-white transition shadow-lg flex-shrink-0 group"
            >
              <span className="text-white font-bold">View All 8 Practice Areas</span>
              <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Practice Area Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceAreas.map((area) => (
              <PracticeAreaCard key={area.id} practiceArea={area} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. THE APEX TRIAL DIFFERENCE */}
      <section className="py-20 bg-nepal-surface border-y border-sakura-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-crimson font-sans">
                The Apex Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Built For The Courtroom. <br />
                Respected Across The Negotiating Table.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                Most law firms seek quick, discounted settlements to avoid courtroom battles. At Apex Legal Counsel, every single case is prepared from day one for jury trial. Opposing counsel and insurance conglomerates know our track record, which gives our clients unparalleled leverage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-sans">
                <div className="p-4 rounded-xl bg-nepal-dark border border-sakura-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-nepal-surface border border-sakura-border flex items-center justify-center text-crimson">
                    <Gavel className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Unmatched Trial Readiness</h4>
                  <p className="text-xs text-slate-300">Over 45+ jury verdicts taken to verdict with a 98.6% favorable outcome rate.</p>
                </div>

                <div className="p-4 rounded-xl bg-nepal-dark border border-sakura-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-nepal-surface border border-sakura-border flex items-center justify-center text-crimson">
                    <Building className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Deep Regulatory Insight</h4>
                  <p className="text-xs text-slate-300">Partners include former AUSAs and federal enforcement directors from SDNY.</p>
                </div>

                <div className="p-4 rounded-xl bg-nepal-dark border border-sakura-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-nepal-surface border border-sakura-border flex items-center justify-center text-crimson">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Contingency Fee Protection</h4>
                  <p className="text-xs text-slate-300">In personal injury matters, you pay zero legal fees unless we successfully recover.</p>
                </div>

                <div className="p-4 rounded-xl bg-nepal-dark border border-sakura-border/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-nepal-surface border border-sakura-border flex items-center justify-center text-crimson">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Direct Partner Access</h4>
                  <p className="text-xs text-slate-300">Your legal strategy is guided by senior partners, never handed off to junior associates.</p>
                </div>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-sakura-border shadow-2xl h-[420px]">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                  alt="Apex Legal Headquarters"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nepal-dark via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-nepal-dark/90 backdrop-blur-md border border-sakura-border/50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-crimson block font-sans">Tier 1 National Law Firm</span>
                  <span className="font-serif text-lg font-bold text-white">375 Park Avenue, 28th Floor, New York</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DISTINGUISHED ATTORNEYS */}
      <section className="py-20 bg-nepal-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-crimson block mb-2 font-sans">
              Our Leadership
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Distinguished Partners & Trial Litigators
            </h2>
            <p className="text-slate-300 text-sm mt-3 font-sans">
              Representing ivy-league academic backgrounds, judicial clerkships, and decades of trial leadership in federal and appellate courts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {attorneys.map((attorney) => (
              <AttorneyCard key={attorney.id} attorney={attorney} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/attorneys"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-nepal-blue hover:bg-crimson border border-nepal-blue transition font-sans"
            >
              <span>Explore All Attorney Credentials & Bios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. LANDMARK VERDICTS BANNER */}
      <section className="py-20 bg-nepal-surface border-y border-sakura-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-crimson block mb-2 font-sans">
                Proven Track Record
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Landmark Verdicts & Significant Recoveries
              </h2>
            </div>
            <Link
              href="/case-results"
              className="inline-flex items-center gap-2 text-sm font-bold text-crimson hover:text-white transition font-sans"
            >
              <span>View Full Case History</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {caseResults.slice(0, 3).map((res) => (
              <CaseResultCard key={res.id} result={res} />
            ))}
          </div>

        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      <section className="py-20 bg-nepal-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-crimson block mb-2 font-sans">
              Client Endorsements
            </span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-tight">
              Trusted When Reputation & Survival Are on the Line
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            <div className="p-7 rounded-2xl bg-nepal-surface border border-sakura-border/40 relative flex flex-col justify-between">
              <Quote className="w-8 h-8 text-crimson/40 mb-4" />
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;When our SaaS intellectual property was misappropriated by rogue competitors, Marcus Croft secured an emergency federal injunction in 72 hours. Their technical depth saved our company.&rdquo;
              </p>
              <div className="pt-4 border-t border-sakura-border/30">
                <span className="font-serif font-bold text-white text-sm block">CTO & Founder</span>
                <span className="text-xs text-slate-400">Enterprise AI Infrastructure Firm</span>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-nepal-surface border border-sakura-border/40 relative flex flex-col justify-between">
              <Quote className="w-8 h-8 text-crimson/40 mb-4" />
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;Eleanor Vance and her trial team fought tenaciously against three corporate insurance carriers after my catastrophic trucking accident. The $14.2M verdict secured my family&apos;s lifelong medical care.&rdquo;
              </p>
              <div className="pt-4 border-t border-sakura-border/30">
                <span className="font-serif font-bold text-white text-sm block">Michael R.</span>
                <span className="text-xs text-slate-400">Catastrophic Injury Client</span>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-nepal-surface border border-sakura-border/40 relative flex flex-col justify-between">
              <Quote className="w-8 h-8 text-crimson/40 mb-4" />
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;Victoria Hayes took charge of an aggressive federal regulatory inquiry targeting our executive suite. Her strategic engagement led to a complete declination without charges.&rdquo;
              </p>
              <div className="pt-4 border-t border-sakura-border/30">
                <span className="font-serif font-bold text-white text-sm block">General Counsel</span>
                <span className="text-xs text-slate-400">Publicly Traded Financial Entity</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. EMBEDDED CASE EVALUATION SECTION */}
      <section className="py-20 bg-nepal-surface border-t border-sakura-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ConsultationForm 
            practiceAreas={practiceAreas.map(p => ({ id: p.id, title: p.title }))}
          />
        </div>
      </section>

    </div>
  );
}
