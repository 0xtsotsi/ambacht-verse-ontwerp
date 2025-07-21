
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Existing fonts (preserved)
				serif: ['Spectral', 'Baskerville', 'Times New Roman', 'serif'],
				body: ['Montserrat', 'Open Sans', 'sans-serif'],
				script: ['Dancing Script', 'Brush Script MT', 'cursive'],
				// Elegant Catering Design System Fonts (from design.json)
				'elegant-sans': ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],        // Headings, body, navigation
				'elegant-script': ['Great Vibes', 'Allura', 'Dancing Script', 'cursive'], // Script accents
				'elegant-heading': ['Inter', 'system-ui', 'sans-serif'],                 // Main headings
				'elegant-body': ['Inter', 'system-ui', 'sans-serif'],                    // Body text
				'elegant-nav': ['Inter', 'system-ui', 'sans-serif'],                     // Navigation
			},
			spacing: {
				'base': '8px',
				'2base': '16px',
				'3base': '24px',
				'4base': '32px',
				'5base': '40px',
				'6base': '48px',
				'8base': '64px',
				'10base': '80px',
				'12base': '96px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Elegant Catering Design System Colors (from design.json)
				'elegant': {
					'terracotta': '#E08A4F',      // Primary accent
					'dark': '#333333',            // Dark text
					'light': '#FFFFFF',           // Light text
					'nav': '#555555',             // Navigation text
					'overlay': 'rgba(0, 0, 0, 0.6)', // Background overlay
				},
				// Existing brand colors (preserved for compatibility)
				'forest-green': '#2B4040',
				'warm-cream': '#FFEFDA', 
				'beige': '#C4A76D',
				'burnt-orange': '#CC5D00',
				'deep-teal': '#3D6160',
				'natural-brown': '#BB3A3C',
				'clean-white': '#FEFEFA',
				// Design System Extension Colors
				'terracotta': {
					50: '#FDF7F3',
					100: '#FAEBE0',
					200: '#F5D4C1',
					300: '#EDBAA0',
					400: '#E08A4F',  // Primary
					500: '#D47A3D',
					600: '#B8672F',
					700: '#9A5424',
					800: '#7D431C',
					900: '#633516',
				},
				'elegant-grey': {
					50: '#F9F9F9',
					100: '#F3F3F3',
					200: '#E7E7E7',
					300: '#CCCCCC',
					400: '#999999',
					500: '#555555',  // Navigation
					600: '#444444',
					700: '#333333',  // Dark text
					800: '#222222',
					900: '#111111',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Elegant design system border radius
				'elegant': '0.75rem',     // Rounded corners for buttons/panels
				'elegant-full': '9999px', // Fully rounded buttons
			},
			boxShadow: {
				// V5 Interactive Elegance shadows
				'elegant-subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
				'elegant-soft': '0 4px 16px rgba(0, 0, 0, 0.12)',
				'elegant-button': '0 2px 6px rgba(224, 138, 79, 0.2)',
				'elegant-button-hover': '0 4px 12px rgba(224, 138, 79, 0.3)',
				'elegant-panel': '0 8px 32px rgba(0, 0, 0, 0.1)',
				'organic-natural': '0 8px 25px rgba(224, 138, 79, 0.15), 0 3px 10px rgba(0, 0, 0, 0.08)',
				'organic-floating': '0 12px 35px rgba(224, 138, 79, 0.12), 0 4px 15px rgba(0, 0, 0, 0.06)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// V5 Interactive Elegance animations only
				'elegant-glow': {
					'0%, 100%': {
						boxShadow: '0 2px 6px rgba(224, 138, 79, 0.2)',
					},
					'50%': {
						boxShadow: '0 4px 12px rgba(224, 138, 79, 0.4)',
					}
				},
				'interactive-shimmer': {
					'0%': {
						transform: 'translateX(-100%)',
					},
					'100%': {
						transform: 'translateX(100%)',
					}
				},
				'interactive-bounce': {
					'0%, 100%': {
						transform: 'translateY(0) scale(1)',
					},
					'50%': {
						transform: 'translateY(-5px) scale(1.05)',
					}
				},
				'interactive-pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(224, 138, 79, 0.3)',
						transform: 'scale(1)',
					},
					'50%': {
						boxShadow: '0 0 40px rgba(224, 138, 79, 0.6)',
						transform: 'scale(1.02)',
					}
				},
				'interactive-slide-up': {
					'0%': {
						transform: 'translateY(20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					}
				},
				'organic-float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)',
					},
					'50%': {
						transform: 'translateY(-6px) rotate(1deg)',
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// V5 Interactive Elegance animations only
				'elegant-glow': 'elegant-glow 2s ease-in-out infinite',
				'interactive-shimmer': 'interactive-shimmer 2s ease-in-out infinite',
				'interactive-bounce': 'interactive-bounce 2s ease-in-out infinite',
				'interactive-pulse-glow': 'interactive-pulse-glow 3s ease-in-out infinite',
				'interactive-slide-up': 'interactive-slide-up 0.6s ease-out',
				'organic-float': 'organic-float 4s ease-in-out infinite',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
