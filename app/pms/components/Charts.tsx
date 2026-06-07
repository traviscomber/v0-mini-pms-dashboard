'use client';

import { memo } from 'react';
import { useLanguage } from '../LanguageContext';
import RevenueChart from './Charts/RevenueChart';
import OccupancyChart from './Charts/OccupancyChart';
import BookingChart from './Charts/BookingChart';
import { Reservation, Room } from '@/lib/types';

interface ChartsProps {
  reservations: Reservation[];
  rooms: Room[];
}

const DashboardCharts = memo(({ reservations, rooms }: ChartsProps) => {
  const { t } = useLanguage();

  // Calculate key metrics
  const totalRevenue = reservations.reduce((sum, r) => sum + (r.total_amount || 0), 0);
  const avgRevenue = reservations.length > 0 ? (totalRevenue / reservations.length).toFixed(2) : 0;
  const occupiedRooms = reservations.filter(r => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(r.check_in_date);
    const checkOut = new Date(r.check_out_date);
    return checkIn <= today && checkOut > today;
  }).length;
  const avgOccupancy = rooms.length > 0 ? ((occupiedRooms / rooms.length) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Recharts - Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart reservations={reservations} />
        <OccupancyChart reservations={reservations} rooms={rooms} />
      </div>
      
      <BookingChart reservations={reservations} />

      {/* Key Metrics Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-foreground/60">Total Revenue</p>
            <p className="text-xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-sm text-foreground/60">Average per Booking</p>
            <p className="text-xl font-bold text-accent">${avgRevenue}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-lg">
            <p className="text-sm text-foreground/60">Occupancy Rate</p>
            <p className="text-xl font-bold text-secondary">{avgOccupancy}%</p>
          </div>
          <div className="p-3 bg-destructive/10 rounded-lg">
            <p className="text-sm text-foreground/60">Total Bookings</p>
            <p className="text-xl font-bold text-destructive">{reservations.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardCharts.displayName = 'DashboardCharts';
export default DashboardCharts;

