'use client';

import { useLanguage } from '../hooks/useLanguage';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2">
      <Globe className="w-4 h-4 text-foreground/60" />
      <button
        onClick={() => setLanguage('en')}
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
        onClick={() => setLanguage('es')}
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
