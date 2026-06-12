'use client';

interface BookingCalendarProps {
  rooms: any[];
  reservations: any[];
}

export default function BookingCalendar({ rooms, reservations }: BookingCalendarProps) {
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const isDateInRange = (checkIn: string, checkOut: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr >= checkIn && dateStr < checkOut;
  };

  const getReservationForCell = (roomId: string, date: Date) => {
    return reservations.find(r => r.roomId === roomId && isDateInRange(r.checkIn, r.checkOut, date));
  };

  const channelColors: Record<string, string> = {
    'Direct': 'bg-primary',
    'Airbnb': 'bg-destructive',
    'Booking.com': 'bg-secondary500',
    'Website': 'bg-chart-2',
    'Phone': 'bg-accent500',
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card/50">
            <th className="px-4 py-3 text-left font-semibold text-foreground w-40">Room</th>
            {dates.map((d) => {
              const isToday = d.toISOString().split('T')[0] === today.toISOString().split('T')[0];
              return (
                <th key={d.toISOString()} className={`px-2 py-3 text-center font-semibold text-xs ${isToday ? 'bg-blue-50 text-blue-900' : 'text-foreground/80'}`}>
                  <div className="whitespace-nowrap">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, idx) => (
            <tr key={room.id} className={idx % 2 === 0 ? 'bg-card' : 'bg-card/50'}>
              <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                <div className="truncate">{room.name}</div>
                <div className="text-xs text-foreground/60">${room.basePrice}/night</div>
              </td>
              {dates.map((d) => {
                const res = getReservationForCell(room.id, d);
                const color = res ? channelColors[res.source] || 'bg-card/500' : '';
                const isToday = d.toISOString().split('T')[0] === today.toISOString().split('T')[0];

                return (
                  <td
                    key={d.toISOString()}
                    className={`px-2 py-3 text-center border border-border ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    {res && (
                      <div className={`${color} text-white text-xs font-bold py-1 px-2 rounded truncate`} title={res.guestName}>
                        {res.guestName.split(' ')[0]}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="px-4 py-4 border-t border-border bg-card/50 flex flex-wrap gap-4">
        {Object.entries(channelColors).map(([channel, color]) => (
          <div key={channel} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color}`} />
            <span className="text-xs font-medium text-foreground/80">{channel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
