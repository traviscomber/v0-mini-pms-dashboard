'use client';

import { memo, useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, Users } from 'lucide-react';
import { useLanguage as useLanguage } from '../LanguageContext';

interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  paymentStatus: string;
  cleaningStatus: string;
  totalPrice: number;
  status: string;
}

interface GuestManagementProps {
  reservations: Reservation[];
  rooms: any[];
  onStatusChange?: (reservationId: string, status: string) => void;
}

const GuestManagement = memo(({ reservations, rooms, onStatusChange }: GuestManagementProps) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  const filteredReservations = reservations.filter(r => 
    filter === 'all' ? true : r.status === filter
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-accent/20 text-accent';
      case 'confirmed': return 'bg-primary/20 text-primary';
      case 'completed': return 'bg-chart-2/20 text-green-400';
      default: return 'bg-foreground/20 text-foreground';
    }
  };

  const getPaymentColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-primary/10 text-primary';
      case 'Pending': return 'bg-accent/10 text-accent';
      case 'Partial': return 'bg-secondary500/10 text-yellow-600';
      default: return 'bg-destructive/10 text-destructive';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRoomName = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.name || 'Unknown Room';
  };

  const getDaysLeft = (checkOutDate: string) => {
    const today = new Date();
    const checkout = new Date(checkOutDate);
    const days = Math.ceil((checkout.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days < 0 ? 'Checked out' : `${days}d left`;
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        {(['all', 'pending', 'confirmed', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-medium transition ${
              filter === tab 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            {t(`tabs.${tab}`)}
            <span className="ml-2 opacity-60">({reservations.filter(r => tab === 'all' ? true : r.status === tab).length})</span>
          </button>
        ))}
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredReservations.length === 0 ? (
          <div className="col-span-full text-center py-12 text-foreground/60">
            No reservations found
          </div>
        ) : (
          filteredReservations.map(reservation => (
            <button
              key={reservation.id}
              onClick={() => setSelectedReservation(selectedReservation === reservation.id ? null : reservation.id)}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition text-left"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{reservation.guestName}</h3>
                  <p className="text-sm text-foreground/60">{getRoomName(reservation.roomId)}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                  <p className="text-sm font-bold text-accent mt-1">${reservation.totalPrice}</p>
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="space-y-2 py-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Calendar size={16} />
                  {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                  <span className="text-foreground/50">({getDaysLeft(reservation.checkOutDate)})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Users size={16} />
                  {reservation.adults} adults{reservation.children > 0 ? `, ${reservation.children} children` : ''}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedReservation === reservation.id && (
                <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-primary" />
                    <a href={`mailto:${reservation.guestEmail}`} className="text-primary hover:underline">
                      {reservation.guestEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-primary" />
                    <a href={`tel:${reservation.guestPhone}`} className="text-primary hover:underline">
                      {reservation.guestPhone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-foreground/60">Payment:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentColor(reservation.paymentStatus)}`}>
                      {reservation.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Cleaning:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      reservation.cleaningStatus === 'Clean' 
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {reservation.cleaningStatus}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {reservation.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange?.(reservation.id, 'confirmed');
                      }}
                      className="w-full mt-3 px-3 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 font-medium text-sm"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
});

GuestManagement.displayName = 'GuestManagement';
export default GuestManagement;
