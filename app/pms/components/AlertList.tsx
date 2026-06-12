'use client';

import { Alert } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertListProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export default function AlertList({ alerts, onDismiss }: AlertListProps) {
  const { t } = useLanguage();

  const getIcon = (level: string) => {
    const icons: Record<string, JSX.Element> = {
      info: <Info className="w-5 h-5" />,
      warning: <AlertTriangle className="w-5 h-5" />,
      critical: <AlertCircle className="w-5 h-5" />,
    };
    return icons[level];
  };

  const getStyles = (level: string) => {
    const styles: Record<string, string> = {
      info: 'bg-primary/10 border-primary/30 text-primary/70',
      warning: 'bg-secondary500/10 border-yellow-500/30 text-yellow-300',
      critical: 'bg-destructive/10 border-destructive/30 text-red-300',
    };
    return styles[level] || 'bg-card/500/10 border-border/30 text-foreground/50';
  };

  const activeAlerts = alerts.filter((a) => !a.isDismissed);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 space-y-2 max-w-md z-40">
      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-4 flex items-start gap-3 ${getStyles(alert.level)}`}
        >
          <div className="flex-shrink-0">{getIcon(alert.level)}</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{alert.title}</h3>
            <p className="text-sm opacity-90">{alert.message}</p>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="flex-shrink-0 hover:opacity-70 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
