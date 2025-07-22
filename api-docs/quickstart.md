# Wesley's Ambacht Catering API - Developer Quickstart Guide

🍽️ **Welcome to the Wesley's Ambacht Catering API!** This guide will get you up and running with our comprehensive catering booking system in under 10 minutes.

## 🚀 Quick Overview

Wesley's Ambacht provides a premium catering API that enables:

- **Real-time availability checking** with automatic slot management
- **Dynamic quote generation** with intelligent pricing
- **Complete booking lifecycle management** from inquiry to completion
- **Add-on services integration** with flexible pricing models
- **WebSocket real-time updates** for live availability changes

## 📋 Prerequisites

Before you begin, ensure you have:

- [ ] A valid Supabase account and project
- [ ] JWT authentication tokens configured
- [ ] Basic understanding of REST APIs
- [ ] HTTP client (cURL, Postman, or programming language)

## 🔑 Authentication Setup

### Step 1: Obtain Your JWT Token

```bash
# Replace with your Supabase project credentials
curl -X POST 'https://your-project.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'
```

### Step 2: Include Token in Requests

```bash
# All API requests require the Authorization header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎯 Essential API Workflows

### 1. Check Availability (Most Common)

Check if a specific date and time slot is available:

```bash
curl -X POST 'https://api.wesleysambacht.nl/v1/availability/check' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "date": "2024-06-15",
    "time": "18:00"
  }'
```

**Response:**

```json
{
  "available": true,
  "remaining_slots": 2,
  "time_slot": "18:00"
}
```

### 2. Get Available Time Slots for a Date

```bash
curl -X GET 'https://api.wesleysambacht.nl/v1/availability/slots/2024-06-15' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Response:**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "date": "2024-06-15",
      "time_slot": "18:00",
      "max_bookings": 3,
      "current_bookings": 1,
      "is_blocked": false
    }
  ],
  "grouped_slots": {
    "morning": ["10:00", "11:00"],
    "afternoon": ["14:00", "15:00", "16:00"],
    "evening": ["18:00", "19:00", "20:00"]
  }
}
```

### 3. Generate a Quote

Calculate pricing before booking:

```bash
curl -X POST 'https://api.wesleysambacht.nl/v1/quotes' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "service_category": "corporate",
    "service_tier": "premium",
    "guest_count": 30,
    "event_date": "2024-06-15",
    "selected_add_ons": [],
    "custom_notes": "Standard corporate lunch"
  }'
```

**Response:**

```json
{
  "data": {
    "id": "quote-uuid-here",
    "total_amount": 1350.0,
    "valid_until": "2024-06-30",
    "status": "draft"
  },
  "breakdown": {
    "base_price": 1200.0,
    "base_price_per_person": 40.0,
    "tier_multiplier": 1.0,
    "subtotal": 1200.0,
    "add_ons_total": 0.0,
    "volume_discount": {
      "min_guests": 25,
      "discount": 0.05,
      "discount_amount": 60.0,
      "label": "5% volume discount for 25+ guests"
    },
    "final_total": 1140.0,
    "price_per_person": 38.0
  }
}
```

### 4. Create a Booking

After confirming availability and pricing:

```bash
curl -X POST 'https://api.wesleysambacht.nl/v1/bookings' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer_name": "Jan van der Berg",
    "customer_email": "jan@example.com",
    "customer_phone": "+31 6 12345678",
    "company_name": "ABC Consulting B.V.",
    "event_date": "2024-06-15",
    "event_time": "18:00",
    "guest_count": 30,
    "service_category": "corporate",
    "service_tier": "premium",
    "special_requests": "Vegetarian options preferred",
    "dietary_restrictions": "2 guests with nut allergies"
  }'
