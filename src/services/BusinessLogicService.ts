import { SafeLogger } from '@/lib/LoggerUtils';
import { ValidationService } from './ValidationService';

export interface QuoteCalculation {
  basePrice: number;
  addOnTotal: number;
  tax: number;
  total: number;
  perPerson: number;
  breakdown: {
    category: string;
    tier: string;
    guestCount: number;
    addOns: Array<{ name: string; price: number; perPerson: boolean }>;
  };
}

export interface AvailabilityCheck {
  date: Date;
  time: string;
  status: 'available' | 'limited' | 'unavailable';
  reason?: string;
}

/**
 * Centralized business logic service
 * Handles calculations, availability checks, and business rules
 */
export class BusinessLogicService {
  private static instance: BusinessLogicService;
  private validationService: ValidationService;

  private constructor() {
    this.validationService = ValidationService.getInstance();
  }

  static getInstance(): BusinessLogicService {
    if (!BusinessLogicService.instance) {
      BusinessLogicService.instance = new BusinessLogicService();
    }
    return BusinessLogicService.instance;
  }

  /**
   * Calculate comprehensive quote with all components
   */
  calculateQuote(
    category: string,
    tier: string,
    guestCount: number,
    addOns: string[] = []
  ): QuoteCalculation {
    try {
      // Validate inputs
      const guestValidation = this.validationService.validateGuestCount(guestCount, category);
      if (!guestValidation.isValid) {
        throw new Error(`Invalid guest count: ${guestValidation.errors.join(', ')}`);
      }

      // Base price calculation
      const basePrice = this.calculateBasePrice(category, tier, guestCount);
      
      // Add-ons calculation
      const addOnTotal = this.calculateAddOnsTotal(addOns, guestCount);
      
      // Tax calculation (21% BTW in Netherlands)
      const tax = (basePrice + addOnTotal) * 0.21;
      
      // Total calculation
      const total = basePrice + addOnTotal + tax;
      const perPerson = total / guestCount;

      // Create breakdown
      const breakdown = {
        category,
        tier,
        guestCount,
        addOns: addOns.map(addOn => this.getAddOnDetails(addOn))
      };

      return {
        basePrice,
        addOnTotal,
        tax,
        total,
        perPerson,
        breakdown
      };
    } catch (error) {
      SafeLogger.error('Quote calculation error:', error, { 
        category, tier, guestCount, addOns 
      });
      throw new Error('Unable to calculate quote');
    }
  }

  /**
   * Calculate base price for service category and tier
   */
  private calculateBasePrice(category: string, tier: string, guestCount: number): number {
    const basePrices = {
      corporate: 12.50,
      social: 27.50,
      wedding: 22.50,
      custom: 0
    };

    const tierMultipliers = {
      basis: 1.0,
      premium: 1.4,
      luxe: 1.8
    };

    const basePrice = basePrices[category] || 15.00;
    const multiplier = tierMultipliers[tier] || 1.0;

    return basePrice * multiplier * guestCount;
  }

  /**
   * Calculate add-ons total price
   */
  private calculateAddOnsTotal(addOns: string[], guestCount: number): number {
    const addOnPrices = {
      'drinks-package': { price: 15.00, perPerson: true },
      'appetizer-selection': { price: 8.50, perPerson: true },
      'dessert-upgrade': { price: 6.00, perPerson: true },
      'wine-pairing': { price: 25.00, perPerson: true },
      'live-cooking': { price: 150.00, perPerson: false },
      'premium-service': { price: 200.00, perPerson: false }
    };

    let total = 0;
    for (const addOn of addOns) {
      const addOnConfig = addOnPrices[addOn];
      if (addOnConfig) {
        total += addOnConfig.perPerson ? addOnConfig.price * guestCount : addOnConfig.price;
      }
    }

    return total;
  }

