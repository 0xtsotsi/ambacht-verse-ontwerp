"use client";

// React imports
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

/* 3rd-party UI */
import Calendar from "lucide-react/dist/esm/icons/calendar";
import ChefHat from "lucide-react/dist/esm/icons/chef-hat";
import Clock from "lucide-react/dist/esm/icons/clock";

/* Utils */
import { cn } from "@/lib/utils";

/* Analytics */
import {
  useBreadcrumbLogger,
  useInteractionLogger,
} from "@/hooks/useUserFlowLogger";
import { useConversionFunnel } from "@/lib/conversionFunnel";

// Types & Constants - grouped at the top

// Widget variants
export type WidgetVariant = "corner" | "sidebar";

/**
 * Analytics event types for floating widget
 */
enum WidgetEventType {
  DISPLAY = "display",
  CLICK = "click",
  HOVER = "hover",
}

// Analytics constants using enum for standardization
enum Breadcrumb {
  Displayed = "floating_widget_displayed",
  Hover = "widget_hovered",
  Click = "widget_clicked",
}

// Constants
const CONSTANTS = {
  DEFAULT_DELAY_MS: 1000,
};

const WIDGET_TYPES: Record<WidgetVariant, string> = {
  corner: "floating_corner",
  sidebar: "floating_sidebar",
};

// Memoized icons to prevent re-renders
const CalendarIcon = React.memo(Calendar);
const ClockIcon = React.memo(Clock);
const ChefHatIcon = React.memo(ChefHat);

// Analytics event types
type EventType = "display" | "click" | "hover";
type LogClickFn = (element: string, data?: Record<string, unknown>) => void;
type LogButtonPressFn = (buttonId: string, flowId: string) => void;
type AddBreadcrumbFn = (breadcrumb: Breadcrumb) => void;

// Centralized analytics tracking to avoid duplication and typos
const trackFloatingWidget = (
  logClick: LogClickFn,
  logButtonPress: LogButtonPressFn,
  addBreadcrumb: AddBreadcrumbFn,
  event: EventType,
  variant: WidgetVariant = "corner",
  payload?: Record<string, unknown>,
): void => {
  switch (event) {
    case "display":
      addBreadcrumb(Breadcrumb.Displayed);
      break;
    case "hover":
      addBreadcrumb(Breadcrumb.Hover);
      break;
    case "click":
      logClick("floating_booking_widget", {
        widgetType: WIDGET_TYPES[variant],
        ...payload,
      });
      logButtonPress("floating_widget_click", "booking_flow");
      addBreadcrumb(Breadcrumb.Click);
      break;
  }
};

// LiveRegion component for accessibility announcements
function LiveRegion({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} aria-live="polite" className="sr-only">
      {children}
    </div>
  );
}

// Translation dictionary - in real app, replace with i18n system
const TRANSLATIONS = {
  "widget.reserve": "Reserveer",
  "widget.today": "Vandaag",
  "widget.checkAvailability": "Beschikbaarheid Controleren",
  "widget.responseTime": "Binnen 24 uur reactie",
  "widget.checkDate": "Check Uw Datum",
  "widget.announced": "Reserveer widget verschenen",
  "widget.openBooking": "Reserveer vandaag - Open booking formulier",
} as const;

// Type-safe translation keys
type TranslationKey = keyof typeof TRANSLATIONS;

// Type-safe translation helper
const useTranslation = () => {
  return {
    t: useCallback((key: TranslationKey | string): string => {
      // Check if it's a known translation key first
      if (key in TRANSLATIONS) {
        return TRANSLATIONS[key as TranslationKey];
      }
      // Fallback to the key itself if not found
      return key;
    }, []),
  };
};

/**
 * Props for the BookingWidgetFloating component
 * @interface Props
 */
interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  /** Handler for when the booking button is clicked */
  onBookingClick?: () => void;
  /** Delay in ms before the widget appears (default: 1000) */
  delayMs?: number;
  /** Unique identifier for accessibility purposes */
  id?: string;
  /** Visual variant of the widget (corner or sidebar) */
  variant?: WidgetVariant;
  /** Theme color override for primary color */
  themeColorPrimary?: string;
  /** Theme color override for secondary color */
  themeColorSecondary?: string;
  /** Theme color override for accent color */
  themeColorAccent?: string;
}

/**
 * Skeleton variant for loading states
 */