```

**Response:**

```json
{
  "data": {
    "id": "booking-uuid-here",
    "customer_name": "Jan van der Berg",
    "event_date": "2024-06-15",
    "event_time": "18:00",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Booking created successfully"
}
```

### 5. Add Services to Booking

Enhance your booking with additional services:

```bash
curl -X POST 'https://api.wesleysambacht.nl/v1/bookings/booking-uuid-here/add-ons' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "services": [
      {
        "service_id": "service-uuid-1",
        "quantity": 1
      },
      {
        "service_id": "service-uuid-2",
        "quantity": 2
      }
    ]
  }'
```

## 📊 Business Logic Understanding

### Service Categories

- `corporate` - Business events and meetings
- `private` - Personal celebrations and gatherings
- `wedding` - Wedding ceremonies and receptions
- `celebration` - Special occasions and milestones

### Service Tiers

- `essential` - Quality basics (1.0x multiplier)
- `premium` - Enhanced experience (1.3x multiplier)
- `luxury` - Premium luxury service (1.8x multiplier)

### Guest Count Rules

- **Minimum:** 10 guests for most services
- **Maximum:** 200 guests (500 for custom arrangements)
- **Volume Discounts:** Applied automatically at 25+, 50+, 100+ guests

### Time Slot Management

- **Morning:** 10:00 - 12:00
- **Afternoon:** 12:00 - 16:00
- **Evening:** 16:00 - 20:00
- **Concurrent Bookings:** Up to 3 per time slot (configurable)

## 🔄 Real-time Updates (WebSocket)

Connect to live updates for availability and booking changes:

```javascript
// WebSocket connection (Node.js example)
const WebSocket = require("ws");

const ws = new WebSocket("wss://api.wesleysambacht.nl/websocket", {
  headers: {
    Authorization: "Bearer YOUR_JWT_TOKEN",
  },
});

// Subscribe to availability changes
ws.on("open", function () {
  ws.send(
    JSON.stringify({
      type: "subscribe",
      channel: "availability_changes",
    }),
  );
});

// Handle updates
ws.on("message", function (data) {
  const update = JSON.parse(data);
  console.log("Availability updated:", update);

  // Update your UI accordingly
  if (update.event === "slot_reserved") {
    updateAvailabilityUI(update.data);
  }
});
```

## 💡 Best Practices

### 1. Error Handling

Always handle API errors gracefully:

```javascript
async function checkAvailability(date, time) {
  try {
    const response = await fetch("/api/availability/check", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, time }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return await response.json();
  } catch (error) {
    console.error("Availability check failed:", error.message);
    // Handle error in UI
    showErrorMessage("Unable to check availability. Please try again.");
  }
}
```

### 2. Rate Limiting Strategy

Respect rate limits to ensure consistent service:

```javascript
// Simple rate limiter implementation
class RateLimiter {
  constructor(limit = 100, window = 60000) {
    // 100 requests per minute
    this.limit = limit;
    this.window = window;
    this.requests = [];
  }

  async execute(apiCall) {
    const now = Date.now();

    // Remove old requests outside the window
    this.requests = this.requests.filter((time) => now - time < this.window);

    if (this.requests.length >= this.limit) {
      throw new Error("Rate limit exceeded. Please wait.");
    }

    this.requests.push(now);
    return await apiCall();
  }
}

