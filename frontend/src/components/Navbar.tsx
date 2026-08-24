'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scale, 
  Phone, 
  ChevronDown, 
  Menu, 
  X, 
  ShieldCheck, 
  Briefcase, 
  ShieldAlert, 
  Award, 
  Gavel, 
  Building2, 
  Users, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePracticesOpen, setMobilePracticesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const practiceAreaLinks = [
    { 
      title: 'Corporate Law & M&A', 
      href: '/practice-areas/corporate-law-mergers', 
      desc: 'Cross-border acquisitions, entity structuring & governance',
      icon: Briefcase 
    },
    { 
      title: 'Catastrophic Personal Injury', 
      href: '/practice-areas/personal-injury-catastrophic', 
      desc: 'Wrongful death, severe brain trauma & trucking litigation',
      icon: ShieldAlert 
    },
    { 
      title: 'Intellectual Property & Patents', 
      href: '/practice-areas/intellectual-property-patents', 
      desc: 'Patent defense, trademark enforcement & trade secrets',
      icon: Award 
    },
    { 
      title: 'White Collar & Investigations', 
      href: '/practice-areas/white-collar-criminal-defense', 
      desc: 'SEC, DOJ, FINRA and federal trial defense',
      icon: Gavel 
    },
    { 
      title: 'Commercial Real Estate', 
      href: '/practice-areas/commercial-real-estate-development', 
      desc: 'Land use, zoning & institutional acquisitions',
      icon: Building2 
    },
    { 
      title: 'Executive Employment & Labor', 
      href: '/practice-areas/employment-labor-arbitration', 
      desc: 'C-suite contracts, severance & non-competes',
      icon: Users 
    },
  ];

  return (
    <header className="sticky-top w-100 bg-nepal-dark text-white border-bottom border-sakura shadow-sm">
      {/* Top Banner - Hotline & Authority */}
      <div className="bg-nepal-surface border-bottom border-sakura py-1 small text-white">
        <div className="container-xl d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-1 text-white fw-medium">
              <ShieldCheck className="text-crimson" style={{ width: '16px', height: '16px' }} />
              <strong className="text-crimson">Nationwide Trial Counsel</strong> | Tier 1 Ranking
            </span>
            <span className="d-none d-sm-inline text-white-50">•</span>
            <span className="d-none d-sm-inline text-white fw-medium">Over $250M+ Recovered</span>
          </div>
          <div className="d-flex align-items-center gap-4">
            <a 
              href="tel:12128904400" 
              className="d-flex align-items-center gap-1 text-white text-decoration-none fw-bold hover-crimson"
            >
              <Phone className="text-crimson" style={{ width: '14px', height: '14px' }} />
              <span>24/7 Hotline: (212) 890-4400</span>
            </a>
            <Link 
              href="/admin" 
              className="d-none d-md-flex align-items-center gap-1 text-white-50 text-decoration-none"
              title="Admin Operations Portal"
            >
              <Lock className="text-crimson" style={{ width: '12px', height: '12px' }} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-nepal-dark py-3">
        <div className="container-xl d-flex align-items-center justify-content-between">
          
          {/* Law Firm Crest & Brand */}
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-blue border border-crimson shadow"
              style={{ width: '42px', height: '42px' }}
            >
              <Scale className="text-white" style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <span className="d-block font-serif fs-4 fw-bold text-white lh-1">
                APEX <span className="text-crimson fw-light">LEGAL</span>
              </span>
              <span className="d-block text-uppercase fw-semibold text-white-50" style={{ fontSize: '9px', letterSpacing: '0.25em' }}>
                Counselors at Law
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <Link 
              href="/" 
              className={`menu-nav-link fs-6 fw-bold px-2 py-1 ${pathname === '/' ? 'menu-nav-active' : ''}`}
            >
              Home
            </Link>

            {/* Practice Areas Dropdown */}
            <div 
              ref={dropdownRef}
              className="position-relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button"
                className={`menu-nav-link btn btn-link text-decoration-none fs-6 fw-bold d-flex align-items-center gap-1 p-0 ${
                  pathname.startsWith('/practice-areas') ? 'menu-nav-active' : ''
                }`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
              >
                <span>Practice Areas</span>
                <ChevronDown className="text-white" style={{ width: '16px', height: '16px' }} />
              </button>

              {dropdownOpen && (
                <div 
                  className="position-absolute start-0 pt-2 z-3"
                  style={{ width: '380px' }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-4 bg-nepal-surface border border-sakura shadow-lg p-3">
                    <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom border-sakura">
                      <span className="text-uppercase text-crimson fw-bold" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                        Legal Disciplines
                      </span>
                      <span className="text-white-50 fw-bold" style={{ fontSize: '10px' }}>Tier-1 Counsel</span>
                    </div>

                    <div className="d-flex flex-column gap-1">
                      {practiceAreaLinks.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`d-flex align-items-start gap-2 p-2 rounded-3 text-decoration-none transition ${
                              isCurrent
                                ? 'bg-nepal-blue text-white border border-crimson'
                                : 'text-white hover-bg-nepal'
                            }`}
                          >
                            <div 
                              className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-dark border border-sakura flex-shrink-0 mt-1"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <Icon className="text-white" style={{ width: '16px', height: '16px' }} />
                            </div>
                            <div className="text-truncate">
                              <span className="d-block small fw-bold text-white">{item.title}</span>
                              <span className="d-block text-white-50 text-truncate" style={{ fontSize: '11px' }}>{item.desc}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-2 border-top border-sakura">
                      <Link 
                        href="/practice-areas" 
                        onClick={() => setDropdownOpen(false)}
                        className="btn btn-sm btn-outline-light w-100 d-flex align-items-center justify-content-between py-2 text-white fw-bold"
                      >
                        <span>View All Practice Groups Directory</span>
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/attorneys" 
              className={`menu-nav-link fs-6 fw-bold px-2 py-1 ${pathname.startsWith('/attorneys') ? 'menu-nav-active' : ''}`}
            >
              Attorneys
            </Link>

            <Link 
              href="/case-results" 
              className={`menu-nav-link fs-6 fw-bold px-2 py-1 ${pathname === '/case-results' ? 'menu-nav-active' : ''}`}
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              className={`menu-nav-link fs-6 fw-bold px-2 py-1 ${pathname === '/contact' ? 'menu-nav-active' : ''}`}
            >
              Contact
            </Link>
          </div>

          {/* Right Controls: CTA Button & Theme Toggle */}
          <div className="d-none d-sm-flex align-items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact#consultation"
              className="btn btn-danger btn-crimson text-white fw-bold px-4 py-2 rounded-pill shadow-sm"
            >
              Free Case Evaluation
            </Link>
          </div>

          {/* Mobile Right Controls: Toggle */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-outline-light d-flex align-items-center justify-content-center p-2 rounded-3 border-sakura"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Collapse Menu */}
      {mobileMenuOpen && (
        <div className="d-lg-none bg-nepal-dark border-top border-sakura p-4">
          <nav className="d-flex flex-column gap-2 fw-bold">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-3 text-decoration-none ${pathname === '/' ? 'text-crimson bg-nepal-surface' : 'text-white'}`}
            >
              Home
            </Link>

            <div>
              <div className="d-flex align-items-center justify-content-between p-2 rounded-3">
                <Link 
                  href="/practice-areas" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-decoration-none ${pathname.startsWith('/practice-areas') ? 'text-crimson' : 'text-white'}`}
                >
                  Practice Areas Directory
                </Link>
                <button
                  type="button"
                  onClick={() => setMobilePracticesOpen(!mobilePracticesOpen)}
                  className="btn btn-link text-crimson p-0"
                >
                  <ChevronDown style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {mobilePracticesOpen && (
                <div className="ps-3 border-start border-sakura ms-2 d-flex flex-column gap-1 mt-1">
                  {practiceAreaLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`small text-decoration-none py-1 ${pathname === item.href ? 'text-crimson fw-bold' : 'text-white-50'}`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/attorneys" 
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-3 text-decoration-none ${pathname.startsWith('/attorneys') ? 'text-crimson bg-nepal-surface' : 'text-white'}`}
            >
              Attorneys
            </Link>

            <Link 
              href="/case-results" 
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-3 text-decoration-none ${pathname === '/case-results' ? 'text-crimson bg-nepal-surface' : 'text-white'}`}
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-3 text-decoration-none ${pathname === '/contact' ? 'text-crimson bg-nepal-surface' : 'text-white'}`}
            >
              Contact Us
            </Link>

            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-3 text-decoration-none text-white d-flex align-items-center gap-2"
            >
              <Lock className="text-crimson" style={{ width: '14px', height: '14px' }} />
              <span>Admin Operations Portal</span>
            </Link>
          </nav>

          <div className="pt-3 mt-3 border-top border-sakura">
            <Link
              href="/contact#consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-danger btn-crimson text-white fw-bold w-100 py-3 rounded-3 shadow"
            >
              Request Free Case Evaluation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
