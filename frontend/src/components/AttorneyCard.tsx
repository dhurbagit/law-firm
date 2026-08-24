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
    <div className="card sakura-glass-card h-100 border-0 rounded-4 overflow-hidden d-flex flex-column justify-content-between">
      <div>
        {/* Photo Container */}
        <div className="position-relative w-100 bg-nepal-dark" style={{ height: '300px' }}>
          {attorney.photo_url ? (
            <Image
              src={attorney.photo_url}
              alt={attorney.name}
              fill
              className="object-fit-cover object-fit-top transition"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-nepal-surface text-white">
              <Scale style={{ width: '64px', height: '64px', opacity: 0.4 }} />
            </div>
          )}

          {/* Practice Area Badge */}
          {attorney.practice_areas && attorney.practice_areas.length > 0 && (
            <div className="position-absolute top-0 start-0 m-3">
              <span className="badge bg-nepal-blue text-white px-2 py-1 rounded-pill small fw-bold border border-crimson shadow">
                {attorney.practice_areas[0].title}
              </span>
            </div>
          )}

          {/* Corner View Profile CTA */}
          <Link 
            href={`/attorneys/${attorney.slug}`}
            className="position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center rounded-circle bg-nepal-blue border border-white text-white text-decoration-none shadow hover-crimson-bg"
            style={{ width: '32px', height: '32px' }}
            aria-label={`View profile for ${attorney.name}`}
          >
            <ArrowUpRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-uppercase text-crimson fw-bold d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
            {attorney.designation}
          </span>
          <h4 className="font-serif fs-5 fw-bold text-white mb-2">
            <Link href={`/attorneys/${attorney.slug}`} className="text-white text-decoration-none hover-crimson">
              {attorney.name}
            </Link>
          </h4>

          <p className="text-white-50 small lh-base mb-3 line-clamp-3">
            {attorney.bio}
          </p>

          {/* Bar Admissions Tag */}
          {attorney.bar_admissions && attorney.bar_admissions.length > 0 && (
            <div className="pt-2 border-top border-sakura d-flex align-items-center gap-1 small text-white-50">
              <Award className="text-crimson flex-shrink-0" style={{ width: '14px', height: '14px' }} />
              <span className="text-truncate" style={{ fontSize: '11px' }}>{attorney.bar_admissions[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Contact & Link */}
      <div className="p-3 bg-nepal-surface border-top border-sakura d-flex align-items-center justify-content-between small">
        <a 
          href={`mailto:${attorney.email}`}
          className="text-white-50 text-decoration-none hover-crimson d-flex align-items-center gap-1"
          title={`Email ${attorney.name}`}
        >
          <Mail className="text-crimson" style={{ width: '14px', height: '14px' }} />
          <span>Email</span>
        </a>

        {typeof attorney.phone === 'string' && attorney.phone.trim().length > 0 && (
          <a 
            href={`tel:${attorney.phone.replace(/[^0-9+]/g, '')}`}
            className="text-white-50 text-decoration-none hover-crimson d-flex align-items-center gap-1"
            title={`Call ${attorney.name}`}
          >
            <Phone className="text-crimson" style={{ width: '14px', height: '14px' }} />
            <span>Call</span>
          </a>
        )}

        <Link 
          href={`/attorneys/${attorney.slug}`}
          className="text-crimson text-decoration-none fw-bold"
        >
          Full Bio →
        </Link>
      </div>
    </div>
  );
}
