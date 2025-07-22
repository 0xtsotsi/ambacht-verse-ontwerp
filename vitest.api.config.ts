/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest Configuration for API Integration Tests
 *
 * This configuration is optimized for API endpoint testing,
 * integration tests, and backend service validation.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    testTimeout: 15000, // Longer timeout for API calls
    hookTimeout: 10000,
    teardownTimeout: 5000,

    // API tests include pattern
    include: [
      "**/tests/api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/tests/integration/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],

    // Exclude UI-specific tests
    exclude: [
      "node_modules/",
      "dist/",
      "coverage/",
      "**/tests/e2e/**",
      "**/tests/accessibility.spec.ts",
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage/api",
      exclude: [
        "node_modules/",
        "src/test/",
        "dist/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "scripts/",
        "e2e/",
        "playwright.config.ts",
        "vite.config.ts",
        "vitest.config.ts",
      ],
      thresholds: {
        global: {
          branches: 85, // Slightly lower for integration tests
          functions: 85,
          lines: 85,
          statements: 85,
        },
        // Core API logic still requires high coverage
        "src/gateway/": {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
        "src/lib/": {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
