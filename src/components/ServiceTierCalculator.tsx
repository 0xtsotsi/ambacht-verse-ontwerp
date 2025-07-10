/**
 * Service Tier Calculator - Real-time pricing calculator
 * Part of ServiceTierSystem for task_002_2
 * 
 * Features:
 * - Real-time price calculations
 * - Interactive guest count selector
 * - Price breakdown display
 * - Volume discount integration
 * - Animated price updates
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import { ServiceTier, ServiceCategory, VOLUME_DISCOUNTS, GUEST_COUNT_PRESETS } from '@/lib/pricing-constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, Users, Euro, Percent } from 'lucide-react';
import { useComponentTracking } from '@/hooks/useComponentLogger';

interface ServiceTierCalculatorProps {
  tier: ServiceTier;
  serviceCategory: ServiceCategory;
  guestCount: number;
  onPriceChange?: (price: number) => void;
}

export const ServiceTierCalculator = memo<ServiceTierCalculatorProps>(({
  tier,
  serviceCategory,
  guestCount: initialGuestCount,
  onPriceChange
}) => {
  // Component tracking
  const tracking = useComponentTracking('ServiceTierCalculator', {
    enableRenderLogging: true,
    enablePerformanceLogging: true,
    dependencies: [tier.id, serviceCategory.id, initialGuestCount]
  });

  const [guestCount, setGuestCount] = useState(initialGuestCount);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate pricing details
  const calculatePricing = useCallback((guests: number, tierMultiplier: number, basePrice: number) => {
    const baseTotal = basePrice * tierMultiplier * guests;
    
    // Find applicable volume discount
    const discount = VOLUME_DISCOUNTS
      .filter(d => guests >= d.minGuests)
      .reduce((max, current) => current.discount > max.discount ? current : max, { discount: 0, minGuests: 0, label: '' });
    
    const discountAmount = baseTotal * discount.discount;
    const finalPrice = baseTotal - discountAmount;

    return {
      basePrice,
      multiplier: tierMultiplier,
      subtotal: baseTotal,
      discount: discount.discount,
      discountAmount,
      finalPrice,
      pricePerPerson: finalPrice / guests,
      discountLabel: discount.label
    };
  }, []);

  const pricing = calculatePricing(guestCount, tier.priceMultiplier, serviceCategory.basePrice);

  // Update parent component when price changes
  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(pricing.finalPrice);
    }
  }, [pricing.finalPrice, onPriceChange]);

  const handleGuestCountChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(500, newCount));
    setGuestCount(validCount);
  };

  return (
    <div data-testid="service-tier-calculator" className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-accent/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-forest-green">
            <Calculator className="w-5 h-5 text-accent" />
            <span>Prijs Calculator</span>
          </CardTitle>
          <p className="text-natural-brown text-sm">
            Bereken direct uw totale kosten voor het {tier.name} niveau
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Guest Count Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-forest-green">
                <Users className="w-4 h-4" />
                <span>Aantal gasten</span>
              </label>
              <div data-testid="guest-count" className="text-accent font-bold">
                {guestCount} gasten
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2">
              {GUEST_COUNT_PRESETS.map(preset => (
                <Button
                  key={preset}
                  variant={guestCount === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGuestCountChange(preset)}
                  className={`text-xs transition-all duration-200 ${
                    guestCount === preset 
                      ? 'bg-accent hover:bg-accent/90 text-white' 
                      : 'hover:bg-accent/10 hover:border-accent'
                  }`}
                >
                  {preset}
                </Button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                max="500"
                value={guestCount}
                onChange={(e) => handleGuestCountChange(parseInt(e.target.value) || 1)}
                className="flex-1 border-accent/20 focus:border-accent"
                placeholder="Aangepast aantal"
              />
              <span className="text-xs text-natural-brown">min. 1, max. 500</span>
            </div>
          </div>

          {/* Price Display */}
          <div className="space-y-4">
            {/* Main Price Display */}
            <div className="p-6 bg-gradient-to-br from-accent/5 to-burnt-orange/5 rounded-lg border border-accent/20 text-center">
              <div className="space-y-2">
                <div className="text-sm text-natural-brown">Totaal voor {tier.name} niveau</div>
                <div 
                  data-testid="total-price"
                  className="text-3xl font-bold text-accent animate-pulse"
                >
                  €{pricing.finalPrice.toFixed(2)}
                </div>
                <div className="text-xs text-natural-brown">
                  €{pricing.pricePerPerson.toFixed(2)} per persoon
                </div>
              </div>

              {/* Volume discount badge */}
              {pricing.discount > 0 && (
                <Badge className="mt-3 bg-forest-green text-white animate-bounce">
                  <Percent className="w-3 h-3 mr-1" />
                  {(pricing.discount * 100).toFixed(0)}% korting bespaard!
                </Badge>
              )}
            </div>

            {/* Price Breakdown Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-accent hover:bg-accent/10"
            >
              {showDetails ? 'Verberg details' : 'Toon prijs breakdown'}
            </Button>

            {/* Detailed Breakdown */}
            {showDetails && (
              <div className="space-y-3 p-4 bg-forest-green/5 rounded-lg border border-forest-green/10 animate-fadeIn">
                <h4 className="font-medium text-forest-green text-sm">Prijs Breakdown:</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-natural-brown">Basis prijs ({serviceCategory.name})</span>
                    <span data-testid="base-price" className="font-medium">€{pricing.basePrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-natural-brown">Service niveau multiplier</span>
                    <span data-testid="multiplier" className="font-medium">{pricing.multiplier}x</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-natural-brown">Aantal gasten</span>
                    <span className="font-medium">{guestCount}</span>
                  </div>
                  
                  <div className="border-t border-forest-green/20 pt-2">
                    <div className="flex justify-between">
                      <span className="text-natural-brown">Subtotaal</span>
                      <span className="font-medium">€{pricing.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {pricing.discount > 0 && (
                    <>
                      <div className="flex justify-between text-forest-green">
                        <span>Volume korting ({(pricing.discount * 100).toFixed(0)}%)</span>
                        <span>-€{pricing.discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-natural-brown italic">
                        {pricing.discountLabel}
                      </div>
                    </>
                  )}
                  
                  <div className="border-t border-accent/20 pt-2">
                    <div className="flex justify-between font-bold text-accent">
                      <span>Totaal</span>
                      <span>€{pricing.finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="p-4 bg-warm-cream/30 rounded-lg border border-beige/20 text-xs text-natural-brown">
            <div className="flex items-start space-x-2">
              <Euro className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Opmerking:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Prijzen zijn exclusief BTW (21%)</li>
                  <li>Volume kortingen worden automatisch toegepast</li>
                  <li>Finaal tarief kan variëren op basis van specifieke wensen</li>
                  <li>Offerte geldig voor 30 dagen</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ServiceTierCalculator.displayName = 'ServiceTierCalculator';