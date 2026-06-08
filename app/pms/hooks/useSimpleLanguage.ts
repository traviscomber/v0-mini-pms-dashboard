'use client';

import { useState, useEffect, useCallback } from 'react';
import { Language, t as translateFn } from '../i18n';

// Simple global state for language without Context
let currentLanguage: Language = 'en';
const listeners = new Set<() => void>();

export function useSimpleLanguage() {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const saved = localStorage.getItem('pms-language') as Language | null;
      if (saved === 'en' || saved === 'es') {
        currentLanguage = saved;
        setLanguageState(saved);
      }
    } catch (err) {
      // localStorage not available
    }

    // Subscribe to language changes
    const handleLanguageChange = () => {
      setLanguageState(currentLanguage);
    };
    
    listeners.add(handleLanguageChange);
    return () => listeners.delete(handleLanguageChange);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    console.log('[useSimpleLanguage] Setting language to:', lang);
    currentLanguage = lang;
    try {
      localStorage.setItem('pms-language', lang);
    } catch (err) {
      // localStorage not available
    }
    // Notify all listeners
    listeners.forEach(listener => listener());
  }, []);

  const t = useCallback((key: string) => {
    return translateFn(language, key);
  }, [language]);

  return { language, setLanguage, t };
}
