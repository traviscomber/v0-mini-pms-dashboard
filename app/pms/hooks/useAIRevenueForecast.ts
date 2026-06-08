import { useState, useCallback } from 'react';

interface RevenueResult {
  projectedOccupancy: number;
  projectedADR: number;
  totalRevenueEstimate: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
  daysForecasted: number;
  comparisonToNow: {
    occupancyChange: number;
    adrChange: number;
  };
}

export function useAIRevenueForecast() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RevenueResult | null>(null);

  const forecastRevenue = useCallback(
    async (
      currentOccupancy: number,
      averageDailyRate: number,
      forecastDays: number = 7,
      historicalTrend: 'increasing' | 'stable' | 'decreasing' = 'stable',
      upcomingEvents?: string[],
      season: 'low' | 'medium' | 'high' | 'peak' = 'medium'
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/revenue/forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentOccupancy,
            averageDailyRate,
            forecastDays,
            historicalTrend,
            upcomingEvents,
            season,
          }),
        });

        if (!response.ok)
          throw new Error('Revenue forecast failed');
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

  return {
    forecastRevenue,
    loading,
    error,
    result,
  };
}
