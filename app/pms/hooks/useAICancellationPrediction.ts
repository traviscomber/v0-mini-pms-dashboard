import { useState, useCallback } from 'react';

export interface CancellationPrediction {
  cancellationRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  recommendedActions: string[];
}

export function useAICancellationPrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CancellationPrediction | null>(null);

  const predict = useCallback(async (params: {
    reservationId: string;
    daysUntilArrival: number;
    advanceBookingDays: number;
    guestHistory: {
      totalBookings: number;
      cancellationRate: number;
      averageStay: number;
    };
    bookingCharacteristics: {
      source: string;
      nonRefundableRate: number;
      depositPaid: boolean;
      specialRequests: boolean;
    };
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/forecasting/cancellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error('Failed to predict cancellation');
      
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

  return { predict, loading, error, data };
}
