import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CancellationInput {
  daysSinceBooking: number;
  daysUntilArrival: number;
  numberOfGuests: number;
  totalPrice: number;
  reservationSource: string;
  guestHistoryBookings?: number;
  guestHistoryCancellations?: number;
  seasonality: 'low' | 'medium' | 'high' | 'peak';
}

export async function POST(request: NextRequest) {
  try {
    const body: CancellationInput = await request.json();

    const prompt = `Analyze cancellation risk for a hotel reservation:

Days Since Booking: ${body.daysSinceBooking}
Days Until Arrival: ${body.daysUntilArrival}
Guests: ${body.numberOfGuests}
Price: $${body.totalPrice}
Source: ${body.reservationSource}
Guest Bookings: ${body.guestHistoryBookings || 0}
Guest Cancellations: ${body.guestHistoryCancellations || 0}
Season: ${body.seasonality}

Respond with ONLY this JSON (no markdown):
{"riskPercentage": 25, "riskLevel": "medium", "action": "send reminder", "factors": "early booking"}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [{role: 'user', content: prompt}],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response');

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      riskPercentage: result.riskPercentage,
      riskLevel: result.riskLevel,
      recommendedAction: result.action,
      keyFactors: result.factors.split(',').map((f: string) => f.trim()),
      shouldOverbookBy: result.riskPercentage > 50 ? Math.ceil(body.numberOfGuests * (result.riskPercentage / 100)) : 0,
    });
  } catch (error) {
    console.error('[AI] Cancellation error:', error);
    return NextResponse.json({success: false, error: 'Prediction failed'}, {status: 500});
  }
}
