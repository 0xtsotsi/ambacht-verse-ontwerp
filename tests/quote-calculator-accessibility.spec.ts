import { test, expect, Page } from "@playwright/test";

test.describe("Quote Calculator Accessibility", () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto("/");

    // Open Quote Calculator
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Reserveer Vandaag")');
    await page.click('button:has-text("Prijs Berekenen")');
    await expect(page.locator("text=Selecteer Service Type")).toBeVisible();
  });

  test.describe("Keyboard Navigation", () => {
    test("should support full keyboard navigation through all steps", async () => {
      // Test navigation in step 1 - Service Category
      await page.keyboard.press("Tab"); // Focus first radio option
      await page.keyboard.press("ArrowDown"); // Navigate through radio options
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter"); // Select option

      // Should advance to step 2
      await expect(page.locator("text=Kies Service Niveau")).toBeVisible();

      // Test navigation in step 2 - Service Tier
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      // Should advance to step 3
      await expect(page.locator("text=Aantal Gasten")).toBeVisible();

      // Test slider navigation
      await page.keyboard.press("Tab"); // Focus slider
      await page.keyboard.press("ArrowRight"); // Increase value
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");

      // Test preset buttons
      await page.keyboard.press("Tab"); // Focus first preset
      await page.keyboard.press("Enter"); // Select preset

      // Continue navigation
      await page.keyboard.press("Tab"); // Focus Next button
      await page.keyboard.press("Enter"); // Go to next step

      // Should advance to step 4
      await expect(page.locator("text=Extra Services")).toBeVisible();
    });

    test("should handle Tab and Shift+Tab navigation correctly", async () => {
      // Test forward and backward tab navigation
      await page.keyboard.press("Tab");

      const focusedElement = await page.locator(":focus").textContent();
      expect(focusedElement).toBeTruthy();

      // Navigate backwards
      await page.keyboard.press("Shift+Tab");

      // Should move focus backwards
      const previousElement = await page.locator(":focus").textContent();
      expect(previousElement).not.toBe(focusedElement);
    });

    test("should provide clear focus indicators", async () => {
      // Focus first interactive element
      await page.keyboard.press("Tab");

      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();

      // Should have visible focus outline
      const outline = await focusedElement.evaluate(
        (el) => getComputedStyle(el).outline,
      );
      const boxShadow = await focusedElement.evaluate(
        (el) => getComputedStyle(el).boxShadow,
      );
      const ring = await focusedElement.evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--tw-ring-width"),
      );

      // Should have some form of focus indicator
      const hasFocusIndicator =
        outline !== "none" || boxShadow !== "none" || ring;
      expect(hasFocusIndicator).toBeTruthy();
    });

    test("should trap focus within modal", async () => {
      // Find all tabbable elements within modal
      const tabbableElements = await page
        .locator(
          '[role="dialog"] [tabindex]:not([tabindex="-1"]), [role="dialog"] button:not([disabled]), [role="dialog"] input:not([disabled]), [role="dialog"] select:not([disabled]), [role="dialog"] textarea:not([disabled])',
        )
        .count();

      expect(tabbableElements).toBeGreaterThan(0);

      // Tab to last element
      for (let i = 0; i < tabbableElements + 2; i++) {
        await page.keyboard.press("Tab");
      }

      // Focus should wrap back to first element within modal
      const focusedElement = page.locator(":focus");
      const isInsideModal = await focusedElement.evaluate((el) => {
        return el.closest('[role="dialog"]') !== null;
      });

      expect(isInsideModal).toBe(true);
    });
  });

  test.describe("Screen Reader Support", () => {
    test("should have proper ARIA labels and descriptions", async () => {
      // Check modal has proper labeling
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toHaveAttribute("aria-labelledby");
      await expect(modal).toHaveAttribute("aria-describedby");

      // Check radio groups have labels
      const radioGroups = page.locator('[role="radiogroup"]');
      const radioGroupCount = await radioGroups.count();

      for (let i = 0; i < radioGroupCount; i++) {
        const group = radioGroups.nth(i);
        const hasLabel = await group.evaluate((el) => {
          return (
            el.getAttribute("aria-labelledby") || el.getAttribute("aria-label")
          );
        });
        expect(hasLabel).toBeTruthy();
      }
    });

    test("should announce step changes", async () => {
      // Check if steps have proper heading structure
      const stepHeading = page
        .locator("h1, h2, h3, h4, h5, h6")
        .filter({ hasText: "Selecteer Service Type" });
      await expect(stepHeading).toBeVisible();

      // Progress through steps and verify headings
      await page.click('label:has-text("Zakelijke Catering")');

      const step2Heading = page
        .locator("h1, h2, h3, h4, h5, h6")
        .filter({ hasText: "Kies Service Niveau" });
      await expect(step2Heading).toBeVisible();
    });

    test("should provide meaningful button labels", async () => {
      // Check navigation buttons have accessible names
      const nextButton = page.locator('button:has-text("Volgende")');
      const nextButtonAccessibleName = await nextButton.evaluate((el) => {
        return el.getAttribute("aria-label") || el.textContent;
      });
      expect(nextButtonAccessibleName).toBeTruthy();

      // Check close button has accessible name
      const closeButton = page.locator(
        'button[aria-label*="Sluit"], button:has-text("Sluiten")',
      );
      if ((await closeButton.count()) > 0) {
        const closeButtonLabel = await closeButton
          .first()
          .getAttribute("aria-label");
        expect(closeButtonLabel).toBeTruthy();
      }
    });

    test("should provide form validation feedback", async () => {
      // Try to proceed without making selection
      const nextButton = page.locator('button:has-text("Volgende")');
      await expect(nextButton).toBeDisabled();

      // Make selection
      await page.click('label:has-text("Sociale Evenementen")');
      await expect(nextButton).toBeEnabled();

      // Should provide feedback about enablement state
      const buttonText = await nextButton.textContent();
      expect(buttonText).toBeTruthy();
    });
  });

  test.describe("Visual Accessibility", () => {
    test("should have adequate color contrast", async () => {
      // Test primary text colors
      const headingElement = page.locator("h1, h2, h3").first();
      await expect(headingElement).toBeVisible();

      const headingColor = await headingElement.evaluate(
        (el) => getComputedStyle(el).color,
      );
      const headingBg = await headingElement.evaluate((el) => {
        let bg = getComputedStyle(el).backgroundColor;
        let parent = el.parentElement;
        while (bg === "rgba(0, 0, 0, 0)" && parent) {
          bg = getComputedStyle(parent).backgroundColor;
          parent = parent.parentElement;
        }
        return bg;
      });

      // Basic check that colors are defined
      expect(headingColor).toBeTruthy();
      expect(headingBg).toBeTruthy();
      expect(headingColor).not.toBe(headingBg);
    });

    test("should have readable text sizes", async () => {
      // Check that text is not too small
      const textElements = page
        .locator("p, span, div")
        .filter({ hasText: /\w+/ });
      const elementCount = await textElements.count();

      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        const element = textElements.nth(i);
        const fontSize = await element.evaluate(
          (el) => getComputedStyle(el).fontSize,
        );
        const sizeNumber = parseFloat(fontSize);

        // Text should be at least 12px
        expect(sizeNumber).toBeGreaterThanOrEqual(12);
      }
    });

    test("should support reduced motion preferences", async () => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: "reduce" });

      // Navigate through steps
      await page.click('label:has-text("Bruiloft Catering")');

      // Should still be functional with reduced motion
      await expect(page.locator("text=Kies Service Niveau")).toBeVisible();

      // Animations should be minimal or disabled
      const transitionDuration = await page
        .locator("body")
        .evaluate((el) =>
          getComputedStyle(el).getPropertyValue("transition-duration"),
        );

      // In reduced motion mode, transitions should be minimal
      expect(transitionDuration === "0s" || !transitionDuration).toBeTruthy();
    });
  });

  test.describe("Touch Accessibility", () => {
    test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport

    test("should have touch-friendly target sizes", async () => {
      // Check interactive elements have adequate touch targets
      const buttons = page
        .locator("button, label[for]")
        .filter({ hasText: /\w+/ });
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();

        if (box) {
          // WCAG AA requires minimum 44x44px touch targets
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test("should handle touch interactions correctly", async () => {
      // Test touch interaction on service category
      const categoryOption = page.locator(
        'label:has-text("Zakelijke Catering")',
      );

      // Should respond to touch
      await categoryOption.tap();
      await expect(page.locator("text=Kies Service Niveau")).toBeVisible();

      // Touch targets should not overlap
      const serviceTierOptions = page
        .locator("label[for]")
        .filter({ hasText: /Essential|Premium|Luxury/ });
      const optionCount = await serviceTierOptions.count();

      for (let i = 0; i < optionCount - 1; i++) {
        const option1 = serviceTierOptions.nth(i);
        const option2 = serviceTierOptions.nth(i + 1);

        const box1 = await option1.boundingBox();
        const box2 = await option2.boundingBox();

        if (box1 && box2) {
          // Options should not overlap
          const overlap = !(
            box1.x + box1.width <= box2.x ||
            box2.x + box2.width <= box1.x ||
            box1.y + box1.height <= box2.y ||
            box2.y + box2.height <= box1.y
          );

          if (overlap) {
            // If they overlap, they should be intentionally grouped
            const distance = Math.abs(box1.y - box2.y);
            expect(distance).toBeLessThan(10); // Should be close together if overlapping
          }
        }
      }
    });
  });

  test.describe("Error State Accessibility", () => {
    test("should announce validation errors to screen readers", async () => {
      // Navigate to guest count step
      await page.click('label:has-text("Maatwerk Service")');
      await page.click('label:has-text("Premium")');

      // Try to set invalid guest count (simulate constraint)
      const slider = page.locator('input[type="range"]');
      await slider.focus();

      // Check if slider has proper labeling
      const sliderLabel = await slider.evaluate((el) => {
        return (
          el.getAttribute("aria-label") || el.getAttribute("aria-labelledby")
        );
      });
      expect(sliderLabel).toBeTruthy();

      // Check if slider has min/max values announced
      const minValue = await slider.getAttribute("min");
      const maxValue = await slider.getAttribute("max");
      expect(minValue).toBeTruthy();
      expect(maxValue).toBeTruthy();
    });

    test("should handle loading states accessibly", async () => {
      // Navigate to calculation step
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      await page.click('button:has-text("100")');
      await page.click('button:has-text("Volgende")');
      await page.click('button:has-text("Volgende")');

      // Loading state should be announced
      const loadingElement = page.locator('text*="berekend"');
      if ((await loadingElement.count()) > 0) {
        const ariaLive = await loadingElement.evaluate(
          (el) =>
            el.getAttribute("aria-live") ||
            el.closest("[aria-live]")?.getAttribute("aria-live"),
        );

        // Loading announcements should use aria-live
        expect(ariaLive === "polite" || ariaLive === "assertive").toBeTruthy();
      }
    });
  });

  test.describe("Language and Localization Accessibility", () => {
    test("should have proper language attributes", async () => {
      // Check if content has language specified
      const htmlLang = await page.getAttribute("html", "lang");
      expect(htmlLang).toBe("nl"); // Dutch locale

      // Check for any foreign language content that should be marked
      const modal = page.locator('[role="dialog"]');
      const modalLang = await modal.getAttribute("lang");

      // Modal should inherit or specify Dutch
      if (modalLang) {
        expect(modalLang).toBe("nl");
      }
    });

    test("should use appropriate number and currency formatting", async () => {
      // Navigate to pricing step
      await page.click('label:has-text("Zakelijke Catering")');
      await page.click('label:has-text("Premium")');
      await page.click('button:has-text("100")');
      await page.click('button:has-text("Volgende")');
      await page.click('button:has-text("Volgende")');

      await page.waitForTimeout(1000);

      // Check currency formatting follows Dutch conventions
      const priceElements = page.locator('text*="€"');
      const priceCount = await priceElements.count();

      if (priceCount > 0) {
        const priceText = await priceElements.first().textContent();

        // Should use Euro symbol and appropriate formatting
        expect(priceText).toContain("€");

        // Dutch formatting uses comma for decimals, period for thousands
        // But in web context, period for decimals is also acceptable
        expect(priceText).toMatch(/€\s?\d+([,.]\d{2})?/);
      }
    });
  });

  test.describe("Responsive Accessibility", () => {
    test("should maintain accessibility across different viewport sizes", async () => {
      const viewports = [
        { width: 320, height: 568 }, // Small mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1440, height: 900 }, // Desktop
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);

        // Check if modal is still accessible
        await expect(page.locator('[role="dialog"]')).toBeVisible();

        // Check if interactive elements are still reachable
        const firstOption = page.locator("label").first();
        await expect(firstOption).toBeVisible();

        // Element should be clickable (not obscured)
        const box = await firstOption.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(0);
          expect(box.height).toBeGreaterThan(0);
        }
      }
    });

    test("should handle zoom levels appropriately", async () => {
      // Test at 200% zoom
      await page.setViewportSize({ width: 640, height: 360 }); // Simulates 200% zoom

      // Should still be usable
      await expect(page.locator("text=Selecteer Service Type")).toBeVisible();

      // Interactive elements should remain accessible
      const nextButton = page.locator('button:has-text("Volgende")');
      if ((await nextButton.count()) > 0) {
        const box = await nextButton.boundingBox();
        if (box) {
          // Button should still be large enough to interact with
          expect(box.height).toBeGreaterThan(30);
        }
      }
    });
  });
});
