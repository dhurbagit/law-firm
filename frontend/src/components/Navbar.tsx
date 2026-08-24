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
    <header className="sticky top-0 z-50 w-full transition-all duration-300 font-sans">
      {/* Top Banner - Hotline & Authority */}
      <div className="bg-[#000000] border-b border-[#003893]/40 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DC143C]" />
              <span className="font-bold text-[#DC143C]">Nationwide Trial Counsel</span> | Tier 1 Ranking
            </span>
            <span className="hidden sm:inline-block text-[#003893]">•</span>
            <span className="hidden sm:inline-block text-slate-300">Over $250M+ Recovered For Our Clients</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="tel:12128904400" 
              className="flex items-center gap-1.5 text-white hover:text-[#DC143C] transition font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>24/7 Urgent Hotline: (212) 890-4400</span>
            </a>
            <Link 
              href="/admin" 
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-white transition"
              title="Admin Operations Portal"
            >
              <Lock className="w-3 h-3 text-[#003893]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-[#000000]/95 backdrop-blur-md shadow-2xl border-b border-[#003893]/50 py-3' : 'bg-[#000000]/90 backdrop-blur-sm border-b border-[#003893]/30 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Law Firm Crest & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#003893] border border-[#DC143C] flex items-center justify-center shadow-lg group-hover:bg-[#DC143C] group-hover:border-[#003893] transition duration-300">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wide text-white group-hover:text-[#DC143C] transition">
                APEX <span className="text-[#DC143C] font-light">LEGAL</span>
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-slate-300 font-semibold">
                Counselors at Law
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
            <Link 
              href="/" 
              className={`transition hover:text-[#DC143C] ${pathname === '/' ? 'text-[#DC143C] border-b-2 border-[#DC143C] pb-0.5' : 'text-slate-200'}`}
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
                className={`flex items-center gap-1.5 transition hover:text-[#DC143C] py-1 cursor-pointer font-semibold ${
                  pathname.startsWith('/practice-areas') ? 'text-[#DC143C] border-b-2 border-[#DC143C]' : 'text-slate-200'
                }`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Practice Areas</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[#DC143C]' : ''}`} />
              </button>

              {/* Dropdown Container */}
              {dropdownOpen && (
                <div 
                  className="absolute top-full left-0 pt-2 w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl bg-[#00122E] border border-[#003893] shadow-2xl p-3 backdrop-blur-xl ring-1 ring-black/80">
                    <div className="px-3 py-2 border-b border-[#003893]/40 flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold tracking-widest text-[#DC143C] uppercase">
                        Legal Practice Disciplines
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">Tier-1 Counsel</span>
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
                                ? 'bg-[#003893] text-white border border-[#DC143C]'
                                : 'text-slate-300 hover:text-white hover:bg-[#00225E]'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#001C4A] border border-[#003893]/60 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-[#DC143C] group-hover:bg-[#DC143C]">
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-white group-hover:text-white transition">
                                {item.title}
                              </span>
                              <span className="block text-[11px] text-slate-400 group-hover:text-slate-200 line-clamp-1">
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#003893]/40">
                      <Link 
                        href="/practice-areas" 
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#001C4A] hover:bg-[#003893] text-xs text-white font-bold transition border border-[#003893]/50 hover:border-[#DC143C]"
                      >
                        <span>View All Practice Groups Directory</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#DC143C]" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/attorneys" 
              className={`transition hover:text-[#DC143C] ${pathname.startsWith('/attorneys') ? 'text-[#DC143C] border-b-2 border-[#DC143C] pb-0.5' : 'text-slate-200'}`}
            >
              Attorneys
            </Link>

            <Link 
              href="/case-results" 
              className={`transition hover:text-[#DC143C] ${pathname === '/case-results' ? 'text-[#DC143C] border-b-2 border-[#DC143C] pb-0.5' : 'text-slate-200'}`}
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              className={`transition hover:text-[#DC143C] ${pathname === '/contact' ? 'text-[#DC143C] border-b-2 border-[#DC143C] pb-0.5' : 'text-slate-200'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Consultation CTA Button & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact#consultation"
              className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] border border-white/20 shadow-lg shadow-[#DC143C]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Free Case Evaluation
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#001C4A] border border-[#003893] text-white hover:bg-[#003893] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#000000] border-b border-[#003893] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-2 text-base font-semibold">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-white hover:bg-[#001C4A] hover:text-[#DC143C]"
            >
              Home
            </Link>
            
            {/* Mobile Practice Areas Accordion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-white hover:bg-[#001C4A]">
                <Link 
                  href="/practice-areas" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#DC143C] flex-1 font-bold text-white"
                >
                  Practice Areas Directory
                </Link>
                <button
                  type="button"
                  onClick={() => setMobilePracticesOpen(!mobilePracticesOpen)}
                  className="p-1 text-[#DC143C] hover:text-white cursor-pointer"
                  aria-label="Toggle practice areas list"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobilePracticesOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobilePracticesOpen && (
                <div className="pl-4 space-y-1 pt-1 border-l-2 border-[#003893]/50 ml-3">
                  {practiceAreaLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-300 hover:text-[#DC143C]"
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
              className="px-3 py-2 rounded-lg text-white hover:bg-[#001C4A] hover:text-[#DC143C]"
            >
              Attorneys
            </Link>

            <Link 
              href="/case-results" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-white hover:bg-[#001C4A] hover:text-[#DC143C]"
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-white hover:bg-[#001C4A] hover:text-[#DC143C]"
            >
              Contact Us
            </Link>

            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-300 hover:bg-[#001C4A] hover:text-white flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#003893]" />
              <span>Admin Operations Portal</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#003893]/40">
            <Link
              href="/contact#consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] shadow-lg shadow-[#DC143C]/30"
            >
              Request Free Case Evaluation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
