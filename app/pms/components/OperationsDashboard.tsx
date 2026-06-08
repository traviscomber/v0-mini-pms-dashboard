'use client';

import { AlertCircle, CheckCircle, Clock, DollarSign, Trash2, Users } from 'lucide-react';
import { Reservation, Room } from '../types';
import { getArrivals, getDepartures, getPendingPayments, getDirtyRooms } from '../utils/conflict-detector';
import { useLanguageStore as useLanguage } from '../store/languageStore';

interface OperationsDashboardProps {
  reservations: Reservation[];
  rooms: Room[];
  onViewReservation: (reservation: Reservation) => void;
}

export default function OperationsDashboard({
  reservations,
  rooms,
  onViewReservation,
}: OperationsDashboardProps) {
  const { t } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const arrivals = getArrivals(today, reservations);
  const departures = getDepartures(today, reservations);
  const pendingPayments = getPendingPayments(reservations);
  const dirtyRoomIds = getDirtyRooms(reservations);
  const dirtyRooms = rooms.filter(r => dirtyRoomIds.includes(r.id));

  const getCleaningIcon = (status: string) => {
    switch (status) {
      case 'clean':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'dirty':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold text-foreground">Today Operations</div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Arrivals</p>
              <p className="text-3xl font-bold text-primary">{arrivals.length}</p>
            </div>
            <Users className="w-10 h-10 text-primary opacity-20" />
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Departures</p>
              <p className="text-3xl font-bold text-accent">{departures.length}</p>
            </div>
            <Users className="w-10 h-10 text-accent opacity-20" />
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-500">${pendingPayments.reduce((sum, r) => sum + r.balanceDue, 0).toFixed(0)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Dirty Rooms</p>
              <p className="text-3xl font-bold text-red-500">{dirtyRooms.length}</p>
            </div>
            <Trash2 className="w-10 h-10 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Today's Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Arrivals */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-lg">Check-ins Today</h3>
          {arrivals.length > 0 ? (
            <div className="space-y-2">
              {arrivals.map(res => (
                <button
                  key={res.id}
                  onClick={() => onViewReservation(res)}
                  className="w-full text-left p-3 bg-card border border-border hover:border-primary rounded-lg transition"
                >
                  <div className="font-semibold text-foreground">{res.guestName}</div>
                  <div className="text-sm text-foreground/60 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {rooms.find(r => r.id === res.roomId)?.name}
                  </div>
                  <div className="text-xs text-foreground/50 mt-1">{String(res.checkInDate.getHours()).padStart(2, '0')}:{String(res.checkInDate.getMinutes()).padStart(2, '0')}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-foreground/50 bg-background rounded-lg">No check-ins today</div>
          )}
        </div>

        {/* Departures */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-lg">Check-outs Today</h3>
          {departures.length > 0 ? (
            <div className="space-y-2">
              {departures.map(res => (
                <button
                  key={res.id}
                  onClick={() => onViewReservation(res)}
                  className="w-full text-left p-3 bg-card border border-border hover:border-accent rounded-lg transition"
                >
                  <div className="font-semibold text-foreground">{res.guestName}</div>
                  <div className="text-sm text-foreground/60 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {rooms.find(r => r.id === res.roomId)?.name}
                  </div>
                  <div className={`text-xs mt-1 flex items-center gap-1 ${res.cleaningStatus === 'dirty' ? 'text-red-500' : 'text-green-500'}`}>
                    {getCleaningIcon(res.cleaningStatus)}
                    {res.cleaningStatus === 'dirty' ? 'Needs cleaning' : 'Ready for next guest'}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-foreground/50 bg-background rounded-lg">No check-outs today</div>
          )}
        </div>

        {/* Pending Payments */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-lg">Outstanding Payments</h3>
          {pendingPayments.length > 0 ? (
            <div className="space-y-2">
              {pendingPayments.slice(0, 5).map(res => (
                <button
                  key={res.id}
                  onClick={() => onViewReservation(res)}
                  className="w-full text-left p-3 bg-card border border-border hover:border-yellow-500 rounded-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-foreground">{res.guestName}</div>
                      <div className="text-sm text-foreground/60">{rooms.find(r => r.id === res.roomId)?.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-yellow-500">${res.balanceDue.toFixed(2)}</div>
                      <div className="text-xs text-foreground/50">due</div>
                    </div>
                  </div>
                </button>
              ))}
              {pendingPayments.length > 5 && (
                <div className="text-sm text-foreground/50 text-center py-2">+{pendingPayments.length - 5} more</div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-foreground/50 bg-background rounded-lg">All payments current</div>
          )}
        </div>

        {/* Dirty Rooms */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-lg">Rooms Needing Cleaning</h3>
          {dirtyRooms.length > 0 ? (
            <div className="space-y-2">
              {dirtyRooms.map(room => {
                const roomReservations = reservations.filter(r => r.roomId === room.id && r.cleaningStatus === 'dirty');
                return (
                  <div key={room.id} className="p-3 bg-card border border-red-500/30 bg-red-500/5 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground">{room.name}</div>
                        <div className="text-sm text-foreground/60">{roomReservations.length} guest(s) departed</div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-foreground/50 bg-background rounded-lg">All rooms clean</div>
          )}
        </div>
      </div>
    </div>
  );
}
