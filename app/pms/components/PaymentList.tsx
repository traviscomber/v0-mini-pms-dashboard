'use client';

import { PaymentEntry } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { Edit2, Trash2, DollarSign } from 'lucide-react';
import { formatDateTime } from '../lib/date-utils';

interface PaymentListProps {
  payments: PaymentEntry[];
  onEdit: (payment: PaymentEntry) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function PaymentList({ payments, onEdit, onDelete, onAdd }: PaymentListProps) {
  const { t } = useLanguage();

  const getMethodBadge = (method: string) => {
    const badges: Record<string, string> = {
      credit_card: 'bg-primary/20 text-primary/70',
      bank_transfer: 'bg-chart-2/20 text-green-300',
      cash: 'bg-secondary500/20 text-yellow-300',
      check: 'bg-accent500/20 text-accent300',
      online: 'bg-accent500/20 text-accent300',
      crypto: 'bg-destructive500/20 text-destructive300',
    };
    return badges[method] || 'bg-card/500/20 text-foreground/50';
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('payments.title')}</h1>
          <p className="text-foreground/60">{t('payments.subtitle')}</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {t('crud.add')} Payment
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-foreground/60">Total Payments</p>
              <p className="text-2xl font-bold text-foreground">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground/60">{payments.length} Entries</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Reference</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border hover:bg-background/50">
                <td className="py-3 px-4 font-medium text-foreground">{payment.type}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded ${getMethodBadge(payment.method)}`}>
                    {payment.method}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-primary">
                  ${payment.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-foreground/70">{payment.reference}</td>
                <td className="py-3 px-4 text-foreground/70">{formatDateTime(payment.recordedAt)}</td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(payment)}
                    className="p-2 hover:bg-primary/20 rounded transition"
                  >
                    <Edit2 className="w-4 h-4 text-primary/70" />
                  </button>
                  <button
                    onClick={() => onDelete(payment.id)}
                    className="p-2 hover:bg-destructive/20 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">{t('crud.noResults')}</p>
        </div>
      )}
    </div>
  );
}
