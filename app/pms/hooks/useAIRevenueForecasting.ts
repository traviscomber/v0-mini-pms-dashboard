import { useState, useCallback } from 'react';

export interface RevenueForecast {
  forecastedRevenue: number;
  confidence: number;
  upside: number;
  downside: number;
  keyFactors: string[];
  recommendations: string[];
}

export function useAIRevenueForecasting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RevenueForecast | null>(null);

  const forecast = useCallback(async (params: {
    propertyId: string;
    historicalData: {
      lastMonth: number;
      last3Months: number[];
      sameMonthLastYear: number;
    };
    upcomingBookings: {
      confirmedRevenue: number;
      pendingReservations: number;
    };
    externalFactors: {
      localEvents: string[];
      seasonType: string;
      competitorActivity: string;
    };
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/forecasting/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error('Failed to forecast revenue');
      
      const result = await response.json();
      setData(result.data);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { forecast, loading, error, data };
}
