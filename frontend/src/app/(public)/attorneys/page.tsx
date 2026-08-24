import React from 'react';
import { Metadata } from 'next';
import { getAttorneys } from '@/lib/api';
import { AttorneyCard } from '@/components/AttorneyCard';
import { ConsultationForm } from '@/components/ConsultationForm';
import { Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Distinguished Attorneys & Partners',
  description: 'Meet the senior trial litigators and corporate partners at Apex Legal Counsel LLP. Decades of trial leadership, Ivy League credentials, and federal court advocacy.',
  alternates: {
    canonical: 'https://apexlegal.com/attorneys',
  },
};

export default async function AttorneysPage() {
  const attorneys = await getAttorneys();

  return (
    <div className="min-vh-100 py-5 bg-nepal-dark text-white">
      
      {/* Top Banner */}
      <div className="container-xl mb-5">
        <div style={{ maxWidth: '700px' }}>
          <div className="badge bg-nepal-surface border border-sakura text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-inline-flex align-items-center gap-1 mb-3">
            <Award className="text-crimson" style={{ width: '14px', height: '14px' }} />
            <span>Trial Counsel & Partners</span>
          </div>
          <h1 className="font-serif display-4 fw-bold text-white mb-3">
            Distinguished Advocates. <br />
            <span className="text-crimson">Relentless Courtroom Leadership.</span>
          </h1>
          <p className="text-white-50 fs-5 leading-relaxed mb-0">
            Our attorneys have commanded high-profile trials across federal district courts, the Federal Circuit, the ITC, and state appellate benches.
          </p>
        </div>
      </div>

      {/* Grid of Attorneys */}
      <div className="container-xl mb-5">
        <div className="row g-4">
          {attorneys.map((attorney) => (
            <div key={attorney.id} className="col-12 col-sm-6 col-lg-3">
              <AttorneyCard attorney={attorney} />
            </div>
          ))}
        </div>
      </div>

      {/* Direct Booking / Consultation Section */}
      <div className="container-xl" style={{ maxWidth: '900px' }}>
        <ConsultationForm 
          title="Schedule a Private Retainer Discussion"
          subtitle="Directly consult with our practice group leadership regarding your legal matter."
        />
      </div>

    </div>
  );
}
