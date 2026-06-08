import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GuestData {
  totalBookings: number;
  totalSpent: number;
  averageStayLength: number;
  bookingFrequency: 'rare' | 'occasional' | 'regular' | 'frequent';
  specialRequests: number;
  cancellationHistory: number;
  reviewRating?: number;
  nationality?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GuestData = await request.json();

    const prompt = `Classify hotel guest into segment:

Bookings: ${body.totalBookings}
Spent: $${body.totalSpent}
Avg Stay: ${body.averageStayLength} nights
Frequency: ${body.bookingFrequency}
Requests: ${body.specialRequests}
Cancellations: ${body.cancellationHistory}
Rating: ${body.reviewRating || 'N/A'}
Country: ${body.nationality || 'N/A'}

Respond with ONLY this JSON (no markdown):
{"segment": "VIP", "lifetimeValue": "high", "churnRisk": 15, "strategies": ["personalized"], "upsellOpportunities": ["upgrade"]}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 256,
      messages: [{role: 'user', content: prompt}],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response');

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      segment: result.segment,
      lifetimeValue: result.lifetimeValue,
      churnRisk: result.churnRisk,
      strategies: result.strategies,
      upsellOpportunities: result.upsellOpportunities,
      recommendedTreatment: {
        priority: result.segment === 'VIP' ? 'highest' : result.segment === 'Loyal' ? 'high' : 'normal',
        retentionStrategy: result.churnRisk > 50 ? 'aggressive' : result.churnRisk > 25 ? 'targeted' : 'maintain',
        frequency: body.bookingFrequency === 'frequent' ? 'weekly' : body.bookingFrequency === 'regular' ? 'monthly' : 'quarterly',
      },
    });
  } catch (error) {
    console.error('[AI] Segmentation error:', error);
    return NextResponse.json({success: false, error: 'Segmentation failed'}, {status: 500});
  }
}
