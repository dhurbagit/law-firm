'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('apex_theme') as 'dark' | 'light' | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'dark';
      setTheme(initial);
      applyTheme(initial);
    }
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('apex_theme', nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div 
        className={`rounded-3 bg-nepal-surface border border-sakura ${className}`} 
        style={{ width: '36px', height: '36px' }}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-sm d-inline-flex align-items-center justify-content-center gap-2 p-2 rounded-3 border-sakura shadow-sm ${
        isDark ? 'btn-outline-light text-white' : 'btn-light text-primary'
      } ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label={`Toggle current ${theme} theme`}
    >
      <div className="d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px' }}>
        {isDark ? (
          <Sun className="text-crimson" style={{ width: '16px', height: '16px' }} />
        ) : (
          <Moon className="text-primary" style={{ width: '16px', height: '16px' }} />
        )}
      </div>

      {showLabel && (
        <span className="small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
