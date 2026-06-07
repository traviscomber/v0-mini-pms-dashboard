'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Reservation } from '@/lib/types';

interface BookingChartProps {
  reservations: Reservation[];
}

const COLORS = {
  confirmed: 'var(--color-primary)',
  pending: 'var(--color-accent)',
  checked_in: 'var(--color-secondary)',
  checked_out: '#888888',
  cancelled: '#ef4444',
};

export default function BookingChart({ reservations }: BookingChartProps) {
  const data = [
    {
      name: 'Confirmed',
      value: reservations.filter(r => r.status === 'confirmed').length,
      status: 'confirmed',
    },
    {
      name: 'Pending',
      value: reservations.filter(r => r.status === 'pending').length,
      status: 'pending',
    },
    {
      name: 'Checked In',
      value: reservations.filter(r => r.status === 'checked_in').length,
      status: 'checked_in',
    },
    {
      name: 'Checked Out',
      value: reservations.filter(r => r.status === 'checked_out').length,
      status: 'checked_out',
    },
    {
      name: 'Cancelled',
      value: reservations.filter(r => r.status === 'cancelled').length,
      status: 'cancelled',
    },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Booking Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.status as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
            formatter={(value) => `${value} bookings`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