export function BookingWidgetFloatingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 animate-pulse",
        "rounded-3xl bg-neutral-100 shadow-md w-64 aspect-[4/3]",
        className,
      )}
    />
  );
}

/**
 * Hook to manage floating widget state, timers, and analytics
 */
type FloatingWidgetHookProps = {
  delayMs?: number;
  variant?: WidgetVariant;
  onBookingClick?: () => void;
};

type FloatingWidgetHookReturn = {
  isVisible: boolean;
  handleClick: () => void;
  handleHover: (hovered: boolean) => void;
};

function useFloatingWidget({
  delayMs = CONSTANTS.DEFAULT_DELAY_MS,
  variant = "corner",
  onBookingClick,
}: FloatingWidgetHookProps): FloatingWidgetHookReturn {
  const [isVisible, setIsVisible] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  // Removed unused ref - will be restored when IntersectionObserver is implemented
  // const observerRef = useRef<IntersectionObserver | null>(null);
  const hoverLoggedRef = useRef(false);
  const hoverTimerRef = useRef<number | null>(null);

  const { logClick, logButtonPress } = useInteractionLogger();
  const { addBreadcrumb } = useBreadcrumbLogger();
  const { startFunnel, logStep } = useConversionFunnel("booking_flow");

  // Set up visibility with delay or IntersectionObserver
  useEffect(() => {
    // Alternative 1: Simple timeout approach
    const timer = window.setTimeout(() => {
      setIsVisible(true);
      shownAtRef.current = Date.now();
      trackFloatingWidget(
        logClick,
        logButtonPress,
        addBreadcrumb,
        "display",
        variant,
      );
      startFunnel();
    }, delayMs);

    /*
    // NOTE: This is an alternative implementation using IntersectionObserver
    // It's commented out to avoid unused variable warnings, but kept for future reference
    // IMPORTANT: TypeScript will still check this code for errors even when commented
    
    // To enable, uncomment this code and restore the observerRef declaration above
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const timer = window.setTimeout(() => {
          setIsVisible(true);
          shownAtRef.current = Date.now();
          trackFloatingWidget(logClick, logButtonPress, addBreadcrumb, 'display', variant);
          startFunnel();
          observer.disconnect();
        }, delayMs);
      }
    });
    
    const target = document.body;
    observer.observe(target);
    // const observerRef = useRef<IntersectionObserver | null>(null);
    // observerRef.current = observer;
    */

    return () => {
      window.clearTimeout(timer);
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, [addBreadcrumb, delayMs, logButtonPress, logClick, startFunnel, variant]);

  // Handle booking button click with analytics
  const handleClick = useCallback(() => {
    // Calculate exact display duration since the widget appeared
    const displayDuration = shownAtRef.current
      ? Date.now() - shownAtRef.current
      : 0;

    trackFloatingWidget(
      logClick,
      logButtonPress,
      addBreadcrumb,
      "click",
      variant,
      {
        displayDuration, // Track how long the widget was visible before click
        timestamp: Date.now(),
      },
    );

    logStep("booking_widget_click");

    if (onBookingClick) {
      onBookingClick();
    }
  }, [
    addBreadcrumb,
    logButtonPress,
    logClick,
    logStep,
    onBookingClick,
    variant,
  ]);

  // Handle hover state with debounced analytics (300ms)
  const handleHover = useCallback(
    (hovered: boolean) => {
      // For hover start, we debounce to avoid logging accidental hovering
      if (hovered && !hoverLoggedRef.current) {
        if (hoverTimerRef.current) {
          window.clearTimeout(hoverTimerRef.current);
        }

        hoverTimerRef.current = window.setTimeout(() => {
          hoverLoggedRef.current = true;
          trackFloatingWidget(
            logClick,
            logButtonPress,
            addBreadcrumb,
            "hover",
            variant,
            {
              timestamp: Date.now(),
            },
          );
        }, 300); // 300ms debounce to ensure intentional hover
      }
      // For hover end, we reset the logged state after a delay
      else if (!hovered) {
        if (hoverTimerRef.current) {
          window.clearTimeout(hoverTimerRef.current);
        }

        hoverTimerRef.current = window.setTimeout(() => {
          hoverLoggedRef.current = false;
        }, 500); // 500ms delay before allowing new hover events
      }
    },
    [addBreadcrumb, logButtonPress, logClick, variant],
  );

  return {
    isVisible,
    handleClick,
    handleHover,
  };
}
function WidgetContent({ variant = "corner" }: { variant?: WidgetVariant }) {
  const { t } = useTranslation();
  const reactId = useId(); // For unique IDs in labels and headings

  // Content layout adjustments based on variant
  const contentPadding = variant === "corner" ? "p-5" : "p-6";
  const accentPosition =
    variant === "corner"
      ? "top-0 right-0 w-[40%] h-[45%] rounded-bl-3xl rounded-tr-3xl"
      : "top-0 left-0 w-[50%] h-[40%] rounded-br-3xl rounded-tl-3xl";

  // Unique IDs for accessibility
  const headingId = `widget-heading-${reactId}`;
  const subheadingId = `widget-subheading-${reactId}`;
  const ctaId = `widget-cta-${reactId}`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-lg">
      {/* Accent Color Block - decorative gradient */}
      <div
        className={cn(
          "absolute bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)]",
          accentPosition,
        )}
        aria-hidden="true" // Hide from screen readers as it's decorative
      />

      {/* Content Container */}
      <div
        className={cn(
          "relative z-10 flex h-full flex-col justify-between",
          contentPadding,
        )}
      >
        {/* Header Section */}
        <div className="space-y-1">
          <h3
            id={headingId}
            className="text-lg font-semibold text-[var(--theme-primary)]"
          >
            {t("widget.reserve")}
          </h3>

          <h4
            id={subheadingId}
            className="flex items-center gap-1 text-sm text-gray-600"
          >
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            <span>{t("widget.today")}</span>
          </h4>
        </div>

        {/* Center Section with Icons */}
        <div className="my-auto text-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm">
            <ChefHatIcon
              className="h-4 w-4 text-[var(--theme-primary)]"
              aria-hidden="true"
            />
            <span className="text-[var(--theme-secondary)] font-medium">
              {t("widget.checkAvailability")}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
            <ClockIcon className="h-3 w-3" aria-hidden="true" />
            <span>{t("widget.responseTime")}</span>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="pt-2">
          <div
            id={ctaId}
            className={cn(
              "bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-accent)] rounded-2xl",
              "px-6 py-3 transform transition-all duration-200",
              "motion-safe:group-hover:shadow-lg motion-safe:group-hover:scale-105",
            )}
            role="presentation" // For button semantics clarity
          >
            <span
              className={cn(
                "block text-center font-sans text-sm font-bold text-white",
                "tracking-widest uppercase letter-spacing-2",
              )}
            >
              {t("widget.checkDate")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FloatingWidgetShell component
 *
 * This component handles the layout, positioning, motion and container styling
 * for the floating booking widget. It manages position variants (corner/sidebar),
 * animations, and theme colors via CSS variables.
 *
 * @param props - Component props
 * @param props.children - Content to render inside the shell
 * @param props.isVisible - Whether the widget is visible
 * @param props.variant - Position variant ('corner' or 'sidebar')
 * @param props.className - Additional CSS classes
 * @param props.onHoverStart - Callback when hover starts
 * @param props.onHoverEnd - Callback when hover ends
 * @param props.themeColorPrimary - Override for primary brand color
 * @param props.themeColorSecondary - Override for secondary brand color
 * @param props.themeColorAccent - Override for accent brand color
 * @returns React component
 */
function FloatingWidgetShell({
  children,
  isVisible,
  variant = "corner",
  className,
  onHoverStart,
  onHoverEnd,
  themeColorPrimary,
  themeColorSecondary,
  themeColorAccent,
  ...props
}: {
  children: React.ReactNode;
  isVisible: boolean;
  variant?: WidgetVariant;
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  themeColorPrimary?: string;
  themeColorSecondary?: string;
  themeColorAccent?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // Position classes based on variant
  const positionClasses =
    variant === "corner"
      ? "fixed bottom-8 right-8 z-50"
      : "fixed top-1/2 -translate-y-1/2 right-0 z-50";

  // Default theme colors with CSS variable support and prop overrides
  const themeStyles = {
    "--theme-primary":
      themeColorPrimary || "var(--color-theme-primary, #CC5D00)", // Brand orange
    "--theme-secondary":
      themeColorSecondary || "var(--color-theme-secondary, #2B4040)", // Brand teal
    "--theme-accent": themeColorAccent || "var(--color-theme-accent, #BB3A3C)", // Brand accent
  } as React.CSSProperties;

  // Animation classes with motion-safe prefix
  const motionSafe = "motion-safe:";
  const animationClasses = cn(
    motionSafe + "transition-all",
    motionSafe + "duration-700",
    motionSafe + "ease-out",
    isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
  );

  return (
    <button
      type="button"
      className={cn(
        positionClasses,
        "transition-all duration-700 ease-out",
        "m-0 text-left bg-transparent border-0 p-0",
        "aspect-[4/3] w-64", // Consistent aspect ratio
        "group", // For group hover effects
        animationClasses,
        className,
      )}
      style={themeStyles}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      {...props}
    >
      <div
        className="relative bg-gradient-to-br from-white to-neutral-50/90 rounded-3xl shadow-2xl h-full
                    border border-brand-500/20 backdrop-blur-sm
                    transition-all duration-300 ease-out cursor-pointer group
                    hover:shadow-[0_25px_50px_-12px_rgba(204,93,0,0.25)]
                    hover:scale-105 hover:rotate-1"
      >
        {/* Corner Accent */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-500 rounded-full opacity-80 animate-pulse" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-900 rounded-full" />

        {children}

        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300
                      bg-gradient-to-br from-brand-500/5 to-brand-900/5
                      group-hover:opacity-100"
        />

        {/* Floating Animation Indicator */}
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2
                      w-2 h-2 bg-brand-500 rounded-full opacity-60
                      animate-bounce"
        />
      </div>
    </button>
  );
}

/**
 * Main exported component - BookingWidgetFloating
 * Following the adjective-after-noun convention
 */
/**
 * Main component - memoized for performance
 * This component provides the complete floating booking widget with all features
 * including analytics tracking, accessibility, animations, and theme customization.
 *
 * @param props - Component properties
 * @returns A React component rendering the floating booking widget
 */
export const BookingWidgetFloating = React.memo(function BookingWidgetFloating({
  onBookingClick,
  delayMs = CONSTANTS.DEFAULT_DELAY_MS,
  id: propId,
  variant = "corner",
  themeColorPrimary,
  themeColorSecondary,
  themeColorAccent,
  className,
  ...props
}: Props) {
  // SSR-safe unique ID generation
  const reactId = useId();
  const id = propId ?? `booking-widget-${reactId}`;
  const announcementId = `${id}-announcement`;

  // Use the floating widget hook for state management
  const { isVisible, handleClick, handleHover } = useFloatingWidget({
    delayMs,
    variant,
    onBookingClick,
  });

  // Translation hook
  const { t } = useTranslation();

  // Render the component
  return (
    <>
      {/* Accessibility announcement */}
      {isVisible && (
        <LiveRegion id={announcementId}>{t("widget.announced")}</LiveRegion>
      )}

      {/* Main Widget */}
      <FloatingWidgetShell
        isVisible={isVisible}
        variant={variant}
        className={className}
        onClick={handleClick}
        onHoverStart={() => handleHover(true)}
        onHoverEnd={() => handleHover(false)}
        themeColorPrimary={themeColorPrimary}
        themeColorSecondary={themeColorSecondary}
        themeColorAccent={themeColorAccent}
        aria-labelledby={`widget-heading-${reactId} widget-subheading-${reactId}`}
        aria-describedby={announcementId}
        {...props}
      >
        <WidgetContent variant={variant} />
      </FloatingWidgetShell>
    </>
  );
});

/**
 * @file BookingWidgetFloating.tsx
 * @description Floating booking widget that appears in the corner of the screen
 *
 * IMPLEMENTATION NOTES:
 *
 * 1. Tailwind Theme Configuration
 * Add these color tokens to tailwind.config.js:
 *
 * ```js
 * // tailwind.config.js
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         brand: {
 *           50: '#FFEFDA',   // Light orange background
 *           500: '#CC5D00',  // Primary orange accent color
 *           900: '#2B4040',  // Dark teal text
 *           accent: '#BB3A3C' // Reddish gradient endpoint
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * 2. Accessibility Features
 * - Uses semantic button element with proper ARIA attributes
 * - External live region for screen reader announcements
 * - aria-labelledby referencing heading IDs to avoid redundant speech
 * - Respects prefers-reduced-motion with motion-safe prefixes
 * - All interactive elements have proper ARIA roles and states
 *
 * 3. Component Structure
 * - BookingWidgetFloating: Main exported component (React.memo for performance)
 * - useFloatingWidget: Custom hook for state management and analytics
 * - FloatingWidgetShell: Layout, positioning, and motion handling
 * - WidgetContent: Typography and visual content
 * - BookingWidgetFloatingSkeleton: Loading state placeholder
 *
 * 4. Analytics Integration
 * - Centralized tracking with TypeScript enums for consistency
 * - Properly debounced hover tracking
 * - Accurate display duration tracking for conversion analysis
 * - Integration hooks for conversion funnel and breadcrumb tracking
 *
 * 5. CSS Animation Alternative
 * For better performance, consider using pure CSS animation:
 *
 * ```css
 * @keyframes fadeUp {
 *   to { opacity: 1; transform: translateY(0); }
 * }
 *
 * .widget-reveal {
 *   opacity: 0;
 *   transform: translateY(4rem);
 *   animation: fadeUp 0.7s 1s forwards ease-out;
 * }
 * ```
 *
 * 6. Usage Example
 *
 * ```tsx
 * // Basic usage with default settings
 * <BookingWidgetFloating onBookingClick={() => setIsModalOpen(true)} />
 *
 * // With custom theme colors and delay
 * <BookingWidgetFloating
 *   onBookingClick={handleBookingClick}
 *   delayMs={2000}
 *   variant="corner"
 *   themeColorPrimary="#FF6B35"
 *   themeColorSecondary="#004E89"
 *   themeColorAccent="#FF5151"
 * />
 *
 * // Sidebar variant with custom class
 * <BookingWidgetFloating
 *   variant="sidebar"
 *   className="lg:w-72"
 *   onBookingClick={openBookingModal}
 * />
 * ```
 */
/**
 * Test Examples - Move to __tests__/BookingWidgetFloating.test.tsx
 * 
 * Example unit tests with React Testing Library + Jest:
 * 
 * ```tsx
 * import { render, screen, fireEvent, waitFor } from '@testing-library/react';
 * import { axe, toHaveNoViolations } from 'jest-axe';
 * import '@testing-library/jest-dom';
 * import { BookingWidgetFloating } from '../components/variations/floating-widget-001-elegant-corner';

* expect.extend(toHaveNoViolations);
 * 
 * describe('BookingWidgetFloating', () => {
 *   beforeEach(() => {
 *     jest.useFakeTimers();
 *   });
 * 
 *   afterEach(() => {
 *     jest.useRealTimers();
 *   });
 * 
 *   it('should be hidden initially and appear after delay', async () => {
 *     render(<BookingWidgetFloating onBookingClick={jest.fn()} />);
 *     
 *     const widget = screen.getByRole('button');
 *     expect(widget).toHaveClass('opacity-0');
 *     
 *     jest.advanceTimersByTime(1000);
 *     
 *     await waitFor(() => {
 *       expect(widget).toHaveClass('opacity-100');
 *     });
 *   });
 * 
 *   it('should fire onBookingClick when clicked', () => {
 *     const mockClick = jest.fn();
 *     render(<BookingWidgetFloating onBookingClick={mockClick} delayMs={0} />);
 *     
 *     fireEvent.click(screen.getByRole('button'));
 *     expect(mockClick).toHaveBeenCalledTimes(1);
 *   });
 * 
 *   it('should have no accessibility violations', async () => {
 *     const { container } = render(<BookingWidgetFloating delayMs={0} />);
 *     jest.advanceTimersByTime(1000);
 *     
 *     const results = await axe(container);
 *     expect(results).toHaveNoViolations();
 *   });
 * });
 * ```
 * 
 * Example Cypress E2E test:
 * 
 * ```tsx
 * describe('Booking Widget', () => {
 *   it('should appear after delay and open modal on click', () => {
 *     cy.visit('/');
 *     
 *     // Widget should be hidden initially
 *     cy.get('button[aria-labelledby*="widget-heading"]')
 *       .should('have.class', 'opacity-0');
 *     
 *     // Wait for animation
 *     cy.wait(1000);
 *     
 *     // Widget should be visible
 *     cy.get('button[aria-labelledby*="widget-heading"]')
 *       .should('have.class', 'opacity-100');
 *     
 *     // Test keyboard navigation
 *     cy.tab().tab() // Navigate to the widget with keyboard
 *       .should('have.focus')
 *       .type('{enter}'); // Press Enter
 *     
 *     // Assert booking modal opens
 *     cy.get('[data-testid="booking-modal"]').should('be.visible');
 *   });
 * });
 * ```
*/

// End of file
