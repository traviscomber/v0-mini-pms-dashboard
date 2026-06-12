import { Language } from './i18n';

// Bilingual support for all string fields
export interface BilingualText {
  en: string;
  es: string;
}

// Property/Installation model with bilingual support
export interface Property {
  id: string;
  name: BilingualText;
  description?: BilingualText;
  location: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  totalRooms: number;
  amenities: BilingualText[];
  maxGuests: number;
  timezone: string;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Room types with bilingual names
export type RoomTypeKey = 'room' | 'apartment' | 'suite' | 'cabin' | 'studio' | 'villa';

export interface Room {
  id: string;
  propertyId: string;
  name: BilingualText;
  roomNumber: string;
  type: RoomTypeKey;
  capacity: number;
  bedrooms?: number;
  bathrooms?: number;
  basePrice: number;
  seasonalPrices?: { season: string; price: number }[];
  amenities: BilingualText[];
  images?: string[];
  status: 'available' | 'maintenance' | 'blocked' | 'reserved';
  lastCleaned?: Date;
  nextMaintenance?: Date;
  notes?: BilingualText;
  createdAt: Date;
  updatedAt: Date;
}

// Normalized Reservation model with translations
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
export type PaymentStatus = 'paid' | 'partially_paid' | 'pending' | 'overdue' | 'refunded';
export type CleaningStatus = 'clean' | 'dirty' | 'in_progress' | 'inspected' | 'ready';
export type ReservationSource = 'booking.com' | 'airbnb' | 'direct' | 'phone' | 'expedia' | 'vrbo' | 'other';

export interface Reservation {
  id: string;
  propertyId: string;
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
  specialRequests?: BilingualText;
  notes?: BilingualText;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  propertyId?: string;
  name: string;
  email: string;
  phone: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  totalBookings: number;
  totalSpent: number;
  isVIP: boolean;
  preferredLanguage?: Language;
  preferences?: BilingualText;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash' | 'check' | 'online' | 'crypto' | 'other';
export type PaymentType = 'deposit' | 'payment' | 'refund' | 'adjustment' | 'tax' | 'service_fee';

export interface Payment {
  id: string;
  reservationId: string;
  propertyId: string;
  guestId: string;
  method: PaymentMethod;
  type: PaymentType;
  amount: number;
  currency: string;
  reference?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'cleaning' | 'maintenance' | 'guest_request' | 'admin' | 'checkout' | 'checkin';

export interface Task {
  id: string;
  propertyId: string;
  roomId?: string;
  reservationId?: string;
  title: BilingualText;
  description?: BilingualText;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate: Date;
  completedAt?: Date;
  notes?: BilingualText;
  createdAt: Date;
  updatedAt: Date;
}

export type AlertLevel = 'info' | 'warning' | 'critical';
export type AlertType = 'low_occupancy' | 'pending_payment' | 'checkin_today' | 'checkout_today' | 'maintenance_needed' | 'guest_request';

export interface Alert {
  id: string;
  propertyId: string;
  type: AlertType;
  level: AlertLevel;
  title: BilingualText;
  message: BilingualText;
  relatedEntity?: { type: 'reservation' | 'room' | 'guest' | 'task'; id: string };
  isActive: boolean;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'manager' | 'reception' | 'housekeeping' | 'finance' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  propertyIds: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'property' | 'room' | 'reservation' | 'guest' | 'payment' | 'task' | 'user';
  entityId: string;
  changes?: Record<string, any>;
  timestamp: Date;
}

// Task management for operations workflow
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskType = 'check_in' | 'check_out' | 'cleaning' | 'maintenance' | 'payment' | 'inspection' | 'communication' | 'repair' | 'security';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Task {
  id: string;
  propertyId: string;
  reservationId?: string;
  roomId: string;
  type: TaskType;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string; // userId
  dueDate: Date;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment tracking with detailed ledger
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash' | 'check' | 'online' | 'crypto' | 'wallet';
export type PaymentEntryType = 'booking_deposit' | 'payment' | 'refund' | 'adjustment' | 'cancellation_fee' | 'tax' | 'service_fee';

export interface PaymentEntry {
  id: string;
  propertyId: string;
  reservationId: string;
  type: PaymentEntryType;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  invoiceNumber?: string;
  notes?: string;
  recordedBy?: string; // userId
  recordedAt: Date;
}

export interface PaymentLedger {
  reservationId: string;
  entries: PaymentEntry[];
  totalPaid: number;
  totalDue: number;
  saldo: number; // negative = owed, positive = overpaid
}

// Role-based access control
export type UserRole = 'owner' | 'manager' | 'reception' | 'housekeeping' | 'finance' | 'guest' | 'super_admin';

export interface User {
  id: string;
  propertyId?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Audit trail for accountability
export type AuditAction = 'create' | 'update' | 'delete' | 'assign' | 'complete' | 'cancel' | 'approve' | 'reject';
export type AuditEntity = 'reservation' | 'task' | 'payment' | 'room' | 'guest' | 'user' | 'property' | 'configuration';

export interface AuditLog {
  id: string;
  propertyId: string;
  entityType: AuditEntity;
  entityId: string;
  action: AuditAction;
  changes: Record<string, any>;
  performedBy: string; // userId
  performedAt: Date;
  ipAddress?: string;
}

// Dashboard metrics
export interface PropertyMetrics {
  propertyId: string;
  date: Date;
  occupancyRate: number;
  totalRevenue: number;
  averageNightlyRate: number;
  pendingPayments: number;
  arrivals: number;
  departures: number;
  checkInsPending: number;
  roomsNeedingCleaning: number;
  maintenanceIssues: number;
}

// Notification/Alert system
export type AlertLevel = 'info' | 'warning' | 'critical';
export type AlertType = 'low_occupancy' | 'pending_payment' | 'check_in_today' | 'check_out_today' | 'maintenance_needed' | 'housekeeping_needed' | 'vip_arrival';

export interface Alert {
  id: string;
  propertyId: string;
  type: AlertType;
  level: AlertLevel;
  title: string;
  message: string;
  relatedEntity?: { type: AuditEntity; id: string };
  isDismissed: boolean;
  createdAt: Date;
}

export interface DemoData {
  properties: Property[];
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  tasks: Task[];
  paymentEntries: PaymentEntry[];
  users: User[];
  auditLogs: AuditLog[];
}
