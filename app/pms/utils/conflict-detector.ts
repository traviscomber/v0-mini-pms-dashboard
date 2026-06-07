import { Reservation } from './types';

export function hasConflict(
  newReservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>,
  existingReservations: Reservation[]
): boolean {
  return existingReservations.some(res => {
    // Skip if not the same room or if statuses indicate it won't occupy the room
    if (res.roomId !== newReservation.roomId) return false;
    if (res.reservationStatus === 'cancelled') return false;
    if (newReservation.reservationStatus === 'cancelled') return false;

    // Check for overlap: new checkout after existing check-in AND new check-in before existing checkout
    return newReservation.checkOutDate > res.checkInDate && 
           newReservation.checkInDate < res.checkOutDate;
  });
}

export function getConflictingReservations(
  newReservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>,
  existingReservations: Reservation[]
): Reservation[] {
  return existingReservations.filter(res => {
    if (res.roomId !== newReservation.roomId) return false;
    if (res.reservationStatus === 'cancelled') return false;
    if (newReservation.reservationStatus === 'cancelled') return false;
    return newReservation.checkOutDate > res.checkInDate && 
           newReservation.checkInDate < res.checkOutDate;
  });
}

export function getReservationsForDate(
  date: Date,
  reservations: Reservation[]
): Reservation[] {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return reservations.filter(res => {
    const checkIn = new Date(res.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    const checkOut = new Date(res.checkOutDate);
    checkOut.setHours(0, 0, 0, 0);
    
    return checkIn <= checkDate && checkDate < checkOut && res.reservationStatus !== 'cancelled';
  });
}

export function getArrivals(date: Date, reservations: Reservation[]): Reservation[] {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return reservations.filter(res => {
    const checkIn = new Date(res.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    return checkIn.getTime() === checkDate.getTime() && res.reservationStatus !== 'cancelled';
  });
}

export function getDepartures(date: Date, reservations: Reservation[]): Reservation[] {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return reservations.filter(res => {
    const checkOut = new Date(res.checkOutDate);
    checkOut.setHours(0, 0, 0, 0);
    return checkOut.getTime() === checkDate.getTime() && res.reservationStatus !== 'cancelled';
  });
}

export function getPendingPayments(reservations: Reservation[]): Reservation[] {
  return reservations.filter(res => 
    (res.paymentStatus === 'pending' || res.paymentStatus === 'partially_paid' || res.paymentStatus === 'overdue') &&
    res.reservationStatus !== 'cancelled'
  );
}

export function getDirtyRooms(reservations: Reservation[]): string[] {
  return reservations
    .filter(res => res.cleaningStatus === 'dirty' && res.reservationStatus !== 'cancelled')
    .map(res => res.roomId)
    .filter((roomId, index, self) => self.indexOf(roomId) === index);
}
