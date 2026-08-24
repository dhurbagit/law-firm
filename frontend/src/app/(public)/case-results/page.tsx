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
    <div className="min-vh-100 py-5 bg-nepal-dark text-white">
      
      {/* Top Header */}
      <div className="container-xl mb-5">
        <div style={{ maxWidth: '700px' }}>
          <div className="badge bg-nepal-surface border border-sakura text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-inline-flex align-items-center gap-1 mb-3">
            <Trophy className="text-crimson" style={{ width: '14px', height: '14px' }} />
            <span>Documented Track Record</span>
          </div>
          <h1 className="font-serif display-4 fw-bold text-white mb-3">
            Landmark Verdicts & <br />
            <span className="text-crimson">Significant Recoveries</span>
          </h1>
          <p className="text-white-50 fs-5 leading-relaxed mb-0">
            Our relentless trial readiness has delivered over $250 Million in aggregate recoveries, precedent-setting appellate decisions, and total declination of federal investigations.
          </p>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="container-xl mb-5">
        <div className="row g-4">
          {caseResults.map((result) => (
            <div key={result.id} className="col-12 col-md-6 col-lg-4">
              <CaseResultCard result={result} />
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Section */}
      <div className="container-xl" style={{ maxWidth: '900px' }}>
        <ConsultationForm 
          title="Have Your Matter Evaluated by Trial Counsel"
          subtitle="Explore if your situation qualifies for high-exposure litigation or contingent representation."
          practiceAreas={practiceAreas.map(p => ({ id: p.id, title: p.title }))}
        />
      </div>

    </div>
  );
}
