import { Reservation, Room, Guest, DemoData, Task, User, PaymentEntry } from './types';
import { generateTasksFromReservation } from './lib/task-utils';

const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const in3Days = new Date(today);
in3Days.setDate(in3Days.getDate() + 3);

const in5Days = new Date(today);
in5Days.setDate(in5Days.getDate() + 5);

const in7Days = new Date(today);
in7Days.setDate(in7Days.getDate() + 7);

const in10Days = new Date(today);
in10Days.setDate(in10Days.getDate() + 10);

export const demoData: DemoData = {
  rooms: [
    { id: 'room-101', name: 'Ocean View Suite', type: 'suite', capacity: 2, basePrice: 150, status: 'available' },
    { id: 'room-102', name: 'Garden Room', type: 'room', capacity: 2, basePrice: 120, status: 'available' },
    { id: 'room-103', name: 'Family Apartment', type: 'apartment', capacity: 4, basePrice: 200, status: 'available' },
    { id: 'room-104', name: 'Cabin', type: 'cabin', capacity: 2, basePrice: 100, status: 'available' },
    { id: 'room-105', name: 'Penthouse', type: 'suite', capacity: 3, basePrice: 250, status: 'available' },
  ],
  reservations: [
    {
      id: 'res-001',
      roomId: 'room-101',
      guestId: 'guest-001',
      guestName: 'John Smith',
      guestEmail: 'john@example.com',
      guestPhone: '+1-555-0101',
      checkInDate: today,
      checkOutDate: in3Days,
      source: 'booking.com',
      reservationStatus: 'confirmed',
      paymentStatus: 'paid',
      cleaningStatus: 'clean',
      totalAmount: 450,
      paidAmount: 450,
      balanceDue: 0,
      numberOfGuests: 2,
      specialRequests: 'Late checkout if possible',
      createdAt: new Date(today.getTime() - 86400000),
      updatedAt: new Date(today.getTime() - 3600000),
    },
    {
      id: 'res-002',
      roomId: 'room-102',
      guestId: 'guest-002',
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah@example.com',
      guestPhone: '+1-555-0102',
      checkInDate: tomorrow,
      checkOutDate: in5Days,
      source: 'airbnb',
      reservationStatus: 'confirmed',
      paymentStatus: 'partially_paid',
      cleaningStatus: 'clean',
      totalAmount: 480,
      paidAmount: 300,
      balanceDue: 180,
      numberOfGuests: 2,
      notes: 'First time guest',
      createdAt: new Date(today.getTime() - 172800000),
      updatedAt: new Date(today.getTime() - 7200000),
    },
    {
      id: 'res-003',
      roomId: 'room-103',
      guestId: 'guest-003',
      guestName: 'Michael Chen',
      guestEmail: 'michael@example.com',
      guestPhone: '+1-555-0103',
      checkInDate: in3Days,
      checkOutDate: in7Days,
      source: 'direct',
      reservationStatus: 'pending',
      paymentStatus: 'pending',
      cleaningStatus: 'clean',
      totalAmount: 800,
      paidAmount: 0,
      balanceDue: 800,
      numberOfGuests: 4,
      specialRequests: 'High chair for baby',
      createdAt: new Date(today.getTime() - 259200000),
      updatedAt: new Date(today.getTime() - 86400000),
    },
    {
      id: 'res-004',
      roomId: 'room-104',
      guestId: 'guest-004',
      guestName: 'Emma Wilson',
      guestEmail: 'emma@example.com',
      guestPhone: '+1-555-0104',
      checkInDate: in10Days,
      checkOutDate: new Date(in10Days.getTime() + 86400000),
      source: 'booking.com',
      reservationStatus: 'confirmed',
      paymentStatus: 'paid',
      cleaningStatus: 'clean',
      totalAmount: 100,
      paidAmount: 100,
      balanceDue: 0,
      numberOfGuests: 2,
      createdAt: new Date(today.getTime() - 345600000),
      updatedAt: new Date(today.getTime() - 172800000),
    },
  ],
  guests: [
    { id: 'guest-001', name: 'John Smith', email: 'john@example.com', phone: '+1-555-0101', totalBookings: 5, notes: 'VIP guest' },
    { id: 'guest-002', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0102', totalBookings: 1 },
    { id: 'guest-003', name: 'Michael Chen', email: 'michael@example.com', phone: '+1-555-0103', totalBookings: 2 },
    { id: 'guest-004', name: 'Emma Wilson', email: 'emma@example.com', phone: '+1-555-0104', totalBookings: 3 },
  ],
  users: [
    { id: 'user-001', name: 'Admin User', email: 'admin@property.com', role: 'owner', isActive: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    { id: 'user-002', name: 'Manager', email: 'manager@property.com', role: 'manager', isActive: true, createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
    { id: 'user-003', name: 'Front Desk', email: 'reception@property.com', role: 'reception', isActive: true, createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10') },
    { id: 'user-004', name: 'Housekeeping Lead', email: 'hk@property.com', role: 'housekeeping', isActive: true, createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15') },
    { id: 'user-005', name: 'Finance Officer', email: 'finance@property.com', role: 'finance', isActive: true, createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-20') },
  ],
  tasks: [
    // Tasks auto-generated from res-001 (John Smith)
    ...generateTasksFromReservation({
      id: 'res-001',
      roomId: 'room-101',
      guestId: 'guest-001',
      guestName: 'John Smith',
      guestEmail: 'john@example.com',
      guestPhone: '+1-555-0101',
      checkInDate: today,
      checkOutDate: in3Days,
      source: 'booking.com',
      reservationStatus: 'confirmed',
      paymentStatus: 'paid',
      cleaningStatus: 'clean',
      totalAmount: 450,
      paidAmount: 450,
      balanceDue: 0,
      numberOfGuests: 2,
      specialRequests: 'Late checkout if possible',
      createdAt: new Date(today.getTime() - 86400000),
      updatedAt: new Date(today.getTime() - 3600000),
    }),
    // Tasks auto-generated from res-002 (Sarah Johnson)
    ...generateTasksFromReservation({
      id: 'res-002',
      roomId: 'room-102',
      guestId: 'guest-002',
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah@example.com',
      guestPhone: '+1-555-0102',
      checkInDate: tomorrow,
      checkOutDate: in5Days,
      source: 'airbnb',
      reservationStatus: 'confirmed',
      paymentStatus: 'partially_paid',
      cleaningStatus: 'clean',
      totalAmount: 480,
      paidAmount: 300,
      balanceDue: 180,
      numberOfGuests: 2,
      notes: 'First time guest',
      createdAt: new Date(today.getTime() - 172800000),
      updatedAt: new Date(today.getTime() - 7200000),
    }),
  ],
  paymentEntries: [
    { id: 'pay-001', reservationId: 'res-001', type: 'booking_deposit', amount: 450, method: 'credit_card', reference: 'CC-12345', recordedBy: 'user-003', recordedAt: new Date(today.getTime() - 86400000) },
    { id: 'pay-002', reservationId: 'res-002', type: 'booking_deposit', amount: 300, method: 'online', reference: 'AIRBNB-789', recordedBy: 'user-003', recordedAt: new Date(today.getTime() - 172800000) },
    { id: 'pay-003', reservationId: 'res-004', type: 'payment', amount: 100, method: 'credit_card', reference: 'CC-67890', recordedBy: 'user-005', recordedAt: new Date(today.getTime() - 345600000) },
  ],
  auditLogs: [
    { id: 'audit-001', entityType: 'reservation', entityId: 'res-001', action: 'create', changes: { status: 'pending -> confirmed' }, performedBy: 'user-002', performedAt: new Date(today.getTime() - 86400000) },
    { id: 'audit-002', entityType: 'task', entityId: 'task-res-001-checkin', action: 'create', changes: { status: 'created' }, performedBy: 'system', performedAt: new Date(today.getTime() - 86400000) },
    { id: 'audit-003', entityType: 'payment', entityId: 'pay-001', action: 'create', changes: { amount: 450 }, performedBy: 'user-003', performedAt: new Date(today.getTime() - 86400000) },
  ],
};
