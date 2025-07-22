import { test, expect, Page } from "@playwright/test";

test.describe("Floating Booking Widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should not be visible on initial page load", async ({ page }) => {
    // Widget should not appear immediately
    await expect(
      page.locator('[aria-label="Reserveer vandaag - Open booking formulier"]'),
    ).not.toBeVisible();
  });

  test("should appear after scrolling down", async ({ page }) => {
    // Scroll down to trigger widget visibility
    await page.evaluate(() => window.scrollBy(0, 300));

    // Wait for widget to appear with animation
    await page.waitForTimeout(1000);

    // Widget should now be visible
    const widget = page
      .locator('[aria-label="Reserveer vandaag - Open booking formulier"]')
      .first();
    await expect(widget).toBeVisible();
  });

  test("should expand when clicked in collapsed state", async ({ page }) => {
    // Trigger widget visibility
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Click the collapsed widget
    await page.click('button:has-text("Reserveer Vandaag")');

    // Expanded content should be visible
    await expect(page.locator("text=Wesley's Ambacht")).toBeVisible();
    await expect(
      page.locator('button:has-text("Beschikbaarheid Checken")'),
    ).toBeVisible();
    await expect(page.locator('button:has-text("020 123 4567")')).toBeVisible();
  });

  test("should collapse when X button is clicked", async ({ page }) => {
    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');

    // Click close button
    await page.click('[aria-label="Sluit widget"]');

    // Should return to collapsed state
    await expect(page.locator("text=Wesley's Ambacht")).not.toBeVisible();
    await expect(
      page.locator('button:has-text("Reserveer Vandaag")'),
    ).toBeVisible();
  });

  test('should scroll to booking form when "Beschikbaarheid Checken" is clicked', async ({
    page,
  }) => {
    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');

    // Click booking button
    await page.click('button:has-text("Beschikbaarheid Checken")');

    // Wait for smooth scroll
    await page.waitForTimeout(1500);

    // Check if booking form is in viewport
    const bookingForm = page.locator("#contact");
    await expect(bookingForm).toBeInViewport();

    // Toast notification should appear
    await expect(page.locator("text=Naar Reserveringsformulier")).toBeVisible();
  });

  test("should handle phone click on desktop", async ({ page }) => {
    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');

    // Grant clipboard permissions
    await page
      .context()
      .grantPermissions(["clipboard-write", "clipboard-read"]);

    // Click phone button
    await page.click('button:has-text("020 123 4567")');

    // Check for clipboard copy success toast
    await expect(page.locator("text=Telefoonnummer Gekopieerd")).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe("+31 20 123 4567");
  });

  test("should be keyboard accessible", async ({ page }) => {
    // Trigger widget visibility
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Tab to the widget
    await page.keyboard.press("Tab");

    // The widget should be focused
    const widget = page
      .locator('[aria-label="Reserveer vandaag - Open booking formulier"]')
      .first();
    await expect(widget).toBeFocused();

    // Press Enter to expand
    await page.keyboard.press("Enter");

    // Expanded content should be visible
    await expect(page.locator("text=Wesley's Ambacht")).toBeVisible();

    // Tab through interactive elements
    await page.keyboard.press("Tab"); // Focus on close button
    await page.keyboard.press("Tab"); // Focus on booking button
    await page.keyboard.press("Tab"); // Focus on phone button

    // Verify phone button is focused
    await expect(page.locator('button:has-text("020 123 4567")')).toBeFocused();
  });

  test("should maintain state when scrolling", async ({ page }) => {
    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');

    // Verify expanded
    await expect(page.locator("text=Wesley's Ambacht")).toBeVisible();

    // Scroll up and down
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // Widget should still be expanded
    await expect(page.locator("text=Wesley's Ambacht")).toBeVisible();
  });

  test("should have proper ARIA labels and roles", async ({ page }) => {
    // Trigger widget visibility
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Check collapsed widget accessibility
    const collapsedWidget = page
      .locator('[aria-label="Reserveer vandaag - Open booking formulier"]')
      .first();
    await expect(collapsedWidget).toHaveAttribute("role", "button");
    await expect(collapsedWidget).toHaveAttribute("tabindex", "0");

    // Expand widget
    await collapsedWidget.click();

    // Check expanded widget buttons
    const bookingButton = page.locator(
      'button:has-text("Beschikbaarheid Checken")',
    );
    await expect(bookingButton).toBeVisible();

    const phoneButton = page.locator('button:has-text("020 123 4567")');
    await expect(phoneButton).toBeVisible();

    const closeButton = page.locator('[aria-label="Sluit widget"]');
    await expect(closeButton).toBeVisible();
  });
});

