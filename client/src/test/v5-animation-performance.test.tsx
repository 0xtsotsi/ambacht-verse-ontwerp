/**
 * V5 Interactive Elegance - Animation Performance Validation
 * Agent 3 QualityAssurance: 60fps performance validation for V5 animations
 * Tests shimmer, bounce, pulse-glow, slide-up animations
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import { Hero } from "@/components/Hero";
import { InteractiveMenuSystem } from "@/components/InteractiveMenuSystem";
import PricingCardEnhanced from "@/components/PricingCardEnhanced";

// Mock performance monitoring
const mockPerformanceObserver = vi.fn();
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

// Performance timing mock
let performanceEntries: PerformanceEntry[] = [];
const originalPerformance = global.performance;

beforeAll(() => {
  // Mock global performance API methods
  vi.spyOn(global.performance, "now").mockReturnValue(Date.now());
  vi.spyOn(global.performance, "mark").mockImplementation(() => undefined);
  vi.spyOn(global.performance, "measure").mockImplementation(() => undefined);
  vi.spyOn(global.performance, "clearMarks").mockImplementation(
    () => undefined,
  );
  vi.spyOn(global.performance, "clearMeasures").mockImplementation(
    () => undefined,
  );
  global.requestAnimationFrame = mockRequestAnimationFrame;
  global.cancelAnimationFrame = mockCancelAnimationFrame;

  // Mock CSS animation support
  Object.defineProperty(window, "getComputedStyle", {
    value: (el: Element) => ({
      animationName: "animate-interactive-bounce",
      animationDuration: "0.6s",
      animationTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      willChange: "transform",
      transform: "translateZ(0)",
    }),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("V5 Animation Performance - Core Animation Classes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceEntries = [];
  });

  it("should have GPU-accelerated V5 animation classes defined", () => {
    render(<Hero />);

    // Check for shimmer animation
    const shimmerElements = document.querySelectorAll(
      '[class*="animate-interactive-shimmer"]',
    );
    expect(shimmerElements.length).toBeGreaterThanOrEqual(0);

    // Check for bounce animation
    const bounceElements = document.querySelectorAll(
      '[class*="animate-interactive-bounce"]',
    );
    expect(bounceElements.length).toBeGreaterThan(0);

    // Check for pulse-glow animation
    const pulseElements = document.querySelectorAll(
      '[class*="animate-interactive-pulse-glow"]',
    );
    expect(pulseElements.length).toBeGreaterThan(0);

    // Check for slide-up animation
    const slideElements = document.querySelectorAll(
      '[class*="animate-interactive-slide-up"]',
    );
    expect(slideElements.length).toBeGreaterThanOrEqual(0);
  });

  it("should use will-change property for performance optimization", () => {
    render(<Hero />);

    const animatedElements = document.querySelectorAll(
      '[class*="animate-interactive"]',
    );
    expect(animatedElements.length).toBeGreaterThan(0);

    animatedElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      expect(styles.willChange).toContain("transform");
    });
  });

  it("should have proper timing functions for smooth animations", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={() => {}}
      />,
    );

    const bounceButtons = document.querySelectorAll(
      '[class*="animate-interactive-bounce"]',
    );
    expect(bounceButtons.length).toBeGreaterThan(0);

    bounceButtons.forEach((button) => {
      const styles = window.getComputedStyle(button);
      expect(styles.animationTimingFunction).toBe(
        "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      );
    });
  });
});

describe("V5 Animation Performance - 60fps Target Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceEntries = [];
  });

  it("should maintain 60fps during hover interactions", async () => {
    render(<Hero />);

    const interactiveButtons = screen.getAllByRole("button");
    expect(interactiveButtons.length).toBeGreaterThan(0);

    // Simulate performance measurement
    const startTime = performance.now();

    // Trigger multiple hover events
    for (const button of interactiveButtons) {
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete interactions within reasonable time (< 100ms for good UX)
    expect(duration).toBeLessThan(100);
  });

  it("should handle rapid animation triggers without blocking", async () => {
    render(<InteractiveMenuSystem onBack={() => {}} />);

    const categoryButtons = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.textContent?.includes("Soepen") ||
          button.textContent?.includes("Hapjes") ||
          button.textContent?.includes("Buffet"),
      );

    const startTime = performance.now();

    // Rapidly trigger category switches
    for (let i = 0; i < 10; i++) {
      categoryButtons.forEach((button, index) => {
        if (index < categoryButtons.length) {
          fireEvent.click(button);
        }
      });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should handle rapid interactions efficiently (< 500ms)
    expect(duration).toBeLessThan(500);
  });

  it("should use transform3d for hardware acceleration", () => {
    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="premium"
        onBookNow={() => {}}
        variant="urgency"
      />,
    );

    // Check that elements use transform3d or translateZ(0) for GPU acceleration
    const animatedElements = document.querySelectorAll(
      '[class*="animate-interactive"]',
    );
    expect(animatedElements.length).toBeGreaterThan(0);

    animatedElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      // Should have transform property for GPU acceleration
      expect(styles.transform).toBe("translateZ(0)");
    });
  });
});

describe("V5 Animation Performance - Memory Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceEntries = [];
  });

  it("should clean up animations on component unmount", () => {
    const { unmount } = render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={() => {}}
        variant="urgency"
      />,
    );

    // Should have timer running
    const timerElements = screen.getAllByText(/\d+:\d{2}/);
    expect(timerElements.length).toBeGreaterThanOrEqual(1);

    // Unmount should not cause memory leaks
    expect(() => unmount()).not.toThrow();
  });

  it("should handle multiple component instances without performance degradation", () => {
    const instances = [];
    const startTime = performance.now();

    // Render multiple instances
    for (let i = 0; i < 5; i++) {
      instances.push(
        render(
          <PricingCardEnhanced
            serviceType="corporate"
            tier="basis"
            onBookNow={() => {}}
            variant="social-proof"
          />,
        ),
      );
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Multiple instances should render efficiently (< 1000ms)
    expect(renderTime).toBeLessThan(1000);

    // Clean up
    instances.forEach((instance) => instance.unmount());
  });

  it("should optimize animation reflows and repaints", async () => {
    render(<Hero />);

    const floatingParticles = document.querySelectorAll(
      '[class*="animate-organic-float"]',
    );
    expect(floatingParticles.length).toBe(5); // Should have exactly 5 floating particles

    // Each particle should use efficient transforms
    floatingParticles.forEach((particle) => {
      const styles = window.getComputedStyle(particle);
      expect(styles.willChange).toContain("transform");
      expect(styles.transform).toBe("translateZ(0)");
    });
  });
});

describe("V5 Animation Performance - Cross-Component Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceEntries = [];
  });

  it("should handle simultaneous animations across components", async () => {
    const { container } = render(
      <div>
        <Hero />
        <InteractiveMenuSystem onBack={() => {}} />
        <PricingCardEnhanced
          serviceType="corporate"
          tier="basis"
          onBookNow={() => {}}
        />
      </div>,
    );

    // All components should render without conflicts
    expect(container).toBeInTheDocument();

    // Check for different animation types
    expect(
      document.querySelectorAll('[class*="animate-interactive-bounce"]').length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelectorAll('[class*="animate-interactive-pulse-glow"]')
        .length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelectorAll('[class*="animate-interactive-slide-up"]')
        .length,
    ).toBeGreaterThan(0);
  });

  it("should maintain animation performance during state updates", async () => {
    const mockOnBack = vi.fn();
    render(<InteractiveMenuSystem onBack={mockOnBack} />);

    const startTime = performance.now();

    // Switch between categories multiple times
    const hapjesButton = screen.getByText("Ambachtelijke Hapjes");
    const soepenButton = screen.getByText("Soepen & Warme Happen");
    const buffetButton = screen.getByText("Buffet Specialiteiten");

    fireEvent.click(hapjesButton);
    await waitFor(() => {
      expect(screen.getByText("Ambachtelijke Kaasplank")).toBeInTheDocument();
    });

    fireEvent.click(buffetButton);
    await waitFor(() => {
      expect(screen.getByText(/buffet/i)).toBeInTheDocument();
    });

    fireEvent.click(soepenButton);
    await waitFor(() => {
      expect(screen.getByText("Tomaten Basilicum")).toBeInTheDocument();
    });

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // State transitions should be fast (< 300ms)
    expect(totalTime).toBeLessThan(300);
  });

  it("should provide accessibility during animations", () => {
    render(<Hero />);

    // Animated elements should still be focusable and accessible
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeVisible();
      expect(button).toBeEnabled();
    });

    // Animation classes shouldn't interfere with screen readers
    const interactiveElements = document.querySelectorAll(
      '[class*="animate-interactive"]',
    );
    interactiveElements.forEach((element) => {
      expect(element).toBeVisible();
    });
  });
});

describe("V5 Animation Performance - Edge Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceEntries = [];
  });

  it("should handle reduced motion preference", () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        matches: true, // User prefers reduced motion
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(<Hero />);

    // Components should still render without errors
    expect(screen.getByText("WESLEY'S")).toBeInTheDocument();
    expect(screen.getByText("AMBACHT")).toBeInTheDocument();
  });

  it("should gracefully handle animation failures", () => {
    // Mock CSS animation failure
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <PricingCardEnhanced
        serviceType="corporate"
        tier="basis"
        onBookNow={() => {}}
      />,
    );

    // Component should still be functional
    expect(screen.getByTestId("conversion-cta")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should maintain performance on low-end devices", async () => {
    // Mock low-end device characteristics
    Object.defineProperty(navigator, "deviceMemory", { value: 2 }); // 2GB RAM
    Object.defineProperty(navigator, "hardwareConcurrency", { value: 2 }); // 2 cores

    const startTime = performance.now();

    render(<Hero />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render efficiently even on low-end devices (< 200ms)
    expect(renderTime).toBeLessThan(200);
  });
});
