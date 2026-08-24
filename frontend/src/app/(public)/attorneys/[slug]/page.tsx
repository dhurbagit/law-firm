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
      type: 'article',
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
    <div className="min-vh-100 py-5 bg-nepal-dark text-white">
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumbs */}
      <div className="container-xl mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 small">
            <li className="breadcrumb-item">
              <Link href="/" className="text-white-50 text-decoration-none hover-crimson">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/attorneys" className="text-white-50 text-decoration-none hover-crimson">
                Attorneys
              </Link>
            </li>
            <li className="breadcrumb-item active text-white fw-bold" aria-current="page">
              {attorney.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Attorney Hero / Bio Card */}
      <div className="container-xl mb-5">
        <div className="card bg-nepal-surface border border-sakura shadow-lg rounded-4 overflow-hidden text-white">
          <div className="row g-0 align-items-stretch">
            
            {/* Left Photo */}
            <div className="col-12 col-lg-5 position-relative bg-nepal-dark" style={{ minHeight: '400px' }}>
              {attorney.photo_url ? (
                <Image
                  src={attorney.photo_url}
                  alt={attorney.name}
                  fill
                  priority
                  className="object-fit-cover object-fit-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-nepal-dark text-white">
                  <Scale style={{ width: '80px', height: '80px', opacity: 0.3 }} />
                </div>
              )}
            </div>

            {/* Right Details */}
            <div className="col-12 col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-between">
              <div>
                <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
                  {attorney.designation}
                </span>
                <h1 className="font-serif display-5 fw-bold text-white mb-3">
                  {attorney.name}
                </h1>

                {/* Practice Badges */}
                {attorney.practice_areas && attorney.practice_areas.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {attorney.practice_areas.map((p) => (
                      <Link
                        key={p.id}
                        href={`/practice-areas/${p.slug}`}
                        className="badge bg-nepal-dark border border-sakura text-white text-decoration-none px-3 py-2 rounded-pill small fw-bold hover-border-crimson"
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Bio text */}
                <div className="text-white-50 fs-6 leading-relaxed mb-4">
                  <p className="mb-0">{attorney.bio}</p>
                </div>
              </div>

              {/* Direct Contacts & Actions */}
              <div className="pt-4 border-top border-sakura d-flex flex-wrap align-items-center justify-content-between gap-3 small">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2 text-white">
                    <Mail className="text-crimson" style={{ width: '16px', height: '16px' }} />
                    <a href={`mailto:${attorney.email}`} className="text-white fw-bold text-decoration-none hover-crimson">
                      {attorney.email}
                    </a>
                  </div>
                  {attorney.phone && (
                    <div className="d-flex align-items-center gap-2 text-white">
                      <Phone className="text-crimson" style={{ width: '16px', height: '16px' }} />
                      <a href={`tel:${attorney.phone.replace(/[^0-9+]/g, '')}`} className="text-white fw-bold text-decoration-none hover-crimson">
                        {attorney.phone}
                      </a>
                    </div>
                  )}
                </div>

                <a
                  href="#direct-booking"
                  className="btn btn-danger btn-crimson px-4 py-2 rounded-pill fw-bold text-white shadow"
                >
                  Book Retainer Consultation
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="container-xl mb-5">
        <div className="row g-4">
          
          {/* Bar Admissions */}
          <div className="col-12 col-md-6">
            <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 text-white h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Award className="text-crimson" style={{ width: '20px', height: '20px' }} />
                <h3 className="font-serif fs-5 fw-bold text-white mb-0">Bar Admissions & Court Licenses</h3>
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-white-50 mb-0">
                {attorney.bar_admissions && attorney.bar_admissions.length > 0 ? (
                  attorney.bar_admissions.map((bar, i) => (
                    <li key={i} className="d-flex align-items-center gap-2">
                      <span className="rounded-circle bg-crimson" style={{ width: '6px', height: '6px' }}></span>
                      <span>{bar}</span>
                    </li>
                  ))
                ) : (
                  <li>New York State Bar & Federal Southern District</li>
                )}
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="col-12 col-md-6">
            <div className="card bg-nepal-surface border border-sakura p-4 rounded-4 text-white h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <GraduationCap className="text-crimson" style={{ width: '20px', height: '20px' }} />
                <h3 className="font-serif fs-5 fw-bold text-white mb-0">Education & Honors</h3>
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-white-50 mb-0">
                {attorney.education && attorney.education.length > 0 ? (
                  attorney.education.map((edu, i) => (
                    <li key={i} className="d-flex align-items-center gap-2">
                      <span className="rounded-circle bg-crimson" style={{ width: '6px', height: '6px' }}></span>
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
      </div>

      {/* Case Wins Led by this Attorney */}
      {attorney.case_results && attorney.case_results.length > 0 && (
        <div className="container-xl mb-5">
          <div className="mb-4">
            <span className="text-uppercase text-crimson fw-bold small d-block mb-1" style={{ letterSpacing: '0.1em' }}>
              Trial Record
            </span>
            <h3 className="font-serif fs-2 fw-bold text-white mb-0">
              Landmark Cases Led by {attorney.name}
            </h3>
          </div>
          <div className="row g-4">
            {attorney.case_results.map((res) => (
              <div key={res.id} className="col-12 col-md-6 col-lg-4">
                <CaseResultCard result={res} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Booking Consultation Form */}
      <div id="direct-booking" className="container-xl" style={{ maxWidth: '900px' }}>
        <ConsultationForm 
          title={`Consult with ${attorney.name}`}
          subtitle={`Submit your confidential case details directly to ${attorney.name}'s lead trial associate.`}
          sourceContext={`attorney-profile-${attorney.slug}`}
        />
      </div>

    </div>
  );
}
