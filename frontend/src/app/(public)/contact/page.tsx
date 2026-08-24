import React from 'react';
import { Metadata } from 'next';
import { getPracticeAreas } from '@/lib/api';
import { ConsultationForm } from '@/components/ConsultationForm';
import { 
  Phone, 
  Mail 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Confidential Case Evaluation',
  description: 'Connect with Apex Legal Counsel LLP. Offices in New York, Washington D.C., and San Francisco. Available 24/7 for urgent legal consultations.',
  alternates: {
    canonical: 'https://apexlegal.com/contact',
  },
};

export default async function ContactPage() {
  const practiceAreas = await getPracticeAreas();

  return (
    <div className="min-h-screen py-16 font-sans bg-nepal-dark text-white">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 font-sans">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nepal-surface border border-sakura-border text-white text-xs font-bold uppercase tracking-wider font-sans">
            <Mail className="w-3.5 h-3.5 text-crimson" />
            <span>Confidential Intake</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Apex Legal. <br />
            <span className="text-crimson">Immediate Case Evaluation.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal font-sans">
            Our partners and crisis response team are available 24/7 for emergency corporate inquiries, grand jury subpoenas, and catastrophic injury evaluations.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Office Locations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div id="consultation" className="lg:col-span-7">
            <ConsultationForm 
              practiceAreas={practiceAreas.map(p => ({ id: p.id, title: p.title }))}
              sourceContext="contact-page"
            />
          </div>

          {/* Right Column: Offices & Contact details */}
          <div className="lg:col-span-5 space-y-8 font-sans">
            
            {/* Urgent Hotline Card */}
            <div className="p-8 rounded-2xl bg-nepal-surface border border-sakura-border shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-crimson">
                <Phone className="w-5 h-5 text-crimson" />
                <span className="text-xs uppercase font-bold tracking-wider font-sans">24/7 Urgent Response</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Direct Emergency Hotline
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                For immediate arrest representation, search warrant execution, or catastrophic accidents occurring after hours.
              </p>
              <a
                href="tel:12128904400"
                className="block text-2xl font-serif font-bold text-crimson hover:text-white transition"
              >
                (212) 890-4400
              </a>
            </div>

            {/* Office Locations */}
            <div className="space-y-4 font-sans">
              <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider text-crimson">
                National Office Locations
              </h3>

              {/* New York Flagship */}
              <div className="p-6 rounded-2xl bg-nepal-surface border border-sakura-border/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-white text-base">New York Flagship</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-nepal-dark text-white border border-crimson font-bold">Headquarters</span>
                </div>
                <p className="text-xs text-slate-300">375 Park Avenue, 28th Floor, New York, NY 10152</p>
                <div className="text-xs text-slate-400 pt-1 flex items-center gap-4">
                  <span>Tel: (212) 890-4400</span>
                  <span>•</span>
                  <span>ny@apexlegal.com</span>
                </div>
              </div>

              {/* Washington D.C. */}
              <div className="p-6 rounded-2xl bg-nepal-surface border border-sakura-border/40 space-y-2">
                <span className="font-serif font-bold text-white text-base block">Washington D.C. Regulatory Group</span>
                <p className="text-xs text-slate-300">1401 Pennsylvania Avenue NW, Suite 900, Washington, DC 20004</p>
                <div className="text-xs text-slate-400 pt-1 flex items-center gap-4">
                  <span>Tel: (202) 670-3300</span>
                  <span>•</span>
                  <span>dc@apexlegal.com</span>
                </div>
              </div>

              {/* San Francisco */}
              <div className="p-6 rounded-2xl bg-nepal-surface border border-sakura-border/40 space-y-2">
                <span className="font-serif font-bold text-white text-base block">San Francisco & Silicon Valley IP</span>
                <p className="text-xs text-slate-300">555 California Street, 32nd Floor, San Francisco, CA 94104</p>
                <div className="text-xs text-slate-400 pt-1 flex items-center gap-4">
                  <span>Tel: (415) 990-1122</span>
                  <span>•</span>
                  <span>sf@apexlegal.com</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
