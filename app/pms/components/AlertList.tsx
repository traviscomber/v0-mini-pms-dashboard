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
      info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
      critical: 'bg-red-500/10 border-red-500/30 text-red-300',
    };
    return styles[level] || 'bg-gray-500/10 border-gray-500/30 text-gray-300';
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
