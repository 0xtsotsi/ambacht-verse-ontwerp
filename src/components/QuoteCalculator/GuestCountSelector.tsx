import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUOTE_GUEST_CONFIG } from '@/lib/quote-calculator-constants';

interface GuestCountSelectorProps {
  guestCount: number[];
  onGuestCountChange: (newCount: number[]) => void;
  translations: {
    guestCount: string;
    guests: string;
  };
}

/**
 * Guest count selection component for quote calculator
 * Handles guest count slider and preset buttons
 */
export function GuestCountSelector({
  guestCount,
  onGuestCountChange,
  translations
}: GuestCountSelectorProps) {
  return (
    <Card className="border-0 shadow-elegant-panel bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-serif text-forest-green">
          <Users className="w-5 h-5 inline mr-2" />
          {translations.guestCount}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-2xl font-bold text-forest-green">
            {guestCount[0]} {translations.guests}
          </span>
        </div>
        
        <Slider
          value={guestCount}
          onValueChange={onGuestCountChange}
          min={QUOTE_GUEST_CONFIG.min}
          max={QUOTE_GUEST_CONFIG.max}
          step={QUOTE_GUEST_CONFIG.step}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>{QUOTE_GUEST_CONFIG.min}</span>
          <span>{QUOTE_GUEST_CONFIG.max}</span>
        </div>
        
        <div className="grid grid-cols-6 gap-2">
          {QUOTE_GUEST_CONFIG.presets.map((count) => (
            <Button
              key={count}
              variant="outline"
              size="sm"
              onClick={() => onGuestCountChange([count])}
              className={cn(
                "transition-colors",
                guestCount[0] === count && "border-burnt-orange bg-burnt-orange/10"
              )}
            >
              {count}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}