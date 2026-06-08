'use client';

import { useOccupancyAlerts, useOccupancyTrends } from '../hooks/useOccupancyAlerts';
import { useDynamicPricing, usePricingForecast } from '../hooks/useDynamicPricing';
import { useGuestNotifications } from '../hooks/useGuestNotifications';
import { AlertCircle, TrendingUp, DollarSign, Mail, Calendar } from 'lucide-react';

export default function SmartManagementHub({ rooms = [], reservations = [], tasks = [] }: any) {
  const occupancy = useOccupancyAlerts(rooms, reservations);
  const trends = useOccupancyTrends(reservations);
  const dynamicPricing = useDynamicPricing(rooms, reservations);
  const pricingForecast = usePricingForecast(rooms, reservations);
  const { notifications, totalPending } = useGuestNotifications(reservations, tasks);

  return (
    <div className="space-y-6">
      {/* Alertas de Occupancy */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-foreground">Alertas de Occupancy</h2>
        </div>

        {occupancy.alerts.length > 0 ? (
          <div className="space-y-3">
            {occupancy.alerts.map((alert: any) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.level === 3
                    ? 'bg-red-500/10 border-red-500 text-red-700'
                    : alert.level === 2
                    ? 'bg-yellow-500/10 border-yellow-500 text-yellow-700'
                    : 'bg-green-500/10 border-green-500 text-green-700'
                }`}
              >
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm mt-1">{alert.message}</p>
                {alert.action && (
                  <button className="mt-2 text-xs font-semibold underline hover:opacity-70">
                    {alert.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">✅ Occupancy en buen estado</p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-background p-3 rounded">
            <p className="text-foreground/60">Ocupadas</p>
            <p className="text-xl font-bold text-foreground">{occupancy.occupiedRooms}/{occupancy.totalRooms}</p>
          </div>
          <div className="bg-background p-3 rounded">
            <p className="text-foreground/60">% Ocupancy</p>
            <p className="text-xl font-bold text-foreground">{occupancy.occupancyRate}%</p>
          </div>
          <div className="bg-background p-3 rounded">
            <p className="text-foreground/60">Disponibles</p>
            <p className="text-xl font-bold text-foreground">{occupancy.availableRooms}</p>
          </div>
        </div>

        {/* Trends */}
        <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500">
          <p className="text-sm font-semibold text-blue-700">📈 Tendencia</p>
          <p className="text-sm">
            Este mes: <strong>{trends.thisMonth}</strong> reservas | Mes pasado: <strong>{trends.lastMonth}</strong>{' '}
            {trends.trend === 'up' && <span className="text-green-600">↑ {trends.changePercent}%</span>}
            {trends.trend === 'down' && <span className="text-red-600">↓ {trends.changePercent}%</span>}
            {trends.trend === 'stable' && <span className="text-gray-600">= Estable</span>}
          </p>
        </div>
      </section>

      {/* Precios Dinámicos */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-green-500" size={24} />
          <h2 className="text-xl font-bold text-foreground">Precios Dinámicos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {Object.values(dynamicPricing).map((price: any) => (
            <div key={price.roomId} className="bg-background p-4 rounded border border-border">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-foreground">{price.roomName}</p>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    price.recommended === 'Increase'
                      ? 'bg-green-500/20 text-green-700'
                      : price.recommended === 'Decrease'
                      ? 'bg-red-500/20 text-red-700'
                      : 'bg-gray-500/20 text-gray-700'
                  }`}
                >
                  {price.recommended}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  Base: <span className="text-foreground/60">${price.basePrice}</span> →{' '}
                  <span className="font-bold text-foreground">${price.dynamicPrice}</span>
                </p>
                <p className={`${price.priceChange > 0 ? 'text-green-600' : price.priceChange < 0 ? 'text-red-600' : ''}`}>
                  {price.priceChange > 0 ? '+' : ''}{price.priceChange} ({price.percentageChange}%)
                </p>
                <p className="text-foreground/60 text-xs">{price.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Forecast */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">📅 Forecast (7 días)</p>
          <div className="grid grid-cols-7 gap-2">
            {pricingForecast.map((day: any) => (
              <div key={day.date} className={`p-2 rounded text-center text-xs border ${
                day.type === 'weekend'
                  ? 'bg-purple-500/10 border-purple-500'
                  : day.type === 'season'
                  ? 'bg-orange-500/10 border-orange-500'
                  : 'bg-gray-500/10 border-gray-500'
              }`}>
                <p className="font-semibold">{day.dayName}</p>
                <p className="text-foreground/60">×{day.multiplier}</p>
                <p className="text-foreground text-xs mt-1">{day.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notificaciones a Guests */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="text-blue-500" size={24} />
          <h2 className="text-xl font-bold text-foreground">Notificaciones a Guests</h2>
          <span className="ml-auto bg-red-500/20 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
            {totalPending} pendientes
          </span>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notif: any) => (
              <div
                key={notif.id}
                className={`p-4 rounded border-l-4 ${
                  notif.sent
                    ? 'bg-gray-500/5 border-gray-500'
                    : notif.priority >= 2
                    ? 'bg-orange-500/10 border-orange-500'
                    : 'bg-blue-500/10 border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">{notif.subject}</p>
                    <p className="text-xs text-foreground/60 mt-1">👤 {notif.guestName}</p>
                    <p className="text-xs text-foreground/60">📧 {notif.guestEmail}</p>
                    <p className="text-sm mt-2 text-foreground">{notif.message}</p>
                  </div>
                  <div className="text-2xl ml-2">{notif.type === 'confirmation' ? '✅' : notif.type === 'reminder_48h' ? '📢' : notif.type === 'checkin_instructions' ? '🔑' : notif.type === 'review_request' ? '⭐' : '💳'}</div>
                </div>
                {!notif.sent && (
                  <button className="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-semibold">
                    Enviar Ahora
                  </button>
                )}
                {notif.sent && <p className="text-xs text-gray-500 mt-2">✓ Enviado</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Todas las notificaciones están enviadas</p>
        )}
      </section>
    </div>
  );
}
