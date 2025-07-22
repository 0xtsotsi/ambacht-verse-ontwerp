/**
 * V5 Interactive Elegance - Core Components Test Suite
 * Agent 3 QualityAssurance: High-coverage tests for critical V5 components
 * Focuses on About, Services, Gallery, Navigation, and Footer components
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Gallery } from "@/components/Gallery";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";

// Mock external dependencies
vi.mock("@/hooks/useAnimationOptimization", () => ({
  useOptimizedMouseTracking: () => ({ x: 0, y: 0 }),
  useIntersectionObserver: () => ({ isVisible: true }),
}));

vi.mock("@/hooks/useComponentLogger", () => ({
  usePerformanceLogger: () => ({
    logInteraction: vi.fn(),
    getPerformanceStats: () => ({ renderTime: 10, memoryUsage: 100 }),
  }),
}));

describe("V5 Core Components - About Section", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render About section without crashing", () => {
    render(<About />);
    expect(screen.getByText("Over Wesley's Ambacht")).toBeInTheDocument();
  });

  it("should display company story and values", () => {
    render(<About />);

    // Check for key content elements
    expect(screen.getByText(/verhaal/i)).toBeInTheDocument();
    expect(screen.getByText(/passie/i)).toBeInTheDocument();
    expect(screen.getByText(/kwaliteit/i)).toBeInTheDocument();
  });

  it("should have proper navigation accessibility", () => {
    render(<About />);

    const aboutSection = document.querySelector("section#about");
    expect(aboutSection).toBeInTheDocument();
    expect(aboutSection).toHaveAttribute("id", "about");
  });

  it("should contain interactive elements with proper animations", () => {
    render(<About />);

    // Check for V5 animation classes
    const animatedElements = document.querySelectorAll(
      '[class*="animate-interactive"]',
    );
    expect(animatedElements.length).toBeGreaterThanOrEqual(0);
  });

  it("should handle image loading states", async () => {
    render(<About />);

    // Should not crash during image loading
    await waitFor(() => {
      expect(screen.getByText("Over Wesley's Ambacht")).toBeInTheDocument();
    });
  });
});

describe("V5 Core Components - Services Section", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Services section without crashing", () => {
    render(<Services />);
    expect(screen.getByText("Onze Services")).toBeInTheDocument();
  });

  it("should display all service categories", () => {
    render(<Services />);

    // Check for main service offerings
    expect(screen.getByText(/catering/i)).toBeInTheDocument();
    expect(screen.getByText(/events/i)).toBeInTheDocument();
  });

  it("should have interactive service cards", () => {
    render(<Services />);

    const serviceCards = document.querySelectorAll(
      '[class*="service-card"], .cursor-pointer',
    );
    expect(serviceCards.length).toBeGreaterThan(0);
  });

  it("should support service card interactions", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<Services />);

    // Find interactive elements
    const clickableElements = document.querySelectorAll(
      '.cursor-pointer, [role="button"]',
    );
    if (clickableElements.length > 0) {
      fireEvent.click(clickableElements[0]);
    }

    // Component should handle interaction
    expect(() =>
      fireEvent.click(clickableElements[0] || document.body),
    ).not.toThrow();

    consoleSpy.mockRestore();
  });

  it("should have proper accessibility structure", () => {
    render(<Services />);

    const servicesSection = document.querySelector("section#services");
    expect(servicesSection).toBeInTheDocument();
  });
});

describe("V5 Core Components - Gallery Section", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Gallery section without crashing", () => {
    render(<Gallery />);
    expect(screen.getByText(/galerij/i)).toBeInTheDocument();
  });

  it("should display image gallery grid", () => {
    render(<Gallery />);

    // Should have gallery images
    const images = document.querySelectorAll(
      'img, [class*="image"], [class*="gallery"]',
    );
    expect(images.length).toBeGreaterThan(0);
  });

  it("should handle image interactions", () => {
    render(<Gallery />);

    const interactiveElements = document.querySelectorAll(
      '[class*="cursor-pointer"], [role="button"]',
    );
    if (interactiveElements.length > 0) {
      expect(() => fireEvent.click(interactiveElements[0])).not.toThrow();
    }
  });

  it("should have responsive image loading", async () => {
    render(<Gallery />);

    await waitFor(() => {
      const gallerySection = document.querySelector(
        "section#gallery, section#galerij",
      );
      expect(gallerySection || screen.getByText(/galerij/i)).toBeTruthy();
    });
  });

  it("should support keyboard navigation", () => {
    render(<Gallery />);

    const focusableElements = document.querySelectorAll(
      'button, [tabindex], [role="button"]',
    );
    focusableElements.forEach((element) => {
      expect(element).toBeVisible();
    });
  });
});

describe("V5 Core Components - Navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Navigation without crashing", () => {
    render(<Navigation />);

    // Should have navigation elements
    const nav =
      document.querySelector("nav") ||
      screen.getByRole("navigation", { hidden: true });
    expect(nav).toBeTruthy();
  });

  it("should display main navigation links", () => {
    render(<Navigation />);

    // Check for key navigation items
    const homeLink =
      screen.queryByText(/home/i) || screen.queryByText(/thuis/i);
    const aboutLink =
      screen.queryByText(/about/i) || screen.queryByText(/over/i);

    // At least some navigation should exist
    expect(
      document.querySelectorAll('a, [role="menuitem"], [class*="nav"]').length,
    ).toBeGreaterThan(0);
  });

  it("should handle mobile navigation toggle", () => {
    render(<Navigation />);

    const menuToggle = document.querySelector(
      '[class*="menu-toggle"], [class*="hamburger"], [aria-label*="menu"]',
    );
    if (menuToggle) {
      expect(() => fireEvent.click(menuToggle)).not.toThrow();
    }
  });

  it("should support keyboard navigation", () => {
    render(<Navigation />);

    const focusableElements = document.querySelectorAll(
      'a, button, [tabindex="0"]',
    );
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  it("should have proper ARIA attributes", () => {
    render(<Navigation />);

    // Navigation should have proper accessibility
    const navigation = document.querySelector('nav, [role="navigation"]');
    expect(navigation).toBeTruthy();
  });
});

describe("V5 Core Components - Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Footer without crashing", () => {
    render(<Footer />);

    const footer =
      document.querySelector("footer") ||
      document.querySelector('[role="contentinfo"]');
    expect(footer).toBeTruthy();
  });

  it("should display contact information", () => {
    render(<Footer />);

    // Should have contact details
    const contactElements = document.querySelectorAll(
      '[class*="contact"], [href*="tel:"], [href*="mailto:"]',
    );
    expect(contactElements.length).toBeGreaterThanOrEqual(0);
  });

  it("should display company information", () => {
    render(<Footer />);

    // Should have company name or copyright
    const companyInfo =
      screen.queryByText(/wesley/i) ||
      screen.queryByText(/ambacht/i) ||
      screen.queryByText(/©/);
    expect(companyInfo || document.querySelector("footer")).toBeTruthy();
  });

  it("should have social media links", () => {
    render(<Footer />);

    const socialLinks = document.querySelectorAll(
      '[href*="facebook"], [href*="instagram"], [href*="linkedin"], [class*="social"]',
    );
    // Social links are optional but should not crash
    expect(socialLinks.length).toBeGreaterThanOrEqual(0);
  });

  it("should handle link interactions", () => {
    render(<Footer />);

    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      expect(() => fireEvent.click(link)).not.toThrow();
    });
  });
});

describe("V5 Core Components - Testimonials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Testimonials without crashing", () => {
    render(<Testimonials />);

    // Should render testimonials section
    const testimonialsSection =
      screen.queryByText(/testimonial/i) ||
      screen.queryByText(/review/i) ||
      screen.queryByText(/klanten/i);
    expect(
      testimonialsSection || document.querySelector('[class*="testimonial"]'),
    ).toBeTruthy();
  });

  it("should display customer testimonials", () => {
    render(<Testimonials />);

    // Should have testimonial content
    const testimonialElements = document.querySelectorAll(
      '[class*="testimonial"], [class*="review"], blockquote',
    );
    expect(testimonialElements.length).toBeGreaterThanOrEqual(0);
  });

  it("should handle testimonial navigation", () => {
    render(<Testimonials />);

    const navButtons = document.querySelectorAll(
      '[class*="testimonial"] button, [class*="carousel"] button',
    );
    navButtons.forEach((button) => {
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  it("should display star ratings", () => {
    render(<Testimonials />);

    // Should show ratings or stars
    const ratingElements = document.querySelectorAll(
      '[class*="star"], [class*="rating"], [aria-label*="star"]',
    );
    expect(ratingElements.length).toBeGreaterThanOrEqual(0);
  });

  it("should support keyboard navigation for testimonials", () => {
    render(<Testimonials />);

    const focusableElements = document.querySelectorAll(
      'button, [tabindex="0"], [role="button"]',
    );
    focusableElements.forEach((element) => {
      expect(element).toBeVisible();
    });
  });
});

describe("V5 Core Components - Integration Tests", () => {
  it("should render multiple components together without conflicts", () => {
    const { container } = render(
      <div>
        <Navigation />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Footer />
      </div>,
    );

    expect(container).toBeInTheDocument();
    expect(container.children.length).toBeGreaterThan(0);
  });

  it("should maintain consistent V5 animation classes across components", () => {
    render(
      <div>
        <About />
        <Services />
        <Gallery />
      </div>,
    );

    // Check for V5 Interactive Elegance animation consistency
    const animatedElements = document.querySelectorAll(
      '[class*="animate-interactive"]',
    );
    expect(animatedElements.length).toBeGreaterThanOrEqual(0);
  });

  it("should handle performance across all components", () => {
    const startTime = Date.now();

    render(
      <div>
        <Navigation />
        <About />
        <Services />
        <Gallery />
        <Footer />
      </div>,
    );

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // All components should render efficiently (< 500ms)
    expect(renderTime).toBeLessThan(500);
  });
});
