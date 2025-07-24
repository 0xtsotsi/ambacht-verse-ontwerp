// V5 Interactive Elegance Integration Test
// Validates consolidated V5 components work together properly

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import PricingCardEnhanced from "@/components/PricingCardEnhanced";
import { InteractiveMenuSystem } from "@/components/InteractiveMenuSystem";

// Mock dependencies
vi.mock("@/lib/pricing-card-constants", () => ({
  BASE_PRICES: {
    corporate: 12.5,
    social: 27.5,
    wedding: 22.5,
    custom: null,
  },
  TIER_MULTIPLIERS: {
    basis: 1.0,
    premium: 1.4,
    luxe: 1.8,
  },
  COLOR_SCHEMES: {
    corporate: {
      bg: "bg-blue-50 border-blue-200",
      accent: "text-blue-600",
      gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
      metallic: "bg-gradient-to-r from-blue-400 to-blue-600",
    },
  },
  TRANSLATIONS: {
    nl: {
      corporate: "Zakelijke Events",
      vanaf: "Vanaf",
      perPersoon: "per persoon",
      bookNow: "Direct Boeken",
      getQuote: "Offerte Aanvragen",
    },
  },
  validatePricingCardProps: () => ({ isValid: true }),
  calculateFinalPrice: (serviceType: string, tier: string) => {
    const basePrice = 12.5; // corporate
    const multiplier = tier === "premium" ? 1.4 : 1.0;
    return basePrice * multiplier;
  },
  COMMON_STYLES: {
    card: "shadow-elegant-soft border-2",
  },
}));

describe("V5 Interactive Elegance Integration", () => {
  describe("PricingCardEnhanced", () => {
    it("should render with €12.50/person corporate pricing", async () => {
      const mockOnBookNow = vi.fn();

      render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="basis"
          onBookNow={mockOnBookNow}
          language="nl"
          variant="urgency"
        />,
      );

      // Check if the €12.50 pricing is displayed
      await waitFor(() => {
        expect(screen.getByText(/€12\.50/)).toBeInTheDocument();
      });

      // Check if corporate service type is shown
      expect(screen.getByText("Zakelijke Events")).toBeInTheDocument();

      // Check if per person text is shown
      expect(screen.getByText("per persoon")).toBeInTheDocument();
    });

    it("should display urgency timer variant correctly", async () => {
      const mockOnBookNow = vi.fn();

      render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="basis"
          onBookNow={mockOnBookNow}
          variant="urgency"
        />,
      );

      // Check if countdown timer is displayed
      await waitFor(() => {
        const timer = screen.getByTestId("countdown-timer");
        expect(timer).toBeInTheDocument();
      });

      // Check if urgency text is displayed
      expect(screen.getByText(/Beperkte Tijd/)).toBeInTheDocument();
    });

    it("should handle premium tier pricing correctly", async () => {
      const mockOnBookNow = vi.fn();

      render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="premium"
          onBookNow={mockOnBookNow}
        />,
      );

      // Premium tier should show €17.50 (12.5 * 1.4)
      await waitFor(() => {
        expect(screen.getByText(/€17\.50/)).toBeInTheDocument();
      });

      // Should show popular choice badge for premium
      expect(screen.getByText(/Populaire Keuze/)).toBeInTheDocument();
    });

    it("should trigger booking callback when CTA is clicked", async () => {
      const mockOnBookNow = vi.fn();

      render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="basis"
          onBookNow={mockOnBookNow}
        />,
      );

      // Find and click the booking button
      const bookingButton = screen.getByTestId("conversion-cta");
      fireEvent.click(bookingButton);

      expect(mockOnBookNow).toHaveBeenCalledWith("corporate", "basis");
    });

    it("should apply V5 animation classes correctly", () => {
      const mockOnBookNow = vi.fn();

      render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="basis"
          onBookNow={mockOnBookNow}
        />,
      );

      // Check if card has the V5 slide-up animation class
      const card = screen
        .getByTestId("countdown-timer")
        .closest('[class*="animate-interactive-slide-up"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe("InteractiveMenuSystem Integration", () => {
    it("should render menu system without errors", () => {
      const mockOnBack = vi.fn();

      render(<InteractiveMenuSystem onBack={mockOnBack} />);

      // Check if interactive menu header is present
      expect(screen.getByText("Interactieve Menukaart")).toBeInTheDocument();

      // Check if category navigation is present
      expect(screen.getByText("Soepen & Warme Happen")).toBeInTheDocument();
    });

    it("should handle category switching properly", async () => {
      const mockOnBack = vi.fn();

      render(<InteractiveMenuSystem onBack={mockOnBack} />);

      // Click on hapjes category
      const hapjesButton = screen.getByText("Ambachtelijke Hapjes");
      fireEvent.click(hapjesButton);

      // Should show hapjes content
      await waitFor(() => {
        expect(screen.getByText("Ambachtelijke Kaasplank")).toBeInTheDocument();
      });
    });

    it("should handle back navigation", () => {
      const mockOnBack = vi.fn();

      render(<InteractiveMenuSystem onBack={mockOnBack} />);

      // Click back button
      const backButton = screen.getByText("Terug naar Overzicht");
      fireEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  describe("V5 Animation System", () => {
    it("should apply correct V5 animation classes to components", () => {
      const mockOnBookNow = vi.fn();

      render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="basis"
          onBookNow={mockOnBookNow}
          variant="social-proof"
        />,
      );

      // Check if social proof variant has slide-up animation
      const socialProofElement = screen.getByText(/mensen bekijken dit nu/);
      const parentElement = socialProofElement.closest(
        '[class*="animate-interactive-slide-up"]',
      );
      expect(parentElement).toBeInTheDocument();
    });

    it("should handle hover animations correctly", async () => {
      const mockOnBookNow = vi.fn();

      render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="basis"
          onBookNow={mockOnBookNow}
        />,
      );

      // Find the main card element
      const card = screen
        .getByTestId("countdown-timer")
        .closest('[class*="transition-all"]');

      if (card) {
        // Simulate hover
        fireEvent.mouseEnter(card);

        await waitFor(() => {
          // Should have hover effects applied
          expect(card).toHaveClass(/hover:scale-105|hover:-translate-y-2/);
        });

        // Simulate mouse leave
        fireEvent.mouseLeave(card);
      }
    });
  });
});
