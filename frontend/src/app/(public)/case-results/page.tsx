import React from 'react';
import { Metadata } from 'next';
import { getCaseResults, getPracticeAreas } from '@/lib/api';
import { CaseResultCard } from '@/components/CaseResultCard';
import { ConsultationForm } from '@/components/ConsultationForm';
import { Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Landmark Verdicts & Significant Recoveries ($250M+)',
  description: 'Review our record of multi-million dollar jury verdicts, corporate antitrust clearances, and catastrophic injury settlements across the United States.',
  alternates: {
    canonical: 'https://apexlegal.com/case-results',
  },
};

export default async function CaseResultsPage() {
  const [caseResults, practiceAreas] = await Promise.all([
    getCaseResults(),
    getPracticeAreas(),
  ]);

  return (
    <div className="min-h-screen py-16">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172A45] border border-[#C5A880]/30 text-[#DFC7A5] text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Documented Track Record</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Landmark Verdicts & <br />
            <span className="gold-gradient-text">Significant Recoveries</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            Our relentless trial readiness has delivered over $250 Million in aggregate recoveries, precedent-setting appellate decisions, and total declination of federal investigations.
          </p>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseResults.map((result) => (
            <CaseResultCard key={result.id} result={result} />
          ))}
        </div>
      </div>

      {/* Consultation Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm 
          title="Have Your Matter Evaluated by Trial Counsel"
          subtitle="Explore if your situation qualifies for high-exposure litigation or contingent representation."
          practiceAreas={practiceAreas.map(p => ({ id: p.id, title: p.title }))}
        />
      </div>

    </div>
  );
}
