// Normalized Reservation model for operations-first PMS
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type PaymentStatus = 'paid' | 'partially_paid' | 'pending' | 'overdue';
export type CleaningStatus = 'clean' | 'dirty' | 'in_progress' | 'inspected';
export type ReservationSource = 'booking.com' | 'airbnb' | 'direct' | 'phone';

export interface Reservation {
  id: string;
  roomId: string;
  guestId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkInDate: Date;
  checkOutDate: Date;
  source: ReservationSource;
  reservationStatus: ReservationStatus;
  paymentStatus: PaymentStatus;
  cleaningStatus: CleaningStatus;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  numberOfGuests: number;
  specialRequests?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  type: 'room' | 'apartment' | 'suite' | 'cabin';
  capacity: number;
  basePrice: number;
  status: 'available' | 'maintenance' | 'blocked';
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  notes?: string;
}

export interface DemoData {
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
}
