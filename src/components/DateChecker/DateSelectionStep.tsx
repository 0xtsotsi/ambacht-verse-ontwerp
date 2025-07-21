import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { nl } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { DATE_CHECKER_STYLES, isDateSelectable } from '@/lib/date-checker-constants';

interface DateSelectionStepProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  translations: {
    selectDate: string;
    title: string;
  };
}

/**
 * Date selection step component for the DateChecker modal
 * Handles calendar display and date selection validation
 */
export function DateSelectionStep({ 
  selectedDate, 
  onDateSelect, 
  translations 
}: DateSelectionStepProps) {
  return (
    <div>
      <div className={DATE_CHECKER_STYLES.stepHeader}>
        <div className={DATE_CHECKER_STYLES.stepNumber} aria-hidden="true">1</div>
        <h3 className="font-medium" id="step-1-heading">
          <CalendarDays className="w-5 h-5 inline mr-2" />
          {translations.selectDate}
        </h3>
      </div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={(date) => !isDateSelectable(date)}
        className="rounded-md border"
        locale={nl}
        aria-labelledby="step-1-heading"
      />
    </div>
  );
}