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
  ChevronRight,
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
    <div className="card-light h-100 p-4 d-flex flex-column justify-content-between">

      <div>
        {/* Header: Icon + Badge */}
        <div className="d-flex align-items-start justify-content-between mb-4 gap-3">
          <div className="card-icon-dark">
            <IconComponent style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
          </div>

          {practiceArea.is_featured ? (
            <span className="badge-category">Core Practice</span>
          ) : (
            <span
              className="text-uppercase fw-bold"
              style={{ fontSize: '9px', letterSpacing: '0.1em', color: '#94A3B8' }}
            >
              Discipline
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif fw-bold mb-2" style={{ fontSize: '1.15rem', color: '#001F54', lineHeight: 1.3 }}>
          <Link href={areaUrl} className="text-decoration-none hover-crimson" style={{ color: '#001F54' }}>
            {practiceArea.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="small lh-base mb-4" style={{ color: '#475569' }}>
          {practiceArea.short_summary}
        </p>

        {/* Sub-Specialties Pills */}
        {practiceArea.children && practiceArea.children.length > 0 && (
          <div className="pt-3 mb-4 border-top border-canvas">
            <span
              className="d-block fw-bold text-uppercase mb-2"
              style={{ fontSize: '9px', letterSpacing: '0.1em', color: '#DC143C' }}
            >
              Sub-Disciplines
            </span>
            <div className="d-flex flex-wrap gap-2">
              {practiceArea.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.slug ? `/practice-areas/${child.slug}` : '/practice-areas'}
                  className="pill-sub"
                >
                  <span>{child.title}</span>
                  <ChevronRight style={{ width: '10px', height: '10px' }} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer CTA */}
      <div className="pt-3 border-top border-canvas">
        <Link
          href={areaUrl}
          className="btn btn-crimson w-100 d-flex align-items-center justify-content-between py-2 px-3 rounded-3 fw-bold small"
          style={{ letterSpacing: '0.04em' }}
        >
          <span>Explore Practice Group</span>
          <ArrowRight style={{ width: '15px', height: '15px', color: '#FFFFFF' }} />
        </Link>
      </div>

    </div>
  );
}
