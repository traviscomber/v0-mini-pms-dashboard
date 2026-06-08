'use client';

import { create } from 'zustand';
import { Language, t as translateFn } from '../i18n';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang: Language) => {
    console.log('[Zustand] Setting language to:', lang);
    set({ language: lang });
    try {
      localStorage.setItem('pms-language-zustand', lang);
    } catch (err) {
      console.error('[Zustand] localStorage error:', err);
    }
  },
  t: (key: string) => {
    const { language } = get();
    console.log('[Zustand.t] language:', language, 'key:', key);
    return translateFn(language, key);
  },
}));
