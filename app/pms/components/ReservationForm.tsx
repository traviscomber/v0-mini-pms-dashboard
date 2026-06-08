'use client';

import { useState } from 'react';
import { Reservation, Room, Guest } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';

interface ReservationFormProps {
  reservation?: Reservation;
  propertyId: string;
  rooms: Room[];
  guests: Guest[];
  onSubmit: (reservation: Reservation) => void;
  onCancel: () => void;
}

export default function ReservationForm({
  reservation,
  propertyId,
  rooms,
  guests,
  onSubmit,
  onCancel,
}: ReservationFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Reservation>(
    reservation || {
      id: `res-${Date.now()}`,
      propertyId,
      roomId: '',
      guestId: '',
      guestName: '',
      checkInDate: new Date(),
      checkOutDate: new Date(Date.now() + 86400000),
      source: 'direct',
      reservationStatus: 'confirmed',
      paymentStatus: 'pending',
      cleaningStatus: 'clean',
      totalAmount: 0,
      paidAmount: 0,
      balanceDue: 0,
      numberOfGuests: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const propertyRooms = rooms.filter((r) => r.propertyId === propertyId);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value, updatedAt: new Date() };

    if (field === 'totalAmount') {
      updated.balanceDue = value - formData.paidAmount;
    }

    if (field === 'paidAmount') {
      updated.balanceDue = formData.totalAmount - value;
      updated.paymentStatus = value >= formData.totalAmount ? 'paid' : value > 0 ? 'partially_paid' : 'pending';
    }

    setFormData(updated);
  };

  const handleGuestSelect = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    if (guest) {
      setFormData((prev) => ({
        ...prev,
        guestId,
        guestName: guest.name,
        guestEmail: guest.email,
        guestPhone: guest.phone,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {reservation ? t('crud.update') : t('crud.create')} Reservation
          </h2>
          <button onClick={onCancel} className="text-foreground/60 hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Guest</label>
            <select
              value={formData.guestId}
              onChange={(e) => handleGuestSelect(e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              required
            >
              <option value="">Select a guest...</option>
              {guests.map((guest) => (
                <option key={guest.id} value={guest.id}>
                  {guest.name} ({guest.email})
                </option>
              ))}
            </select>
          </div>

          {/* Room & Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Room</label>
              <select
                value={formData.roomId}
                onChange={(e) => handleChange('roomId', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                required
              >
                <option value="">Select room...</option>
                {propertyRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (${room.basePrice}/night)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Check-in</label>
              <input
                type="date"
                value={formData.checkInDate.toISOString().split('T')[0]}
                onChange={(e) => handleChange('checkInDate', new Date(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Check-out</label>
              <input
                type="date"
                value={formData.checkOutDate.toISOString().split('T')[0]}
                onChange={(e) => handleChange('checkOutDate', new Date(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
                required
              />
            </div>
          </div>

          {/* Status Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Res. Status</label>
              <select
                value={formData.reservationStatus}
                onChange={(e) => handleChange('reservationStatus', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Pay Status</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => handleChange('paymentStatus', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cleaning Status</label>
              <select
                value={formData.cleaningStatus}
                onChange={(e) => handleChange('cleaningStatus', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="clean">Clean</option>
                <option value="dirty">Dirty</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>

          {/* Payment Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Total Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Paid Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.paidAmount}
                onChange={(e) => handleChange('paidAmount', parseFloat(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Balance Due</label>
              <input
                type="number"
                value={formData.balanceDue}
                disabled
                className="w-full bg-background/50 border border-border rounded px-3 py-2 text-foreground/60"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Special Requests</label>
            <textarea
              value={formData.specialRequests || ''}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              rows={2}
              placeholder="Any special requests or notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-background border border-border text-foreground px-4 py-2 rounded hover:bg-background/80"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-primary text-white px-4 py-2 rounded hover:opacity-90">
              Save Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
