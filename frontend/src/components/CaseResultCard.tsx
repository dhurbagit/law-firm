import React from 'react';
import Link from 'next/link';
import { CaseResult } from '@/lib/api';
import { Trophy, Scale, Calendar, UserCheck } from 'lucide-react';

interface CaseResultCardProps {
  result: CaseResult;
}

export function CaseResultCard({ result }: CaseResultCardProps) {
  return (
    <div className="card-light h-100 rounded-4 p-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
      <div>
        {/* Top Verdict Header */}
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div className="badge bg-crimson text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-flex align-items-center gap-1 shadow-sm">
            <Trophy style={{ width: '14px', height: '14px' }} />
            <span>{result.settlement_verdict}</span>
          </div>
          <div className="d-flex align-items-center gap-1 small fw-bold" style={{ color: '#64748B' }}>
            <Calendar style={{ width: '14px', height: '14px', color: '#003893' }} />
            <span>{result.case_year}</span>
          </div>
        </div>

        {/* Case Title */}
        <h4 className="font-serif fw-bold mb-2 lh-snug" style={{ fontSize: '1.05rem', color: '#001F54' }}>
          {result.title}
        </h4>

        {/* Case Summary */}
        <p className="small lh-base mb-4" style={{ color: '#475569' }}>
          {result.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-top border-canvas">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 small">
          {result.practice_area && (
            <Link
              href={result.practice_area.slug ? `/practice-areas/${result.practice_area.slug}` : '/practice-areas'}
              className="text-decoration-none hover-crimson d-flex align-items-center gap-1"
              style={{ color: '#64748B' }}
            >
              <Scale style={{ width: '13px', height: '13px', color: '#003893' }} />
              <span>{result.practice_area.title}</span>
            </Link>
          )}

          {result.lead_attorney && (
            <Link
              href={result.lead_attorney.slug ? `/attorneys/${result.lead_attorney.slug}` : '/attorneys'}
              className="fw-bold text-decoration-none hover-white d-flex align-items-center gap-1"
              style={{ color: '#DC143C', fontSize: '12px' }}
            >
              <UserCheck style={{ width: '13px', height: '13px' }} />
              <span>Lead: {result.lead_attorney.name}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
