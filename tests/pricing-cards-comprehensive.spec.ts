import { test, expect, Page, BrowserContext } from '@playwright/test';

// Test data for different service configurations
const serviceTypes = ['corporate', 'social', 'wedding', 'custom'] as const;
const tiers = ['basis', 'premium', 'luxe'] as const;
const languages = ['nl', 'en'] as const;
const variants = ['urgency', 'social-proof', 'value', 'scarcity'] as const;

// Pricing card variations to test
const pricingCardVariations = [
  'pricing-card-005-dutch-transparency',
  'pricing-card-006-trust-builder', 
  'pricing-card-007-mobile-first',
  'pricing-card-008-conversion-optimized',
  'pricing-card-009-premium-positioning'
] as const;

// Mock booking handler
let bookingCalls: Array<{serviceType: string, tier: string}> = [];

test.beforeEach(async ({ page }) => {
  // Reset booking calls
  bookingCalls = [];
  
  // Mock the onBookNow function
  await page.addInitScript(() => {
    (window as any).mockBookingHandler = (serviceType: string, tier: string) => {
      (window as any).bookingCalls = (window as any).bookingCalls || [];
      (window as any).bookingCalls.push({ serviceType, tier });
    };
  });
});

test.describe('Pricing Cards - Dutch Transparency (005)', () => {
  test('should display transparent pricing with Dutch cultural elements', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=005');
    
    // Test Dutch transparency elements
    await expect(page.locator('[data-testid="transparent-pricing"]')).toBeVisible();
    await expect(page.locator('text=Transparante Prijzen')).toBeVisible();
    await expect(page.locator('text=Geen Verborgen Kosten')).toBeVisible();
    await expect(page.locator('text=Nederlandse Kwaliteit')).toBeVisible();
    
    // Test pricing format
    await expect(page.locator('text=/Vanaf €\\d+\\.\\d+ per persoon/')).toBeVisible();
    await expect(page.locator('text=Inclusief BTW')).toBeVisible();
    
    // Test Dutch language usage
    await expect(page.locator('text=Inclusief:')).toBeVisible();
    await expect(page.locator('text=Direct Boeken')).toBeVisible();
    
    // Test color scheme (sopranos-gold)
    const pricingElement = page.locator('[data-price]');
    await expect(pricingElement).toHaveCSS('color', /rgb\(204, 93, 0\)|#CC5D00/);
  });

  test('should handle all service types correctly', async ({ page }) => {
    for (const serviceType of serviceTypes) {
      await page.goto(`/pricing-cards-test?variant=005&service=${serviceType}`);
      
      // Check service-specific elements
      const serviceElement = page.locator(`[data-service="${serviceType}"]`);
      await expect(serviceElement).toBeVisible();
      
      // Verify pricing calculation based on service type
      if (serviceType !== 'custom') {
        await expect(page.locator('[data-price]')).toBeVisible();
        await expect(page.locator('text=/€\\d+\\.\\d+/')).toBeVisible();
      } else {
        await expect(page.locator('text=Offerte Aanvragen')).toBeVisible();
      }
    }
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=005');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Test button activation with keyboard
    const bookButton = page.locator('[data-testid="book-button"]');
    await bookButton.focus();
    await page.keyboard.press('Enter');
    
    // Verify booking handler was called
    const calls = await page.evaluate(() => (window as any).bookingCalls);
    expect(calls).toHaveLength(1);
  });
});

