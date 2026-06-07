import { Reservation } from '@/lib/types';

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
  reservations: Reservation[],
  filters: FilterOptions
): Reservation[] {
  return reservations.filter(reservation => {
    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const checkIn = new Date(reservation.check_in_date);
      const checkOut = new Date(reservation.check_out_date);
      const filterStart = new Date(filters.dateRange.start);
      const filterEnd = new Date(filters.dateRange.end);
      
      // Check if reservation overlaps with filter range
      if (checkOut < filterStart || checkIn > filterEnd) {
        return false;
      }
    }

    // Payment status filter
    if (filters.paymentStatus.length > 0) {
      if (!filters.paymentStatus.includes(reservation.payment_status)) {
        return false;
      }
    }

    // Reservation status filter
    if (filters.reservationStatus.length > 0) {
      if (!filters.reservationStatus.includes(reservation.status)) {
        return false;
      }
    }

    // Room ID filter
    if (filters.roomIds.length > 0) {
      if (!filters.roomIds.includes(reservation.room_id)) {
        return false;
      }
    }

    // Search term filter (guest name, email, phone)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const guestName = reservation.guest_name?.toLowerCase() || '';
      const guestEmail = reservation.guest_email?.toLowerCase() || '';
      const guestPhone = reservation.guest_phone?.toLowerCase() || '';
      
      if (!guestName.includes(searchLower) && 
          !guestEmail.includes(searchLower) && 
          !guestPhone.includes(searchLower)) {
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
