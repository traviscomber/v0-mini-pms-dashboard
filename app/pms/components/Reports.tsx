'use client';

interface ReportsProps {
  reservations: any[];
}

export default function Reports({ reservations }: ReportsProps) {
  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  
  const revenueByChannel = reservations.reduce((acc, r) => {
    acc[r.source] = (acc[r.source] || 0) + r.totalPrice;
    return acc;
  }, {} as Record<string, number>);

  const totalNights = reservations.reduce((sum, r) => {
    const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return sum + nights;
  }, 0);

  const pendingPayments = reservations.filter(r => r.paymentStatus === 'Pending').reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-600">${totalRevenue.toFixed(0)}</p>
          <p className="text-sm text-slate-500 mt-2">{reservations.length} reservations</p>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Pending Payments</h3>
          <p className="text-4xl font-bold text-red-600">${pendingPayments.toFixed(0)}</p>
          <p className="text-sm text-slate-500 mt-2">{reservations.filter(r => r.paymentStatus === 'Pending').length} unpaid bookings</p>
        </div>

        {/* Total Nights */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Total Nights Booked</h3>
          <p className="text-4xl font-bold text-blue-600">{totalNights}</p>
          <p className="text-sm text-slate-500 mt-2">{(totalNights / 30).toFixed(1)} months of occupancy</p>
        </div>

        {/* Average Booking Value */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">Average Booking</h3>
          <p className="text-4xl font-bold text-purple-600">${reservations.length > 0 ? (totalRevenue / reservations.length).toFixed(0) : 0}</p>
          <p className="text-sm text-slate-500 mt-2">per reservation</p>
        </div>
      </div>

      {/* Revenue by Channel */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Revenue by Channel</h3>
        <div className="space-y-3">
          {Object.entries(revenueByChannel).map(([channel, revenue]) => {
            const percentage = (revenue / totalRevenue) * 100;
            return (
              <div key={channel}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">{channel}</span>
                  <span className="text-sm font-bold text-slate-900">${revenue.toFixed(0)} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Paid', 'Partial', 'Pending'].map(status => {
          const count = reservations.filter(r => r.paymentStatus === status).length;
          const revenue = reservations.filter(r => r.paymentStatus === status).reduce((sum, r) => sum + r.totalPrice, 0);
          const colors = { Paid: 'text-green-600 bg-green-50', Partial: 'text-yellow-600 bg-yellow-50', Pending: 'text-red-600 bg-red-50' };
          return (
            <div key={status} className={`p-6 rounded-lg border border-slate-200 ${colors[status as keyof typeof colors]}`}>
              <p className="text-sm font-medium text-slate-700 mb-2">{status}</p>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm mt-2">${revenue.toFixed(0)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
