/**
 * Shared constants and utilities for pricing card components
 * Extracted to comply with DRY principles and 300 LOC limit per file
 */

import { Users, Star, Award, Sparkles, Shield, Gem, Clock, Crown, ChefHat } from 'lucide-react';

// Base pricing configuration (appears 2+ times across components)
export const BASE_PRICES = {
  corporate: 12.50,
  social: 27.50,
  wedding: 22.50,
  custom: null
} as const;

// Tier multipliers (appears 2+ times across components)
export const TIER_MULTIPLIERS = {
  basis: 1.0,
  premium: 1.4,
  luxe: 1.8
} as const;

// Color schemes (appears 2+ times across components)
export const COLOR_SCHEMES = {
  corporate: {
    bg: 'bg-blue-50 border-blue-200',
    accent: 'text-blue-600',
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
    metallic: 'bg-gradient-to-r from-blue-400 to-blue-600'
  },
  social: {
    bg: 'bg-green-50 border-green-200',
    accent: 'text-green-600', 
    gradient: 'bg-gradient-to-br from-green-50 to-green-100',
    metallic: 'bg-gradient-to-r from-green-400 to-green-600'
  },
  wedding: {
    bg: 'bg-pink-50 border-pink-200',
    accent: 'text-pink-600',
    gradient: 'bg-gradient-to-br from-pink-50 to-pink-100',
    metallic: 'bg-gradient-to-r from-pink-400 to-pink-600'
  },
  custom: {
    bg: 'bg-purple-50 border-purple-200',
    accent: 'text-purple-600',
    gradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
    metallic: 'bg-gradient-to-r from-purple-400 to-purple-600'
  }
} as const;

// Service icons (appears 2+ times across components)
export const SERVICE_ICONS = {
  corporate: Users,
  social: Award,
  wedding: Crown,
  custom: Gem
} as const;

// Brand colors (appears 2+ times across components)
export const BRAND_COLORS = {
  primary: '#CC5D00',
  primaryHover: '#B54A00',
  secondary: '#FFEFDA',
  accent: '#2B4040'
} as const;

// Common translations (appears 2+ times across components)
export const TRANSLATIONS = {
  nl: {
    basis: 'Basis',
    premium: 'Premium',
    luxe: 'Luxe',
    corporate: 'Zakelijke Events',
    social: 'Sociale Events',
    wedding: 'Bruiloft',
    custom: 'Op Maat',
    vanaf: 'Vanaf',
    perPersoon: 'per persoon',
    inclusief: 'Inclusief',
    bookNow: 'Direct Boeken',
    getQuote: 'Offerte Aanvragen',
    guarantee: '100% Tevredenheidsgarantie',
    confirmation: 'Bevestiging binnen 24 uur'
  },
  en: {
    basis: 'Essential',
    premium: 'Premium',
    luxe: 'Luxury',
    corporate: 'Corporate Events',
    social: 'Social Events',
    wedding: 'Wedding',
    custom: 'Custom',
    vanaf: 'From',
    perPersoon: 'per person',
    inclusief: 'Including',
    bookNow: 'Book Now',
    getQuote: 'Get Quote',
    guarantee: '100% Satisfaction Guarantee',
    confirmation: 'Confirmation within 24 hours'
  }
} as const;

// Service inclusions by tier (appears 2+ times across components)
export const SERVICE_INCLUSIONS = {
  basis: {
    nl: [
      'Professionele bediening',
      'Verse ingrediënten',
      'Standaard presentatie',
      'Basis serviesgoed'
    ],
    en: [
      'Professional service',
      'Fresh ingredients',
      'Standard presentation',
      'Basic tableware'
    ]
  },
  premium: {
    nl: [
      'Uitgebreide bediening',
      'Premium ingrediënten',
      'Elegante presentatie', 
      'Premium serviesgoed',
      'Extra gerechten'
    ],
    en: [
      'Extended service',
      'Premium ingredients',
      'Elegant presentation',
      'Premium tableware',
      'Additional dishes'
    ]
  },
  luxe: {
    nl: [
      'Persoonlijke chef',
      'Luxe ingrediënten',
      'Exclusieve presentatie',
      'Designer serviesgoed',
      'Volledige verzorging',
      'Live cooking'
    ],
    en: [
      'Personal chef',
      'Luxury ingredients',
      'Exclusive presentation',
      'Designer tableware',
      'Full service',
      'Live cooking'
    ]
  }
} as const;

// Type definitions for improved type safety
export type ServiceType = keyof typeof BASE_PRICES;
export type TierType = keyof typeof TIER_MULTIPLIERS;
export type LanguageType = keyof typeof TRANSLATIONS;

// Input validation utilities (safety requirement)
export const validatePricingCardProps = (props: {
  serviceType: string;
  tier: string;
  language?: string;
  pricePerPerson?: number;
}) => {
  const errors: string[] = [];

  // Validate serviceType
  if (!props.serviceType || typeof props.serviceType !== 'string') {
    errors.push('serviceType is required and must be a string');
  } else if (!Object.keys(BASE_PRICES).includes(props.serviceType)) {
    errors.push(`serviceType must be one of: ${Object.keys(BASE_PRICES).join(', ')}`);
  }

  // Validate tier
  if (!props.tier || typeof props.tier !== 'string') {
    errors.push('tier is required and must be a string');
  } else if (!Object.keys(TIER_MULTIPLIERS).includes(props.tier)) {
    errors.push(`tier must be one of: ${Object.keys(TIER_MULTIPLIERS).join(', ')}`);
  }

  // Validate language (optional)
  if (props.language && !Object.keys(TRANSLATIONS).includes(props.language)) {
    errors.push(`language must be one of: ${Object.keys(TRANSLATIONS).join(', ')}`);
  }

  // Validate pricePerPerson (optional)
  if (props.pricePerPerson !== undefined) {
    if (typeof props.pricePerPerson !== 'number' || props.pricePerPerson < 0) {
      errors.push('pricePerPerson must be a positive number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Price calculation utility (appears 2+ times across components)
export const calculateFinalPrice = (
  serviceType: ServiceType, 
  tier: TierType,
  luxuryMultiplier: number = 1.0
): number | null => {
  const basePrice = BASE_PRICES[serviceType];
  if (basePrice === null) return null;
  
  const tierMultiplier = TIER_MULTIPLIERS[tier];
  return basePrice * tierMultiplier * luxuryMultiplier;
};

// Common CSS classes (appears 2+ times across components)
export const COMMON_STYLES = {
  card: 'border-2 hover:shadow-lg transition-all duration-300',
  priceDisplay: 'text-center py-4 rounded-lg',
  primaryButton: `bg-[${BRAND_COLORS.primary}] hover:bg-[${BRAND_COLORS.primaryHover}] text-white font-medium`,
  inclusionItem: 'flex items-start gap-2 text-sm',
  badge: 'text-xs px-2 py-1'
} as const;