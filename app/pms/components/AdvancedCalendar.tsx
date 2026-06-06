'use client';

import { memo, useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateCellProps {
  date: Date;
  isToday: boolean;
  isInRange: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPast: boolean;
  availability: number;
  isHovered: boolean;
  onClick: () => void;
  onHover: () => void;
  onHoverLeave: () => void;
}

// Individual date cell with availability
const DateCell = memo(({
  date,
  isToday,
  isInRange,
  isStart,
  isEnd,
  isPast,
  availability,
  isHovered,
  onClick,
  onHover,
  onHoverLeave,
}: DateCellProps) => {
  const dayNum = date.getDate();
  
  let bgClass = 'bg-card hover:bg-accent/10';
  if (isPast) bgClass = 'bg-foreground/5 text-foreground/40 cursor-not-allowed';
  if (isToday) bgClass = 'bg-primary/20 text-primary font-bold';
  if (isInRange && !isStart && !isEnd) bgClass = 'bg-primary/10';
  if (isStart || isEnd) bgClass = 'bg-primary text-background font-bold';
  if (isHovered && !isPast) bgClass = 'bg-accent/20';
  
  return (
    <button
      onClick={() => !isPast && onClick()}
      onMouseEnter={onHover}
      onMouseLeave={onHoverLeave}
      disabled={isPast}
      className={`p-2 rounded-lg text-sm font-medium transition-all ${bgClass} relative group`}
      aria-label={`${date.toLocaleDateString()}, ${availability} rooms available`}
    >
      <div>{dayNum}</div>
      {availability > 0 && !isPast && (
        <div className="text-xs text-foreground/60 group-hover:text-foreground/80 transition-colors">
          {availability} left
        </div>
      )}
      {isPast && <div className="text-xs text-foreground/40">Full</div>}
    </button>
  );
});

DateCell.displayName = 'DateCell';

interface CalendarMonthProps {
  month: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoveredDate: Date | null;
  availabilityMap: Map<string, number>;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
}

// Calendar month grid (7x6 grid for any month)
const CalendarMonth = memo(({
  month,
  startDate,
  endDate,
  hoveredDate,
  availabilityMap,
  onDateClick,
  onDateHover,
}: CalendarMonthProps) => {
  const monthName = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const days: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-foreground">{monthName}</h3>
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-foreground/60 py-2">
            {day}
          </div>
        ))}
        
        {/* Date cells */}
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="p-2" />;
          }
          
          const dateStr = date.toISOString().split('T')[0];
          const isPast = date < today;
          const isToday = date.getTime() === today.getTime();
          const availability = availabilityMap.get(dateStr) || 5;
          
          let isInRange = false;
          let isStart = false;
          let isEnd = false;
          
          if (startDate && endDate) {
            isInRange = date >= startDate && date <= endDate;
            isStart = date.getTime() === startDate.getTime();
            isEnd = date.getTime() === endDate.getTime();
          }
          
          const isHovered = hoveredDate?.toISOString().split('T')[0] === dateStr;
          
          return (
            <DateCell
              key={dateStr}
              date={date}
              isToday={isToday}
              isInRange={isInRange}
              isStart={isStart}
              isEnd={isEnd}
              isPast={isPast}
              availability={availability}
              isHovered={isHovered}
              onClick={() => onDateClick(date)}
              onHover={() => onDateHover(date)}
              onHoverLeave={() => onDateHover(null)}
            />
          );
        })}
      </div>
    </div>
  );
});

CalendarMonth.displayName = 'CalendarMonth';

interface AdvancedCalendarProps {
  rooms: any[];
  reservations: any[];
  onDateRangeSelect: (startDate: Date, endDate: Date, roomId: string) => void;
}

export default function AdvancedCalendar({
  rooms,
  reservations,
  onDateRangeSelect,
}: AdvancedCalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');

  // Generate availability map
  const availabilityMap = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const bookings = reservations.filter(
        res =>
          res.roomId === selectedRoomId &&
          new Date(res.checkInDate) <= date &&
          new Date(res.checkOutDate) > date
      ).length;
      
      map.set(dateStr, Math.max(0, 5 - bookings));
    }
    
    return map;
  }, [selectedRoomId, reservations]);

  const handleDateClick = useCallback((date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date > startDate) {
      setEndDate(date);
      onDateRangeSelect(startDate, date, selectedRoomId);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  }, [startDate, endDate, selectedRoomId, onDateRangeSelect]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  }, [currentMonth]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    setStartDate(null);
    setEndDate(null);
  }, []);

  const nights = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Select Dates</h2>
          <button
            onClick={handleToday}
            className="px-4 py-2 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-all"
          >
            Today
          </button>
        </div>

        {/* Room selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">Select Room</label>
          <select
            value={selectedRoomId}
            onChange={(e) => {
              setSelectedRoomId(e.target.value);
              setStartDate(null);
              setEndDate(null);
            }}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} - ${room.basePrice}/night
              </option>
            ))}
          </select>
        </div>

        {/* Selection info */}
        {startDate && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar size={16} />
              <span className="text-sm">
                {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {endDate && (
                  <>
                    {' - '}
                    {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </>
                )}
              </span>
            </div>
            {nights > 0 && (
              <div className="font-semibold text-primary">
                {nights} Night{nights !== 1 ? 's' : ''} • $
                {nights * (rooms.find(r => r.id === selectedRoomId)?.basePrice || 0)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dual calendar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-2 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
            aria-label="Previous month"
          >
            <ChevronLeft className="text-foreground" size={20} />
          </button>
          <div className="text-sm text-foreground/60">
            Showing {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-primary/10 rounded-lg transition-all"
            aria-label="Next month"
          >
            <ChevronRight className="text-foreground" size={20} />
          </button>
        </div>

        {/* Month calendars */}
        <CalendarMonth
          month={currentMonth}
          startDate={startDate}
          endDate={endDate}
          hoveredDate={hoveredDate}
          availabilityMap={availabilityMap}
          onDateClick={handleDateClick}
          onDateHover={setHoveredDate}
        />
        <CalendarMonth
          month={nextMonth}
          startDate={startDate}
          endDate={endDate}
          hoveredDate={hoveredDate}
          availabilityMap={availabilityMap}
          onDateClick={handleDateClick}
          onDateHover={setHoveredDate}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-sm">
          <div className="w-4 h-4 bg-primary rounded mb-1" />
          <div className="text-foreground/80">Selected</div>
        </div>
        <div className="text-sm">
          <div className="w-4 h-4 bg-card border border-border rounded mb-1" />
          <div className="text-foreground/80">Available</div>
        </div>
        <div className="text-sm">
          <div className="w-4 h-4 bg-foreground/10 rounded mb-1" />
          <div className="text-foreground/80">Past</div>
        </div>
        <div className="text-sm">
          <div className="w-4 h-4 bg-primary/20 rounded mb-1" />
          <div className="text-foreground/80">Today</div>
        </div>
      </div>
    </div>
  );
}
