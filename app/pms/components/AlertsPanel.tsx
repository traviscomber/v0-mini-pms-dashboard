'use client';

import { AlertCircle, TrendingDown, Clock, X } from 'lucide-react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useLanguage as useLanguage } from '../LanguageContext';

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  icon?: React.ReactNode;
}

interface AlertsProps {
  reservations: any[];
  rooms: any[];
}

const generateAlerts = (reservations: any[], rooms: any[], t: any): Alert[] => {
  const alerts: Alert[] = [];
  
  // Check low occupancy
  const occupancyRate = (reservations.length / (rooms.length * 5)) * 100;
  if (occupancyRate < 30) {
    alerts.push({
      id: 'low-occupancy',
      type: 'warning',
      title: t('alerts.lowOccupancy'),
      message: `${t('alerts.occupancy')} ${occupancyRate.toFixed(0)}%. ${t('alerts.consider')}`,
      icon: <TrendingDown className="text-destructive600" />,
    });
  }
  
  // Check pending payments
  const pendingPayments = reservations.filter(r => r.status === 'pending').length;
  if (pendingPayments > 0) {
    alerts.push({
      id: 'pending-payments',
      type: 'critical',
      title: t('alerts.pendingPayments'),
      message: `${pendingPayments} ${t('alerts.pending')}`,
      icon: <AlertCircle className="text-destructive" />,
    });
  }

  // Check check-ins today
  const today = new Date(2026, 5, 6);
  const checkInsToday = reservations.filter(r => {
    const checkInDate = new Date(r.checkIn);
    return checkInDate.toDateString() === today.toDateString();
  }).length;

  if (checkInsToday > 0) {
    alerts.push({
      id: 'check-ins-today',
      type: 'info',
      title: t('alerts.checkinsTitle'),
      message: `${checkInsToday} ${t('alerts.checkInsToday')}`,
      icon: <Clock className="text-primary" />,
    });
  }
  
  return alerts;
};

const AlertsPanel = memo(({ reservations, rooms }: AlertsProps) => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState(() => generateAlerts(reservations, rooms, t));
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Regenerate alerts when language changes
  useEffect(() => {
    setAlerts(generateAlerts(reservations, rooms, t));
  }, [t, reservations, rooms]);

  const dismissAlert = useCallback((id: string) => {
    setDismissedAlerts(prev => new Set([...prev, id]));
  }, []);

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {visibleAlerts.map(alert => (
        <div
          key={alert.id}
          className={`flex items-start gap-4 p-4 rounded-lg border ${
            alert.type === 'critical'
              ? 'bg-red-950/20 border-red-900/30'
              : alert.type === 'warning'
              ? 'bg-destructive950/20 border-destructive900/30'
              : 'bg-blue-950/20 border-blue-900/30'
          }`}
          role="alert"
        >
          <div className="flex-shrink-0 pt-0.5">
            {alert.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{alert.title}</h3>
            <p className="text-foreground/70 text-sm mt-1">{alert.message}</p>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="flex-shrink-0 text-foreground/60 hover:text-foreground transition-colors p-1"
            aria-label={`Dismiss ${alert.title}`}
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
});

AlertsPanel.displayName = 'AlertsPanel';
export default AlertsPanel;
