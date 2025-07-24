/**
 * Service Tier System - Interactive 3-tier service comparison
 * Task_002_2: Tiered Service Options Implementation
 *
 * V5 Interactive Elegance Features:
 * - Shimmer, bounce, pulse animations
 * - Terracotta color accents
 * - Interactive tier switching with smooth transitions
 * - Real-time price calculations
 * - Performance optimized (<20ms renders)
 * - Comprehensive component logging
 */

import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import {
  SERVICE_TIERS,
  ServiceTier,
  ServiceCategory,
  getAllServiceTiers,
  getServiceTierWithId,
} from "@/lib/pricing-constants";
import { ServiceTierMatrix } from "./ServiceTierMatrix";
import { ServiceTierComparison } from "./ServiceTierComparison";
import { ServiceTierCalculator } from "./ServiceTierCalculator";
import { useComponentTracking } from "@/hooks/useComponentLogger";
import { ErrorBoundary } from "./ErrorBoundary";

interface ServiceTierSystemProps {
  /** Callback when tier selection changes */
  onTierChange?: (tierId: string) => void;

  /** Callback when price updates */
  onPriceUpdate?: (price: number) => void;

  /** Initial service category */
  initialServiceCategory: ServiceCategory | null;

  /** Selected tier ID */
  selectedTier?: string;

  /** Number of guests for price calculation */
  guestCount?: number;

  /** Optional CSS classes */
  className?: string;
}

const ServiceTierSystemInternal: React.FC<ServiceTierSystemProps> = ({
  onTierChange,
  onPriceUpdate,
  initialServiceCategory,
  selectedTier: initialSelectedTier = "essential",
  guestCount = 25,
  className = "",
}) => {
  // Component tracking and logging
  const tracking = useComponentTracking("ServiceTierSystem", {
    enableLifecycleLogging: true,
    enableStateLogging: true,
    enableRenderLogging: true,
    enablePerformanceLogging: true,
    props: {
      serviceCategory: initialServiceCategory?.id,
      selectedTier: initialSelectedTier,
      guestCount,
    },
  });

  // State management
  const [selectedTier, setSelectedTier] = useState<string>(initialSelectedTier);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // State loggers
  const tierLogger = tracking.createStateLogger<string>("selectedTier");
  const priceLogger = tracking.createStateLogger<number>("currentPrice");

  // Validate inputs - memoize to prevent dependency changes
  const serviceCategory = useMemo(
    () =>
      initialServiceCategory || {
        id: "fallback",
        name: "Standard Service",
        description: "Standard catering service",
        basePrice: 25.0,
        minPrice: 20.0,
        maxPrice: 30.0,
        features: ["Basic service"],
        popularFeatures: [],
      },
    [initialServiceCategory],
  );

  const validGuestCount = Math.max(1, guestCount || 25);

  const currentTier = getServiceTierWithId(selectedTier as keyof typeof SERVICE_TIERS) || getServiceTierWithId('premium');

  // Calculate price based on current selections
  const calculatePrice = useCallback(
    (tier: ServiceTier, category: ServiceCategory, guests: number) => {
      return 25 * tier.multiplier * guests; // Using BASE_PRICE_PER_PERSON
    },
    [],
  );

  // Handle tier change
  const handleTierChange = useCallback(
    (tierId: string) => {
      const previousTier = selectedTier;
      setSelectedTier(tierId);

      // Log state change
      if (tierLogger) {
        tierLogger.logStateChange(tierId, "tier_selection");
      }

      // Calculate new price
      const newTier = SERVICE_TIERS[tierId as keyof typeof SERVICE_TIERS] || SERVICE_TIERS.premium;
      const newPrice = calculatePrice(
        newTier,
        serviceCategory,
        validGuestCount,
      );
      setCurrentPrice(newPrice);

      if (priceLogger) {
        priceLogger.logStateChange(newPrice, "tier_price_update");
      }

      // Notify parent components
      if (onTierChange) {
        onTierChange(tierId);
      }

      if (onPriceUpdate) {
        onPriceUpdate(newPrice);
      }
    },
    [
      selectedTier,
      tierLogger,
      priceLogger,
      calculatePrice,
      serviceCategory,
      validGuestCount,
      onTierChange,
      onPriceUpdate,
    ],
  );

  // Handle price updates from calculator
  const handlePriceChange = useCallback(
    (price: number) => {
      setCurrentPrice(price);

      if (priceLogger) {
        priceLogger.logStateChange(price, "calculator_price_update");
      }

      if (onPriceUpdate) {
        onPriceUpdate(price);
      }
    },
    [priceLogger, onPriceUpdate],
  );

  // Initialize price on mount and when dependencies change
  useEffect(() => {
    const initialPrice = calculatePrice(
      currentTier,
      serviceCategory,
      validGuestCount,
    );
    setCurrentPrice(initialPrice);

    if (onPriceUpdate) {
      onPriceUpdate(initialPrice);
    }
  }, [
    calculatePrice,
    currentTier,
    serviceCategory,
    validGuestCount,
    onPriceUpdate,
  ]);

  return (
    <div
      data-testid="service-tier-system"
      className={`w-full space-y-8 p-6 bg-gradient-to-br from-warm-cream via-white to-warm-cream/50 rounded-2xl border border-beige/30 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif text-forest-green">
          Kies Uw Service Niveau
        </h2>
        <p className="text-natural-brown max-w-2xl mx-auto">
          Ontdek onze drie service niveaus, elk zorgvuldig samengesteld om
          perfect aan te sluiten bij uw wensen en budget.
        </p>
      </div>

      {/* Interactive Tier Matrix */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-beige/20 shadow-md">
        <ServiceTierMatrix
          onTierChange={handleTierChange}
          selectedTier={selectedTier}
          serviceCategory={serviceCategory}
        />
      </div>

      {/* Tier Comparison Grid */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-beige/20">
        <ServiceTierComparison
          tiers={getAllServiceTiers()}
          serviceCategory={serviceCategory}
          selectedTier={selectedTier}
        />
      </div>

      {/* Price Calculator */}
      <div className="bg-gradient-to-r from-accent/5 to-burnt-orange/5 rounded-xl p-6 border border-accent/20">
        <ServiceTierCalculator
          tier={currentTier}
          serviceCategory={serviceCategory}
          guestCount={validGuestCount}
          onPriceChange={handlePriceChange}
        />
      </div>

      {/* Performance monitoring display (development only) */}
      {import.meta.env.DEV && tracking.performance && (
        <div className="mt-4 p-3 bg-forest-green/5 rounded-lg text-xs text-forest-green">
          <div>Render Count: {tracking.renderInfo?.renderCount}</div>
          <div>
            Performance:{" "}
            {tracking.performance
              .getPerformanceStats()
              ?.averageRenderTime?.toFixed(2)}
            ms avg
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap with error boundary and memoization
export const ServiceTierSystem = memo((props: ServiceTierSystemProps) => (
  <ErrorBoundary
    fallback={
      <div className="p-6 text-center bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Service Tier System Error</h3>
        <p className="text-red-600 text-sm mt-2">
          Er is een fout opgetreden bij het laden van de service opties.
        </p>
      </div>
    }
  >
    <ServiceTierSystemInternal {...props} />
  </ErrorBoundary>
));

ServiceTierSystem.displayName = "ServiceTierSystem";
