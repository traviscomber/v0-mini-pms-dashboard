'use client';

import { useLanguage } from '../LanguageContext';

interface PageHeaderProps {
  section: string;
}

export default function PageHeader({ section }: PageHeaderProps) {
  const { t } = useLanguage();

  const getPageInfo = () => {
    const pages: {[key: string]: {title: string; subtitle: string}} = {
      dashboard: { title: 'Dashboard', subtitle: 'Manage your rental business efficiently' },
      calendar: { title: 'Calendar', subtitle: 'Manage rates and availability' },
      reservations: { title: 'Reservations', subtitle: 'Track and manage bookings' },
      inbox: { title: 'Messages', subtitle: 'Communicate with guests' },
      property: { title: 'Property', subtitle: 'Edit listing details and photos' },
      analytics: { title: 'Analytics', subtitle: 'View performance metrics' },
      finance: { title: 'Finance', subtitle: 'Manage payments and payouts' },
      settings: { title: 'Settings', subtitle: 'Configure your preferences' },
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
