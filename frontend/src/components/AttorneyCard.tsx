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
    <div className="navy-card-glow rounded-2xl overflow-hidden group flex flex-col justify-between border border-[#003893]/50 font-sans">
      <div>
        {/* Photo Container */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#000000]">
          {attorney.photo_url ? (
            <Image
              src={attorney.photo_url}
              alt={attorney.name}
              fill
              className="object-cover object-top filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#001C4A] text-white">
              <Scale className="w-16 h-16 opacity-40" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent"></div>

          {/* Practice Area Badges */}
          {attorney.practice_areas && attorney.practice_areas.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#003893]/90 backdrop-blur-md text-white border border-[#DC143C]/60 shadow">
                {attorney.practice_areas[0].title}
              </span>
            </div>
          )}

          {/* Corner View Profile CTA */}
          <Link 
            href={`/attorneys/${attorney.slug}`}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#003893]/90 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:bg-[#DC143C] group-hover:border-[#003893] transition-all duration-300"
            aria-label={`View profile for ${attorney.name}`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="text-[11px] font-bold tracking-widest text-[#DC143C] uppercase block mb-1">
            {attorney.designation}
          </span>
          <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#DC143C] transition-colors">
            <Link href={`/attorneys/${attorney.slug}`}>
              {attorney.name}
            </Link>
          </h3>

          <p className="text-slate-300 text-xs line-clamp-3 mt-2.5 leading-relaxed font-sans">
            {attorney.bio}
          </p>

          {/* Bar Admissions Tag */}
          {attorney.bar_admissions && attorney.bar_admissions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#003893]/30 flex items-center gap-1.5 text-[11px] text-slate-300 font-sans">
              <Award className="w-3.5 h-3.5 text-[#DC143C] flex-shrink-0" />
              <span className="truncate">{attorney.bar_admissions[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Contact & Link */}
      <div className="px-6 py-4 bg-[#000000]/80 border-t border-[#003893]/40 flex items-center justify-between text-xs font-sans">
        <a 
          href={`mailto:${attorney.email}`}
          className="text-slate-300 hover:text-[#DC143C] transition flex items-center gap-1.5"
          title={`Email ${attorney.name}`}
        >
          <Mail className="w-3.5 h-3.5 text-[#DC143C]" />
          <span>Email</span>
        </a>

        {typeof attorney.phone === 'string' && attorney.phone.trim().length > 0 && (
          <a 
            href={`tel:${attorney.phone.replace(/[^0-9+]/g, '')}`}
            className="text-slate-300 hover:text-[#DC143C] transition flex items-center gap-1.5"
            title={`Call ${attorney.name}`}
          >
            <Phone className="w-3.5 h-3.5 text-[#DC143C]" />
            <span>Direct Call</span>
          </a>
        )}

        <Link 
          href={`/attorneys/${attorney.slug}`}
          className="text-[#DC143C] hover:text-white font-bold"
        >
          Full Bio →
        </Link>
      </div>
    </div>
  );
}
