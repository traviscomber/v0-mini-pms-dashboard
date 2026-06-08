// Property/Installation model for multi-property management
export interface Property {
  id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  totalRooms: number;
  amenities: string[];
  maxGuests: number;
  timezone: string;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Normalized Reservation model for operations-first PMS
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type PaymentStatus = 'paid' | 'partially_paid' | 'pending' | 'overdue';
export type CleaningStatus = 'clean' | 'dirty' | 'in_progress' | 'inspected';
export type ReservationSource = 'booking.com' | 'airbnb' | 'direct' | 'phone' | 'expedia' | 'vrbo';

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
  specialRequests?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  roomNumber: string;
  type: 'room' | 'apartment' | 'suite' | 'cabin' | 'studio' | 'villa';
  capacity: number;
  bedrooms?: number;
  bathrooms?: number;
  basePrice: number;
  seasonalPrices?: { season: string; price: number }[];
  amenities: string[];
  images?: string[];
  status: 'available' | 'maintenance' | 'blocked' | 'reserved';
  lastCleaned?: Date;
  nextMaintenance?: Date;
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
  totalSpent?: number;
  notes?: string;
  isVIP?: boolean;
  createdAt: Date;
  updatedAt: Date;
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
