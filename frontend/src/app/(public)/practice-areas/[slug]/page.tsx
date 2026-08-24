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
    <div className="min-vh-100 py-5 bg-nepal-dark text-white">
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb Navigation */}
      <div className="container-xl mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 small">
            <li className="breadcrumb-item">
              <Link href="/" className="text-white-50 text-decoration-none hover-crimson">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/practice-areas" className="text-white-50 text-decoration-none hover-crimson">
                Practice Areas
              </Link>
            </li>
            <li className="breadcrumb-item active text-white fw-bold" aria-current="page">
              {area.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Practice Hero Header */}
      <div className="container-xl mb-5">
        <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 p-4 p-md-5 text-white">
          <div style={{ maxWidth: '750px' }}>
            <div className="badge bg-nepal-dark border border-sakura text-white px-3 py-2 rounded-pill small fw-bold text-uppercase d-inline-flex align-items-center gap-1 mb-3">
              <Scale className="text-crimson" style={{ width: '14px', height: '14px' }} />
              <span>Apex Legal Practice Discipline</span>
            </div>

            <h1 className="font-serif display-4 fw-bold text-white mb-3 lh-tight">
              {area.title}
            </h1>

            <p className="text-white-50 fs-5 leading-relaxed mb-4">
              {area.short_summary}
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3">
              <a
                href="#consultation-form"
                className="btn btn-danger btn-crimson btn-lg px-4 py-3 rounded-pill fw-bold text-white shadow"
              >
                Schedule {area.title} Case Evaluation
              </a>
              <a
                href="tel:12128904400"
                className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill text-white fw-bold d-flex align-items-center gap-2 border-sakura"
              >
                <Phone className="text-crimson" style={{ width: '16px', height: '16px' }} />
                <span>Call Hotline: (212) 890-4400</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Practice Overview & Sub-specialties */}
      <div className="container-xl mb-5">
        <div className="row g-5">
          
          {/* Main Long Description */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-5">
            <div className="card bg-nepal-surface border border-sakura shadow rounded-4 p-4 p-md-5 text-white">
              <h2 className="font-serif fs-2 fw-bold text-white mb-3">
                Our Strategic Approach to {area.title}
              </h2>
              <div className="text-white-50 fs-6 leading-relaxed mb-4 d-flex flex-column gap-3">
                <p className="mb-0">{area.description}</p>
                <p className="mb-0">
                  Our litigation group deploys unmatched investigative resources, economic analysis, and forensic trial preparation to defend our clients&apos; interests. We advise corporate boards, venture funds, and individuals facing high-exposure liabilities.
                </p>
              </div>

              <div className="pt-4 border-top border-sakura row g-3 text-white-50 small">
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <CheckCircle2 className="text-crimson" style={{ width: '16px', height: '16px' }} />
                  <span>Senior Partner Lead on Every Case</span>
                </div>
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <CheckCircle2 className="text-crimson" style={{ width: '16px', height: '16px' }} />
                  <span>Direct Courtroom Trial Experience</span>
                </div>
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <CheckCircle2 className="text-crimson" style={{ width: '16px', height: '16px' }} />
                  <span>Multidisciplinary Technical Support</span>
                </div>
                <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                  <CheckCircle2 className="text-crimson" style={{ width: '16px', height: '16px' }} />
                  <span>Uncompromising Client Privacy</span>
                </div>
              </div>
            </div>

            {/* Sub-practice disciplines */}
            {area.children && area.children.length > 0 && (
              <div>
                <h3 className="font-serif fs-3 fw-bold text-white mb-3">
                  Focused Sub-Disciplines
                </h3>
                <div className="row g-3">
                  {area.children.map((child) => (
                    <div key={child.id} className="col-12 col-sm-6">
                      <Link
                        href={`/practice-areas/${child.slug}`}
                        className="card bg-nepal-dark border border-sakura p-4 rounded-3 text-decoration-none h-100 hover-border-crimson"
                      >
                        <h4 className="font-serif fw-bold text-white fs-5 mb-1">
                          {child.title}
                        </h4>
                        <p className="text-white-50 small mb-0 line-clamp-2">
                          {child.short_summary}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Landmark Verdicts */}
            {area.case_results && area.case_results.length > 0 && (
              <div>
                <h3 className="font-serif fs-3 fw-bold text-white mb-3">
                  Notable Case Recoveries in {area.title}
                </h3>
                <div className="row g-4">
                  {area.case_results.map((verdict) => (
                    <div key={verdict.id} className="col-12 col-sm-6">
                      <CaseResultCard result={verdict} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Dedicated Practice Attorneys & Quick Contact */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">
            {/* Dedicated Attorneys */}
            {area.attorneys && area.attorneys.length > 0 && (
              <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 text-white">
                <h4 className="font-serif fs-6 fw-bold text-uppercase text-crimson mb-3" style={{ letterSpacing: '0.1em' }}>
                  Practice Group Leaders
                </h4>
                <div className="d-flex flex-column gap-4">
                  {area.attorneys.map((attorney) => (
                    <AttorneyCard key={attorney.id} attorney={attorney} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Contact Box */}
            <div className="card bg-nepal-dark border border-sakura p-4 rounded-4 text-white">
              <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Direct Consultation</span>
              <h4 className="font-serif fs-5 fw-bold text-white mb-2">Need Urgent Counsel?</h4>
              <p className="text-white-50 small mb-3 lh-base">
                Contact our emergency intake department to review your matter under strict confidentiality.
              </p>
              <a
                href="tel:12128904400"
                className="btn btn-danger btn-crimson w-100 py-3 rounded-3 fw-bold small text-white d-flex align-items-center justify-content-center gap-2 shadow"
              >
                <Phone style={{ width: '14px', height: '14px' }} />
                <span>Call (212) 890-4400</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Consultation Form */}
      <div id="consultation-form" className="container-xl" style={{ maxWidth: '900px' }}>
        <ConsultationForm 
          defaultPracticeAreaId={area.id}
          title={`Evaluate Your ${area.title} Case`}
          subtitle={`Submit your inquiry directly to our ${area.title} department leaders.`}
        />
      </div>

    </div>
  );
}
