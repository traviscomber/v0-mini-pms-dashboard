'use client';

import { useLanguage } from '../LanguageContext';

interface PageHeaderProps {
  section: string;
}

export default function PageHeader({ section }: PageHeaderProps) {
  const { t } = useLanguage();

  const getPageInfo = () => {
    const pages: {[key: string]: {title: string; subtitle: string}} = {
      dashboard: { title: t('nav.dashboard'), subtitle: t('dashboard.subtitle') },
      calendar: { title: t('nav.calendar'), subtitle: t('calendar.title') },
      reservations: { title: t('nav.reservations'), subtitle: t('reservations.title') },
      rooms: { title: t('nav.properties'), subtitle: t('properties.title') },
      reports: { title: t('nav.reports'), subtitle: t('reports.title') },
      settings: { title: t('nav.settings'), subtitle: t('common.close') },
    };
    return pages[section] || { title: '', subtitle: '' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <p className="text-foreground/60">{subtitle}</p>
      </div>
    </header>
  );
}
