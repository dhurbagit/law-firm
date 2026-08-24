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

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth hover with debounce to prevent accidental closure
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150); // 150ms buffer prevents flickering when moving cursor
  };

  const practiceAreaLinks = [
    { 
      title: 'Corporate Law & M&A', 
      href: '/practice-areas/corporate-law-mergers', 
      desc: 'Cross-border M&A and regulatory governance',
      icon: Briefcase 
    },
    { 
      title: 'Personal Injury & Catastrophic', 
      href: '/practice-areas/personal-injury-catastrophic', 
      desc: 'Severe collision & industrial injury litigation',
      icon: ShieldAlert 
    },
    { 
      title: 'Intellectual Property & Patents', 
      href: '/practice-areas/intellectual-property-patents', 
      desc: 'High-tech patent portfolios and trade secrets',
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
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Banner - Hotline & Authority */}
      <div className="bg-[#060D17] border-b border-[#1E2D4A] px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#DFC7A5]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-semibold">Nationwide Trial Counsel</span> | Tier 1 National Ranking
            </span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block text-slate-400">Over $250M+ Recovered For Our Clients</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="tel:12128904400" 
              className="flex items-center gap-1.5 text-[#DFC7A5] hover:text-white transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>24/7 Urgent Hotline: (212) 890-4400</span>
            </a>
            <Link 
              href="/admin" 
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-[#C5A880] transition"
              title="Admin Operations Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-2xl border-b border-[#C5A880]/20 py-3' : 'bg-[#0A192F]/90 backdrop-blur-sm border-b border-white/5 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Law Firm Crest & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#172A45] to-[#0A192F] border border-[#C5A880]/40 flex items-center justify-center shadow-lg group-hover:border-[#C5A880] transition">
              <Scale className="w-5 h-5 text-[#C5A880]" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wide text-white group-hover:text-[#DFC7A5] transition">
                APEX <span className="text-[#C5A880] font-light">LEGAL</span>
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-[#856E4D] font-medium">
                Counselors at Law
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition hover:text-[#C5A880] ${pathname === '/' ? 'text-[#C5A880]' : 'text-slate-200'}`}
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
                className={`flex items-center gap-1.5 transition hover:text-[#C5A880] py-1 cursor-pointer ${
                  pathname.startsWith('/practice-areas') ? 'text-[#C5A880]' : 'text-slate-200'
                }`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Practice Areas</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-[#C5A880]' : ''}`} />
              </button>

              {/* Seamless Dropdown Container with Hover Bridge */}
              {dropdownOpen && (
                <div 
                  className="absolute top-full left-0 pt-2 w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="rounded-2xl bg-[#0B192C] border border-[#C5A880]/30 shadow-2xl p-3 backdrop-blur-xl ring-1 ring-black/40">
                    <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold tracking-widest text-[#C5A880] uppercase">
                        Legal Practice Disciplines
                      </span>
                      <span className="text-[10px] text-slate-500">Tier-1 Counsel</span>
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
                                ? 'bg-[#172A45] text-[#DFC7A5] border border-[#C5A880]/30'
                                : 'text-slate-300 hover:text-white hover:bg-[#172A45]/80'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#0A192F] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-[#C5A880]/50 group-hover:bg-[#172A45]">
                              <Icon className="w-4 h-4 text-[#C5A880]" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-white group-hover:text-[#DFC7A5] transition">
                                {item.title}
                              </span>
                              <span className="block text-[11px] text-slate-400 group-hover:text-slate-300 line-clamp-1">
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/5">
                      <Link 
                        href="/practice-areas" 
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0A192F] hover:bg-[#172A45] text-xs text-[#DFC7A5] hover:text-white font-semibold transition border border-white/5 hover:border-[#C5A880]/30"
                      >
                        <span>View All Practice Groups Directory</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/attorneys" 
              className={`transition hover:text-[#C5A880] ${pathname.startsWith('/attorneys') ? 'text-[#C5A880]' : 'text-slate-200'}`}
            >
              Attorneys
            </Link>

            <Link 
              href="/case-results" 
              className={`transition hover:text-[#C5A880] ${pathname === '/case-results' ? 'text-[#C5A880]' : 'text-slate-200'}`}
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              className={`transition hover:text-[#C5A880] ${pathname === '/contact' ? 'text-[#C5A880]' : 'text-slate-200'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Consultation CTA Button & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact#consultation"
              className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-[#0A192F] bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] hover:brightness-110 shadow-lg shadow-[#C5A880]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Free Case Evaluation
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#172A45] border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B192C] border-b border-[#C5A880]/20 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-2 text-base font-medium">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-[#172A45] hover:text-[#C5A880]"
            >
              Home
            </Link>
            
            {/* Mobile Practice Areas Accordion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#172A45]">
                <Link 
                  href="/practice-areas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#C5A880] flex-1 font-semibold text-white"
                >
                  Practice Areas Directory
                </Link>
                <button
                  type="button"
                  onClick={() => setMobilePracticesOpen(!mobilePracticesOpen)}
                  className="p-1 text-[#C5A880] hover:text-white cursor-pointer"
                  aria-label="Toggle practice areas list"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobilePracticesOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobilePracticesOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1.5 border-l-2 border-[#C5A880]/30 ml-3">
                  {practiceAreaLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#172A45] hover:text-[#C5A880]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/attorneys" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-[#172A45] hover:text-[#C5A880]"
            >
              Attorneys
            </Link>
            
            <Link 
              href="/case-results" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-[#172A45] hover:text-[#C5A880]"
            >
              Landmark Verdicts
            </Link>

            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-[#172A45] hover:text-[#C5A880]"
            >
              Contact Us
            </Link>

            <Link 
              href="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-400 hover:bg-[#172A45] hover:text-[#C5A880] flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#C5A880]" />
              <span>Admin Operations Portal</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/contact#consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-[#0A192F] bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] shadow-lg"
            >
              Request Free Case Evaluation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
