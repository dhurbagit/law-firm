import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPracticeAreas, getPracticeAreaBySlug } from '@/lib/api';
import { AttorneyCard } from '@/components/AttorneyCard';
import { CaseResultCard } from '@/components/CaseResultCard';
import { ConsultationForm } from '@/components/ConsultationForm';
import { JsonLd } from '@/components/JsonLd';
import { 
  ChevronRight, 
  Scale, 
  Phone, 
  CheckCircle2 
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const practiceAreas = await getPracticeAreas();
  return practiceAreas.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);

  if (!area) {
    return {
      title: 'Practice Area Not Found',
    };
  }

  return {
    title: `${area.title} Attorneys & Trial Counsel`,
    description: area.short_summary,
    alternates: {
      canonical: `https://apexlegal.com/practice-areas/${area.slug}`,
    },
    openGraph: {
      title: `${area.title} | Apex Legal Counsel`,
      description: area.short_summary,
      url: `https://apexlegal.com/practice-areas/${area.slug}`,
      type: 'article',
    },
  };
}

export default async function PracticeAreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);

  if (!area) {
    notFound();
  }

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
        "name": "Practice Areas",
        "item": "https://apexlegal.com/practice-areas"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": area.title,
        "item": `https://apexlegal.com/practice-areas/${area.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen py-12 font-sans bg-[#000000] text-white">
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 font-sans">
        <nav className="flex items-center gap-2 text-xs text-slate-300">
          <Link href="/" className="hover:text-[#DC143C] transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#003893]" />
          <Link href="/practice-areas" className="hover:text-[#DC143C] transition">
            Practice Areas
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#003893]" />
          <span className="text-white font-bold">{area.title}</span>
        </nav>
      </div>

      {/* Main Practice Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#00122E] border border-[#003893] shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001C4A] border border-[#003893] text-white text-xs font-bold uppercase tracking-wider font-sans">
              <Scale className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>Apex Legal Practice Discipline</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {area.title}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
              {area.short_summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 font-sans">
              <a
                href="#consultation-form"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] border border-white/20 shadow-lg shadow-[#DC143C]/20 transition"
              >
                Schedule {area.title} Case Evaluation
              </a>
              <a
                href="tel:12128904400"
                className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#DC143C] transition px-4 py-3"
              >
                <Phone className="w-4 h-4 text-[#DC143C]" />
                <span>Call Urgent Hotline: (212) 890-4400</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Practice Overview & Sub-specialties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Long Description */}
          <div className="lg:col-span-8 space-y-8">
            <div className="p-8 rounded-2xl bg-[#00122E] border border-[#003893]/40 space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Our Strategic Approach to {area.title}
              </h2>
              <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 font-normal font-sans">
                <p>{area.description}</p>
                <p>
                  Our litigation group deploys unmatched investigative resources, economic analysis, and forensic trial preparation to defend our clients&apos; interests. We advise corporate boards, venture funds, and individuals facing high-exposure liabilities.
                </p>
              </div>

              <div className="pt-4 border-t border-[#003893]/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-200 font-sans">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                  <span>Senior Partner Lead on Every Case</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                  <span>Direct Courtroom Trial Experience</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                  <span>Multidisciplinary Technical Support</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC143C]" />
                  <span>Uncompromising Client Privacy</span>
                </div>
              </div>
            </div>

            {/* Sub-practice disciplines */}
            {area.children && area.children.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-white">
                  Focused Sub-Disciplines
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                  {area.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/practice-areas/${child.slug}`}
                      className="p-5 rounded-xl bg-[#001C4A] border border-[#003893]/40 hover:border-[#DC143C] transition group"
                    >
                      <h4 className="font-serif font-bold text-white group-hover:text-[#DC143C] text-base mb-1">
                        {child.title}
                      </h4>
                      <p className="text-slate-300 text-xs line-clamp-2">
                        {child.short_summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Landmark Verdicts */}
            {area.case_results && area.case_results.length > 0 && (
              <div className="space-y-6 pt-6">
                <h3 className="font-serif text-2xl font-bold text-white">
                  Notable Case Recoveries in {area.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {area.case_results.map((verdict) => (
                    <CaseResultCard key={verdict.id} result={verdict} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Dedicated Practice Attorneys & Quick Contact */}
          <div className="lg:col-span-4 space-y-8 font-sans">
            {/* Dedicated Attorneys */}
            {area.attorneys && area.attorneys.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#00122E] border border-[#003893]/40 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider text-[#DC143C]">
                  Practice Group Leaders
                </h3>
                <div className="space-y-6">
                  {area.attorneys.map((attorney) => (
                    <AttorneyCard key={attorney.id} attorney={attorney} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Contact Box */}
            <div className="p-6 rounded-2xl bg-[#001C4A] border border-[#003893] space-y-3">
              <span className="text-xs uppercase font-bold text-[#DC143C] block font-sans">Direct Consultation</span>
              <h4 className="font-serif text-lg font-bold text-white">Need Urgent Counsel?</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Contact our emergency intake department to review your matter under strict confidentiality.
              </p>
              <a
                href="tel:12128904400"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] transition mt-2 font-sans"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call (212) 890-4400</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Consultation Form */}
      <div id="consultation-form" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationForm 
          defaultPracticeAreaId={area.id}
          title={`Evaluate Your ${area.title} Case`}
          subtitle={`Submit your inquiry directly to our ${area.title} department leaders.`}
        />
      </div>

    </div>
  );
}
