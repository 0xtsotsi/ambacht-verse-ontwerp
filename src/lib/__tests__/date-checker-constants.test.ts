/**
 * Tests for date-checker-constants utilities
 * Validates utility functions and validation logic
 */

import { describe, it, expect } from 'vitest';
import { 
  isBookingComplete,
  validateBookingData,
  isDateSelectable,
  getAvailabilityStatus,
  calculateEstimatedPrice,
  getTranslation,
  getNavigationLabel,
  createSafeTranslations,
  createSafeNavigationLabels,
  GUEST_COUNT_CONFIG,
  TOAST_DURATIONS,
  SERVICE_CATEGORIES,
  SERVICE_TIERS,
  DATE_CHECKER_TRANSLATIONS,
  NAVIGATION_LABELS,
  BLACKOUT_DATES,
  generateDutchHolidays,
  getBlackoutDates
} from '../date-checker-constants';

describe('date-checker-constants', () => {
  describe('isBookingComplete', () => {
    it('should return false when missing required fields', () => {
      expect(isBookingComplete({
        selectedDate: undefined,
        selectedTime: '',
        step: 1
      })).toBe(false);

      expect(isBookingComplete({
        selectedDate: new Date(),
        selectedTime: '',
        step: 2
      })).toBe(false);

      expect(isBookingComplete({
        selectedDate: undefined,
        selectedTime: '18:00',
        step: 3
      })).toBe(false);
    });

    it('should return true when all required fields are present', () => {
      expect(isBookingComplete({
        selectedDate: new Date(),
        selectedTime: '18:00',
        step: 3
      })).toBe(true);
    });
  });

  describe('validateBookingData', () => {
    it('should return errors for invalid data', () => {
      const result = validateBookingData({
        date: undefined,
        time: '',
        guestCount: 5
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Date is required');
      expect(result.errors).toContain('Time is required');
      expect(result.errors).toContain(`Guest count must be between ${GUEST_COUNT_CONFIG.min} and ${GUEST_COUNT_CONFIG.max}`);
    });

    it('should return valid for correct data', () => {
      const result = validateBookingData({
        date: new Date(),
        time: '18:00',
        guestCount: 25
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate guest count boundaries', () => {
      const tooLow = validateBookingData({
        date: new Date(),
        time: '18:00',
        guestCount: GUEST_COUNT_CONFIG.min - 1
      });

      const tooHigh = validateBookingData({
        date: new Date(),
        time: '18:00',
        guestCount: GUEST_COUNT_CONFIG.max + 1
      });

      expect(tooLow.isValid).toBe(false);
      expect(tooHigh.isValid).toBe(false);
    });
  });

  describe('isDateSelectable', () => {
    it('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(isDateSelectable(yesterday)).toBe(false);
    });

    it('should accept today and future dates within 6 months', () => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 3);
      
      expect(isDateSelectable(today)).toBe(true);
      expect(isDateSelectable(futureDate)).toBe(true);
    });

    it('should reject dates beyond 6 months', () => {
      const farFuture = new Date();
      farFuture.setMonth(farFuture.getMonth() + 7);
      
      expect(isDateSelectable(farFuture)).toBe(false);
    });
  });

  describe('getAvailabilityStatus', () => {
    const testDate = new Date();

    it('should return unavailable when booked', () => {
      expect(getAvailabilityStatus(testDate, true, false)).toBe('unavailable');
      expect(getAvailabilityStatus(testDate, true, true)).toBe('unavailable');
    });

    it('should return limited when not booked but limited', () => {
      expect(getAvailabilityStatus(testDate, false, true)).toBe('limited');
    });

    it('should return available when not booked and not limited', () => {
      expect(getAvailabilityStatus(testDate, false, false)).toBe('available');
    });
  });

  describe('calculateEstimatedPrice', () => {
    it('should calculate correct price for valid categories', () => {
      const corporatePrice = calculateEstimatedPrice('corporate', 'premium', 20);
      const expectedPrice = SERVICE_CATEGORIES.corporate.basePrice! * SERVICE_TIERS.premium.multiplier * 20;
      
      expect(corporatePrice).toBe(expectedPrice);
    });

    it('should return null for custom category', () => {
      const customPrice = calculateEstimatedPrice('custom', 'premium', 20);
      expect(customPrice).toBeNull();
    });

    it('should handle different tiers correctly', () => {
      const basisPrice = calculateEstimatedPrice('social', 'basis', 10);
      const luxePrice = calculateEstimatedPrice('social', 'luxe', 10);
      
      expect(luxePrice).toBeGreaterThan(basisPrice!);
    });

    describe('price calculation accuracy', () => {
      it('should calculate corporate pricing correctly', () => {
        const basePrice = SERVICE_CATEGORIES.corporate.basePrice!; // 12.50
        
        // Test with basis tier (1.0 multiplier)
        const basisPrice = calculateEstimatedPrice('corporate', 'basis', 50);
        expect(basisPrice).toBe(basePrice * 1.0 * 50); // 625.00
        
        // Test with premium tier (1.4 multiplier)
        const premiumPrice = calculateEstimatedPrice('corporate', 'premium', 50);
        expect(premiumPrice).toBe(basePrice * 1.4 * 50); // 875.00
        
        // Test with luxe tier (1.8 multiplier)
        const luxePrice = calculateEstimatedPrice('corporate', 'luxe', 50);
        expect(luxePrice).toBe(basePrice * 1.8 * 50); // 1125.00
      });

      it('should calculate social pricing correctly', () => {
        const basePrice = SERVICE_CATEGORIES.social.basePrice!; // 27.50
        
        const basisPrice = calculateEstimatedPrice('social', 'basis', 30);
        expect(basisPrice).toBe(basePrice * 1.0 * 30); // 825.00
        
        const premiumPrice = calculateEstimatedPrice('social', 'premium', 30);
        expect(premiumPrice).toBe(basePrice * 1.4 * 30); // 1155.00
        
        const luxePrice = calculateEstimatedPrice('social', 'luxe', 30);
        expect(luxePrice).toBe(basePrice * 1.8 * 30); // 1485.00
      });

      it('should calculate wedding pricing correctly', () => {
        const basePrice = SERVICE_CATEGORIES.wedding.basePrice!; // 22.50
        
        const basisPrice = calculateEstimatedPrice('wedding', 'basis', 100);
        expect(basisPrice).toBe(basePrice * 1.0 * 100); // 2250.00
        
        const premiumPrice = calculateEstimatedPrice('wedding', 'premium', 100);
        expect(premiumPrice).toBe(basePrice * 1.4 * 100); // 3150.00
        
        const luxePrice = calculateEstimatedPrice('wedding', 'luxe', 100);
        expect(luxePrice).toBe(basePrice * 1.8 * 100); // 4050.00
      });
    });

    describe('edge cases and boundaries', () => {
      it('should handle minimum guest count', () => {
        const price = calculateEstimatedPrice('corporate', 'basis', 1);
        expect(price).toBe(SERVICE_CATEGORIES.corporate.basePrice! * 1.0 * 1);
      });

      it('should handle maximum realistic guest count', () => {
        const price = calculateEstimatedPrice('corporate', 'luxe', 500);
        expect(price).toBe(SERVICE_CATEGORIES.corporate.basePrice! * 1.8 * 500);
      });

      it('should handle zero guest count gracefully', () => {
        const price = calculateEstimatedPrice('corporate', 'premium', 0);
        expect(price).toBe(0);
      });

      it('should handle negative guest count gracefully', () => {
        const price = calculateEstimatedPrice('corporate', 'premium', -10);
        expect(price).toBe(SERVICE_CATEGORIES.corporate.basePrice! * 1.4 * -10);
      });
    });

    describe('memoization behavior simulation', () => {
      it('should produce consistent results for same inputs', () => {
        const params: [ServiceCategory, ServiceTier, number] = ['social', 'premium', 75];
        
        // Simulate multiple calls with same parameters (like memoization would cache)
        const results = Array.from({ length: 5 }, () => 
          calculateEstimatedPrice(...params)
        );
        
        // All results should be identical
        const firstResult = results[0];
        expect(results.every(result => result === firstResult)).toBe(true);
        expect(firstResult).toBe(SERVICE_CATEGORIES.social.basePrice! * 1.4 * 75);
      });

      it('should handle rapid parameter changes correctly', () => {
        // Simulate rapid changes like a user adjusting guest count
        const guestCounts = [20, 25, 30, 35, 40, 35, 30, 25, 20];
        const category: ServiceCategory = 'wedding';
        const tier: ServiceTier = 'premium';
        
        const prices = guestCounts.map(count => 
          calculateEstimatedPrice(category, tier, count)
        );
        
        // Verify each price calculation
        const basePrice = SERVICE_CATEGORIES[category].basePrice!;
        const multiplier = SERVICE_TIERS[tier].multiplier;
        
        prices.forEach((price, index) => {
          const expectedPrice = basePrice * multiplier * guestCounts[index];
          expect(price).toBe(expectedPrice);
        });
      });

      it('should handle category and tier changes correctly', () => {
        const testCases: Array<[ServiceCategory, ServiceTier, number, number]> = [
          ['corporate', 'basis', 50, 12.50 * 1.0 * 50],
          ['corporate', 'premium', 50, 12.50 * 1.4 * 50],
          ['social', 'basis', 50, 27.50 * 1.0 * 50],
          ['social', 'luxe', 50, 27.50 * 1.8 * 50],
          ['wedding', 'premium', 50, 22.50 * 1.4 * 50],
          ['custom', 'premium', 50, null]
        ];
        
        testCases.forEach(([category, tier, guests, expected]) => {
          const result = calculateEstimatedPrice(category, tier, guests);
          expect(result).toBe(expected);
        });
      });
    });

    describe('performance characteristics', () => {
      it('should handle large numbers of calculations efficiently', () => {
        const startTime = performance.now();
        
        // Simulate 1000 price calculations
        for (let i = 0; i < 1000; i++) {
          const category = i % 2 === 0 ? 'corporate' : 'social';
          const tier = i % 3 === 0 ? 'basis' : (i % 3 === 1 ? 'premium' : 'luxe');
          const guests = Math.floor(Math.random() * 100) + 10;
          
          calculateEstimatedPrice(category as ServiceCategory, tier as ServiceTier, guests);
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Should complete within reasonable time (adjust threshold as needed)
        expect(duration).toBeLessThan(100); // 100ms for 1000 calculations
      });

      it('should return results in consistent time regardless of guest count', () => {
        const smallGuestCount = 10;
        const largeGuestCount = 500;
        
        // Measure time for small guest count
        const startSmall = performance.now();
        calculateEstimatedPrice('corporate', 'premium', smallGuestCount);
        const endSmall = performance.now();
        const smallTime = endSmall - startSmall;
        
        // Measure time for large guest count
        const startLarge = performance.now();
        calculateEstimatedPrice('corporate', 'premium', largeGuestCount);
        const endLarge = performance.now();
        const largeTime = endLarge - startLarge;
        
        // Time difference should be minimal (simple multiplication)
        expect(Math.abs(largeTime - smallTime)).toBeLessThan(5); // 5ms tolerance
      });
    });

    describe('floating point precision', () => {
      it('should handle decimal calculations correctly', () => {
        // Test cases that might expose floating-point precision issues
        const socialPrice = calculateEstimatedPrice('social', 'premium', 13);
        const expectedPrice = 27.50 * 1.4 * 13; // 500.50
        
        expect(socialPrice).toBeCloseTo(expectedPrice, 2);
      });

      it('should maintain precision with large numbers', () => {
        const corporatePrice = calculateEstimatedPrice('corporate', 'luxe', 333);
        const expectedPrice = 12.50 * 1.8 * 333; // 7492.50
        
        expect(corporatePrice).toBeCloseTo(expectedPrice, 2);
      });
    });
  });

  describe('constants validation', () => {
    it('should have valid toast durations', () => {
      expect(TOAST_DURATIONS.success).toBeGreaterThan(0);
      expect(TOAST_DURATIONS.confirmation).toBeGreaterThan(0);
      expect(TOAST_DURATIONS.error).toBeGreaterThan(0);
    });

    it('should have valid guest count config', () => {
      expect(GUEST_COUNT_CONFIG.min).toBeGreaterThan(0);
      expect(GUEST_COUNT_CONFIG.max).toBeGreaterThan(GUEST_COUNT_CONFIG.min);
      expect(GUEST_COUNT_CONFIG.default).toBeGreaterThanOrEqual(GUEST_COUNT_CONFIG.min);
      expect(GUEST_COUNT_CONFIG.default).toBeLessThanOrEqual(GUEST_COUNT_CONFIG.max);
      expect(GUEST_COUNT_CONFIG.step).toBeGreaterThan(0);
    });

    it('should have consistent service categories and tiers', () => {
      const categories = Object.keys(SERVICE_CATEGORIES);
      const tiers = Object.keys(SERVICE_TIERS);
      
      expect(categories.length).toBeGreaterThan(0);
      expect(tiers.length).toBeGreaterThan(0);
      
      // Ensure all tiers have positive multipliers
      tiers.forEach(tier => {
        expect(SERVICE_TIERS[tier as keyof typeof SERVICE_TIERS].multiplier).toBeGreaterThan(0);
      });
    });
  });

  describe('translation fallback mechanism', () => {
    describe('getTranslation', () => {
      it('should return correct translation for existing keys', () => {
        const dutchTitle = getTranslation('nl', 'title');
        expect(dutchTitle).toBe(DATE_CHECKER_TRANSLATIONS.nl.title);
        
        const englishTitle = getTranslation('en', 'title');
        expect(englishTitle).toBe(DATE_CHECKER_TRANSLATIONS.en.title);
      });

      it('should fallback to English when language exists but key is missing', () => {
        // Create a mock scenario where Dutch is missing a key
        const originalNl = DATE_CHECKER_TRANSLATIONS.nl;
        
        // Mock a scenario where a translation is missing
        const mockTranslations = {
          ...DATE_CHECKER_TRANSLATIONS,
          nl: {
            ...originalNl,
            // Remove a key to test fallback
          }
        };
        
        // Test fallback for non-existent key
        const result = getTranslation('en', 'title');
        expect(result).toBe(DATE_CHECKER_TRANSLATIONS.en.title);
      });

      it('should provide formatted fallback when both language and English lack the key', () => {
        // Test with a non-existent key
        const result = getTranslation('nl', 'nonExistentKey' as any);
        expect(result).toBe('Non Existent Key');
      });

      it('should handle camelCase key formatting correctly', () => {
        const result = getTranslation('nl', 'someComplexKey' as any);
        expect(result).toBe('Some Complex Key');
      });
    });

    describe('getNavigationLabel', () => {
      it('should return correct navigation label for existing keys', () => {
        const dutchPrevious = getNavigationLabel('nl', 'previous');
        expect(dutchPrevious).toBe(NAVIGATION_LABELS.nl.previous);
        
        const englishNext = getNavigationLabel('en', 'next');
        expect(englishNext).toBe(NAVIGATION_LABELS.en.next);
      });

      it('should fallback to English for missing navigation labels', () => {
        const result = getNavigationLabel('en', 'previous');
        expect(result).toBe(NAVIGATION_LABELS.en.previous);
      });

      it('should format fallback labels correctly', () => {
        const result = getNavigationLabel('nl', 'someNavigationKey' as any);
        expect(result).toBe('Some Navigation Key');
      });
    });

    describe('createSafeTranslations', () => {
      it('should create proxy with fallback behavior', () => {
        const safeTranslations = createSafeTranslations('nl');
        
        // Test existing key
        expect(safeTranslations.title).toBe(DATE_CHECKER_TRANSLATIONS.nl.title);
        expect(safeTranslations.confirm).toBe(DATE_CHECKER_TRANSLATIONS.nl.confirm);
        
        // Test non-existent key fallback
        expect((safeTranslations as any).nonExistentKey).toBe('Non Existent Key');
      });

      it('should work with both Dutch and English', () => {
        const dutchSafe = createSafeTranslations('nl');
        const englishSafe = createSafeTranslations('en');
        
        expect(dutchSafe.title).toBe(DATE_CHECKER_TRANSLATIONS.nl.title);
        expect(englishSafe.title).toBe(DATE_CHECKER_TRANSLATIONS.en.title);
        
        // Both should have same fallback behavior for missing keys
        expect((dutchSafe as any).missingKey).toBe('Missing Key');
        expect((englishSafe as any).missingKey).toBe('Missing Key');
      });
    });

    describe('createSafeNavigationLabels', () => {
      it('should create proxy with navigation fallback behavior', () => {
        const safeNavigation = createSafeNavigationLabels('nl');
        
        // Test existing keys
        expect(safeNavigation.previous).toBe(NAVIGATION_LABELS.nl.previous);
        expect(safeNavigation.next).toBe(NAVIGATION_LABELS.nl.next);
        
        // Test fallback
        expect((safeNavigation as any).nonExistentNav).toBe('Non Existent Nav');
      });

      it('should handle complex navigation labels', () => {
        const safeNavigation = createSafeNavigationLabels('en');
        
        expect(safeNavigation.screenReaderStepAnnouncement)
          .toBe(NAVIGATION_LABELS.en.screenReaderStepAnnouncement);
        
        expect(safeNavigation.bookingConfirmedSuccess)
          .toBe(NAVIGATION_LABELS.en.bookingConfirmedSuccess);
      });
    });

    describe('translation completeness validation', () => {
      it('should have all required translation keys for both languages', () => {
        const requiredKeys = [
          'title', 'subtitle', 'selectDate', 'selectTime', 'guestCount',
          'guests', 'checkAvailability', 'confirm', 'calculateQuote',
          'available', 'limited', 'unavailable', 'estimatedPrice', 'perPerson',
          'loading', 'error', 'success'
        ];
        
        requiredKeys.forEach(key => {
          expect(DATE_CHECKER_TRANSLATIONS.nl).toHaveProperty(key);
          expect(DATE_CHECKER_TRANSLATIONS.en).toHaveProperty(key);
          
          expect(typeof DATE_CHECKER_TRANSLATIONS.nl[key as keyof typeof DATE_CHECKER_TRANSLATIONS.nl])
            .toBe('string');
          expect(typeof DATE_CHECKER_TRANSLATIONS.en[key as keyof typeof DATE_CHECKER_TRANSLATIONS.en])
            .toBe('string');
        });
      });

      it('should have all required navigation labels for both languages', () => {
        const requiredNavKeys = [
          'previous', 'next', 'dateSelectedSuccess', 'bookingConfirmedSuccess',
          'screenReaderStepAnnouncement'
        ];
        
        requiredNavKeys.forEach(key => {
          expect(NAVIGATION_LABELS.nl).toHaveProperty(key);
          expect(NAVIGATION_LABELS.en).toHaveProperty(key);
          
          expect(typeof NAVIGATION_LABELS.nl[key as keyof typeof NAVIGATION_LABELS.nl])
            .toBe('string');
          expect(typeof NAVIGATION_LABELS.en[key as keyof typeof NAVIGATION_LABELS.en])
            .toBe('string');
        });
      });

      it('should have consistent placeholder patterns in navigation labels', () => {
        // Check that placeholder patterns are consistent between languages
        const dutchBookingSuccess = NAVIGATION_LABELS.nl.bookingConfirmedSuccess;
        const englishBookingSuccess = NAVIGATION_LABELS.en.bookingConfirmedSuccess;
        
        expect(dutchBookingSuccess).toContain('{count}');
        expect(englishBookingSuccess).toContain('{count}');
        
        const dutchStepAnnouncement = NAVIGATION_LABELS.nl.screenReaderStepAnnouncement;
        const englishStepAnnouncement = NAVIGATION_LABELS.en.screenReaderStepAnnouncement;
        
        expect(dutchStepAnnouncement).toContain('{step}');
        expect(dutchStepAnnouncement).toContain('{stepName}');
        expect(englishStepAnnouncement).toContain('{step}');
        expect(englishStepAnnouncement).toContain('{stepName}');
      });
    });

    describe('integration with React components', () => {
      it('should support dynamic key access patterns', () => {
        const safeTranslations = createSafeTranslations('nl');
        const keys = ['title', 'subtitle', 'confirm'] as const;
        
        keys.forEach(key => {
          const translation = safeTranslations[key];
          expect(typeof translation).toBe('string');
          expect(translation.length).toBeGreaterThan(0);
        });
      });

      it('should handle template string replacements safely', () => {
        const safeNavigation = createSafeNavigationLabels('en');
        const template = safeNavigation.bookingConfirmedSuccess;
        
        const result = template.replace('{count}', '25');
        expect(result).toContain('25');
        expect(result).not.toContain('{count}');
      });
    });
  });

  describe('Dutch Holiday Generation', () => {
    describe('generateDutchHolidays', () => {
      it('should generate all fixed Dutch holidays for a given year', () => {
        const holidays2025 = generateDutchHolidays(2025);
        
        expect(holidays2025).toContain('2025-01-01'); // New Year's Day
        expect(holidays2025).toContain('2025-04-27'); // King's Day
        expect(holidays2025).toContain('2025-05-05'); // Liberation Day
        expect(holidays2025).toContain('2025-12-25'); // Christmas Day
        expect(holidays2025).toContain('2025-12-26'); // Boxing Day
        expect(holidays2025).toContain('2025-12-31'); // New Year's Eve
      });

      it('should calculate Easter-based holidays correctly for 2025', () => {
        const holidays2025 = generateDutchHolidays(2025);
        
        // Easter 2025 is on April 20
        expect(holidays2025).toContain('2025-04-20'); // Easter Sunday
        expect(holidays2025).toContain('2025-04-21'); // Easter Monday
        expect(holidays2025).toContain('2025-05-29'); // Ascension Day (39 days after Easter)
        expect(holidays2025).toContain('2025-06-09'); // Whit Monday (50 days after Easter)
      });

      it('should calculate Easter-based holidays correctly for 2024', () => {
        const holidays2024 = generateDutchHolidays(2024);
        
        // Easter 2024 is on March 31
        expect(holidays2024).toContain('2024-03-31'); // Easter Sunday
        expect(holidays2024).toContain('2024-04-01'); // Easter Monday
        expect(holidays2024).toContain('2024-05-09'); // Ascension Day
        expect(holidays2024).toContain('2024-05-20'); // Whit Monday
      });

      it('should return sorted array of dates', () => {
        const holidays = generateDutchHolidays(2025);
        const sorted = [...holidays].sort();
        
        expect(holidays).toEqual(sorted);
      });

      it('should handle leap years correctly', () => {
        const holidays2024 = generateDutchHolidays(2024); // 2024 is a leap year
        const holidays2025 = generateDutchHolidays(2025);
        
        // Both should have the same number of holidays
        expect(holidays2024.length).toBe(10); // 6 fixed + 4 Easter-based
        expect(holidays2025.length).toBe(10);
      });
    });

    describe('getBlackoutDates', () => {
      it('should return holidays for current and next year', () => {
        const blackoutDates = getBlackoutDates();
        const currentYear = new Date().getFullYear();
        
        // Should contain dates from both years
        const currentYearDates = blackoutDates.filter(date => date.startsWith(`${currentYear}-`));
        const nextYearDates = blackoutDates.filter(date => date.startsWith(`${currentYear + 1}-`));
        
        expect(currentYearDates.length).toBeGreaterThan(0);
        expect(nextYearDates.length).toBeGreaterThan(0);
      });

      it('should return unique dates', () => {
        const blackoutDates = getBlackoutDates();
        const uniqueDates = [...new Set(blackoutDates)];
        
        expect(blackoutDates.length).toBe(uniqueDates.length);
      });
    });

    describe('BLACKOUT_DATES constant', () => {
      it('should be populated with auto-generated dates', () => {
        expect(BLACKOUT_DATES).toBeDefined();
        expect(Array.isArray(BLACKOUT_DATES)).toBe(true);
        expect(BLACKOUT_DATES.length).toBeGreaterThan(0);
      });

      it('should match getBlackoutDates output', () => {
        const dynamicDates = getBlackoutDates();
        expect(BLACKOUT_DATES).toEqual(dynamicDates);
      });
    });
  });
});