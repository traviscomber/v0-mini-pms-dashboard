'use client';

import { memo, useState } from 'react';
import { ChevronRight, ChevronLeft, X, Check } from 'lucide-react';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: any[];
  reservations: any[];
  onConfirm: (booking: any) => void;
}

const BookingFlowModal = memo(({ isOpen, onClose, rooms, reservations, onConfirm }: BookingFlowModalProps) => {
  const [step, setStep] = useState(1); // 1: Dates, 2: Room, 3: Guest, 4: Confirm
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    roomId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    adults: 1,
    children: 0,
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getSelectedRoom = () => rooms.find(r => r.id === formData.roomId);
  const nights = calculateNights();
  const totalPrice = getSelectedRoom() ? (getSelectedRoom().basePrice * nights) : 0;

  const checkAvailability = (roomId: string, checkIn: string, checkOut: string) => {
    return !reservations.some(r => 
      r.roomId === roomId && 
      checkIn < r.checkOutDate && 
      checkOut > r.checkInDate
    );
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date required';
      if (!formData.checkOutDate) newErrors.checkOutDate = 'Check-out date required';
      if (formData.checkInDate && formData.checkOutDate && formData.checkOutDate <= formData.checkInDate) {
        newErrors.checkOutDate = 'Check-out must be after check-in';
      }
    } else if (step === 2) {
      if (!formData.roomId) newErrors.roomId = 'Please select a room';
    } else if (step === 3) {
      if (!formData.guestName.trim()) newErrors.guestName = 'Name required';
      if (!formData.guestEmail.trim()) newErrors.guestEmail = 'Email required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) newErrors.guestEmail = 'Invalid email';
      if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Phone required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const handleConfirm = () => {
    if (validateStep()) {
      onConfirm({
        ...formData,
        totalPrice,
        nights,
        paymentStatus: 'Pending',
        cleaningStatus: 'Clean',
        source: 'Direct',
        status: 'pending',
      });
      onClose();
    }
  };

  const availableRooms = rooms.filter(r => 
    checkAvailability(r.id, formData.checkInDate, formData.checkOutDate)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Complete Your Booking</h2>
          <button onClick={onClose} className="p-1 hover:bg-primary/10 rounded">
            <X size={24} className="text-foreground/60" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6 py-4 bg-background/50">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                s <= step ? 'bg-primary text-white' : 'bg-border text-foreground/50'
              }`}>
                {s < step ? <Check size={16} /> : s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 ${s < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Step 1: Dates */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({...formData, checkInDate: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>}
              </div>
              <p className="text-foreground/60">{nights} nights selected</p>
            </div>
          )}

          {/* Step 2: Room Selection */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-foreground/60">{availableRooms.length} rooms available</p>
              {availableRooms.length === 0 ? (
                <p className="text-red-500">No rooms available for selected dates</p>
              ) : (
                availableRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setFormData({...formData, roomId: room.id})}
                    className={`w-full p-4 rounded-lg border-2 text-left transition ${
                      formData.roomId === room.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{room.name}</h3>
                        <p className="text-sm text-foreground/60">{room.capacity} guests • {room.type}</p>
                      </div>
                      <p className="font-bold text-primary">${room.basePrice * nights}</p>
                    </div>
                  </button>
                ))
              )}
              {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId}</p>}
            </div>
          )}

          {/* Step 3: Guest Info */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.guestName && <p className="text-red-500 text-sm mt-1">{errors.guestName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.guestEmail && <p className="text-red-500 text-sm mt-1">{errors.guestEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.guestPhone}
                  onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.guestPhone && <p className="text-red-500 text-sm mt-1">{errors.guestPhone}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Guest:</span>
                  <span className="font-medium text-foreground">{formData.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Room:</span>
                  <span className="font-medium text-foreground">{getSelectedRoom()?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Dates:</span>
                  <span className="font-medium text-foreground">{nights} nights</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="font-bold text-accent text-lg">${totalPrice}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-background/50">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-foreground/60 disabled:opacity-50 hover:text-foreground disabled:hover:text-foreground/60"
          >
            <ChevronLeft size={20} /> Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-medium"
            >
              <Check size={20} /> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

BookingFlowModal.displayName = 'BookingFlowModal';
export default BookingFlowModal;
