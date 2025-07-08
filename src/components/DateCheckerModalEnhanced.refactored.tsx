import { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAvailability } from '@/hooks/useAvailability';
import { useLifecycleLogger, useRenderLogger, usePerformanceLogger } from '@/hooks/useComponentLogger';
import { UserFlowLogger, ComponentLogger } from '@/lib/logger';
import { SafeLogger } from '@/lib/LoggerUtils';
import { useDateCheckerReducer } from '@/hooks/useDateCheckerReducer';
import { 
  DateSelectionStep,
  TimeSelectionStep,
  GuestCountStep,
  useValidationLogic,
  useAccessibilityManager
} from '@/components/DateChecker';
import { 
  DATE_CHECKER_TRANSLATIONS,
  TOAST_DURATIONS,
  NAVIGATION_LABELS,
  validateDateCheckerProps,
  calculateEstimatedPrice,
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
 * Enhanced date checker modal with step-by-step booking flow
 * Refactored to comply with 300 LOC limit through component decomposition
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
  // Input validation
  const validation = validateDateCheckerProps({ open, onOpenChange, onConfirm });
  if (!validation.isValid) {
    SafeLogger.error('Invalid DateChecker props:', validation.errors);
    return null;
  }

  const { toast } = useToast();
  const { isDateBooked, isDateLimited } = useAvailability();
  
  // State management with useReducer
  const { state, actions } = useDateCheckerReducer();
  const { selectedDate, selectedTime, guestCount, step } = state;
  
  // Translations
  const t = createSafeTranslations(language);
  const nav = createSafeNavigationLabels(language);

  // Custom hooks for validation and accessibility
  const { validateBooking, logBookingConfirmation } = useValidationLogic({
    initialServiceCategory,
    initialServiceTier,
    onToast: toast,
    translations: { error: t.error, success: t.success }
  });

  const { AriaLiveRegion, confirmButtonRef, getStepAriaProps } = useAccessibilityManager({
    step,
    translations: { selectDate: t.selectDate, selectTime: t.selectTime, guestCount: t.guestCount },
    navigationLabels: nav
  });

  // Logging setup
  useLifecycleLogger({ 
    componentName: 'DateCheckerModalEnhanced',
    props: { open, initialServiceCategory, initialServiceTier, language },
    enablePropLogging: true
  });

  useRenderLogger({
    componentName: 'DateCheckerModalEnhanced',
    dependencies: [open, state]
  });

  usePerformanceLogger({
    componentName: 'DateCheckerModalEnhanced',
    slowRenderThreshold: 20
  });

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      ComponentLogger.lifecycle('DateCheckerModalEnhanced', 'update', { event: 'modal_opened' });
      actions.resetState();
      UserFlowLogger.interaction('modal_opened', 'DateCheckerModalEnhanced', {
        initialServiceCategory, initialServiceTier, language
      });
    } else {
      ComponentLogger.lifecycle('DateCheckerModalEnhanced', 'update', { event: 'modal_closed' });
      UserFlowLogger.interaction('modal_closed', 'DateCheckerModalEnhanced');
    }
  }, [open, initialServiceCategory, initialServiceTier, language, actions]);

  // Event handlers
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, 'EEEE d MMMM', { locale: nl });
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    actions.setDate(date, formattedDate, isWeekend);
    
    toast({
      title: t.success,
      description: `${formattedDate} ${nav.dateSelectedSuccess}`,
      duration: TOAST_DURATIONS.success,
    });
  };

  const handleTimeSelect = (time: string) => {
    actions.setTime(time, selectedTime);
  };

  const handleGuestCountChange = (newGuestCount: number[]) => {
    actions.setGuestCount(newGuestCount[0], guestCount);
  };

  const handleConfirm = () => {
    const validation = validateBooking(state);
    if (!validation.isValid || !selectedDate) return;

    const estimatedPrice = calculateEstimatedPrice(
      initialServiceCategory, 
      initialServiceTier, 
      guestCount
    );

    onConfirm(selectedDate, selectedTime, guestCount);
    logBookingConfirmation(state, estimatedPrice);
    
    toast({
      title: t.success,
      description: nav.bookingConfirmedSuccess.replace('{count}', guestCount.toString()),
      duration: TOAST_DURATIONS.confirmation,
    });
  };

  const isBookingComplete = selectedDate && selectedTime && guestCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.subtitle}</DialogDescription>
        </DialogHeader>

        <AriaLiveRegion />
        
        <div className="space-y-6">
          {/* Step 1: Date Selection */}
          {step === 1 && (
            <DateSelectionStep
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              translations={{ selectDate: t.selectDate, title: t.title }}
            />
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <TimeSelectionStep
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              isDateBooked={isDateBooked}
              isDateLimited={isDateLimited}
              translations={{
                selectTime: t.selectTime,
                available: t.available,
                limited: t.limited,
                unavailable: t.unavailable
              }}
            />
          )}

          {/* Step 3: Guest Count */}
          {step === 3 && (
            <GuestCountStep
              guestCount={guestCount}
              onGuestCountChange={handleGuestCountChange}
              initialServiceCategory={initialServiceCategory}
              initialServiceTier={initialServiceTier}
              translations={{
                guestCount: t.guestCount,
                guests: t.guests,
                estimatedPrice: t.estimatedPrice,
                perPerson: t.perPerson
              }}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => actions.setStep(step - 1, 'backward')}
                {...getStepAriaProps(step, step - 1)}
              >
                {nav.previous}
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={() => actions.setStep(step + 1, 'forward')} 
                disabled={step === 1 ? !selectedDate : !selectedTime}
                className="flex-1"
                {...getStepAriaProps(step, step + 1)}
              >
                {nav.next}
              </Button>
            ) : (
              <>
                <Button 
                  ref={confirmButtonRef}
                  onClick={handleConfirm} 
                  className="flex-1"
                  disabled={!isBookingComplete}
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