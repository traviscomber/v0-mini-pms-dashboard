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

// Task management for operations workflow
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskType = 'check_in' | 'check_out' | 'cleaning' | 'maintenance' | 'payment' | 'inspection' | 'communication';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Task {
  id: string;
  reservationId: string;
  roomId: string;
  type: TaskType;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string; // userId
  dueDate: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment tracking with detailed ledger
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash' | 'check' | 'online';
export type PaymentEntryType = 'booking_deposit' | 'payment' | 'refund' | 'adjustment' | 'cancellation_fee';

export interface PaymentEntry {
  id: string;
  reservationId: string;
  type: PaymentEntryType;
  amount: number;
  method: PaymentMethod;
  reference?: string;
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
export type UserRole = 'owner' | 'manager' | 'reception' | 'housekeeping' | 'finance' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Audit trail for accountability
export type AuditAction = 'create' | 'update' | 'delete' | 'assign' | 'complete' | 'cancel';
export type AuditEntity = 'reservation' | 'task' | 'payment' | 'room' | 'guest' | 'user';

export interface AuditLog {
  id: string;
  entityType: AuditEntity;
  entityId: string;
  action: AuditAction;
  changes: Record<string, any>;
  performedBy: string; // userId
  performedAt: Date;
  ipAddress?: string;
}

export interface DemoData {
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  tasks: Task[];
  paymentEntries: PaymentEntry[];
  users: User[];
  auditLogs: AuditLog[];
}
