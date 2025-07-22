import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function validateProductionBuild() {
  console.log("🚀 Starting production build validation...\n");

  // Check if dist folder exists
  const distPath = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distPath)) {
    console.error("❌ dist/ folder not found. Run build first.");
    process.exit(1);
  }

  // Check if index.html exists
  const indexPath = path.join(distPath, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("❌ dist/index.html not found.");
    process.exit(1);
  }

  console.log("✅ Production artifacts found");

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🌐 Loading production build...");

  try {
    // Load the local file
    await page.goto(`file://${indexPath}`, { waitUntil: "networkidle" });

    // Wait for React app to mount
    await page.waitForSelector("#root", { timeout: 10000 });

    // Check if the main app content is rendered
    const appContent = await page.locator("#root").innerHTML();
    if (appContent.length < 100) {
      throw new Error("App content seems empty or not properly rendered");
    }

    console.log("✅ React app mounted successfully");

    // Check for console errors
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Check for JavaScript errors
    const jsErrors = [];
    page.on("pageerror", (error) => {
      jsErrors.push(error.message);
    });

    // Wait a bit for any async operations
    await page.waitForTimeout(3000);

    // Check page title
    const title = await page.title();
    if (!title.includes("Wesley's Ambacht")) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    console.log(`✅ Page title correct: "${title}"`);

    // Check for key elements
    const hero = await page.locator("h1").first();
    if ((await hero.count()) === 0) {
      throw new Error("Hero heading not found");
    }

    console.log("✅ Hero section rendered");

    // Check if any critical JS/CSS failed to load
    const failedRequests = [];
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.status()}: ${response.url()}`);
      }
    });

    // Final validation
    if (consoleErrors.length > 0) {
      console.warn("⚠️  Console errors found:");
      consoleErrors.forEach((error) => console.warn(`   - ${error}`));
    }

    if (jsErrors.length > 0) {
      console.error("❌ JavaScript errors found:");
      jsErrors.forEach((error) => console.error(`   - ${error}`));
      throw new Error("JavaScript errors detected");
    }

    if (failedRequests.length > 0) {
      console.error("❌ Failed resource requests:");
      failedRequests.forEach((request) => console.error(`   - ${request}`));
      throw new Error("Failed resource requests detected");
    }

    console.log("\n🎉 Production build validation successful!");
    console.log("📊 Validation Summary:");
    console.log(`   ✅ React app mounted and rendering`);
    console.log(`   ✅ Page title correct`);
    console.log(`   ✅ Hero section rendered`);
    console.log(`   ✅ No critical JavaScript errors`);
    console.log(`   ✅ All resources loaded successfully`);

    if (consoleErrors.length === 0) {
      console.log(`   ✅ No console errors`);
    } else {
      console.log(`   ⚠️  ${consoleErrors.length} minor console warnings`);
    }
  } catch (error) {
    console.error(`\n❌ Production build validation failed: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

validateProductionBuild().catch(console.error);
