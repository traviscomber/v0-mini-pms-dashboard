'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { Users, TrendingUp, DollarSign, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { useLanguage as useLanguage } from '../LanguageContext';
import DashboardCharts from './Charts';
import DetailModal from './DetailModal';
import AlertsPanel from './AlertsPanel';
import AdvancedFilters from './AdvancedFilters';

interface EnhancedDashboardProps {
  rooms: any[];
  reservations: any[];
}

const StatCard = memo(({ icon: Icon, title, value, unit = '', onClick }: any) => (
  <button
    onClick={onClick}
    className="bg-card p-6 rounded-lg border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all text-left group"
    aria-label={`${title}: ${value}${unit}, click for details`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-foreground/60 text-sm font-medium group-hover:text-foreground/80 transition-colors">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-2">{value}{unit}</p>
      </div>
      <div className="bg-primary/10 p-3 rounded-lg text-primary">
        <Icon size={24} />
      </div>
    </div>
  </button>
));

StatCard.displayName = 'StatCard';

const EnhancedDashboard = memo(({ rooms, reservations }: EnhancedDashboardProps) => {
  const { t } = useLanguage();
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    data: any[];
    columns: any[];
  }>({ isOpen: false, title: '', data: [], columns: [] });

  // Memoized calculations
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalRevenue = filteredReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const occupiedNights = filteredReservations.reduce((sum, r) => {
      const nights = Math.ceil((new Date(r.checkOutDate).getTime() - new Date(r.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
    const totalPossibleNights = rooms.length * 365;
    const occupancyRate = ((occupiedNights / totalPossibleNights) * 100).toFixed(1);

    return {
      totalRevenue,
      occupancyRate,
      pendingPayments: filteredReservations.filter(r => r.paymentStatus === 'Pending').length,
      checkIns: filteredReservations.filter(r => r.checkInDate.split('T')[0] === today).length,
      checkOuts: filteredReservations.filter(r => r.checkOutDate.split('T')[0] === today).length,
    };
  }, [filteredReservations, rooms.length]);

  // Modal handlers
  const openReservationsModal = useCallback(() => {
    setModalState({
      isOpen: true,
      title: 'All Reservations',
      data: filteredReservations,
      columns: [
        { key: 'guestName', label: 'Guest' },
        { key: 'checkInDate', label: 'Check-in', format: (v: string) => new Date(v).toLocaleDateString() },
        { key: 'checkOutDate', label: 'Check-out', format: (v: string) => new Date(v).toLocaleDateString() },
        { key: 'totalPrice', label: 'Total', format: (v: number) => `$${v}` },
      ],
    });
  }, [filteredReservations]);

  const openPaymentsModal = useCallback(() => {
    const pendingPayments = filteredReservations.filter(r => r.paymentStatus === 'Pending');
    setModalState({
      isOpen: true,
      title: 'Pending Payments',
      data: pendingPayments,
      columns: [
        { key: 'guestName', label: 'Guest' },
        { key: 'totalPrice', label: 'Amount', format: (v: number) => `$${v}` },
        { key: 'paymentStatus', label: 'Status' },
      ],
    });
  }, [filteredReservations]);

  const openCheckInsModal = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIns = filteredReservations.filter(r => r.checkInDate.split('T')[0] === today);
    setModalState({
      isOpen: true,
      title: "Today's Check-ins",
      data: todayCheckIns,
      columns: [
        { key: 'guestName', label: 'Guest' },
        { key: 'roomId', label: 'Room' },
        { key: 'checkInDate', label: 'Time', format: (v: string) => {
          const date = new Date(v);
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }},
      ],
    });
  }, [filteredReservations]);

  return (
    <div className="space-y-6">
      {/* Alerts */}
      <AlertsPanel reservations={filteredReservations} rooms={rooms} />

      {/* Advanced Filters */}
      <AdvancedFilters 
        rooms={rooms} 
        reservations={reservations}
        onFilter={setFilteredReservations}
      />

      {/* Key Metrics - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          icon={Users} 
          title={t('dashboard.totalReservations')} 
          value={filteredReservations.length}
          onClick={openReservationsModal}
        />
        <StatCard 
          icon={TrendingUp} 
          title={t('dashboard.occupancyRate')} 
          value={stats.occupancyRate} 
          unit="%" 
        />
        <StatCard 
          icon={DollarSign} 
          title={t('dashboard.monthlyRevenue')} 
          value={`$${stats.totalRevenue}`}
        />
      </div>

      {/* Today's Events - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={AlertCircle} 
          title={t('dashboard.pendingPayments')} 
          value={stats.pendingPayments}
          onClick={openPaymentsModal}
        />
        <StatCard 
          icon={LogIn} 
          title={t('dashboard.checkinsToday')} 
          value={stats.checkIns}
          onClick={openCheckInsModal}
        />
        <StatCard 
          icon={LogOut} 
          title={t('dashboard.checkoutsToday')} 
          value={stats.checkOuts}
        />
      </div>

      {/* Interactive Charts */}
      <DashboardCharts reservations={filteredReservations} rooms={rooms} />

      {/* Detail Modal */}
      <DetailModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        data={modalState.data}
        columns={modalState.columns}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
});

EnhancedDashboard.displayName = 'EnhancedDashboard';
export default EnhancedDashboard;
