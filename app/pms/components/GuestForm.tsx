'use client';

import { useState } from 'react';
import { Guest } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';

interface GuestFormProps {
  guest?: Guest;
  propertyId?: string;
  onSubmit: (guest: Guest) => void;
  onCancel: () => void;
}

export default function GuestForm({ guest, propertyId, onSubmit, onCancel }: GuestFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Guest>(
    guest || {
      id: `guest-${Date.now()}`,
      propertyId,
      name: '',
      email: '',
      phone: '',
      totalBookings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
    }));
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
            {guest ? t('crud.update') : t('crud.create')} {t('guests.title')}
          </h2>
          <button onClick={onCancel} className="text-foreground/60 hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t('guests.guestName')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('guests.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t('guests.phone')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality || ''}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                ID Number
              </label>
              <input
                type="text"
                value={formData.idNumber || ''}
                onChange={(e) => handleChange('idNumber', e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isVIP || false}
                onChange={(e) => handleChange('isVIP', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-foreground">VIP Guest</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-background border border-border text-foreground px-4 py-2 rounded hover:bg-background/80"
            >
              {t('crud.cancel')}
            </button>
            <button type="submit" className="flex-1 bg-primary text-white px-4 py-2 rounded hover:opacity-90">
              {t('crud.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
