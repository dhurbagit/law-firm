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
    <>
      <JsonLd data={legalServiceJsonLd} />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
