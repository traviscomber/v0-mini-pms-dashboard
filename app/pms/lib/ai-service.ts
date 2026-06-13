'use server';

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { EXECUTION_MODEL } from './agent-config';

export async function predictPricing(params: {
  basePrice: number;
  occupancyRate: number;
  dayOfWeek: number;
  season: string;
  daysUntilBooking: number;
}) {
  const prompt = `You are a hotel revenue management expert. Analyze this pricing scenario and recommend the optimal price.

Base Price: $${params.basePrice}
Occupancy Rate: ${params.occupancyRate}%
Day of Week: ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][params.dayOfWeek]}
Season: ${params.season}
Days Until Booking: ${params.daysUntilBooking}

Return ONLY valid JSON:
{"recommendedPrice": number, "confidence": number, "reasoning": "string", "priceChangePercent": number}`;

  try {
    const { text } = await generateText({
      model: openai(EXECUTION_MODEL),
      prompt,
      temperature: 0.7,
    });

    const result = JSON.parse(text);
    return { success: true, data: result };
  } catch (error) {
    console.error('Pricing prediction error:', error);
    return { success: false, error: 'Failed to predict pricing' };
  }
}

export async function predictCancellation(params: {
  daysUntilArrival: number;
  advanceBookingDays: number;
  guestCancellationRate: number;
  bookingSource: string;
  depositPaid: boolean;
}) {
  const prompt = `You are a hotel risk assessment expert. Analyze cancellation risk for this reservation.

Days Until Arrival: ${params.daysUntilArrival}
Advance Booking: ${params.advanceBookingDays} days
Guest Cancellation History: ${(params.guestCancellationRate * 100).toFixed(1)}%
Booking Source: ${params.bookingSource}
Deposit Paid: ${params.depositPaid ? 'Yes' : 'No'}

Return ONLY valid JSON:
{"cancellationRisk": number, "riskLevel": "low|medium|high|critical", "reasoning": "string", "recommendedActions": ["action1", "action2"]}`;

  try {
    const { text } = await generateText({
      model: openai(EXECUTION_MODEL),
      prompt,
      temperature: 0.6,
    });

    const result = JSON.parse(text);
    return { success: true, data: result };
  } catch (error) {
    console.error('Cancellation prediction error:', error);
    return { success: false, error: 'Failed to predict cancellation' };
  }
}

export async function forecastRevenue(params: {
  lastMonth: number;
  last3Months: number[];
  occupiedDays: number;
  totalDays: number;
  bookingTrend: 'increasing' | 'stable' | 'declining';
}) {
  const avgLast3 = params.last3Months.reduce((a, b) => a + b, 0) / 3;
  
  const prompt = `You are a hotel revenue analyst. Forecast next month's revenue.

Last Month: $${params.lastMonth}
3-Month Average: $${avgLast3.toFixed(2)}
Current Occupancy: ${((params.occupiedDays / params.totalDays) * 100).toFixed(1)}%
Booking Trend: ${params.bookingTrend}

Return ONLY valid JSON:
{"forecastedRevenue": number, "confidence": number, "upside": number, "downside": number, "recommendations": ["rec1", "rec2"]}`;

  try {
    const { text } = await generateText({
      model: openai(EXECUTION_MODEL),
      prompt,
      temperature: 0.5,
    });

    const result = JSON.parse(text);
    return { success: true, data: result };
  } catch (error) {
    console.error('Revenue forecast error:', error);
    return { success: false, error: 'Failed to forecast revenue' };
  }
}
