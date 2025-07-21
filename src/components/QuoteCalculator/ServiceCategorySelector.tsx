import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  QUOTE_SERVICE_CATEGORIES,
  type QuoteServiceCategory 
} from '@/lib/quote-calculator-constants';

interface ServiceCategorySelectorProps {
  selectedCategory: QuoteServiceCategory;
  onCategorySelect: (categoryId: QuoteServiceCategory) => void;
  translations: {
    serviceCategory: string;
  };
}

/**
 * Service category selection component for quote calculator
 * Handles category selection with visual feedback
 */
export function ServiceCategorySelector({
  selectedCategory,
  onCategorySelect,
  translations
}: ServiceCategorySelectorProps) {
  return (
    <Card className="border-0 shadow-elegant-panel bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <h3 className="text-xl font-serif text-forest-green">
          {translations.serviceCategory}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(QUOTE_SERVICE_CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => onCategorySelect(key as QuoteServiceCategory)}
              className={cn(
                "h-auto p-4 flex-col items-start text-left transition-all duration-200",
                selectedCategory === key 
                  ? "bg-burnt-orange text-white shadow-md" 
                  : "hover:bg-burnt-orange/5 hover:border-burnt-orange"
              )}
            >
              <div className="flex items-center gap-3 w-full">
                <category.icon className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">{category.label}</div>
                  <div className="text-sm opacity-80 mt-1">
                    {category.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}