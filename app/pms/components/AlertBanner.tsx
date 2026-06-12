'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Alert } from '../hooks/use-alerts';

interface AlertBannerProps {
  alerts: Alert[];
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Load dismissed alerts from localStorage
    const dismissed = JSON.parse(localStorage.getItem('dismissed-alerts') || '[]');
    const newAlerts = alerts.filter(a => !dismissed.includes(a.id));
    setVisibleAlerts(newAlerts);
  }, [alerts]);

  const handleDismiss = (id: string) => {
    const dismissed = JSON.parse(localStorage.getItem('dismissed-alerts') || '[]');
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem('dismissed-alerts', JSON.stringify(dismissed));
    }
    setVisibleAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (visibleAlerts.length === 0) return null;

  // Sort by type priority: critical > warning > info
  const sortedAlerts = [...visibleAlerts].sort((a, b) => {
    const priority = { critical: 0, warning: 1, info: 2 };
    return priority[a.type] - priority[b.type];
  });

  return (
    <div className="space-y-2">
      {sortedAlerts.map(alert => {
        const bgColor = {
          critical: 'bg-destructive/10 border-destructive/20',
          warning: 'bg-secondary500/10 border-yellow-500/20',
          info: 'bg-primary/10 border-primary/20',
        };
        
        const iconColor = {
          critical: 'text-destructive',
          warning: 'text-yellow-600',
          info: 'text-primary',
        };
        
        const Icon = {
          critical: AlertCircle,
          warning: AlertTriangle,
          info: Info,
        }[alert.type];

        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor[alert.type]}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor[alert.type]}`} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">{alert.title}</h4>
              <p className="text-sm text-foreground/70 mt-1">{alert.message}</p>
            </div>
            {alert.dismissible && (
              <button
                onClick={() => handleDismiss(alert.id)}
                className="flex-shrink-0 p-1 hover:bg-background/50 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
