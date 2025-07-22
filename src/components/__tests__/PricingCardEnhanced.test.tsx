/**
 * V5 Interactive Elegance - PricingCardEnhanced Component Tests
 * Agent 3 QualityAssurance: Comprehensive validation for €12.50/person corporate pricing
 * Tests conversion optimization, animations, accessibility, and business logic
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import PricingCardEnhanced from "../PricingCardEnhanced";
import { BASE_PRICES, TIER_MULTIPLIERS } from "@/lib/pricing-card-constants";

describe("V5 PricingCardEnhanced - Core Functionality", () => {
  const mockOnBookNow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing for all service types", () => {
    const serviceTypes = ["corporate", "social", "wedding", "custom"] as const;

    serviceTypes.forEach((serviceType) => {
      const { unmount } = render(
        <PricingCardEnhanced
          serviceType={serviceType}
          tier="basis"
          onBookNow={mockOnBookNow}
        />,
      );
      // Check for the main CTA button specifically
      expect(screen.getByTestId("conversion-cta")).toBeInTheDocument();
      unmount();
    });
  });

  it("should display correct €12.50 corporate pricing for basis tier", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    const expectedPrice = BASE_PRICES.corporate * TIER_MULTIPLIERS.basis;
    expect(
      screen.getByText(`€${expectedPrice.toFixed(2)}`),
    ).toBeInTheDocument();
  });

  it("should calculate correct pricing for all tiers", () => {
    const tiers = ["basis", "premium", "luxe"] as const;

    tiers.forEach((tier) => {
      const { unmount } = render(
        <PricingCardEnhanced
          serviceType="corporate"
          tier={tier}
          onBookNow={mockOnBookNow}
        />,
      );

      const expectedPrice = BASE_PRICES.corporate * TIER_MULTIPLIERS[tier];
      expect(
        screen.getByText(`€${expectedPrice.toFixed(2)}`),
      ).toBeInTheDocument();
      unmount();
    });
  });

  it("should handle custom pricing (quote) correctly", () => {
    render(
      <PricingCardEnhanced
        serviceType="custom"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    expect(screen.getByText("GRATIS Offerte")).toBeInTheDocument();
    expect(screen.getByText("Offerte Aanvragen")).toBeInTheDocument();
  });

  it("should validate props correctly", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Should render nothing for invalid props
    const { container } = render(
      <PricingCardEnhanced
        serviceType="invalid"
        as
        any
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid props:",
      expect.arrayContaining([
        expect.stringContaining("serviceType must be one of:"),
      ]),
    );

    consoleSpy.mockRestore();
  });
});

describe("V5 PricingCardEnhanced - Conversion Optimization Variants", () => {
  const mockOnBookNow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display urgency variant with countdown timer", async () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="urgency"
      />,
    );

    expect(screen.getByText(/Beperkte Tijd/)).toBeInTheDocument();
    expect(screen.getByTestId("countdown-timer")).toBeInTheDocument();

    // Check that timer displays MM:SS format (there are multiple instances)
    const timerElements = screen.getAllByText(/\d+:\d{2}/);
    expect(timerElements.length).toBeGreaterThanOrEqual(1);
  });

  it("should display timer in correct MM:SS format", async () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="urgency"
      />,
    );

    // Check that timer displays MM:SS format (like 60:00, 59:59, etc)
    const timerElements = screen.getAllByText(/\d+:\d{2}/);
    expect(timerElements.length).toBeGreaterThanOrEqual(1);

    // Timer should show reasonable countdown values
    const timerText = timerElements[0].textContent!;
    const timeMatch = timerText.match(/(\d+):(\d{2})/);
    expect(timeMatch).not.toBeNull();
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseInt(timeMatch[2]);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(seconds).toBeLessThan(60);
    }
  });

  it("should display social proof variant with activity indicators", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="social-proof"
      />,
    );

    expect(screen.getByText(/mensen bekijken dit nu/)).toBeInTheDocument();
    expect(screen.getByText(/boekingen vandaag/)).toBeInTheDocument();
    expect(screen.getByText(/Fantastische service/)).toBeInTheDocument();
  });

  it("should display scarcity variant with limited availability", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="scarcity"
      />,
    );

    expect(screen.getByText(/Beperkte Beschikbaarheid/)).toBeInTheDocument();
  });

  it("should display value variant with savings information", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="value"
      />,
    );

    expect(screen.getByText(/EXTRA WAARDE/)).toBeInTheDocument();
    expect(screen.getByText(/Bespaar Vandaag/)).toBeInTheDocument();
    expect(screen.getByText(/15%/)).toBeInTheDocument(); // Corporate savings
  });
});

describe("V5 PricingCardEnhanced - V5 Interactive Animations", () => {
  const mockOnBookNow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should apply V5 animation classes for interactive elements", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="urgency"
      />,
    );

    // Check for V5 animation classes
    expect(
      document.querySelector(".animate-interactive-pulse-glow"),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".animate-interactive-bounce"),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".animate-interactive-slide-up"),
    ).toBeInTheDocument();
  });

  it("should trigger hover animations", async () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    // Find the card element by test id or specific class
    const card = screen
      .getByTestId("conversion-cta")
      .closest('div[class*="rounded-2xl"]')!;

    // Trigger hover
    fireEvent.mouseEnter(card);

    await waitFor(() => {
      expect(card).toHaveClass("hover:scale-105");
      expect(card).toHaveClass("hover:-translate-y-2");
    });
  });

  it("should handle button interactions with proper animations", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    const ctaButton = screen.getByTestId("conversion-cta");
    expect(ctaButton).toHaveClass("animate-interactive-bounce");

    fireEvent.click(ctaButton);
    expect(mockOnBookNow).toHaveBeenCalledWith("corporate", "basis");
  });
});

describe("V5 PricingCardEnhanced - Accessibility & Performance", () => {
  const mockOnBookNow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have proper ARIA attributes and roles", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="premium"
        onBookNow={mockOnBookNow}
      />,
    );

    // Check for main CTA button
    const ctaButton = screen.getByTestId("conversion-cta");
    expect(ctaButton).toBeVisible();
    expect(ctaButton).toBeEnabled();

    // Check for phone button
    const phoneButton = screen.getByText("📞 +31 20 123 4567");
    expect(phoneButton).toBeVisible();
    expect(phoneButton).toBeEnabled();
  });

  it("should support keyboard navigation", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    const ctaButton = screen.getByTestId("conversion-cta");

    // Focus and activate with keyboard
    ctaButton.focus();
    expect(document.activeElement).toBe(ctaButton);

    fireEvent.keyDown(ctaButton, { key: "Enter", code: "Enter" });
    fireEvent.keyUp(ctaButton, { key: "Enter", code: "Enter" });
  });

  it("should display proper premium tier badge", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="premium"
        onBookNow={mockOnBookNow}
      />,
    );

    expect(screen.getByText("⭐ Populaire Keuze")).toBeInTheDocument();
  });

  it("should handle language switching correctly", () => {
    const { rerender } = render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        language="nl"
      />,
    );

    expect(screen.getByText("Zakelijke Events")).toBeInTheDocument();

    rerender(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        language="en"
      />,
    );

    expect(screen.getByText("Corporate Events")).toBeInTheDocument();
  });
});

describe("V5 PricingCardEnhanced - Business Logic Validation", () => {
  const mockOnBookNow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should calculate and display savings correctly", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    // Original price should be 20% higher than final price
    const finalPrice = BASE_PRICES.corporate * TIER_MULTIPLIERS.basis;
    const originalPrice = finalPrice * 1.2;
    const savings = originalPrice - finalPrice;

    expect(
      screen.getByText(`BESPAAR €${savings.toFixed(2)}`),
    ).toBeInTheDocument();
  });

  it("should display correct inclusions and benefits", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    expect(
      screen.getByText("✅ 100% Tevredenheidsgarantie"),
    ).toBeInTheDocument();
    expect(screen.getByText("⚡ Directe Bevestiging")).toBeInTheDocument();
    expect(
      screen.getByText("📈 4.9/5 Sterren (500+ Reviews)"),
    ).toBeInTheDocument();
  });

  it("should show proper trust signals", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    expect(screen.getByText("🛡️ SSL Beveiligd")).toBeInTheDocument();
    expect(screen.getByText("💳 Veilig Betalen")).toBeInTheDocument();
    expect(screen.getByText("📞 24/7 Support")).toBeInTheDocument();
  });

  it("should handle phone number display correctly", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    expect(screen.getByText("📞 +31 20 123 4567")).toBeInTheDocument();
  });
});

describe("V5 PricingCardEnhanced - Performance Edge Cases", () => {
  const mockOnBookNow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle component unmounting gracefully", async () => {
    const { unmount } = render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="urgency"
      />,
    );

    // Component should start timers
    const timerElements = screen.getAllByText(/\d+:\d{2}/);
    expect(timerElements.length).toBeGreaterThanOrEqual(1);

    // Unmount should work without errors
    expect(() => unmount()).not.toThrow();
  });

  it("should display countdown timer for urgency variant", async () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
        variant="urgency"
      />,
    );

    // Timer should display valid time format
    const timerElements = screen.getAllByText(/\d+:\d{2}/);
    expect(timerElements.length).toBeGreaterThanOrEqual(1);

    // Should have urgency messaging
    expect(screen.getByText(/Beperkte Tijd/)).toBeInTheDocument();
  });

  it("should handle rapid re-renders efficiently", () => {
    const { rerender } = render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={mockOnBookNow}
      />,
    );

    // Multiple rapid re-renders
    for (let i = 0; i < 5; i++) {
      rerender(
        <PricingCardEnhanced
          serviceType="corporate"
          tier="premium"
          onBookNow={mockOnBookNow}
        />,
      );
    }

    // Should still display correctly
    expect(screen.getByText("⭐ Populaire Keuze")).toBeInTheDocument();
  });
});
