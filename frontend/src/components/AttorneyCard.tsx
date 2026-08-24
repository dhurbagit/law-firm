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
    <div className="navy-card-glow rounded-2xl overflow-hidden group flex flex-col justify-between border border-[#C5A880]/20">
      <div>
        {/* Photo Container */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#0A192F]">
          {attorney.photo_url ? (
            <Image
              src={attorney.photo_url}
              alt={attorney.name}
              fill
              className="object-cover object-top filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#172A45] text-[#C5A880]">
              <Scale className="w-16 h-16 opacity-40" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent"></div>

          {/* Practice Area Badges */}
          {attorney.practice_areas && attorney.practice_areas.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#060D17]/80 backdrop-blur-md text-[#DFC7A5] border border-[#C5A880]/30 shadow">
                {attorney.practice_areas[0].title}
              </span>
            </div>
          )}

          {/* Corner View Profile CTA */}
          <Link 
            href={`/attorneys/${attorney.slug}`}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0A192F]/80 backdrop-blur-md border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-[#0A192F] transition-all duration-300"
            aria-label={`View profile for ${attorney.name}`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="text-[11px] font-semibold tracking-widest text-[#C5A880] uppercase block mb-1">
            {attorney.designation}
          </span>
          <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#DFC7A5] transition-colors">
            <Link href={`/attorneys/${attorney.slug}`}>
              {attorney.name}
            </Link>
          </h3>

          <p className="text-slate-400 text-xs line-clamp-3 mt-2.5 leading-relaxed">
            {attorney.bio}
          </p>

          {/* Bar Admissions Tag */}
          {attorney.bar_admissions && attorney.bar_admissions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Award className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
              <span className="truncate">{attorney.bar_admissions[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Contact & Link */}
      <div className="px-6 py-4 bg-[#060D17]/60 border-t border-white/5 flex items-center justify-between text-xs">
        <a 
          href={`mailto:${attorney.email}`}
          className="text-slate-400 hover:text-[#C5A880] transition flex items-center gap-1.5"
          title={`Email ${attorney.name}`}
        >
          <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Email</span>
        </a>

        {typeof attorney.phone === 'string' && attorney.phone.trim().length > 0 && (
          <a 
            href={`tel:${attorney.phone.replace(/[^0-9+]/g, '')}`}
            className="text-slate-400 hover:text-[#C5A880] transition flex items-center gap-1.5"
            title={`Call ${attorney.name}`}
          >
            <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Direct Call</span>
          </a>
        )}

        <Link 
          href={`/attorneys/${attorney.slug}`}
          className="text-[#C5A880] hover:text-[#DFC7A5] font-semibold"
        >
          Full Bio →
        </Link>
      </div>
    </div>
  );
}
