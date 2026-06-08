'use client';

import { useLanguage } from './useLanguage';
import { BilingualText } from '../types';

/**
 * Hook para obtener texto traducido de objetos BilingualText
 * Usa el idioma actual del usuario
 */
export function useBilingualText() {
  const { language } = useLanguage();

  const getText = (bilingual?: BilingualText | null): string => {
    if (!bilingual) return '';
    return bilingual[language] || bilingual.en || '';
  };

  const getTexts = (items?: BilingualText[]): string[] => {
    if (!items) return [];
    return items.map(getText);
  };

  return { getText, getTexts, language };
}
