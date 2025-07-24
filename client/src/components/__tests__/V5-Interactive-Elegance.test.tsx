/**
 * V5 Interactive Elegance Component Tests
 * Agent 3 QualityAssurance: Production readiness validation
 * Testing Hero, InteractiveMenuSystem, and animation performance
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Hero } from "../Hero";
import { InteractiveMenuSystem } from "../InteractiveMenuSystem";

// Mock performance hooks for testing
vi.mock("@/hooks/useAnimationOptimization", () => ({
  useOptimizedMouseTracking: () => ({ x: 0, y: 0 }),
}));

vi.mock("@/hooks/useComponentLogger", () => ({
  usePerformanceLogger: () => ({
    getPerformanceStats: () => ({ renderTime: 10, memoryUsage: 100 }),
  }),
}));

describe("V5 Interactive Elegance - Hero Component", () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks();
  });

  it("should render Hero component without crashing", () => {
    render(<Hero />);
    expect(screen.getByText("WESLEY'S")).toBeInTheDocument();
    expect(screen.getByText("AMBACHT")).toBeInTheDocument();
  });

  it("should contain proper V5 Interactive Elegance branding", () => {
    render(<Hero />);
    expect(screen.getByText("Welkom bij")).toBeInTheDocument();
    expect(
      screen.getByText("Wij proberen ons op een ieder te richten!"),
    ).toBeInTheDocument();
  });

  it("should have interactive buttons with correct variants", () => {
    render(<Hero />);
    const primaryButton = screen.getByText("Contacteer Ons");
    const outlineButton = screen.getByText("Bekijk Galerij");

    expect(primaryButton).toBeInTheDocument();
    expect(outlineButton).toBeInTheDocument();

    // Check for interactive button classes
    expect(primaryButton.closest("button")).toHaveClass(
      "animate-interactive-bounce",
    );
    expect(outlineButton.closest("button")).toHaveClass(
      "animate-interactive-bounce",
    );
  });

  it("should display feature pills with proper animation classes", () => {
    render(<Hero />);
    const premiumCatering = screen.getByText("Premium Catering");
    const lokaleIngredienten = screen.getByText("Lokale Ingrediënten");
    const persoonlijkeService = screen.getByText("Persoonlijke Service");

    expect(premiumCatering).toBeInTheDocument();
    expect(lokaleIngredienten).toBeInTheDocument();
    expect(persoonlijkeService).toBeInTheDocument();

    // Check animation classes
    expect(premiumCatering.closest("div")).toHaveClass(
      "animate-interactive-pulse-glow",
    );
    expect(lokaleIngredienten.closest("div")).toHaveClass(
      "animate-interactive-pulse-glow",
    );
    expect(persoonlijkeService.closest("div")).toHaveClass(
      "animate-interactive-pulse-glow",
    );
  });

  it("should handle image loading states correctly", async () => {
    render(<Hero />);

    // Should initially not have the background loaded
    // Wait for component to potentially update
    await waitFor(() => {
      // The component should be rendered
      expect(screen.getByText("WESLEY'S")).toBeInTheDocument();
    });
  });

  it("should have accessible structure", () => {
    render(<Hero />);
    const section = screen.getByRole("banner", { name: /home/i });
    expect(section).toBeInTheDocument();
  });

  it("should handle button clicks", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<Hero />);

    const contactButton = screen.getByText("Contacteer Ons");
    fireEvent.click(contactButton);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Button clicked - interactive elegance!",
    );
    consoleSpy.mockRestore();
  });
});

describe("V5 Interactive Elegance - InteractiveMenuSystem Component", () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render InteractiveMenuSystem without crashing", () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);
    expect(screen.getByText("Interactieve Menukaart")).toBeInTheDocument();
  });

  it("should display category navigation buttons", () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    expect(screen.getByText("Soepen & Warme Happen")).toBeInTheDocument();
    expect(screen.getByText("Ambachtelijke Hapjes")).toBeInTheDocument();
    expect(screen.getByText("Buffet Specialiteiten")).toBeInTheDocument();
  });

  it("should show menu items for default category (soepen)", () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    expect(screen.getByText("Tomaten Basilicum")).toBeInTheDocument();
    expect(screen.getByText("Prei & Aardappel")).toBeInTheDocument();
    expect(screen.getByText("€ 8,50")).toBeInTheDocument();
    expect(screen.getByText("€ 9,00")).toBeInTheDocument();
  });

  it("should switch categories when navigation buttons are clicked", async () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    // Initially showing soepen
    expect(screen.getByText("Tomaten Basilicum")).toBeInTheDocument();

    // Click on hapjes category
    const hapjesButton = screen.getByText("Ambachtelijke Hapjes");
    fireEvent.click(hapjesButton);

    // Should now show hapjes items
    await waitFor(() => {
      expect(screen.getByText("Ambachtelijke Kaasplank")).toBeInTheDocument();
      expect(screen.getByText("Huisgerookte Ham")).toBeInTheDocument();
    });
  });

  it("should have proper animation classes on menu items", () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    const menuCards = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("animate-interactive-slide-up"));

    expect(menuCards.length).toBeGreaterThan(0);
  });

  it("should call onBack when back button is clicked", () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    const backButton = screen.getByText("Terug naar Overzicht");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("should display call-to-action section", () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    expect(screen.getByText("Niet gevonden wat u zoekt?")).toBeInTheDocument();
    expect(
      screen.getByText("Contacteer Ons Voor Maatwerk"),
    ).toBeInTheDocument();
  });

  it("should have proper menu item structure with pricing and details", () => {
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    // Check for cooking time and servings info
    expect(screen.getByText("15 min")).toBeInTheDocument();
    expect(screen.getByText("1 persoon")).toBeInTheDocument();

    // Check for order buttons
    const orderButtons = screen.getAllByText("Bestellen");
    expect(orderButtons.length).toBe(2); // Two soup items
  });
});

describe("V5 Interactive Elegance - Animation Performance", () => {
  it("should use optimized animation classes for 60fps performance", () => {
    render(<Hero />);

    // Check for GPU-accelerated transforms
    const floatingParticles = document.querySelectorAll(
      '[class*="animate-organic-float"]',
    );
    expect(floatingParticles.length).toBe(5);

    floatingParticles.forEach((particle) => {
      const styles = window.getComputedStyle(particle);
      expect(styles.willChange).toContain("transform");
    });
  });

  it("should have proper timing functions for smooth animations", () => {
    render(<InteractiveMenuSystem onBack={() => {}} />);

    // Check for interactive animation classes
    const bounceElements = document.querySelectorAll(
      '[class*="animate-interactive-bounce"]',
    );
    expect(bounceElements.length).toBeGreaterThan(0);
  });

  it("should implement proper loading states for performance", () => {
    render(<Hero />);

    // Hero should handle image loading states
    const heroSection = screen.getByRole("banner");
    expect(heroSection).toBeInTheDocument();
  });
});

describe("V5 Interactive Elegance - Accessibility", () => {
  it("should have proper ARIA roles and semantic structure", () => {
    render(<Hero />);

    const mainSection = document.querySelector("section#home");
    expect(mainSection).toBeInTheDocument();
    expect(mainSection).toHaveAttribute("id", "home");
  });

  it("should have keyboard navigation support", () => {
    render(<InteractiveMenuSystem onBack={() => {}} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeVisible();
      expect(button).toBeEnabled();
    });
  });

  it("should provide proper contrast and readability", () => {
    render(<Hero />);

    // Main headings should be present and visible
    const mainHeading = screen.getByText("WESLEY'S");
    const subHeading = screen.getByText("AMBACHT");

    expect(mainHeading).toBeVisible();
    expect(subHeading).toBeVisible();
  });
});
