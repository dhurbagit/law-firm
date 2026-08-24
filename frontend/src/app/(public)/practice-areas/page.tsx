import React from 'react';
import { Metadata } from 'next';
import { getPracticeAreas } from '@/lib/api';
import { PracticeAreaCard } from '@/components/PracticeAreaCard';
import { ConsultationForm } from '@/components/ConsultationForm';
import { Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Practice Areas & Legal Capabilities',
  description: 'Explore Apex Legal Counsel’s specialized practice groups in Corporate Law, Catastrophic Injury, Intellectual Property, White Collar Defense, Real Estate, and Employment Arbitration.',
  alternates: {
    canonical: 'https://apexlegal.com/practice-areas',
  },
};

export default async function PracticeAreasPage() {
  const practiceAreas = await getPracticeAreas();

  return (
    <div className="min-vh-100 py-5 bg-nepal-dark text-white">
      
      {/* Top Banner */}
      <div className="container-xl mb-5">
        <div style={{ maxWidth: '700px' }}>
          <div className="badge bg-nepal-surface border border-sakura text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-inline-flex align-items-center gap-1 mb-3">
            <Scale className="text-crimson" style={{ width: '14px', height: '14px' }} />
            <span>Practice Disciplines</span>
          </div>
          <h1 className="font-serif display-4 fw-bold text-white mb-3">
            Comprehensive Trial & <br />
            <span className="text-crimson">Corporate Practice Groups</span>
          </h1>
          <p className="text-white-50 fs-5 leading-relaxed mb-0">
            Our firm delivers Tier-1 national depth across complex corporate transactions, intellectual property litigation, and high-exposure catastrophic defense.
          </p>
        </div>
      </div>

      {/* Grid of Practice Areas */}
      <div className="container-xl mb-5">
        <div className="row g-4">
          {practiceAreas.map((area) => (
            <div key={area.id} className="col-12 col-md-6 col-lg-4">
              <PracticeAreaCard practiceArea={area} />
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Consultation Section */}
      <div className="container-xl" style={{ maxWidth: '900px' }}>
        <ConsultationForm 
          title="Consult with a Practice Group Leader"
          subtitle="Select your relevant legal discipline to connect with our senior trial partners."
        />
      </div>

    </div>
  );
}
