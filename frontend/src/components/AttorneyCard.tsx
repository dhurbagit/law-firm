import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Attorney } from '@/lib/api';
import { Mail, Phone, ArrowUpRight, Scale, Award } from 'lucide-react';

interface AttorneyCardProps {
  attorney: Attorney;
}

export function AttorneyCard({ attorney }: AttorneyCardProps) {
  return (
    <div className="card-light h-100 d-flex flex-column justify-content-between overflow-hidden rounded-4">
      <div>
        {/* Photo Container */}
        <div className="position-relative w-100" style={{ height: '280px', backgroundColor: '#001F54' }}>
          {attorney.photo_url ? (
            <Image
              src={attorney.photo_url}
              alt={attorney.name}
              fill
              className="object-fit-cover"
              style={{ objectPosition: 'top' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-nepal-dark">
              <Scale style={{ width: '56px', height: '56px', opacity: 0.3, color: '#FFFFFF' }} />
            </div>
          )}

          {/* Practice Area Badge */}
          {attorney.practice_areas && attorney.practice_areas.length > 0 && (
            <div className="position-absolute top-0 start-0 m-3">
              <span className="badge-category">
                {attorney.practice_areas[0].title}
              </span>
            </div>
          )}

          {/* View Profile Button */}
          <Link
            href={`/attorneys/${attorney.slug}`}
            className="position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center rounded-circle bg-white shadow hover-crimson-bg text-decoration-none"
            style={{ width: '32px', height: '32px', border: '1px solid #E2E8F0' }}
            aria-label={`View profile for ${attorney.name}`}
          >
            <ArrowUpRight style={{ width: '15px', height: '15px', color: '#001F54' }} />
          </Link>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <span
            className="text-uppercase fw-bold d-block mb-1"
            style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#DC143C' }}
          >
            {attorney.designation}
          </span>

          <h4 className="font-serif fw-bold mb-2" style={{ fontSize: '1.05rem', color: '#001F54' }}>
            <Link
              href={`/attorneys/${attorney.slug}`}
              className="text-decoration-none hover-crimson"
              style={{ color: '#001F54' }}
            >
              {attorney.name}
            </Link>
          </h4>

          <p className="small lh-base mb-3 line-clamp-3" style={{ color: '#475569' }}>
            {attorney.bio}
          </p>

          {/* Bar Admission */}
          {attorney.bar_admissions && attorney.bar_admissions.length > 0 && (
            <div
              className="pt-2 border-top border-canvas d-flex align-items-center gap-1"
              style={{ color: '#64748B', fontSize: '11px' }}
            >
              <Award style={{ width: '13px', height: '13px', color: '#DC143C', flexShrink: 0 }} />
              <span className="text-truncate">{attorney.bar_admissions[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Contact Row */}
      <div
        className="px-4 py-3 d-flex align-items-center justify-content-between small border-top border-canvas"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <a
          href={`mailto:${attorney.email}`}
          className="text-decoration-none hover-crimson d-flex align-items-center gap-1"
          style={{ color: '#475569' }}
          title={`Email ${attorney.name}`}
        >
          <Mail style={{ width: '13px', height: '13px', color: '#DC143C' }} />
          <span>Email</span>
        </a>

        {typeof attorney.phone === 'string' && attorney.phone.trim().length > 0 && (
          <a
            href={`tel:${attorney.phone.replace(/[^0-9+]/g, '')}`}
            className="text-decoration-none hover-crimson d-flex align-items-center gap-1"
            style={{ color: '#475569' }}
            title={`Call ${attorney.name}`}
          >
            <Phone style={{ width: '13px', height: '13px', color: '#DC143C' }} />
            <span>Call</span>
          </a>
        )}

        <Link
          href={`/attorneys/${attorney.slug}`}
          className="fw-bold text-decoration-none hover-white"
          style={{ color: '#DC143C', fontSize: '12px' }}
        >
          Full Bio →
        </Link>
      </div>
    </div>
  );
}
