'use client';

import { useState } from 'react';
import { Guest, Language } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';

interface GuestFormProps {
  guest?: Guest;
  onSave: (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function GuestForm({ guest, onSave, onCancel }: GuestFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    nationality: guest?.nationality || '',
    idType: guest?.idType || 'passport',
    idNumber: guest?.idNumber || '',
    preferredLanguage: (guest?.preferredLanguage as Language) || 'en',
    isVIP: guest?.isVIP || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGuest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nationality: formData.nationality,
      idType: formData.idType,
      idNumber: formData.idNumber,
      preferredLanguage: formData.preferredLanguage,
      isVIP: formData.isVIP,
      totalBookings: guest?.totalBookings || 0,
      totalSpent: guest?.totalSpent || 0,
    };

    onSave(newGuest);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-foreground">
            {guest ? t('common.edit') : t('common.create')} Guest
          </h2>
          <button onClick={onCancel} className="text-foreground/60 hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Guest Name and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone and Nationality */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1-555-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="USA"
              />
            </div>
          </div>

          {/* ID Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Type</label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver&apos;s License</option>
                <option value="national_id">National ID</option>
                <option value="visa">Visa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ID Number</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ABC123456"
              />
            </div>
          </div>

          {/* Preferred Language and VIP Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Preferred Language</label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as Language })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVIP}
                  onChange={(e) => setFormData({ ...formData, isVIP: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-foreground">VIP Guest</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-foreground border border-border rounded-md hover:bg-background/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Save Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
