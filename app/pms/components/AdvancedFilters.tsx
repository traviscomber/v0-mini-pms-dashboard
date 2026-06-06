'use client';

import { Filter, X } from 'lucide-react';
import { memo, useState, useCallback } from 'react';

interface FiltersProps {
  rooms: any[];
  reservations: any[];
  onFilter: (filtered: any[]) => void;
}

interface FilterState {
  dateRange: { start: string; end: string };
  roomType: string;
  paymentStatus: string;
  bookingStatus: string;
}

const INITIAL_FILTERS: FilterState = {
  dateRange: { start: '', end: '' },
  roomType: 'all',
  paymentStatus: 'all',
  bookingStatus: 'all',
};

const AdvancedFilters = memo(({ rooms, reservations, onFilter }: FiltersProps) => {
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('pms-filters') : null;
    return saved ? JSON.parse(saved) : INITIAL_FILTERS;
  });
  
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = [...reservations];

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(res => new Date(res.checkInDate) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(res => new Date(res.checkOutDate) <= new Date(filters.dateRange.end));
    }

    // Room type filter
    if (filters.roomType !== 'all') {
      filtered = filtered.filter(res => {
        const room = rooms.find(r => r.id === res.roomId);
        return room?.type === filters.roomType;
      });
    }

    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(res => res.paymentStatus === filters.paymentStatus);
    }

    // Booking status filter
    if (filters.bookingStatus !== 'all') {
      filtered = filtered.filter(res => res.status === filters.bookingStatus);
    }

    // Save filters to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('pms-filters', JSON.stringify(filters));
    }

    onFilter(filtered);
  }, [filters, reservations, rooms, onFilter]);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    localStorage.removeItem('pms-filters');
    onFilter(reservations);
  }, [reservations, onFilter]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  }, [filters]);

  const handleDateRangeChange = useCallback((field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value },
    }));
  }, []);

  const roomTypes = Array.from(new Set(rooms.map(r => r.type)));

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary hover:bg-primary/20 transition-colors"
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <Filter size={18} />
        Filters
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-card border border-border rounded-lg space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Check-in From</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Check-out To</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground"
              />
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm text-foreground/60 mb-2">Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground"
            >
              <option value="all">All Types</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm text-foreground/60 mb-2">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Booking Status */}
          <div>
            <label className="block text-sm text-foreground/60 mb-2">Booking Status</label>
            <select
              value={filters.bookingStatus}
              onChange={(e) => handleFilterChange('bookingStatus', e.target.value)}
              className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-foreground"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                applyFilters();
                setIsOpen(false);
              }}
              className="flex-1 px-4 py-2 bg-primary text-card-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-card/80 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

AdvancedFilters.displayName = 'AdvancedFilters';
export default AdvancedFilters;
