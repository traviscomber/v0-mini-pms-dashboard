'use client';

import { Trash2 } from 'lucide-react';

interface ReservationListProps {
  reservations: any[];
  onDelete: (id: string) => void;
}

const badgeColor = (type: string, value: string) => {
  const colors: Record<string, Record<string, string>> = {
    payment: { Paid: 'bg-green-100 text-green-800', Partial: 'bg-yellow-100 text-yellow-800', Pending: 'bg-red-100 text-red-800' },
    cleaning: { Clean: 'bg-green-100 text-green-800', 'Needs cleaning': 'bg-orange-100 text-orange-800', 'In progress': 'bg-blue-100 text-blue-800' },
    source: { Direct: 'bg-blue-100 text-blue-800', 'Booking.com': 'bg-yellow-100 text-yellow-800', Airbnb: 'bg-red-100 text-red-800', Website: 'bg-green-100 text-green-800', Phone: 'bg-purple-100 text-purple-800' },
  };
  return colors[type]?.[value] || 'bg-gray-100 text-gray-800';
};

export default function ReservationList({ reservations, onDelete }: ReservationListProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">Guest</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">Room</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-900">Dates</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-900">Source</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-900">Payment</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-900">Cleaning</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-900">Total</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-900">Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No reservations yet</td></tr>
          ) : (
            reservations.map((res, idx) => (
              <tr key={res.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 text-slate-900 font-medium">{res.guestName}</td>
                <td className="px-4 py-3 text-slate-700">{res.roomId}</td>
                <td className="px-4 py-3 text-slate-700 text-xs">{res.checkIn} → {res.checkOut}</td>
                <td className="px-4 py-3 text-center"><span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor('source', res.source)}`}>{res.source}</span></td>
                <td className="px-4 py-3 text-center"><span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor('payment', res.paymentStatus)}`}>{res.paymentStatus}</span></td>
                <td className="px-4 py-3 text-center"><span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor('cleaning', res.cleaningStatus)}`}>{res.cleaningStatus}</span></td>
                <td className="px-4 py-3 text-right text-slate-900 font-bold">${res.totalPrice}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => onDelete(res.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
