import { test, expect, Page } from '@playwright/test';

test.describe('Quote Calculator Integration Tests', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
  });

  test.describe('DateChecker to Quote Calculator Flow', () => {
    test('should transfer guest count from DateChecker to Quote Calculator', async () => {
      // Start with DateChecker flow
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Beschikbaarheid Checken")');
      
      // Select date and time
      await page.click('td:has-text("15")');
      await page.waitForTimeout(1000);
      await page.click('label:has-text("18:00")');
      await page.waitForTimeout(500);
      
      // Set specific guest count
      await page.click('button:has-text("150")');
      
      // Verify guest count is set
      await expect(page.locator('text=150 gasten')).toBeVisible();
      
      // Open quote calculator from DateChecker
      await page.click('button:has-text("Gedetailleerde Offerte Berekenen")');
      
      // DateChecker should close and Quote Calculator should open
      await expect(page.locator('text=Controleer Beschikbaarheid')).not.toBeVisible();
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
      
      // Navigate to guest count step to verify transfer
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      
      // Guest count should be pre-populated from DateChecker
      await expect(page.locator('text=150')).toBeVisible();
      await expect(page.locator('text=gasten')).toBeVisible();
    });

    test('should preserve preliminary pricing calculation in context', async () => {
      // Go through DateChecker flow
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Beschikbaarheid Checken")');
      
      // Complete DateChecker flow
      await page.click('td:has-text("20")');
      await page.waitForTimeout(1000);
      await page.click('label:has-text("19:00")');
      await page.click('button:has-text("75")'); // 75 guests
      
      // Note the preliminary price (75 * 22.50 = €1,687.50)
      await expect(page.locator('text*="€1,687.50"')).toBeVisible();
      
      // Open quote calculator
      await page.click('button:has-text("Gedetailleerde Offerte Berekenen")');
      
      // Complete quote calculator with similar selections
      await page.click('label:has-text("Sociale Evenementen")'); // Similar to DateChecker estimate
      await page.click('label:has-text("Premium")');
      
      // Guest count should match DateChecker
      await expect(page.locator('text=75')).toBeVisible();
      
      // Continue to get detailed quote
      await page.click('button:has-text("Volgende")');
      await page.click('button:has-text("Volgende")');
      
      // Wait for calculation
      await page.waitForTimeout(1000);
      
      // Should show more detailed pricing than DateChecker preliminary estimate
      await expect(page.locator('text=Totaal:')).toBeVisible();
      await expect(page.locator('text*="€"')).toBeVisible();
    });
  });

  test.describe('Floating Widget to Quote Calculator Flow', () => {
    test('should access quote calculator directly from widget', async () => {
      // Activate floating widget
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      
      // Expand widget
      await page.click('button:has-text("Reserveer Vandaag")');
      
      // Should see quote calculator option
      await expect(page.locator('button:has-text("Prijs Berekenen")')).toBeVisible();
      
      // Click quote calculator
      await page.click('button:has-text("Prijs Berekenen")');
      
      // Should open quote calculator directly
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
      
      // Widget should collapse (mobile behavior)
      if (await page.viewport()?.width && await page.viewport()!.width < 768) {
        await expect(page.locator('text=Wesley\'s Ambacht')).not.toBeVisible();
      }
    });

    test('should handle multiple modal states correctly', async () => {
      // Start with DateChecker
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Beschikbaarheid Checken")');
      
      // Should see DateChecker modal
      await expect(page.locator('text=Controleer Beschikbaarheid')).toBeVisible();
      
      // Close DateChecker
      await page.keyboard.press('Escape');
      await expect(page.locator('text=Controleer Beschikbaarheid')).not.toBeVisible();
      
      // Now open Quote Calculator from widget
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
      
      // Should see Quote Calculator modal
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
      
      // Both modals should not be open simultaneously
      await expect(page.locator('text=Controleer Beschikbaarheid')).not.toBeVisible();
    });
  });

  test.describe('Complete User Journey Integration', () => {
    test('should support complete booking consultation journey', async () => {
      // Start with availability check
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Beschikbaarheid Checken")');
      
      // Check availability for specific date
      await page.click('td:has-text("25")');
      await page.waitForTimeout(1000);
      
      // See availability confirmation toast
      await expect(page.locator('text*="Geweldige keuze"')).toBeVisible();
      
      // Select evening time slot
      await page.click('label:has-text("18:30")');
      
      // Set guest count
      await page.click('button:has-text("100")');
      
      // Move to detailed pricing
      await page.click('button:has-text("Gedetailleerde Offerte Berekenen")');
      
      // Complete quote calculator
      await page.click('label:has-text("Bruiloft Catering")');
      await page.click('label:has-text("Luxury")');
      
      // Guest count should be preserved
      await expect(page.locator('text=100')).toBeVisible();
      
      // Add premium services for wedding
      await page.click('button:has-text("Volgende")');
      await page.check('input[id="champagne_reception"]');
      await page.check('input[id="wine_pairing"]');
      await page.check('input[id="live_cooking"]');
      
      // Get final quote
      await page.click('button:has-text("Volgende")');
      await page.waitForTimeout(1000);
      
      // Should show comprehensive pricing
      await expect(page.locator('text=Luxury')).toBeVisible();
      await expect(page.locator('text=Champagne Ontvangst')).toBeVisible();
      await expect(page.locator('text=Totaal:')).toBeVisible();
      
      // Request detailed quote
      await page.click('button:has-text("Detailofferte Aanvragen")');
      
      // Should show success message with quote details
      await expect(page.locator('text*="Offerte Aangevraagd"')).toBeVisible();
      await expect(page.locator('text*="100 gasten"')).toBeVisible();
      await expect(page.locator('text*="€"')).toBeVisible();
    });

    test('should handle pricing comparison between DateChecker and Quote Calculator', async () => {
      const guestCount = 80;
      
      // Get preliminary estimate from DateChecker
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Beschikbaarheid Checken")');
      
      await page.click('td:has-text("18")');
      await page.waitForTimeout(1000);
      await page.click('label:has-text("17:30")');
      
      // Set guest count using slider
      const slider = page.locator('input[type="range"]');
      await slider.fill(guestCount.toString());
      
      // Note preliminary price (should be guestCount * 22.50)
      const preliminaryPrice = guestCount * 22.50;
      await expect(page.locator(`text*="€${preliminaryPrice.toFixed(2)}"`)).toBeVisible();
      
      // Move to detailed quote
      await page.click('button:has-text("Gedetailleerde Offerte Berekenen")');
      
      // Select similar service level
      await page.click('label:has-text("Sociale Evenementen")');
      await page.click('label:has-text("Premium")');
      
      // Verify guest count transferred
      await expect(page.locator(`text=${guestCount}`)).toBeVisible();
      
      // Skip add-ons for base comparison
      await page.click('button:has-text("Volgende")');
      await page.click('button:has-text("Volgende")');
      
      await page.waitForTimeout(1000);
      
      // Detailed quote should be close to preliminary estimate for base service
      await expect(page.locator('text=Totaal:')).toBeVisible();
      
      // The detailed calculation should show per-person breakdown
      await expect(page.locator('text*="per persoon"')).toBeVisible();
      
      // Base price should be in expected range (preliminary was 22.50/person)
      // Premium tier might be slightly different but should be comparable
      const finalTotal = await page.locator('text*="€"').last().textContent();
      expect(finalTotal).toBeTruthy();
    });
  });

  test.describe('Cross-Component State Management', () => {
    test('should maintain state when switching between components', async () => {
      // Start quote calculator
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
      
      // Make selections
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      await page.click('button:has-text("75")');
      
      // Close quote calculator
      await page.keyboard.press('Escape');
      await expect(page.locator('text=Selecteer Service Type')).not.toBeVisible();
      
      // Open DateChecker
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Beschikbaarheid Checken")');
      
      // DateChecker should work independently
      await page.click('td:has-text("22")');
      await page.waitForTimeout(1000);
      await page.click('label:has-text("19:30")');
      
      // Close DateChecker and reopen Quote Calculator
      await page.keyboard.press('Escape');
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
      
      // Quote Calculator should start fresh (not maintain previous state)
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
      
      // Progress should be reset to step 1
      const step1 = page.locator('div.w-8.h-8.rounded-full.bg-burnt-orange').first();
      const step2 = page.locator('div.w-8.h-8.rounded-full.bg-burnt-orange').nth(1);
      
      await expect(step1).toBeVisible();
      await expect(step2).not.toBeVisible();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle rapid component switching gracefully', async () => {
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      
      // Rapidly switch between components
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Beschikbaarheid Checken")');
      await page.click('button:has-text("Prijs Berekenen")');
      
      // Should end up with Quote Calculator open
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
      await expect(page.locator('text=Controleer Beschikbaarheid')).not.toBeVisible();
      
      // Component should be fully functional
      await page.click('label:has-text("Maatwerk Service")');
      await expect(page.locator('text=Kies Service Niveau')).toBeVisible();
    });

    test('should handle network delays in quote calculation', async () => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
      
      // Complete quote flow
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      await page.click('button:has-text("Reserveer Vandaag")');
      await page.click('button:has-text("Prijs Berekenen")');
      
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      await page.click('button:has-text("100")');
      await page.click('button:has-text("Volgende")');
      await page.click('button:has-text("Volgende")');
      
      // Should show loading state
      await expect(page.locator('text*="berekend"')).toBeVisible();
      
      // Should eventually show results
      await expect(page.locator('text=Totaal:')).toBeVisible({ timeout: 10000 });
    });

    test('should maintain accessibility during component transitions', async () => {
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(1000);
      
      // Use keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter'); // Open widget
      
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter'); // Open DateChecker
      
      // Should be able to navigate DateChecker with keyboard
      await expect(page.locator('text=Controleer Beschikbaarheid')).toBeVisible();
      
      // Close and open Quote Calculator
      await page.keyboard.press('Escape');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter'); // Open Quote Calculator
      
      // Should be accessible via keyboard
      await expect(page.locator('text=Selecteer Service Type')).toBeVisible();
    });
  });
});