'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface CalendarProps {
  rooms: any[];
  reservations: any[];
}

export default function CalendarSection({ rooms, reservations }: CalendarProps) {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1);
  const previousDays = Array.from({ length: firstDayOfMonth(currentDate) }, () => null);

  const goToPrevious = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-background rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="p-2 hover:bg-background rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Room Headers */}
        <div className="overflow-x-auto">
          <div className="grid gap-px" style={{ gridTemplateColumns: `80px repeat(${rooms.length}, 1fr)` }}>
            <div className="bg-background p-3 font-semibold text-sm text-foreground/60">Date</div>
            {rooms.map(room => (
              <div key={room.id} className="bg-background p-3 font-semibold text-sm text-foreground/60 text-center">
                {room.name}
              </div>
            ))}

            {/* Calendar Grid */}
            {[...previousDays, ...days].map((day, index) => (
              <div key={index} className="contents">
                {index % (rooms.length + 1) === 0 && (
                  <div className="bg-background p-3 font-medium text-sm text-foreground">
                    {day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''}
                  </div>
                )}
                {day && (
                  <>
                    {rooms.map(room => {
                      const booking = reservations.find(
                        r => new Date(r.checkIn).getDate() === day && r.roomType === room.type
                      );
                      return (
                        <div
                          key={`${day}-${room.id}`}
                          className={`p-2 text-center text-xs border rounded ${
                            booking
                              ? 'bg-primary/20 border-primary text-primary font-semibold'
                              : 'bg-card border-border text-foreground/50'
                          }`}
                        >
                          {booking ? 'Booked' : 'Available'}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rate Manager */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Manage Rates</h3>
        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-semibold text-foreground">{room.name}</p>
                <p className="text-sm text-foreground/60">Base rate: ${room.basePrice}/night</p>
              </div>
              <input
                type="number"
                defaultValue={room.basePrice}
                className="w-24 px-3 py-2 bg-input border border-border rounded text-foreground focus:border-primary outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