const limiter = new RateLimiter();
```

### 3. Caching Strategy

Cache frequently requested data to improve performance:

```javascript
// Simple cache for availability data
class AvailabilityCache {
  constructor(ttl = 300000) {
    // 5 minutes TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}
```

### 4. Booking Flow Validation

Always validate the complete booking flow:

```javascript
async function completeBooking(bookingData) {
  // 1. Validate input data
  const validation = validateBookingData(bookingData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  // 2. Check availability
  const availability = await checkAvailability(
    bookingData.event_date,
    bookingData.event_time,
  );
  if (!availability.available) {
    throw new Error("Time slot is no longer available");
  }

  // 3. Generate quote first (optional but recommended)
  const quote = await generateQuote({
    service_category: bookingData.service_category,
    service_tier: bookingData.service_tier,
    guest_count: bookingData.guest_count,
  });

  // 4. Create booking
  const booking = await createBooking(bookingData);

  // 5. Add any additional services
  if (bookingData.selected_add_ons?.length > 0) {
    await addBookingAddOns(booking.data.id, bookingData.selected_add_ons);
  }

  return booking;
}
```

## 🛠️ SDKs and Tools

### JavaScript/Node.js SDK Example

```javascript
class WesleysAmbachtAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  // Availability methods
  async checkAvailability(date, time) {
    return this.request("/availability/check", {
      method: "POST",
      body: JSON.stringify({ date, time }),
    });
  }

  async getAvailableSlots(date) {
    return this.request(`/availability/slots/${date}`);
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
  }

  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  }

  async updateBookingStatus(id, status, notes = null) {
    return this.request(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
  }

  // Quote methods
  async generateQuote(quoteData) {
    return this.request("/quotes", {
      method: "POST",
      body: JSON.stringify(quoteData),
    });
  }

  // Add-on services
  async getAddOnServices(category = null) {
    const endpoint = category
      ? `/add-on-services?category=${category}`
      : "/add-on-services";
    return this.request(endpoint);
  }
}

// Usage
const api = new WesleysAmbachtAPI(
  "https://api.wesleysambacht.nl/v1",
  "your-jwt-token",
);

// Check availability
const availability = await api.checkAvailability("2024-06-15", "18:00");

// Create booking
const booking = await api.createBooking({
  customer_name: "Jan van der Berg",
  customer_email: "jan@example.com",
  event_date: "2024-06-15",
  event_time: "18:00",
  guest_count: 30,
  service_category: "corporate",
  service_tier: "premium",
});
```

### Python SDK Example

```python
import requests
import json
from datetime import datetime, date

class WesleysAmbachtAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })

    def _request(self, method, endpoint, data=None):
        url = f"{self.base_url}{endpoint}"

        try:
            if data:
                response = self.session.request(method, url, json=data)
            else:
                response = self.session.request(method, url)

            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            error_data = response.json()
            raise Exception(error_data['error']['message'])

    def check_availability(self, event_date, time):
        """Check if a specific time slot is available"""
        if isinstance(event_date, date):
            event_date = event_date.isoformat()

        return self._request('POST', '/availability/check', {
            'date': event_date,
            'time': time
        })

    def get_available_slots(self, event_date):
        """Get all available time slots for a date"""
        if isinstance(event_date, date):
            event_date = event_date.isoformat()

        return self._request('GET', f'/availability/slots/{event_date}')

    def create_booking(self, booking_data):
        """Create a new booking"""
        # Convert date objects to strings if needed
        if isinstance(booking_data.get('event_date'), date):
            booking_data['event_date'] = booking_data['event_date'].isoformat()

        return self._request('POST', '/bookings', booking_data)

    def generate_quote(self, quote_data):
        """Generate a pricing quote"""
        if isinstance(quote_data.get('event_date'), date):
            quote_data['event_date'] = quote_data['event_date'].isoformat()

        return self._request('POST', '/quotes', quote_data)

# Usage example
api = WesleysAmbachtAPI('https://api.wesleysambacht.nl/v1', 'your-jwt-token')

# Check availability
availability = api.check_availability('2024-06-15', '18:00')
print(f"Available: {availability['available']}")

