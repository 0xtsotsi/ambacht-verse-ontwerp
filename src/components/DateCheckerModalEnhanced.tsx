import { useEffect, useRef, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAvailability } from '@/hooks/useAvailability';
import { useLifecycleLogger, useRenderLogger, usePerformanceLogger } from '@/hooks/useComponentLogger';
import { UserFlowLogger, ComponentLogger } from '@/lib/logger';
import { SafeLogger } from '@/lib/LoggerUtils';
import { useDateCheckerReducer } from '@/hooks/useDateCheckerReducer';
import { 
  TIME_SLOTS,
  GUEST_COUNT_CONFIG,
  DATE_CHECKER_TRANSLATIONS,
  DATE_CHECKER_STYLES,
  TOAST_DURATIONS,
  NAVIGATION_LABELS,
  validateDateCheckerProps,
  isDateSelectable,
  getAvailabilityStatus,
  calculateEstimatedPrice,
  isBookingComplete,
  validateBookingData,
  createSafeTranslations,
  createSafeNavigationLabels,
  type ServiceCategory,
  type ServiceTier,
  type LanguageType
} from '@/lib/date-checker-constants';

interface DateCheckerModalEnhancedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date, time: string, guests: number) => void;
  onOpenQuoteCalculator?: (guestCount: number) => void;
  initialServiceCategory?: ServiceCategory;
  initialServiceTier?: ServiceTier;
  language?: LanguageType;
}

/**
 * Enhanced date checker modal with availability validation and price estimation
 * Features step-by-step booking flow with real-time availability checks
 */
