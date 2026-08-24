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
    return <div className="min-h-screen bg-[#000000] text-white font-sans">{children}</div>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#DC143C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-bold text-slate-300">
            Validating Sanctum Session...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#00122E] border border-[#003893] text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C] mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif text-xl font-bold text-white">Authentication Required</h2>
            <p className="text-xs text-slate-300">
              You must sign in with authorized administrator credentials to access the Operations Center.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] shadow-lg"
          >
            <span>Proceed to Admin Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white transition pt-2"
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
    <div className="min-h-screen bg-[#000000] text-white flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#000000] border-b border-[#003893] px-4 py-3 flex items-center justify-between sticky top-0 z-40 font-sans">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#001C4A] border border-[#003893] flex items-center justify-center text-[#DC143C]">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-white text-base tracking-wide">
            APEX <span className="text-[#DC143C] font-light">CMS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#001C4A] border border-[#003893] text-xs font-bold text-white hover:text-[#DC143C]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#DC143C]" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-[#001C4A] text-white hover:bg-[#003893] cursor-pointer"
            aria-label="Toggle admin navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#00122E] border-r border-[#003893] flex flex-col justify-between p-6 transition-transform duration-300 shadow-2xl font-sans
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Firm Logo & Admin Badge */}
          <div>
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#003893] border border-[#DC143C] flex items-center justify-center shadow-lg group-hover:bg-[#DC143C] transition">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold tracking-wide text-white">
                  APEX <span className="text-[#DC143C] font-light">LEGAL</span>
                </span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-slate-300 font-bold">
                  CMS Command Center
                </span>
              </div>
            </Link>

            <div className="mt-4 p-2.5 rounded-lg bg-[#000000] border border-[#003893]/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-[#DC143C] animate-pulse"></div>
                <span className="font-bold text-white">Principal Admin</span>
              </div>
              <span className="text-[10px] text-white uppercase font-bold px-1.5 py-0.5 rounded bg-[#003893]">
                Sanctum
              </span>
            </div>

            {/* Direct Public Homepage Link Button & Theme Toggle */}
            <div className="mt-3 space-y-2 font-sans">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#001C4A] hover:bg-[#003893] border border-[#003893] hover:border-[#DC143C] shadow transition group"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-[#DC143C]" />
                  <span>View Public Firm Site</span>
                </div>
                <span className="text-[10px] bg-[#DC143C] px-1.5 py-0.5 rounded text-white font-bold uppercase tracking-wider">
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
                      ? 'bg-[#003893] text-white border border-[#DC143C] shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-[#001C4A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#DC143C]' : 'text-slate-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#DC143C] text-white">
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#DC143C]" />
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-6 border-t border-[#003893]/40 font-sans">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#001C4A] transition border border-transparent"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>View Public Firm Site</span>
            </div>
            <span className="text-[10px] text-slate-400">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#DC143C] hover:bg-[#B00E2F] transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Portal</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto font-sans bg-[#000000]">
        {children}
      </main>

    </div>
  );
}
