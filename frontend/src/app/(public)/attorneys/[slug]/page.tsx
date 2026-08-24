import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAttorneys, getAttorneyBySlug } from '@/lib/api';
import { CaseResultCard } from '@/components/CaseResultCard';
import { ConsultationForm } from '@/components/ConsultationForm';
import { JsonLd, getAttorneyPersonSchema } from '@/components/JsonLd';
import { 
  ChevronRight, 
  Mail, 
  Phone, 
  Award, 
  GraduationCap, 
  Scale 
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const attorneys = await getAttorneys();
  return attorneys.map((attorney) => ({
    slug: attorney.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const attorney = await getAttorneyBySlug(slug);

  if (!attorney) {
    return {
      title: 'Attorney Profile Not Found',
    };
  }

  return {
    title: `${attorney.name} | ${attorney.designation}`,
    description: attorney.bio,
    alternates: {
      canonical: `https://apexlegal.com/attorneys/${attorney.slug}`,
    },
    openGraph: {
      title: `${attorney.name} - ${attorney.designation}`,
      description: attorney.bio,
      images: attorney.photo_url ? [{ url: attorney.photo_url }] : [],
      url: `https://apexlegal.com/attorneys/${attorney.slug}`,
    },
  };
}

export default async function AttorneyBioPage({ params }: Props) {
  const { slug } = await params;
  const attorney = await getAttorneyBySlug(slug);

  if (!attorney) {
    notFound();
  }

  const personJsonLd = getAttorneyPersonSchema(attorney);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://apexlegal.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Attorneys",
        "item": "https://apexlegal.com/attorneys"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": attorney.name,
        "item": `https://apexlegal.com/attorneys/${attorney.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen py-12 font-sans bg-[#000000] text-white">
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 font-sans">
        <nav className="flex items-center gap-2 text-xs text-slate-300">
          <Link href="/" className="hover:text-[#DC143C] transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#003893]" />
          <Link href="/attorneys" className="hover:text-[#DC143C] transition">
            Attorneys
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#003893]" />
          <span className="text-white font-bold">{attorney.name}</span>
        </nav>
      </div>

      {/* Attorney Hero / Bio Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="rounded-3xl bg-[#00122E] border border-[#003893] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Photo */}
            <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[480px] bg-[#000000]">
              {attorney.photo_url ? (
                <Image
                  src={attorney.photo_url}
                  alt={attorney.name}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#001C4A] text-white">
                  <Scale className="w-20 h-20 opacity-30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent lg:hidden"></div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-2 font-sans">
                  {attorney.designation}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  {attorney.name}
                </h1>

                {/* Practice Badges */}
                {attorney.practice_areas && attorney.practice_areas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 font-sans">
                    {attorney.practice_areas.map((p) => (
                      <Link
                        key={p.id}
                        href={`/practice-areas/${p.slug}`}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-[#001C4A] text-white border border-[#003893] hover:border-[#DC143C] hover:bg-[#003893] transition"
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Bio text */}
                <div className="mt-6 text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 font-normal font-sans">
                  <p>{attorney.bio}</p>
                </div>
              </div>

              {/* Direct Contacts & Actions */}
              <div className="pt-6 border-t border-[#003893]/40 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <Mail className="w-4 h-4 text-[#DC143C]" />
                    <a href={`mailto:${attorney.email}`} className="hover:text-[#DC143C] font-bold">
                      {attorney.email}
                    </a>
                  </div>
                  {attorney.phone && (
                    <div className="flex items-center gap-2 text-white">
                      <Phone className="w-4 h-4 text-[#DC143C]" />
                      <a href={`tel:${attorney.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#DC143C] font-bold">
                        {attorney.phone}
                      </a>
                    </div>
                  )}
                </div>

                <a
                  href="#direct-booking"
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#DC143C] hover:bg-[#B00E2F] border border-white/20 shadow-lg shadow-[#DC143C]/20 transition"
                >
                  Book Retainer Consultation
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bar Admissions */}
          <div className="p-8 rounded-2xl bg-[#00122E] border border-[#003893]/40 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <Award className="w-5 h-5 text-[#DC143C]" />
              <h3 className="font-serif text-xl font-bold text-white">Bar Admissions & Court Licenses</h3>
            </div>
            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-200 font-sans">
              {attorney.bar_admissions && attorney.bar_admissions.length > 0 ? (
                attorney.bar_admissions.map((bar, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></span>
                    <span>{bar}</span>
                  </li>
                ))
              ) : (
                <li>New York State Bar & Federal Southern District</li>
              )}
            </ul>
          </div>

          {/* Education */}
          <div className="p-8 rounded-2xl bg-[#00122E] border border-[#003893]/40 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <GraduationCap className="w-5 h-5 text-[#DC143C]" />
              <h3 className="font-serif text-xl font-bold text-white">Education & Honors</h3>
            </div>
            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-200 font-sans">
              {attorney.education && attorney.education.length > 0 ? (
                attorney.education.map((edu, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></span>
                    <span>{edu}</span>
                  </li>
                ))
              ) : (
                <li>Juris Doctor, Columbia Law School</li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Case Wins Led by this Attorney */}
      {attorney.case_results && attorney.case_results.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 font-sans">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DC143C] block mb-1 font-sans">
              Trial Record
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Landmark Cases Led by {attorney.name}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attorney.case_results.map((res) => (
              <CaseResultCard key={res.id} result={res} />
            ))}
          </div>
        </div>
      )}

      {/* Direct Booking Consultation Form */}
      <div id="direct-booking" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm 
          title={`Consult with ${attorney.name}`}
          subtitle={`Submit your confidential case details directly to ${attorney.name}'s lead trial associate.`}
          sourceContext={`attorney-profile-${attorney.slug}`}
        />
      </div>

    </div>
  );
}
