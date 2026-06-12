'use client';

import { X, DollarSign } from 'lucide-react';
import { useLanguage as useLanguage } from '../LanguageContext';

interface PaymentsModalProps {
  reservations: any[];
  isOpen: boolean;
  onClose: () => void;
  onMarkPaid?: (reservationId: string) => void;
}

export default function PaymentsModal({
  reservations,
  isOpen,
  onClose,
  onMarkPaid
}: PaymentsModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const pendingPayments = reservations.filter(r => r.paymentStatus === 'Pending');
  const totalPending = pendingPayments.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('payment.pendingPayments') || 'Payments Due'}
            </h2>
            <p className="text-sm text-foreground/60 mt-1">
              {pendingPayments.length} {t('dashboard.unpaidBookings') || 'unpaid bookings'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Total Summary */}
          {pendingPayments.length > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-foreground">{t('payment.totalRevenue') || 'Total Pending'}</span>
                </div>
                <span className="text-2xl font-bold text-red-500">${totalPending}</span>
              </div>
            </div>
          )}

          {/* Payments List */}
          {pendingPayments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-foreground/60">All payments collected!</p>
            </div>
          ) : (
            pendingPayments.map((reservation) => (
              <div
                key={reservation.id}
                className="p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{reservation.guestName}</h3>
                    <p className="text-sm text-foreground/60">{reservation.guestEmail}</p>
                  </div>
                  <span className="text-2xl font-bold text-foreground">
                    ${reservation.totalPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <span>Booking: {new Date(reservation.checkIn).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => onMarkPaid?.(reservation.id)}
                    className="flex-1 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/90 font-medium transition text-sm"
                  >
                    {t('paymentTable.markPaid') || 'Mark Paid'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:bg-background font-medium transition text-sm">
                    {t('common.send') || 'Send Invoice'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
