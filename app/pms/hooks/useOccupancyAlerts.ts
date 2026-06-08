'use client';

import { useMemo } from 'react';

/**
 * Hook para generar alertas automáticas basadas en ocupancy
 * - Occupancy < 30%: Critical alert
 * - Occupancy 30-50%: Warning alert
 * - Ocupancy > 70%: Good! No alert
 */
export function useOccupancyAlerts(rooms: any[] = [], reservations: any[] = []) {
  const today = new Date().toISOString().split('T')[0];

  const occupancyMetrics = useMemo(() => {
    if (!rooms.length) return { occupancyRate: 0, occupiedRooms: 0, availableRooms: 0, alerts: [] };

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => room.status === 'reserved').length;
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

    const alerts = [];

    // Alerta crítica: Menos del 30% de ocupancy
    if (occupancyRate < 30) {
      alerts.push({
        id: 'occupancy-critical',
        type: 'critical',
        level: 3,
        title: `📉 Ocupancy Muy Baja: ${occupancyRate}%`,
        message: `Solo ${occupiedRooms}/${totalRooms} habitaciones ocupadas. Considera promociones.`,
        timestamp: new Date(),
        action: 'Crear Promoción',
        actionUrl: '#promotions',
      });
    }

    // Alerta warning: 30-50% de occupancy
    if (occupancyRate >= 30 && occupancyRate < 50) {
      alerts.push({
        id: 'occupancy-warning',
        type: 'warning',
        level: 2,
        title: `⚠️ Ocupancy Baja: ${occupancyRate}%`,
        message: `${occupiedRooms}/${totalRooms} habitaciones ocupadas. Considera descuentos.`,
        timestamp: new Date(),
        action: 'Ver Descuentos',
        actionUrl: '#pricing',
      });
    }

    // Info: Occupancy buena
    if (occupancyRate >= 70) {
      alerts.push({
        id: 'occupancy-good',
        type: 'info',
        level: 1,
        title: `✅ Ocupancy Excelente: ${occupancyRate}%`,
        message: `¡Buen desempeño! ${occupiedRooms}/${totalRooms} habitaciones ocupadas.`,
        timestamp: new Date(),
        dismissible: true,
      });
    }

    return {
      occupancyRate,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      totalRooms,
      alerts,
    };
  }, [rooms, reservations]);

  return occupancyMetrics;
}

/**
 * Hook para sugerencias de ocupancy basadas en temporadas
 */
export function useOccupancyTrends(reservations: any[] = []) {
  const trends = useMemo(() => {
    if (!reservations.length) return { thisMonth: 0, lastMonth: 0, trend: 'stable' };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonth = reservations.filter(r => {
      const date = new Date(r.checkInDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const lastMonth = reservations.filter(r => {
      const date = new Date(r.checkInDate);
      const lastMonthDate = new Date(currentYear, currentMonth - 1);
      return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    return {
      thisMonth,
      lastMonth,
      trend: thisMonth > lastMonth ? 'up' : thisMonth < lastMonth ? 'down' : 'stable',
      changePercent: lastMonth ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0,
    };
  }, [reservations]);

  return trends;
}
