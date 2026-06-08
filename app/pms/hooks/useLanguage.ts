'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Language, t } from '../i18n';

// Global listener registry for language changes
let languageListeners: Set<(lang: Language) => void> = new Set();

export function notifyLanguageChange(lang: Language) {
  languageListeners.forEach(listener => listener(lang));
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);
  const listenerRef = useRef<(lang: Language) => void>();

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pms-language') as Language | null;
      if (saved === 'es' || saved === 'en') {
        setLanguageState(saved);
      }
    } catch (e) {
      console.error('Failed to read language from localStorage:', e);
    }
    setMounted(true);
  }, []);

  // Subscribe to language changes
  useEffect(() => {
    const listener = (lang: Language) => {
      setLanguageState(lang);
    };
    languageListeners.add(listener);
    listenerRef.current = listener;

    return () => {
      if (listenerRef.current) {
        languageListeners.delete(listenerRef.current);
      }
    };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pms-language', lang);
    } catch (e) {
      console.error('Failed to save language to localStorage:', e);
    }
    notifyLanguageChange(lang);
  }, []);

  const translate = useCallback((key: string): string => {
    return t(language, key);
  }, [language]);

  return {
    language: mounted ? language : 'en',
    setLanguage,
    t: translate,
    mounted
  };
}
