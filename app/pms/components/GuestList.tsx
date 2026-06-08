'use client';

import { Guest } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { Edit2, Trash2, User, Star } from 'lucide-react';

interface GuestListProps {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function GuestList({ guests, onEdit, onDelete, onAdd }: GuestListProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('guests.title')}</h1>
          <p className="text-foreground/60">{t('guests.subtitle')}</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {t('crud.add')} {t('guests.title')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">{t('guests.guestName')}</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">{t('guests.email')}</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">{t('guests.phone')}</th>
              <th className="text-center py-3 px-4 font-semibold text-foreground">{t('guests.totalBookings')}</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="border-b border-border hover:bg-background/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {guest.isVIP && <Star className="w-4 h-4 text-yellow-400" />}
                    <User className="w-4 h-4 text-foreground/60" />
                    <span className="text-foreground font-medium">{guest.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground/70">{guest.email}</td>
                <td className="py-3 px-4 text-foreground/70">{guest.phone}</td>
                <td className="py-3 px-4 text-center text-foreground">{guest.totalBookings}</td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(guest)}
                    className="p-2 hover:bg-blue-500/20 rounded transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-300" />
                  </button>
                  <button
                    onClick={() => onDelete(guest.id)}
                    className="p-2 hover:bg-red-500/20 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-300" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {guests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">{t('crud.noResults')}</p>
        </div>
      )}
    </div>
  );
}
