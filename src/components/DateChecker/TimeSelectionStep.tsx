import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { 
  TIME_SLOTS, 
  DATE_CHECKER_STYLES, 
  getAvailabilityStatus 
} from '@/lib/date-checker-constants';

interface TimeSelectionStepProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  isDateBooked: (date: Date, time: string) => boolean;
  isDateLimited: (date: Date, time: string) => boolean;
  translations: {
    selectTime: string;
    available: string;
    limited: string;
    unavailable: string;
  };
}

/**
 * Time selection step component for the DateChecker modal
 * Handles time slot display and availability checking
 */
export function TimeSelectionStep({
  selectedDate,
  selectedTime,
  onTimeSelect,
  isDateBooked,
  isDateLimited,
  translations
}: TimeSelectionStepProps) {
  const timeSlotContainerRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (timeSlotContainerRef.current) {
      const firstButton = timeSlotContainerRef.current.querySelector('button:not([disabled])');
      if (firstButton) {
        setTimeout(() => {
          (firstButton as HTMLElement).focus();
        }, 0);
      }
    }
  }, [selectedDate]);

  if (!selectedDate) return null;

  return (
    <div>
      <div className={DATE_CHECKER_STYLES.stepHeader}>
        <div className={DATE_CHECKER_STYLES.stepNumber} aria-hidden="true">2</div>
        <h3 className="font-medium" id="step-2-heading">
          <Clock className="w-5 h-5 inline mr-2" />
          {translations.selectTime}
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
      </p>
      <div 
        ref={timeSlotContainerRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
        role="radiogroup"
        aria-labelledby="step-2-heading"
      >
        {TIME_SLOTS.map((slot) => {
          const status = getAvailabilityStatus(
            selectedDate,
            isDateBooked(selectedDate, slot.value),
            isDateLimited(selectedDate, slot.value)
          );
          
          return (
            <button
              key={slot.value}
              onClick={() => status !== 'unavailable' && onTimeSelect(slot.value)}
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
              aria-label={`${slot.label} - ${
                status === 'available' 
                  ? translations.available 
                  : status === 'limited' 
                  ? translations.limited 
                  : translations.unavailable
              }`}
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
                  {translations.limited}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}