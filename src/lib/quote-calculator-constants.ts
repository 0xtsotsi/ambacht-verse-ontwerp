/**
 * Shared constants and utilities for quote calculator components
 * Extracted to comply with DRY principles and 300 LOC limit per file
 */

import { Calculator, Users, Sparkles, CheckCircle, ChefHat, Crown, Gem, Euro, TrendingDown } from 'lucide-react';

// Guest count configuration
export const QUOTE_GUEST_CONFIG = {
  min: 10,
  max: 500,
  default: 50,
  step: 5,
  presets: [20, 50, 75, 100, 150, 200]
} as const;

// Service categories for quote calculation
export const QUOTE_SERVICE_CATEGORIES = {
  corporate: { 
    label: 'Zakelijke Events', 
    basePrice: 12.50, 
    icon: Users,
    multiplier: 1.0,
    description: 'Professionele zakelijke evenementen'
  },
  social: { 
    label: 'Sociale Events', 
    basePrice: 27.50, 
    icon: Sparkles,
    multiplier: 1.2,
    description: 'Feesten en sociale bijeenkomsten'
  },
  wedding: { 
    label: 'Bruiloften', 
    basePrice: 22.50, 
    icon: Crown,
    multiplier: 1.5,
    description: 'Romantische bruiloftscatering'
  },
  custom: { 
    label: 'Op Maat', 
    basePrice: 35.00, 
    icon: Gem,
    multiplier: 1.8,
    description: 'Volledig aangepaste ervaring'
  }
} as const;

// Service tiers with detailed pricing
export const QUOTE_SERVICE_TIERS = {
  basis: { 
    label: 'Basis', 
    multiplier: 1.0,
    description: 'Essentiële catering service',
    icon: CheckCircle
  },
  premium: { 
    label: 'Premium', 
    multiplier: 1.4,
    description: 'Uitgebreide service en menu',
    icon: ChefHat
  },
  luxe: { 
    label: 'Luxe', 
    multiplier: 1.8,
    description: 'Exclusieve high-end ervaring',
    icon: Crown
  }
} as const;

// Add-on services with pricing
export const QUOTE_ADD_ONS = {
  liveMusic: { label: 'Live Muziek', price: 450, popular: true },
  photographer: { label: 'Fotograaf', price: 750, popular: true },
  floralDecor: { label: 'Bloemendecoratie', price: 300, popular: false },
  specialLighting: { label: 'Speciale Verlichting', price: 200, popular: false },
  extraStaff: { label: 'Extra Personeel', price: 150, popular: true },
  winePackage: { label: 'Wijnpakket', price: 25, perPerson: true, popular: true },
  dessertStation: { label: 'Dessertstation', price: 8, perPerson: true, popular: false },
  cocktailHour: { label: 'Cocktail Uur', price: 15, perPerson: true, popular: true }
} as const;

// Quote calculator translations
export const QUOTE_TRANSLATIONS = {
  nl: {
    title: 'Offerte Calculator',
    subtitle: 'Bereken direct uw geschatte kosten',
    serviceCategory: 'Service Categorie',
    serviceTier: 'Service Niveau',
    guestCount: 'Aantal Gasten',
    addOns: 'Extra Services',
    popular: 'Populair',
    perPerson: 'per persoon',
    basePrice: 'Basisprijs',
    addOnTotal: 'Extra Services',
    subtotal: 'Subtotaal',
    tax: 'BTW (21%)',
    total: 'Totaal',
    perPersonPrice: 'Per persoon',
    calculateQuote: 'Bereken Offerte',
    getDetailedQuote: 'Gedetailleerde Offerte',
    savings: 'Besparing',
    estimate: 'Schatting',
    included: 'Inbegrepen',
    optional: 'Optioneel',
    recommended: 'Aanbevolen',
    guests: 'gasten'
  },
  en: {
    title: 'Quote Calculator',
    subtitle: 'Calculate your estimated costs instantly',
    serviceCategory: 'Service Category',
    serviceTier: 'Service Tier',
    guestCount: 'Guest Count',
    addOns: 'Add-on Services',
    popular: 'Popular',
    perPerson: 'per person',
    basePrice: 'Base Price',
    addOnTotal: 'Add-on Services',
    subtotal: 'Subtotal',
    tax: 'Tax (21%)',
    total: 'Total',
    perPersonPrice: 'Per person',
    calculateQuote: 'Calculate Quote',
    getDetailedQuote: 'Detailed Quote',
    savings: 'Savings',
    estimate: 'Estimate',
    included: 'Included',
    optional: 'Optional',
    recommended: 'Recommended',
    guests: 'guests'
  }
} as const;

