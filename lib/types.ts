// Database types matching Supabase schema

export type ReservationStatus = 'confirmed' | 'pending' | 'checked_in' | 'checked_out' | 'cancelled';
export type ReservationChannel = 'direct' | 'booking' | 'airbnb' | 'expedia' | 'other';
export type RoomStatus = 'clean' | 'dirty' | 'inspected' | 'blocked';

// Properties
export interface Property {
  id: string;
  name: string;
  timezone: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Room Types
export interface RoomType {
  id: string;
  property_id: string;
  name: string;
  capacity: number;
  base_rate: number;
  created_at: string;
  updated_at: string;
}

// Rooms
export interface Room {
  id: string;
  property_id: string;
  room_type_id: string;
  number: string;
  floor: number | null;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
}

// Guests
export interface Guest {
  id: string;
  property_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  doc_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Reservations
export interface Reservation {
  id: string;
  property_id: string;
  room_id: string;
  guest_id: string;
  check_in: string; // DATE format
  check_out: string; // DATE format
  status: ReservationStatus;
  channel: ReservationChannel;
  total_amount: number;
  paid_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Charges
export interface Charge {
  id: string;
  reservation_id: string;
  description: string;
  amount: number;
  created_at: string;
}

// Rate Seasons
export interface RateSeason {
  id: string;
  property_id: string;
  name: string;
  date_from: string; // DATE format
  date_to: string; // DATE format
  multiplier: number;
  created_at: string;
  updated_at: string;
}

// Joined types for convenience
export interface ReservationWithDetails extends Reservation {
  guest?: Guest;
  room?: Room;
  room_type?: RoomType;
  charges?: Charge[];
}

export interface RoomWithType extends Room {
  room_type?: RoomType;
}

export interface GuestStats {
  total_stays: number;
  last_stay: string | null;
  total_spent: number;
}

export interface DashboardStats {
  arrivals_today: number;
  departures_today: number;
  dirty_rooms: number;
  pending_payments: number;
}
