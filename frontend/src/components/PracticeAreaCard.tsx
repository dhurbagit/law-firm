import React from 'react';
import Link from 'next/link';
import { PracticeArea } from '@/lib/api';
import { 
  Briefcase, 
  ShieldAlert, 
  Award, 
  Gavel, 
  Building2, 
  Users, 
  Scale, 
  HeartPulse, 
  ArrowRight 
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  ShieldAlert,
  Award,
  Gavel,
  Building2,
  Users,
  Scale,
  HeartPulse,
};

interface PracticeAreaCardProps {
  practiceArea: PracticeArea;
}

export function PracticeAreaCard({ practiceArea }: PracticeAreaCardProps) {
  const IconComponent = iconMap[practiceArea.icon || 'Scale'] || Scale;

  return (
    <div className="navy-card-glow rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden">
      {/* Accent glow on corner */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C5A880]/10 rounded-full blur-2xl group-hover:bg-[#C5A880]/20 transition-all duration-300"></div>

      <div>
        {/* Icon & Featured Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0A192F] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] group-hover:border-[#C5A880] group-hover:scale-110 transition-all duration-300 shadow-lg">
            <IconComponent className="w-6 h-6" />
          </div>
          {practiceArea.is_featured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#C5A880]/10 text-[#DFC7A5] border border-[#C5A880]/20">
              Core Practice
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-[#DFC7A5] transition-colors">
          <Link href={practiceArea.slug ? `/practice-areas/${practiceArea.slug}` : '/practice-areas'}>
            {practiceArea.title}
          </Link>
        </h3>

        {/* Short Summary */}
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
          {practiceArea.short_summary}
        </p>

        {/* Sub-practice areas if any */}
        {practiceArea.children && practiceArea.children.length > 0 && (
          <div className="mb-6 pt-3 border-t border-white/5 space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#856E4D] font-semibold block">
              Sub-Specialties:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {practiceArea.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.slug ? `/practice-areas/${child.slug}` : '/practice-areas'}
                  className="text-[11px] px-2 py-0.5 rounded bg-[#0A192F] text-slate-300 hover:text-[#C5A880] border border-white/5"
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explore Link */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#C5A880] group-hover:text-[#DFC7A5]">
        <Link 
          href={practiceArea.slug ? `/practice-areas/${practiceArea.slug}` : '/practice-areas'}
          className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
        >
          <span>Explore Practice Capabilities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