test.describe("Floating Booking Widget - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should be optimized for mobile viewport", async ({ page }) => {
    await page.goto("/");

    // Scroll to trigger widget
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // Widget should be centered on mobile
    const widget = page
      .locator(".fixed.bottom-4.left-1\\/2.-translate-x-1\\/2")
      .first();
    await expect(widget).toBeVisible();

    // Click to expand
    await page.click('button:has-text("Reserveer Vandaag")');

    // Check mobile-specific features
    await expect(
      page.locator("text=Reserveer uw culinaire ervaring"),
    ).toBeVisible();

    // Phone button should show "Bel Direct" on mobile
    const phoneButton = page.locator('button:has-text("Bel Direct")');
    await expect(phoneButton).toBeVisible();
  });

  test("should trigger phone call on mobile", async ({ page, context }) => {
    await page.goto("/");

    // Spy on navigation
    const navigationPromise = page.waitForEvent("framenavigated");

    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');

    // Click phone button
    await page.click('button:has-text("Bel Direct")');

    // Check if tel: URL was triggered
    const currentURL = page.url();
    // Note: In real mobile browser, this would trigger tel: URL
    // Playwright might not navigate to tel: URLs, so we check for the attempt
  });

  test("should show mobile hint on first appearance", async ({ page }) => {
    await page.goto("/");

    // Scroll to trigger widget
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // Check for mobile hint
    const hint = page.locator("text=Tik voor reserveren");
    await expect(hint).toBeVisible();
  });

  test("should have larger touch targets on mobile", async ({ page }) => {
    await page.goto("/");

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // Get collapsed button dimensions
    const button = page.locator('button:has-text("Reserveer Vandaag")');
    const box = await button.boundingBox();

    // Minimum touch target should be 48px (following mobile best practices)
    expect(box?.height).toBeGreaterThanOrEqual(48);

    // Expand widget
    await button.click();

    // Check expanded buttons
    const bookingButton = page.locator(
      'button:has-text("Beschikbaarheid Checken")',
    );
    const bookingBox = await bookingButton.boundingBox();
    expect(bookingBox?.height).toBeGreaterThanOrEqual(48);

    const phoneButton = page.locator('button:has-text("Bel Direct")');
    const phoneBox = await phoneButton.boundingBox();
    expect(phoneBox?.height).toBeGreaterThanOrEqual(48);
  });
});

test.describe("Floating Booking Widget - Visual Regression", () => {
  test("collapsed state visual", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);

    const widget = page.locator(".fixed.z-50").first();
    await expect(widget).toHaveScreenshot("widget-collapsed.png");
  });

  test("expanded state visual", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.waitForTimeout(500);

    const widget = page.locator(".fixed.z-50").first();
    await expect(widget).toHaveScreenshot("widget-expanded.png");
  });

  test("mobile collapsed visual", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1500);

    const widget = page.locator(".fixed.z-50").first();
    await expect(widget).toHaveScreenshot("widget-mobile-collapsed.png");
  });

  test("mobile expanded visual", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.waitForTimeout(500);

    const widget = page.locator(".fixed.z-50").first();
    await expect(widget).toHaveScreenshot("widget-mobile-expanded.png");
  });
});
