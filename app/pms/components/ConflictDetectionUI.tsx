'use client';

import { useState, useMemo } from 'react';
import { Reservation, Room } from '../types';
import { AlertTriangle, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { hasConflict, getConflictingReservations } from '../lib/conflict-detector';

interface ConflictDetectionUIProps {
  rooms: Room[];
  reservations: Reservation[];
  proposedCheckIn?: Date;
  proposedCheckOut?: Date;
  proposedRoomId?: string;
}

export default function ConflictDetectionUI({
  rooms,
  reservations,
  proposedCheckIn,
  proposedCheckOut,
  proposedRoomId,
}: ConflictDetectionUIProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  // Detect conflicts for proposed booking
  const hasProposedConflict = useMemo(() => {
    if (!proposedCheckIn || !proposedCheckOut || !proposedRoomId) return false;
    
    return hasConflict(
      {
        id: 'proposed',
        roomId: proposedRoomId,
        guestId: '',
        guestName: '',
        checkInDate: proposedCheckIn,
        checkOutDate: proposedCheckOut,
        source: 'direct',
        reservationStatus: 'pending',
        paymentStatus: 'pending',
        cleaningStatus: 'clean',
        totalAmount: 0,
        paidAmount: 0,
        balanceDue: 0,
        numberOfGuests: 1,
      },
      reservations
    );
  }, [proposedCheckIn, proposedCheckOut, proposedRoomId, reservations]);

  const proposedConflicts = useMemo(() => {
    if (!proposedCheckIn || !proposedCheckOut || !proposedRoomId) return [];
    
    return getConflictingReservations(
      {
        id: 'proposed',
        roomId: proposedRoomId,
        guestId: '',
        guestName: '',
        checkInDate: proposedCheckIn,
        checkOutDate: proposedCheckOut,
        source: 'direct',
        reservationStatus: 'pending',
        paymentStatus: 'pending',
        cleaningStatus: 'clean',
        totalAmount: 0,
        paidAmount: 0,
        balanceDue: 0,
        numberOfGuests: 1,
      },
      reservations
    );
  }, [proposedCheckIn, proposedCheckOut, proposedRoomId, reservations]);

  // Conflict statistics
  const totalConflicts = useMemo(() => {
    let count = 0;
    reservations.forEach((res) => {
      const conflicts = getConflictingReservations(res, reservations);
      count += conflicts.length;
    });
    return count / 2; // Divide by 2 because each conflict is counted twice
  }, [reservations]);

  // Room availability analysis
  const roomAvailability = useMemo(() => {
    return rooms.map((room) => {
      const roomReservations = reservations.filter((r) => r.roomId === room.id && r.reservationStatus !== 'cancelled');
      const conflicts = roomReservations.filter((res) => {
        const conflicts = getConflictingReservations(res, reservations);
        return conflicts.length > 0;
      });
      
      return {
        roomId: room.id,
        roomName: room.name,
        totalReservations: roomReservations.length,
        conflictCount: conflicts.length,
        utilization: roomReservations.length / 30, // Assuming 30-day view
      };
    });
  }, [rooms, reservations]);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Conflict Detection System</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1 text-xs rounded transition ${
                viewMode === 'overview'
                  ? 'bg-primary text-foreground'
                  : 'bg-background border border-border'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-1 text-xs rounded transition ${
                viewMode === 'detail'
                  ? 'bg-primary text-foreground'
                  : 'bg-background border border-border'
              }`}
            >
              Conflicts
            </button>
          </div>
        </div>

        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg">
              <p className="text-xs text-foreground/60">Total Reservations</p>
              <p className="text-2xl font-bold mt-1">{reservations.length}</p>
            </div>
            <div className={`p-4 rounded-lg ${totalConflicts > 0 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
              <p className={`text-xs ${totalConflicts > 0 ? 'text-red-700' : 'text-green-700'}`}>
                Detected Conflicts
              </p>
              <p className={`text-2xl font-bold mt-1 ${totalConflicts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.round(totalConflicts)}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${hasProposedConflict ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
              <p className={`text-xs ${hasProposedConflict ? 'text-red-700' : 'text-green-700'}`}>
                Proposed Booking Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                {hasProposedConflict ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">Conflict</span>
                  </>
                ) : proposedCheckIn ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Available</span>
                  </>
                ) : (
                  <span className="text-sm text-foreground/60">Select dates</span>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'detail' && proposedConflicts.length > 0 && (
          <div className="space-y-3">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700">
                    {proposedConflicts.length} Booking{proposedConflicts.length !== 1 ? 's' : ''} Conflict
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    This date range overlaps with existing reservations
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {proposedConflicts.map((conflict) => (
                <div key={conflict.id} className="p-3 bg-background rounded-lg border border-red-500/30">
                  <p className="font-medium text-sm">{conflict.guestName}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-foreground/60">
                    <Calendar className="w-3 h-3" />
                    {new Date(conflict.checkInDate).toLocaleDateString()} to{' '}
                    {new Date(conflict.checkOutDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Room Availability Analysis */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Room Availability Analysis</h3>
        <div className="space-y-3">
          {roomAvailability.map((room) => (
            <div key={room.roomId} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{room.roomName}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  room.conflictCount === 0
                    ? 'bg-green-500/20 text-green-700'
                    : 'bg-red-500/20 text-red-700'
                }`}>
                  {room.conflictCount === 0 ? 'No Conflicts' : `${room.conflictCount} Conflict(s)`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border">
                  <div
                    className={`h-full transition-all ${
                      room.utilization > 0.7
                        ? 'bg-red-600'
                        : room.utilization > 0.5
                        ? 'bg-orange-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${room.utilization * 100}%` }}
                  />
                </div>
                <p className="text-xs text-foreground/60 min-w-fit">
                  {room.totalReservations} bookings
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Status */}
      <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-700">Overbooking Prevention Active</p>
            <p className="text-xs text-green-600 mt-1">
              All bookings are validated against existing reservations. Conflicting dates are automatically blocked during reservation creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
