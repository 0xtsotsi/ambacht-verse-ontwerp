/**
 * Service Tier Comparison - Detailed feature comparison table
 * Part of ServiceTierSystem for task_002_2
 *
 * Features:
 * - Side-by-side tier comparison
 * - Feature highlighting
 * - Real-time price comparison
 * - Interactive animations
 * - Visual tier differentiation
 */

import React, { memo } from "react";
import { ServiceTier, ServiceCategory } from "@/lib/pricing-constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { useComponentTracking } from "@/hooks/useComponentLogger";

interface ServiceTierComparisonProps {
  tiers: ServiceTier[];
  serviceCategory: ServiceCategory;
  selectedTier: string;
}

export const ServiceTierComparison = memo<ServiceTierComparisonProps>(
  ({ tiers, serviceCategory, selectedTier }) => {
    // Component tracking
    const tracking = useComponentTracking("ServiceTierComparison", {
      enableRenderLogging: true,
      enablePerformanceLogging: true,
      dependencies: [selectedTier, serviceCategory.id],
    });

    return (
      <div data-testid="service-tier-comparison" className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-serif text-forest-green mb-2">
            Gedetailleerde Vergelijking
          </h3>
          <p className="text-natural-brown text-sm">
            Ontdek alle voordelen en features van elk service niveau
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier, index) => {
            const isSelected = selectedTier === tier.id;
            const calculatedPrice = (
              serviceCategory.basePrice * tier.priceMultiplier
            ).toFixed(2);

            return (
              <Card
                key={tier.id}
                data-testid={`comparison-${tier.id}`}
                className={`
                relative transition-all duration-500 ease-out overflow-hidden
                ${
                  isSelected
                    ? "highlighted ring-2 ring-accent shadow-xl scale-105 bg-gradient-to-br from-accent/5 to-burnt-orange/5"
                    : "hover:shadow-lg hover:scale-102 bg-white/80"
                }
                ${tier.id === "premium" ? "border-accent/50" : "border-beige/30"}
              `}
              >
                {/* Popular badge for Premium */}
                {tier.id === "premium" && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    <Star className="w-3 h-3 inline mr-1" />
                    Populair
                  </div>
                )}

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-burnt-orange animate-pulse"></div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="flex flex-col items-center text-center space-y-2">
                    <span
                      data-testid={`tier-name-${tier.id}`}
                      className={`text-xl font-serif ${isSelected ? "text-accent" : "text-forest-green"}`}
                    >
                      {tier.name}
                    </span>

                    <div className="space-y-1">
                      <div
                        data-testid={`tier-price-${tier.id}`}
                        className={`text-2xl font-bold ${isSelected ? "text-accent" : "text-forest-green"}`}
                      >
                        €{calculatedPrice}
                      </div>
                      <div className="text-xs text-natural-brown">
                        per persoon
                      </div>

                      {/* Price multiplier badge */}
                      <Badge
                        variant={isSelected ? "default" : "secondary"}
                        className={`text-xs ${isSelected ? "bg-accent" : "bg-beige text-natural-brown"}`}
                      >
                        {tier.priceMultiplier}x basis
                      </Badge>
                    </div>
                  </CardTitle>

                  <p className="text-sm text-natural-brown text-center leading-relaxed">
                    {tier.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features List */}
                  <div>
                    <h4 className="font-medium text-forest-green mb-3 text-sm">
                      Inbegrepen Services:
                    </h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          data-testid={`feature-${tier.id}-${featureIndex}`}
                          className="flex items-start space-x-2 text-sm"
                        >
                          <Check
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              isSelected ? "text-accent" : "text-forest-green"
                            }`}
                          />
                          <span
                            className={`${isSelected ? "text-forest-green font-medium" : "text-natural-brown"}`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Service Category Features */}
                  <div className="pt-4 border-t border-beige/30">
                    <h4 className="font-medium text-forest-green mb-3 text-sm">
                      {serviceCategory.name} Specialiteiten:
                    </h4>
                    <ul className="space-y-2">
                      {serviceCategory.popularFeatures
                        .slice(0, 2)
                        .map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <Star
                              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                isSelected ? "text-accent" : "text-beige"
                              }`}
                            />
                            <span className="text-natural-brown text-xs">
                              {feature}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Price Range Indicator */}
                  <div
                    className={`
                  mt-4 p-3 rounded-lg text-xs text-center
                  ${
                    isSelected
                      ? "bg-accent/10 border border-accent/20 text-accent font-medium"
                      : "bg-beige/10 border border-beige/20 text-natural-brown"
                  }
                `}
                  >
                    <div>Geschikt voor groepen vanaf</div>
                    <div className="font-bold">
                      €
                      {(
                        serviceCategory.minPrice *
                        tier.priceMultiplier *
                        10
                      ).toFixed(0)}
                      <span className="font-normal"> (10 personen)</span>
                    </div>
                  </div>
                </CardContent>

                {/* Hover animation overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </Card>
            );
          })}
        </div>

        {/* Comparison Summary */}
        <div className="mt-8 p-6 bg-gradient-to-br from-forest-green/5 via-beige/5 to-accent/5 rounded-xl border border-beige/20">
          <h4 className="font-serif text-lg text-forest-green mb-4 text-center">
            Waarom Deze Indeling?
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="font-medium text-forest-green mb-2">
                Essential
              </div>
              <p className="text-natural-brown text-xs leading-relaxed">
                Perfect voor kleinere evenementen waar kwaliteit en efficiency
                voorop staan. Alle essentials voor een geslaagd evenement.
              </p>
            </div>

            <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="font-medium text-accent mb-2">Premium</div>
              <p className="text-natural-brown text-xs leading-relaxed">
                Onze populairste keuze. Perfecte balans tussen luxe en waarde.
                Ideaal voor de meeste zakelijke en sociale evenementen.
              </p>
            </div>

            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="font-medium text-forest-green mb-2">Luxury</div>
              <p className="text-natural-brown text-xs leading-relaxed">
                Voor speciale gelegenheden die het allerbeste verdienen.
                White-glove service en exclusieve ingrediënten.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ServiceTierComparison.displayName = "ServiceTierComparison";
