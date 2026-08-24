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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePracticesOpen, setMobilePracticesOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Handle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className="sticky top-0 z-50 w-full transition-all duration-300 font-sans bg-[#001F54] text-white border-b border-sakura-border">
      {/* Top Banner - Hotline & Authority */}
      <div className="bg-[#00153B] border-b border-sakura-border/60 px-4 py-2 text-xs text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <ShieldCheck className="w-4 h-4 text-crimson" />
              <span className="font-bold text-crimson">Nationwide Trial Counsel</span> | Tier 1 Ranking
            </span>
            <span className="hidden sm:inline-block text-white/40">•</span>
            <span className="hidden sm:inline-block text-white font-medium">Over $250M+ Recovered For Our Clients</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="tel:12128904400" 
              className="flex items-center gap-1.5 text-white hover:text-crimson transition font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-crimson" />
              <span>24/7 Urgent Hotline: (212) 890-4400</span>
            </a>
            <Link 
              href="/admin" 
              className="hidden md:flex items-center gap-1 text-white/80 hover:text-white transition font-medium"
              title="Admin Operations Portal"
            >
              <Lock className="w-3 h-3 text-crimson" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-[#001F54]/95 backdrop-blur-md shadow-2xl py-3' : 'bg-[#001F54] py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Law Firm Crest & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-nepal-blue border border-crimson flex items-center justify-center shadow-lg group-hover:bg-crimson group-hover:border-nepal-blue transition duration-300">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wide text-white group-hover:text-crimson transition">
                APEX <span className="text-crimson font-light">LEGAL</span>
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-white font-semibold opacity-90">
                Counselors at Law
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Font color: White | Active color: Nepal Flag Red #DC143C) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold">
            <Link 
              href="/" 
              className={`menu-nav-link ${pathname === '/' ? 'menu-nav-active' : ''}`}
            >
              Home
            </Link>

            {/* Practice Areas Robust Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button"
                className={`menu-nav-link flex items-center gap-1.5 py-1 cursor-pointer ${
                  pathname.startsWith('/practice-areas') ? 'menu-nav-active' : ''
                }`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Practice Areas</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-crimson' : 'text-white'}`} />
              </button>

              {/* Dropdown Container */}
              {dropdownOpen && (
                <div 
                  className="absolute top-full left-0 pt-2 w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl bg-[#0A2540] border border-sakura-border shadow-2xl p-3 backdrop-blur-xl ring-1 ring-black/80">
                    <div className="px-3 py-2 border-b border-sakura-border/40 flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold tracking-widest text-crimson uppercase">
                        Legal Practice Disciplines
                      </span>
                      <span className="text-[10px] text-white/80 font-bold">Tier-1 Counsel</span>
                    </div>

                    <div className="space-y-1">
                      {practiceAreaLinks.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition group ${
                              isCurrent
                                ? 'bg-nepal-blue text-white border border-crimson'
                                : 'text-white hover:text-crimson hover:bg-[#001F54]'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#001F54] border border-sakura-border/60 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-crimson group-hover:bg-crimson">
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-white group-hover:text-crimson transition">
                                {item.title}
                              </span>
                              <span className="block text-[11px] text-slate-200 group-hover:text-slate-100 line-clamp-1">
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-sakura-border/40">
                      <Link 
                        href="/practice-areas" 
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#001F54] hover:bg-nepal-blue text-xs text-white font-bold transition border border-sakura-border/50 hover:border-crimson"
                      >
                        <span>View All Practice Groups Directory</span>
                        <ArrowRight className="w-3.5 h-3.5 text-crimson" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/attorneys" 
              className={`menu-nav-link ${pathname.startsWith('/attorneys') ? 'menu-nav-active' : ''}`}
            >
              Attorneys
            </Link>

            <Link 
              href="/case-results" 
              className={`menu-nav-link ${pathname === '/case-results' ? 'menu-nav-active' : ''}`}
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              className={`menu-nav-link ${pathname === '/contact' ? 'menu-nav-active' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Consultation CTA Button & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact#consultation"
              className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-crimson hover:bg-crimson-hover border border-white/20 shadow-lg shadow-crimson/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Free Case Evaluation
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0A2540] border border-sakura-border text-white hover:bg-nepal-blue cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#001F54] border-b border-sakura-border px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl max-h-[85vh] overflow-y-auto text-white">
          <nav className="flex flex-col space-y-2 text-base font-bold text-white">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg transition ${
                pathname === '/' ? 'text-crimson bg-[#0A2540]' : 'text-white hover:text-crimson hover:bg-[#0A2540]'
              }`}
            >
              Home
            </Link>
            
            {/* Mobile Practice Areas Accordion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-white hover:bg-[#0A2540]">
                <Link 
                  href="/practice-areas" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 font-bold ${pathname.startsWith('/practice-areas') ? 'text-crimson' : 'text-white hover:text-crimson'}`}
                >
                  Practice Areas Directory
                </Link>
                <button
                  type="button"
                  onClick={() => setMobilePracticesOpen(!mobilePracticesOpen)}
                  className="p-1 text-crimson hover:text-white cursor-pointer"
                  aria-label="Toggle practice areas list"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobilePracticesOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobilePracticesOpen && (
                <div className="pl-4 space-y-1 pt-1 border-l-2 border-sakura-border/50 ml-3">
                  {practiceAreaLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-1.5 text-xs font-semibold ${
                        pathname === item.href ? 'text-crimson' : 'text-white hover:text-crimson'
                      }`}
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
              className={`px-3 py-2 rounded-lg transition ${
                pathname.startsWith('/attorneys') ? 'text-crimson bg-[#0A2540]' : 'text-white hover:text-crimson hover:bg-[#0A2540]'
              }`}
            >
              Attorneys
            </Link>

            <Link 
              href="/case-results" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg transition ${
                pathname === '/case-results' ? 'text-crimson bg-[#0A2540]' : 'text-white hover:text-crimson hover:bg-[#0A2540]'
              }`}
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg transition ${
                pathname === '/contact' ? 'text-crimson bg-[#0A2540]' : 'text-white hover:text-crimson hover:bg-[#0A2540]'
              }`}
            >
              Contact Us
            </Link>

            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-white hover:bg-[#0A2540] hover:text-crimson flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-crimson" />
              <span>Admin Operations Portal</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-sakura-border/40">
            <Link
              href="/contact#consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-bold text-white bg-crimson hover:bg-crimson-hover shadow-lg shadow-crimson/30"
            >
              Request Free Case Evaluation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
