import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--border-radius)",
        md: "calc(var(--border-radius) - 2px)",
        sm: "calc(var(--border-radius) - 4px)",
        xl: "0.75rem",
      },
      colors: {
        // New Julienne + Sopranos color system
        'cream-light': 'var(--cream-light)',
        'warm-beige': 'var(--warm-beige)',
        'charcoal': 'var(--charcoal)',
        'golden-honey': 'var(--golden-honey)',
        'accent-orange': 'var(--accent-orange)',
        'accent-red': 'var(--accent-red)',
        'accent-green': 'var(--accent-green)',
        
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--foreground)",
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--foreground)",
        },
        primary: {
          DEFAULT: "var(--accent-orange)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--muted)",
          foreground: "var(--charcoal)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--charcoal)",
        },
        accent: {
          DEFAULT: "var(--accent-orange)",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "var(--accent-red)",
          foreground: "#ffffff",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--accent-orange)",
        chart: {
          "1": "var(--accent-orange)",
          "2": "var(--golden-honey)",
          "3": "var(--accent-green)",
          "4": "var(--accent-red)",
          "5": "var(--charcoal)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