test.describe('Pricing Cards - Trust Builder (006)', () => {
  test('should display trust signals and social proof', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=006');
    
    // Test trust elements
    await expect(page.locator('text=Vertrouwd')).toBeVisible();
    await expect(page.locator('text=98% Tevreden')).toBeVisible();
    await expect(page.locator('text=Sinds 1989')).toBeVisible();
    await expect(page.locator('[data-testid="trust-badge"]')).toBeVisible();
    
    // Test star rating
    await expect(page.locator('[data-testid="star-rating"]')).toBeVisible();
    await expect(page.locator('text=4.9')).toBeVisible();
    
    // Test testimonial
    await expect(page.locator('text=Geweldige service')).toBeVisible();
    await expect(page.locator('text=Maria van der Berg')).toBeVisible();
    
    // Test guarantee elements
    await expect(page.locator('text=100% Betrouwbaarheidsgarantie')).toBeVisible();
    
    // Test social proof metrics
    await expect(page.locator('text=/\\d+\\+ events/')).toBeVisible();
  });

  test('should have enhanced visual trust indicators', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=006');
    
    // Test gradient background
    const cardElement = page.locator('[data-testid="pricing-card"]');
    await expect(cardElement).toHaveCSS('background', /gradient/);
    
    // Test trust badge styling
    const trustBadge = page.locator('[data-testid="trust-badge"]');
    await expect(trustBadge).toHaveClass(/bg-green-500/);
    
    // Test hover effects
    await cardElement.hover();
    await expect(cardElement).toHaveClass(/shadow-xl/);
  });
});

test.describe('Pricing Cards - Mobile First (007)', () => {
  test('should be optimized for mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing-cards-test?variant=007');
    
    // Test mobile-specific elements
    await expect(page.locator('[data-testid="mobile-card"]')).toBeVisible();
    
    // Test large touch targets (minimum 44px)
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
    
    // Test expandable details
    const expandButton = page.locator('[data-testid="expand-details"]');
    await expandButton.click();
    await expect(page.locator('[data-testid="details-content"]')).toBeVisible();
    
    // Test action grid layout
    await expect(page.locator('[data-testid="action-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="primary-action"]')).toBeVisible();
    await expect(page.locator('[data-testid="secondary-actions"]')).toBeVisible();
  });

  test('should handle touch interactions', async ({ page, context }) => {
    // Enable touch simulation
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 1 });
    });
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing-cards-test?variant=007');
    
    // Test touch interactions
    const bookButton = page.locator('[data-testid="primary-action"]');
    await bookButton.tap();
    
    // Verify touch feedback
    await expect(bookButton).toHaveClass(/scale-95/);
    
    // Test swipe gestures on expandable content
    const expandableArea = page.locator('[data-testid="expandable-area"]');
    await expandableArea.swipeUp();
  });

  test('should maintain readability on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // Small phone
    await page.goto('/pricing-cards-test?variant=007');
    
    // Test text readability
    const priceText = page.locator('[data-testid="price-text"]');
    await expect(priceText).toHaveCSS('font-size', /[2-4]\\d+px/); // Large font size
    
    // Test spacing and layout
    const cardContent = page.locator('[data-testid="card-content"]');
    const contentBox = await cardContent.boundingBox();
    expect(contentBox?.width).toBeLessThanOrEqual(320);
    
    // Test that all critical elements are visible
    await expect(page.locator('[data-testid="service-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="price-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="primary-action"]')).toBeVisible();
  });
});

test.describe('Pricing Cards - Conversion Optimized (008)', () => {
  test('should display urgency and conversion elements', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=008&conversion=urgency');
    
    // Test urgency elements
    await expect(page.locator('[data-testid="countdown-timer"]')).toBeVisible();
    await expect(page.locator('text=Beperkte Tijd')).toBeVisible();
    await expect(page.locator('[data-testid="urgency-badge"]')).toHaveClass(/animate-pulse/);
    
    // Test countdown functionality
    const initialTime = await page.locator('[data-testid="timer-display"]').textContent();
    await page.waitForTimeout(2000);
    const laterTime = await page.locator('[data-testid="timer-display"]').textContent();
    expect(initialTime).not.toBe(laterTime);
  });

  test('should show social proof variant', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=008&conversion=social-proof');
    
    // Test social proof elements
    await expect(page.locator('text=/\\d+ mensen bekijken dit nu/')).toBeVisible();
    await expect(page.locator('text=/\\d+ boekingen vandaag/')).toBeVisible();
    await expect(page.locator('[data-testid="live-activity"]')).toBeVisible();
  });

  test('should display scarcity messaging', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=008&conversion=scarcity');
    
    await expect(page.locator('text=Beperkte Beschikbaarheid')).toBeVisible();
    await expect(page.locator('[data-testid="scarcity-indicator"]')).toBeVisible();
  });

  test('should show value proposition', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=008&conversion=value');
    
    // Test value elements
    await expect(page.locator('text=EXTRA WAARDE')).toBeVisible();
    await expect(page.locator('text=Bespaar Vandaag')).toBeVisible();
    await expect(page.locator('[data-testid="savings-badge"]')).toBeVisible();
    
    // Test original vs discounted price
    await expect(page.locator('[data-testid="original-price"]')).toHaveClass(/line-through/);
    await expect(page.locator('[data-testid="discounted-price"]')).toBeVisible();
  });

  test('should have conversion-focused CTA', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=008');
    
    // Test CTA prominence
    const ctaButton = page.locator('[data-testid="conversion-cta"]');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveClass(/h-16/); // Large button
    await expect(ctaButton).toHaveClass(/font-black/); // Bold text
    
    // Test hover effects
    await ctaButton.hover();
    await expect(ctaButton).toHaveClass(/scale-105/);
  });
});

