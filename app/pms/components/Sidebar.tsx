'use client';

import { Calendar, Home, BarChart3, Settings, BookOpen, Mail, Building2, CreditCard, Sun, Moon, Link2, PieChart, ClipboardList, Users, FileText, AlertTriangle } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { useLanguage } from '../hooks/useLanguage';
import LanguageToggle from './LanguageToggle';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { language, t } = useLanguage();

  const menuItems = [
    { id: 'operations', labelKey: 'operations.title', icon: Home },
    { id: 'housekeeping', labelKey: 'housekeeping.title', icon: ClipboardList },
    { id: 'calendar', labelKey: 'calendar.title', icon: Calendar },
    { id: 'reservations', labelKey: 'reservations.title', icon: BookOpen },
    { id: 'reports', labelKey: 'reports.title', icon: BarChart3 },
    { id: 'ledger', labelKey: 'ledger.title', icon: CreditCard },
    { id: 'messaging', labelKey: 'communication.title', icon: Mail },
    { id: 'channels', labelKey: 'channels.title', icon: Link2 },
    { id: 'financial', labelKey: 'financeSection.financialOverview', icon: PieChart },
    { id: 'users', labelKey: 'users.title', icon: Users },
    { id: 'audit', labelKey: 'audit.title', icon: FileText },
    { id: 'conflicts', labelKey: 'conflicts.title', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-sidebar-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PMS</h1>
          <p className="text-xs text-sidebar-foreground/60">{t('property.roomManagement')}</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-8 px-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <LanguageToggle />
        
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 transition-all"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">{isDark ? t('sidebar.light') : t('sidebar.dark')}</span>
        </button>

        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-sidebar-foreground">{t('sidebar.proTip')}</p>
          <p className="text-xs text-sidebar-accent">{t('sidebar.toggleLanguageTheme')}</p>
        </div>
      </div>
    </aside>
  );
}
