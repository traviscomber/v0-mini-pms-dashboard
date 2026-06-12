type ReservationRecord = Record<string, any>;

export interface FilterOptions {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  paymentStatus: ('pending' | 'partial' | 'paid' | 'overdue')[];
  reservationStatus: ('confirmed' | 'pending' | 'checked_in' | 'checked_out' | 'cancelled')[];
  roomIds: string[];
  searchTerm: string;
}

export const defaultFilters: FilterOptions = {
  dateRange: { start: null, end: null },
  paymentStatus: [],
  reservationStatus: [],
  roomIds: [],
  searchTerm: '',
};

export function applyFilters(
  reservations: ReservationRecord[],
  filters: FilterOptions
): ReservationRecord[] {
  return reservations.filter(reservation => {
    const checkInValue = reservation.check_in_date ?? reservation.checkInDate ?? reservation.checkIn;
    const checkOutValue = reservation.check_out_date ?? reservation.checkOutDate ?? reservation.checkOut;
    const paymentStatus = reservation.payment_status ?? reservation.paymentStatus;
    const reservationStatus = reservation.status ?? reservation.reservationStatus;
    const roomId = reservation.room_id ?? reservation.roomId;
    const guestName = reservation.guest_name ?? reservation.guestName ?? '';
    const guestEmail = reservation.guest_email ?? reservation.guestEmail ?? '';
    const guestPhone = reservation.guest_phone ?? reservation.guestPhone ?? '';

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const checkIn = new Date(checkInValue);
      const checkOut = new Date(checkOutValue);
      const filterStart = new Date(filters.dateRange.start);
      const filterEnd = new Date(filters.dateRange.end);
      
      // Check if reservation overlaps with filter range
      if (checkOut < filterStart || checkIn > filterEnd) {
        return false;
      }
    }

    // Payment status filter
    if (filters.paymentStatus.length > 0) {
      if (!filters.paymentStatus.includes(paymentStatus)) {
        return false;
      }
    }

    // Reservation status filter
    if (filters.reservationStatus.length > 0) {
      if (!filters.reservationStatus.includes(reservationStatus)) {
        return false;
      }
    }

    // Room ID filter
    if (filters.roomIds.length > 0) {
      if (!filters.roomIds.includes(roomId)) {
        return false;
      }
    }

    // Search term filter (guest name, email, phone)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const normalizedGuestName = guestName.toLowerCase();
      const normalizedGuestEmail = guestEmail.toLowerCase();
      const normalizedGuestPhone = guestPhone.toLowerCase();
      
      if (!normalizedGuestName.includes(searchLower) && 
          !normalizedGuestEmail.includes(searchLower) && 
          !normalizedGuestPhone.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

export function getActiveFiltersCount(filters: FilterOptions): number {
  let count = 0;
  if (filters.dateRange.start || filters.dateRange.end) count++;
  if (filters.paymentStatus.length > 0) count++;
  if (filters.reservationStatus.length > 0) count++;
  if (filters.roomIds.length > 0) count++;
  if (filters.searchTerm) count++;
  return count;
}

export function saveFiltersToLocalStorage(filters: FilterOptions): void {
  const serialized = {
    ...filters,
    dateRange: {
      start: filters.dateRange.start?.toISOString() || null,
      end: filters.dateRange.end?.toISOString() || null,
    },
  };
  localStorage.setItem('pms-filters', JSON.stringify(serialized));
}

export function loadFiltersFromLocalStorage(): FilterOptions | null {
  const stored = localStorage.getItem('pms-filters');
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      dateRange: {
        start: parsed.dateRange.start ? new Date(parsed.dateRange.start) : null,
        end: parsed.dateRange.end ? new Date(parsed.dateRange.end) : null,
      },
    };
  } catch {
    return null;
  }
}
