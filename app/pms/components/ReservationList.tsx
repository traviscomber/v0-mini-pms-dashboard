'use client';

import { Trash2 } from 'lucide-react';
import { useLanguageStore as useLanguage } from '../store/languageStore';

interface ReservationListProps {
  reservations: any[];
  onDelete: (id: string) => void;
}

const badgeColor = (type: string, value: string) => {
  const colors: Record<string, Record<string, string>> = {
    payment: { Paid: 'bg-green-500/20 text-green-300', Partial: 'bg-orange-500/20 text-orange-300', Pending: 'bg-red-500/20 text-red-300' },
    cleaning: { Clean: 'bg-green-500/20 text-green-300', 'Needs cleaning': 'bg-orange-500/20 text-orange-300', 'In progress': 'bg-blue-500/20 text-blue-300' },
    source: { Direct: 'bg-blue-500/20 text-blue-300', 'Booking.com': 'bg-orange-500/20 text-orange-300', Airbnb: 'bg-red-500/20 text-red-300', Website: 'bg-green-500/20 text-green-300', Phone: 'bg-purple-500/20 text-purple-300' },
  };
  return colors[type]?.[value] || 'bg-foreground/10 text-foreground/70';
};

export default function ReservationList({ reservations, onDelete }: ReservationListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-card/50 border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t('reservations.guestName')}</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t('reservations.room')}</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t('reservations.dates')}</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">{t('reservations.source')}</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">{t('reservations.payment')}</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">{t('reservations.cleaning')}</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">{t('reservations.total')}</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">{t('reservations.action')}</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr><td colSpan={8} className="px-4 py-8 text-center text-foreground/50">{t('reservations.noReservations')}</td></tr>
          ) : (
            reservations.map((res, idx) => (
              <tr key={res.id} className={idx % 2 === 0 ? 'bg-card' : 'bg-card/50'}>
                <td className="px-4 py-3 text-foreground font-medium">{res.guestName}</td>
                <td className="px-4 py-3 text-foreground/80">{res.roomId}</td>
                <td className="px-4 py-3 text-foreground/80 text-xs">{res.checkIn} → {res.checkOut}</td>
                <td className="px-4 py-3 text-center"><span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor('source', res.source)}`}>{res.source}</span></td>
                <td className="px-4 py-3 text-center"><span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor('payment', res.paymentStatus)}`}>{res.paymentStatus}</span></td>
                <td className="px-4 py-3 text-center"><span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor('cleaning', res.cleaningStatus)}`}>{res.cleaningStatus}</span></td>
                <td className="px-4 py-3 text-right text-foreground font-bold">${res.totalPrice}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => onDelete(res.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
