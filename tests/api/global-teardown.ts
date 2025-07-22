import { chromium, FullConfig } from "@playwright/test";

/**
 * Global teardown for API tests
 *
 * This teardown runs once after all API tests complete and:
 * - Cleans up test data
 * - Revokes test authentication tokens
 * - Resets database state
 * - Generates performance reports
 */
async function globalTeardown(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🧹 Cleaning up API test environment...");

  try {
    const baseURL =
      config.projects[0].use.baseURL || "http://localhost:3001/api/v1";
    const authToken = process.env.API_TEST_TOKEN;

    if (!authToken) {
      console.log("⚠️ No auth token found, skipping authenticated cleanup");
      return;
    }

    const headers = { Authorization: `Bearer ${authToken}` };

    // 1. Clean up all test data
    await cleanupTestData(page, baseURL, headers);
    console.log("✅ Test data cleaned up");

    // 2. Reset availability slots to original state
    await resetAvailabilitySlots(page, baseURL, headers);
    console.log("✅ Availability slots reset");

    // 3. Generate test reports
    await generateTestReports(page, baseURL, headers);
    console.log("✅ Test reports generated");

    // 4. Revoke test authentication tokens
    await revokeTestTokens(page, baseURL, headers);
    console.log("✅ Test tokens revoked");

    // 5. Verify system is in clean state
    await verifyCleanState(page, baseURL);
    console.log("✅ System state verified");
  } catch (error) {
    console.error("❌ API test cleanup failed:", error);
    // Don't throw to allow test results to be saved
  } finally {
    await context.close();
    await browser.close();
  }

  console.log("🎯 API test cleanup complete!");
}

/**
 * Clean up all test data created during API tests
 */
async function cleanupTestData(page: any, baseURL: string, headers: any) {
  // Clean up test bookings
  const cleanupBookings = await page.request.delete(
    `${baseURL}/admin/test-data/bookings`,
    {
      headers,
      data: { cleanupType: "all_test_data" },
    },
  );

  // Clean up test quotes
  const cleanupQuotes = await page.request.delete(
    `${baseURL}/admin/test-data/quotes`,
    {
      headers,
      data: { cleanupType: "all_test_data" },
    },
  );

  // Clean up test add-on services
  const cleanupAddOns = await page.request.delete(
    `${baseURL}/admin/test-data/add-on-services`,
    {
      headers,
      data: { cleanupType: "test_data_only" },
    },
  );

  // Clean up test customers
  const cleanupCustomers = await page.request.delete(
    `${baseURL}/admin/test-data/customers`,
    {
      headers,
      data: { cleanupType: "all_test_data" },
    },
  );

  console.log(`Cleanup results:
    - Bookings: ${cleanupBookings.status()}
    - Quotes: ${cleanupQuotes.status()}
    - Add-ons: ${cleanupAddOns.status()}
    - Customers: ${cleanupCustomers.status()}`);
}

/**
 * Reset availability slots to production-ready state
 */
async function resetAvailabilitySlots(
  page: any,
  baseURL: string,
  headers: any,
) {
  const resetResponse = await page.request.post(
    `${baseURL}/admin/availability/reset`,
    {
      headers,
      data: {
        resetType: "test_counters_only",
        preserveProductionSlots: true,
        dateRange: {
          start: new Date().toISOString().split("T")[0],
          end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      },
    },
  );

  if (!resetResponse.ok()) {
    console.warn(
      "⚠️ Failed to reset availability slots:",
      resetResponse.status(),
    );
  }
}

/**
 * Generate comprehensive test reports
 */
async function generateTestReports(page: any, baseURL: string, headers: any) {
  try {
    // Generate performance report
    const perfReportResponse = await page.request.post(
      `${baseURL}/admin/reports/performance`,
      {
        headers,
        data: {
          reportType: "test_run_summary",
          includeMetrics: ["response_times", "error_rates", "throughput"],
          timeRange: "last_test_run",
        },
      },
    );

    // Generate coverage report
    const coverageReportResponse = await page.request.post(
      `${baseURL}/admin/reports/api-coverage`,
      {
        headers,
        data: {
          reportType: "endpoint_coverage",
          includeUntestedEndpoints: true,
        },
      },
    );

    // Generate load test summary
    const loadTestResponse = await page.request.post(
      `${baseURL}/admin/reports/load-test`,
      {
        headers,
        data: {
          reportType: "summary",
          includeRecommendations: true,
        },
      },
    );

    console.log(`Reports generated:
      - Performance: ${perfReportResponse.status()}
      - Coverage: ${coverageReportResponse.status()}
      - Load Test: ${loadTestResponse.status()}`);
  } catch (error) {
    console.warn("⚠️ Failed to generate some test reports:", error);
  }
}

/**
 * Revoke all test authentication tokens
 */
async function revokeTestTokens(page: any, baseURL: string, headers: any) {
  const revokeResponse = await page.request.post(
    `${baseURL}/auth/revoke-test-tokens`,
    {
      headers,
      data: { revokeAll: true },
    },
  );

  if (!revokeResponse.ok()) {
    console.warn("⚠️ Failed to revoke test tokens:", revokeResponse.status());
  }

  // Clear from environment
  delete process.env.API_TEST_TOKEN;
}

/**
 * Verify the system is in a clean state after testing
 */
async function verifyCleanState(page: any, baseURL: string) {
  try {
    // Check health endpoint still works
    const healthResponse = await page.request.get(`${baseURL}/health`);
    if (!healthResponse.ok()) {
      console.warn("⚠️ Health check failed after cleanup");
    }

    // Verify no test data remains (without auth)
    const availabilityResponse = await page.request.get(
      `${baseURL}/availability`,
    );
    if (availabilityResponse.ok()) {
      const data = await availabilityResponse.json();
      const testDataCount =
        data.data?.filter(
          (slot: any) =>
            slot.test_data === true || slot.created_by_test === true,
        ).length || 0;

      if (testDataCount > 0) {
        console.warn(
          `⚠️ ${testDataCount} test availability slots still remain`,
        );
      }
    }
  } catch (error) {
    console.warn("⚠️ Clean state verification encountered issues:", error);
  }
}

export default globalTeardown;
