/**
 * Shared constants and utilities for date checker components
 * Extracted to comply with DRY principles and 300 LOC limit per file
 */

import { CalendarDays, Clock, Users, Sparkles, CheckCircle, Calculator, AlertCircle } from 'lucide-react';

// Time slots configuration
export const TIME_SLOTS = [
  { value: '11:00', label: '11:00', category: 'lunch' },
  { value: '12:00', label: '12:00', category: 'lunch' },
  { value: '13:00', label: '13:00', category: 'lunch' },
  { value: '17:00', label: '17:00', category: 'dinner' },
  { value: '18:00', label: '18:00', category: 'dinner' },
  { value: '19:00', label: '19:00', category: 'dinner' },
  { value: '20:00', label: '20:00', category: 'dinner' }
] as const;

// Guest count configuration
export const GUEST_COUNT_CONFIG = {
  min: 10,
  max: 200,
  default: 20,
  step: 5
} as const;

// Service categories with pricing
export const SERVICE_CATEGORIES = {
  corporate: { label: 'Zakelijke Events', basePrice: 12.50, icon: Users },
  social: { label: 'Sociale Events', basePrice: 27.50, icon: Sparkles },
  wedding: { label: 'Bruiloft', basePrice: 22.50, icon: CheckCircle },
  custom: { label: 'Op Maat', basePrice: null, icon: Calculator }
} as const;

// Service tiers with multipliers
export const SERVICE_TIERS = {
  basis: { label: 'Basis', multiplier: 1.0 },
  premium: { label: 'Premium', multiplier: 1.4 },
  luxe: { label: 'Luxe', multiplier: 1.8 }
} as const;

// UI translations
export const DATE_CHECKER_TRANSLATIONS = {
  nl: {
    title: 'Controleer Beschikbaarheid',
    subtitle: 'Kies uw gewenste datum en tijd',
    selectDate: 'Selecteer een datum',
    selectTime: 'Kies een tijdslot',
    guestCount: 'Aantal gasten',
    guests: 'gasten',
    checkAvailability: 'Controleer Beschikbaarheid',
    confirm: 'Bevestigen',
    calculateQuote: 'Bereken Offerte',
    available: 'Beschikbaar',
    limited: 'Beperkt beschikbaar',
    unavailable: 'Niet beschikbaar',
    popular: 'Populair tijdslot',
    recommended: 'Aanbevolen',
    estimatedPrice: 'Geschatte prijs',
    perPerson: 'per persoon',
    loading: 'Laden...',
    error: 'Er is een fout opgetreden',
    success: 'Geweldige keuze!',
    noSlotsAvailable: 'Geen tijdsloten beschikbaar voor deze datum'
  },
  en: {
    title: 'Check Availability',
    subtitle: 'Choose your preferred date and time',
    selectDate: 'Select a date',
    selectTime: 'Choose a time slot',
    guestCount: 'Number of guests',
    guests: 'guests',
    checkAvailability: 'Check Availability',
    confirm: 'Confirm',
    calculateQuote: 'Calculate Quote',
    available: 'Available',
    limited: 'Limited availability',
    unavailable: 'Unavailable',
    popular: 'Popular time slot',
    recommended: 'Recommended',
    estimatedPrice: 'Estimated price',
    perPerson: 'per person',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Great choice!',
    noSlotsAvailable: 'No time slots available for this date'
  }
} as const;

// Validation utilities
export const validateDateCheckerProps = (props: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: (date: Date, time: string, guests: number) => void;
}) => {
  const errors: string[] = [];

  if (typeof props.open !== 'boolean') {
    errors.push('open must be a boolean');
  }

  if (props.onOpenChange && typeof props.onOpenChange !== 'function') {
    errors.push('onOpenChange must be a function');
  }

  if (props.onConfirm && typeof props.onConfirm !== 'function') {
    errors.push('onConfirm must be a function');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Date utilities
export const isDateSelectable = (date: Date): boolean => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6); // 6 months ahead
  
  return date >= today && date <= maxDate;
};

export const getAvailabilityStatus = (
  date: Date,
  isBooked: boolean,
  isLimited: boolean
): 'available' | 'limited' | 'unavailable' => {
  if (isBooked) return 'unavailable';
  if (isLimited) return 'limited';
  return 'available';
};

// Price calculation utility
export const calculateEstimatedPrice = (
  category: keyof typeof SERVICE_CATEGORIES,
  tier: keyof typeof SERVICE_TIERS,
  guestCount: number
): number | null => {
  const categoryConfig = SERVICE_CATEGORIES[category];
  if (!categoryConfig.basePrice) return null;
  
  const tierConfig = SERVICE_TIERS[tier];
  return categoryConfig.basePrice * tierConfig.multiplier * guestCount;
};

// Common CSS classes
export const DATE_CHECKER_STYLES = {
  modal: 'sm:max-w-2xl',
  timeSlot: 'p-3 text-sm rounded-lg border-2 transition-all duration-200',
  timeSlotAvailable: 'border-green-200 bg-green-50 hover:border-green-300',
  timeSlotLimited: 'border-orange-200 bg-orange-50 hover:border-orange-300',
  timeSlotUnavailable: 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50',
  timeSlotSelected: 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
  stepHeader: 'flex items-center gap-2 mb-4',
  stepNumber: 'w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium',
  estimateCard: 'mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200'
} as const;

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;
export type ServiceTier = keyof typeof SERVICE_TIERS;
export type TimeSlot = typeof TIME_SLOTS[number];
export type LanguageType = keyof typeof DATE_CHECKER_TRANSLATIONS;