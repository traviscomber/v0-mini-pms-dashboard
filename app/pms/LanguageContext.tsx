'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { Language, t as translate } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('pms-language') as Language | null;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        setLanguageState(savedLanguage);
      }
    } catch (err) {
      // localStorage not available or other error
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pms-language', lang);
    } catch (err) {
      // localStorage not available
    }
  }, []);

  const t = useCallback((key: string, variables?: Record<string, string | number>) => {
    return translate(language, key, variables);
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
