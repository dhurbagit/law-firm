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
      <div className="min-vh-100 bg-nepal-dark d-flex align-items-center justify-content-center">
        <div className="p-4 rounded-4 bg-nepal-surface border border-sakura text-center shadow-lg" style={{ maxWidth: '360px' }}>
          <div 
            className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-blue border border-crimson text-white mx-auto mb-3 shadow"
            style={{ width: '48px', height: '48px' }}
          >
            <Scale style={{ width: '24px', height: '24px' }} className="animate-pulse" />
          </div>
          <h4 className="font-serif fw-bold text-white mb-2">
            Verifying Counsel Credentials...
          </h4>
          <p className="text-white-50 small mb-0">
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
    <div className="min-vh-100 bg-nepal-dark text-white d-flex flex-column flex-lg-row">
      
      {/* Mobile Top Header */}
      <div className="d-lg-none bg-nepal-dark border-bottom border-sakura p-3 d-flex align-items-center justify-content-between sticky-top z-3">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="d-flex align-items-center justify-content-center rounded-2 bg-nepal-surface border border-sakura text-crimson"
            style={{ width: '32px', height: '32px' }}
          >
            <Scale style={{ width: '16px', height: '16px' }} />
          </div>
          <span className="font-serif fw-bold text-white fs-6">
            APEX <span className="text-crimson fw-light">CMS</span>
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            target="_blank"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 border-sakura text-white fw-bold"
            style={{ fontSize: '11px' }}
          >
            <ExternalLink className="text-crimson" style={{ width: '12px', height: '12px' }} />
            <span>Public Site</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-outline-light p-1 border-sakura d-flex align-items-center justify-content-center"
            aria-label="Toggle admin navigation"
          >
            {sidebarOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside 
        className={`bg-nepal-surface border-end border-sakura d-flex flex-column justify-content-between p-4 shadow-lg ${
          sidebarOpen ? 'd-flex position-fixed top-0 start-0 z-3 w-75 h-100' : 'd-none d-lg-flex'
        }`}
        style={{ width: '280px', minHeight: '100vh', flexShrink: 0 }}
      >
        <div className="d-flex flex-column gap-4">
          
          {/* Firm Logo & Admin Badge */}
          <div>
            <Link href="/admin" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-blue border border-crimson text-white shadow"
                style={{ width: '40px', height: '40px' }}
              >
                <Scale style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <span className="d-block font-serif fs-5 fw-bold text-white lh-1">
                  APEX <span className="text-crimson fw-light">LEGAL</span>
                </span>
                <span className="d-block text-uppercase fw-bold text-white-50" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                  CMS Command Center
                </span>
              </div>
            </Link>

            <div className="p-2 rounded-3 bg-nepal-dark border border-sakura d-flex align-items-center justify-content-between small">
              <div className="d-flex align-items-center gap-2 text-white">
                <span className="rounded-circle bg-crimson" style={{ width: '8px', height: '8px' }}></span>
                <strong className="text-white" style={{ fontSize: '11px' }}>Principal Admin</strong>
              </div>
              <span className="badge bg-nepal-blue text-white" style={{ fontSize: '9px' }}>
                Sanctum
              </span>
            </div>

            {/* Direct Public Homepage Link Button & Theme Toggle */}
            <div className="d-flex flex-column gap-2 mt-3">
              <Link
                href="/"
                target="_blank"
                className="btn btn-sm btn-outline-light w-100 d-flex align-items-center justify-content-between p-2 rounded-3 border-sakura text-white fw-bold"
                style={{ fontSize: '11px' }}
              >
                <div className="d-flex align-items-center gap-1">
                  <ExternalLink className="text-crimson" style={{ width: '12px', height: '12px' }} />
                  <span>View Public Firm Site</span>
                </div>
                <span className="badge bg-crimson text-white">Live</span>
              </Link>

              <ThemeToggle showLabel={true} className="w-100 justify-content-between p-2" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="nav flex-column gap-1">
            <span className="text-uppercase fw-bold text-white-50 small mb-2 px-2" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
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
                  className={`nav-link d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-white fw-bold small text-decoration-none transition ${
                    isActive
                      ? 'bg-nepal-blue text-white border border-crimson shadow-sm'
                      : 'hover-bg-nepal'
                  }`}
                  style={{ fontSize: '12px' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Icon className={isActive ? 'text-crimson' : 'text-white'} style={{ width: '16px', height: '16px' }} />
                    <span className="text-white">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="badge bg-crimson text-white">{item.badge}</span>
                  )}
                  {isActive && !item.badge && (
                    <ChevronRight className="text-crimson" style={{ width: '14px', height: '14px' }} />
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-top border-sakura">
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-crimson w-100 py-2 rounded-3 text-white fw-bold small d-flex align-items-center justify-content-center gap-2 shadow"
          >
            <LogOut style={{ width: '14px', height: '14px' }} />
            <span>Sign Out of Portal</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-4 p-md-5 overflow-auto bg-nepal-dark">
        {children}
      </main>

    </div>
  );
}
