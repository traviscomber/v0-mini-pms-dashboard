'use client';

import { useState } from 'react';
import { DollarSign, Home, Users, AlertCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface SimplifiedDashboardProps {
  rooms: any[];
  reservations: any[];
  onShowCheckIns?: () => void;
  onShowPayments?: () => void;
}

export default function SimplifiedDashboard({ 
  rooms, 
  reservations,
  onShowCheckIns,
  onShowPayments
}: SimplifiedDashboardProps) {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Calculate outcomes
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  
  const occupiedRooms = reservations.filter(r => {
    const checkIn = new Date(r.checkIn);
    const checkOut = new Date(r.checkOut);
    return checkIn <= todayEnd && checkOut >= todayStart;
  }).length;
  
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

  const todayCheckIns = reservations.filter(r => {
    const checkIn = new Date(r.checkIn);
    return checkIn >= todayStart && checkIn <= todayEnd;
  }).length;

  const pendingPayments = reservations.filter(r => r.paymentStatus === 'Pending').length;
  const pendingAmount = reservations
    .filter(r => r.paymentStatus === 'Pending')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const metrics = [
    {
      id: 'revenue',
      title: t('payment.totalRevenue') || 'Total Revenue',
      value: `$${totalRevenue}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      action: 'View all bookings',
      actionColor: 'text-green-600'
    },
    {
      id: 'occupancy',
      title: t('roomMgmt.dailyOccupancy') || 'Occupancy Rate',
      value: `${occupancyRate}%`,
      icon: Home,
      color: 'from-blue-500 to-cyan-600',
      action: `${occupiedRooms}/${rooms.length} rooms`,
      actionColor: 'text-blue-600'
    },
    {
      id: 'checkins',
      title: t('schedule.todayCheckoutsCleaning')?.split('-')[0] || "Today's Check-ins",
      value: todayCheckIns.toString(),
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      action: 'View guests',
      actionColor: 'text-purple-600',
      onClick: onShowCheckIns
    },
    {
      id: 'payments',
      title: t('payment.pendingPayments') || 'Payments Due',
      value: `$${pendingAmount}`,
      icon: AlertCircle,
      color: pendingPayments > 0 ? 'from-red-500 to-orange-600' : 'from-gray-400 to-gray-600',
      action: `${pendingPayments} pending`,
      actionColor: pendingPayments > 0 ? 'text-red-600' : 'text-gray-600',
      onClick: onShowPayments,
      alert: pendingPayments > 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Outcomes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <button
              key={metric.id}
              onClick={() => {
                if (metric.onClick) metric.onClick();
                setSelectedMetric(metric.id);
              }}
              className={`relative overflow-hidden rounded-xl p-6 text-left transition-all hover:shadow-lg active:scale-95 ${
                metric.alert ? 'ring-2 ring-red-400' : ''
              }`}
              style={{
                background: `linear-gradient(135deg, ${metric.color}20 0%, ${metric.color}10 100%)`,
                borderColor: `${metric.color}40`,
                borderWidth: '1px'
              }}
            >
              {/* Background gradient accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full`}
                style={{
                  background: `linear-gradient(135deg, ${metric.color})`
                }}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg`}
                    style={{
                      background: `linear-gradient(135deg, ${metric.color})`
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {metric.onClick && (
                    <ChevronRight className="w-5 h-5 text-foreground/40" />
                  )}
                </div>

                <div>
                  <p className="text-sm text-foreground/60 font-medium">{metric.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{metric.value}</p>
                </div>

                <div className={`text-xs font-semibold ${metric.actionColor}`}>
                  {metric.action}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">{t('dashboard.quickSummary') || 'Quick Summary'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-foreground/60 uppercase tracking-wide">{t('dashboard.totalReservations') || 'Total Bookings'}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{reservations.length}</p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-foreground/60 uppercase tracking-wide">{t('dashboard.confirmedBookings') || 'Confirmed'}</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {reservations.filter(r => r.status === 'Confirmed').length}
            </p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-foreground/60 uppercase tracking-wide">{t('dashboard.unpaidBookings') || 'Unpaid'}</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {reservations.filter(r => r.paymentStatus === 'Pending').length}
            </p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-foreground/60 uppercase tracking-wide">{t('roomMgmt.totalRooms') || 'Total Rooms'}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{rooms.length}</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">{t('common.actions') || 'Quick Actions'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onShowCheckIns}
            className="p-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-left transition group"
          >
            <p className="text-sm font-semibold text-primary group-hover:text-primary/90">{t('schedule.todayCheckoutsCleaning')?.split('-')[0] || "Today's Check-ins"}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{todayCheckIns}</p>
          </button>
          <button
            onClick={onShowPayments}
            className="p-4 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-lg text-left transition group"
          >
            <p className="text-sm font-semibold text-accent group-hover:text-accent/90">{t('payment.pendingPayments') || 'Payments Due'}</p>
            <p className="text-2xl font-bold text-foreground mt-2">${pendingAmount}</p>
          </button>
          <button className="p-4 bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 rounded-lg text-left transition group">
            <p className="text-sm font-semibold text-secondary group-hover:text-secondary/90">{t('roomMgmt.popularRooms') || 'Most Popular Room'}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{rooms[0]?.name || 'N/A'}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
