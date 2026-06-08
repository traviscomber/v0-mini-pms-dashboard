import { Reservation, Room, Guest, DemoData, Task, User, PaymentEntry, Property, PropertyMetrics } from './types';

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

// PROPERTIES/INSTALLATIONS
const properties: Property[] = [
  {
    id: 'prop-001',
    name: 'Beachfront Resort',
    description: 'Luxury beachfront resort with ocean views',
    location: {
      address: '123 Ocean Drive',
      city: 'Cancun',
      country: 'Mexico',
      zipCode: '77500',
      coordinates: { lat: 21.1619, lng: -86.8515 }
    },
    totalRooms: 50,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access', 'Spa'],
    maxGuests: 150,
    timezone: 'America/Chicago',
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-01')
  },
  {
    id: 'prop-002',
    name: 'Mountain Lodge',
    description: 'Rustic mountain lodge with hiking trails',
    location: {
      address: '456 Alpine Road',
      city: 'Aspen',
      country: 'USA',
      zipCode: '81611',
      coordinates: { lat: 39.1911, lng: -106.8175 }
    },
    totalRooms: 20,
    amenities: ['WiFi', 'Fireplace', 'Bar', 'Hiking Trails', 'Hot Tub'],
    maxGuests: 60,
    timezone: 'America/Denver',
    currency: 'USD',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-01')
  }
];

// ROOMS
const rooms: Room[] = [
  // Beachfront Resort rooms
  { id: 'room-001', propertyId: 'prop-001', name: 'Ocean View Suite', roomNumber: '101', type: 'suite', capacity: 2, bedrooms: 1, bathrooms: 1, basePrice: 150, amenities: ['Ocean View', 'Balcony', 'Jacuzzi'], status: 'available', createdAt: today, updatedAt: today },
  { id: 'room-002', propertyId: 'prop-001', name: 'Garden Room', roomNumber: '102', type: 'room', capacity: 2, bedrooms: 1, bathrooms: 1, basePrice: 120, amenities: ['Garden View', 'AC'], status: 'available', createdAt: today, updatedAt: today },
  { id: 'room-003', propertyId: 'prop-001', name: 'Family Apartment', roomNumber: '201', type: 'apartment', capacity: 4, bedrooms: 2, bathrooms: 2, basePrice: 200, amenities: ['Kitchen', 'Living Area'], status: 'available', createdAt: today, updatedAt: today },
  { id: 'room-004', propertyId: 'prop-001', name: 'Beachfront Villa', roomNumber: '301', type: 'villa', capacity: 6, bedrooms: 3, bathrooms: 3, basePrice: 400, amenities: ['Private Beach', 'Pool', 'Full Kitchen'], status: 'available', createdAt: today, updatedAt: today },
  { id: 'room-005', propertyId: 'prop-001', name: 'Penthouse', roomNumber: '501', type: 'suite', capacity: 3, bedrooms: 2, bathrooms: 2, basePrice: 250, amenities: ['Rooftop View', 'Sauna'], status: 'available', createdAt: today, updatedAt: today },
  // Mountain Lodge rooms
  { id: 'room-101', propertyId: 'prop-002', name: 'Cabin Room', roomNumber: '101', type: 'cabin', capacity: 2, bedrooms: 1, bathrooms: 1, basePrice: 100, amenities: ['Fireplace', 'Mountain View'], status: 'available', createdAt: today, updatedAt: today },
  { id: 'room-102', propertyId: 'prop-002', name: 'Studio', roomNumber: '102', type: 'studio', capacity: 2, bedrooms: 0, bathrooms: 1, basePrice: 80, amenities: ['Kitchenette'], status: 'available', createdAt: today, updatedAt: today },
];