test.describe('Pricing Cards - Premium Positioning (009)', () => {
  test('should display luxury and premium elements', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=009');
    
    // Test luxury indicators
    await expect(page.locator('text=Exclusief')).toBeVisible();
    await expect(page.locator('[data-testid="crown-icon"]')).toBeVisible();
    await expect(page.locator('[data-testid="premium-badge"]')).toBeVisible();
    
    // Test heritage messaging
    await expect(page.locator('text=Sinds 1989')).toBeVisible();
    await expect(page.locator('text=Drie generaties')).toBeVisible();
    
    // Test luxury pricing display
    const priceElement = page.locator('[data-testid="luxury-price"]');
    await expect(priceElement).toHaveClass(/text-5xl/);
    await expect(priceElement).toHaveClass(/bg-gradient-to-r/);
  });

  test('should show premium inclusions', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=009&tier=luxe');
    
    // Test luxury inclusions
    await expect(page.locator('text=Celebrity Chef Experience')).toBeVisible();
    await expect(page.locator('text=Sommelier Wine Selection')).toBeVisible();
    await expect(page.locator('text=Optional Helicopter Service')).toBeVisible();
    
    // Test prestige indicators
    await expect(page.locator('text=Michelin Recognized')).toBeVisible();
    await expect(page.locator('text=Royal Warrant')).toBeVisible();
  });

  test('should have sophisticated visual design', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=009');
    
    // Test gradient backgrounds
    const card = page.locator('[data-testid="premium-card"]');
    await expect(card).toHaveClass(/bg-gradient-to-br/);
    
    // Test metallic accents
    const metallicElement = page.locator('[data-testid="metallic-accent"]');
    await expect(metallicElement).toHaveClass(/bg-gradient-to-r/);
    
    // Test luxury hover effects
    await card.hover();
    await expect(card).toHaveClass(/scale-105/);
    await expect(card).toHaveClass(/shadow-2xl/);
  });
});

