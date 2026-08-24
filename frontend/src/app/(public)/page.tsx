import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getFirmStats, 
  getPracticeAreas, 
  getAttorneys, 
  getCaseResults 
} from '@/lib/api';
import { StatsSection } from '@/components/StatsSection';
import { PracticeAreaCard } from '@/components/PracticeAreaCard';
import { AttorneyCard } from '@/components/AttorneyCard';
import { CaseResultCard } from '@/components/CaseResultCard';
import { ConsultationForm } from '@/components/ConsultationForm';
import { 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  Gavel, 
  Clock, 
  CheckCircle2, 
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
    <div className="flex flex-col min-h-screen font-sans bg-[#000000] text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-pattern pt-20 pb-28 md:pt-28 md:pb-36 border-b border-[#003893]/40">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#003893]/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#DC143C]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Prestige badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#001C4A] border border-[#003893] text-xs font-bold text-white tracking-wide shadow-md">
              <ShieldCheck className="w-4 h-4 text-[#DC143C]" />
              <span>National Trial Litigators & Corporate Counsel</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Formidable Advocacy. <br />
              <span className="text-[#DC143C]">Decisive Landmark Results.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal font-sans">
              When high-stakes corporate disputes arise or catastrophic injury demands justice, Apex Legal Counsel commands the courtroom and negotiating table with unwavering precision.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-sans">
              <Link
                href="#case-evaluation"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] border border-white/20 shadow-xl shadow-[#DC143C]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Request Free Case Evaluation</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                href="/case-results"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#001C4A] hover:bg-[#003893] border border-[#003893] transition"
              >
                <span>Explore $250M+ In Verdicts</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center gap-6 sm:gap-10 border-t border-[#003893]/30 text-xs text-slate-300 font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                <span className="font-semibold text-white">Zero Fee Unless We Win</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                <span className="font-semibold text-white">24/7 Confidential Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                <span className="font-semibold text-white">Former Federal Prosecutors</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatsSection stats={stats} />

      {/* 3. FEATURED PRACTICE AREAS */}
      <section className="py-20 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-2 font-sans">
                Legal Capabilities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Specialized Practice Disciplines
              </h2>
              <p className="text-slate-300 text-sm mt-3 font-sans">
                Our partners lead dedicated practice groups tailored to high-exposure litigation, regulatory compliance, and complex corporate transactions.
              </p>
            </div>

            <Link
              href="/practice-areas"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#DC143C] hover:text-white transition font-sans"
            >
              <span>View All 8 Practice Areas</span>
              <ArrowRight className="w-4 h-4" />
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
      <section className="py-20 bg-[#00122E] border-y border-[#003893]/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] font-sans">
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
                <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
                    <Gavel className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Unmatched Trial Readiness</h4>
                  <p className="text-xs text-slate-300">Over 45+ jury verdicts taken to verdict with a 98.6% favorable outcome rate.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
                    <Building className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Deep Regulatory Insight</h4>
                  <p className="text-xs text-slate-300">Partners include former AUSAs and federal enforcement directors from SDNY.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Contingency Fee Protection</h4>
                  <p className="text-xs text-slate-300">In personal injury matters, you pay zero legal fees unless we successfully recover.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#000000] border border-[#003893]/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">Direct Partner Access</h4>
                  <p className="text-xs text-slate-300">Your legal strategy is guided by senior partners, never handed off to junior associates.</p>
                </div>
              </div>
            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#003893] shadow-2xl h-[420px]">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                  alt="Apex Legal Headquarters"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-[#000000]/90 backdrop-blur-md border border-[#003893]/50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC143C] block font-sans">Tier 1 National Law Firm</span>
                  <span className="font-serif text-lg font-bold text-white">375 Park Avenue, 28th Floor, New York</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DISTINGUISHED ATTORNEYS */}
      <section className="py-20 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-2 font-sans">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#003893] hover:bg-[#DC143C] border border-[#003893] transition font-sans"
            >
              <span>Explore All Attorney Credentials & Bios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. LANDMARK VERDICTS BANNER */}
      <section className="py-20 bg-[#00122E] border-y border-[#003893]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-2 font-sans">
                Proven Track Record
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Landmark Verdicts & Significant Recoveries
              </h2>
            </div>
            <Link
              href="/case-results"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#DC143C] hover:text-white transition font-sans"
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
      <section className="py-20 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-2 font-sans">
              Client Endorsements
            </span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-tight">
              Trusted When Reputation & Survival Are on the Line
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            <div className="p-7 rounded-2xl bg-[#00122E] border border-[#003893]/40 relative flex flex-col justify-between">
              <Quote className="w-8 h-8 text-[#DC143C]/40 mb-4" />
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;When our SaaS intellectual property was misappropriated by rogue competitors, Marcus Croft secured an emergency federal injunction in 72 hours. Their technical depth saved our company.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#003893]/30">
                <span className="font-serif font-bold text-white text-sm block">CTO & Founder</span>
                <span className="text-xs text-slate-400">Enterprise AI Infrastructure Firm</span>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#00122E] border border-[#003893]/40 relative flex flex-col justify-between">
              <Quote className="w-8 h-8 text-[#DC143C]/40 mb-4" />
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;Eleanor Vance and her trial team fought tenaciously against three corporate insurance carriers after my catastrophic trucking accident. The $14.2M verdict secured my family&apos;s lifelong medical care.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#003893]/30">
                <span className="font-serif font-bold text-white text-sm block">Michael R.</span>
                <span className="text-xs text-slate-400">Catastrophic Injury Client</span>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#00122E] border border-[#003893]/40 relative flex flex-col justify-between">
              <Quote className="w-8 h-8 text-[#DC143C]/40 mb-4" />
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                &ldquo;Victoria Hayes took charge of an aggressive federal regulatory inquiry targeting our executive suite. Her strategic engagement led to a complete declination without charges.&rdquo;
              </p>
              <div className="pt-4 border-t border-[#003893]/30">
                <span className="font-serif font-bold text-white text-sm block">General Counsel</span>
                <span className="text-xs text-slate-400">Publicly Traded Financial Entity</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. EMBEDDED CASE EVALUATION SECTION */}
      <section className="py-20 bg-[#00122E] border-t border-[#003893]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ConsultationForm 
            practiceAreas={practiceAreas.map(p => ({ id: p.id, title: p.title }))}
          />
        </div>
      </section>

    </div>
  );
}
