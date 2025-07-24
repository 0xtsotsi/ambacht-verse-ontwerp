import { useEffect, useRef, useCallback } from "react";

interface UseAccessibilityManagerProps {
  step: number;
  translations: {
    selectDate: string;
    selectTime: string;
    guestCount: string;
  };
  navigationLabels: {
    screenReaderStepAnnouncement: string;
  };
}

/**
 * Custom hook for managing accessibility features in DateChecker components
 * Handles focus management, screen reader announcements, and ARIA updates
 */
export function useAccessibilityManager({
  step,
  translations,
  navigationLabels,
}: UseAccessibilityManagerProps) {
  const ariaLiveRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Update aria-live region for screen readers
  useEffect(() => {
    if (ariaLiveRef.current) {
      const stepNames = [
        translations.selectDate,
        translations.selectTime,
        translations.guestCount,
      ];

      const announcement = navigationLabels.screenReaderStepAnnouncement
        .replace("{step}", step.toString())
        .replace("{stepName}", stepNames[step - 1] || "");

      ariaLiveRef.current.textContent = announcement;
    }
  }, [step, translations, navigationLabels]);

  // Focus management helper
  const focusConfirmButton = useCallback(() => {
    if (confirmButtonRef.current) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 0);
    }
  }, []);

  // Generate ARIA props for step navigation
  const getStepAriaProps = useCallback(
    (currentStep: number, targetStep: number) => {
      const stepNames = [
        translations.selectDate,
        translations.selectTime,
        translations.guestCount,
      ];

      return {
        "aria-label": `${targetStep < currentStep ? "Previous" : "Next"}: ${stepNames[targetStep - 1] || ""}`,
      };
    },
    [translations],
  );

  // Screen reader announcement component
  const AriaLiveRegion = () => (
    <div ref={ariaLiveRef} aria-live="polite" className="sr-only" />
  );

  return {
    ariaLiveRef,
    confirmButtonRef,
    focusConfirmButton,
    getStepAriaProps,
    AriaLiveRegion,
  };
}
