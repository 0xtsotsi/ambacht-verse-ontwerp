-- Insert default add-on services
INSERT INTO add_on_services (name, description, category, price_per_person, flat_rate) VALUES
-- Beverage Services
('Premium Drankenservice', 'Uitgebreide selectie wijnen, bieren en frisdranken', 'beverage', 8.50, NULL),
('Koffie & Thee Service', 'Onbeperkte koffie en thee tijdens evenement', 'beverage', 3.75, NULL),
('Welkomstdrankje', 'Prosecco of speciaal welkomstdrankje bij aankomst', 'beverage', 4.25, NULL),
('Premium Wijnpakket', 'Geselecteerde wijnen passend bij het menu', 'beverage', 12.00, NULL),

-- Equipment Services
('Linnen & Servies Upgrade', 'Premium tafellinnen en servies', 'equipment', NULL, 150.00),
('Audio/Video Systeem', 'Professionele geluids- en beeldapparatuur', 'equipment', NULL, 275.00),
('Decoratie Pakket', 'Seizoensgebonden tafeldecoratie en bloemen', 'equipment', NULL, 125.00),
('Tent & Verwarming', 'Professionele tent met verwarming (outdoor events)', 'equipment', NULL, 450.00),

-- Staff Services
('Extra Bediening', 'Aanvullend servicepersoneel', 'staff', 12.50, NULL),
('Sommelier Service', 'Professionele wijnadvies en -service', 'staff', NULL, 200.00),
('Event Coordinator', 'Dedicated eventcoördinator ter plaatse', 'staff', NULL, 300.00),

-- Extra Services
('Live Cooking Station', 'Chef die live gerechten bereidt', 'extras', 15.00, NULL),
('Kaasplank Service', 'Traditionele Nederlandse kaasplank', 'extras', 6.75, NULL),
('Dessert Upgrade', 'Premium dessertbuffet', 'extras', 7.50, NULL),
('Midnight Snack', 'Late avond hapjes service', 'extras', 8.25, NULL);

-- Generate availability slots for the next 6 months
-- This creates morning, afternoon, and evening slots for each day
DO $$
DECLARE
    current_date DATE := CURRENT_DATE;
    end_date DATE := CURRENT_DATE + INTERVAL '6 months';
    time_slots TIME[] := ARRAY['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
    slot_time TIME;
    max_bookings_count INTEGER;
BEGIN
    WHILE current_date <= end_date LOOP
        -- Skip Sundays (day of week = 0)
        IF EXTRACT(DOW FROM current_date) != 0 THEN
            FOREACH slot_time IN ARRAY time_slots LOOP
                -- Set capacity based on time slot popularity
                IF slot_time BETWEEN '18:00' AND '20:00' THEN
                    max_bookings_count := 3; -- Popular evening slots
                ELSIF slot_time BETWEEN '12:00' AND '16:00' THEN
                    max_bookings_count := 2; -- Afternoon slots
                ELSE
                    max_bookings_count := 1; -- Morning slots
                END IF;
                
                INSERT INTO availability_slots (date, time_slot, max_bookings, current_bookings)
                VALUES (current_date, slot_time, max_bookings_count, 0);
            END LOOP;
        END IF;
        
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
END $$;

-- Add some mock limited availability (for testing DateChecker integration)
UPDATE availability_slots 
SET current_bookings = max_bookings - 1
WHERE date IN (
    CURRENT_DATE + INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '7 days'
) AND time_slot IN ('18:00', '18:30', '19:00');

-- Add some blocked dates (fully booked)
UPDATE availability_slots 
SET current_bookings = max_bookings
WHERE date IN (
    CURRENT_DATE + INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '8 days'
);

-- Insert sample bookings for testing
INSERT INTO bookings (
    customer_name, 
    customer_email, 
    customer_phone, 
    company_name,
    event_date, 
    event_time, 
    guest_count, 
    service_category, 
    service_tier,
    status,
    special_requests,
    estimated_total
) VALUES
(
    'Jan van der Berg',
    'jan@techcorp.nl',
    '+31 6 12345678',
    'TechCorp Nederland',
    CURRENT_DATE + INTERVAL '15 days',
    '18:00',
    45,
    'corporate',
    'premium',
    'confirmed',
    'Vegetarische opties gewenst voor 5 gasten',
    1125.00
),
(
    'Maria Jansen',
    'maria.jansen@email.nl',
    '+31 6 87654321',
    NULL,
    CURRENT_DATE + INTERVAL '22 days',
    '19:00',
    25,
    'private',
    'luxury',
    'pending',
    'Verjaardagsfeest, extra decoratie gewenst',
    875.00
);

-- Insert corresponding quotes
INSERT INTO quotes (
    booking_id,
    service_details,
    pricing_breakdown,
    total_amount,
    status,
    valid_until,
    selected_add_ons
) VALUES
(
    (SELECT id FROM bookings WHERE customer_email = 'jan@techcorp.nl'),
    '{"category": "corporate", "tier": "premium", "guestCount": 45}',
    '{"basePrice": 900.00, "addOns": [{"id": "premium-drinks", "name": "Premium Drankenservice", "total": 225.00}], "finalTotal": 1125.00}',
    1125.00,
    'accepted',
    CURRENT_DATE + INTERVAL '30 days',
    '["premium-drinks"]'
),
(
    (SELECT id FROM bookings WHERE customer_email = 'maria.jansen@email.nl'),
    '{"category": "private", "tier": "luxury", "guestCount": 25}',
    '{"basePrice": 750.00, "addOns": [{"id": "decoration", "name": "Decoratie Pakket", "total": 125.00}], "finalTotal": 875.00}',
    875.00,
    'sent',
    CURRENT_DATE + INTERVAL '14 days',
    '["decoration"]'
);

-- Insert booking add-ons
INSERT INTO booking_add_ons (booking_id, add_on_service_id, quantity, calculated_price)
SELECT 
    b.id as booking_id,
    a.id as add_on_service_id,
    1 as quantity,
    CASE 
        WHEN a.price_per_person IS NOT NULL THEN a.price_per_person * b.guest_count
        ELSE a.flat_rate
    END as calculated_price
FROM bookings b
CROSS JOIN add_on_services a
WHERE 
    (b.customer_email = 'jan@techcorp.nl' AND a.name = 'Premium Drankenservice') OR
    (b.customer_email = 'maria.jansen@email.nl' AND a.name = 'Decoratie Pakket');

-- Reserve the time slots for confirmed bookings
UPDATE availability_slots 
SET current_bookings = current_bookings + 1
WHERE (date, time_slot) IN (
    SELECT event_date, event_time 
    FROM bookings 
    WHERE status = 'confirmed'
);