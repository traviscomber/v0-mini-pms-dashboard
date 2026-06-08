import { useState, useCallback } from 'react';

interface GuestSegmentResult {
  segment: 'VIP' | 'Loyal' | 'Occasional' | 'Budget' | 'At-Risk';
  lifetimeValue: 'low' | 'medium' | 'high' | 'premium';
  churnRisk: number;
  strategies: string[];
  upsellOpportunities: string[];
  recommendedTreatment: {
    priority: 'highest' | 'high' | 'normal';
    retentionStrategy: 'aggressive' | 'targeted' | 'maintain';
    frequency: 'weekly' | 'monthly' | 'quarterly';
  };
}

export function useAIGuestSegmentation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GuestSegmentResult | null>(null);

  const segmentGuest = useCallback(
    async (
      totalBookings: number,
      totalSpent: number,
      averageStayLength: number,
      bookingFrequency: 'rare' | 'occasional' | 'regular' | 'frequent',
      specialRequests: number = 0,
      cancellationHistory: number = 0,
      reviewRating?: number,
      nationality?: string
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/guests/segment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalBookings,
            totalSpent,
            averageStayLength,
            bookingFrequency,
            specialRequests,
            cancellationHistory,
            reviewRating,
            nationality,
          }),
        });

        if (!response.ok)
          throw new Error('Guest segmentation failed');
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
    segmentGuest,
    loading,
    error,
    result,
  };
}
