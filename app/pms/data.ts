export const demoData = {
  rooms: [
    { id: 'r1', name: 'Ocean View Apartment', type: 'Apartment', capacity: 4, basePrice: 120 },
    { id: 'r2', name: 'Garden Studio', type: 'Studio', capacity: 2, basePrice: 85 },
    { id: 'r3', name: 'Family Cabin', type: 'Cabin', capacity: 6, basePrice: 160 },
    { id: 'r4', name: 'Glamping Tent', type: 'Glamping', capacity: 2, basePrice: 95 },
    { id: 'r5', name: 'Hostel Room A', type: 'Hostel', capacity: 8, basePrice: 45 },
  ],
  reservations: [
    { id: '1', roomId: 'r1', guestName: 'John Smith', guestEmail: 'john@example.com', guestPhone: '555-0001', checkIn: '2026-06-05', checkOut: '2026-06-08', adults: 2, children: 0, source: 'Airbnb', paymentStatus: 'Paid', cleaningStatus: 'Clean', notes: '', totalPrice: 360 },
    { id: '2', roomId: 'r2', guestName: 'Jane Doe', guestEmail: 'jane@example.com', guestPhone: '555-0002', checkIn: '2026-06-06', checkOut: '2026-06-09', adults: 1, children: 1, source: 'Direct', paymentStatus: 'Pending', cleaningStatus: 'Needs cleaning', notes: 'Early check-in requested', totalPrice: 255 },
    { id: '3', roomId: 'r3', guestName: 'Family Group', guestEmail: 'family@example.com', guestPhone: '555-0003', checkIn: '2026-06-07', checkOut: '2026-06-14', adults: 2, children: 3, source: 'Booking.com', paymentStatus: 'Paid', cleaningStatus: 'Clean', notes: '', totalPrice: 1120 },
    { id: '4', roomId: 'r4', guestName: 'Alice Brown', guestEmail: 'alice@example.com', guestPhone: '555-0004', checkIn: '2026-06-10', checkOut: '2026-06-12', adults: 2, children: 0, source: 'Website', paymentStatus: 'Partial', cleaningStatus: 'In progress', notes: 'Honeymoon', totalPrice: 190 },
    { id: '5', roomId: 'r5', guestName: 'Bob Wilson', guestEmail: 'bob@example.com', guestPhone: '555-0005', checkIn: '2026-06-08', checkOut: '2026-06-10', adults: 1, children: 0, source: 'Direct', paymentStatus: 'Pending', cleaningStatus: 'Clean', notes: '', totalPrice: 90 },
  ]
};
