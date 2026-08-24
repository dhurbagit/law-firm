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
    <div className="sakura-glass-card rounded-2xl p-7 flex flex-col justify-between group relative overflow-hidden font-sans">
      {/* Corner Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-nepal-blue/20 rounded-full blur-2xl group-hover:bg-crimson/20 transition-all duration-300"></div>

      <div>
        {/* Icon & Featured Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-nepal-dark border border-sakura-border flex items-center justify-center text-white group-hover:bg-crimson group-hover:border-nepal-blue group-hover:scale-110 transition-all duration-300 shadow-lg">
            <IconComponent className="w-6 h-6" />
          </div>
          {practiceArea.is_featured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-crimson/15 text-crimson border border-crimson/30">
              Core Practice
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-crimson transition-colors">
          <Link href={practiceArea.slug ? `/practice-areas/${practiceArea.slug}` : '/practice-areas'}>
            {practiceArea.title}
          </Link>
        </h3>

        {/* Short Summary */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          {practiceArea.short_summary}
        </p>

        {/* Sub-practice areas */}
        {practiceArea.children && practiceArea.children.length > 0 && (
          <div className="mb-6 pt-3 border-t border-sakura-border/30 space-y-1.5 font-sans">
            <span className="text-[11px] uppercase tracking-wider text-crimson font-bold block">
              Sub-Specialties:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {practiceArea.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.slug ? `/practice-areas/${child.slug}` : '/practice-areas'}
                  className="text-[11px] px-2 py-0.5 rounded bg-nepal-dark text-slate-200 hover:text-white hover:bg-nepal-blue border border-sakura-border/40"
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explore Link */}
      <div className="pt-4 border-t border-sakura-border/30 flex items-center justify-between text-xs font-bold text-crimson group-hover:text-white">
        <Link 
          href={practiceArea.slug ? `/practice-areas/${practiceArea.slug}` : '/practice-areas'}
          className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
        >
          <span>Explore Practice Capabilities</span>
          <ArrowRight className="w-3.5 h-3.5 text-crimson" />
        </Link>
      </div>
    </div>
  );
}
