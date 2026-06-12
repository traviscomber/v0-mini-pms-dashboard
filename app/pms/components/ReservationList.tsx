'use client';

import { Reservation } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { Edit2, Trash2, Calendar, User } from 'lucide-react';
import { formatDate } from '../lib/date-utils';

interface ReservationListProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function ReservationList({ reservations, onEdit, onDelete, onAdd }: ReservationListProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-500/20 text-green-300',
      pending: 'bg-yellow-500/20 text-yellow-300',
      cancelled: 'bg-red-500/20 text-red-300',
      completed: 'bg-blue-500/20 text-blue-300',
    };
    return colors[status] || 'bg-card/500/20 text-foreground/50';
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('reservations.title')}</h1>
          <p className="text-foreground/60">{t('reservations.subtitle')}</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {t('crud.add')} {t('reservations.title')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Guest</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Dates</th>
              <th className="text-center py-3 px-4 font-semibold text-foreground">Status</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Amount</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="border-b border-border hover:bg-background/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-foreground/60" />
                    <div>
                      <p className="text-foreground font-medium">{res.guestName}</p>
                      <p className="text-xs text-foreground/60">{res.guestEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-foreground/70">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(res.checkInDate)} - {formatDate(res.checkOutDate)}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(res.reservationStatus)}`}>
                    {res.reservationStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-foreground">
                  ${res.totalAmount}
                </td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(res)}
                    className="p-2 hover:bg-blue-500/20 rounded transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-300" />
                  </button>
                  <button
                    onClick={() => onDelete(res.id)}
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

      {reservations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">{t('crud.noResults')}</p>
        </div>
      )}
    </div>
  );
}
