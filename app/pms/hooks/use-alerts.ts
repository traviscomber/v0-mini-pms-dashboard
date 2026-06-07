import { Reservation, Room } from '@/lib/types';

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  dismissible: boolean;
}

export function useAlerts(reservations: Reservation[], rooms: Room[]): Alert[] {
  const alerts: Alert[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check for low occupancy
  const occupiedRooms = reservations.filter(r => {
    const checkIn = new Date(r.check_in_date);
    const checkOut = new Date(r.check_out_date);
    return checkIn <= today && checkOut > today;
  }).length;
  
  const occupancyRate = rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0;
  if (occupancyRate < 20) {
    alerts.push({
      id: 'low-occupancy',
      type: 'critical',
      title: 'Low Occupancy',
      message: `Current occupancy is ${occupancyRate.toFixed(1)}%. Consider promotional offers.`,
      timestamp: today,
      dismissible: true,
    });
  }

  // Check for overdue payments
  const overduePayments = reservations.filter(
    r => r.payment_status === 'pending' && new Date(r.check_in_date) < today
  );
  if (overduePayments.length > 0) {
    alerts.push({
      id: 'overdue-payments',
      type: 'critical',
      title: 'Overdue Payments',
      message: `${overduePayments.length} reservation(s) with overdue payments.`,
      timestamp: today,
      dismissible: true,
    });
  }

  // Check for same-day multiple check-ins
  const todayCheckIns = reservations.filter(r => {
    const checkIn = new Date(r.check_in_date);
    checkIn.setHours(0, 0, 0, 0);
    return checkIn.getTime() === today.getTime();
  });
  if (todayCheckIns.length > 2) {
    alerts.push({
      id: 'multiple-checkins',
      type: 'warning',
      title: 'Multiple Check-ins Today',
      message: `${todayCheckIns.length} guests checking in today. Ensure staff is prepared.`,
      timestamp: today,
      dismissible: true,
    });
  }

  // Check for rooms needing cleaning
  const todayCheckOuts = reservations.filter(r => {
    const checkOut = new Date(r.check_out_date);
    checkOut.setHours(0, 0, 0, 0);
    return checkOut.getTime() === today.getTime();
  });
  const dirtyRooms = todayCheckOuts.filter(r => r.cleaning_status !== 'clean').length;
  if (dirtyRooms > 0) {
    alerts.push({
      id: 'dirty-rooms',
      type: 'warning',
      title: 'Rooms Need Cleaning',
      message: `${dirtyRooms} room(s) need cleaning after today's check-outs.`,
      timestamp: today,
      dismissible: true,
    });
  }

  // Check for cancellations
  const recentCancellations = reservations.filter(r => {
    const updated = new Date(r.updated_at);
    const dayAgo = new Date(today);
    dayAgo.setDate(dayAgo.getDate() - 1);
    return r.status === 'cancelled' && updated > dayAgo;
  });
  if (recentCancellations.length > 0) {
    alerts.push({
      id: 'recent-cancellations',
      type: 'info',
      title: 'Recent Cancellations',
      message: `${recentCancellations.length} reservation(s) cancelled in the last 24 hours.`,
      timestamp: today,
      dismissible: true,
    });
  }

  // Check for high cancellation rate
  const totalBookings = reservations.length;
  const cancelledBookings = reservations.filter(r => r.status === 'cancelled').length;
  const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;
  if (cancellationRate > 20) {
    alerts.push({
      id: 'high-cancellation',
      type: 'warning',
      title: 'High Cancellation Rate',
      message: `Cancellation rate is ${cancellationRate.toFixed(1)}%. Monitor booking trends.`,
      timestamp: today,
      dismissible: true,
    });
  }

  return alerts;
}
