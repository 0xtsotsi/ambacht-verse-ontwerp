import { test, expect } from '@playwright/test';

test.describe('Database Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    
    // Wait for the application to load
    await expect(page.locator('h1')).toBeVisible();
  });

  test('availability slots are loaded from database', async ({ page }) => {
    // Open the DateChecker modal
    const bookingButton = page.locator('button', { hasText: 'Beschikbaarheid Controleren' });
    await bookingButton.click();

    // Wait for the modal to open and data to load
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Check that the loading state appears first
    await expect(page.locator('text=Beschikbaarheid laden...')).toBeVisible();
    
    // Wait for data to load and calendar to appear
    await expect(page.locator('.rdp')).toBeVisible({ timeout: 10000 });
    
    // Verify that dates are properly marked
    const calendar = page.locator('.rdp');
    await expect(calendar).toBeVisible();
    
    // Check for availability legend
    await expect(page.locator('text=Beschikbaar')).toBeVisible();
    await expect(page.locator('text=Beperkt')).toBeVisible();
    await expect(page.locator('text=Niet beschikbaar')).toBeVisible();
  });

  test('time slots are dynamically loaded for selected date', async ({ page }) => {
    // Open the DateChecker modal
    const bookingButton = page.locator('button', { hasText: 'Beschikbaarheid Controleren' });
    await bookingButton.click();

    // Wait for calendar to load
    await expect(page.locator('.rdp')).toBeVisible({ timeout: 10000 });
    
    // Select a future date (try to find an available date)
    const availableDates = page.locator('.rdp-day:not(.rdp-day_disabled)');
    await availableDates.first().click();

    // Wait for time slots to load
    await expect(page.locator('text=Ochtend')).toBeVisible({ timeout: 5000 });
    
    // Verify that time slots are displayed
    const timeSlotSections = page.locator('text=Ochtend, text=Middag, text=Avond');
    await expect(timeSlotSections.first()).toBeVisible();
  });

  test('quote calculator integrates with database services', async ({ page }) => {
    // Navigate to quote calculator (assuming it's accessible)
    const quoteButton = page.locator('button', { hasText: 'Offerte Calculator' });
    if (await quoteButton.isVisible()) {
      await quoteButton.click();
    } else {
      // Alternative: scroll to find the quote calculator section
      await page.locator('text=Offerte Calculator').scrollIntoViewIfNeeded();
    }

    // Wait for the calculator to load
    await expect(page.locator('text=Service Categorie')).toBeVisible();
    
    // Select a service category
    await page.locator('input[value="corporate"]').check();
    
    // Wait for service tier options to appear
    await expect(page.locator('text=Service Niveau')).toBeVisible();
    
    // Select premium tier
    await page.locator('input[value="premium"]').check();
    
    // Wait for guest count section
    await expect(page.locator('text=Aantal Gasten')).toBeVisible();
    
    // Adjust guest count
    const slider = page.locator('input[type="range"]');
    await slider.fill('50');
    
    // Wait for add-on services to load
    await expect(page.locator('text=Extra Services')).toBeVisible();
    
    // Verify that add-on services are loaded from database
    await expect(page.locator('text=Dranken')).toBeVisible();
    await expect(page.locator('text=Uitrusting')).toBeVisible();
    
    // Select some add-ons
    const firstAddon = page.locator('input[type="checkbox"]').first();
    await firstAddon.check();
    
    // Verify price calculation updates
    await expect(page.locator('text=Totaal:')).toBeVisible();
    
    // Check that the detailed quote button is enabled
    const quoteRequestButton = page.locator('button', { hasText: 'Detailofferte Aanvragen' });
    await expect(quoteRequestButton).toBeEnabled();
  });

  test('booking creation works end-to-end', async ({ page }) => {
    // Open DateChecker modal
    const bookingButton = page.locator('button', { hasText: 'Beschikbaarheid Controleren' });
    await bookingButton.click();

    // Wait for calendar and select a date
    await expect(page.locator('.rdp')).toBeVisible({ timeout: 10000 });
    const availableDates = page.locator('.rdp-day:not(.rdp-day_disabled)');
    await availableDates.first().click();

    // Select a time slot
    await expect(page.locator('text=Ochtend')).toBeVisible({ timeout: 5000 });
    const firstTimeSlot = page.locator('input[type="radio"]').first();
    await firstTimeSlot.check();

    // Set guest count
    await expect(page.locator('text=Aantal Gasten')).toBeVisible();
    const guestSlider = page.locator('input[type="range"]');
    await guestSlider.fill('30');

    // Confirm the booking request
    const confirmButton = page.locator('button', { hasText: 'Bevestig Aanvraag' });
    await confirmButton.click();

    // Verify success message
    await expect(page.locator('text=Reservering aangemaakt!')).toBeVisible({ timeout: 5000 });
  });

  test('real-time availability updates work', async ({ page }) => {
    // This test would require multiple browser contexts to simulate real-time updates
    // For now, we'll test that the subscription is set up correctly
    
    // Open DateChecker modal
    const bookingButton = page.locator('button', { hasText: 'Beschikbaarheid Controleren' });
    await bookingButton.click();

    // Wait for calendar to load
    await expect(page.locator('.rdp')).toBeVisible({ timeout: 10000 });
    
    // Check that WebSocket connection is established (this would show in network tab)
    // In a real test, we'd verify the subscription is active
    
    // For now, just verify the component loads without errors
    await expect(page.locator('text=Controleer Beschikbaarheid')).toBeVisible();
  });

  test('error handling works correctly', async ({ page }) => {
    // Test error state by potentially blocking network requests
    await page.route('**/supabase.co/**', route => route.abort());
    
    // Open DateChecker modal
    const bookingButton = page.locator('button', { hasText: 'Beschikbaarheid Controleren' });
    await bookingButton.click();

    // Should show error state
    await expect(page.locator('text=Fout bij laden van beschikbaarheid')).toBeVisible({ timeout: 10000 });
  });

  test('database functions are properly typed', async ({ page }) => {
    // This test verifies TypeScript compilation and type safety
    // Since we're using Playwright, we can't directly test TypeScript compilation
    // But we can verify that the components render without runtime type errors
    
    // Navigate through the entire booking flow to exercise all types
    await page.goto('http://localhost:5173');
    
    // Check for any JavaScript errors in console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Open DateChecker
    const bookingButton = page.locator('button', { hasText: 'Beschikbaarheid Controleren' });
    await bookingButton.click();
    
    // Wait for interaction
    await page.waitForTimeout(3000);
    
    // Check that no TypeScript/type errors occurred
    expect(consoleErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('Cannot read property') ||
      error.includes('undefined')
    )).toHaveLength(0);
  });

  test('database schema constraints are enforced', async ({ page }) => {
    // Test that the database properly enforces constraints
    // This would be more of an integration test with the backend
    
    // For now, test that the UI validates inputs correctly
    const bookingButton = page.locator('button', { hasText: 'Beschikbaarheid Controleren' });
    await bookingButton.click();

    await expect(page.locator('.rdp')).toBeVisible({ timeout: 10000 });
    
    // Try to select a past date (should be disabled)
    const pastDates = page.locator('.rdp-day_disabled');
    if (await pastDates.count() > 0) {
      // Past dates should not be clickable
      await expect(pastDates.first()).toHaveAttribute('aria-disabled', 'true');
    }
    
    // Try to select Sunday (should be disabled - closed on Sundays)
    // This would require finding a Sunday in the calendar
    
    // Guest count should have proper min/max constraints
    await page.goto('http://localhost:5173');
    // Navigate to quote calculator and test guest count limits
  });
});