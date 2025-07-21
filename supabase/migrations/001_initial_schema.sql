-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE service_category AS ENUM ('corporate', 'private', 'wedding', 'celebration');
CREATE TYPE service_tier AS ENUM ('essential', 'premium', 'luxury');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');

-- Availability Slots Table
CREATE TABLE availability_slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    max_bookings INTEGER NOT NULL DEFAULT 1,
    current_bookings INTEGER NOT NULL DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure we don't exceed max bookings
    CONSTRAINT check_booking_capacity CHECK (current_bookings <= max_bookings),
    
    -- Unique constraint on date + time combination
    CONSTRAINT unique_date_time UNIQUE (date, time_slot)
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    company_name VARCHAR(255),
    
    -- Event Details
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    guest_count INTEGER NOT NULL,
    service_category service_category NOT NULL,
    service_tier service_tier DEFAULT 'premium',
    
    -- Booking Details
    status booking_status DEFAULT 'pending',
    special_requests TEXT,
    dietary_restrictions TEXT,
    
    -- Additional Information
    estimated_total DECIMAL(10,2),
    final_total DECIMAL(10,2),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_guest_count CHECK (guest_count >= 10 AND guest_count <= 500),
    CONSTRAINT valid_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Quotes Table
CREATE TABLE quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Quote Details
    service_details JSONB NOT NULL,
    pricing_breakdown JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status quote_status DEFAULT 'draft',
    
    -- Validity
    valid_until DATE NOT NULL,
    
    -- Additional Services
    selected_add_ons JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_amount CHECK (total_amount > 0)
);

-- Add-on Services Table (for flexible pricing)
CREATE TABLE add_on_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price_per_person DECIMAL(8,2),
    flat_rate DECIMAL(8,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either per-person or flat rate pricing
    CONSTRAINT valid_pricing CHECK (
        (price_per_person IS NOT NULL AND flat_rate IS NULL) OR
        (price_per_person IS NULL AND flat_rate IS NOT NULL)
    )
);

-- Booking Add-ons Junction Table
CREATE TABLE booking_add_ons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    add_on_service_id UUID REFERENCES add_on_services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    calculated_price DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_booking_addon UNIQUE (booking_id, add_on_service_id)
);

-- Create indexes for performance
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_availability_slots_date ON availability_slots(date);
CREATE INDEX idx_availability_slots_date_time ON availability_slots(date, time_slot);
CREATE INDEX idx_quotes_booking_id ON quotes(booking_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_booking_add_ons_booking_id ON booking_add_ons(booking_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_availability_slots_updated_at 
    BEFORE UPDATE ON availability_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_on_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_add_ons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access on availability and add-ons
CREATE POLICY "Anyone can view availability slots" ON availability_slots FOR SELECT USING (true);
CREATE POLICY "Anyone can view add-on services" ON add_on_services FOR SELECT USING (true);

-- RLS Policies for bookings - allow creation, but restrict updates/deletes
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (true);

-- RLS Policies for quotes
CREATE POLICY "Anyone can view quotes" ON quotes FOR SELECT USING (true);

-- Function to check availability
CREATE OR REPLACE FUNCTION check_availability(
    p_date DATE,
    p_time TIME
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    slot_record availability_slots%ROWTYPE;
BEGIN
    SELECT * INTO slot_record
    FROM availability_slots
    WHERE date = p_date AND time_slot = p_time;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    RETURN slot_record.current_bookings < slot_record.max_bookings AND NOT slot_record.is_blocked;
END;
$$;

-- Function to reserve a time slot
CREATE OR REPLACE FUNCTION reserve_time_slot(
    p_date DATE,
    p_time TIME
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE availability_slots
    SET current_bookings = current_bookings + 1
    WHERE date = p_date 
      AND time_slot = p_time
      AND current_bookings < max_bookings
      AND NOT is_blocked;
    
    RETURN FOUND;
END;
$$;

-- Function to release a time slot
CREATE OR REPLACE FUNCTION release_time_slot(
    p_date DATE,
    p_time TIME
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE availability_slots
    SET current_bookings = GREATEST(0, current_bookings - 1)
    WHERE date = p_date AND time_slot = p_time;
    
    RETURN FOUND;
END;
$$;