'use client';

import { useEffect } from 'react';

export function BootstrapClient() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap');
    }
  }, []);

  return null;
}
