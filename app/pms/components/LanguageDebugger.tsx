'use client';

import { useEffect, useState } from 'react';

export default function LanguageDebugger() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleChange = (e: any) => {
      console.log('[LanguageDebugger] Event received:', e.detail);
      setLanguage(e.detail.language);
    };

    window.addEventListener('languageChange', handleChange);
    return () => window.removeEventListener('languageChange', handleChange);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs z-50">
      <div>Current Language: <strong>{language}</strong></div>
      <button
        onClick={() => {
          setLanguage(language === 'en' ? 'es' : 'en');
          window.dispatchEvent(new CustomEvent('languageChange', { 
            detail: { language: language === 'en' ? 'es' : 'en' } 
          }));
        }}
        className="mt-2 bg-white text-black px-2 py-1 rounded"
      >
        Toggle
      </button>
    </div>
  );
}
