import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getLegalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Apex Legal Counsel LLP",
    "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
    "description": "Premier national law firm delivering trial-tested advocacy and sophisticated counsel in Corporate M&A, Catastrophic Personal Injury, Intellectual Property, and White-Collar Defense.",
    "telephone": "+1-212-890-4400",
    "email": "inquiries@apexlegal.com",
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "375 Park Avenue, 28th Floor",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10152",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.7589",
      "longitude": "-73.9723"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:30",
        "closes": "18:30"
      }
    ],
    "areaServed": [
      "New York",
      "California",
      "District of Columbia",
      "Nationwide"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "148"
    }
  };
}

export function getAttorneyPersonSchema(attorney: {
  name: string;
  designation: string;
  email: string;
  phone?: string;
  bio: string;
  photo_url?: string;
  bar_admissions: string[];
  education: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": attorney.name,
    "jobTitle": attorney.designation,
    "worksFor": {
      "@type": "LegalService",
      "name": "Apex Legal Counsel LLP"
    },
    "email": attorney.email,
    "telephone": attorney.phone,
    "image": attorney.photo_url,
    "description": attorney.bio,
    "alumniOf": attorney.education.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu
    })),
    "memberOf": attorney.bar_admissions.map(bar => ({
      "@type": "Organization",
      "name": bar
    }))
  };
}
