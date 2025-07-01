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

// Service categories with pricing and guest limits
export const SERVICE_CATEGORIES = {
  corporate: { 
    label: 'Zakelijke Events', 
    basePrice: 12.50, 
    icon: Users,
    minGuests: 10,
    maxGuests: 200,
    allowedTimeSlots: ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00']
  },
  social: { 
    label: 'Sociale Events', 
    basePrice: 27.50, 
    icon: Sparkles,
    minGuests: 5,
    maxGuests: 150,
    allowedTimeSlots: ['17:00', '18:00', '19:00', '20:00']
  },
  wedding: { 
    label: 'Bruiloft', 
    basePrice: 22.50, 
    icon: CheckCircle,
    minGuests: 20,
    maxGuests: 200,
    allowedTimeSlots: ['12:00', '13:00', '17:00', '18:00', '19:00']
  },
  custom: { 
    label: 'Op Maat', 
    basePrice: null, 
    icon: Calculator,
    minGuests: 1,
    maxGuests: 500,
    allowedTimeSlots: ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00']
  }
} as const;

// Service tiers with multipliers and restrictions
export const SERVICE_TIERS = {
  basis: { 
    label: 'Basis', 
    multiplier: 1.0,
    allowedTimeSlots: ['11:00', '12:00', '13:00']
  },
  premium: { 
    label: 'Premium', 
    multiplier: 1.4,
    allowedTimeSlots: ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00']
  },
  luxe: { 
    label: 'Luxe', 
    multiplier: 1.8,
    allowedTimeSlots: ['11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00']
  }
} as const;

// Blackout dates configuration
export const BLACKOUT_DATES = [
  // Dutch national holidays and peak periods
  '2024-12-25', // Christmas Day
  '2024-12-26', // Boxing Day
  '2024-12-31', // New Year's Eve
  '2025-01-01', // New Year's Day
  '2025-04-27', // King's Day
  '2025-05-05', // Liberation Day
  // Add more dates as needed
] as const;

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
    noSlotsAvailable: 'Geen tijdsloten beschikbaar voor deze datum',
    validationError: 'Controleer uw invoer en probeer opnieuw',
    bookingSuccess: 'Uw reservering is bevestigd!'
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
    noSlotsAvailable: 'No time slots available for this date',
    validationError: 'Please check your input and try again',
    bookingSuccess: 'Your reservation has been confirmed!'
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
  
  // Check if date is within valid range
  if (date < today || date > maxDate) {
    return false;
  }
  
  // Check if date is a blackout date
  const dateString = date.toISOString().split('T')[0];
  if (BLACKOUT_DATES.includes(dateString as any)) {
    return false;
  }
  
  return true;
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

// Toast durations for consistent UX timing
export const TOAST_DURATIONS = {
  success: 2000,
  confirmation: 3000,
  error: 4000
} as const;

// Navigation labels for i18n consistency
export const NAVIGATION_LABELS = {
  nl: {
    previous: 'Vorige',
    next: 'Volgende',
    dateSelectedSuccess: 'geselecteerd.',
    bookingConfirmedSuccess: 'Reservering voor {count} gasten bevestigd.',
    screenReaderStepAnnouncement: 'Stap {step} van 3: {stepName}'
  },
  en: {
    previous: 'Previous',
    next: 'Next',
    dateSelectedSuccess: 'selected.',
    bookingConfirmedSuccess: 'Reservation for {count} guests confirmed.',
    screenReaderStepAnnouncement: 'Step {step} of 3: {stepName}'
  }
} as const;

// Validation helper for booking completion
export const isBookingComplete = (state: {
  selectedDate?: Date;
  selectedTime: string;
  step: number;
}): boolean => {
  return !!(state.selectedDate && state.selectedTime && state.step >= 3);
};

// Form validation utilities with enhanced business rules
export const validateBookingData = (
  data: {
    date?: Date;
    time: string;
    guestCount: number;
  },
  serviceCategory?: keyof typeof SERVICE_CATEGORIES,
  serviceTier?: keyof typeof SERVICE_TIERS
) => {
  const errors: string[] = [];
  
  // Basic validation
  if (!data.date) {
    errors.push('Date is required');
  } else {
    // Check if date is selectable (includes blackout date check)
    if (!isDateSelectable(data.date)) {
      errors.push('Selected date is not available for booking');
    }
  }
  
  if (!data.time) {
    errors.push('Time is required');
  }
  
  // General guest count validation
  if (data.guestCount < GUEST_COUNT_CONFIG.min || data.guestCount > GUEST_COUNT_CONFIG.max) {
    errors.push(`Guest count must be between ${GUEST_COUNT_CONFIG.min} and ${GUEST_COUNT_CONFIG.max}`);
  }
  
  // Service-specific validation
  if (serviceCategory && SERVICE_CATEGORIES[serviceCategory]) {
    const category = SERVICE_CATEGORIES[serviceCategory];
    
    // Service-specific guest limits
    if (data.guestCount < category.minGuests || data.guestCount > category.maxGuests) {
      errors.push(`For ${category.label}, guest count must be between ${category.minGuests} and ${category.maxGuests}`);
    }
    
    // Service-specific time slot validation
    if (data.time && !category.allowedTimeSlots.includes(data.time)) {
      errors.push(`Time slot ${data.time} is not available for ${category.label}`);
    }
  }
  
  // Service tier validation
  if (serviceTier && SERVICE_TIERS[serviceTier] && data.time) {
    const tier = SERVICE_TIERS[serviceTier];
    
    // Tier-specific time slot constraints
    if (!tier.allowedTimeSlots.includes(data.time)) {
      errors.push(`Time slot ${data.time} is not available for ${tier.label} tier`);
    }
  }
  
  // Combined validation for category + tier
  if (serviceCategory && serviceTier && data.time) {
    const category = SERVICE_CATEGORIES[serviceCategory];
    const tier = SERVICE_TIERS[serviceTier];
    
    // Check if time slot is allowed by both category and tier
    const allowedByCategory = category.allowedTimeSlots.includes(data.time);
    const allowedByTier = tier.allowedTimeSlots.includes(data.time);
    
    if (!allowedByCategory || !allowedByTier) {
      errors.push(`Time slot ${data.time} is not available for ${category.label} with ${tier.label} tier`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;
export type ServiceTier = keyof typeof SERVICE_TIERS;
export type TimeSlot = typeof TIME_SLOTS[number];
export type LanguageType = keyof typeof DATE_CHECKER_TRANSLATIONS;