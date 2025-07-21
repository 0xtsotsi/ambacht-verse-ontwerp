import { test, expect, Page } from '@playwright/test';

test.describe('DateChecker Modal - Empathy-Driven Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete booking flow reduces user anxiety through progressive steps', async ({ page }) => {
    // Step 1: Trigger floating widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    
    // Step 2: Open booking modal
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    
    // Modal should open with empathy-driven messaging
    await expect(page.locator('text=Controleer Beschikbaarheid')).toBeVisible();
    await expect(page.locator('text=Selecteer uw gewenste datum voor uw evenement')).toBeVisible();
    
    // Step 3: Progress indicator should be visible
    const progressDots = page.locator('div[class*="w-3 h-3 rounded-full"]');
    await expect(progressDots).toHaveCount(3);
    
    // Step 4: Calendar should show availability indicators
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();
    
    // Step 5: Select an available date
    const availableDate = page.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
    await availableDate.click();
    
    // Step 6: Should show positive feedback
    await expect(page.locator('text=Geweldige keuze!')).toBeVisible();
    await expect(page.locator('text=beschikbare tijdslots')).toBeVisible();
    
    // Step 7: Time selection should appear automatically
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Kies het perfecte tijdstip')).toBeVisible();
    
    // Step 8: Popular times should be marked
    await expect(page.locator('text=Meest gekozen')).toBeVisible();
    await expect(page.locator('text=Populair')).toBeVisible();
    
    // Step 9: Select evening time (most popular)
    await page.click('label[for="18:00"]');
    
    // Step 10: Guest count section should appear
    await expect(page.locator('text=Hoeveel gasten mogen we verwelkomen?')).toBeVisible();
    
    // Step 11: Price estimation should be visible
    await expect(page.locator('text=Geschatte prijs:')).toBeVisible();
    
    // Step 12: Confirm booking
    await page.click('button:has-text("Bevestig Aanvraag")');
    
    // Step 13: Success feedback
    await expect(page.locator('text=Reserveringsaanvraag verzonden!')).toBeVisible();
    await expect(page.locator('text=We bevestigen uw reservering binnen 24 uur')).toBeVisible();
  });

  test('anxiety reduction: immediate feedback and guidance', async ({ page }) => {
    // Trigger modal
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    
    // Should show helpful legend
    await expect(page.locator('text=Beschikbaar')).toBeVisible();
    await expect(page.locator('text=Beperkt')).toBeVisible();
    await expect(page.locator('text=Niet beschikbaar')).toBeVisible();
    
    // Click available date
    const availableDate = page.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
    await availableDate.click();
    
    // Should show loading state with positive messaging
    await expect(page.locator('text=Beschikbaarheid controleren...')).toBeVisible();
    
    // Should show encouraging confirmation
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Geweldige keuze!')).toBeVisible();
  });

  test('smart guidance: popular times and price transparency', async ({ page }) => {
    // Navigate to time selection
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    
    const availableDate = page.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
    await availableDate.click();
    await page.waitForTimeout(1000);
    
    // Evening section should be marked as most popular
    await expect(page.locator('text=Meest gekozen')).toBeVisible();
    
    // Popular individual times should be marked
    const popularBadges = page.locator('text=Populair');
    await expect(popularBadges.first()).toBeVisible();
    
    // Select time and proceed to guest count
    await page.click('label[for="18:00"]');
    
    // Price should be calculated and displayed
    await expect(page.locator('text=Geschatte prijs:')).toBeVisible();
    await expect(page.locator('text=*Exacte prijs hangt af van uw menukeuzes')).toBeVisible();
    
    // Quick guest count buttons should be available
    const quickCounts = ['20', '50', '100', '150'];
    for (const count of quickCounts) {
      await expect(page.locator(`button:has-text("${count}")`)).toBeVisible();
    }
  });

  test('mobile responsiveness and touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Trigger modal on mobile
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    
    // Modal should adapt to mobile
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Time selection buttons should be touch-friendly
    const availableDate = page.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
    await availableDate.click();
    await page.waitForTimeout(1000);
    
    // Check time button size (should be at least 44px)
    const timeButton = page.locator('label[for="18:00"]');
    const buttonBox = await timeButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
    expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
  });

  test('keyboard accessibility throughout the flow', async ({ page }) => {
    // Trigger modal
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.keyboard.press('Tab'); // Focus booking button
    await page.keyboard.press('Enter'); // Open modal
    
    // Modal should be accessible via keyboard
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Calendar should be navigable with keyboard
    await page.keyboard.press('Tab'); // Focus calendar
    
    // Arrow keys should work in calendar
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter'); // Select date
    
    // Should progress to time selection
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Kies het perfecte tijdstip')).toBeVisible();
    
    // Time selection should be keyboard accessible
    await page.keyboard.press('Tab'); // Focus first time
    await page.keyboard.press('Space'); // Select time
    
    // Should progress to guest count
    await expect(page.locator('text=Hoeveel gasten mogen we verwelkomen?')).toBeVisible();
  });

  test('error handling and edge cases', async ({ page }) => {
    // Trigger modal
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    
    // Disabled dates should not be selectable
    const disabledDates = page.locator('[role="gridcell"][aria-disabled="true"]');
    const disabledCount = await disabledDates.count();
    expect(disabledCount).toBeGreaterThan(0);
    
    // Clicking disabled date should not progress
    if (disabledCount > 0) {
      await disabledDates.first().click();
      // Should still be on step 1
      await expect(page.locator('text=Selecteer uw gewenste datum')).toBeVisible();
    }
    
    // Back navigation should work
    const availableDate = page.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
    await availableDate.click();
    await page.waitForTimeout(1000);
    
    await page.click('label[for="18:00"]');
    
    // Should be on step 3
    await expect(page.locator('text=Hoeveel gasten mogen we verwelkomen?')).toBeVisible();
    
    // Back to time selection
    await page.click('button:has-text("Tijd wijzigen")');
    await expect(page.locator('text=Kies het perfecte tijdstip')).toBeVisible();
    
    // Back to date selection
    await page.click('button:has-text("Andere datum kiezen")');
    await expect(page.locator('text=Selecteer uw gewenste datum')).toBeVisible();
  });

  test('dutch localization and cultural appropriateness', async ({ page }) => {
    // Trigger modal
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    
    // Check Dutch text throughout
    await expect(page.locator('text=Controleer Beschikbaarheid')).toBeVisible();
    await expect(page.locator('text=Selecteer uw gewenste datum voor uw evenement')).toBeVisible();
    
    // Date selection
    const availableDate = page.locator('[role="gridcell"]:not([aria-disabled="true"])').first();
    await availableDate.click();
    await page.waitForTimeout(1000);
    
    // Check time period labels in Dutch
    await expect(page.locator('text=Ochtend')).toBeVisible();
    await expect(page.locator('text=Middag')).toBeVisible();
    await expect(page.locator('text=Avond')).toBeVisible();
    
    // Select time and check guest section
    await page.click('label[for="18:00"]');
    await expect(page.locator('text=Aantal Gasten')).toBeVisible();
    await expect(page.locator('text=gasten')).toBeVisible();
    
    // Check cultural pricing display (Euro format)
    await expect(page.locator('text=€')).toBeVisible();
  });
});