'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Scale, 
  LayoutDashboard, 
  Inbox, 
  Users, 
  Briefcase, 
  Trophy, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ChevronRight,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' 
      ? (sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token'))
      : null;
      
    setToken(savedToken);
    setIsCheckingAuth(false);

    if (!savedToken && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_token');
      localStorage.removeItem('admin_token');
    }
    setToken(null);
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#060D17]">{children}</div>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#060D17] flex items-center justify-center text-[#C5A880]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            Validating Sanctum Session...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#060D17] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0A192F] border border-[#C5A880]/30 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#172A45] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif text-xl font-bold text-white">Authentication Required</h2>
            <p className="text-xs text-slate-400">
              You must sign in with authorized administrator credentials to access the Operations Center.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-[#0A192F] bg-gradient-to-r from-[#DFC7A5] via-[#C5A880] to-[#9F8259] hover:brightness-110 shadow-lg"
          >
            <span>Proceed to Admin Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-[#C5A880] transition pt-2"
          >
            <span>← Return to Public Firm Website</span>
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: 'Dashboard Overview',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Leads CRM',
      href: '/admin/leads',
      icon: Inbox,
      badge: 'Live',
    },
    {
      label: 'Attorneys Directory',
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
      label: 'System Operations',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070E18] text-slate-100 flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0A192F] border-b border-[#1E2D4A] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#172A45] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-white text-base tracking-wide">
            APEX <span className="text-[#C5A880] font-light">CMS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#172A45] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC7A5] hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-[#172A45] text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle admin navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0A192F] border-r border-[#1E2D4A] flex flex-col justify-between p-6 transition-transform duration-300 shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Firm Logo & Admin Badge */}
          <div>
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#172A45] to-[#060D17] border border-[#C5A880]/50 flex items-center justify-center shadow-lg group-hover:border-[#C5A880] transition">
                <Scale className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold tracking-wide text-white">
                  APEX <span className="text-[#C5A880] font-light">LEGAL</span>
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
                  CMS Command Center
                </span>
              </div>
            </Link>

            <div className="mt-4 p-2.5 rounded-lg bg-[#060D17] border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="font-medium text-slate-200">Principal Admin</span>
              </div>
              <span className="text-[10px] text-[#C5A880] uppercase font-bold px-1.5 py-0.5 rounded bg-[#172A45]">
                Sanctum
              </span>
            </div>

            {/* Direct Public Homepage Link Button & Theme Toggle */}
            <div className="mt-3 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#DFC7A5] bg-[#172A45]/80 hover:bg-[#172A45] border border-[#C5A880]/30 hover:border-[#C5A880] shadow transition group"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>View Public Firm Site</span>
                </div>
                <span className="text-[10px] bg-[#0A192F] px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Live
                </span>
              </Link>

              <ThemeToggle showLabel={true} className="w-full justify-between px-3 py-2" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-3 mb-2">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#172A45] to-[#1E2D4A] text-[#DFC7A5] border border-[#C5A880]/30 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#172A45]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#C5A880]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#DFC7A5] border border-[#C5A880]/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-white/5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 hover:text-[#C5A880] hover:bg-[#172A45]/40 transition border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Firm Site</span>
            </div>
            <span className="text-[10px] text-slate-500">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 bg-red-950/40 hover:bg-red-950/80 border border-red-500/20 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Portal</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
