'use client';

import { useMemo } from 'react';
import { Download, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface FinanceProps {
  reservations: any[];
}

export default function FinanceSection({ reservations }: FinanceProps) {
  const { t } = useLanguage();
  const financials = useMemo(() => {
    const totalEarned = reservations.filter(r => r.paymentStatus === 'Paid').reduce((sum, r) => sum + r.totalPrice, 0);
    const pendingPayments = reservations.filter(r => r.paymentStatus === 'Pending').reduce((sum, r) => sum + r.totalPrice, 0);
    const partialPayments = reservations.filter(r => r.paymentStatus === 'Partial').reduce((sum, r) => sum + r.totalPrice, 0);
    const totalEarnings = totalEarned + partialPayments;

    return { totalEarned, pendingPayments, partialPayments, totalEarnings };
  }, [reservations]);

  const payoutSchedule = [
    { date: 'Jun 15, 2026', amount: 1250, status: 'Paid' },
    { date: 'Jun 30, 2026', amount: 1890, status: 'Pending' },
    { date: 'Jul 15, 2026', amount: 2100, status: 'Scheduled' },
  ];

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Earned</p>
              <p className="text-3xl font-bold text-green-500">${financials.totalEarned.toFixed(0)}</p>
            </div>
            <DollarSign size={32} className="text-green-500/40" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Pending Payments</p>
              <p className="text-3xl font-bold text-blue-500">${financials.pendingPayments.toFixed(0)}</p>
            </div>
            <CreditCard size={32} className="text-blue-500/40" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Partial Payments</p>
              <p className="text-3xl font-bold text-purple-500">${financials.partialPayments.toFixed(0)}</p>
            </div>
            <TrendingUp size={32} className="text-purple-500/40" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Earnings</p>
              <p className="text-3xl font-bold text-accent">${financials.totalEarnings.toFixed(0)}</p>
            </div>
            <TrendingUp size={32} className="text-accent/40" />
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Payment Status</h3>
          <div className="space-y-4">
            {[
              { status: 'Paid', amount: financials.totalEarned, color: 'text-green-500' },
              { status: 'Pending', amount: financials.pendingPayments, color: 'text-yellow-500' },
              { status: 'Partial', amount: financials.partialPayments, color: 'text-orange-500' },
            ].map(({ status, amount, color }) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-foreground/60">{status}</span>
                <span className={`font-bold ${color}`}>${amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Transactions</h3>
            <button className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:text-primary/80 transition">
              <Download size={16} />
              Export
            </button>
          </div>
          <div className="space-y-3">
            {reservations.slice(0, 5).map((reservation, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{reservation.guestName}</p>
                  <p className="text-xs text-foreground/60">{new Date(reservation.checkIn).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${reservation.totalPrice}</p>
                  <p className={`text-xs ${
                    reservation.paymentStatus === 'Paid' ? 'text-green-500' :
                    reservation.paymentStatus === 'Pending' ? 'text-yellow-500' :
                    'text-orange-500'
                  }`}>{reservation.paymentStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout Schedule */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Payout Schedule</h3>
        <div className="space-y-2">
          {payoutSchedule.map((payout, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium text-foreground">{payout.date}</p>
                <p className={`text-xs ${
                  payout.status === 'Paid' ? 'text-green-500' :
                  payout.status === 'Pending' ? 'text-yellow-500' :
                  'text-blue-500'
                }`}>{payout.status}</p>
              </div>
              <p className="font-bold text-foreground">${payout.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
