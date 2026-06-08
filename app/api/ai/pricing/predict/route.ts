import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PricingInput {
  basePrice: number;
  occupancyRate: number;
  dayOfWeek: number;
  season: 'low' | 'medium' | 'high' | 'peak';
  daysUntilBooking: number;
  competitorPrice?: number;
  historicalAverage?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: PricingInput = await request.json();

    const prompt = `You are a hotel revenue management expert. Calculate optimal room price based on:

Base Price: $${body.basePrice}
Occupancy: ${body.occupancyRate}%
Day: ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][body.dayOfWeek]}
Season: ${body.season}
Days Until: ${body.daysUntilBooking}
Competitor: $${body.competitorPrice || 'N/A'}

Respond with ONLY valid JSON (no markdown):
{"price": <number>, "confidence": <0-100>, "reasoning": "<string>"}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role: 'user', content: prompt}],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const aiResult = await response.json();
    const responseText = aiResult.choices[0]?.message?.content || '{}';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response');

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      recommendedPrice: Math.round(result.price),
      confidence: result.confidence,
      reasoning: result.reasoning,
      multiplier: (result.price / body.basePrice).toFixed(2),
    });
  } catch (error) {
    console.error('Pricing prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to predict pricing', details: String(error) },
      { status: 500 }
    );
  }
}

