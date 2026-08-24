import type { Metadata } from "next";
import { Playfair_Display, Roboto } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Apex Legal Counsel LLP | Premier Trial & Corporate Attorneys",
    template: "%s | Apex Legal Counsel",
  },
  description:
    "Apex Legal Counsel delivers trial-ready litigation and counsel in Corporate M&A, Catastrophic Personal Injury, Intellectual Property, and White-Collar Defense. Over $250M+ recovered.",
  keywords: [
    "Law Firm",
    "Trial Lawyers",
    "Corporate Attorneys",
    "M&A Counsel",
    "Catastrophic Injury Lawyer",
    "Patent Litigation",
    "White Collar Criminal Defense",
    "Legal Consultation",
  ],
  authors: [{ name: "Apex Legal Counsel LLP" }],
  creator: "Apex Legal Counsel LLP",
  publisher: "Apex Legal Counsel LLP",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apexlegal.com",
    title: "Apex Legal Counsel LLP | National Trial & Corporate Attorneys",
    description: "Formidable courtroom advocacy and sophisticated business counsel. Over $250M+ recovered for our clients.",
    siteName: "Apex Legal Counsel",
    images: [
      {
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Apex Legal Counsel Headquarters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Legal Counsel LLP | Premier Trial & Corporate Attorneys",
    description: "Trial-tested litigators and corporate advisors.",
    images: ["https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${playfair.variable} ${roboto.variable} scroll-smooth dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('apex_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body 
        className="min-h-screen flex flex-col bg-[#000000] text-white antialiased selection:bg-[#DC143C] selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
