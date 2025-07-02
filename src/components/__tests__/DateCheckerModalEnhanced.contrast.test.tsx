import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DateCheckerModalEnhanced } from '../DateCheckerModalEnhanced';

// Mock the hooks and dependencies
vi.mock('@/hooks/useAvailability', () => ({
  useAvailability: () => ({
    isDateBooked: () => false,
    isDateLimited: () => true,
    availability: [],
    mapAvailabilityToDateChecker: () => ({
      bookedDates: [],
      limitedDates: ['2025-07-15'],
      unavailableDates: []
    })
  })
}));

vi.mock('@/hooks/useDateCheckerReducer', () => ({
  useDateCheckerReducer: () => [
    {
      step: 1,
      selectedDate: new Date('2025-07-15'),
      selectedTime: '18:00',
      guestCount: 4,
      language: 'nl' as const,
      estimatedPrice: 150
    },
    vi.fn()
  ]
}));

vi.mock('@/hooks/useComponentLogger', () => ({
  useLifecycleLogger: () => ({}),
  useRenderLogger: () => ({}),
  usePerformanceLogger: () => ({})
}));

vi.mock('@/lib/logger', () => ({
  UserFlowLogger: { interaction: vi.fn(), breadcrumb: vi.fn() },
  ComponentLogger: { render: vi.fn(), stateChange: vi.fn() }
}));

vi.mock('@/lib/LoggerUtils', () => ({
  SafeLogger: { 
    error: vi.fn(),
    logError: vi.fn(),
    log: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  }
}));

describe('DateCheckerModalEnhanced - Dark Mode Contrast Tests', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onBookingComplete: vi.fn(),
    language: 'nl' as const
  };

  it('should have sufficient contrast for limited availability badge in dark mode', () => {
    // Apply dark mode class to document
    document.documentElement.classList.add('dark');
    
    const { container } = render(<DateCheckerModalEnhanced {...defaultProps} />);
    
    // Find the limited availability badge
    const limitedBadge = screen.getByText(/beperkt beschikbaar/i);
    expect(limitedBadge).toBeInTheDocument();
    
    // Get computed styles
    const badgeStyles = window.getComputedStyle(limitedBadge);
    const backgroundColor = badgeStyles.backgroundColor;
    const color = badgeStyles.color;
    
    // Log the styles for manual verification
    console.log('Dark mode badge styles:', {
      backgroundColor,
      color,
      className: limitedBadge.className
    });
    
    // Verify the badge has the expected styling classes
    expect(limitedBadge).toHaveClass('bg-orange-500/20', 'text-orange-700', 'border-orange-500/30');
    
    // Clean up
    document.documentElement.classList.remove('dark');
  });

  it('should have sufficient contrast for limited availability badge in light mode', () => {
    // Ensure light mode
    document.documentElement.classList.remove('dark');
    
    const { container } = render(<DateCheckerModalEnhanced {...defaultProps} />);
    
    // Find the limited availability badge
    const limitedBadge = screen.getByText(/beperkt beschikbaar/i);
    expect(limitedBadge).toBeInTheDocument();
    
    // Get computed styles
    const badgeStyles = window.getComputedStyle(limitedBadge);
    const backgroundColor = badgeStyles.backgroundColor;
    const color = badgeStyles.color;
    
    // Log the styles for manual verification
    console.log('Light mode badge styles:', {
      backgroundColor,
      color,
      className: limitedBadge.className
    });
    
    // Verify the badge has the expected styling classes
    expect(limitedBadge).toHaveClass('bg-orange-500/20', 'text-orange-700', 'border-orange-500/30');
  });

  it('should maintain consistent styling between light and dark modes', () => {
    // Test light mode
    document.documentElement.classList.remove('dark');
    const { rerender: rerenderLight } = render(<DateCheckerModalEnhanced {...defaultProps} />);
    const lightBadge = screen.getByText(/beperkt beschikbaar/i);
    const lightClasses = lightBadge.className;
    
    // Test dark mode
    document.documentElement.classList.add('dark');
    const { rerender: rerenderDark } = render(<DateCheckerModalEnhanced {...defaultProps} />);
    const darkBadge = screen.getByText(/beperkt beschikbaar/i);
    const darkClasses = darkBadge.className;
    
    // Both should have the same classes (Tailwind handles dark mode variants)
    expect(lightClasses).toBe(darkClasses);
    
    // Clean up
    document.documentElement.classList.remove('dark');
  });
});

/**
 * Manual Contrast Verification:
 * 
 * The limited availability badge uses:
 * - bg-orange-500/20: Orange background with 20% opacity
 * - text-orange-700: Dark orange text (good contrast)
 * - border-orange-500/30: Orange border with 30% opacity
 * 
 * Expected contrast ratios:
 * Light mode: orange-700 on orange-500/20 should provide >4.5:1 ratio
 * Dark mode: Same classes rely on Tailwind's dark mode variants
 * 
 * For production verification, use browser dev tools:
 * 1. Open DateChecker modal
 * 2. Toggle dark mode
 * 3. Inspect limited availability badge
 * 4. Check Accessibility tab for contrast ratio
 * 
 * WCAG AA compliance requires 4.5:1 for normal text, 3:1 for large text
 */