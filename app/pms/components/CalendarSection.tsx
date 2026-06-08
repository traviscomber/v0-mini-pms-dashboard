'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Lock, AlertCircle } from 'lucide-react';
import { useLanguageStore as useLanguage } from '../store/languageStore';

interface CalendarProps {
  rooms: any[];
  reservations: any[];
}

export default function CalendarSection({ rooms, reservations }: CalendarProps) {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthDays = useMemo(() => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  }, [currentDate]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDateStatus = (day: number, roomId: string) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const booking = reservations.find(r => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return checkIn <= date && date < checkOut && r.roomId === roomId;
    });

    if (booking) {
      return { status: 'booked', label: 'Booked', color: 'bg-red-500/20 border-red-500 text-red-700' };
    }
    return { status: 'available', label: 'Available', color: 'bg-green-500/20 border-green-500 text-green-700' };
  };

  const goToPrevious = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('calendarSection.monthView') || 'Calendar'}
            </h2>
            <p className="text-sm text-foreground/60">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex gap-2 bg-background rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded transition ${
                  viewMode === 'month'
                    ? 'bg-primary text-black font-medium'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded transition ${
                  viewMode === 'list'
                    ? 'bg-primary text-black font-medium'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                List
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <button
                onClick={goToPrevious}
                className="p-2 hover:bg-background rounded-lg transition border border-border"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="p-2 hover:bg-background rounded-lg transition border border-border"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Room Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('propertySection.roomName') || 'Select Room'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedRoomId === room.id
                    ? 'bg-primary text-black border-primary font-medium'
                    : 'bg-background border-border text-foreground hover:border-primary'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/30 border border-green-500 rounded"></div>
            <span className="text-foreground/70">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/30 border border-red-500 rounded"></div>
            <span className="text-foreground/70">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-card/500/30 border border-gray-500 rounded"></div>
            <span className="text-foreground/70">Blocked</span>
          </div>
        </div>
      </div>

      {/* Month View */}
      {viewMode === 'month' && selectedRoom && (
        <div className="bg-card border border-border rounded-lg p-6">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-sm text-foreground/60">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day, index) => {
              const dateStatus = day ? getDateStatus(day, selectedRoomId) : null;
              const isToday = day === new Date().getDate() && 
                             currentDate.getMonth() === new Date().getMonth() &&
                             currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg border p-1 text-xs cursor-pointer transition hover:shadow-md ${
                    !day
                      ? 'bg-background border-transparent'
                      : dateStatus?.color || 'bg-background border-border'
                  } ${isToday ? 'ring-2 ring-accent' : ''}`}
                >
                  {day && (
                    <>
                      <span className="font-bold">{day}</span>
                      <span className="text-xs mt-1 opacity-70">
                        {dateStatus?.status === 'booked' ? 'Booked' : 'Free'}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Room Pricing Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('calendarSection.rateManager') || 'Manage Rates'} - {selectedRoom.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('propertySection.price') || 'Base Price'} (${selectedRoom.basePrice}/night)
                </label>
                <input
                  type="number"
                  defaultValue={selectedRoom.basePrice}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary outline-none"
                />
              </div>
              <div className="bg-background rounded-lg p-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('calendarSection.setRates') || 'Seasonal Adjustment'} (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 20 for 20% increase"
                  defaultValue="0"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>
            <button className="mt-4 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium transition">
              {t('propertySection.saveChanges') || 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && selectedRoom && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {selectedRoom.name} - {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {monthDays.map((day, index) => {
              if (!day) return null;
              const dateStatus = getDateStatus(day, selectedRoomId);
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const booking = reservations.find(r => {
                const checkIn = new Date(r.checkIn);
                const checkOut = new Date(r.checkOut);
                return checkIn <= date && date < checkOut && r.roomId === selectedRoomId;
              });

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${dateStatus.color}`}
                >
                  <div>
                    <p className="font-medium text-sm">
                      {date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    {booking && <p className="text-xs mt-1">{booking.guestName}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">${selectedRoom.basePrice}</span>
                    <span className="text-xs bg-background px-2 py-1 rounded">
                      {dateStatus.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
