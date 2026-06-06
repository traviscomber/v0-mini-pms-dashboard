'use client';

import { memo } from 'react';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface OccupancyForecastProps {
  rooms: any[];
  reservations: any[];
}

const OccupancyForecast = memo(({ rooms, reservations }: OccupancyForecastProps) => {
  const { t } = useLanguage();
  const generateForecast = () => {
    const forecast = [];
    const startDate = new Date('2026-06-06');
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const bookingsOnDate = reservations.filter(r => {
        const checkIn = new Date(r.checkInDate);
        const checkOut = new Date(r.checkOutDate);
        return checkIn <= date && checkOut > date;
      }).length;
      
      const occupancyPercent = Math.round((bookingsOnDate / rooms.length) * 100);
      
      forecast.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        occupancy: occupancyPercent,
        bookings: bookingsOnDate,
      });
    }
    
    return forecast;
  };

  const forecast = generateForecast();
  const avgOccupancy = Math.round(forecast.reduce((a, b) => a + b.occupancy, 0) / forecast.length);
  const maxOccupancy = Math.max(...forecast.map(f => f.occupancy));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <TrendingUp className="text-accent" />
        {t('forecast.occupancyForecast')}
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="text-sm text-foreground/60">{t('forecast.avgOccupancy')}</p>
          <p className="text-3xl font-bold text-primary">{avgOccupancy}%</p>
        </div>
        <div className="p-4 bg-accent/10 rounded-lg">
          <p className="text-sm text-foreground/60">{t('forecast.peakOccupancy')}</p>
          <p className="text-3xl font-bold text-accent">{maxOccupancy}%</p>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <p className="text-sm text-foreground/60">{t('forecast.totalRooms')}</p>
          <p className="text-3xl font-bold text-secondary">{rooms.length}</p>
        </div>
      </div>

      {/* Forecast Chart (CSS-based) */}
      <div className="space-y-3">
        <p className="text-sm text-foreground/60">{t('forecast.dailyOccupancyRate')}</p>
        <div className="space-y-2">
          {forecast.map((day, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-foreground/50 w-12">{day.date}</span>
              <div className="flex-1 h-6 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                  style={{ width: `${day.occupancy}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-foreground w-12 text-right">{day.occupancy}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <p className="font-semibold text-foreground mb-2">Smart Recommendations</p>
        <ul className="text-sm text-foreground/80 space-y-1">
          {avgOccupancy < 50 && <li>• Consider lowering prices to boost bookings</li>}
          {avgOccupancy > 80 && <li>• Consider raising prices for better margins</li>}
          {maxOccupancy === 100 && <li>• All rooms fully booked some days - excellent demand!</li>}
          <li>• Schedule maintenance during low-occupancy periods</li>
        </ul>
      </div>
    </div>
  );
});

OccupancyForecast.displayName = 'OccupancyForecast';
export default OccupancyForecast;
