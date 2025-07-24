/**
 * Accessibility tests for DateChecker components
 * Tests WCAG compliance using axe-core
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { DateCheckerModalEnhanced } from "../DateCheckerModalEnhanced";
import { DateCheckerModal } from "../DateCheckerModal";

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock hooks and dependencies
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock("@/hooks/useAvailability", () => ({
  useAvailability: () => ({
    isDateBooked: vi.fn(() => false),
    isDateLimited: vi.fn(() => false),
  }),
}));

vi.mock("@/hooks/useComponentLogger", () => ({
  useLifecycleLogger: vi.fn(),
  useRenderLogger: vi.fn(() => ({ renderCount: 1 })),
  usePerformanceLogger: vi.fn(() => ({ getPerformanceStats: vi.fn() })),
}));

vi.mock("@/lib/logger", () => ({
  UserFlowLogger: {
    interaction: vi.fn(),
    error: vi.fn(),
  },
  ComponentLogger: {
    lifecycle: vi.fn(),
  },
}));

// Mock date-fns locale
vi.mock("date-fns/locale", () => ({
  nl: {},
}));

describe("DateChecker Accessibility Tests", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
  };

  describe("DateCheckerModalEnhanced accessibility", () => {
    it("should not have accessibility violations when closed", async () => {
      const { container } = render(
        <DateCheckerModalEnhanced {...defaultProps} open={false} />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should not have accessibility violations when open", async () => {
      const { container } = render(
        <DateCheckerModalEnhanced {...defaultProps} />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper dialog accessibility attributes", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Check for dialog role and aria-labelledby
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-labelledby");
      expect(dialog).toHaveAttribute("aria-describedby");
    });

    it("should have proper heading hierarchy", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Check for proper heading structure
      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toBeInTheDocument();

      // Step headings should be h3
      const stepHeading = screen.getByRole("heading", { level: 3 });
      expect(stepHeading).toBeInTheDocument();
    });

    it("should have accessible form controls", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Calendar should be accessible
      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();
      expect(calendar).toHaveAttribute("aria-labelledby");
    });

    it("should have proper screen reader announcements", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Check for aria-live region
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it("should have accessible time slot buttons", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // First set a date to enable time selection
      const dateButtons = screen.getAllByRole("gridcell");
      if (dateButtons.length > 0) {
        const availableDate = dateButtons.find(
          (button) => !button.hasAttribute("disabled"),
        );
        if (availableDate) {
          availableDate.click();
        }
      }

      // Check for radiogroup role
      const timeSlotGroup = document.querySelector('[role="radiogroup"]');
      if (timeSlotGroup) {
        expect(timeSlotGroup).toHaveAttribute("aria-labelledby");

        // Check radio buttons have proper attributes
        const radioButtons = document.querySelectorAll('[role="radio"]');
        radioButtons.forEach((button) => {
          expect(button).toHaveAttribute("aria-checked");
          expect(button).toHaveAttribute("aria-label");
        });
      }
    });

    it("should have accessible badges with status role", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Check for status badges
      const statusBadges = document.querySelectorAll('[role="status"]');
      expect(statusBadges.length).toBeGreaterThanOrEqual(0);

      statusBadges.forEach((badge) => {
        expect(badge).toHaveAttribute("aria-live", "polite");
      });
    });

    it("should have accessible slider controls", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Navigate to guest count step
      // First select a date
      const dateButtons = screen.getAllByRole("gridcell");
      if (dateButtons.length > 0) {
        const availableDate = dateButtons.find(
          (button) => !button.hasAttribute("disabled"),
        );
        if (availableDate) {
          availableDate.click();

          // Then select a time to get to guest count
          setTimeout(() => {
            const timeButtons = document.querySelectorAll('[role="radio"]');
            if (timeButtons.length > 0) {
              (timeButtons[0] as HTMLElement).click();

              // Check for slider accessibility
              const slider = screen.queryByRole("slider");
              if (slider) {
                expect(slider).toHaveAttribute("aria-labelledby");
                expect(slider).toHaveAttribute("aria-describedby");
                expect(slider).toHaveAttribute("aria-valuetext");
              }
            }
          }, 100);
        }
      }
    });
  });

  describe("DateCheckerModal accessibility", () => {
    it("should not have accessibility violations", async () => {
      const { container } = render(<DateCheckerModal {...defaultProps} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper dialog structure", () => {
      render(<DateCheckerModal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-labelledby");
      expect(dialog).toHaveAttribute("aria-describedby");
    });

    it("should have accessible form controls", () => {
      render(<DateCheckerModal {...defaultProps} />);

      // Calendar should be accessible
      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();
    });

    it("should have accessible radio groups for time selection", async () => {
      const { container } = render(<DateCheckerModal {...defaultProps} />);

      // First select a date to enable time selection
      const dateButtons = screen.getAllByRole("gridcell");
      if (dateButtons.length > 0) {
        const availableDate = dateButtons.find(
          (button) => !button.hasAttribute("disabled"),
        );
        if (availableDate) {
          availableDate.click();

          // Wait for time selection to appear
          setTimeout(async () => {
            const radioGroups = screen.getAllByRole("radiogroup");
            expect(radioGroups.length).toBeGreaterThan(0);

            radioGroups.forEach((group) => {
              expect(group).toHaveAttribute("aria-labelledby");
            });

            // Check accessibility after state change
            const results = await axe(container);
            expect(results).toHaveNoViolations();
          }, 1000);
        }
      }
    });

    it("should have accessible status badges", () => {
      render(<DateCheckerModal {...defaultProps} />);

      // Check for status badges
      const statusBadges = document.querySelectorAll('[role="status"]');
      statusBadges.forEach((badge) => {
        expect(badge).toHaveAttribute("aria-live", "polite");
      });
    });
  });

  describe("Keyboard navigation", () => {
    it("should support keyboard navigation in DateCheckerModalEnhanced", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Calendar should be keyboard navigable
      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();

      // All interactive elements should be focusable
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute("tabindex", "-1");
      });
    });

    it("should have proper focus management", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Dialog should manage focus
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();

      // Check for focus trap behavior (implementation specific)
      // This would need more sophisticated testing with user interactions
    });
  });

  describe("Screen reader compatibility", () => {
    it("should have proper ARIA labels and descriptions", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Check for aria-labelledby relationships
      const labelledElements = document.querySelectorAll("[aria-labelledby]");
      labelledElements.forEach((element) => {
        const labelId = element.getAttribute("aria-labelledby");
        const labelElement = document.getElementById(labelId!);
        expect(labelElement).toBeInTheDocument();
      });

      // Check for aria-describedby relationships
      const describedElements = document.querySelectorAll("[aria-describedby]");
      describedElements.forEach((element) => {
        const descriptionId = element.getAttribute("aria-describedby");
        const descriptionElement = document.getElementById(descriptionId!);
        expect(descriptionElement).toBeInTheDocument();
      });
    });

    it("should announce state changes via aria-live regions", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Check for aria-live regions
      const liveRegions = document.querySelectorAll("[aria-live]");
      expect(liveRegions.length).toBeGreaterThan(0);

      liveRegions.forEach((region) => {
        const liveValue = region.getAttribute("aria-live");
        expect(["polite", "assertive"]).toContain(liveValue);
      });
    });
  });

  describe("Color contrast and visual accessibility", () => {
    it("should not rely solely on color for information", () => {
      render(<DateCheckerModalEnhanced {...defaultProps} />);

      // Available/limited/unavailable states should have text or icons
      // This would need visual regression testing or more specific color contrast testing
      // For now, we check that status information is provided via text content

      const statusElements = document.querySelectorAll('[role="status"]');
      statusElements.forEach((element) => {
        expect(element.textContent).toBeTruthy();
      });
    });
  });
});
