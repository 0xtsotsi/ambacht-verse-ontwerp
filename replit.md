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