import { useState, useCallback } from 'react';

interface PricingResult {
  recommendedPrice: number;
  confidence: number;
  reasoning: string;
  multiplier: string;
}

export function useAIPricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PricingResult | null>(null);

  const predictPrice = useCallback(
    async (
      basePrice: number,
      occupancyRate: number,
      dayOfWeek: number,
      season: 'low' | 'medium' | 'high' | 'peak',
      daysUntilBooking: number,
      competitorPrice?: number,
      historicalAverage?: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/pricing/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            basePrice,
            occupancyRate,
            dayOfWeek,
            season,
            daysUntilBooking,
            competitorPrice,
            historicalAverage,
          }),
        });

        if (!response.ok) throw new Error('Pricing prediction failed');
        const data = await response.json();

        setResult(data);
        return data;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { predictPrice, loading, error, result };
}
