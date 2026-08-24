'use client';

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
  ArrowRight,
  ChevronRight
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
  const areaUrl = practiceArea.slug ? `/practice-areas/${practiceArea.slug}` : '/practice-areas';

  return (
    <div className="group relative rounded-2xl bg-[#0A2540] dark:bg-[#0A2540] border border-[#003893]/40 hover:border-crimson/80 shadow-xl hover:shadow-2xl hover:shadow-crimson/15 transition-all duration-300 flex flex-col justify-between overflow-hidden p-7 font-sans">
      
      {/* Top Subtle Red Accent Line that expands on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nepal-blue via-crimson to-nepal-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Ambient Spotlight Glow on Hover */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-crimson/10 rounded-full blur-2xl group-hover:bg-crimson/20 transition-all duration-300 pointer-events-none" />

      <div>
        {/* Header: Icon Crest & Core Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-xl bg-[#001F54] border border-[#003893]/60 group-hover:border-crimson group-hover:bg-crimson flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-105">
            <IconComponent className="w-7 h-7 text-white" />
          </div>
          
          {practiceArea.is_featured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-crimson/15 text-crimson border border-crimson/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
              Core Practice
            </span>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Discipline
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-crimson transition-colors leading-tight">
          <Link href={areaUrl} className="hover:underline">
            {practiceArea.title}
          </Link>
        </h3>

        {/* Summary Description */}
        <p className="text-slate-200 text-sm leading-relaxed mb-6 font-normal">
          {practiceArea.short_summary}
        </p>

        {/* Sub-Specialties Pill Badges */}
        {practiceArea.children && practiceArea.children.length > 0 && (
          <div className="mb-6 pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-crimson font-extrabold block">
              Sub-Disciplines & Focus Areas
            </span>
            <div className="flex flex-wrap gap-2">
              {practiceArea.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.slug ? `/practice-areas/${child.slug}` : '/practice-areas'}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#00153B] text-white font-medium hover:bg-crimson hover:text-white border border-[#003893]/50 hover:border-crimson transition shadow-sm"
                >
                  <span>{child.title}</span>
                  <ChevronRight className="w-3 h-3 text-crimson group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Clear Action Button */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <Link 
          href={areaUrl}
          className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#001F54] group-hover:bg-crimson text-xs font-bold text-white uppercase tracking-wider border border-[#003893]/50 group-hover:border-crimson shadow transition-all duration-300"
        >
          <span>Explore Practice Group</span>
          <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