export function DateCheckerModalEnhanced({ 
  open, 
  onOpenChange, 
  onConfirm, 
  onOpenQuoteCalculator,
  initialServiceCategory = 'corporate',
  initialServiceTier = 'premium',
  language = 'nl'
}: DateCheckerModalEnhancedProps) {
  // All hooks must be called first, before any conditional logic
  const { toast } = useToast();
  const { isDateBooked, isDateLimited } = useAvailability();
  
  // State management with useReducer for performance optimization
  const { state, actions } = useDateCheckerReducer();
  const { selectedDate, selectedTime, guestCount, step } = state;
  
  // Accessibility refs for focus management
  const timeSlotContainerRef = useRef<HTMLDivElement>(null);
  const guestCountSliderRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  // Logging setup (state logging now handled in reducer)
  useLifecycleLogger({ 
    componentName: 'DateCheckerModalEnhanced',
    props: { 
      open, 
      initialServiceCategory, 
      initialServiceTier, 
      language,
      hasQuoteCallback: !!onOpenQuoteCalculator 
    },
    enablePropLogging: true
  });

  const renderInfo = useRenderLogger({
    componentName: 'DateCheckerModalEnhanced',
    dependencies: [open, state] // Single dependency reduces re-render triggers
  });

  const { getPerformanceStats } = usePerformanceLogger({
    componentName: 'DateCheckerModalEnhanced',
    slowRenderThreshold: 20
  });

  // Focus management for accessibility
  useEffect(() => {
    if (step === 2 && timeSlotContainerRef.current) {
      const firstButton = timeSlotContainerRef.current.querySelector('button:not([disabled])');
      if (firstButton) {
        setTimeout(() => {
          (firstButton as HTMLElement).focus();
        }, 0);
      }
    } else if (step === 3 && guestCountSliderRef.current) {
      setTimeout(() => {
        guestCountSliderRef.current?.focus();
      }, 0);
    }
    
    // Update aria-live region for screen readers
    if (ariaLiveRef.current) {
      const t = createSafeTranslations(language);
      const nav = createSafeNavigationLabels(language);
      const stepNames = [t.selectDate, t.selectTime, t.guestCount];
      const announcement = nav.screenReaderStepAnnouncement
        .replace('{step}', step.toString())
        .replace('{stepName}', stepNames[step - 1] || '');
      ariaLiveRef.current.textContent = announcement;
    }
  }, [step, language]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      ComponentLogger.lifecycle('DateCheckerModalEnhanced', 'update', { event: 'modal_opened' });
      actions.resetState();
      
      UserFlowLogger.interaction('modal_opened', 'DateCheckerModalEnhanced', {
        initialServiceCategory,
        initialServiceTier,
        language
      });
    } else {
      ComponentLogger.lifecycle('DateCheckerModalEnhanced', 'update', { event: 'modal_closed' });
      UserFlowLogger.interaction('modal_closed', 'DateCheckerModalEnhanced');
    }
  }, [open, initialServiceCategory, initialServiceTier, language, actions]);

  const estimatedPrice = useMemo(() => {
    return calculateEstimatedPrice(initialServiceCategory, initialServiceTier, guestCount);
  }, [initialServiceCategory, initialServiceTier, guestCount]);

  // Input validation after all hooks
  const validation = validateDateCheckerProps({ open, onOpenChange, onConfirm });
  if (!validation.isValid) {
    SafeLogger.error('Invalid DateChecker props:', validation.errors);
    return null;
  }

  const t = createSafeTranslations(language);
  const nav = createSafeNavigationLabels(language);

  const handleDateSelect = (date: Date | undefined) => {
    try {
      if (!date || !isDateSelectable(date)) {
        UserFlowLogger.interaction('date_selection_blocked', 'DateCheckerModalEnhanced', {
          attemptedDate: date,
          reason: !date ? 'no_date' : 'date_not_selectable'
        });
        return;
      }
      
      const formattedDate = format(date, 'EEEE d MMMM', { locale: nl });
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      actions.setDate(date, formattedDate, isWeekend);
      
      toast({
        title: t.success,
        description: `${formattedDate} ${nav.dateSelectedSuccess}`,
        duration: TOAST_DURATIONS.success,
      });
    } catch (error) {
      SafeLogger.error('Date selection error:', error, { date });
      UserFlowLogger.error('date_selection_error', 'Failed to select date', { error: (error as Error).message, date });
    }
  };

  const handleTimeSelect = (time: string) => {
    try {
      actions.setTime(time, selectedTime);
    } catch (error) {
      SafeLogger.error('Time selection error:', error, { time });
      UserFlowLogger.error('time_selection_error', 'Failed to select time', { error: (error as Error).message, time });
    }
  };

  const handleConfirm = () => {
    try {
      if (!isBookingComplete(state)) {
        UserFlowLogger.error('booking_confirmation_failed', 'Missing required booking data', {
          hasDate: !!selectedDate,
          hasTime: !!selectedTime,
          step
        });
        return;
      }

      if (!selectedDate) {
        UserFlowLogger.error('booking_confirmation_failed', 'Missing selected date', { step });
        return;
      }

      const bookingData = {
        date: selectedDate,
        time: selectedTime,
        guestCount: guestCount
      };
      
      const validation = validateBookingData(bookingData, initialServiceCategory, initialServiceTier);
      if (!validation.isValid) {
        UserFlowLogger.error('booking_validation_failed', 'Invalid booking data', {
          errors: validation.errors
        });
        toast({
          title: t.error,
          description: validation.errors.join('. '),
          duration: TOAST_DURATIONS.error,
          variant: 'destructive'
        });
        return;
      }
        
      onConfirm(selectedDate, selectedTime, guestCount);
      
      UserFlowLogger.interaction('booking_confirmed', 'DateCheckerModalEnhanced', {
        ...bookingData,
        serviceCategory: initialServiceCategory,
        serviceTier: initialServiceTier,
        estimatedPrice: estimatedPrice
      });
      
      toast({
        title: t.success,
        description: nav.bookingConfirmedSuccess.replace('{count}', guestCount.toString()),
        duration: TOAST_DURATIONS.confirmation,
      });
    } catch (error) {
      SafeLogger.error('Booking confirmation error:', error, { selectedDate, selectedTime, guestCount });
      UserFlowLogger.error('booking_confirmation_error', 'Failed to confirm booking', { 
        error: (error as Error).message, selectedDate, selectedTime, guestCount 
      });
    }
  };

  const handleGuestCountChange = (newGuestCount: number[]) => {
    try {
      const previousCount = guestCount;
      actions.setGuestCount(newGuestCount[0], previousCount);
    } catch (error) {
      SafeLogger.error('Guest count change error:', error, { newGuestCount });
      UserFlowLogger.error('guest_count_error', 'Failed to update guest count', { 
        error: (error as Error).message, newGuestCount 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DATE_CHECKER_STYLES.modal}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        {/* Accessibility: Screen reader announcements */}
        <div ref={ariaLiveRef} aria-live="polite" className="sr-only" />
        
        <div className="space-y-6">
          {/* Step 1: Date Selection */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <div className={DATE_CHECKER_STYLES.stepHeader}>
              <div className={DATE_CHECKER_STYLES.stepNumber} aria-hidden="true">1</div>
              <h3 className="font-medium" id="step-1-heading">{t.selectDate}</h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => !isDateSelectable(date)}
              className="rounded-md border"
              locale={nl}
              aria-labelledby="step-1-heading"
            />
          </div>

          {/* Step 2: Time Selection */}
          {step >= 2 && (
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className={DATE_CHECKER_STYLES.stepHeader}>
                <div className={DATE_CHECKER_STYLES.stepNumber} aria-hidden="true">2</div>
                <h3 className="font-medium" id="step-2-heading">{t.selectTime}</h3>
              </div>
              {selectedDate && (
                <p className="text-sm text-gray-600 mb-4">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
                </p>
              )}
              <div 
                ref={timeSlotContainerRef}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
                role="radiogroup"
                aria-labelledby="step-2-heading"
              >
                {selectedDate ? TIME_SLOTS.map((slot) => {
                  const status = getAvailabilityStatus(
                    selectedDate,
                    isDateBooked(selectedDate, slot.value),
                    isDateLimited(selectedDate, slot.value)
                  );
                  
                  return (
                    <button
                      key={slot.value}
                      onClick={() => status !== 'unavailable' && handleTimeSelect(slot.value)}
                      className={cn(
                        DATE_CHECKER_STYLES.timeSlot,
                        status === 'available' && DATE_CHECKER_STYLES.timeSlotAvailable,
                        status === 'limited' && DATE_CHECKER_STYLES.timeSlotLimited,
                        status === 'unavailable' && DATE_CHECKER_STYLES.timeSlotUnavailable,
                        selectedTime === slot.value && DATE_CHECKER_STYLES.timeSlotSelected
                      )}
                      disabled={status === 'unavailable'}
                      role="radio"
                      aria-checked={selectedTime === slot.value}
                      aria-label={`${slot.label} - ${status === 'available' ? t.available : status === 'limited' ? t.limited : t.unavailable}`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{slot.label}</span>
                      </div>
                      {status === 'limited' && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs mt-1 bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700"
                          role="status"
                          aria-live="polite"
                        >
                          {t.limited}
                        </Badge>
                      )}
                    </button>
                  );
                }) : null}
              </div>
            </div>
          )}

          {/* Step 3: Guest Count */}
          {step >= 3 && (
            <div>
              <div className={DATE_CHECKER_STYLES.stepHeader}>
                <div className={DATE_CHECKER_STYLES.stepNumber} aria-hidden="true">3</div>
                <h3 className="font-medium" id="step-3-heading">{t.guestCount}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-gray-500" aria-hidden="true" />
                  <span className="font-medium" id="guest-count-display">{guestCount} {t.guests}</span>
                </div>
                <div ref={guestCountSliderRef}>
                  <Slider
                    value={[guestCount]}
                    onValueChange={handleGuestCountChange}
                    min={GUEST_COUNT_CONFIG.min}
                    max={GUEST_COUNT_CONFIG.max}
                    step={GUEST_COUNT_CONFIG.step}
                    className="w-full"
                    aria-labelledby="step-3-heading"
                    aria-describedby="guest-count-display"
                    aria-valuetext={`${guestCount} ${t.guests}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{GUEST_COUNT_CONFIG.min}</span>
                  <span>{GUEST_COUNT_CONFIG.max}</span>
                </div>
              </div>

              {/* Price Estimate */}
              {estimatedPrice && (
                <div className={DATE_CHECKER_STYLES.estimateCard}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.estimatedPrice}:</span>
                    <span className="text-lg font-bold text-blue-600">
                      €{estimatedPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    €{(estimatedPrice / guestCount).toFixed(2)} {t.perPerson}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => actions.setStep(step - 1, 'backward')}
                aria-label={`${nav.previous}: ${step === 2 ? t.selectDate : t.selectTime}`}
              >
                {nav.previous}
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={() => actions.setStep(step + 1, 'forward')} 
                disabled={step === 1 ? !selectedDate : !selectedTime}
                className="flex-1"
                aria-label={`${nav.next}: ${step === 1 ? t.selectTime : t.guestCount}`}
              >
                {nav.next}
              </Button>
            ) : (
              <>
                <Button 
                  ref={confirmButtonRef}
                  onClick={handleConfirm} 
                  className="flex-1"
                  disabled={!isBookingComplete(state)}
                >
                  {t.confirm}
                </Button>
                {onOpenQuoteCalculator && (
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenQuoteCalculator(guestCount)}
                  >
                    {t.calculateQuote}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}