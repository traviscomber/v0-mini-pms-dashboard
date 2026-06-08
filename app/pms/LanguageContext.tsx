'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, t as translate } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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

  const setLanguage = (lang: Language) => {
    console.log('[v0-translation] Language changed to:', lang);
    setLanguageState(lang);
    try {
      localStorage.setItem('pms-language', lang);
    } catch (err) {
      // localStorage not available
    }
  };

  const t = (key: string) => {
    const result = translate(language, key);
    if (result !== key) {
      // Translation found
      return result;
    }
    console.warn(`[v0-translation] Missing key: ${key} for language: ${language}`);
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
