import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/ambacht-verse-ontwerp/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations for V5 Interactive Elegance
    target: "es2020",
    minify: "terser",
    sourcemap: true,
    rollupOptions: {
      external: ["winston"], // Exclude winston from browser build
      output: {
        // V5 Interactive Elegance optimized code splitting
        manualChunks: (id) => {
          // React ecosystem
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react";
          }

          // Radix UI components - split by usage frequency
          if (
            id.includes("@radix-ui/react-dialog") ||
            id.includes("@radix-ui/react-popover") ||
            id.includes("@radix-ui/react-select") ||
            id.includes("@radix-ui/react-accordion")
          ) {
            return "ui-core";
          }

          if (id.includes("@radix-ui")) {
            return "ui-extended";
          }

          // Animation and performance utilities
          if (
            id.includes("date-fns") ||
            id.includes("clsx") ||
            id.includes("tailwind-merge") ||
            id.includes("class-variance-authority")
          ) {
            return "utils";
          }

          // V5 Interactive components - separate chunk for better caching
          if (
            id.includes("PricingCardEnhanced") ||
            id.includes("InteractiveMenuSystem") ||
            id.includes("useAnimationOptimization")
          ) {
            return "v5-interactive";
          }

          // Heavy libraries
          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (
            id.includes("recharts") ||
            id.includes("embla-carousel") ||
            id.includes("html2canvas") ||
            id.includes("jspdf")
          ) {
            return "vendor-heavy";
          }

          // Supabase and API
          if (
            id.includes("@supabase") ||
            id.includes("@tanstack/react-query")
          ) {
            return "api";
          }

          // Other vendor libraries
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // Optimize chunk loading
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // V5 Interactive Elegance bundle size optimizations
    terserOptions: {
      compress: {
        drop_console: mode === "production", // Remove console.logs in production
        drop_debugger: true,
        pure_funcs:
          mode === "production"
            ? ["console.log", "console.info", "console.debug"]
            : [],
        // Advanced optimizations for production
        dead_code: true,
        unused: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        reduce_vars: true,
        if_return: true,
      },
      mangle: {
        properties: {
          // Only mangle private properties (starting with _)
          regex: /^_/,
        },
      },
      format: {
        comments: false,
      },
    },
    // CSS optimizations
    cssCodeSplit: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 600, // KB
  },
  // V5 Interactive Elegance performance optimizations
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-hook-form",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-accordion",
      "@radix-ui/react-tabs",
      "date-fns",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "lucide-react",
      "@tanstack/react-query",
    ],
    exclude: [
      "winston", // Server-only logging
    ],
  },
}));
