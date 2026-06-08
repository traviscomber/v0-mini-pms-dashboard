'use client';

import { useMemo } from 'react';

/**
 * Hook para precios dinámicos automáticos
 * Algoritmo simple pero efectivo:
 * - Base price × demand multiplier (occupancy %)
 * - Base price × day-of-week multiplier (weekend +30%)
 * - Base price × season multiplier
 * - Base price × advance-booking discount (book 30+ days: -15%)
 */
export function useDynamicPricing(rooms: any[] = [], reservations: any[] = []) {
  const today = new Date();

  const dynamicPrices = useMemo(() => {
    if (!rooms.length) return {};

    const prices: Record<string, any> = {};

    rooms.forEach(room => {
      const basePrice = room.basePrice || 100;

      // 1. Occupancy-based multiplier (0.8x to 1.5x)
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(r => r.status === 'reserved').length;
      const occupancyRate = totalRooms ? occupiedRooms / totalRooms : 0;
      const occupancyMultiplier = 0.8 + occupancyRate * 0.7; // 0.8 - 1.5x

      // 2. Day-of-week multiplier (weekday: 1.0x, weekend: 1.3x)
      const dayOfWeek = today.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayMultiplier = isWeekend ? 1.3 : 1.0;

      // 3. Season multiplier (summer/holidays: 1.4x, low season: 0.85x)
      const month = today.getMonth();
      const isSeason = month >= 5 && month <= 8; // Jun-Sep
      const seasonMultiplier = isSeason ? 1.4 : 0.85;

      // 4. Advanced booking discount (book 30+ days ahead: -15%)
      const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const hasAdvanceBooking = reservations.some(r => {
        const checkIn = new Date(r.checkInDate);
        return checkIn >= nextMonthStart;
      });
      const advanceDiscount = hasAdvanceBooking ? 0.85 : 1.0; // -15% if booking 30+ days

      // Calculate final price
      const finalPrice = Math.round(
        basePrice * occupancyMultiplier * dayMultiplier * seasonMultiplier * advanceDiscount
      );

      prices[room.id] = {
        roomId: room.id,
        roomName: room.name.en || room.name,
        basePrice,
        dynamicPrice: finalPrice,
        multipliers: {
          occupancy: occupancyMultiplier.toFixed(2),
          dayOfWeek: dayMultiplier.toFixed(2),
          season: seasonMultiplier.toFixed(2),
          advance: advanceDiscount.toFixed(2),
        },
        priceChange: finalPrice - basePrice,
        percentageChange: Math.round(((finalPrice - basePrice) / basePrice) * 100),
        reason: getPriceReason(occupancyMultiplier, dayMultiplier, seasonMultiplier, advanceDiscount),
        recommended: finalPrice > basePrice ? 'Increase' : finalPrice < basePrice ? 'Decrease' : 'Keep',
      };
    });

    return prices;
  }, [rooms, reservations, today]);

  return dynamicPrices;
}

/**
 * Explain why price changed
 */
function getPriceReason(
  occupancy: number,
  dayOfWeek: number,
  season: number,
  advance: number
): string {
  const reasons = [];

  if (occupancy > 1.2) reasons.push('Alta demanda');
  if (occupancy < 1.0) reasons.push('Baja ocupancy');
  if (dayOfWeek > 1) reasons.push('Fin de semana');
  if (season > 1) reasons.push('Temporada alta');
  if (advance < 1) reasons.push('Descuento early-bird');

  return reasons.length ? reasons.join(' + ') : 'Precio estable';
}

/**
 * Get pricing recommendations for next 7 days
 */
export function usePricingForecast(rooms: any[] = [], reservations: any[] = []) {
  const forecast = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      const month = date.getMonth();

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSeason = month >= 5 && month <= 8;

      const baseMultiplier = (isWeekend ? 1.3 : 1.0) * (isSeason ? 1.4 : 0.85);

      days.push({
        date: date.toISOString().split('T')[0],
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
        multiplier: baseMultiplier.toFixed(2),
        type: isWeekend ? 'weekend' : isSeason ? 'season' : 'regular',
        recommendation: baseMultiplier > 1.2 ? 'Raise prices' : baseMultiplier < 1.0 ? 'Lower prices' : 'Keep stable',
      });
    }

    return days;
  }, [rooms, reservations]);

  return forecast;
}