test.describe('Cross-Variation Testing', () => {
  test('should maintain consistent pricing across all variations', async ({ page }) => {
    const testData = [
      { service: 'corporate', tier: 'basis', expectedBase: 12.50 },
      { service: 'social', tier: 'premium', expectedBase: 27.50 },
      { service: 'wedding', tier: 'luxe', expectedBase: 22.50 }
    ];
    
    for (const variation of pricingCardVariations) {
      for (const data of testData) {
        await page.goto(`/pricing-cards-test?variant=${variation}&service=${data.service}&tier=${data.tier}`);
        
        // Extract and verify pricing consistency
        const priceText = await page.locator('[data-testid="price-display"]').textContent();
        expect(priceText).toMatch(/€\d+\.\d+/);
        
        // Verify pricing calculation is consistent across variations
        const priceMatch = priceText?.match(/€(\d+\.\d+)/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);
          expect(price).toBeGreaterThan(data.expectedBase); // Account for tier multipliers
        }
      }
    }
  });

  test('should handle language switching consistently', async ({ page }) => {
    for (const variation of pricingCardVariations) {
      // Test Dutch
      await page.goto(`/pricing-cards-test?variant=${variation}&lang=nl`);
      await expect(page.locator('text=per persoon')).toBeVisible();
      await expect(page.locator('text=Inclusief')).toBeVisible();
      
      // Test English
      await page.goto(`/pricing-cards-test?variant=${variation}&lang=en`);
      await expect(page.locator('text=per person')).toBeVisible();
      await expect(page.locator('text=Including')).toBeVisible();
    }
  });

  test('should maintain accessibility across all variations', async ({ page }) => {
    for (const variation of pricingCardVariations) {
      await page.goto(`/pricing-cards-test?variant=${variation}`);
      
      // Test color contrast
      await expect(page).toHaveNoViolations({
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Test screen reader support
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(0);
      
      // Test ARIA labels
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        expect(ariaLabel || textContent).toBeTruthy();
      }
    }
  });
});

test.describe('Performance Testing', () => {
  test('should load all variations within performance budgets', async ({ page }) => {
    for (const variation of pricingCardVariations) {
      const startTime = Date.now();
      await page.goto(`/pricing-cards-test?variant=${variation}`);
      
      // Wait for all images and resources to load
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 second budget
      
      // Test Core Web Vitals
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcpEntry = entries[entries.length - 1];
            resolve(lcpEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        });
      });
      
      expect(lcp).toBeLessThan(2500); // 2.5s LCP budget
    }
  });

  test('should handle rapid interactions without breaking', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=008');
    
    const button = page.locator('[data-testid="conversion-cta"]');
    
    // Rapid clicks test
    for (let i = 0; i < 10; i++) {
      await button.click({ delay: 50 });
    }
    
    // Verify no JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });
});

test.describe('Integration Testing', () => {
  test('should integrate with booking flow', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=005');
    
    const bookButton = page.locator('[data-testid="book-button"]');
    await bookButton.click();
    
    // Verify booking handler integration
    const calls = await page.evaluate(() => (window as any).bookingCalls);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toHaveProperty('serviceType');
    expect(calls[0]).toHaveProperty('tier');
  });

  test('should work with quote calculator integration', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=005&service=custom');
    
    const quoteButton = page.locator('[data-testid="quote-button"]');
    await quoteButton.click();
    
    // Verify quote request handler
    const calls = await page.evaluate(() => (window as any).bookingCalls);
    expect(calls[0].serviceType).toBe('custom');
  });
});

// Empathy-focused testing
test.describe('Empathy & Cultural Validation', () => {
  test('should use appropriate Dutch cultural language', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=005&lang=nl');
    
    // Test formal Dutch usage
    await expect(page.locator('text=/\\bu\\b/')).toBeVisible(); // Formal "u"
    await expect(page.locator('text=Geweldige keuze')).toBeVisible();
    
    // Test cultural appropriateness
    await expect(page.locator('text=Nederlandse Kwaliteit')).toBeVisible();
    await expect(page.locator('text=Transparante Prijzen')).toBeVisible();
  });

  test('should reduce decision anxiety through clear presentation', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=006');
    
    // Test anxiety-reducing elements
    await expect(page.locator('text=100% Tevredenheidsgarantie')).toBeVisible();
    await expect(page.locator('[data-testid="trust-signals"]')).toBeVisible();
    await expect(page.locator('text=Direct bevestigd binnen')).toBeVisible();
    
    // Test clear pricing without hidden costs
    await expect(page.locator('text=Alles inclusief')).toBeVisible();
  });

  test('should provide immediate positive feedback', async ({ page }) => {
    await page.goto('/pricing-cards-test?variant=005');
    
    const bookButton = page.locator('[data-testid="book-button"]');
    await bookButton.hover();
    
    // Test positive feedback on interaction
    await expect(bookButton).toHaveClass(/hover:scale-105/);
    
    // Test encouraging language
    await expect(page.locator('text=Geweldige keuze')).toBeVisible();
  });
});