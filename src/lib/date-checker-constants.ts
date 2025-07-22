/**
 * Shared constants and utilities for date checker components
 * Extracted to comply with DRY principles and 300 LOC limit per file
 */

import {
  CalendarDays,
  Clock,
  Users,
  Sparkles,
  CheckCircle,
  Calculator,
  AlertCircle,
} from "lucide-react";

// Time slots configuration
export const TIME_SLOTS = [
  { value: "11:00", label: "11:00", category: "lunch" },
  { value: "12:00", label: "12:00", category: "lunch" },
  { value: "13:00", label: "13:00", category: "lunch" },
  { value: "17:00", label: "17:00", category: "dinner" },
  { value: "18:00", label: "18:00", category: "dinner" },
  { value: "19:00", label: "19:00", category: "dinner" },
  { value: "20:00", label: "20:00", category: "dinner" },
] as const;

// Guest count configuration
export const GUEST_COUNT_CONFIG = {
  min: 10,
  max: 200,
  default: 20,
  step: 5,
} as const;

// Service categories with pricing and guest limits
export const SERVICE_CATEGORIES = {
  corporate: {
    label: "Zakelijke Events",
    basePrice: 12.5,
    icon: Users,
    minGuests: 10,
    maxGuests: 200,
    allowedTimeSlots: [
      "11:00",
      "12:00",
      "13:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ],
  },
  social: {
    label: "Sociale Events",
    basePrice: 27.5,
    icon: Sparkles,
    minGuests: 5,
    maxGuests: 150,
    allowedTimeSlots: ["17:00", "18:00", "19:00", "20:00"],
  },
  wedding: {
    label: "Bruiloft",
    basePrice: 22.5,
    icon: CheckCircle,
    minGuests: 20,
    maxGuests: 200,
    allowedTimeSlots: ["12:00", "13:00", "17:00", "18:00", "19:00"],
  },
  custom: {
    label: "Op Maat",
    basePrice: null,
    icon: Calculator,
    minGuests: 1,
    maxGuests: 500,
    allowedTimeSlots: [
      "11:00",
      "12:00",
      "13:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ],
  },
} as const;

// Service tiers with multipliers and restrictions
export const SERVICE_TIERS = {
  basis: {
    label: "Basis",
    multiplier: 1.0,
    allowedTimeSlots: ["11:00", "12:00", "13:00"],
  },
  premium: {
    label: "Premium",
    multiplier: 1.4,
    allowedTimeSlots: ["11:00", "12:00", "13:00", "17:00", "18:00", "19:00"],
  },
  luxe: {
    label: "Luxe",
    multiplier: 1.8,
    allowedTimeSlots: [
      "11:00",
      "12:00",
      "13:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ],
  },
} as const;

// Dynamic Dutch holidays generator
export const generateDutchHolidays = (year: number): string[] => {
  const holidays = [
    `${year}-01-01`, // New Year's Day
    `${year}-04-27`, // King's Day
    `${year}-05-05`, // Liberation Day (every 5 years officially, but often celebrated)
    `${year}-12-25`, // Christmas Day
    `${year}-12-26`, // Boxing Day
    `${year}-12-31`, // New Year's Eve
  ];

  // Easter calculation (simplified for common cases)
  const easter = calculateEaster(year);
  holidays.push(
    formatDate(easter), // Easter Sunday
    formatDate(addDays(easter, 1)), // Easter Monday
    formatDate(addDays(easter, 39)), // Ascension Day
    formatDate(addDays(easter, 50)), // Whit Monday
  );

  return holidays.sort();
};

// Simplified Easter calculation (Gregorian calendar)
const calculateEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Get blackout dates for current and next year
export const getBlackoutDates = (): string[] => {
  const currentYear = new Date().getFullYear();
  return [
    ...generateDutchHolidays(currentYear),
    ...generateDutchHolidays(currentYear + 1),
  ];
};

// Legacy static dates for compatibility (auto-updated)
export const BLACKOUT_DATES = getBlackoutDates();

// UI translations
export const DATE_CHECKER_TRANSLATIONS = {
  nl: {
    title: "Controleer Beschikbaarheid",
    subtitle: "Kies uw gewenste datum en tijd",
    selectDate: "Selecteer een datum",
    selectTime: "Kies een tijdslot",
    guestCount: "Aantal gasten",
    guests: "gasten",
    checkAvailability: "Controleer Beschikbaarheid",
    confirm: "Bevestigen",
    calculateQuote: "Bereken Offerte",
    available: "Beschikbaar",
    limited: "Beperkt beschikbaar",
    unavailable: "Niet beschikbaar",
    popular: "Populair tijdslot",
    recommended: "Aanbevolen",
    estimatedPrice: "Geschatte prijs",
    perPerson: "per persoon",
    loading: "Laden...",
    error: "Er is een fout opgetreden",
    success: "Geweldige keuze!",
    noSlotsAvailable: "Geen tijdsloten beschikbaar voor deze datum",
    validationError: "Controleer uw invoer en probeer opnieuw",
    bookingSuccess: "Uw reservering is bevestigd!",
  },
  en: {
    title: "Check Availability",
    subtitle: "Choose your preferred date and time",
    selectDate: "Select a date",
    selectTime: "Choose a time slot",
    guestCount: "Number of guests",
    guests: "guests",
    checkAvailability: "Check Availability",
    confirm: "Confirm",
    calculateQuote: "Calculate Quote",
    available: "Available",
    limited: "Limited availability",
    unavailable: "Unavailable",
    popular: "Popular time slot",
    recommended: "Recommended",
    estimatedPrice: "Estimated price",
    perPerson: "per person",
    loading: "Loading...",
    error: "An error occurred",
    success: "Great choice!",
    noSlotsAvailable: "No time slots available for this date",
    validationError: "Please check your input and try again",
    bookingSuccess: "Your reservation has been confirmed!",
  },
} as const;

// Validation utilities
export const validateDateCheckerProps = (props: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: (date: Date, time: string, guests: number) => void;
}) => {
  const errors: string[] = [];

  if (typeof props.open !== "boolean") {
    errors.push("open must be a boolean");
  }

  if (props.onOpenChange && typeof props.onOpenChange !== "function") {
    errors.push("onOpenChange must be a function");
  }

  if (props.onConfirm && typeof props.onConfirm !== "function") {
    errors.push("onConfirm must be a function");
  }

  return {
    isValid: errors.length === 0,
    errors,
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
  const dateString = date.toISOString().split("T")[0];
  if (BLACKOUT_DATES.includes(dateString)) {
    return false;
  }

  return true;
};

export const getAvailabilityStatus = (
  date: Date,
  isBooked: boolean,
  isLimited: boolean,
): "available" | "limited" | "unavailable" => {
  if (isBooked) return "unavailable";
  if (isLimited) return "limited";
  return "available";
};

// Price calculation utility
export const calculateEstimatedPrice = (
  category: keyof typeof SERVICE_CATEGORIES,
  tier: keyof typeof SERVICE_TIERS,
  guestCount: number,
): number | null => {
  const categoryConfig = SERVICE_CATEGORIES[category];
  if (!categoryConfig.basePrice) return null;

  const tierConfig = SERVICE_TIERS[tier];
  return categoryConfig.basePrice * tierConfig.multiplier * guestCount;
};

// Common CSS classes
export const DATE_CHECKER_STYLES = {
  modal: "sm:max-w-2xl",
  timeSlot: "p-3 text-sm rounded-lg border-2 transition-all duration-200",
  timeSlotAvailable: "border-green-200 bg-green-50 hover:border-green-300",
  timeSlotLimited: "border-orange-200 bg-orange-50 hover:border-orange-300",
  timeSlotUnavailable:
    "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50",
  timeSlotSelected: "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
  stepHeader: "flex items-center gap-2 mb-4",
  stepNumber:
    "w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium",
  estimateCard: "mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200",
} as const;

// Toast durations for consistent UX timing
export const TOAST_DURATIONS = {
  success: 2000,
  confirmation: 3000,
  error: 4000,
} as const;

// Navigation labels for i18n consistency
export const NAVIGATION_LABELS = {
  nl: {
    previous: "Vorige",
    next: "Volgende",
    dateSelectedSuccess: "geselecteerd.",
    bookingConfirmedSuccess: "Reservering voor {count} gasten bevestigd.",
    screenReaderStepAnnouncement: "Stap {step} van 3: {stepName}",
  },
  en: {
    previous: "Previous",
    next: "Next",
    dateSelectedSuccess: "selected.",
    bookingConfirmedSuccess: "Reservation for {count} guests confirmed.",
    screenReaderStepAnnouncement: "Step {step} of 3: {stepName}",
  },
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
  serviceTier?: keyof typeof SERVICE_TIERS,
) => {
  const errors: string[] = [];

  // Basic validation
  if (!data.date) {
    errors.push("Date is required");
  } else {
    // Check if date is selectable (includes blackout date check)
    if (!isDateSelectable(data.date)) {
      errors.push("Selected date is not available for booking");
    }
  }

  if (!data.time) {
    errors.push("Time is required");
  }

  // General guest count validation
  if (
    data.guestCount < GUEST_COUNT_CONFIG.min ||
    data.guestCount > GUEST_COUNT_CONFIG.max
  ) {
    errors.push(
      `Guest count must be between ${GUEST_COUNT_CONFIG.min} and ${GUEST_COUNT_CONFIG.max}`,
    );
  }

  // Service-specific validation
  if (serviceCategory && SERVICE_CATEGORIES[serviceCategory]) {
    const category = SERVICE_CATEGORIES[serviceCategory];

    // Service-specific guest limits
    if (
      data.guestCount < category.minGuests ||
      data.guestCount > category.maxGuests
    ) {
      errors.push(
        `For ${category.label}, guest count must be between ${category.minGuests} and ${category.maxGuests}`,
      );
    }

    // Service-specific time slot validation
    if (data.time && !category.allowedTimeSlots.includes(data.time)) {
      errors.push(
        `Time slot ${data.time} is not available for ${category.label}`,
      );
    }
  }

  // Service tier validation
  if (serviceTier && SERVICE_TIERS[serviceTier] && data.time) {
    const tier = SERVICE_TIERS[serviceTier];

    // Tier-specific time slot constraints
    if (!tier.allowedTimeSlots.includes(data.time)) {
      errors.push(
        `Time slot ${data.time} is not available for ${tier.label} tier`,
      );
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
      errors.push(
        `Time slot ${data.time} is not available for ${category.label} with ${tier.label} tier`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Safe translation accessor with fallback mechanism
 * Returns English text if a translation key is missing for the requested language
 */
export const getTranslation = (
  language: keyof typeof DATE_CHECKER_TRANSLATIONS,
  key: keyof (typeof DATE_CHECKER_TRANSLATIONS)["nl"],
): string => {
  const translations = DATE_CHECKER_TRANSLATIONS[language];

  // If language exists and has the key, return it
  if (translations && translations[key]) {
    return translations[key];
  }

  // Fallback to English
  const englishTranslations = DATE_CHECKER_TRANSLATIONS.en;
  if (englishTranslations && englishTranslations[key]) {
    return englishTranslations[key];
  }

  // Ultimate fallback: return key name with proper formatting
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
};

/**
 * Safe navigation label accessor with fallback mechanism
 */
export const getNavigationLabel = (
  language: keyof typeof NAVIGATION_LABELS,
  key: keyof (typeof NAVIGATION_LABELS)["nl"],
): string => {
  const labels = NAVIGATION_LABELS[language];

  // If language exists and has the key, return it
  if (labels && labels[key]) {
    return labels[key];
  }

  // Fallback to English
  const englishLabels = NAVIGATION_LABELS.en;
  if (englishLabels && englishLabels[key]) {
    return englishLabels[key];
  }

  // Ultimate fallback: return key name with proper formatting
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
};

/**
 * Enhanced translation object with safe accessors
 * Provides fallback behavior if translation keys are missing
 */
export const createSafeTranslations = (
  language: keyof typeof DATE_CHECKER_TRANSLATIONS,
) => {
  return new Proxy(
    {},
    {
      get: (target, prop: string) => {
        return getTranslation(
          language,
          prop as keyof (typeof DATE_CHECKER_TRANSLATIONS)["nl"],
        );
      },
    },
  ) as (typeof DATE_CHECKER_TRANSLATIONS)["nl"];
};

/**
 * Enhanced navigation labels with safe accessors
 */
export const createSafeNavigationLabels = (
  language: keyof typeof NAVIGATION_LABELS,
) => {
  return new Proxy(
    {},
    {
      get: (target, prop: string) => {
        return getNavigationLabel(
          language,
          prop as keyof (typeof NAVIGATION_LABELS)["nl"],
        );
      },
    },
  ) as (typeof NAVIGATION_LABELS)["nl"];
};

export type ServiceCategory = keyof typeof SERVICE_CATEGORIES;
export type ServiceTier = keyof typeof SERVICE_TIERS;
export type TimeSlot = (typeof TIME_SLOTS)[number];
export type LanguageType = keyof typeof DATE_CHECKER_TRANSLATIONS;
