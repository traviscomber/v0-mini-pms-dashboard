'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Reservation, Room } from '../types';
import { useLanguage as useLanguage } from '../LanguageContext';

interface HorizontalTimelineProps {
  rooms: Room[];
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
  onQuickBook: (roomId: string, checkInDate: Date, checkOutDate: Date) => void;
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// 8 distinct gem-palette colors for per-guest identification (booking.com style)
const GUEST_COLORS = [
  { bg: 'oklch(0.58 0.27 320)', label: 'Magenta'  },  // iridescent magenta
  { bg: 'oklch(0.52 0.24 270)', label: 'Sapphire'  },  // deep sapphire
  { bg: 'oklch(0.54 0.22 195)', label: 'Jade'      },  // teal jade
  { bg: 'oklch(0.55 0.26 25)',  label: 'Ruby'      },  // coral ruby
  { bg: 'oklch(0.57 0.22 145)', label: 'Emerald'   },  // emerald
  { bg: 'oklch(0.56 0.25 290)', label: 'Amethyst'  },  // violet amethyst
  { bg: 'oklch(0.60 0.23 60)',  label: 'Topaz'     },  // amber topaz
  { bg: 'oklch(0.54 0.24 350)', label: 'Garnet'    },  // crimson garnet
];

// Deterministic color index from reservation id — same guest always same color
function guestColorIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % GUEST_COLORS.length;
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
    const d = new Date(startDate);
    d.setDate(d.getDate() - 7);
    setStartDate(d);
  };

  const nextWeek = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 7);
    setStartDate(d);
  };

  const goToToday = () => setStartDate(new Date());

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

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
            className="px-3 py-2 bg-primary text-foreground text-sm rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Today
          </button>
        </div>
        <div className="text-sm text-foreground/60">
          {dateRange[0].toLocaleDateString()} – {dateRange[dateRange.length - 1].toLocaleDateString()}
        </div>
      </div>

      {/* Timeline Table */}
      <div className="overflow-x-auto bg-card border border-border rounded-lg">
        <table className="w-full border-collapse text-sm" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '10rem' }} />
            {dateRange.map((_, i) => <col key={i} style={{ width: '7rem' }} />)}
          </colgroup>
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 px-4 py-3 bg-background text-left font-semibold text-foreground border-r border-border z-20">
                Room
              </th>
              {dateRange.map((date, idx) => {
                const isToday = date.getTime() === today.getTime();
                return (
                  <th
                    key={idx}
                    className={`px-2 py-3 text-center font-medium border-r border-border ${isToday ? 'bg-primary/15' : 'bg-background'}`}
                  >
                    <div className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-foreground/50'}`}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                    </div>
                    <div className={`text-sm ${isToday ? 'text-primary font-bold' : 'text-foreground'}`}>
                      {date.getDate()}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={dateRange.length + 1} className="px-4 py-12 text-center text-foreground/40">
                  No rooms found. Add a property and rooms to get started.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="border-b border-border last:border-0 hover:bg-background/40 transition">
                  <td className="sticky left-0 px-4 py-3 bg-card font-medium text-foreground border-r border-border z-10">
                    <div className="truncate text-sm">{room.name}</div>
                    <div className="text-xs text-foreground/50">{room.capacity} guests</div>
                  </td>
                  {dateRange.map((date, dayIdx) => {
                    const isToday = date.getTime() === today.getTime();

                    // Find a reservation covering this cell
                    const res = reservations.find(
                      (r) =>
                        r.roomId === room.id &&
                        r.reservationStatus !== 'cancelled' &&
                        new Date(r.checkInDate).setHours(0, 0, 0, 0) <= date.getTime() &&
                        new Date(r.checkOutDate).setHours(0, 0, 0, 0) > date.getTime()
                    );

                    if (res) {
                      const checkIn = new Date(res.checkInDate);
                      checkIn.setHours(0, 0, 0, 0);
                      const isFirst = checkIn.getTime() === date.getTime();
                      const color = GUEST_COLORS[guestColorIndex(res.id)];

                      // Status indicator stripe on the bottom
                      const statusStripe = res.paymentStatus === 'overdue'
                        ? 'oklch(0.58 0.28 350)'
                        : res.paymentStatus === 'paid'
                        ? 'oklch(0.57 0.22 145)'
                        : 'transparent';

                      return (
                        <td
                          key={`${room.id}-${dayIdx}`}
                          className={`px-0 py-1 border-r border-border relative ${isToday ? 'bg-primary/8' : ''}`}
                          style={{ padding: '4px 2px' }}
                        >
                          <button
                            onClick={() => onSelectReservation(res)}
                            title={`${res.guestName} · ${new Date(res.checkInDate).toLocaleDateString()} → ${new Date(res.checkOutDate).toLocaleDateString()} · ${res.paymentStatus}`}
                            style={{
                              width: '100%',
                              minHeight: '2.25rem',
                              backgroundColor: color.bg,
                              borderLeft: isFirst ? `3px solid oklch(1 0 0 / 30%)` : 'none',
                              borderTop: `2px solid oklch(1 0 0 / 12%)`,
                              borderBottom: `2px solid ${statusStripe}`,
                              borderRight: 'none',
                              borderRadius: isFirst ? '4px 0 0 4px' : '0',
                              display: 'flex',
                              alignItems: 'center',
                              paddingLeft: isFirst ? '8px' : '4px',
                              paddingRight: '4px',
                              cursor: 'pointer',
                              transition: 'filter 0.1s',
                              overflow: 'hidden',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.15)')}
                            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                          >
                            {isFirst && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  color: 'oklch(0.98 0 0)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100%',
                                  display: 'block',
                                }}
                              >
                                {res.guestName}
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={`${room.id}-${dayIdx}`}
                        className={`px-0 border-r border-border ${isToday ? 'bg-primary/8' : ''}`}
                        style={{ padding: '4px 2px' }}
                      >
                        <button
                          onClick={() => {
                            const checkOut = new Date(date);
                            checkOut.setDate(checkOut.getDate() + 1);
                            onQuickBook(room.id, new Date(date), checkOut);
                          }}
                          className="w-full flex items-center justify-center text-foreground/20 hover:text-primary hover:bg-primary/10 rounded transition"
                          style={{ minHeight: '2.25rem' }}
                          title="Quick book"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 py-3 bg-card border border-border rounded-lg text-xs">
        <span className="text-foreground/40 font-semibold uppercase tracking-wide self-center">Guest colors:</span>
        {GUEST_COLORS.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.bg }} />
            <span className="text-foreground/60">{c.label}</span>
          </div>
        ))}
        <div className="w-px bg-border self-stretch mx-1" />
        <span className="text-foreground/40 font-semibold uppercase tracking-wide self-center">Bottom stripe:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.57 0.22 145)' }} />
          <span className="text-foreground/60">Paid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.58 0.28 350)' }} />
          <span className="text-foreground/60">Overdue</span>
        </div>
      </div>
    </div>
  );
}

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
    if (reservation.reservationStatus === 'cancelled') return 'bg-card/60';
    
    switch (reservation.paymentStatus) {
      case 'paid':
        return 'bg-chart-2';
      case 'partially_paid':
        return 'bg-secondary500';
      case 'pending':
        return 'bg-primary';
      case 'overdue':
        return 'bg-destructive';
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
            className="px-3 py-2 bg-primary text-foreground text-sm rounded-lg hover:bg-primary/90 transition font-medium"
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
          <div className="w-4 h-4 bg-chart-2 rounded"></div>
          <span className="text-foreground/60">Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary500 rounded"></div>
          <span className="text-foreground/60">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span className="text-foreground/60">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-destructive rounded"></div>
          <span className="text-foreground/60">Overdue</span>
        </div>
      </div>
    </div>
  );
}