// Validation utilities
export const validateQuoteCalculatorProps = (props: {
  initialGuestCount?: number;
  onQuoteCalculated?: (quote: any) => void;
}) => {
  const errors: string[] = [];

  if (props.initialGuestCount !== undefined) {
    if (typeof props.initialGuestCount !== 'number' || props.initialGuestCount < QUOTE_GUEST_CONFIG.min || props.initialGuestCount > QUOTE_GUEST_CONFIG.max) {
      errors.push(`initialGuestCount must be a number between ${QUOTE_GUEST_CONFIG.min} and ${QUOTE_GUEST_CONFIG.max}`);
    }
  }

  if (props.onQuoteCalculated && typeof props.onQuoteCalculated !== 'function') {
    errors.push('onQuoteCalculated must be a function');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Quote calculation utilities
export const calculateBasePrice = (
  category: keyof typeof QUOTE_SERVICE_CATEGORIES,
  tier: keyof typeof QUOTE_SERVICE_TIERS,
  guestCount: number
): number => {
  const categoryConfig = QUOTE_SERVICE_CATEGORIES[category];
  const tierConfig = QUOTE_SERVICE_TIERS[tier];
  
  return categoryConfig.basePrice * tierConfig.multiplier * categoryConfig.multiplier * guestCount;
};

export const calculateAddOnPrice = (
  addOnKey: keyof typeof QUOTE_ADD_ONS,
  guestCount: number
): number => {
  const addOn = QUOTE_ADD_ONS[addOnKey];
  return addOn.perPerson ? addOn.price * guestCount : addOn.price;
};

export const calculateTotalQuote = (
  category: keyof typeof QUOTE_SERVICE_CATEGORIES,
  tier: keyof typeof QUOTE_SERVICE_TIERS,
  guestCount: number,
  selectedAddOns: (keyof typeof QUOTE_ADD_ONS)[]
): {
  basePrice: number;
  addOnTotal: number;
  subtotal: number;
  tax: number;
  total: number;
  perPerson: number;
} => {
  const basePrice = calculateBasePrice(category, tier, guestCount);
  const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + calculateAddOnPrice(addOn, guestCount), 0);
  const subtotal = basePrice + addOnTotal;
  const tax = subtotal * 0.21; // 21% VAT
  const total = subtotal + tax;
  const perPerson = total / guestCount;

  return {
    basePrice,
    addOnTotal,
    subtotal,
    tax,
    total,
    perPerson
  };
};

// Common CSS classes
export const QUOTE_CALCULATOR_STYLES = {
  card: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
  header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg',
  serviceButton: 'p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md',
  serviceButtonSelected: 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
  serviceButtonDefault: 'border-gray-200 bg-white hover:border-gray-300',
  tierButton: 'p-3 border-2 rounded-lg transition-all duration-200 cursor-pointer',
  tierButtonSelected: 'border-green-500 bg-green-50 ring-2 ring-green-200',
  tierButtonDefault: 'border-gray-200 bg-white hover:border-gray-300',
  addOnItem: 'flex items-center justify-between p-3 border rounded-lg',
  addOnSelected: 'border-green-500 bg-green-50',
  addOnDefault: 'border-gray-200 bg-white',
  priceDisplay: 'text-center p-4 bg-white rounded-lg border-2 border-blue-200',
  totalPrice: 'text-3xl font-bold text-blue-600',
  perPersonPrice: 'text-lg text-gray-600'
} as const;

// Component rendering functions
export const renderServiceCategories = (
  selectedCategory: string,
  onCategorySelect: (category: QuoteServiceCategory) => void
) => {
  return Object.entries(QUOTE_SERVICE_CATEGORIES).map(([key, category]) => {
    const CategoryIcon = category.icon;
    return (
      <div key={key} className="relative">
        <input
          type="radio"
          value={key}
          name="category"
          id={key}
          checked={selectedCategory === key}
          onChange={() => onCategorySelect(key as QuoteServiceCategory)}
          className="peer sr-only"
        />
        <label
          htmlFor={key}
          className={cn(
            QUOTE_CALCULATOR_STYLES.serviceButton,
            selectedCategory === key ? QUOTE_CALCULATOR_STYLES.serviceButtonSelected : QUOTE_CALCULATOR_STYLES.serviceButtonDefault
          )}
        >
          <div className="flex items-center gap-3">
            <CategoryIcon className="w-5 h-5" />
            <div>
              <h4 className="font-semibold">{category.label}</h4>
              <p className="text-sm text-gray-600">{category.description}</p>
              <div className="text-sm font-medium text-blue-600">
                €{category.basePrice.toFixed(2)} basis
              </div>
            </div>
          </div>
        </label>
      </div>
    );
  });
};

export const renderServiceTiers = (
  selectedTier: string,
  onTierSelect: (tier: QuoteServiceTier) => void
) => {
  return Object.entries(QUOTE_SERVICE_TIERS).map(([key, tier]) => {
    const TierIcon = tier.icon;
    return (
      <div key={key} className="relative">
        <input
          type="radio"
          value={key}
          name="tier"
          id={key}
          checked={selectedTier === key}
          onChange={() => onTierSelect(key as QuoteServiceTier)}
          className="peer sr-only"
        />
        <label
          htmlFor={key}
          className={cn(
            QUOTE_CALCULATOR_STYLES.tierButton,
            selectedTier === key ? QUOTE_CALCULATOR_STYLES.tierButtonSelected : QUOTE_CALCULATOR_STYLES.tierButtonDefault
          )}
        >
          <div className="flex items-center gap-2">
            <TierIcon className="w-5 h-5" />
            <div>
              <h4 className="font-semibold">{tier.label}</h4>
              <p className="text-sm text-gray-600">{tier.description}</p>
            </div>
          </div>
        </label>
      </div>
    );
  });
};

export type QuoteServiceCategory = keyof typeof QUOTE_SERVICE_CATEGORIES;
export type QuoteServiceTier = keyof typeof QUOTE_SERVICE_TIERS;
export type QuoteAddOn = keyof typeof QUOTE_ADD_ONS;
export type QuoteLanguageType = keyof typeof QUOTE_TRANSLATIONS;

// Import cn function for helper functions
import { cn } from '@/lib/utils';