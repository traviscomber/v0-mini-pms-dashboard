import { Reservation } from '../types';

/**
 * Detect if a new reservation conflicts with existing ones
 */
export function hasConflict(
  newReservation: Reservation,
  existingReservations: Reservation[]
): boolean {
  return existingReservations.some((existing) => {
    if (existing.id === newReservation.id) return false;
    if (existing.roomId !== newReservation.roomId) return false;
    if (existing.reservationStatus === 'cancelled') return false;

    const newCheckIn = new Date(newReservation.checkInDate);
    const newCheckOut = new Date(newReservation.checkOutDate);
    const existingCheckIn = new Date(existing.checkInDate);
    const existingCheckOut = new Date(existing.checkOutDate);

    // Check if date ranges overlap
    return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
  });
}

/**
 * Get all conflicting reservations for a given reservation
 */
export function getConflictingReservations(
  reservation: Reservation,
  allReservations: Reservation[]
): Reservation[] {
  return allReservations.filter(
    (other) =>
      other.id !== reservation.id &&
      other.roomId === reservation.roomId &&
      other.reservationStatus !== 'cancelled' &&
      new Date(reservation.checkInDate) < new Date(other.checkOutDate) &&
      new Date(reservation.checkOutDate) > new Date(other.checkInDate)
  );
}

/**
 * Get all reservations for a specific date range
 */
export function getReservationsInDateRange(
  reservations: Reservation[],
  startDate: Date,
  endDate: Date
): Reservation[] {
  return reservations.filter((res) => {
    if (res.reservationStatus === 'cancelled') return false;
    const checkIn = new Date(res.checkInDate);
    const checkOut = new Date(res.checkOutDate);
    return checkIn < endDate && checkOut > startDate;
  });
}

/**
 * Calculate occupancy rate for a date range
 */
export function calculateOccupancyRate(
  reservations: Reservation[],
  rooms: any[], // Room[]
  startDate: Date,
  endDate: Date
): number {
  const daysInRange = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalRoomDays = rooms.length * daysInRange;

  const occupiedRoomDays = reservations
    .filter((res) => {
      if (res.reservationStatus === 'cancelled') return false;
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      const overlapStart = Math.max(checkIn.getTime(), startDate.getTime());
      const overlapEnd = Math.min(checkOut.getTime(), endDate.getTime());
      return overlapEnd > overlapStart;
    })
    .reduce((sum, res) => {
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      const overlapStart = Math.max(checkIn.getTime(), startDate.getTime());
      const overlapEnd = Math.min(checkOut.getTime(), endDate.getTime());
      const days = Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

  return totalRoomDays > 0 ? (occupiedRoomDays / totalRoomDays) * 100 : 0;
}

/**
 * Get revenue for a date range
 */
export function calculateRevenueInDateRange(
  reservations: Reservation[],
  startDate: Date,
  endDate: Date
): number {
  return reservations
    .filter((res) => {
      if (res.reservationStatus === 'cancelled') return false;
      const checkIn = new Date(res.checkInDate);
      const checkOut = new Date(res.checkOutDate);
      return checkIn < endDate && checkOut > startDate;
    })
    .reduce((sum, res) => sum + res.totalAmount, 0);
}

/**
 * Get pending payments
 */
export function getPendingPayments(reservations: Reservation[]) {
  return reservations.filter(
    (res) =>
      (res.paymentStatus === 'pending' || res.paymentStatus === 'partially_paid') &&
      res.reservationStatus !== 'cancelled'
  );
}

/**
 * Get overdue payments
 */
export function getOverduePayments(
  reservations: Reservation[],
  currentDate: Date = new Date()
): Reservation[] {
  return reservations.filter(
    (res) =>
      res.paymentStatus === 'overdue' &&
      new Date(res.checkOutDate) < currentDate &&
      res.reservationStatus !== 'cancelled'
  );
}
