'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Download, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
];

const channelData = [
  { name: 'Booking.com', value: 45000 },
  { name: 'Airbnb', value: 38000 },
  { name: 'Direct', value: 22000 },
  { name: 'VRBO', value: 15000 },
];

const COLORS = ['#3b82f6', '#f43f5e', '#8b5cf6', '#06b6d4'];

export default function FinancialReports() {
  const [dateRange, setDateRange] = useState('6months');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, d) => sum + d.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const occupancyRate = 78;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-foreground/60">Track your property's financial performance and revenue analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-foreground/60">Total Revenue</p>
          <p className="text-3xl font-bold text-primary mt-2">${(totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-green-600 mt-1">+12% vs last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-foreground/60">Total Expenses</p>
          <p className="text-3xl font-bold text-red-500 mt-2">${(totalExpenses / 1000).toFixed(1)}K</p>
          <p className="text-xs text-red-600 mt-1">+5% vs last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-foreground/60">Net Income</p>
          <p className="text-3xl font-bold text-accent mt-2">${(netIncome / 1000).toFixed(1)}K</p>
          <p className="text-xs text-green-600 mt-1">+18% vs last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-foreground/60">Profit Margin</p>
          <p className="text-3xl font-bold mt-2">
            {((netIncome / totalRevenue) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-foreground/60 mt-1">Health status: Excellent</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-foreground/60" />
          <span className="font-medium">Period:</span>
        </div>
        <div className="flex gap-2">
          {['1month', '3months', '6months', '1year'].map(period => (
            <button
              key={period}
              onClick={() => setDateRange(period)}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                dateRange === period
                  ? 'bg-primary text-foreground'
                  : 'bg-background border border-border hover:border-primary/50'
              }`}
            >
              {period === '1month' && '1 Month'}
              {period === '3months' && '3 Months'}
              {period === '6months' && '6 Months'}
              {period === '1year' && '1 Year'}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded text-sm font-medium hover:bg-primary/20 transition">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Revenue vs Expenses Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-foreground-60)" />
            <YAxis stroke="var(--color-foreground-60)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--color-destructive)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Channel */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Revenue by Channel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Channel Performance</h2>
          <div className="space-y-3">
            {channelData.map((channel, idx) => {
              const percentage = (channel.value / channelData.reduce((sum, c) => sum + c.value, 0)) * 100;
              return (
                <div key={channel.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{channel.name}</span>
                    <span className="text-sm font-semibold">${(channel.value / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[idx],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Details Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Monthly Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">Month</th>
                <th className="text-right px-6 py-3 font-semibold">Revenue</th>
                <th className="text-right px-6 py-3 font-semibold">Expenses</th>
                <th className="text-right px-6 py-3 font-semibold">Net Income</th>
                <th className="text-right px-6 py-3 font-semibold">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {revenueData.map((row) => {
                const netIncome = row.revenue - row.expenses;
                const margin = ((netIncome / row.revenue) * 100).toFixed(1);
                return (
                  <tr key={row.month} className="hover:bg-background/30 transition">
                    <td className="px-6 py-3">{row.month}</td>
                    <td className="text-right px-6 py-3 font-medium text-primary">${row.revenue.toLocaleString()}</td>
                    <td className="text-right px-6 py-3 font-medium text-red-500">${row.expenses.toLocaleString()}</td>
                    <td className="text-right px-6 py-3 font-bold text-accent">${netIncome.toLocaleString()}</td>
                    <td className="text-right px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        Number(margin) > 50 ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-primary mb-2">Financial Insights</h3>
            <ul className="text-sm text-foreground/70 space-y-1">
              <li>• Revenue increased 12% compared to last period - strong growth trajectory</li>
              <li>• Booking.com is your top revenue channel at 45% of total income</li>
              <li>• Current profit margin of {((netIncome / totalRevenue) * 100).toFixed(1)}% is above industry average</li>
              <li>• Expenses are trending up - consider optimizing operational costs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
