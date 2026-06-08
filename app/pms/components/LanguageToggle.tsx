'use client';

import { useLanguage } from '../LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'es') => {
    console.log('[v0-toggle] Changing language from', language, 'to', lang);
    setLanguage(lang);
    console.log('[v0-toggle] Language change called');
  };

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2">
      <Globe className="w-4 h-4 text-foreground/60" />
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          language === 'en'
            ? 'bg-primary text-white'
            : 'text-foreground/60 hover:text-foreground'
        }`}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          language === 'es'
            ? 'bg-primary text-white'
            : 'text-foreground/60 hover:text-foreground'
        }`}
        title="Español"
      >
        ES
      </button>
    </div>
  );
}
