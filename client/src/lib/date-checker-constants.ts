
export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  features: string[];
  popularFeatures: string[];
}

export interface ServiceTier {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  features: string[];
}

export interface BookingData {
  date: Date;
  time: string;
  guestCount: number;
}

export interface BookingState {
  selectedDate: Date;
  selectedTime: string;
  guestCount: number;
  step: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Check if all required booking data is present
 */
export function isBookingComplete(bookingState: BookingState): boolean {
  return !!(
    bookingState.selectedDate &&
    bookingState.selectedTime &&
    bookingState.guestCount > 0
  );
}

/**
 * Validate booking data against service category and tier requirements
 */
export function validateBookingData(
  bookingData: BookingData,
  serviceCategory: ServiceCategory,
  serviceTier: ServiceTier
): ValidationResult {
  const errors: string[] = [];

  // Validate date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(bookingData.date);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < currentDate) {
    errors.push("Datum moet in de toekomst liggen");
  }
  
  // Validate time
  if (!bookingData.time) {
    errors.push("Tijd is verplicht");
  }
  
  // Validate guest count based on service category
  if (bookingData.guestCount < 10) {
    errors.push("Minimum aantal gasten is 10");
  }
  
  if (serviceCategory.id === "wedding" && bookingData.guestCount < 20) {
    errors.push("Bruiloften vereisen minimaal 20 gasten");
  }
  
  if (serviceCategory.id === "corporate" && bookingData.guestCount > 250) {
    errors.push("Zakelijke events hebben een maximum van 250 gasten");
  }
  
  // Additional validation for premium and luxury tiers
  if (serviceTier.id === "premium" || serviceTier.id === "luxury") {
    const bookingDate = new Date(bookingData.date);
    const advanceTimeRequired = serviceTier.id === "luxury" ? 14 : 7; // days
    
    const minBookingDate = new Date();
    minBookingDate.setDate(minBookingDate.getDate() + advanceTimeRequired);
    
    if (bookingDate < minBookingDate) {
      errors.push(
        `${serviceTier.name} service vereist minimaal ${advanceTimeRequired} dagen vooraf te boeken`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
