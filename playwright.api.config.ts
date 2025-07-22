import { defineConfig, devices } from "@playwright/test";

/**
 * API Testing Configuration for Wesley's Ambacht Catering API
 * 
 * This configuration focuses specifically on API endpoint testing,
 * performance validation, and integration testing.
 */
export default defineConfig({
  testDir: "./tests/api",
  /* Run API tests in parallel - they don't depend on UI */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI for flaky network requests */
  retries: process.env.CI ? 3 : 1,
  /* Limit workers for API tests to avoid overwhelming the backend */
  workers: process.env.CI ? 2 : 4,
  /* Reporter configuration for API tests */
  reporter: [
    ["html", { outputFolder: "playwright-report-api" }],
    ["json", { outputFile: "test-results-api.json" }],
    ...(process.env.CI ? [["github"]] : [])
  ],
  
  /* Global test configuration */
  use: {
    /* API Base URL */
    baseURL: process.env.API_BASE_URL || "http://localhost:3001/api/v1",
    
    /* Extended timeout for API operations */
    actionTimeout: 15 * 1000,
    
    /* Collect trace for failed API tests */
    trace: "retain-on-failure",
    
    /* Take screenshot on failure (useful for error responses) */
    screenshot: "only-on-failure",
    
    /* Extra HTTP headers for all requests */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Playwright/Wesley-Ambacht-API-Tests'
    }
  },

  /* Configure projects for different API testing scenarios */
  projects: [
    {
      name: "api-unit",
      testMatch: "**/unit/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        /* Faster timeout for unit tests */
        actionTimeout: 5 * 1000
      }
    },
    
    {
      name: "api-integration",
      testMatch: "**/integration/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        /* Longer timeout for integration tests */
        actionTimeout: 30 * 1000
      }
    },
    
    {
      name: "api-performance",
      testMatch: "**/performance/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        /* Extended timeout for load testing */
        actionTimeout: 60 * 1000
      }
    },
    
    {
      name: "api-security",
      testMatch: "**/security/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        /* Security tests may need longer timeouts */
        actionTimeout: 20 * 1000
      }
    },
    
    {
      name: "api-e2e",
      testMatch: "**/e2e/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        /* End-to-end tests need generous timeouts */
        actionTimeout: 45 * 1000
      }
    }
  ],

  /* Test environment setup */
  globalSetup: "./tests/api/global-setup.ts",
  globalTeardown: "./tests/api/global-teardown.ts",

  /* Expect configuration for API assertions */
  expect: {
    /* Timeout for API response assertions */
    timeout: 10 * 1000
  }
});