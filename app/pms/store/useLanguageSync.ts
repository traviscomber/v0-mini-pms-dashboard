'use client';

import { useEffect } from 'react';
import { useLanguageStore } from './languageStore';

/**
 * Hook to sync language from localStorage on component mount
 * Must be called in a client component early in the render tree
 */
export function useLanguageSync() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pms-language-zustand') as 'en' | 'es' | null;
      console.log('[useLanguageSync] Attempting to load from localStorage:', saved);
      if (saved === 'en' || saved === 'es') {
        useLanguageStore.setState({ language: saved });
        console.log('[useLanguageSync] Loaded language from localStorage:', saved);
      }
    } catch (err) {
      console.error('[useLanguageSync] Failed to load from localStorage:', err);
    }
  }, []); // Only run on mount
}
