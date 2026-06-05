'use client';

import { Users, TrendingUp, DollarSign, AlertCircle, LogIn, LogOut } from 'lucide-react';

interface DashboardProps {
  rooms: any[];
  reservations: any[];
}

export default function Dashboard({ rooms, reservations }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const occupiedNights = reservations.reduce((sum, r) => {
    const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return sum + nights;
  }, 0);
  const totalPossibleNights = rooms.length * 365;
  const occupancyRate = ((occupiedNights / totalPossibleNights) * 100).toFixed(1);
  
  const pendingPayments = reservations.filter(r => r.paymentStatus === 'Pending').length;
  const checkIns = reservations.filter(r => r.checkIn === today).length;
  const checkOuts = reservations.filter(r => r.checkOut === today).length;

  const StatCard = ({ icon: Icon, title, value, unit = '' }: any) => (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}{unit}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-lg text-primary">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} title="Total Reservations" value={reservations.length} />
        <StatCard icon={TrendingUp} title="Occupancy Rate" value={occupancyRate} unit="%" />
        <StatCard icon={DollarSign} title="Monthly Revenue" value={`$${totalRevenue}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={AlertCircle} title="Pending Payments" value={pendingPayments} />
        <StatCard icon={LogIn} title="Check-ins Today" value={checkIns} />
        <StatCard icon={LogOut} title="Check-outs Today" value={checkOuts} />
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {checkIns > 0 && (
            <p className="flex items-center gap-2 text-foreground/80">
              <LogIn className="text-green-600" size={18} />
              <strong>{checkIns}</strong> check-in(s) today
            </p>
          )}
          {checkOuts > 0 && (
            <p className="flex items-center gap-2 text-foreground/80">
              <LogOut className="text-orange-600" size={18} />
              <strong>{checkOuts}</strong> check-out(s) today
            </p>
          )}
          {pendingPayments > 0 && (
            <p className="flex items-center gap-2 text-foreground/80">
              <AlertCircle className="text-red-600" size={18} />
              <strong>{pendingPayments}</strong> pending payment(s)
            </p>
          )}
          {checkIns === 0 && checkOuts === 0 && pendingPayments === 0 && (
            <p className="text-foreground/50">No events for today</p>
          )}
        </div>
      </div>
    </div>
  );
}
