'use client';

import { useEffect, useState, useCallback } from 'react';
import { Language, t } from '../i18n';

export function useLanguageSimple() {
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pms-lang') as Language | null;
    if (saved === 'es' || saved === 'en') {
      setLanguageState(saved);
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage and update state, force page re-render
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pms-lang', lang);
    // Dispatch custom event for all components to listen
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
  }, []);

  const translate = useCallback((key: string): string => {
    return t(language, key);
  }, [language]);

  return { language, setLanguage, t: translate, isMounted };
}
