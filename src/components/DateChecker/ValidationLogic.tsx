import { useCallback } from 'react';
import { 
  isBookingComplete, 
  validateBookingData, 
  type ServiceCategory, 
  type ServiceTier 
} from '@/lib/date-checker-constants';
import { SafeLogger } from '@/lib/LoggerUtils';
import { UserFlowLogger } from '@/lib/logger';

interface BookingState {
  selectedDate: Date | undefined;
  selectedTime: string;
  guestCount: number;
  step: number;
}

interface UseValidationLogicProps {
  initialServiceCategory: ServiceCategory;
  initialServiceTier: ServiceTier;
  onToast: (toast: { title: string; description: string; duration: number; variant?: string }) => void;
  translations: {
    error: string;
    success: string;
  };
}

/**
 * Custom hook for validation logic in DateChecker components
 * Centralizes validation, error handling, and logging
 */
export function useValidationLogic({
  initialServiceCategory,
  initialServiceTier,
  onToast,
  translations
}: UseValidationLogicProps) {
  
  const validateBooking = useCallback((state: BookingState) => {
    try {
      if (!isBookingComplete(state)) {
        UserFlowLogger.error('booking_validation_failed', 'Missing required booking data', {
          hasDate: !!state.selectedDate,
          hasTime: !!state.selectedTime,
          step: state.step
        });
        return { isValid: false, errors: ['Missing required booking information'] };
      }

      if (!state.selectedDate) {
        UserFlowLogger.error('booking_validation_failed', 'Missing selected date', { 
          step: state.step 
        });
        return { isValid: false, errors: ['Please select a date'] };
      }

      const bookingData = {
        date: state.selectedDate,
        time: state.selectedTime,
        guestCount: state.guestCount
      };
      
      const validation = validateBookingData(
        bookingData, 
        initialServiceCategory, 
        initialServiceTier
      );
      
      if (!validation.isValid) {
        UserFlowLogger.error('booking_validation_failed', 'Invalid booking data', {
          errors: validation.errors
        });
        
        onToast({
          title: translations.error,
          description: validation.errors.join('. '),
          duration: 5000,
          variant: 'destructive'
        });
        
        return validation;
      }

      return { isValid: true, errors: [] };
    } catch (error) {
      SafeLogger.error('Booking validation error:', error, { 
        state, 
        initialServiceCategory, 
        initialServiceTier 
      });
      
      UserFlowLogger.error('booking_validation_error', 'Validation system error', { 
        error: error.message, 
        state 
      });
      
      return { isValid: false, errors: ['Validation system error'] };
    }
  }, [initialServiceCategory, initialServiceTier, onToast, translations]);

  const logBookingConfirmation = useCallback((
    state: BookingState,
    estimatedPrice: number | null
  ) => {
    if (!state.selectedDate) return;

    const bookingData = {
      date: state.selectedDate,
      time: state.selectedTime,
      guestCount: state.guestCount
    };

    UserFlowLogger.interaction('booking_confirmed', 'DateCheckerModalEnhanced', {
      ...bookingData,
      serviceCategory: initialServiceCategory,
      serviceTier: initialServiceTier,
      estimatedPrice
    });
  }, [initialServiceCategory, initialServiceTier]);

  return {
    validateBooking,
    logBookingConfirmation
  };
}