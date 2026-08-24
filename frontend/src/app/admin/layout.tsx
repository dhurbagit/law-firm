'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Scale, 
  Users, 
  Briefcase, 
  Trophy, 
  Inbox, 
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Skip token validation on login page
    if (pathname === '/admin/login') {
      setAuthorized(true);
      return;
    }

    const token = typeof window !== 'undefined' 
      ? sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token')
      : null;

    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_token');
      localStorage.removeItem('admin_token');
    }
    router.push('/admin/login');
  };

  if (!authorized && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-nepal-dark flex items-center justify-center font-sans">
        <div className="p-8 rounded-2xl bg-nepal-surface border border-sakura-border text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-nepal-blue border border-crimson flex items-center justify-center text-white mx-auto shadow-lg">
            <Scale className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-serif text-lg font-bold text-white">
            Verifying Counsel Credentials...
          </h2>
          <p className="text-xs text-slate-300">
            Establishing secure handshake with Laravel Sanctum API.
          </p>
        </div>
      </div>
    );
  }

  // If on login page, render without admin navigation frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: 'Operations Overview',
      href: '/admin',
      icon: Scale,
      exact: true,
    },
    {
      label: 'Consultation Leads CRM',
      href: '/admin/leads',
      icon: Inbox,
      badge: 'Live',
    },
    {
      label: 'Attorneys & Partners',
      href: '/admin/attorneys',
      icon: Users,
    },
    {
      label: 'Practice Disciplines',
      href: '/admin/practice-areas',
      icon: Briefcase,
    },
    {
      label: 'Landmark Verdicts',
      href: '/admin/case-results',
      icon: Trophy,
    },
    {
      label: 'System Telemetry',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-nepal-dark text-white flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-nepal-dark border-b border-sakura-border px-4 py-3 flex items-center justify-between sticky top-0 z-40 font-sans">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-nepal-surface border border-sakura-border flex items-center justify-center text-crimson">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-white text-base tracking-wide">
            APEX <span className="text-crimson font-light">CMS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-nepal-surface border border-sakura-border text-xs font-bold text-white hover:text-crimson"
          >
            <ExternalLink className="w-3.5 h-3.5 text-crimson" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-nepal-surface text-white hover:bg-nepal-blue cursor-pointer"
            aria-label="Toggle admin navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-nepal-surface border-r border-sakura-border flex flex-col justify-between p-6 transition-transform duration-300 shadow-2xl font-sans
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Firm Logo & Admin Badge */}
          <div>
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-nepal-blue border border-crimson flex items-center justify-center shadow-lg group-hover:bg-crimson transition">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold tracking-wide text-white">
                  APEX <span className="text-crimson font-light">LEGAL</span>
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-slate-300 font-bold">
                  CMS Command Center
                </span>
              </div>
            </Link>

            <div className="mt-4 p-2.5 rounded-lg bg-nepal-dark border border-sakura-border/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-crimson animate-pulse"></div>
                <span className="font-bold text-white">Principal Admin</span>
              </div>
              <span className="text-[10px] text-white uppercase font-bold px-1.5 py-0.5 rounded bg-nepal-blue">
                Sanctum
              </span>
            </div>

            {/* Direct Public Homepage Link Button & Theme Toggle */}
            <div className="mt-3 space-y-2 font-sans">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-white bg-nepal-dark hover:bg-nepal-blue border border-sakura-border hover:border-crimson shadow transition group"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-crimson" />
                  <span>View Public Firm Site</span>
                </div>
                <span className="text-[10px] bg-crimson px-1.5 py-0.5 rounded text-white font-bold uppercase tracking-wider">
                  Live
                </span>
              </Link>

              <ThemeToggle showLabel={true} className="w-full justify-between px-3 py-2" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-3 mb-2">
              Operations & Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition group ${
                    isActive
                      ? 'bg-nepal-blue text-white border border-crimson shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-nepal-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-crimson' : 'text-slate-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-crimson text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && (
                    <ChevronRight className="w-3.5 h-3.5 text-crimson" />
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-sakura-border/40 font-sans">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-nepal-dark transition border border-transparent"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 text-crimson" />
              <span>View Public Firm Site</span>
            </div>
            <span className="text-[10px] text-slate-400">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-crimson hover:bg-crimson-hover transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Portal</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto font-sans bg-nepal-dark">
        {children}
      </main>

    </div>
  );
}
