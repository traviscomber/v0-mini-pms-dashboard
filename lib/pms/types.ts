export const bookingSources = ["Direct", "Booking.com", "Airbnb", "Website", "Phone"] as const;
export const paymentStatuses = ["Paid", "Partial", "Pending"] as const;
export const cleaningStatuses = ["Clean", "Needs cleaning", "In progress"] as const;

export type BookingSource = (typeof bookingSources)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type CleaningStatus = (typeof cleaningStatuses)[number];
export type ActiveSection =
  | "dashboard"
  | "calendar"
  | "reservations"
  | "rooms"
  | "reports"
  | "settings";

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  basePrice: number;
  color: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  source: BookingSource;
  paymentStatus: PaymentStatus;
  cleaningStatus: CleaningStatus;
  notes: string;
  totalPrice: number;
  createdAt: string;
}

export interface PmsData {
  rooms: Room[];
  reservations: Reservation[];
}

export type PmsStorageMode = "file" | "postgres";

export interface PmsScope {
  organizationId: string;
  propertyId: string;
  userId: string;
}

export type ReservationInput = Omit<Reservation, "id" | "createdAt" | "totalPrice">;

export type ReservationValidationErrors = Partial<Record<keyof ReservationInput, string>>;