  /**
   * Get add-on details for breakdown
   */
  private getAddOnDetails(addOn: string) {
    const addOnConfigs = {
      'drinks-package': { name: 'Drankenpakket', price: 15.00, perPerson: true },
      'appetizer-selection': { name: 'Borrelhapjes Selectie', price: 8.50, perPerson: true },
      'dessert-upgrade': { name: 'Dessert Upgrade', price: 6.00, perPerson: true },
      'wine-pairing': { name: 'Wijn Arrangement', price: 25.00, perPerson: true },
      'live-cooking': { name: 'Live Cooking', price: 150.00, perPerson: false },
      'premium-service': { name: 'Premium Service', price: 200.00, perPerson: false }
    };

    return addOnConfigs[addOn] || { name: addOn, price: 0, perPerson: false };
  }

  /**
   * Check availability for given date and time
   */
  checkAvailability(date: Date, time: string): AvailabilityCheck {
    try {
      const dateValidation = this.validationService.validateValue(
        { date, time },
        [
          {
            name: 'date_future',
            validate: (d) => d.date > new Date(),
            message: 'Date must be in the future',
            severity: 'error'
          },
          {
            name: 'time_valid',
            validate: (d) => /^\d{2}:\d{2}$/.test(d.time),
            message: 'Invalid time format',
            severity: 'error'
          }
        ]
      );

      if (!dateValidation.isValid) {
        return {
          date,
          time,
          status: 'unavailable',
          reason: dateValidation.errors.join(', ')
        };
      }

      // Business logic for availability
      const dayOfWeek = date.getDay();
      const hour = parseInt(time.split(':')[0]);

      // Weekend restrictions
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (hour < 12 || hour > 20) {
          return {
            date,
            time,
            status: 'unavailable',
            reason: 'Weekend availability limited to 12:00-20:00'
          };
        }
        return {
          date,
          time,
          status: 'limited',
          reason: 'Weekend booking - limited availability'
        };
      }

      // Weekday restrictions
      if (hour < 11 || hour > 20) {
        return {
          date,
          time,
          status: 'unavailable',
          reason: 'Weekday availability limited to 11:00-20:00'
        };
      }

      // Peak hours have limited availability
      if (hour >= 17 && hour <= 19) {
        return {
          date,
          time,
          status: 'limited',
          reason: 'Peak hours - limited availability'
        };
      }

      return {
        date,
        time,
        status: 'available'
      };
    } catch (error) {
      SafeLogger.error('Availability check error:', error, { date, time });
      return {
        date,
        time,
        status: 'unavailable',
        reason: 'Unable to check availability'
      };
    }
  }

  /**
   * Calculate estimated delivery time
   */
  calculateDeliveryTime(guestCount: number, complexity: string = 'standard'): number {
    const baseTime = 120; // 2 hours base
    const guestMultiplier = Math.max(1, guestCount / 50);
    const complexityMultiplier = {
      simple: 0.8,
      standard: 1.0,
      complex: 1.5
    };

    const multiplier = complexityMultiplier[complexity] || 1.0;
    return Math.round(baseTime * guestMultiplier * multiplier);
  }

  /**
   * Validate business rules for booking
   */
  validateBookingRules(
    category: string,
    tier: string,
    guestCount: number,
    date: Date,
    time: string
  ): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Category-specific guest count validation
      const minGuests = {
        corporate: 10,
        social: 5,
        wedding: 20,
        custom: 1
      };

      const maxGuests = {
        corporate: 200,
        social: 150,
        wedding: 200,
        custom: 500
      };

      if (guestCount < minGuests[category]) {
        errors.push(`Minimum ${minGuests[category]} gasten vereist voor ${category}`);
      }

      if (guestCount > maxGuests[category]) {
        errors.push(`Maximum ${maxGuests[category]} gasten toegestaan voor ${category}`);
      }

      // Lead time validation
      const leadTime = (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (leadTime < 7) {
        if (leadTime < 2) {
          errors.push('Minimum 2 dagen vooruit boeken vereist');
        } else {
          warnings.push('Korte levertijd - mogelijk beperkte menu opties');
        }
      }

      // Seasonal availability
      const month = date.getMonth();
      if (month === 11 || month === 0) { // December/January
        warnings.push('Drukke periode - vroeg boeken aanbevolen');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      SafeLogger.error('Business rules validation error:', error, {
        category, tier, guestCount, date, time
      });
      return {
        isValid: false,
        errors: ['Business rules validation error'],
        warnings: []
      };
    }
  }
}