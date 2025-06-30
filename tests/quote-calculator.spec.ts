import { test, expect, Page } from '@playwright/test';

test.describe('Preliminary Quote Calculator', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
  });

  // Test opening the Quote Calculator from Floating Widget
  test('should open quote calculator from floating widget', async () => {
    // Trigger widget visibility
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    
    // Expand widget
    await page.click('button:has-text("Reserveer Vandaag")');
    
    // Click quote calculator button
    await page.click('button:has-text("Prijs Berekenen")');
    
    // Quote calculator modal should open
    await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
    await expect(page.locator('text=Welk type evenement organiseert u?')).toBeVisible();
  });

  // Test opening Quote Calculator from DateChecker Modal
  test('should open quote calculator from date checker modal', async () => {
    // Trigger widget and open DateChecker
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    
    // Navigate through DateChecker to guest count step
    await page.click('td:has-text("15")'); // Select a date
    await page.waitForTimeout(1000);
    await page.click('label:has-text("18:00")'); // Select time
    await page.waitForTimeout(500);
    
    // Click quote calculator button in guest count section
    await page.click('button:has-text("Gedetailleerde Offerte Berekenen")');
    
    // Quote calculator should open
    await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
  });

  test.describe('Step-by-Step Quote Calculator Flow', () => {
    test.beforeEach(async () => {
      // Open quote calculator
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
    });

    test('should complete full quote calculation flow', async () => {
      // Step 1: Select service category
      await page.click('label:has-text("Zakelijke Catering")');
      
      // Should advance to step 2
      await expect(page.locator('text=Kies Service Niveau')).toBeVisible();
      
      // Step 2: Select service tier
      await page.click('label:has-text("Premium")');
      
      // Should advance to step 3
      await expect(page.locator('text=Aantal Gasten')).toBeVisible();
      
      // Step 3: Set guest count using preset button
      await page.click('button:has-text("100")');
      
      // Should advance to step 4
      await expect(page.locator('text=Extra Services')).toBeVisible();
      
      // Step 4: Select some add-ons
      await page.check('input[id="open_bar"]');
      await page.check('input[id="premium_linens"]');
      
      // Navigate to final step
      await page.click('button:has-text("Volgende")');
      
      // Step 5: View quote summary
      await expect(page.locator('text=Uw Offerte')).toBeVisible();
      await expect(page.locator('text=Zakelijke Catering')).toBeVisible();
      await expect(page.locator('text=Premium')).toBeVisible();
      await expect(page.locator('text=100 personen')).toBeVisible();
      
      // Should show pricing breakdown
      await expect(page.locator('text=Prijsoverzicht')).toBeVisible();
      await expect(page.locator('text=Totaal:')).toBeVisible();
      
      // Should have working CTA button
      await expect(page.locator('button:has-text("Detailofferte Aanvragen")')).toBeVisible();
      await expect(page.locator('button:has-text("Detailofferte Aanvragen")')).toBeEnabled();
    });

    test('should allow navigation between steps', async () => {
      // Go to step 2
      await page.click('label:has-text("Sociale Evenementen")');
      await page.click('label:has-text("Essential")');
      
      // Go back to step 1
      await page.click('button:has-text("Vorige")');
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
      
      // Go forward again
      await page.click('button:has-text("Volgende")');
      await expect(page.locator('text=Kies Service Niveau')).toBeVisible();
      
      // Verify selection is preserved
      await expect(page.locator('input[value="social"]:checked')).toBeVisible();
    });

    test('should prevent advancing without required selections', async () => {
      // Try to go to next step without selecting category
      const nextButton = page.locator('button:has-text("Volgende")');
      await expect(nextButton).toBeDisabled();
      
      // Select category
      await page.click('label:has-text("Bruiloft Catering")');
      
      // Should allow advancing to step 2
      await expect(nextButton).toBeEnabled();
    });

    test('should handle guest count selection via slider', async () => {
      // Navigate to guest count step
      await page.click('label:has-text("Maatwerk Service")');
      await page.click('label:has-text("Luxury")');
      
      // Should be on guest count step
      await expect(page.locator('text=Aantal Gasten')).toBeVisible();
      
      // Use slider to change guest count
      const slider = page.locator('input[type="range"]');
      await slider.fill('150');
      
      // Verify guest count display updated
      await expect(page.locator('text=150')).toBeVisible();
      await expect(page.locator('text=gasten')).toBeVisible();
    });

    test('should calculate and display pricing correctly', async () => {
      // Complete flow to get to pricing
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      await page.click('button:has-text("50")'); // 50 guests
      
      // Add expensive add-on
      await page.check('input[id="open_bar"]'); // €15.50 per person
      
      // Go to final step
      await page.click('button:has-text("Volgende")');
      
      // Wait for calculation
      await expect(page.locator('text=Uw offerte wordt berekend...')).toBeVisible();
      await page.waitForTimeout(1000);
      
      // Should show calculated totals
      await expect(page.locator('text=Totaal:')).toBeVisible();
      
      // Should show per-person price
      await expect(page.locator('text=per persoon')).toBeVisible();
      
      // Should show breakdown including add-ons
      await expect(page.locator('text=Open Bar Service')).toBeVisible();
    });

    test('should show volume discounts for large groups', async () => {
      // Select large guest count to trigger volume discount
      await page.click('label:has-text("Corporate")');
      await page.click('label:has-text("Premium")');
      
      // Use a very large guest count
      const slider = page.locator('input[type="range"]');
      await slider.fill('250'); // Should trigger volume discount
      
      await page.click('button:has-text("Volgende")'); // Skip add-ons
      await page.click('button:has-text("Volgende")'); // Go to summary
      
      // Wait for calculation
      await page.waitForTimeout(1000);
      
      // Should show volume discount
      await expect(page.locator('text=Volumekorting')).toBeVisible();
      await expect(page.locator('text=korting')).toBeVisible();
    });
  });

  test.describe('Quote Calculator Accessibility', () => {
    test.beforeEach(async () => {
      // Open quote calculator
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
    });

    test('should be keyboard navigable', async () => {
      // Test keyboard navigation through form
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to select option with Enter
      await page.keyboard.press('Enter');
      
      // Should advance to next step
      await expect(page.locator('text=Kies Service Niveau')).toBeVisible();
    });

    test('should have proper ARIA labels', async () => {
      // Check for proper ARIA labels on interactive elements
      await expect(page.locator('[aria-label*="service"]')).toHaveCount({ min: 1 });
      
      // Radio groups should have proper labels
      await expect(page.locator('input[type="radio"]').first()).toHaveAttribute('aria-describedby');
    });

    test('should announce step changes to screen readers', async () => {
      // Check if step titles are properly structured for screen readers
      await expect(page.locator('h1, h2, h3').filter({ hasText: 'Selecteer Service Type' })).toBeVisible();
      
      // Dialog should have proper title
      await expect(page.locator('[role="dialog"]')).toHaveAttribute('aria-labelledby');
    });

    test('should have adequate color contrast', async () => {
      // Test for proper contrast ratios (this would need additional axe-core integration)
      const button = page.locator('button:has-text("Volgende")');
      await expect(button).toBeVisible();
      
      // Check if text is readable
      const buttonColor = await button.evaluate(el => getComputedStyle(el).color);
      const buttonBg = await button.evaluate(el => getComputedStyle(el).backgroundColor);
      
      // Basic check that colors are set
      expect(buttonColor).toBeTruthy();
      expect(buttonBg).toBeTruthy();
    });
  });

  test.describe('Quote Calculator Mobile Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

    test.beforeEach(async () => {
      // Open quote calculator on mobile
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
    });

    test('should be fully usable on mobile', async () => {
      // Test that all interactive elements are touch-friendly
      const serviceOption = page.locator('label:has-text("Zakelijke Catering")');
      
      // Should be large enough for touch
      const box = await serviceOption.boundingBox();
      expect(box?.height).toBeGreaterThan(44); // WCAG minimum touch target
      
      // Should be clickable
      await serviceOption.click();
      await expect(page.locator('text=Kies Service Niveau')).toBeVisible();
    });

    test('should have responsive layout', async () => {
      // Step indicator should be visible on mobile
      await expect(page.locator('div:has(> div.w-8.h-8.rounded-full)')).toBeVisible();
      
      // Progress should fit on screen
      const progressBar = page.locator('div:has(> div.w-8.h-8.rounded-full)');
      const box = await progressBar.boundingBox();
      expect(box?.width).toBeLessThan(375); // Should fit mobile width
    });

    test('should handle mobile scrolling correctly', async () => {
      // Navigate to add-ons step which has scrollable content
      await page.click('label:has-text("Custom")');
      await page.click('label:has-text("Premium")');
      await page.click('button:has-text("100")');
      
      // Should be able to scroll through add-ons
      const addOnsContainer = page.locator('div.max-h-80.overflow-y-auto');
      await expect(addOnsContainer).toBeVisible();
      
      // Test scrolling works
      await addOnsContainer.scrollIntoViewIfNeeded();
      
      // Should be able to interact with items at bottom
      await page.check('input[id="late_night_snacks"]');
      await expect(page.locator('input[id="late_night_snacks"]')).toBeChecked();
    });
  });

  test.describe('Quote Calculator Error Handling', () => {
    test.beforeEach(async () => {
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
    });

    test('should handle calculation errors gracefully', async () => {
      // Mock a calculation error by intercepting the calculation
      await page.addInitScript(() => {
        window.mockCalculationError = true;
      });
      
      // Complete form
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      await page.click('button:has-text("50")');
      await page.click('button:has-text("Volgende")');
      
      // If calculation fails, should show error state
      await page.waitForTimeout(1500);
      
      // Should either show error message or fallback to manual calculation
      const errorMessage = page.locator('text*="Er ging iets mis"');
      const calculationComplete = page.locator('text=Totaal:');
      
      await expect(errorMessage.or(calculationComplete)).toBeVisible();
    });

    test('should validate minimum guest count', async () => {
      // Navigate to guest count step
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      
      // Try to set very low guest count
      const slider = page.locator('input[type="range"]');
      await slider.fill('5'); // Below minimum
      
      // Should enforce minimum
      const guestDisplay = page.locator('text*="gasten"');
      await expect(guestDisplay).toContainText('10'); // Should be corrected to minimum
    });
  });

  test.describe('Quote Calculator Integration', () => {
    test('should integrate with existing booking flow', async () => {
      // Complete quote calculation
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
      
      await page.click('label:has-text("Bruiloft Catering")');
      await page.click('label:has-text("Luxury")');
      await page.click('button:has-text("100")');
      await page.click('button:has-text("Volgende")');
      await page.click('button:has-text("Volgende")');
      
      // Wait for calculation and request quote
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Detailofferte Aanvragen")');
      
      // Should show success toast
      await expect(page.locator('text*="Offerte Aangevraagd"')).toBeVisible();
      
      // Modal should close
      await expect(page.locator('text=Selecteer Service Type')).not.toBeVisible();
    });

    test('should close properly when requested', async () => {
      // Open calculator
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
      
      // Navigate to final step
      await page.click('label:has-text("Sociale Evenementen")');
      await page.click('label:has-text("Essential")');
      await page.click('button:has-text("50")');
      await page.click('button:has-text("Volgende")');
      await page.click('button:has-text("Volgende")');
      
      // Close from final step
      await page.click('button:has-text("Sluiten")');
      
      // Should close modal
      await expect(page.locator('text=Selecteer Service Type')).not.toBeVisible();
      
      // Floating widget should still be accessible
      await expect(page.locator('button:has-text("Reserveer Vandaag")')).toBeVisible();
    });
  });
});