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
    <div className="min-h-screen py-16">
      
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172A45] border border-[#C5A880]/30 text-[#DFC7A5] text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Trial Counsel & Partners</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Distinguished Advocates. <br />
            <span className="gold-gradient-text">Relentless Courtroom Leadership.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our attorneys have commanded high-profile trials across federal district courts, the Federal Circuit, the ITC, and state appellate benches.
          </p>
        </div>
      </div>

      {/* Grid of Attorneys */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {attorneys.map((attorney) => (
            <AttorneyCard key={attorney.id} attorney={attorney} />
          ))}
        </div>
      </div>

      {/* Direct Booking / Consultation Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm 
          title="Schedule a Private Retainer Discussion"
          subtitle="Directly consult with our practice group leadership regarding your legal matter."
        />
      </div>

    </div>
  );
}
