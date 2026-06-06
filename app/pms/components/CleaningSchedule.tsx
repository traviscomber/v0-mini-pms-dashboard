'use client';

import { memo, useState } from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface CleaningScheduleProps {
  rooms: any[];
  reservations: any[];
}

const CleaningSchedule = memo(({ rooms, reservations }: CleaningScheduleProps) => {
  const [cleaningStatus, setCleaningStatus] = useState<{ [key: string]: { [key: string]: string } }>({});

  const getTodayReservations = () => {
    const today = new Date('2026-06-06');
    return reservations.filter(r => {
      const checkOut = new Date(r.checkOutDate);
      return checkOut.toDateString() === today.toDateString();
    });
  };

  const getTomorrowReservations = () => {
    const tomorrow = new Date('2026-06-07');
    return reservations.filter(r => {
      const checkIn = new Date(r.checkInDate);
      return checkIn.toDateString() === tomorrow.toDateString();
    });
  };

  const toggleCleaningStatus = (roomId: string, resId: string) => {
    setCleaningStatus(prev => {
      const newStatus = { ...prev };
      if (!newStatus[roomId]) newStatus[roomId] = {};
      const current = newStatus[roomId][resId] || 'pending';
      const statuses = ['pending', 'in_progress', 'completed'];
      const nextStatus = statuses[(statuses.indexOf(current) + 1) % statuses.length];
      newStatus[roomId][resId] = nextStatus;
      return newStatus;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} className="text-green-500" />;
      case 'in_progress':
        return <Clock size={20} className="text-accent" />;
      default:
        return <AlertCircle size={20} className="text-orange-500" />;
    }
  };

  const todayCheckOuts = getTodayReservations();
  const tomorrowCheckIns = getTomorrowReservations();

  return (
    <div className="space-y-6">
      {/* Today's Checkouts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Today's Checkouts - Cleaning Needed</h3>
        {todayCheckOuts.length === 0 ? (
          <p className="text-foreground/60">No checkouts today</p>
        ) : (
          <div className="space-y-3">
            {todayCheckOuts.map(res => {
              const room = rooms.find(r => r.id === res.roomId);
              const status = cleaningStatus[res.roomId]?.[res.id] || 'pending';
              return (
                <button
                  key={res.id}
                  onClick={() => toggleCleaningStatus(res.roomId, res.id)}
                  className={`w-full p-4 rounded-lg border text-left transition ${
                    status === 'completed'
                      ? 'bg-green-500/10 border-green-500/30'
                      : status === 'in_progress'
                      ? 'bg-accent/10 border-accent/30'
                      : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{room?.name}</p>
                      <p className="text-sm text-foreground/60">{res.guestName} - Checkout 11 AM</p>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tomorrow's Check-ins */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Tomorrow's Check-ins - Ready?</h3>
        {tomorrowCheckIns.length === 0 ? (
          <p className="text-foreground/60">No check-ins tomorrow</p>
        ) : (
          <div className="space-y-3">
            {tomorrowCheckIns.map(res => {
              const room = rooms.find(r => r.id === res.roomId);
              const status = cleaningStatus[res.roomId]?.[res.id] || 'pending';
              return (
                <button
                  key={res.id}
                  onClick={() => toggleCleaningStatus(res.roomId, res.id)}
                  className={`w-full p-4 rounded-lg border text-left transition ${
                    status === 'completed'
                      ? 'bg-green-500/10 border-green-500/30 text-foreground'
                      : 'bg-card border-border text-foreground hover:bg-card/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{room?.name}</p>
                      <p className="text-sm text-foreground/60">{res.guestName} - Check-in 3 PM</p>
                    </div>
                    {getStatusIcon(status)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Block Dates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Block Dates (Maintenance/Cleaning)</h3>
        <div className="space-y-3">
          {rooms.map(room => (
            <div key={room.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-semibold text-foreground">{room.name}</p>
              </div>
              <button className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-card/80 transition text-sm font-medium">
                + Block Dates
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CleaningSchedule.displayName = 'CleaningSchedule';
export default CleaningSchedule;
