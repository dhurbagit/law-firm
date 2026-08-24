import React from 'react';
import Link from 'next/link';
import { CaseResult } from '@/lib/api';
import { Trophy, Scale, Calendar, UserCheck } from 'lucide-react';

interface CaseResultCardProps {
  result: CaseResult;
}

export function CaseResultCard({ result }: CaseResultCardProps) {
  return (
    <div className="card sakura-glass-card h-100 border-0 rounded-4 p-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
      <div>
        {/* Top Verdict Header */}
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div className="badge bg-crimson text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-flex align-items-center gap-1 shadow-sm">
            <Trophy style={{ width: '14px', height: '14px' }} />
            <span>{result.settlement_verdict}</span>
          </div>
          <div className="d-flex align-items-center gap-1 small text-white-50 fw-bold">
            <Calendar className="text-nepal-blue" style={{ width: '14px', height: '14px' }} />
            <span>{result.case_year}</span>
          </div>
        </div>

        {/* Case Title */}
        <h4 className="font-serif fs-5 fw-bold text-white mb-2 lh-snug">
          {result.title}
        </h4>

        {/* Case Summary */}
        <p className="text-white-50 small lh-base mb-4">
          {result.summary}
        </p>
      </div>

      {/* Footer details */}
      <div className="pt-3 border-top border-sakura">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 small">
          {result.practice_area && (
            <Link 
              href={result.practice_area.slug ? `/practice-areas/${result.practice_area.slug}` : '/practice-areas'}
              className="text-white-50 text-decoration-none hover-crimson d-flex align-items-center gap-1"
            >
              <Scale className="text-nepal-blue" style={{ width: '14px', height: '14px' }} />
              <span>{result.practice_area.title}</span>
            </Link>
          )}

          {result.lead_attorney && (
            <Link 
              href={result.lead_attorney.slug ? `/attorneys/${result.lead_attorney.slug}` : '/attorneys'}
              className="text-crimson text-decoration-none fw-bold d-flex align-items-center gap-1"
            >
              <UserCheck style={{ width: '14px', height: '14px' }} />
              <span>Lead: {result.lead_attorney.name}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
