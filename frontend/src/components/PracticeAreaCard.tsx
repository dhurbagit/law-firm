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
    <div className="sakura-glass-card rounded-2xl p-7 flex flex-col justify-between border border-sakura-border relative overflow-hidden group font-sans">
      
      {/* Top Subtle Red Accent Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nepal-blue via-crimson to-nepal-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Card Body Content */}
      <div className="relative z-10">
        {/* Header: Icon Crest (White Icon) & Core Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-13 h-13 rounded-xl bg-[#001F54] border border-sakura-border group-hover:border-crimson group-hover:bg-crimson flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-105">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          
          {practiceArea.is_featured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-crimson/15 text-crimson border border-crimson/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
              Core Practice
            </span>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Discipline
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-crimson transition-colors leading-tight">
          <Link href={areaUrl} className="hover:underline text-white">
            {practiceArea.title}
          </Link>
        </h3>

        {/* Summary Description */}
        <p className="text-slate-200 text-sm leading-relaxed mb-6 font-normal">
          {practiceArea.short_summary}
        </p>

        {/* Sub-Specialties Pill Badges */}
        {practiceArea.children && practiceArea.children.length > 0 && (
          <div className="mb-6 pt-4 border-t border-sakura-border/30 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-crimson font-extrabold block">
              Sub-Disciplines & Focus Areas
            </span>
            <div className="flex flex-wrap gap-2">
              {practiceArea.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.slug ? `/practice-areas/${child.slug}` : '/practice-areas'}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#00153B] text-white font-medium hover:bg-crimson hover:text-white border border-sakura-border/40 hover:border-crimson transition shadow-sm"
                >
                  <span className="text-white font-medium">{child.title}</span>
                  <ChevronRight className="w-3 h-3 text-crimson group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Action Button (White Color Text) */}
      <div className="pt-4 border-t border-sakura-border/30 relative z-10">
        <Link 
          href={areaUrl}
          className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-crimson hover:bg-crimson-hover text-xs font-bold text-white uppercase tracking-wider border border-white/20 shadow-md shadow-crimson/25 transition-all duration-300"
        >
          <span className="text-white font-bold">Explore Practice Group</span>
          <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
