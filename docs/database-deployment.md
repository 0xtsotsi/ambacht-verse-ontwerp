# Database Deployment Guide

## Quick Setup

### 1. Apply Migrations

```bash
# Reset database and apply all migrations
supabase db reset

# Or apply migrations manually
supabase db push
```

### 2. Verify Schema

```bash
# Check tables were created
supabase db list-tables

# Verify data was seeded
supabase db query "SELECT COUNT(*) FROM availability_slots;"
supabase db query "SELECT COUNT(*) FROM add_on_services;"
```

### 3. Test Database Functions

```bash
# Test availability checking
supabase db query "SELECT check_availability('2025-07-01', '18:00');"

# Test time slot reservation
supabase db query "SELECT reserve_time_slot('2025-07-01', '18:00');"
```

### 4. Configure Environment

Ensure your `.env.local` file has:

```env
VITE_SUPABASE_URL=https://izguihfmrfvwmjiwcysy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start Development Server

```bash
npm run dev
```

## Production Deployment

### 1. Create Production Supabase Project

1. Go to <https://supabase.com/dashboard>
2. Create new project
3. Update `supabase/config.toml` with production project ID

### 2. Apply Migrations to Production

```bash
# Link to production project
supabase link --project-ref YOUR_PROD_PROJECT_ID

# Push migrations
supabase db push
```

### 3. Update Production Environment Variables

Update your hosting platform (Vercel, Netlify, etc.) with production Supabase URL and keys.

### 4. Verify Production Database

- Test availability checking works
- Verify booking creation works
- Check real-time subscriptions are active

## Database Schema Overview

### Core Tables

- `availability_slots` - Time slot management
- `bookings` - Customer booking records
- `quotes` - Pricing quotes
- `add_on_services` - Service catalog
- `booking_add_ons` - Junction table for selected services

### Key Functions

- `check_availability(date, time)` - Check if slot is available
- `reserve_time_slot(date, time)` - Reserve a slot atomically
- `release_time_slot(date, time)` - Release a reserved slot

### Security

- Row Level Security (RLS) enabled on all tables
- Public read access to availability and services
- Restricted write access to bookings

## Integration Points

### React Components

- `DateCheckerModalEnhanced` - Uses real database availability
- `PreliminaryQuoteCalculator` - Loads add-on services from database
- Real-time subscriptions for live updates

### Hooks

- `useAvailability` - Manages availability data and real-time updates
- `useBooking` - Handles booking creation and updates
- `useAddOnServices` - Provides service catalog

### Database Service Layer

- `src/integrations/supabase/database.ts` - Type-safe database operations
- Automatic TypeScript type generation
- Error handling and validation

## Testing

### Run Database Integration Tests

```bash
# Run Playwright tests
npx playwright test tests/database-integration.spec.ts

# Run specific test
npx playwright test tests/database-integration.spec.ts -g "availability slots"
```

### Manual Testing Checklist

- [ ] Calendar loads availability data
- [ ] Time slots appear for selected dates
- [ ] Booking creation works end-to-end
- [ ] Quote calculator loads add-on services
- [ ] Real-time updates work (test with multiple browsers)
- [ ] Error states display correctly

## Troubleshooting

### Common Issues

**Database connection fails:**

- Check Supabase URL and API key
- Verify project is active
- Check network connectivity

**Migrations fail:**

- Ensure you're linked to correct project
- Check for syntax errors in SQL files
- Verify database permissions

**Real-time subscriptions not working:**

- Check WebSocket connectivity
- Verify RLS policies allow subscriptions
- Check browser developer tools for connection errors

**Type errors:**

- Regenerate types: `supabase gen types typescript > src/integrations/supabase/types.ts`
- Ensure database schema matches TypeScript types

### Database Monitoring

- Monitor query performance in Supabase dashboard
- Set up alerts for high error rates
- Track real-time subscription connections

## Next Steps

### Planned Enhancements

1. Automated email notifications
2. Staff dashboard for booking management
3. Advanced reporting and analytics
4. Integration with external calendar systems
5. Payment processing integration

### Performance Optimization

1. Add database indexes for common queries
2. Implement query caching strategies
3. Set up database partitioning for large tables
4. Monitor and optimize slow queries
