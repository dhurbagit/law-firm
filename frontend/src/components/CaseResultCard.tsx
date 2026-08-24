import React from 'react';
import Link from 'next/link';
import { CaseResult } from '@/lib/api';
import { Trophy, Scale, Calendar, UserCheck } from 'lucide-react';

interface CaseResultCardProps {
  result: CaseResult;
}

export function CaseResultCard({ result }: CaseResultCardProps) {
  return (
    <div className="navy-card-glow rounded-2xl p-7 flex flex-col justify-between border border-[#003893]/50 relative overflow-hidden group font-sans">
      {/* Background seal glow */}
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-15 transition-opacity">
        <Trophy className="w-32 h-32 text-[#DC143C]" />
      </div>

      <div>
        {/* Top Verdict Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC143C] text-white text-xs font-bold uppercase tracking-wider shadow">
            <Trophy className="w-3.5 h-3.5 text-white" />
            <span>{result.settlement_verdict}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300 font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#003893]" />
            <span>{result.case_year}</span>
          </div>
        </div>

        {/* Case Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-[#DC143C] transition-colors leading-snug">
          {result.title}
        </h3>

        {/* Case Summary */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          {result.summary}
        </p>
      </div>

      {/* Footer details */}
      <div className="pt-4 border-t border-[#003893]/30 space-y-2 text-xs font-sans">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {result.practice_area && (
            <Link 
              href={result.practice_area.slug ? `/practice-areas/${result.practice_area.slug}` : '/practice-areas'}
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#DC143C] transition"
            >
              <Scale className="w-3.5 h-3.5 text-[#003893]" />
              <span>{result.practice_area.title}</span>
            </Link>
          )}

          {result.lead_attorney && (
            <Link 
              href={result.lead_attorney.slug ? `/attorneys/${result.lead_attorney.slug}` : '/attorneys'}
              className="flex items-center gap-1.5 text-[#DC143C] hover:text-white transition font-bold"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Lead: {result.lead_attorney.name}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
