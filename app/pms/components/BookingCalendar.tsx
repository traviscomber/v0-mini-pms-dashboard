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
    'Direct': 'bg-blue-500',
    'Airbnb': 'bg-red-500',
    'Booking.com': 'bg-yellow-500',
    'Website': 'bg-green-500',
    'Phone': 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left font-semibold text-slate-900 w-40">Room</th>
            {dates.map((d) => {
              const isToday = d.toISOString().split('T')[0] === today.toISOString().split('T')[0];
              return (
                <th key={d.toISOString()} className={`px-2 py-3 text-center font-semibold text-xs ${isToday ? 'bg-blue-50 text-blue-900' : 'text-slate-700'}`}>
                  <div className="whitespace-nowrap">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, idx) => (
            <tr key={room.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-4 py-3 font-semibold text-slate-900 border-r border-slate-200">
                <div className="truncate">{room.name}</div>
                <div className="text-xs text-slate-500">${room.basePrice}/night</div>
              </td>
              {dates.map((d) => {
                const res = getReservationForCell(room.id, d);
                const color = res ? channelColors[res.source] || 'bg-gray-500' : '';
                const isToday = d.toISOString().split('T')[0] === today.toISOString().split('T')[0];

                return (
                  <td
                    key={d.toISOString()}
                    className={`px-2 py-3 text-center border border-slate-200 ${isToday ? 'bg-blue-50' : ''}`}
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
      <div className="px-4 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-4">
        {Object.entries(channelColors).map(([channel, color]) => (
          <div key={channel} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${color}`} />
            <span className="text-xs font-medium text-slate-700">{channel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
