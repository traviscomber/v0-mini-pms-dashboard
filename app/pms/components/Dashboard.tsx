'use client';

import { Users, TrendingUp, DollarSign, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { useLanguage as useLanguage } from '../LanguageContext';
import { useAutomation } from '../hooks/useAutomation';
import AutomationDashboard from './AutomationDashboard';
import SmartManagementHub from './SmartManagementHub';

interface DashboardProps {
  rooms: any[];
  reservations: any[];
  tasks?: any[];
  alerts?: any[];
  onTasksChange?: (tasks: any[]) => void;
  onAlertsChange?: (alerts: any[]) => void;
}

export default function Dashboard({ 
  rooms, 
  reservations, 
  tasks = [], 
  alerts = [],
  onTasksChange,
  onAlertsChange 
}: DashboardProps) {
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];

  // Initialize automation hook
  const automation = useAutomation(
    reservations,
    tasks,
    alerts,
    onTasksChange,
    onAlertsChange,
    { autoGenerateTasks: true, autoCreateAlerts: true, autoUpdateCleaningStatus: true }
  );
  
  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const occupiedNights = reservations.reduce((sum, r) => {
    const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return sum + nights;
  }, 0);
  const totalPossibleNights = rooms.length * 365;
  const occupancyRate = ((occupiedNights / totalPossibleNights) * 100).toFixed(1);
  
  const pendingPayments = reservations.filter(r => r.paymentStatus === 'Pending').length;
  const checkIns = reservations.filter(r => r.checkIn === today).length;
  const checkOuts = reservations.filter(r => r.checkOut === today).length;

  const StatCard = ({ icon: Icon, title, value, unit = '' }: any) => (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}{unit}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-lg text-primary">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} title={t('operations.totalReservations')} value={reservations.length} />
        <StatCard icon={TrendingUp} title={t('operations.occupancyRate')} value={occupancyRate} unit="%" />
        <StatCard icon={DollarSign} title={t('operations.monthlyRevenue')} value={`$${totalRevenue}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={AlertCircle} title={t('operations.pendingPayments')} value={pendingPayments} />
        <StatCard icon={LogIn} title={t('operations.checkInsToday')} value={checkIns} />
        <StatCard icon={LogOut} title={t('operations.checkOutsToday')} value={checkOuts} />
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t('operations.upcomingEvents')}</h2>
        <div className="space-y-3">
          {checkIns > 0 && (
            <p className="flex items-center gap-2 text-foreground/80">
              <LogIn className="text-green-600" size={18} />
              <strong>{checkIns}</strong> {t('operations.checkInPlural')}
            </p>
          )}
          {checkOuts > 0 && (
            <p className="flex items-center gap-2 text-foreground/80">
              <LogOut className="text-orange-600" size={18} />
              <strong>{checkOuts}</strong> {t('operations.checkOutPlural')}
            </p>
          )}
          {pendingPayments > 0 && (
            <p className="flex items-center gap-2 text-foreground/80">
              <AlertCircle className="text-red-600" size={18} />
              <strong>{pendingPayments}</strong> {t('operations.pendingPaymentPlural')}
            </p>
          )}
          {checkIns === 0 && checkOuts === 0 && pendingPayments === 0 && (
            <p className="text-foreground/50">{t('operations.noEventsToday')}</p>
          )}
        </div>
      </div>

      {/* Smart Management Hub - Occupancy, Pricing, Notifications */}
      <div className="border-t border-border pt-6">
        <SmartManagementHub rooms={rooms} reservations={reservations} tasks={tasks} />
      </div>
    </div>
  );
}
