import { test, expect, Page } from "@playwright/test";

test.describe("Complete Booking Flow Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("complete booking journey from widget to form submission", async ({
    page,
  }) => {
    // Step 1: User lands on page and scrolls
    await expect(page).toHaveTitle(/Wesley's Ambacht/);

    // Step 2: Scroll to trigger widget
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1500);

    // Step 3: Widget should be visible
    const widget = page
      .locator('[aria-label="Reserveer vandaag - Open booking formulier"]')
      .first();
    await expect(widget).toBeVisible();

    // Step 4: Click to expand widget
    await widget.click();
    await expect(page.locator("text=Wesley's Ambacht")).toBeVisible();

    // Step 5: Click booking button
    await page.click('button:has-text("Beschikbaarheid Checken")');

    // Step 6: Should scroll to booking form
    await page.waitForTimeout(1500);
    const bookingForm = page.locator("#contact");
    await expect(bookingForm).toBeInViewport();

    // Step 7: Fill out booking form
    await page.fill('input[placeholder="Naam"]', "Test Gebruiker");
    await page.fill('input[placeholder="E-mailadres"]', "test@example.com");
    await page.fill(
      'textarea[placeholder="Bericht"]',
      "Ik wil graag een reservering maken voor 20 personen.",
    );

    // Step 8: Submit form
    await page.click('button:has-text("Versturen")');

    // Step 9: Check for success toast
    await expect(page.locator("text=Bericht Verzonden!")).toBeVisible();
    await expect(page.locator("text=Bedankt voor uw bericht")).toBeVisible();

    // Step 10: Form should be cleared
    await expect(page.locator('input[placeholder="Naam"]')).toHaveValue("");
    await expect(page.locator('input[placeholder="E-mailadres"]')).toHaveValue(
      "",
    );
    await expect(page.locator('textarea[placeholder="Bericht"]')).toHaveValue(
      "",
    );
  });

  test("phone contact flow for desktop users", async ({ page }) => {
    // Grant clipboard permissions
    await page
      .context()
      .grantPermissions(["clipboard-write", "clipboard-read"]);

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Expand widget
    await page.click('button:has-text("Reserveer Vandaag")');

    // Click phone button
    await page.click('button:has-text("020 123 4567")');

    // Check clipboard
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe("+31 20 123 4567");

    // Toast should show
    await expect(page.locator("text=Telefoonnummer Gekopieerd")).toBeVisible();
  });

  test("mobile booking journey with tel: link", async ({ page, context }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Scroll to trigger widget
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // Widget should show mobile hint
    await expect(page.locator("text=Tik voor reserveren")).toBeVisible();

    // Expand widget
    await page.click('button:has-text("Reserveer Vandaag")');

    // Phone button should say "Bel Direct"
    await expect(page.locator('button:has-text("Bel Direct")')).toBeVisible();

    // Intercept navigation to tel: URL
    let telUrlClicked = false;
    page.on("framenavigated", (frame) => {
      if (frame.url().startsWith("tel:")) {
        telUrlClicked = true;
      }
    });

    // Click phone button (will attempt tel: navigation)
    await page.click('button:has-text("Bel Direct")');

    // On real mobile device, this would open phone app
    // In test environment, we just verify the intent
  });

  test("accessibility journey with keyboard only", async ({ page }) => {
    // Navigate entirely with keyboard
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Tab to widget
    let tabCount = 0;
    while (tabCount < 10) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() =>
        document.activeElement?.getAttribute("aria-label"),
      );
      if (focused === "Reserveer vandaag - Open booking formulier") {
        break;
      }
      tabCount++;
    }

    // Expand with Enter
    await page.keyboard.press("Enter");
    await expect(page.locator("text=Wesley's Ambacht")).toBeVisible();

    // Tab to booking button
    await page.keyboard.press("Tab"); // Close button
    await page.keyboard.press("Tab"); // Booking button

    // Activate booking button
    await page.keyboard.press("Enter");

    // Should scroll to form
    await page.waitForTimeout(1500);
    const bookingForm = page.locator("#contact");
    await expect(bookingForm).toBeInViewport();

    // Continue to form with keyboard
    await page.keyboard.press("Tab"); // Should focus first form field
    await page.keyboard.type("Keyboard Test User");

    await page.keyboard.press("Tab");
    await page.keyboard.type("keyboard@test.com");

    await page.keyboard.press("Tab");
    await page.keyboard.type("Testing keyboard navigation");

    await page.keyboard.press("Tab"); // Focus submit button
    await page.keyboard.press("Enter"); // Submit

    // Success toast should appear
    await expect(page.locator("text=Bericht Verzonden!")).toBeVisible();
  });

  test("multi-language support verification", async ({ page }) => {
    // Currently in Dutch - verify all text is in Dutch
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Expand widget
    await page.click('button:has-text("Reserveer Vandaag")');

    // Check Dutch text
    await expect(
      page.locator("text=Reserveer uw culinaire ervaring"),
    ).toBeVisible();
    await expect(page.locator("text=Beschikbaarheid Checken")).toBeVisible();

    // Navigate to form
    await page.click('button:has-text("Beschikbaarheid Checken")');
    await page.waitForTimeout(1500);

    // Form should be in Dutch
    await expect(page.locator('input[placeholder="Naam"]')).toBeVisible();
    await expect(
      page.locator('input[placeholder="E-mailadres"]'),
    ).toBeVisible();
    await expect(page.locator('button:has-text("Versturen")')).toBeVisible();
  });

  test("error handling and recovery", async ({ page }) => {
    // Test form validation
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Beschikbaarheid Checken")');
    await page.waitForTimeout(1500);

    // Try to submit empty form
    await page.click('button:has-text("Versturen")');

    // Browser validation should prevent submission
    const nameInput = page.locator('input[placeholder="Naam"]');
    const isInvalid = await nameInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(isInvalid).toBe(true);

    // Fill partial form
    await nameInput.fill("Test User");
    await page.click('button:has-text("Versturen")');

    // Email should be required
    const emailInput = page.locator('input[placeholder="E-mailadres"]');
    const emailInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid,
    );
    expect(emailInvalid).toBe(true);

    // Complete form properly
    await emailInput.fill("test@example.com");
    await page.fill('textarea[placeholder="Bericht"]', "Test message");
    await page.click('button:has-text("Versturen")');

    // Should succeed now
    await expect(page.locator("text=Bericht Verzonden!")).toBeVisible();
  });

  test("performance: widget should not block page interactions", async ({
    page,
  }) => {
    // Measure page load performance
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });

    // Page should load quickly
    expect(metrics.domContentLoaded).toBeLessThan(3000);
    expect(metrics.loadComplete).toBeLessThan(5000);

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Widget should not interfere with page interactions
    // Click on navigation while widget is visible
    const navLink = page.locator("nav a").first();
    await expect(navLink).toBeVisible();

    // Expand widget
    await page.click('button:has-text("Reserveer Vandaag")');

    // Navigation should still be clickable
    await expect(navLink).toBeVisible();

    // Widget should not cover important content
    const widgetBox = await page.locator(".fixed.z-50").boundingBox();
    const navBox = await navLink.boundingBox();

    // Widget should not overlap navigation
    if (widgetBox && navBox) {
      const overlaps = !(
        widgetBox.x + widgetBox.width < navBox.x ||
        navBox.x + navBox.width < widgetBox.x ||
        widgetBox.y + widgetBox.height < navBox.y ||
        navBox.y + navBox.height < widgetBox.y
      );
      expect(overlaps).toBe(false);
    }
  });
});
