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
        // Primary Palette - Soprano's Inspired (WCAG 2.2 Compliant)
        'sophisticated-cream': '#FAF8F5',
        'warm-gold': '#D4AF37',
        'deep-bronze': '#8B4513',
        'elegant-charcoal': '#2F2F2F',
        'craft-charcoal': '#2F2F2F',
        
        // Accent System
        'heritage-orange': '#CC7A00',
        'golden-honey': '#E6A756',
        'subtle-tan': '#F5E6D3',
        'fresh-sage': '#8B9A7A',
        
        // Soprano's Catering inspired color system (legacy support)
        background: '#FAF8F5', // sophisticated-cream
        card: '#FFFFFF',
        accent: '#CC7A00', // heritage-orange
        highlight: '#D4AF37', // warm-gold
        muted: '#5F5F5F',
        secondary: '#F5E6D3', // subtle-tan
        error: '#D32F2F',
        
        foreground: '#2F2F2F', // elegant-charcoal
        border: '#E5E5E5',
        input: '#F5F5F5',
        ring: '#CC7A00', // heritage-orange
        
        primary: {
          DEFAULT: '#CC7A00', // heritage-orange
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#D32F2F',
          foreground: '#FFFFFF',
        },
        chart: {
          "1": '#CC7A00', // heritage-orange
          "2": '#D4AF37', // warm-gold
          "3": '#8B9A7A', // fresh-sage
          "4": '#8B4513', // deep-bronze
          "5": '#2F2F2F', // elegant-charcoal
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
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'script': ['Dancing Script', 'cursive'],
        'sans': ['Open Sans', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.875rem',     // 14px - Small text
        'sm': '1rem',         // 16px - Body text
        'base': '1rem',       // 16px - Body text
        'lg': '1.5rem',       // 24px - Subheadings
        'xl': '2.5rem',       // 40px - Display
        '2xl': '3rem',       // 48px - Large display
        '3xl': '4rem',       // 64px - Hero
        '4xl': '5rem',       // 80px - Extra large
        '5xl': '6rem',       // 96px - Extra large
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
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
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fadeIn": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scaleIn": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite",
        "fadeIn": "fadeIn 0.3s ease-out",
        "scaleIn": "scaleIn 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
