# Database Integration Documentation

## Overview

The Wesley's Ambacht booking system now includes a production-ready Supabase database schema that enables real availability checking, booking management, and quote generation.

## Database Schema

### Tables

#### `availability_slots`

Manages time slot availability for bookings.

- `id`: UUID primary key
- `date`: Date for the slot
- `time_slot`: Time of the slot (e.g., '18:00')
- `max_bookings`: Maximum number of bookings for this slot
- `current_bookings`: Current number of confirmed bookings
- `is_blocked`: Manual block flag for special circumstances

#### `bookings`

Stores customer booking requests and confirmations.

- `id`: UUID primary key
- Customer information: `customer_name`, `customer_email`, `customer_phone`, `company_name`
- Event details: `event_date`, `event_time`, `guest_count`
- Service details: `service_category`, `service_tier`
- Status tracking: `status`, `confirmed_at`, `cancelled_at`
- Additional: `special_requests`, `dietary_restrictions`

#### `quotes`

Manages pricing quotes for bookings.

- `id`: UUID primary key
- `booking_id`: Reference to the booking
- `service_details`: JSON object with service configuration
- `pricing_breakdown`: JSON object with detailed pricing
- `total_amount`: Final quote amount
- `status`: Quote status (draft, sent, accepted, etc.)
- `valid_until`: Quote expiration date

#### `add_on_services`

Catalog of additional services available for bookings.

- `id`: UUID primary key
- `name`: Service name
- `description`: Service description
- `category`: Service category (beverage, equipment, staff, extras)
- `price_per_person`: Per-person pricing (if applicable)
- `flat_rate`: Flat rate pricing (if applicable)

#### `booking_add_ons`

Junction table linking bookings to selected add-on services.

- `booking_id`: Reference to booking
- `add_on_service_id`: Reference to add-on service
- `quantity`: Number of units
- `calculated_price`: Total price for this add-on

### Database Functions

#### `check_availability(p_date, p_time)`

Returns boolean indicating if a specific date/time slot is available.

#### `reserve_time_slot(p_date, p_time)`

Increments the current_bookings count for a slot (atomic operation).

#### `release_time_slot(p_date, p_time)`

Decrements the current_bookings count for a slot.

## Integration Points

### DateChecker Modal Enhancement

The `DateCheckerModalEnhanced` component now:

- Fetches real availability data from the database
- Shows loading states during data fetches
- Handles real-time availability updates
- Validates slot availability before confirmation
- Creates preliminary booking records

### Quote Calculator Integration

- Loads add-on services from the database
- Calculates pricing based on current database prices
- Supports both per-person and flat-rate services
- Maintains pricing consistency across the application

### Real-time Features

- WebSocket subscriptions for availability changes
- Live updates when bookings are made/cancelled
- Optimistic UI updates with fallback handling

## TypeScript Integration

### Types

All database types are automatically generated and exported from `src/integrations/supabase/types.ts`:

- `Database`: Complete database schema types
- `Booking`, `Quote`, `AvailabilitySlot`: Table row types
- `ServiceCategory`, `ServiceTier`, `BookingStatus`: Enum types

### Database Service

The `src/integrations/supabase/database.ts` file provides:

- Type-safe database operations
- Error handling and validation
- Helper functions for common operations
- Real-time subscription management

### Hooks

Custom React hooks provide easy component integration:

- `useAvailability`: Manages availability data and real-time updates
- `useBooking`: Handles booking creation and updates
- `useAddOnServices`: Provides add-on service catalog

## Testing

### Playwright Integration Tests

The `tests/database-integration.spec.ts` file includes:

- End-to-end booking flow testing
- Real-time update verification
- Error state handling
- Type safety validation
- Database constraint testing

### Test Coverage

- Availability checking functionality
- Booking creation and status updates
- Quote generation and management
- Add-on service integration
- Real-time subscription behavior

## Migration and Deployment

### Development Setup

1. Ensure Supabase project is configured (`supabase/config.toml`)
2. Run migrations: `supabase db reset` (applies all migrations)
3. Verify seed data is loaded correctly
4. Test real-time subscriptions are working

### Production Deployment

1. Apply migrations to production Supabase instance
2. Verify Row Level Security policies are active
3. Test connection strings and API keys
4. Monitor real-time subscription performance
5. Set up database backups and monitoring

### Migration Files

- `001_initial_schema.sql`: Core schema creation with tables, functions, and RLS
- `002_seed_data.sql`: Initial data load with sample bookings and availability

## Performance Considerations

### Indexing

- Primary indexes on frequently queried columns (`event_date`, `status`)
- Composite indexes for availability queries (`date + time_slot`)
- Email indexes for customer lookups

### Real-time Optimization

- Selective subscriptions to minimize data transfer
- Client-side caching of availability data
- Optimistic updates for better UX

### Scalability

- Partitioning strategy for large availability_slots table
- Archive strategy for old bookings and quotes
- Rate limiting on booking creation endpoints

## Security

### Row Level Security

- Public read access to availability and add-on services
- Restricted write access to bookings and quotes
- User-specific access controls where needed

### Data Validation

- Database-level constraints on all critical fields
- Email format validation
- Guest count limits (10-500)
- Price validation (positive values only)

## Monitoring and Maintenance

### Key Metrics

- Booking success rate
- Average availability check response time
- Real-time subscription connection stability
- Database query performance

### Regular Maintenance

- Clean up expired quotes
- Archive completed bookings
- Update availability slots for future dates
- Monitor and optimize slow queries

## Next Steps

### Planned Enhancements

1. Automated email confirmations via database triggers
2. Integration with external calendar systems
3. Advanced reporting and analytics tables
4. Customer portal for booking management
5. Staff dashboard for booking administration

### Additional Features

1. Waitlist functionality for fully booked slots
2. Recurring booking support
3. Group booking discounts
4. Integration with payment processing
5. Advanced conflict resolution for overlapping bookings
