import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Euro, Calculator, CheckCircle, ArrowRight } from "lucide-react";

interface QuoteSummaryProps {
  quote: {
    basePrice: number;
    addOnTotal: number;
    tax: number;
    total: number;
    perPerson: number;
  } | null;
  isCalculating: boolean;
  onRequestDetailedQuote: () => void;
  translations: {
    total: string;
    basePrice: string;
    addOnTotal: string;
    tax: string;
    perPersonPrice: string;
    getDetailedQuote: string;
  };
}

/**
 * Quote summary component for quote calculator
 * Displays price breakdown and request quote button
 */
export function QuoteSummary({
  quote,
  isCalculating,
  onRequestDetailedQuote,
  translations,
}: QuoteSummaryProps) {
  return (
    <Card className="border-0 shadow-elegant-panel bg-white/80 backdrop-blur-sm h-fit">
      <CardHeader>
        <h3 className="text-xl font-serif text-forest-green flex items-center gap-2">
          <Euro className="w-5 h-5" />
          {translations.total}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCalculating ? (
          <div className="text-center py-8">
            <Calculator className="w-8 h-8 text-burnt-orange animate-pulse mx-auto mb-2" />
            <p className="text-sm text-gray-600">Berekenen...</p>
          </div>
        ) : quote ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{translations.basePrice}:</span>
                <span className="font-medium">
                  €{quote.basePrice.toFixed(2)}
                </span>
              </div>
              {quote.addOnTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {translations.addOnTotal}:
                  </span>
                  <span className="font-medium">
                    €{quote.addOnTotal.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{translations.tax}:</span>
                <span className="font-medium">€{quote.tax.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <div className="text-3xl font-bold text-forest-green mb-1">
                €{quote.total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                €{quote.perPerson.toFixed(2)} {translations.perPersonPrice}
              </div>
            </div>

            <Button
              onClick={onRequestDetailedQuote}
              className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white"
              size="lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {translations.getDetailedQuote}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">
              Selecteer uw opties om een offerte te zien
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
