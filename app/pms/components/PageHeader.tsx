'use client';

import { useLanguage as useLanguage } from '../LanguageContext';

interface PageHeaderProps {
  section: string;
}

export default function PageHeader({ section }: PageHeaderProps) {
  const { t } = useLanguage();

  const getPageInfo = () => {
    const pages: {[key: string]: {titleKey: string; subtitleKey: string}} = {
      operations: { titleKey: 'operations.title', subtitleKey: 'operations.todayCommandCenter' },
      housekeeping: { titleKey: 'housekeeping.title', subtitleKey: 'housekeeping.kanbanBoard' },
      calendar: { titleKey: 'calendar.title', subtitleKey: 'calendarSection.monthView' },
      reservations: { titleKey: 'reservations.title', subtitleKey: 'reservations.newBooking' },
      reports: { titleKey: 'reports.title', subtitleKey: 'reports.analytics' },
      ledger: { titleKey: 'ledger.title', subtitleKey: 'ledger.paymentLedger' },
      messaging: { titleKey: 'communication.title', subtitleKey: 'communication.templates' },
      channels: { titleKey: 'channels.title', subtitleKey: 'channels.otaIntegrations' },
      financial: { titleKey: 'financeSection.financialOverview', subtitleKey: 'financeSection.recentTransactions' },
      users: { titleKey: 'users.title', subtitleKey: 'users.userManagement' },
      audit: { titleKey: 'audit.title', subtitleKey: 'audit.auditLog' },
      conflicts: { titleKey: 'conflicts.title', subtitleKey: 'conflicts.conflictDetection' },
      dashboard: { titleKey: 'dashboard.title', subtitleKey: 'dashboard.subtitle' },
      inbox: { titleKey: 'inboxSection.messages', subtitleKey: 'inboxSection.conversations' },
      property: { titleKey: 'propertySection.propertyDetails', subtitleKey: 'propertySection.editProperty' },
      analytics: { titleKey: 'analyticsSection.performanceMetrics', subtitleKey: 'analyticsSection.keyKPIs' },
      settings: { titleKey: 'sidebar.toggleLanguageTheme', subtitleKey: 'sidebar.toggleLanguageTheme' },
    };
    return pages[section] || { titleKey: '', subtitleKey: '' };
  };

  const { titleKey, subtitleKey } = getPageInfo();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-foreground">{t(titleKey)}</h1>
        <p className="text-foreground/60">{t(subtitleKey)}</p>
      </div>
    </header>
  );
}
