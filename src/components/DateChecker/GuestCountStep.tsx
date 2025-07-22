import React, { useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Users } from "lucide-react";
import {
  GUEST_COUNT_CONFIG,
  DATE_CHECKER_STYLES,
  calculateEstimatedPrice,
} from "@/lib/date-checker-constants";

interface GuestCountStepProps {
  guestCount: number;
  onGuestCountChange: (newGuestCount: number[]) => void;
  initialServiceCategory: string;
  initialServiceTier: string;
  translations: {
    guestCount: string;
    guests: string;
    estimatedPrice: string;
    perPerson: string;
  };
}

/**
 * Guest count selection step component for the DateChecker modal
 * Handles guest count slider and price estimation
 */
export function GuestCountStep({
  guestCount,
  onGuestCountChange,
  initialServiceCategory,
  initialServiceTier,
  translations,
}: GuestCountStepProps) {
  const guestCountSliderRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (guestCountSliderRef.current) {
      setTimeout(() => {
        guestCountSliderRef.current?.focus();
      }, 0);
    }
  }, []);

  const estimatedPrice = calculateEstimatedPrice(
    initialServiceCategory,
    initialServiceTier,
    guestCount,
  );

  return (
    <div>
      <div className={DATE_CHECKER_STYLES.stepHeader}>
        <div className={DATE_CHECKER_STYLES.stepNumber} aria-hidden="true">
          3
        </div>
        <h3 className="font-medium" id="step-3-heading">
          <Users className="w-5 h-5 inline mr-2" />
          {translations.guestCount}
        </h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Users className="w-5 h-5 text-gray-500" aria-hidden="true" />
          <span className="font-medium" id="guest-count-display">
            {guestCount} {translations.guests}
          </span>
        </div>
        <div ref={guestCountSliderRef}>
          <Slider
            value={[guestCount]}
            onValueChange={onGuestCountChange}
            min={GUEST_COUNT_CONFIG.min}
            max={GUEST_COUNT_CONFIG.max}
            step={GUEST_COUNT_CONFIG.step}
            className="w-full"
            aria-labelledby="step-3-heading"
            aria-describedby="guest-count-display"
            aria-valuetext={`${guestCount} ${translations.guests}`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{GUEST_COUNT_CONFIG.min}</span>
          <span>{GUEST_COUNT_CONFIG.max}</span>
        </div>
      </div>

      {/* Price Estimate */}
      {estimatedPrice && (
        <div className={DATE_CHECKER_STYLES.estimateCard}>
          <div className="flex items-center justify-between">
            <span className="font-medium">{translations.estimatedPrice}:</span>
            <span className="text-lg font-bold text-blue-600">
              €{estimatedPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            €{(estimatedPrice / guestCount).toFixed(2)} {translations.perPerson}
          </p>
        </div>
      )}
    </div>
  );
}
