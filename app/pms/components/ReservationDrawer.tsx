'use client';

import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Reservation } from '../types';
import { useLanguageStore as useLanguage } from '../store/languageStore';

interface ReservationDrawerProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (reservation: Reservation) => void;
  rooms: any[];
}

export default function ReservationDrawer({
  reservation,
  isOpen,
  onClose,
  onUpdate,
  rooms,
}: ReservationDrawerProps) {
  const [editedReservation, setEditedReservation] = useState<Reservation | null>(reservation);
  const { t } = useLanguage();

  if (!isOpen || !reservation) return null;

  const handleSave = () => {
    if (editedReservation) {
      onUpdate(editedReservation);
      onClose();
    }
  };

  const room = rooms.find(r => r.id === reservation.roomId);
  const nightsCount = Math.ceil(
    (reservation.checkOutDate.getTime() - reservation.checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl
          transform transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Reservation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Guest Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Guest</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-foreground/60">Name:</span> <span className="text-foreground">{reservation.guestName}</span></p>
                <p><span className="text-foreground/60">Email:</span> <span className="text-foreground break-all">{reservation.guestEmail || '-'}</span></p>
                <p><span className="text-foreground/60">Phone:</span> <span className="text-foreground">{reservation.guestPhone || '-'}</span></p>
              </div>
            </div>

            {/* Room & Dates */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Stay</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-foreground/60">Room:</span> <span className="text-foreground">{room?.name}</span></p>
                <p><span className="text-foreground/60">Check-in:</span> <span className="text-foreground">{reservation.checkInDate.toLocaleDateString()}</span></p>
                <p><span className="text-foreground/60">Check-out:</span> <span className="text-foreground">{reservation.checkOutDate.toLocaleDateString()}</span></p>
                <p><span className="text-foreground/60">Nights:</span> <span className="text-foreground">{nightsCount}</span></p>
                <p><span className="text-foreground/60">Guests:</span> <span className="text-foreground">{reservation.numberOfGuests}</span></p>
              </div>
            </div>

            {/* Financial Status */}
            <div className="space-y-3 p-3 bg-background rounded-lg">
              <h3 className="font-semibold text-foreground">Payment</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-foreground/60">Total:</span> <span className="text-foreground font-semibold">${reservation.totalAmount.toFixed(2)}</span></p>
                <p><span className="text-foreground/60">Paid:</span> <span className="text-green-500 font-semibold">${reservation.paidAmount.toFixed(2)}</span></p>
                <p><span className="text-foreground/60">Due:</span> <span className={reservation.balanceDue > 0 ? 'text-red-500' : 'text-foreground'} > ${reservation.balanceDue.toFixed(2)}</span></p>
              </div>
              <div className="pt-2 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        paymentStatus: 'paid',
                        paidAmount: editedReservation.totalAmount,
                        balanceDue: 0,
                      });
                    }
                  }}
                  className="px-3 py-2 bg-green-500/20 text-green-500 text-xs rounded hover:bg-green-500/30 transition"
                >
                  Mark Paid
                </button>
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        paymentStatus: 'partially_paid',
                      });
                    }
                  }}
                  className="px-3 py-2 bg-yellow-500/20 text-yellow-600 text-xs rounded hover:bg-yellow-500/30 transition"
                >
                  Partial
                </button>
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        paymentStatus: 'overdue',
                      });
                    }
                  }}
                  className="px-3 py-2 bg-red-500/20 text-red-500 text-xs rounded hover:bg-red-500/30 transition"
                >
                  Overdue
                </button>
              </div>
            </div>

            {/* Cleaning Status */}
            <div className="space-y-3 p-3 bg-background rounded-lg">
              <h3 className="font-semibold text-foreground">Cleaning</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        cleaningStatus: 'clean',
                      });
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-xs rounded transition ${
                    editedReservation?.cleaningStatus === 'clean'
                      ? 'bg-green-500 text-white'
                      : 'bg-background border border-border text-foreground hover:bg-background/80'
                  }`}
                >
                  Clean
                </button>
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        cleaningStatus: 'dirty',
                      });
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-xs rounded transition ${
                    editedReservation?.cleaningStatus === 'dirty'
                      ? 'bg-red-500 text-white'
                      : 'bg-background border border-border text-foreground hover:bg-background/80'
                  }`}
                >
                  Dirty
                </button>
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        cleaningStatus: 'in_progress',
                      });
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-xs rounded transition ${
                    editedReservation?.cleaningStatus === 'in_progress'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-background border border-border text-foreground hover:bg-background/80'
                  }`}
                >
                  In Progress
                </button>
              </div>
            </div>

            {/* Reservation Status */}
            <div className="space-y-3 p-3 bg-background rounded-lg">
              <h3 className="font-semibold text-foreground">Status</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        reservationStatus: 'confirmed',
                      });
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-xs rounded transition ${
                    editedReservation?.reservationStatus === 'confirmed'
                      ? 'bg-primary text-black'
                      : 'bg-background border border-border text-foreground hover:bg-background/80'
                  }`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => {
                    if (editedReservation) {
                      setEditedReservation({
                        ...editedReservation,
                        reservationStatus: 'cancelled',
                      });
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-xs rounded transition ${
                    editedReservation?.reservationStatus === 'cancelled'
                      ? 'bg-red-500 text-white'
                      : 'bg-background border border-border text-foreground hover:bg-background/80'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Special Requests */}
            {reservation.specialRequests && (
              <div className="space-y-2 p-3 bg-background rounded-lg">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  Special Requests
                </h3>
                <p className="text-sm text-foreground/70">{reservation.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-6 py-4 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-background/80 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 font-semibold"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
