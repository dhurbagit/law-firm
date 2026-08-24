import React from 'react';
import Link from 'next/link';
import { CaseResult } from '@/lib/api';
import { Trophy, Scale, Calendar, UserCheck } from 'lucide-react';

interface CaseResultCardProps {
  result: CaseResult;
}

export function CaseResultCard({ result }: CaseResultCardProps) {
  return (
    <div className="navy-card-glow rounded-2xl p-7 flex flex-col justify-between border border-[#C5A880]/20 relative overflow-hidden group">
      {/* Background seal glow */}
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Trophy className="w-32 h-32 text-[#C5A880]" />
      </div>

      <div>
        {/* Top Verdict Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#172A45] border border-[#C5A880]/30 text-[#DFC7A5] text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{result.settlement_verdict}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{result.case_year}</span>
          </div>
        </div>

        {/* Case Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-[#DFC7A5] transition-colors leading-snug">
          {result.title}
        </h3>

        {/* Case Summary */}
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
          {result.summary}
        </p>
      </div>

      {/* Footer details */}
      <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {result.practice_area && (
            <Link 
              href={result.practice_area.slug ? `/practice-areas/${result.practice_area.slug}` : '/practice-areas'}
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#C5A880] transition"
            >
              <Scale className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{result.practice_area.title}</span>
            </Link>
          )}

          {result.lead_attorney && (
            <Link 
              href={result.lead_attorney.slug ? `/attorneys/${result.lead_attorney.slug}` : '/attorneys'}
              className="flex items-center gap-1.5 text-[#C5A880] hover:text-[#DFC7A5] transition font-medium"
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
