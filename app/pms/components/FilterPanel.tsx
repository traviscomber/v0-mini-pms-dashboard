'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Room } from '@/lib/types';
import { FilterOptions, defaultFilters, getActiveFiltersCount } from '../lib/filter-utils';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  rooms: Room[];
}

export default function FilterPanel({ filters, onFilterChange, rooms }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeCount = getActiveFiltersCount(filters);

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value ? new Date(value) : null,
      },
    });
  };

  const handlePaymentStatusChange = (status: string) => {
    const current = filters.paymentStatus as string[];
    onFilterChange({
      ...filters,
      paymentStatus: current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status],
    });
  };

  const handleReservationStatusChange = (status: string) => {
    const current = filters.reservationStatus as string[];
    onFilterChange({
      ...filters,
      reservationStatus: current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status],
    });
  };

  const handleRoomChange = (roomId: string) => {
    onFilterChange({
      ...filters,
      roomIds: filters.roomIds.includes(roomId)
        ? filters.roomIds.filter(id => id !== roomId)
        : [...filters.roomIds, roomId],
    });
  };

  const handleSearchChange = (term: string) => {
    onFilterChange({
      ...filters,
      searchTerm: term,
    });
  };

  const handleClear = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-card/50 transition"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">Filters</h3>
          {activeCount > 0 && (
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
              {activeCount} active
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search Guest</label>
            <input
              type="text"
              placeholder="Name, email, or phone..."
              value={filters.searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <div className="flex gap-3">
              <input
                type="date"
                value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                onChange={e => handleDateChange('start', e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                onChange={e => handleDateChange('end', e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Payment Status</label>
            <div className="space-y-2">
              {['pending', 'partial', 'paid', 'overdue'].map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.paymentStatus as string[]).includes(status)}
                    onChange={() => handlePaymentStatusChange(status)}
                    className="w-4 h-4 rounded border-border bg-background"
                  />
                  <span className="text-sm capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reservation Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Reservation Status</label>
            <div className="space-y-2">
              {['confirmed', 'pending', 'checked_in', 'checked_out', 'cancelled'].map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.reservationStatus as string[]).includes(status)}
                    onChange={() => handleReservationStatusChange(status)}
                    className="w-4 h-4 rounded border-border bg-background"
                  />
                  <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Rooms</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {rooms.map(room => (
                <label key={room.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roomIds.includes(room.id)}
                    onChange={() => handleRoomChange(room.id)}
                    className="w-4 h-4 rounded border-border bg-background"
                  />
                  <span className="text-sm">{room.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeCount > 0 && (
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