// GUESTS
const guests: Guest[] = [
  { id: 'guest-001', propertyId: 'prop-001', name: 'John Smith', email: 'john@example.com', phone: '+1-555-0101', nationality: 'USA', totalBookings: 5, totalSpent: 3500, createdAt: today, updatedAt: today },
  { id: 'guest-002', propertyId: 'prop-001', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0102', nationality: 'Canada', totalBookings: 2, totalSpent: 1200, createdAt: today, updatedAt: today },
  { id: 'guest-003', propertyId: 'prop-002', name: 'Michael Chen', email: 'michael@example.com', phone: '+1-555-0103', nationality: 'China', totalBookings: 1, totalSpent: 800, createdAt: today, updatedAt: today },
  { id: 'guest-004', propertyId: 'prop-001', name: 'Emma Wilson', email: 'emma@example.com', phone: '+1-555-0104', nationality: 'UK', totalBookings: 3, totalSpent: 2100, isVIP: true, createdAt: today, updatedAt: today },
  { id: 'guest-005', propertyId: 'prop-002', name: 'David Brown', email: 'david@example.com', phone: '+1-555-0105', nationality: 'USA', totalBookings: 1, totalSpent: 600, createdAt: today, updatedAt: today },
];

// RESERVATIONS
const reservations: Reservation[] = [
  {
    id: 'res-001',
    propertyId: 'prop-001',
    roomId: 'room-001',
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
    propertyId: 'prop-001',
    roomId: 'room-002',
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
    propertyId: 'prop-001',
    roomId: 'room-003',
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
    propertyId: 'prop-002',
    roomId: 'room-101',
    guestId: 'guest-005',
    guestName: 'David Brown',
    guestEmail: 'david@example.com',
    guestPhone: '+1-555-0105',
    checkInDate: tomorrow,
    checkOutDate: in5Days,
    source: 'vrbo',
    reservationStatus: 'confirmed',
    paymentStatus: 'paid',
    cleaningStatus: 'clean',
    totalAmount: 400,
    paidAmount: 400,
    balanceDue: 0,
    numberOfGuests: 2,
    createdAt: today,
    updatedAt: today,
  },
];

// PAYMENT ENTRIES
const paymentEntries: PaymentEntry[] = [
  { id: 'pay-001', propertyId: 'prop-001', reservationId: 'res-001', type: 'booking_deposit', amount: 225, method: 'credit_card', reference: 'DEPOSIT001', recordedAt: new Date(today.getTime() - 259200000) },
  { id: 'pay-002', propertyId: 'prop-001', reservationId: 'res-001', type: 'payment', amount: 225, method: 'credit_card', reference: 'PAY001', recordedAt: today },
  { id: 'pay-003', propertyId: 'prop-001', reservationId: 'res-002', type: 'booking_deposit', amount: 300, method: 'online', reference: 'DEPOSIT002', recordedAt: new Date(today.getTime() - 172800000) },
  { id: 'pay-004', propertyId: 'prop-002', reservationId: 'res-004', type: 'payment', amount: 400, method: 'bank_transfer', reference: 'TRANSFER001', recordedAt: new Date(today.getTime() - 86400000) },
];

// TASKS
const tasks: Task[] = [
  { id: 'task-001', propertyId: 'prop-001', reservationId: 'res-001', roomId: 'room-001', type: 'check_in', title: 'Check-in John Smith', status: 'completed', priority: 'normal', dueDate: today, completedAt: today, createdAt: today, updatedAt: today },
  { id: 'task-002', propertyId: 'prop-001', reservationId: 'res-002', roomId: 'room-002', type: 'check_in', title: 'Check-in Sarah Johnson', status: 'pending', priority: 'high', dueDate: tomorrow, createdAt: today, updatedAt: today },
  { id: 'task-003', propertyId: 'prop-001', roomId: 'room-002', type: 'cleaning', title: 'Clean Room 102', status: 'in_progress', priority: 'normal', dueDate: tomorrow, createdAt: today, updatedAt: today },
  { id: 'task-004', propertyId: 'prop-002', roomId: 'room-102', type: 'maintenance', title: 'Fix heating system', status: 'pending', priority: 'urgent', dueDate: today, createdAt: today, updatedAt: today },
];

// USERS
const users: User[] = [
  { id: 'user-001', propertyId: 'prop-001', name: 'Manager 1', email: 'manager1@hotel.com', phone: '+1-555-1001', role: 'manager', isActive: true, createdAt: today, updatedAt: today },
  { id: 'user-002', propertyId: 'prop-001', name: 'Reception 1', email: 'reception1@hotel.com', phone: '+1-555-1002', role: 'reception', isActive: true, createdAt: today, updatedAt: today },
  { id: 'user-003', propertyId: 'prop-002', name: 'Housekeeping 1', email: 'house1@hotel.com', phone: '+1-555-1003', role: 'housekeeping', isActive: true, createdAt: today, updatedAt: today },
];

export const demoData: DemoData = {
  properties,
  rooms,
  reservations,
  guests,
  tasks,
  paymentEntries,
  users,
  auditLogs: [],
};
