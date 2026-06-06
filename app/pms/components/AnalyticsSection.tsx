'use client';

import { useMemo } from 'react';
import { TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface AnalyticsProps {
  reservations: any[];
  rooms: any[];
}

export default function AnalyticsSection({ reservations, rooms }: AnalyticsProps) {
  const { t } = useLanguage();
  const stats = useMemo(() => {
    const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const avgOccupancy = (reservations.length / rooms.length) * 100;
    const avgBookingValue = reservations.length > 0 ? totalRevenue / reservations.length : 0;
    const cancellationRate = (reservations.filter(r => r.status === 'Cancelled').length / reservations.length * 100) || 0;

    return { totalRevenue, avgOccupancy, avgBookingValue, cancellationRate };
  }, [reservations, rooms]);

  const revenueByRoom = useMemo(() => {
    const byRoom: {[key: string]: number} = {};
    rooms.forEach(room => {
      byRoom[room.name] = reservations
        .filter(r => r.roomType === room.type)
        .reduce((sum, r) => sum + r.totalPrice, 0);
    });
    return byRoom;
  }, [reservations, rooms]);

  const occupancyTrend = [
    { day: 'Jun 1', occupancy: 45 },
    { day: 'Jun 2', occupancy: 60 },
    { day: 'Jun 3', occupancy: 72 },
    { day: 'Jun 4', occupancy: 55 },
    { day: 'Jun 5', occupancy: 68 },
    { day: 'Jun 6', occupancy: 80 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Revenue</p>
              <p className="text-3xl font-bold text-green-500">${stats.totalRevenue.toFixed(0)}</p>
            </div>
            <DollarSign size={32} className="text-green-500/40" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Avg Occupancy</p>
              <p className="text-3xl font-bold text-blue-500">{stats.avgOccupancy.toFixed(0)}%</p>
            </div>
            <Users size={32} className="text-blue-500/40" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Avg Booking Value</p>
              <p className="text-3xl font-bold text-purple-500">${stats.avgBookingValue.toFixed(0)}</p>
            </div>
            <TrendingUp size={32} className="text-purple-500/40" />
          </div>
        </div>

        <div className={`bg-gradient-to-br ${stats.cancellationRate > 10 ? 'from-red-500/10 to-red-600/10 border-red-500/20' : 'from-orange-500/10 to-orange-600/10 border-orange-500/20'} border rounded-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Cancellation Rate</p>
              <p className={`text-3xl font-bold ${stats.cancellationRate > 10 ? 'text-red-500' : 'text-orange-500'}`}>
                {stats.cancellationRate.toFixed(1)}%
              </p>
            </div>
            <AlertCircle size={32} className={stats.cancellationRate > 10 ? 'text-red-500/40' : 'text-orange-500/40'} />
          </div>
        </div>
      </div>

      {/* Revenue by Room */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Room</h3>
        <div className="space-y-3">
          {Object.entries(revenueByRoom).map(([roomName, revenue]) => {
            const maxRevenue = Math.max(...Object.values(revenueByRoom as Record<string, number>));
            const percentage = (revenue as number / maxRevenue) * 100;
            return (
              <div key={roomName}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{roomName}</span>
                  <span className="text-sm font-bold text-primary">${(revenue as number).toFixed(0)}</span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Occupancy Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Occupancy Trend</h3>
        <div className="flex items-end gap-2 h-40">
          {occupancyTrend.map((data, idx) => {
            const maxOccupancy = 100;
            const height = (data.occupancy / maxOccupancy) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:from-primary/90 hover:to-accent/90" style={{ height: `${height}%` }} />
                <p className="text-xs text-foreground/60 mt-2">{data.day.split(' ')[1]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
