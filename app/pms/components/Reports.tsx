'use client';

import { useLanguage as useLanguage } from '../LanguageContext';

interface ReportsProps {
  reservations: any[];
}

export default function Reports({ reservations }: ReportsProps) {
  const { t } = useLanguage();
  
  const getTotal = (reservation: any) => reservation.totalPrice ?? reservation.totalAmount ?? 0;
  const getCheckIn = (reservation: any) => reservation.checkIn ?? reservation.check_in_date ?? reservation.checkInDate;
  const getCheckOut = (reservation: any) => reservation.checkOut ?? reservation.check_out_date ?? reservation.checkOutDate;
  const getPaymentStatus = (reservation: any) => (reservation.paymentStatus ?? reservation.payment_status ?? 'pending').toLowerCase();
  
  const totalRevenue = reservations.reduce((sum, r) => sum + getTotal(r), 0);
  
  const revenueByChannel = reservations.reduce((acc, r) => {
    const source = r.source || 'Direct';
    acc[source] = (acc[source] || 0) + getTotal(r);
    return acc;
  }, {} as Record<string, number>);

  const totalNights = reservations.reduce((sum, r) => {
    const checkIn = new Date(getCheckIn(r));
    const checkOut = new Date(getCheckOut(r));
    const nights = Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    return sum + nights;
  }, 0);

  const pendingPayments = reservations
    .filter(r => getPaymentStatus(r) === 'pending')
    .reduce((sum, r) => sum + getTotal(r), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Revenue */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">{t('payment.totalRevenue')}</h3>
          <p className="text-4xl font-bold text-green-500">${totalRevenue.toFixed(0)}</p>
          <p className="text-sm text-foreground/60 mt-2">{reservations.length} {t('dashboard.reservations')}</p>
        </div>

        {/* Pending Payments */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">{t('payment.pendingPayments')}</h3>
          <p className="text-4xl font-bold text-red-500">${pendingPayments.toFixed(0)}</p>
          <p className="text-sm text-foreground/60 mt-2">{reservations.filter(r => getPaymentStatus(r) === 'pending').length} {t('dashboard.unpaidBookings')}</p>
        </div>

        {/* Total Nights */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">{t('reports.totalNights')}</h3>
          <p className="text-4xl font-bold text-blue-500">{totalNights || 0}</p>
          <p className="text-sm text-foreground/60 mt-2">{totalNights > 0 ? (totalNights / 30).toFixed(1) : 0} {t('reports.monthsOccupancy')}</p>
        </div>

        {/* Average Booking Value */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">{t('reports.avgBookingValue')}</h3>
          <p className="text-4xl font-bold text-purple-500">${reservations.length > 0 ? (totalRevenue / reservations.length).toFixed(0) : 0}</p>
          <p className="text-sm text-foreground/60 mt-2">{t('reports.perReservation')}</p>
        </div>
      </div>

      {/* Revenue by Channel */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-4">{t('payment.revenueByChannel')}</h3>
        <div className="space-y-3">
          {Object.entries(revenueByChannel).map(([channel, revenue]) => {
            const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
            return (
              <div key={channel}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground/80">{channel}</span>
                  <span className="text-sm font-bold text-foreground">${revenue.toFixed(0)} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['paid', 'partially_paid', 'pending'].map(status => {
          const count = reservations.filter(r => getPaymentStatus(r) === status).length;
          const revenue = reservations.filter(r => getPaymentStatus(r) === status).reduce((sum, r) => sum + getTotal(r), 0);
          const colors = { 
            paid: 'bg-green-500/10 text-green-400 border-green-500/30', 
            partially_paid: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', 
            pending: 'bg-red-500/10 text-red-400 border-red-500/30' 
          };
          const statusLabel = status === 'paid' ? t('reports.paid') : status === 'partially_paid' ? t('reports.partial') : t('reports.pending');
          return (
            <div key={status} className={`p-6 rounded-lg border ${colors[status as keyof typeof colors]}`}>
              <p className="text-sm font-medium text-foreground/80 mb-2">{statusLabel}</p>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm mt-2">${revenue.toFixed(0)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
