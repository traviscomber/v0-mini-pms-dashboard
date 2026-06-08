'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from './pms/LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
