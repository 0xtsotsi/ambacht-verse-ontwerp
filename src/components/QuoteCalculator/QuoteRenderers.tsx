
import React from "react";
import {
  QUOTE_SERVICE_CATEGORIES,
  QUOTE_SERVICE_TIERS,
  QUOTE_CALCULATOR_STYLES,
  QuoteServiceCategory,
  QuoteServiceTier,
  getCategoryIcon,
  getCategoryLabel,
  getCategoryDescription,
  getTierIcon,
  getTierLabel,
  getTierDescription,
} from "@/lib/quote-calculator-constants";

/**
 * Renders service category selection options
 */
export const renderServiceCategories = (
  selectedCategory: QuoteServiceCategory,
  onSelect: (category: QuoteServiceCategory) => void,
  translations?: any
) => {
  const categories = Object.keys(QUOTE_SERVICE_CATEGORIES) as QuoteServiceCategory[];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {categories.map((category) => {
        const isSelected = category === selectedCategory;
        const CategoryIcon = getCategoryIcon(category);
        return (
          <div
            key={category}
            className={`${QUOTE_CALCULATOR_STYLES.serviceButton} ${
              isSelected
                ? QUOTE_CALCULATOR_STYLES.serviceButtonSelected
                : QUOTE_CALCULATOR_STYLES.serviceButtonDefault
            }`}
            onClick={() => onSelect(category)}
          >
            <div className="flex items-center">
              <div className="mr-3">
                <CategoryIcon className={isSelected ? "text-blue-600" : "text-gray-500"} />
              </div>
              <div>
                <h3 className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                  {getCategoryLabel(category)}
                </h3>
                <p className="text-sm text-gray-500">
                  {getCategoryDescription(category)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Renders service tier selection options
 */
export const renderServiceTiers = (
  selectedTier: QuoteServiceTier,
  onSelect: (tier: QuoteServiceTier) => void,
  translations?: any
) => {
  const tiers = Object.keys(QUOTE_SERVICE_TIERS) as QuoteServiceTier[];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {tiers.map((tier) => {
        const isSelected = tier === selectedTier;
        const TierIcon = getTierIcon(tier);
        return (
          <div
            key={tier}
            className={`${QUOTE_CALCULATOR_STYLES.tierButton} ${
              isSelected
                ? QUOTE_CALCULATOR_STYLES.tierButtonSelected
                : QUOTE_CALCULATOR_STYLES.tierButtonDefault
            }`}
            onClick={() => onSelect(tier)}
          >
            <div className="flex flex-col items-center text-center">
              <TierIcon className={isSelected ? "text-green-600 mb-2" : "text-gray-500 mb-2"} />
              <h3 className={`font-medium ${isSelected ? "text-green-700" : "text-gray-700"}`}>
                {getTierLabel(tier)}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {getTierDescription(tier)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
