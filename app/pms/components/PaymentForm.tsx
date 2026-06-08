'use client';

import { useState } from 'react';
import { PaymentEntry } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';

interface PaymentFormProps {
  payment?: PaymentEntry;
  reservationId: string;
  propertyId: string;
  onSubmit: (payment: PaymentEntry) => void;
  onCancel: () => void;
}

export default function PaymentForm({
  payment,
  reservationId,
  propertyId,
  onSubmit,
  onCancel,
}: PaymentFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<PaymentEntry>(
    payment || {
      id: `pay-${Date.now()}`,
      propertyId,
      reservationId,
      type: 'payment',
      amount: 0,
      method: 'credit_card',
      recordedAt: new Date(),
    }
  );

  const paymentTypes = ['booking_deposit', 'payment', 'refund', 'adjustment', 'cancellation_fee', 'tax', 'service_fee'];
  const methods = ['credit_card', 'bank_transfer', 'cash', 'check', 'online', 'crypto', 'wallet'];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {payment ? 'Edit Payment' : 'Record Payment'}
          </h2>
          <button onClick={onCancel} className="text-foreground/60 hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Method</label>
              <select
                value={formData.method}
                onChange={(e) => handleChange('method', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              >
                {methods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Reference</label>
            <input
              type="text"
              value={formData.reference || ''}
              onChange={(e) => handleChange('reference', e.target.value)}
              placeholder="Transaction ID, check number, etc."
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNumber || ''}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              placeholder="INV-2024-0001"
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              rows={2}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-background border border-border text-foreground px-4 py-2 rounded hover:bg-background/80"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-primary text-white px-4 py-2 rounded hover:opacity-90">
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
