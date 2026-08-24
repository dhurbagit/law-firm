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
    <div className="min-h-screen py-16 font-sans bg-nepal-dark text-white">
      
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nepal-surface border border-sakura-border text-white text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-crimson" />
            <span>Practice Disciplines</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comprehensive Trial & <br />
            <span className="text-crimson">Corporate Practice Groups</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            Our firm delivers Tier-1 national depth across complex corporate transactions, intellectual property litigation, and high-exposure catastrophic defense.
          </p>
        </div>
      </div>

      {/* Grid of Practice Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.map((area) => (
            <PracticeAreaCard key={area.id} practiceArea={area} />
          ))}
        </div>
      </div>

      {/* Embedded Consultation Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm 
          title="Consult with a Practice Group Leader"
          subtitle="Select your relevant legal discipline to connect with our senior trial partners."
        />
      </div>

    </div>
  );
}
