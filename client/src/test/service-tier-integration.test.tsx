/**
 * Simple integration test to validate basic functionality
 * Quick validation without the full comprehensive test suite
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SERVICE_TIERS, SERVICE_CATEGORIES } from "@/lib/pricing-constants";

// Simple test to validate our constants are working
describe("Service Tier Constants Validation", () => {
  it("should have correct SERVICE_TIERS configuration", () => {
    expect(SERVICE_TIERS).toHaveLength(3);

    const essential = SERVICE_TIERS.find((t) => t.id === "essential");
    const premium = SERVICE_TIERS.find((t) => t.id === "premium");
    const luxury = SERVICE_TIERS.find((t) => t.id === "luxury");

    expect(essential?.priceMultiplier).toBe(0.85);
    expect(premium?.priceMultiplier).toBe(1.0);
    expect(luxury?.priceMultiplier).toBe(1.35);
  });

  it("should have valid SERVICE_CATEGORIES", () => {
    expect(SERVICE_CATEGORIES.length).toBeGreaterThan(0);

    SERVICE_CATEGORIES.forEach((category) => {
      expect(category.basePrice).toBeGreaterThan(0);
      expect(category.name).toBeTruthy();
      expect(category.features).toBeInstanceOf(Array);
    });
  });

  it("should calculate reasonable prices for all tier/category combinations", () => {
    SERVICE_CATEGORIES.forEach((category) => {
      SERVICE_TIERS.forEach((tier) => {
        const price = category.basePrice * tier.priceMultiplier;
        expect(price).toBeGreaterThan(0);
        expect(price).toBeLessThan(100); // Sanity check for per-person pricing
      });
    });
  });
});

// Simple component import test
describe("Component Import Validation", () => {
  it("should import ServiceTierSystem without errors", async () => {
    const { ServiceTierSystem } = await import(
      "@/components/ServiceTierSystem"
    );
    expect(ServiceTierSystem).toBeDefined();
  });

  it("should import sub-components without errors", async () => {
    const { ServiceTierMatrix } = await import(
      "@/components/ServiceTierMatrix"
    );
    const { ServiceTierComparison } = await import(
      "@/components/ServiceTierComparison"
    );
    const { ServiceTierCalculator } = await import(
      "@/components/ServiceTierCalculator"
    );

    expect(ServiceTierMatrix).toBeDefined();
    expect(ServiceTierComparison).toBeDefined();
    expect(ServiceTierCalculator).toBeDefined();
  });
});
