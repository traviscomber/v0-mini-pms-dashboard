'use client';

import { useState, useMemo } from 'react';
import { Reservation, PaymentEntry } from '../types';
import { DollarSign, Download, Filter, Search } from 'lucide-react';

interface PaymentLedgerProps {
  reservations: Reservation[];
  paymentEntries: PaymentEntry[];
}

const typeColors = {
  booking_deposit: 'bg-blue-500/10 text-blue-700',
  payment: 'bg-green-500/10 text-green-700',
  refund: 'bg-orange-500/10 text-orange-700',
  adjustment: 'bg-purple-500/10 text-purple-700',
  cancellation_fee: 'bg-red-500/10 text-red-700',
};

export default function PaymentLedger({
  reservations,
  paymentEntries,
}: PaymentLedgerProps) {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Calculate totals
  const totalIncome = paymentEntries
    .filter((e) => e.type !== 'refund' && e.type !== 'adjustment')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalRefunds = paymentEntries
    .filter((e) => e.type === 'refund')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalAdjustments = paymentEntries
    .filter((e) => e.type === 'adjustment')
    .reduce((sum, e) => sum + e.amount, 0);

  const netTotal = totalIncome - totalRefunds + totalAdjustments;

  // Outstanding balance calculation
  const outstandingBalance = reservations
    .filter((r) => r.balanceDue > 0 && r.reservationStatus !== 'cancelled')
    .reduce((sum, r) => sum + r.balanceDue, 0);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    let filtered = [...paymentEntries];

    if (searchText) {
      const reservation = reservations.find((r) =>
        r.guestName.toLowerCase().includes(searchText.toLowerCase())
      );
      if (reservation) {
        filtered = filtered.filter((e) => e.reservationId === reservation.id);
      }
    }

    return filtered.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime());
  }, [paymentEntries, reservations, searchText]);

  // Reservation lookup
  const getReservationName = (resId: string) => {
    return reservations.find((r) => r.id === resId)?.guestName || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Total Income</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Total Refunds</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            -${totalRefunds.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Adjustments</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            ${totalAdjustments.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Net Total</p>
          <p className="text-2xl font-bold mt-1">
            ${netTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Outstanding Balance Alert */}
      {outstandingBalance > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">
                Outstanding Balance: ${outstandingBalance.toFixed(2)}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {reservations.filter((r) => r.balanceDue > 0 && r.reservationStatus !== 'cancelled').length} reservations with pending payments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg flex-1 min-w-xs">
          <Search className="w-4 h-4 text-foreground/60" />
          <input
            type="text"
            placeholder="Search by guest name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/80 transition">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Guest</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Reference</th>
                <th className="px-4 py-3 text-left font-semibold">Method</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={
                    idx % 2 === 0
                      ? 'border-b border-border'
                      : 'border-b border-border bg-background/50'
                  }
                >
                  <td className="px-4 py-3 text-xs text-foreground/60">
                    {entry.recordedAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {getReservationName(entry.reservationId)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${typeColors[entry.type]}`}>
                      {entry.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/60">
                    {entry.reference || '-'}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {entry.method.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    <span
                      className={
                        entry.type === 'refund'
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }
                    >
                      {entry.type === 'refund' ? '-' : '+'}$
                      {entry.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="flex items-center justify-center h-32 bg-card border border-border rounded-lg">
          <p className="text-foreground/60">No payment entries found</p>
        </div>
      )}

      {/* Payment Method Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['credit_card', 'bank_transfer', 'cash', 'check', 'online'].map((method) => {
            const count = paymentEntries.filter((e) => e.method === method).length;
            const total = paymentEntries
              .filter((e) => e.method === method)
              .reduce((sum, e) => sum + e.amount, 0);

            return (
              <div key={method} className="p-3 bg-background rounded-lg">
                <p className="text-xs text-foreground/60 capitalize">
                  {method.replace('_', ' ')}
                </p>
                <p className="text-lg font-semibold mt-1">
                  ${total.toFixed(2)}
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                  {count} transaction{count !== 1 ? 's' : ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
