import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAvailability } from '@/hooks/useAvailability';
import { 
  TIME_SLOTS,
  GUEST_COUNT_CONFIG,
  DATE_CHECKER_TRANSLATIONS,
  DATE_CHECKER_STYLES,
  validateDateCheckerProps,
  isDateSelectable,
  getAvailabilityStatus,
  calculateEstimatedPrice,
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
  // Input validation
  const validation = validateDateCheckerProps({ open, onOpenChange, onConfirm });
  if (!validation.isValid) {
    console.error('Invalid DateChecker props:', validation.errors);
    return null;
  }

  const { toast } = useToast();
  const { isDateBooked, isDateLimited } = useAvailability();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number[]>([GUEST_COUNT_CONFIG.default]);
  const [step, setStep] = useState(1);

  const t = DATE_CHECKER_TRANSLATIONS[language];

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedDate(undefined);
      setSelectedTime('');
      setGuestCount([GUEST_COUNT_CONFIG.default]);
      setStep(1);
    }
  }, [open]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !isDateSelectable(date)) return;
    setSelectedDate(date);
    setStep(2);
    
    toast({
      title: t.success,
      description: `${format(date, 'EEEE d MMMM', { locale: nl })} geselecteerd.`,
      duration: 2000,
    });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime, guestCount[0]);
      toast({
        title: t.success,
        description: `Reservering voor ${guestCount[0]} gasten bevestigd.`,
        duration: 3000,
      });
    }
  };

  const estimatedPrice = calculateEstimatedPrice(initialServiceCategory, initialServiceTier, guestCount[0]);

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

        <div className="space-y-6">
          {/* Step 1: Date Selection */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <div className={DATE_CHECKER_STYLES.stepHeader}>
              <div className={DATE_CHECKER_STYLES.stepNumber}>1</div>
              <h3 className="font-medium">{t.selectDate}</h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => !isDateSelectable(date)}
              className="rounded-md border"
              locale={nl}
            />
          </div>

          {/* Step 2: Time Selection */}
          {step >= 2 && (
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className={DATE_CHECKER_STYLES.stepHeader}>
                <div className={DATE_CHECKER_STYLES.stepNumber}>2</div>
                <h3 className="font-medium">{t.selectTime}</h3>
              </div>
              {selectedDate && (
                <p className="text-sm text-gray-600 mb-4">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const status = getAvailabilityStatus(
                    selectedDate!,
                    isDateBooked(selectedDate!, slot.value),
                    isDateLimited(selectedDate!, slot.value)
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
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{slot.label}</span>
                      </div>
                      {status === 'limited' && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {t.limited}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Guest Count */}
          {step >= 3 && (
            <div>
              <div className={DATE_CHECKER_STYLES.stepHeader}>
                <div className={DATE_CHECKER_STYLES.stepNumber}>3</div>
                <h3 className="font-medium">{t.guestCount}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{guestCount[0]} {t.guests}</span>
                </div>
                <Slider
                  value={guestCount}
                  onValueChange={setGuestCount}
                  min={GUEST_COUNT_CONFIG.min}
                  max={GUEST_COUNT_CONFIG.max}
                  step={GUEST_COUNT_CONFIG.step}
                  className="w-full"
                />
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
                    €{(estimatedPrice / guestCount[0]).toFixed(2)} {t.perPerson}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Vorige
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)} 
                disabled={step === 1 ? !selectedDate : !selectedTime}
                className="flex-1"
              >
                Volgende
              </Button>
            ) : (
              <>
                <Button onClick={handleConfirm} className="flex-1">
                  {t.confirm}
                </Button>
                {onOpenQuoteCalculator && (
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenQuoteCalculator(guestCount[0])}
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