'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Reservation } from '@/lib/types';

interface RevenueChartProps {
  reservations: Reservation[];
}

export default function RevenueChart({ reservations }: RevenueChartProps) {
  // Generate last 30 days of revenue data
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const dayRevenue = reservations
      .filter(r => {
        const checkIn = new Date(r.check_in_date);
        return checkIn.toLocaleDateString() === date.toLocaleDateString();
      })
      .reduce((sum, r) => sum + (r.total_amount || 0), 0);
    
    return {
      date: dateStr,
      revenue: dayRevenue,
    };
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-foreground-muted)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--color-foreground-muted)"
            style={{ fontSize: '12px' }}
            formatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
            formatter={(value) => `$${value?.toFixed(2)}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--color-primary)" 
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', r: 4 }}
            activeDot={{ r: 6 }}
            name="Daily Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
