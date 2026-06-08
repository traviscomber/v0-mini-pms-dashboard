"use client";

import React, { useState, useEffect } from "react";
import { useAIPricing } from "../hooks/useAIPricing";
import { useAICancellation } from "../hooks/useAICancellation";
import { useAIRevenueForecast } from "../hooks/useAIRevenueForecast";
import { useAIGuestSegmentation } from "../hooks/useAIGuestSegmentation";
import { TrendingUp, AlertTriangle, Users, DollarSign, Zap } from "lucide-react";

interface Room {
  id: string;
  basePrice: number;
  status: string;
}

interface Reservation {
  id: string;
  totalAmount: number;
  numberOfGuests: number;
  reservationSource: string;
  checkInDate: Date;
  checkOutDate: Date;
}

interface Guest {
  id: string;
  totalBookings: number;
  totalSpent: number;
  name: string;
}

interface AIPredictionDashboardProps {
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  occupancyRate: number;
  averageDailyRate: number;
}

export default function AIPredictionDashboard({
  rooms,
  reservations,
  guests,
  occupancyRate,
  averageDailyRate,
}: AIPredictionDashboardProps) {
  const pricingHook = useAIPricing();
  const cancellationHook = useAICancellation();
  const revenueHook = useAIRevenueForecast();
  const segmentationHook = useAIGuestSegmentation();

  const [activeTab, setActiveTab] = useState<
    "pricing" | "cancellation" | "revenue" | "guests"
  >("pricing");

  // Load AI predictions on mount
  useEffect(() => {
    const loadPredictions = async () => {
      try {
        // Get pricing for first room
        if (rooms.length > 0) {
          const room = rooms[0];
          const today = new Date();
          const dayOfWeek = today.getDay();
          await pricingHook.predictPrice(
            room.basePrice,
            occupancyRate,
            dayOfWeek,
            occupancyRate > 75
              ? "peak"
              : occupancyRate > 50
                ? "high"
                : occupancyRate > 30
                  ? "medium"
                  : "low",
            14
          );
        }

        // Get revenue forecast
        await revenueHook.forecastRevenue(
          occupancyRate,
          averageDailyRate,
          7,
          "stable"
        );

        // Get next reservation cancellation risk
        if (reservations.length > 0) {
          const nextRes = reservations[0];
          const daysSince =
            (new Date().getTime() -
              new Date(nextRes.checkInDate).getTime()) /
            (1000 * 3600 * 24);
          const daysUntil =
            (new Date(nextRes.checkOutDate).getTime() -
              new Date().getTime()) /
            (1000 * 3600 * 24);

          await cancellationHook.predictCancellation(
            daysSince,
            daysUntil,
            nextRes.numberOfGuests,
            nextRes.totalAmount,
            nextRes.reservationSource
          );
        }

        // Segment VIP guest
        const vipGuests = guests.filter((g) => g.totalSpent > 5000);
        if (vipGuests.length > 0) {
          const guest = vipGuests[0];
          await segmentationHook.segmentGuest(
            guest.totalBookings,
            guest.totalSpent,
            5,
            "frequent"
          );
        }
      } catch (error) {
        console.error("[AI] Failed to load predictions:", error);
      }
    };

    loadPredictions();
  }, []);

  const renderPricingTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Dynamic Pricing Recommendation
      </h3>
      {pricingHook.loading && (
        <p className="text-foreground/60">Calculating optimal price...</p>
      )}
      {pricingHook.error && (
        <p className="text-red-500">Error: {pricingHook.error}</p>
      )}
      {pricingHook.result && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Recommended Price:</span>
            <span className="text-2xl font-bold text-primary">
              ${pricingHook.result.recommendedPrice}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Price Multiplier:</span>
            <span className="text-lg font-semibold text-foreground">
              {pricingHook.result.multiplier}x
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">AI Confidence:</span>
            <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                style={{
                  width: `${pricingHook.result.confidence}%`,
                }}
              />
            </div>
          </div>
          <p className="text-sm text-foreground/60 italic">
            {pricingHook.result.reasoning}
          </p>
        </div>
      )}
    </div>
  );

  const renderCancellationTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Cancellation Risk Analysis
      </h3>
      {cancellationHook.loading && (
        <p className="text-foreground/60">Analyzing risk...</p>
      )}
      {cancellationHook.error && (
        <p className="text-red-500">Error: {cancellationHook.error}</p>
      )}
      {cancellationHook.result && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={
                cancellationHook.result.riskLevel === "critical"
                  ? "text-red-500"
                  : cancellationHook.result.riskLevel === "high"
                    ? "text-orange-500"
                    : "text-yellow-500"
              }
            />
            <span className="text-foreground/70">Risk Level:</span>
            <span className="font-semibold text-foreground capitalize">
              {cancellationHook.result.riskLevel}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Risk Percentage:</span>
            <span className="text-lg font-bold text-foreground">
              {cancellationHook.result.riskPercentage}%
            </span>
          </div>
          <div className="bg-background p-2 rounded text-sm">
            <p className="text-foreground/70 font-semibold mb-1">
              Recommended Action:
            </p>
            <p className="text-foreground">
              {cancellationHook.result.recommendedAction}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cancellationHook.result.keyFactors.map((factor, i) => (
              <span
                key={i}
                className="bg-primary/20 text-primary px-2 py-1 rounded text-xs"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        7-Day Revenue Forecast
      </h3>
      {revenueHook.loading && (
        <p className="text-foreground/60">Forecasting revenue...</p>
      )}
      {revenueHook.error && (
        <p className="text-red-500">Error: {revenueHook.error}</p>
      )}
      {revenueHook.result && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background p-3 rounded">
              <p className="text-foreground/70 text-xs">Projected Occupancy</p>
              <p className="text-xl font-bold text-primary">
                {revenueHook.result.projectedOccupancy}%
              </p>
              <p className="text-xs text-foreground/60">
                {revenueHook.result.comparisonToNow.occupancyChange > 0 ? "+" : ""}
                {revenueHook.result.comparisonToNow.occupancyChange}%
              </p>
            </div>
            <div className="bg-background p-3 rounded">
              <p className="text-foreground/70 text-xs">Projected ADR</p>
              <p className="text-xl font-bold text-primary">
                ${revenueHook.result.projectedADR}
              </p>
              <p className="text-xs text-foreground/60">
                {revenueHook.result.comparisonToNow.adrChange > 0 ? "+" : ""}$
                {revenueHook.result.comparisonToNow.adrChange}
              </p>
            </div>
          </div>
          <div className="bg-background p-3 rounded">
            <p className="text-foreground/70 text-sm font-semibold mb-1">
              Total Revenue Estimate:
            </p>
            <p className="text-2xl font-bold text-primary">
              ${revenueHook.result.totalRevenueEstimate.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground/70">AI Confidence:</span>
            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${revenueHook.result.confidence}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {revenueHook.result.confidence}%
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderGuestsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Guest Segmentation
      </h3>
      {segmentationHook.loading && (
        <p className="text-foreground/60">Analyzing guest...</p>
      )}
      {segmentationHook.error && (
        <p className="text-red-500">Error: {segmentationHook.error}</p>
      )}
      {segmentationHook.result && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="text-primary" />
            <span className="text-foreground/70">Segment:</span>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
              {segmentationHook.result.segment}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background p-2 rounded">
              <p className="text-foreground/70 text-xs">Lifetime Value</p>
              <p className="font-semibold text-foreground capitalize">
                {segmentationHook.result.lifetimeValue}
              </p>
            </div>
            <div className="bg-background p-2 rounded">
              <p className="text-foreground/70 text-xs">Churn Risk</p>
              <p className="font-semibold text-foreground">
                {segmentationHook.result.churnRisk}%
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground/70 mb-2">
              Strategies:
            </p>
            <div className="space-y-1">
              {segmentationHook.result.strategies.map((s, i) => (
                <p key={i} className="text-sm text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {s}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold text-foreground">AI Predictions</h2>
      </div>

      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {(
          ["pricing", "cancellation", "revenue", "guests"] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="min-h-96">
        {activeTab === "pricing" && renderPricingTab()}
        {activeTab === "cancellation" && renderCancellationTab()}
        {activeTab === "revenue" && renderRevenueTab()}
        {activeTab === "guests" && renderGuestsTab()}
      </div>
    </div>
  );
}
