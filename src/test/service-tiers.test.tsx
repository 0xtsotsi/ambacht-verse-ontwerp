/**
 * Comprehensive test suite for Service Tiers System
 * Testing TDD implementation for task_002_2: Tiered Service Options
 * 
 * V5 Interactive Elegance Testing Requirements:
 * - Shimmer, bounce, pulse animations
 * - Terracotta color accents
 * - Interactive tier switching
 * - Performance tracking (<20ms renders)
 * - Component logging integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockProps, measurePerformance, checkAccessibility } from './setup';
import { SERVICE_TIERS, SERVICE_CATEGORIES } from '@/lib/pricing-constants';

// Mock the components we'll implement
vi.mock('@/components/ServiceTierMatrix', () => ({
  ServiceTierMatrix: ({ onTierChange, selectedTier, serviceCategory }: { 
    onTierChange: (tierId: string) => void; 
    selectedTier: string; 
    serviceCategory: { name: string; id: string }
  }) => (
    <div data-testid="service-tier-matrix">
      <h2>Service Tier Matrix</h2>
      <div data-testid="current-tier">{selectedTier}</div>
      <div data-testid="service-category">{serviceCategory.name}</div>
      {SERVICE_TIERS.map(tier => (
        <button
          key={tier.id}
          data-testid={`tier-${tier.id}`}
          onClick={() => onTierChange(tier.id)}
          className={selectedTier === tier.id ? 'selected' : ''}
        >
          {tier.name} - {tier.priceMultiplier}x
        </button>
      ))}
    </div>
  )
}));

vi.mock('@/components/ServiceTierComparison', () => ({
  ServiceTierComparison: ({ tiers, serviceCategory, selectedTier }: {
    tiers: Array<{ id: string; name: string; priceMultiplier: number; features: string[] }>;
    serviceCategory: { name: string; id: string };
    selectedTier: string;
  }) => (
    <div data-testid="service-tier-comparison">
      <h3>Tier Comparison</h3>
      {tiers.map((tier) => (
        <div key={tier.id} data-testid={`comparison-${tier.id}`} className={selectedTier === tier.id ? 'highlighted' : ''}>
          <span data-testid={`tier-name-${tier.id}`}>{tier.name}</span>
          <span data-testid={`tier-price-${tier.id}`}>
            €{(serviceCategory.basePrice * tier.priceMultiplier).toFixed(2)}
          </span>
          <ul>
            {tier.features.map((feature: string, index: number) => (
              <li key={index} data-testid={`feature-${tier.id}-${index}`}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}));

vi.mock('@/components/ServiceTierCalculator', () => ({
  ServiceTierCalculator: ({ tier, serviceCategory, guestCount, onPriceChange }: {
    tier: { priceMultiplier: number };
    serviceCategory: { basePrice: number };
    guestCount: number;
    onPriceChange?: (price: number) => void;
  }) => {
    const totalPrice = serviceCategory.basePrice * tier.priceMultiplier * guestCount;
    if (onPriceChange) onPriceChange(totalPrice);
    
    return (
      <div data-testid="service-tier-calculator">
        <div data-testid="base-price">€{serviceCategory.basePrice}</div>
        <div data-testid="multiplier">{tier.priceMultiplier}x</div>
        <div data-testid="guest-count">{guestCount} guests</div>
        <div data-testid="total-price">€{totalPrice.toFixed(2)}</div>
      </div>
    );
  }
}));

// Import the main component we'll implement
const ServiceTierSystem: React.ComponentType<{
  onTierChange: (tierId: string) => void;
  onPriceUpdate: (price: number) => void;
  initialServiceCategory: { name: string; id: string; basePrice: number };
  selectedTier?: string;
  guestCount?: number;
}> = ({ onTierChange, onPriceUpdate, initialServiceCategory }: {
  onTierChange: (tierId: string) => void;
  onPriceUpdate: (price: number) => void;
  initialServiceCategory: { name: string; id: string; basePrice: number };
  selectedTier?: string;
  guestCount?: number;
}) => (
  <div data-testid="service-tier-system">
    <div data-testid="not-implemented">Component not implemented yet</div>
  </div>
);

describe('ServiceTierSystem', () => {
  let mockOnTierChange: (tierId: string) => void;
  let mockOnPriceUpdate: (price: number) => void;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    mockOnTierChange = vi.fn();
    mockOnPriceUpdate = vi.fn();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);
      expect(screen.getByTestId('service-tier-system')).toBeInTheDocument();
    });

    it('should display all three service tiers', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);
      
      // Test that all tiers are displayed
      SERVICE_TIERS.forEach(tier => {
        expect(screen.getByText(tier.name)).toBeInTheDocument();
      });
    });

    it('should have default Essential tier selected', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);
      expect(screen.getByTestId('current-tier')).toHaveTextContent('essential');
    });
  });

  describe('Tier Selection Interaction', () => {
    it('should allow switching between tiers', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      // Click on Premium tier
      await user.click(screen.getByTestId('tier-premium'));
      expect(mockOnTierChange).toHaveBeenCalledWith('premium');

      // Click on Luxury tier
      await user.click(screen.getByTestId('tier-luxury'));
      expect(mockOnTierChange).toHaveBeenCalledWith('luxury');
    });

    it('should highlight selected tier visually', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      const premiumButton = screen.getByTestId('tier-premium');
      await user.click(premiumButton);

      expect(premiumButton).toHaveClass('selected');
    });
  });

  describe('Price Calculation', () => {
    it('should calculate correct prices for different tiers', () => {
      const serviceCategory = SERVICE_CATEGORIES[0]; // Corporate catering
      const guestCount = 50;

      SERVICE_TIERS.forEach(tier => {
        const props = createMockProps({
          onTierChange: mockOnTierChange,
          onPriceUpdate: mockOnPriceUpdate,
          initialServiceCategory: serviceCategory,
          selectedTier: tier.id,
          guestCount
        });

        render(<ServiceTierSystem {...props} />);
        
        const expectedPrice = serviceCategory.basePrice * tier.priceMultiplier * guestCount;
        expect(screen.getByTestId('total-price')).toHaveTextContent(`€${expectedPrice.toFixed(2)}`);
      });
    });

    it('should call onPriceUpdate when tier changes', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0],
        guestCount: 25
      });

      render(<ServiceTierSystem {...props} />);

      await user.click(screen.getByTestId('tier-luxury'));

      const expectedPrice = SERVICE_CATEGORIES[0].basePrice * SERVICE_TIERS[2].priceMultiplier * 25;
      expect(mockOnPriceUpdate).toHaveBeenCalledWith(expectedPrice);
    });
  });

  describe('Service Categories', () => {
    it('should work with different service categories', () => {
      SERVICE_CATEGORIES.forEach(category => {
        const props = createMockProps({
          onTierChange: mockOnTierChange,
          onPriceUpdate: mockOnPriceUpdate,
          initialServiceCategory: category
        });

        render(<ServiceTierSystem {...props} />);
        expect(screen.getByTestId('service-category')).toHaveTextContent(category.name);
      });
    });

    it('should recalculate prices when service category changes', () => {
      const initialCategory = SERVICE_CATEGORIES[0];
      const newCategory = SERVICE_CATEGORIES[1];
      const tier = SERVICE_TIERS[1]; // Premium
      const guestCount = 30;

      const { rerender } = render(
        <ServiceTierSystem
          onTierChange={mockOnTierChange}
          onPriceUpdate={mockOnPriceUpdate}
          initialServiceCategory={initialCategory}
          selectedTier={tier.id}
          guestCount={guestCount}
        />
      );

      // Initial price
      const initialPrice = initialCategory.basePrice * tier.priceMultiplier * guestCount;
      expect(screen.getByTestId('total-price')).toHaveTextContent(`€${initialPrice.toFixed(2)}`);

      // Change service category
      rerender(
        <ServiceTierSystem
          onTierChange={mockOnTierChange}
          onPriceUpdate={mockOnPriceUpdate}
          initialServiceCategory={newCategory}
          selectedTier={tier.id}
          guestCount={guestCount}
        />
      );

      const newPrice = newCategory.basePrice * tier.priceMultiplier * guestCount;
      expect(screen.getByTestId('total-price')).toHaveTextContent(`€${newPrice.toFixed(2)}`);
    });
  });

  describe('Tier Features Comparison', () => {
    it('should display features for each tier', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      SERVICE_TIERS.forEach(tier => {
        tier.features.forEach((feature, index) => {
          expect(screen.getByTestId(`feature-${tier.id}-${index}`)).toHaveTextContent(feature);
        });
      });
    });

    it('should highlight selected tier in comparison', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      await user.click(screen.getByTestId('tier-luxury'));
      
      expect(screen.getByTestId('comparison-luxury')).toHaveClass('highlighted');
    });
  });

  describe('Performance Requirements', () => {
    it('should render within performance threshold (< 20ms)', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      const renderTime = await measurePerformance(() => {
        render(<ServiceTierSystem {...props} />);
      });

      expect(renderTime).toBeLessThan(20);
    });

    it('should handle rapid tier switching without performance degradation', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      const rapidSwitching = async () => {
        for (let i = 0; i < 10; i++) {
          await user.click(screen.getByTestId('tier-premium'));
          await user.click(screen.getByTestId('tier-luxury'));
          await user.click(screen.getByTestId('tier-essential'));
        }
      };

      const switchingTime = await measurePerformance(rapidSwitching);
      expect(switchingTime).toBeLessThan(100); // Should complete rapid switching in under 100ms
    });
  });

  describe('V5 Interactive Elegance Features', () => {
    it('should have animation classes for shimmer, bounce, pulse', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      // Look for animation classes in the component
      const tierButtons = screen.getAllByRole('button');
      tierButtons.forEach(button => {
        const classes = button.className;
        // Should have at least one animation class
        expect(
          classes.includes('animate-shimmer') ||
          classes.includes('animate-bounce') ||
          classes.includes('animate-pulse') ||
          classes.includes('transition-') ||
          classes.includes('hover:')
        ).toBe(true);
      });
    });

    it('should use terracotta color accents', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      const container = screen.getByTestId('service-tier-system');
      const classes = container.className;
      
      // Should include terracotta colors or related styling
      expect(
        classes.includes('terracotta') ||
        classes.includes('bg-accent') ||
        classes.includes('text-accent') ||
        classes.includes('border-accent')
      ).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      // Tab through tier buttons
      await user.tab();
      expect(screen.getByTestId('tier-essential')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('tier-premium')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('tier-luxury')).toHaveFocus();
    });

    it('should have proper ARIA attributes', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      const tierButtons = screen.getAllByRole('button');
      tierButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should pass basic accessibility checks', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      const { container } = render(<ServiceTierSystem {...props} />);
      const issues = await checkAccessibility(container);
      
      expect(issues).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing service category gracefully', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: null
      });

      expect(() => render(<ServiceTierSystem {...props} />)).not.toThrow();
    });

    it('should handle invalid tier selection gracefully', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0],
        selectedTier: 'invalid-tier'
      });

      expect(() => render(<ServiceTierSystem {...props} />)).not.toThrow();
    });

    it('should handle negative guest count gracefully', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0],
        guestCount: -5
      });

      render(<ServiceTierSystem {...props} />);
      // Should default to minimum guest count or handle gracefully
      expect(screen.getByTestId('guest-count')).not.toHaveTextContent('-5');
    });
  });

  describe('Component Logging Integration', () => {
    it('should track component lifecycle events', () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      // Check that logging mocks were called
      const loggerModule = await import('@/lib/logger');
      expect(loggerModule.ComponentLogger.lifecycle).toHaveBeenCalledWith('ServiceTierSystem', 'mount', expect.any(Object));
    });

    it('should track tier selection events', async () => {
      const props = createMockProps({
        onTierChange: mockOnTierChange,
        onPriceUpdate: mockOnPriceUpdate,
        initialServiceCategory: SERVICE_CATEGORIES[0]
      });

      render(<ServiceTierSystem {...props} />);

      await user.click(screen.getByTestId('tier-premium'));

      const loggerModule = await import('@/lib/logger');
      expect(loggerModule.ComponentLogger.stateChange).toHaveBeenCalledWith(
        'ServiceTierSystem',
        'essential',
        'premium',
        expect.stringContaining('tier_selection')
      );
    });
  });
});

// Pricing Constants Validation Tests
describe('SERVICE_TIERS Configuration', () => {
  it('should have correct price multipliers', () => {
    expect(SERVICE_TIERS).toHaveLength(3);
    
    const essentialTier = SERVICE_TIERS.find(t => t.id === 'essential');
    const premiumTier = SERVICE_TIERS.find(t => t.id === 'premium');
    const luxuryTier = SERVICE_TIERS.find(t => t.id === 'luxury');

    expect(essentialTier?.priceMultiplier).toBe(0.85);
    expect(premiumTier?.priceMultiplier).toBe(1.00);
    expect(luxuryTier?.priceMultiplier).toBe(1.35);
  });

  it('should have appropriate features for each tier', () => {
    SERVICE_TIERS.forEach(tier => {
      expect(tier.features).toBeInstanceOf(Array);
      expect(tier.features.length).toBeGreaterThan(0);
      expect(typeof tier.name).toBe('string');
      expect(typeof tier.description).toBe('string');
    });
  });
});

describe('SERVICE_CATEGORIES Integration', () => {
  it('should work with all service categories', () => {
    SERVICE_CATEGORIES.forEach(category => {
      expect(category.basePrice).toBeGreaterThan(0);
      expect(category.minPrice).toBeLessThanOrEqual(category.basePrice);
      expect(category.maxPrice).toBeGreaterThanOrEqual(category.basePrice);
    });
  });

  it('should calculate reasonable price ranges', () => {
    SERVICE_CATEGORIES.forEach(category => {
      SERVICE_TIERS.forEach(tier => {
        const calculatedPrice = category.basePrice * tier.priceMultiplier;
        
        // Price should be within reasonable bounds
        expect(calculatedPrice).toBeGreaterThan(0);
        expect(calculatedPrice).toBeLessThan(1000); // Sanity check for reasonable catering prices
      });
    });
  });
});