/**
 * Service Tier Matrix - Interactive tier selection with V5 animations
 * Part of ServiceTierSystem for task_002_2
 * 
 * Features:
 * - Interactive tier buttons with hover effects
 * - Shimmer, bounce, pulse animations
 * - Terracotta accents
 * - Real-time visual feedback
 * - Accessibility compliant
 */

import React, { memo } from 'react';
import { SERVICE_TIERS, ServiceTier, ServiceCategory } from '@/lib/pricing-constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useComponentTracking } from '@/hooks/useComponentLogger';

interface ServiceTierMatrixProps {
  onTierChange: (tierId: string) => void;
  selectedTier: string;
  serviceCategory: ServiceCategory;
}

export const ServiceTierMatrix = memo<ServiceTierMatrixProps>(({
  onTierChange,
  selectedTier,
  serviceCategory
}) => {
  // Component tracking
  const tracking = useComponentTracking('ServiceTierMatrix', {
    enableRenderLogging: true,
    enablePerformanceLogging: true,
    dependencies: [selectedTier, serviceCategory.id]
  });

  const handleTierClick = (tierId: string) => {
    onTierChange(tierId);
  };

  return (
    <div data-testid="service-tier-matrix" className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-serif text-forest-green mb-2">Service Niveau Matrix</h3>
        <div data-testid="current-tier" className="hidden">{selectedTier}</div>
        <div data-testid="service-category" className="hidden">{serviceCategory.name}</div>
        <p className="text-natural-brown text-sm">
          Huidige service: <span className="font-medium">{serviceCategory.name}</span>
        </p>
      </div>

      {/* Tier Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICE_TIERS.map((tier, index) => {
          const isSelected = selectedTier === tier.id;
          const calculatedPrice = (serviceCategory.basePrice * tier.priceMultiplier).toFixed(2);
          
          return (
            <div key={tier.id} className="relative group">
              {/* Popular badge for Premium tier */}
              {tier.id === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge 
                    variant="secondary" 
                    className="bg-accent text-white animate-pulse shadow-lg"
                  >
                    Populairste Keuze
                  </Badge>
                </div>
              )}

              <Button
                data-testid={`tier-${tier.id}`}
                onClick={() => handleTierClick(tier.id)}
                variant={isSelected ? "default" : "outline"}
                className={`
                  w-full h-auto p-6 flex flex-col items-center space-y-4 text-left
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br
                  ${isSelected 
                    ? 'selected bg-gradient-to-br from-forest-green to-deep-teal text-white shadow-xl scale-105 animate-shimmer border-accent' 
                    : 'hover:from-warm-cream hover:to-beige/20 hover:border-accent/50 animate-bounce-subtle'
                  }
                  focus:ring-2 focus:ring-accent focus:ring-offset-2
                  group-hover:animate-pulse
                `}
                aria-label={`Selecteer ${tier.name} service niveau voor €${calculatedPrice} per persoon`}
                aria-pressed={isSelected}
              >
                {/* Tier Header */}
                <div className="w-full text-center">
                  <h4 className={`text-lg font-serif font-bold ${isSelected ? 'text-white' : 'text-forest-green'}`}>
                    {tier.name}
                  </h4>
                  <div className={`text-2xl font-bold mt-1 ${isSelected ? 'text-warm-cream' : 'text-accent'}`}>
                    €{calculatedPrice}
                    <span className="text-sm font-normal opacity-80"> /persoon</span>
                  </div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-warm-cream/80' : 'text-natural-brown'}`}>
                    {tier.priceMultiplier}x basis tarief
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm text-center leading-relaxed ${isSelected ? 'text-warm-cream/90' : 'text-natural-brown'}`}>
                  {tier.description}
                </p>

                {/* Quick feature highlight */}
                <div className="w-full">
                  <div className={`text-xs font-medium ${isSelected ? 'text-warm-cream/80' : 'text-forest-green/80'}`}>
                    Inclusief:
                  </div>
                  <ul className={`text-xs mt-1 space-y-1 ${isSelected ? 'text-warm-cream/90' : 'text-natural-brown'}`}>
                    {tier.features.slice(0, 2).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className={`w-1 h-1 rounded-full mr-2 ${isSelected ? 'bg-warm-cream' : 'bg-accent'}`}></span>
                        {feature}
                      </li>
                    ))}
                    {tier.features.length > 2 && (
                      <li className={`font-medium ${isSelected ? 'text-warm-cream/80' : 'text-accent'}`}>
                        +{tier.features.length - 2} meer...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Selection indicator with animation */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent/20 to-burnt-orange/20 animate-pulse pointer-events-none"></div>
                )}

                {/* Hover shimmer effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </Button>

              {/* Bottom accent line */}
              <div className={`h-1 mt-2 rounded-full transition-all duration-300 ${
                isSelected 
                  ? 'bg-gradient-to-r from-accent to-burnt-orange animate-pulse' 
                  : 'bg-beige/30 group-hover:bg-accent/50'
              }`}></div>
            </div>
          );
        })}
      </div>

      {/* Tier comparison quick summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-forest-green/5 to-deep-teal/5 rounded-lg border border-forest-green/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-natural-brown">
            Gekozen niveau: <span className="font-medium text-forest-green">{SERVICE_TIERS.find(t => t.id === selectedTier)?.name}</span>
          </span>
          <span className="text-accent font-medium">
            €{(serviceCategory.basePrice * (SERVICE_TIERS.find(t => t.id === selectedTier)?.priceMultiplier || 1)).toFixed(2)} per persoon
          </span>
        </div>
      </div>
    </div>
  );
});

ServiceTierMatrix.displayName = 'ServiceTierMatrix';