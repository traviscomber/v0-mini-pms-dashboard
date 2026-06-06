'use client';

import { memo } from 'react';

// Generate revenue trend data (daily for past 7 days)
const generateRevenueData = (reservations: any[]) => {
  const data: { [key: string]: number } = {};
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data[dateStr] = 0;
  }
  
  reservations.forEach(res => {
    const dateStr = res.checkInDate.split('T')[0];
    if (data[dateStr] !== undefined) {
      data[dateStr] += res.totalPrice;
    }
  });
  
  return Object.entries(data).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.round(revenue),
  }));
};

// Generate occupancy data by room
const generateOccupancyData = (rooms: any[], reservations: any[]) => {
  return rooms.map(room => {
    const bookings = reservations.filter(res => res.roomId === room.id).length;
    return {
      name: room.name.split(' ')[0],
      occupancy: Math.round((bookings / 5) * 100),
    };
  });
};

// Generate booking status breakdown
const generateBookingStatusData = (reservations: any[]) => {
  const statuses = {
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    completed: reservations.filter(r => r.status === 'completed').length,
  };
  
  return [
    { name: 'Confirmed', value: statuses.confirmed },
    { name: 'Pending', value: statuses.pending },
    { name: 'Completed', value: statuses.completed },
  ];
};

interface ChartsProps {
  reservations: any[];
  rooms: any[];
}

const DashboardCharts = memo(({ reservations, rooms }: ChartsProps) => {
  const revenueData = generateRevenueData(reservations);
  const occupancyData = generateOccupancyData(rooms, reservations);
  const statusData = generateBookingStatusData(reservations);
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
        <div className="space-y-3">
          {revenueData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-foreground/60">{item.date}</span>
                <span className="font-semibold text-foreground">${item.revenue}</span>
              </div>
              <div className="w-full bg-card/50 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Occupancy by Room */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Occupancy by Room</h3>
        <div className="space-y-3">
          {occupancyData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-foreground/60">{item.name}</span>
                <span className="font-semibold text-foreground">{item.occupancy}%</span>
              </div>
              <div className="w-full bg-card/50 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.occupancy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Booking Status</h3>
        <div className="space-y-4">
          {statusData.map((item, idx) => {
            const colors = ['bg-primary', 'bg-accent', 'bg-foreground/50'];
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground/80">{item.name}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                </div>
                <div className="w-full bg-card/50 rounded-full h-2">
                  <div 
                    className={`${colors[idx]} h-2 rounded-full`}
                    style={{ width: `${Math.max(20, (item.value / Math.max(1, statusData.reduce((a, b) => a + b.value, 0))) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-foreground/60">Avg Revenue</p>
            <p className="text-xl font-bold text-primary">${Math.round(revenueData.reduce((a, b) => a + b.revenue, 0) / Math.max(1, revenueData.length))}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-sm text-foreground/60">Avg Occupancy</p>
            <p className="text-xl font-bold text-accent">{Math.round(occupancyData.reduce((a, b) => a + b.occupancy, 0) / Math.max(1, occupancyData.length))}%</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-foreground/60">Total Bookings</p>
            <p className="text-xl font-bold text-primary">{reservations.length}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <p className="text-sm text-foreground/60">Avg Price/Night</p>
            <p className="text-xl font-bold text-accent">${Math.round(reservations.reduce((a, b) => a + b.totalPrice, 0) / Math.max(1, reservations.length))}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardCharts.displayName = 'DashboardCharts';
export default DashboardCharts;

