import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  QUOTE_SERVICE_TIERS,
  type QuoteServiceTier 
} from '@/lib/quote-calculator-constants';

interface ServiceTierSelectorProps {
  selectedTier: QuoteServiceTier;
  onTierSelect: (tierId: QuoteServiceTier) => void;
  translations: {
    serviceTier: string;
    popular: string;
  };
}

/**
 * Service tier selection component for quote calculator
 * Handles tier selection with pricing information
 */
export function ServiceTierSelector({
  selectedTier,
  onTierSelect,
  translations
}: ServiceTierSelectorProps) {
  return (
    <Card className="border-0 shadow-elegant-panel bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-serif text-forest-green">
          {translations.serviceTier}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(QUOTE_SERVICE_TIERS).map(([key, tier]) => (
            <Button
              key={key}
              variant={selectedTier === key ? "default" : "outline"}
              onClick={() => onTierSelect(key as QuoteServiceTier)}
              className={cn(
                "h-auto p-4 flex-col items-center text-center transition-all duration-200",
                selectedTier === key 
                  ? "bg-burnt-orange text-white shadow-md" 
                  : "hover:bg-burnt-orange/5 hover:border-burnt-orange"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <tier.icon className="w-5 h-5" />
                <span className="font-medium">{tier.label}</span>
                {tier.popular && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    {translations.popular}
                  </Badge>
                )}
              </div>
              <div className="text-sm opacity-80">
                {tier.description}
              </div>
              <div className="text-xs mt-2 font-medium">
                {tier.multiplier}x prijs
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}