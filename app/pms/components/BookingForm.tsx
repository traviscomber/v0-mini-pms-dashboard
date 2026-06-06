'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface BookingFormProps {
  rooms: any[];
  reservations: any[];
  onAdd: (res: any) => void;
}

export default function BookingForm({ rooms, reservations, onAdd }: BookingFormProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomId: rooms[0]?.id || '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    source: 'Direct',
    paymentStatus: 'Paid',
    cleaningStatus: 'Clean',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkOverlap = (roomId: string, checkIn: string, checkOut: string) => {
    return reservations.some(r => 
      r.roomId === roomId && 
      checkIn < r.checkOut && 
      checkOut > r.checkIn
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.guestName.trim()) newErrors.guestName = t('filters.guestName') + ' is required';
    if (!form.guestEmail.trim()) newErrors.guestEmail = t('filters.email') + ' is required';
    else if (!validateEmail(form.guestEmail)) newErrors.guestEmail = 'Invalid email format';
    if (!form.roomId) newErrors.roomId = t('filters.room') + ' is required';
    if (!form.checkIn) newErrors.checkIn = t('filters.checkInDate') + ' is required';
    if (!form.checkOut) newErrors.checkOut = t('filters.checkOutDate') + ' is required';
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) {
      newErrors.checkOut = t('filters.checkOutTo') + ' must be after ' + t('filters.checkInFrom').toLowerCase();
    }
    if (form.adults < 1) newErrors.adults = 'At least 1 adult required';

    const room = rooms.find(r => r.id === form.roomId);
    const totalGuests = form.adults + form.children;
    if (room && totalGuests > room.capacity) {
      newErrors.adults = `Total guests (${totalGuests}) exceed room capacity (${room.capacity})`;
    }

    if (form.checkIn && form.checkOut && checkOverlap(form.roomId, form.checkIn, form.checkOut)) {
      newErrors.checkOut = 'This room is already booked for these dates';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nights = Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * (room?.basePrice || 0);

    const newRes = {
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      totalPrice,
    };

    onAdd(newRes);
    setForm({ guestName: '', guestEmail: '', guestPhone: '', roomId: rooms[0]?.id || '', checkIn: '', checkOut: '', adults: 1, children: 0, source: 'Direct', paymentStatus: 'Paid', cleaningStatus: 'Clean', notes: '' });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">{t('booking.addReservation')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Guest Name */}
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">{t('filters.guestName')} *</label>
          <input
            type="text"
            value={form.guestName}
            onChange={(e) => { setForm({ ...form, guestName: e.target.value }); delete errors.guestName; }}
            className={`w-full px-3 py-2 border rounded-lg bg-card/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary ${errors.guestName ? 'border-red-500' : 'border-border'}`}
            placeholder="John Doe"
          />
          {errors.guestName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.guestName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input
            type="email"
            value={form.guestEmail}
            onChange={(e) => { setForm({ ...form, guestEmail: e.target.value }); delete errors.guestEmail; }}
            className={`w-full px-3 py-2 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.guestEmail ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="john@example.com"
          />
          {errors.guestEmail && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.guestEmail}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.guestPhone}
            onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="555-0001"
          />
        </div>

        {/* Room */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Room *</label>
          <select
            value={form.roomId}
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roomId ? 'border-red-500' : 'border-slate-300'}`}
          >
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name} (${r.basePrice}/night)</option>)}
          </select>
          {errors.roomId && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.roomId}</p>}
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Check-in *</label>
          <input
            type="date"
            value={form.checkIn}
            onChange={(e) => { setForm({ ...form, checkIn: e.target.value }); delete errors.checkIn; }}
            className={`w-full px-3 py-2 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.checkIn ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.checkIn && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.checkIn}</p>}
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Check-out *</label>
          <input
            type="date"
            value={form.checkOut}
            onChange={(e) => { setForm({ ...form, checkOut: e.target.value }); delete errors.checkOut; }}
            className={`w-full px-3 py-2 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.checkOut ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.checkOut && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.checkOut}</p>}
        </div>

        {/* Adults */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Adults *</label>
          <input
            type="number"
            min="1"
            value={form.adults}
            onChange={(e) => { setForm({ ...form, adults: parseInt(e.target.value) || 1 }); delete errors.adults; }}
            className={`w-full px-3 py-2 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.adults ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.adults && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.adults}</p>}
        </div>

        {/* Children */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Children</label>
          <input
            type="number"
            min="0"
            value={form.children}
            onChange={(e) => setForm({ ...form, children: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Direct</option>
            <option>Booking.com</option>
            <option>Airbnb</option>
            <option>Website</option>
            <option>Phone</option>
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Payment</label>
          <select
            value={form.paymentStatus}
            onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Paid</option>
            <option>Partial</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Cleaning Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cleaning</label>
          <select
            value={form.cleaningStatus}
            onChange={(e) => setForm({ ...form, cleaningStatus: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Clean</option>
            <option>Needs cleaning</option>
            <option>In progress</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Any special requests or notes..."
        />
      </div>

      {/* Calculate Total Price */}
      {form.checkIn && form.checkOut && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-slate-700">
            <span className="font-semibold">Total Price:</span> ${
              (Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / (1000 * 60 * 60 * 24)) * (rooms.find(r => r.id === form.roomId)?.basePrice || 0)).toFixed(0)
            }
          </p>
        </div>
      )}

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-black font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Reservation
      </button>
    </form>
  );
}
