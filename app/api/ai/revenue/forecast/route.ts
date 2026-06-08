import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RevenueInput {
  currentOccupancy: number;
  averageDailyRate: number;
  forecastDays: number;
  historicalTrend: 'increasing' | 'stable' | 'decreasing';
  upcomingEvents?: string[];
  season: 'low' | 'medium' | 'high' | 'peak';
}

export async function POST(request: NextRequest) {
  try {
    const body: RevenueInput = await request.json();

    const prompt = `Forecast hotel revenue for next ${body.forecastDays} days:

Current Occupancy: ${body.currentOccupancy}%
ADR: $${body.averageDailyRate}
Trend: ${body.historicalTrend}
Season: ${body.season}
Events: ${body.upcomingEvents?.join(', ') || 'None'}

Respond with ONLY this JSON (no markdown):
{"projectedOccupancy": 75, "projectedADR": 185, "totalRevenue": 13950, "confidence": 82, "factors": ["holiday"], "recommendations": ["increase price"]}`;

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
      projectedOccupancy: result.projectedOccupancy,
      projectedADR: result.projectedADR,
      totalRevenueEstimate: result.totalRevenue,
      confidence: result.confidence,
      factors: result.factors,
      recommendations: result.recommendations,
      daysForecasted: body.forecastDays,
      comparisonToNow: {
        occupancyChange: result.projectedOccupancy - body.currentOccupancy,
        adrChange: result.projectedADR - body.averageDailyRate,
      },
    });
  } catch (error) {
    console.error('[AI] Revenue error:', error);
    return NextResponse.json({success: false, error: 'Forecast failed'}, {status: 500});
  }
}
