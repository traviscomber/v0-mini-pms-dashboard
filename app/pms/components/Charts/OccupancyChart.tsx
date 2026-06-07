'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Reservation, Room } from '@/lib/types';

interface OccupancyChartProps {
  reservations: Reservation[];
  rooms: Room[];
}

export default function OccupancyChart({ reservations, rooms }: OccupancyChartProps) {
  // Generate occupancy data for last 30 days
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    const occupiedRooms = reservations.filter(r => {
      const checkIn = new Date(r.check_in_date);
      const checkOut = new Date(r.check_out_date);
      return checkIn <= date && checkOut > date;
    }).length;
    
    const occupancyRate = rooms.length > 0 ? ((occupiedRooms / rooms.length) * 100).toFixed(1) : 0;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      occupancy: parseFloat(occupancyRate as string),
    };
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Occupancy Rate (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-foreground-muted)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--color-foreground-muted)"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            formatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
            formatter={(value) => `${value}%`}
          />
          <Area 
            type="monotone" 
            dataKey="occupancy" 
            stroke="var(--color-primary)" 
            fillOpacity={1}
            fill="url(#colorOccupancy)"
            name="Occupancy %"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
