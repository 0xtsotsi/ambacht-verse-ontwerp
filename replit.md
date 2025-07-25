# Wesley's Ambacht - Catering Service Website

## Project Overview
A modern catering service website for Wesley's Ambacht, featuring booking management, quote calculations, and availability checking. The application has been successfully migrated from Lovable to Replit with full PostgreSQL database integration.

## Architecture
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend**: Express.js with Drizzle ORM for PostgreSQL
- **Database**: PostgreSQL with comprehensive booking and availability management
- **Styling**: Tailwind CSS with shadcn/ui components

## Recent Changes
- **2024-12-26**: Successfully migrated from Lovable to Replit
  - Replaced React Router with Wouter routing
  - Migrated from Supabase to PostgreSQL with Drizzle ORM
  - Created comprehensive API routes for booking and availability management
  - Removed all Supabase dependencies
  - Database schema pushed and working
- **2025-01-25**: Complete UI refactor to match Soprano's Catering design
  - Implemented new color system: cream (#F9F6F1), accent orange (#E86C32), gold (#D4B170)
  - Updated typography with Playfair Display and Open Sans fonts
  - Created Soprano's-inspired components: Hero, Navigation, ServiceSection, FeatureSection
  - Added floating CTA button and full-bleed hero sections
  - Responsive design with elegant animations and hover effects
  - Restored dynamic booking system with FloatingBookingWidget functionality
  - Fixed font hierarchy: text-5xl (hero), text-3xl (sections), text-xl (subheads), text-base (body), text-sm (small)
  - Removed all emojis for professional appearance
  - Integrated DateCheckerModal and StepByStepQuoteCalculator with Soprano's theme
- **2025-01-25**: Comprehensive enhancement with authentic Wesley's Ambacht content
  - Updated all content with authentic business information (Wesley & Marjoleine Kreeft)
  - Integrated real food images from attached_assets folder throughout Gallery, Services, and FeatureSection
  - Enhanced all components with prettier Lucide React icons (ChefHat, Phone, Star, Heart, Flame, etc.)
  - Added extensive gradient enhancements across all sections with orange/amber color scheme
  - Created professional logo with ChefHat icon and company tagline
  - Updated contact information: 06 212 226 58, info@ambachtbijwesley.nl, Nieuweweg 79 Stellendam
  - Enhanced Hero section with quality badges, social media icons, and authentic background image
  - Updated Navigation with icon-enhanced menu items and gradient background when scrolled
  - Transformed ServiceSection with animated gradient buttons and authentic Dutch content
  - Enhanced Gallery with real food photography and improved image display functionality
  - Updated Testimonials with gradient backgrounds and animated decorative elements
  - Enhanced FeatureSection with authentic Wesley's Ambacht content and gradient image overlays
  - Upgraded CTASection with comprehensive gradient design and feature highlights
- **2025-01-25**: Complete Soprano's Catering recreation and enhanced UX
  - Fixed Hero arrow with elegant white rounded chevron (working smooth scroll)
  - Created SopranoServicesSection with exact Soprano's layout and animations
  - Implemented sophisticated scroll reveals: sides→center, center→sides, bottom-up, sides again
  - Added authentic food photography throughout all sections and Gallery
  - Enhanced with luxury reveal animations and Intersection Observer triggers
  - Maintained Wesley's Ambacht branding while achieving Soprano's visual polish
  - Updated Navigation with proper wouter routing for wedding page
  - Created comprehensive wedding page with parallax backgrounds and detailed menus

## Database Schema
The project uses a comprehensive PostgreSQL schema with:
- `availability_slots`: Time slot management with booking capacity
- `bookings`: Customer booking information and status tracking
- `quotes`: Pricing and quote management
- `add_on_services`: Additional services and pricing
- `booking_add_ons`: Junction table for booking extras

## API Endpoints
- `/api/availability` - Availability slot management
- `/api/bookings` - Booking creation and management
- `/api/quotes` - Quote generation and tracking
- `/api/add-on-services` - Additional service offerings

## User Preferences
- Language: Dutch (Nederlandse interface)
- Clean, professional design
- Focus on user experience for catering bookings

## Project Status
✅ Migration completed successfully
✅ Database schema deployed
✅ API routes functional
✅ Frontend routing updated
🔄 Final testing and verification in progress