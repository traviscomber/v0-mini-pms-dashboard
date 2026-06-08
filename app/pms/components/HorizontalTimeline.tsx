'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Reservation, Room } from '../types';
import { getReservationsForDate, hasConflict } from '../utils/conflict-detector';
import { useLanguageStore as useLanguage } from '../store/languageStore';

interface HorizontalTimelineProps {
  rooms: Room[];
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
  onQuickBook: (roomId: string, checkInDate: Date, checkOutDate: Date) => void;
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function HorizontalTimeline({
  rooms,
  reservations,
  onSelectReservation,
  onQuickBook,
}: HorizontalTimelineProps) {
  const [startDate, setStartDate] = useState(new Date());
  const [visibleDays] = useState(14);
  const { t } = useLanguage();

  const dateRange = useMemo(() => {
    const dates: Date[] = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    for (let i = 0; i < visibleDays; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [startDate, visibleDays]);

  const previousWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(newDate);
  };

  const goToToday = () => {
    setStartDate(new Date());
  };

  const getStatusColor = (reservation: Reservation) => {
    if (reservation.reservationStatus === 'cancelled') return 'bg-gray-300';
    
    switch (reservation.paymentStatus) {
      case 'paid':
        return 'bg-green-500';
      case 'partially_paid':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-blue-500';
      case 'overdue':
        return 'bg-red-600';
      default:
        return 'bg-blue-400';
    }
  };

  const getReservationPosition = (reservation: Reservation, dateRange: Date[]) => {
    const checkIn = new Date(reservation.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    const checkOut = new Date(reservation.checkOutDate);
    checkOut.setHours(0, 0, 0, 0);

    const startIndex = dateRange.findIndex(d => d.getTime() === checkIn.getTime());
    if (startIndex === -1) {
      const afterStart = dateRange[0].getTime() >= checkIn.getTime();
      const beforeEnd = checkOut.getTime() > dateRange[0].getTime();
      if (afterStart && beforeEnd) {
        const endIndex = Math.min(
          dateRange.findIndex(d => d.getTime() >= checkOut.getTime()),
          dateRange.length - 1
        );
        return { startIndex: 0, endIndex };
      }
      return null;
    }

    const endIndex = Math.min(
      dateRange.findIndex(d => d.getTime() >= checkOut.getTime()),
      dateRange.length - 1
    );

    return { startIndex, endIndex };
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-card border border-border rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={previousWeek}
            className="p-2 hover:bg-background rounded-lg transition"
            title="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-background rounded-lg transition"
            title="Next week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-2 bg-primary text-black text-sm rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Today
          </button>
        </div>
        <div className="text-sm text-foreground/60">
          {dateRange[0].toLocaleDateString()} - {dateRange[dateRange.length - 1].toLocaleDateString()}
        </div>
      </div>

      {/* Timeline Table */}
      <div className="overflow-x-auto bg-card border border-border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 w-40 px-4 py-3 bg-background text-left font-semibold text-foreground border-r border-border">
                Room
              </th>
              {dateRange.map((date, idx) => (
                <th
                  key={idx}
                  className="w-32 px-2 py-3 text-center font-semibold text-foreground bg-background border-r border-border"
                >
                  <div className="text-xs text-foreground/60">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</div>
                  <div>{date.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-border hover:bg-background/50">
                <td className="sticky left-0 w-40 px-4 py-4 bg-card font-medium text-foreground border-r border-border z-10">
                  <div className="truncate">{room.name}</div>
                  <div className="text-xs text-foreground/60">{room.capacity} guests</div>
                </td>
                {dateRange.map((date, dayIdx) => {
                  const dayReservations = reservations.filter(
                    (res) =>
                      res.roomId === room.id &&
                      new Date(res.checkInDate).setHours(0, 0, 0, 0) <= date.getTime() &&
                      new Date(res.checkOutDate).setHours(0, 0, 0, 0) > date.getTime() &&
                      res.reservationStatus !== 'cancelled'
                  );

                  return (
                    <td key={`${room.id}-${dayIdx}`} className="w-32 px-2 py-4 border-r border-border relative">
                      {dayReservations.length > 0 ? (
                        dayReservations.map((res) => {
                          const position = getReservationPosition(res, dateRange);
                          if (!position || dayIdx < position.startIndex || dayIdx > position.endIndex) return null;

                          const isFirst = dayIdx === position.startIndex;
                          return (
                            <button
                              key={res.id}
                              onClick={() => onSelectReservation(res)}
                              className={`
                                w-full px-2 py-1 rounded text-xs font-semibold text-white truncate
                                hover:opacity-90 transition cursor-pointer
                                ${getStatusColor(res)}
                                ${isFirst ? 'border-l-4 border-foreground/20' : ''}
                              `}
                              title={`${res.guestName}: ${res.checkInDate.toLocaleDateString()} - ${res.checkOutDate.toLocaleDateString()}`}
                            >
                              {isFirst ? res.guestName : ''}
                            </button>
                          );
                        })
                      ) : (
                        <button
                          onClick={() => {
                            const checkOut = new Date(date);
                            checkOut.setDate(checkOut.getDate() + 1);
                            onQuickBook(room.id, new Date(date), checkOut);
                          }}
                          className="w-full h-8 rounded border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition flex items-center justify-center text-foreground/30 hover:text-primary"
                          title="Quick book"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex gap-6 px-6 py-3 bg-background border border-border rounded-lg text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-foreground/60">Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-foreground/60">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-foreground/60">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span className="text-foreground/60">Overdue</span>
        </div>
      </div>
    </div>
  );
}
