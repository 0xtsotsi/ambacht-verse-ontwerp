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
        // Soprano's Catering inspired color system
        background: '#F9F6F1',
        card: '#FFFFFF',
        accent: '#E86C32',
        highlight: '#D4B170',
        muted: '#5F5F5F',
        secondary: '#F5E9D3',
        error: '#D45745',
        
        foreground: '#2C2C2C',
        border: '#E5E5E5',
        input: '#F5F5F5',
        ring: '#E86C32',
        
        primary: {
          DEFAULT: '#E86C32',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#D45745',
          foreground: '#FFFFFF',
        },
        chart: {
          "1": '#E86C32',
          "2": '#D4B170',
          "3": '#5F5F5F',
          "4": '#D45745',
          "5": '#2C2C2C',
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
