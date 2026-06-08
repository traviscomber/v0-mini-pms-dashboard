'use client';

import { useLanguage } from '../LanguageContext';

export default function LanguageTest() {
  const { language, t } = useLanguage();
  
  return (
    <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded text-sm text-yellow-800">
      <p>Current Language: <strong>{language}</strong></p>
      <p>Sidebar Light: <strong>{t('sidebar.light')}</strong></p>
      <p>Property: <strong>{t('property.roomManagement')}</strong></p>
    </div>
  );
}
