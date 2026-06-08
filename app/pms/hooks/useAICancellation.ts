import { useState, useCallback } from 'react';

interface CancellationResult {
  riskPercentage: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
  keyFactors: string[];
  shouldOverbookBy: number;
}

export function useAICancellation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CancellationResult | null>(null);

  const predictCancellation = useCallback(
    async (
      daysSinceBooking: number,
      daysUntilArrival: number,
      numberOfGuests: number,
      totalPrice: number,
      reservationSource: string,
      guestHistoryBookings?: number,
      guestHistoryCancellations?: number,
      seasonality?: 'low' | 'medium' | 'high' | 'peak'
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          '/api/ai/cancellation/predict',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              daysSinceBooking,
              daysUntilArrival,
              numberOfGuests,
              totalPrice,
              reservationSource,
              guestHistoryBookings,
              guestHistoryCancellations,
              seasonality: seasonality || 'medium',
            }),
          }
        );

        if (!response.ok)
          throw new Error('Cancellation prediction failed');
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
    predictCancellation,
    loading,
    error,
    result,
  };
}
