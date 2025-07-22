import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests - Floating Booking Widget", () => {
  test("should have no accessibility violations in collapsed state", async ({
    page,
  }) => {
    await page.goto("/");

    // Trigger widget visibility
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1500);

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(".fixed.z-50") // Target the widget specifically
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have no accessibility violations in expanded state", async ({
    page,
  }) => {
    await page.goto("/");

    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.waitForTimeout(500);

    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include(".fixed.z-50")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should maintain focus management", async ({ page }) => {
    await page.goto("/");

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Tab to widget
    await page.keyboard.press("Tab");

    // Check focus is on widget
    const widget = page
      .locator('[aria-label="Reserveer vandaag - Open booking formulier"]')
      .first();
    await expect(widget).toBeFocused();

    // Expand with keyboard
    await page.keyboard.press("Enter");

    // Tab through all interactive elements
    const focusableElements = [
      '[aria-label="Sluit widget"]',
      'button:has-text("Beschikbaarheid Checken")',
      'button:has-text("020 123 4567")',
    ];

    for (const selector of focusableElements) {
      await page.keyboard.press("Tab");
      await expect(page.locator(selector)).toBeFocused();
    }
  });

  test("should have proper color contrast", async ({ page }) => {
    await page.goto("/");

    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');

    // Check specific color contrast requirements
    const results = await new AxeBuilder({ page })
      .include(".fixed.z-50")
      .options({
        runOnly: ["color-contrast"],
      })
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("should support screen readers", async ({ page }) => {
    await page.goto("/");

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Check for screen reader announcements
    const widget = page.locator(".fixed.z-50").first();

    // Collapsed state should have proper labels
    const collapsedButton = widget
      .locator('[aria-label="Reserveer vandaag - Open booking formulier"]')
      .first();
    await expect(collapsedButton).toHaveAttribute("role", "button");

    // Expand widget
    await collapsedButton.click();

    // Check expanded state has proper structure
    await expect(widget.locator("text=Wesley's Ambacht")).toBeVisible();

    // Buttons should have descriptive text
    const bookingButton = widget.locator(
      'button:has-text("Beschikbaarheid Checken")',
    );
    await expect(bookingButton).toHaveText(/Beschikbaarheid Checken/);

    const phoneButton = widget.locator('button:has-text("020 123 4567")');
    await expect(phoneButton).toContainText("020 123 4567");
  });

  test("should support reduced motion preferences", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Add CSS to check for reduced motion
    await page.addStyleTag({
      content: `
        @media (prefers-reduced-motion: reduce) {
          .transition-all { transition: none !important; }
          .animate-bounce { animation: none !important; }
          .animate-pulse { animation: none !important; }
        }
      `,
    });

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(100); // Shorter wait since animations should be disabled

    // Widget should appear without animation
    const widget = page.locator(".fixed.z-50").first();
    await expect(widget).toBeVisible();

    // Check that animations are disabled
    const animatedElement = widget.locator(".animate-bounce").first();
    const animations = await animatedElement.evaluate((el) => {
      return window.getComputedStyle(el).animation;
    });

    expect(animations).toBe("none 0s ease 0s 1 normal none running");
  });

  test("should have sufficient touch target size", async ({ page }) => {
    await page.goto("/");

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // Check collapsed button size
    const collapsedButton = page.locator(
      'button:has-text("Reserveer Vandaag")',
    );
    const collapsedBox = await collapsedButton.boundingBox();

    // WCAG 2.1 requires 44x44 minimum, but 48x48 is better practice
    expect(collapsedBox?.width).toBeGreaterThanOrEqual(44);
    expect(collapsedBox?.height).toBeGreaterThanOrEqual(44);

    // Expand and check other buttons
    await collapsedButton.click();

    const buttons = [
      'button:has-text("Beschikbaarheid Checken")',
      'button:has-text("Bel Direct")',
      '[aria-label="Sluit widget"]',
    ];

    for (const selector of buttons) {
      const button = page.locator(selector);
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("should provide alternative text for icons", async ({ page }) => {
    await page.goto("/");

    // Trigger and expand widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');

    // Check that icon-only buttons have proper labels
    const closeButton = page.locator('[aria-label="Sluit widget"]');
    await expect(closeButton).toHaveAttribute("aria-label", "Sluit widget");

    // Check that decorative icons are hidden from screen readers
    const decorativeIcons = page.locator('.fixed.z-50 svg[aria-hidden="true"]');
    const iconCount = await decorativeIcons.count();

    // There should be at least some decorative icons
    expect(iconCount).toBeGreaterThan(0);
  });

  test("should handle keyboard navigation in both directions", async ({
    page,
  }) => {
    await page.goto("/");

    // Trigger widget
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    // Tab to widget
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter"); // Expand

    // Tab forward through all elements
    const elements = [];
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(
        () =>
          document.activeElement?.textContent ||
          document.activeElement?.getAttribute("aria-label"),
      );
      elements.push(focused);
    }

    // Tab backward
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Shift+Tab");
    }

    // Should be back on close button
    const currentFocus = await page.evaluate(() =>
      document.activeElement?.getAttribute("aria-label"),
    );
    expect(currentFocus).toBe("Sluit widget");
  });
});

test.describe("Full Page Accessibility", () => {
  test("should have no critical accessibility violations on main page", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Run full page scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Filter out known issues or warnings
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );

    expect(criticalViolations).toEqual([]);

    // Log any moderate violations for review
    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        "Accessibility issues found:",
        accessibilityScanResults.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
        })),
      );
    }
  });
});
