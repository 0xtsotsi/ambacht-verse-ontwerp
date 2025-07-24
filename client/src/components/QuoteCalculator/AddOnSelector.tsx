import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  QUOTE_ADD_ONS,
  type QuoteAddOn,
} from "@/lib/quote-calculator-constants";

interface AddOnSelectorProps {
  selectedAddOns: QuoteAddOn[];
  onAddOnToggle: (addonId: QuoteAddOn) => void;
  translations: {
    addOns: string;
    popular: string;
    perPerson: string;
  };
}

/**
 * Add-on selection component for quote calculator
 * Handles add-on selection with pricing display
 */
export function AddOnSelector({
  selectedAddOns,
  onAddOnToggle,
  translations,
}: AddOnSelectorProps) {
  return (
    <Card className="border-0 shadow-elegant-panel bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-serif text-forest-green">
          {translations.addOns}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(QUOTE_ADD_ONS).map(([key, addon]) => (
            <div
              key={key}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                selectedAddOns.includes(key as QuoteAddOn)
                  ? "bg-burnt-orange/10 border-burnt-orange"
                  : "hover:bg-gray-50 border-gray-200",
              )}
            >
              <Checkbox
                id={key}
                checked={selectedAddOns.includes(key as QuoteAddOn)}
                onCheckedChange={() => onAddOnToggle(key as QuoteAddOn)}
              />
              <div className="flex-1">
                <Label
                  htmlFor={key}
                  className="font-medium cursor-pointer text-forest-green"
                >
                  {addon.label}
                  {addon.popular && (
                    <Badge className="ml-2 text-xs bg-green-100 text-green-800">
                      {translations.popular}
                    </Badge>
                  )}
                </Label>
                <p className="text-sm text-burnt-orange font-medium">
                  €{addon.price.toFixed(2)}
                  {addon.perPerson && ` ${translations.perPerson}`}
                </p>
                {addon.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {addon.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
