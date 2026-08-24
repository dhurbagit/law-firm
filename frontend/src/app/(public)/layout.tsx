import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd, getLegalServiceSchema } from "@/components/JsonLd";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const legalServiceJsonLd = getLegalServiceSchema();

  return (
    <div className="d-flex flex-column min-vh-100 bg-nepal-dark text-white">
      <JsonLd data={legalServiceJsonLd} />
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
