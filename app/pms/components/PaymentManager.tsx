'use client';

import { memo } from 'react';
import { CreditCard, Check, AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PaymentManagerProps {
  reservations: any[];
  onPaymentStatusChange?: (reservationId: string, status: string) => void;
}

const PaymentManager = memo(({ reservations, onPaymentStatusChange }: PaymentManagerProps) => {
  const { t } = useLanguage();
  const totalRevenue = reservations
    .filter(r => r.paymentStatus === 'Paid')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const pendingPayments = reservations
    .filter(r => r.paymentStatus === 'Pending')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const partialPayments = reservations.filter(r => r.paymentStatus === 'Partial');

  const getPaymentIcon = (status: string) => {
    switch(status) {
      case 'Paid': return <Check className="text-primary" size={20} />;
      case 'Pending': return <Clock className="text-accent" size={20} />;
      case 'Partial': return <AlertCircle className="text-yellow-600" size={20} />;
      default: return <CreditCard className="text-foreground/60" size={20} />;
    }
  };

  const getPaymentColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-primary/10 text-primary';
      case 'Pending': return 'bg-accent/10 text-accent';
      case 'Partial': return 'bg-yellow-500/10 text-yellow-600';
      default: return 'bg-border text-foreground/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-foreground/60 text-sm font-medium mb-2">{t('payment.totalRevenue')}</p>
          <p className="text-3xl font-bold text-primary">${totalRevenue}</p>
          <p className="text-xs text-foreground/50 mt-2">{t('payment.fromConfirmedBookings')}</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-foreground/60 text-sm font-medium mb-2">{t('payment.pendingPayments')}</p>
          <p className="text-3xl font-bold text-accent">${pendingPayments}</p>
          <p className="text-xs text-foreground/50 mt-2">{reservations.filter(r => r.paymentStatus === 'Pending').length} reservations</p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <p className="text-foreground/60 text-sm font-medium mb-2">{t('payment.partialPayments')}</p>
          <p className="text-3xl font-bold text-yellow-600">${partialPayments.reduce((sum, r) => sum + r.totalPrice, 0)}</p>
          <p className="text-xs text-foreground/50 mt-2">{partialPayments.length} reservations</p>
        </div>
      </div>

      {/* Payment Breakdown Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">{t('paymentTable.paymentBreakdown')}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground/60">{t('paymentTable.guest')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground/60">{t('paymentTable.amount')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground/60">{t('paymentTable.status')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground/60">{t('paymentTable.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reservations.map(reservation => (
                <tr key={reservation.id} className="hover:bg-background/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{reservation.guestName}</div>
                    <div className="text-xs text-foreground/60">{reservation.guestEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">${reservation.totalPrice}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm font-medium ${getPaymentColor(reservation.paymentStatus)}`}>
                      {getPaymentIcon(reservation.paymentStatus)}
                      {reservation.paymentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {reservation.paymentStatus !== 'Paid' && (
                      <button
                        onClick={() => onPaymentStatusChange?.(reservation.id, 'Paid')}
                        className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 font-medium transition"
                      >
                        {t('paymentTable.markPaid')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

PaymentManager.displayName = 'PaymentManager';
export default PaymentManager;
