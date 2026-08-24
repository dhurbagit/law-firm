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
    <div className="sakura-glass-card h-100 p-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
      
      <div>
        {/* Header: Icon Crest & Core Badge */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div 
            className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-dark border border-white-50 text-white shadow-sm"
            style={{ width: '48px', height: '48px' }}
          >
            <IconComponent className="text-white" style={{ width: '24px', height: '24px' }} />
          </div>
          
          {practiceArea.is_featured ? (
            <span className="badge bg-crimson text-white px-3 py-1 rounded-pill small fw-bold text-uppercase" style={{ fontSize: '10px' }}>
              Core Practice
            </span>
          ) : (
            <span className="text-white-50 small text-uppercase fw-bold" style={{ fontSize: '10px' }}>
              Discipline
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif fs-4 fw-bold text-white mb-2 lh-sm">
          <Link href={areaUrl} className="text-white text-decoration-none hover-crimson">
            {practiceArea.title}
          </Link>
        </h3>

        {/* Summary Description */}
        <p className="text-white-50 small lh-base mb-4">
          {practiceArea.short_summary}
        </p>

        {/* Sub-Specialties Pills */}
        {practiceArea.children && practiceArea.children.length > 0 && (
          <div className="pt-3 mb-4 border-top border-sakura">
            <span className="d-block text-uppercase text-crimson fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
              Sub-Disciplines & Focus Areas
            </span>
            <div className="d-flex flex-wrap gap-2">
              {practiceArea.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.slug ? `/practice-areas/${child.slug}` : '/practice-areas'}
                  className="badge bg-white text-nepal-dark text-decoration-none d-flex align-items-center gap-1 p-2 rounded-2 fw-semibold shadow-sm hover-crimson-pill"
                  style={{ fontSize: '11px' }}
                >
                  <span>{child.title}</span>
                  <ChevronRight style={{ width: '12px', height: '12px' }} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Action Button */}
      <div className="pt-3 border-top border-sakura">
        <Link 
          href={areaUrl}
          className="btn btn-danger btn-crimson w-100 d-flex align-items-center justify-content-between py-2 px-3 rounded-3 text-white fw-bold small text-uppercase"
          style={{ letterSpacing: '0.05em' }}
        >
          <span>Explore Practice Group</span>
          <ArrowRight className="text-white" style={{ width: '16px', height: '16px' }} />
        </Link>
      </div>

    </div>
  );
}