# Generate quote
quote = api.generate_quote({
    'service_category': 'corporate',
    'service_tier': 'premium',
    'guest_count': 30,
    'event_date': '2024-06-15'
})
print(f"Quote total: €{quote['data']['total_amount']}")
```

## 🧪 Testing Your Integration

### Unit Tests Example (Jest)

```javascript
describe("Wesley's Ambacht API Integration", () => {
  const api = new WesleysAmbachtAPI(process.env.API_URL, process.env.JWT_TOKEN);

  test("should check availability successfully", async () => {
    const result = await api.checkAvailability("2024-06-15", "18:00");

    expect(result).toHaveProperty("available");
    expect(typeof result.available).toBe("boolean");

    if (result.available) {
      expect(result).toHaveProperty("remaining_slots");
      expect(result.remaining_slots).toBeGreaterThan(0);
    }
  });

  test("should generate quote with correct pricing", async () => {
    const quote = await api.generateQuote({
      service_category: "corporate",
      service_tier: "premium",
      guest_count: 30,
    });

    expect(quote.data).toHaveProperty("total_amount");
    expect(quote.data.total_amount).toBeGreaterThan(0);
    expect(quote.breakdown).toHaveProperty("base_price");
    expect(quote.breakdown).toHaveProperty("final_total");
  });

  test("should handle booking creation flow", async () => {
    // First check availability
    const availability = await api.checkAvailability("2024-06-15", "18:00");

    if (availability.available) {
      const booking = await api.createBooking({
        customer_name: "Test Customer",
        customer_email: "test@example.com",
        event_date: "2024-06-15",
        event_time: "18:00",
        guest_count: 25,
        service_category: "corporate",
        service_tier: "premium",
      });

      expect(booking.data).toHaveProperty("id");
      expect(booking.data.status).toBe("pending");
    }
  });
});
```

## 🚨 Common Pitfalls

### 1. Date Format Issues

Always use ISO 8601 date format (YYYY-MM-DD):

```javascript
// ✅ Correct
const eventDate = "2024-06-15";

// ❌ Incorrect
const eventDate = "15/06/2024";
const eventDate = "June 15, 2024";
```

### 2. Time Slot Validation

Ensure time slots match the expected HH:MM format:

```javascript
// ✅ Correct
const timeSlot = "18:00";
const timeSlot = "09:30";

// ❌ Incorrect
const timeSlot = "6pm";
const timeSlot = "18";
const timeSlot = "6:00 PM";
```

### 3. Guest Count Limits

Always validate guest counts before API calls:

```javascript
function validateGuestCount(count, serviceCategory) {
  const minGuests = 10;
  const maxGuests = serviceCategory === "custom" ? 500 : 200;

  if (count < minGuests) {
    throw new Error(`Minimum ${minGuests} guests required`);
  }

  if (count > maxGuests) {
    throw new Error(
      `Maximum ${maxGuests} guests allowed for ${serviceCategory}`,
    );
  }

  return true;
}
```

### 4. Race Conditions in Availability

Handle the race condition where availability changes between check and booking:

```javascript
async function safeBookingCreation(bookingData) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Double-check availability immediately before booking
      const availability = await api.checkAvailability(
        bookingData.event_date,
        bookingData.event_time,
      );

      if (!availability.available) {
        throw new Error("Time slot no longer available");
      }

      // Attempt booking immediately
      const booking = await api.createBooking(bookingData);
      return booking;
    } catch (error) {
      if (
        error.message.includes("SLOT_UNAVAILABLE") &&
        attempt < maxRetries - 1
      ) {
        attempt++;
        // Wait briefly before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      throw error;
    }
  }
}
```

## 📞 Support and Resources

### Getting Help

- **API Support Email:** api@wesleysambacht.nl
- **Developer Portal:** https://developers.wesleysambacht.nl
- **Status Page:** https://status.wesleysambacht.nl

### Additional Resources

- [Complete API Reference](./index.html) - Interactive Swagger documentation
- [Postman Collection](./postman-collection.json) - Ready-to-use API testing collection
- [Authentication Guide](./authentication.md) - Detailed auth setup instructions
- [WebSocket Guide](./websocket.md) - Real-time integration patterns
- [Business Logic Reference](./business-logic.md) - Pricing rules and validation details

### Rate Limiting Headers

Monitor your usage with response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### API Versioning

- Current version: `v1`
- Version is specified in the URL: `/v1/bookings`
- Breaking changes will increment the version number
- Previous versions supported for 12 months minimum

---

🎉 **You're ready to start building with Wesley's Ambacht Catering API!**

For advanced integration patterns, webhook setup, and production deployment guides, visit our [Developer Portal](https://developers.wesleysambacht.nl).

_Happy coding!_ 🚀
