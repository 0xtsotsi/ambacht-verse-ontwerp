# API Gateway Migration Guides

This document provides comprehensive migration guides for upgrading between API versions in Wesley's Ambacht API Gateway. The gateway supports backward compatibility, but migrating to newer versions provides enhanced features and better performance.

## Table of Contents

- [Overview](#overview)
- [Migration from v1 to v2](#migration-from-v1-to-v2)
- [Migration from v2 to v3](#migration-from-v2-to-v3)
- [Direct Migration from v1 to v3](#direct-migration-from-v1-to-v3)
- [Deprecation Timeline](#deprecation-timeline)
- [Testing Your Migration](#testing-your-migration)
- [Rollback Procedures](#rollback-procedures)
- [Common Issues and Solutions](#common-issues-and-solutions)

## Overview

The Wesley's Ambacht API Gateway provides seamless version migration through:

- **Automatic Request/Response Transformation**: Requests are automatically transformed between versions
- **Backward Compatibility**: Older versions continue to work during migration period
- **Gradual Migration**: Migrate endpoints one at a time
- **Version Negotiation**: Clients can specify preferred API version
- **Migration Warnings**: Receive deprecation warnings in response headers

### Supported Versions

| Version | Status  | Support End Date | Features                                   |
| ------- | ------- | ---------------- | ------------------------------------------ |
| v1      | Legacy  | 2024-12-31       | Basic catering booking API                 |
| v2      | Current | Active           | Enhanced booking, real-time features       |
| v3      | Latest  | Active           | Full integration suite, advanced analytics |

## Migration from v1 to v2

### Key Changes in v2

1. **Field Name Changes**: Snake_case → camelCase
2. **Enhanced Error Handling**: Structured error responses
3. **Real-time Features**: WebSocket support for live updates
4. **Improved Validation**: More comprehensive input validation
5. **Performance Optimizations**: Caching and optimized queries

### Step-by-Step Migration

#### 1. Update Request Field Names

**v1 Request Format:**

```json
{
  "customer_name": "Jan van der Berg",
  "event_date": "2024-03-15",
  "event_time": "18:00",
  "guest_count": 25,
  "service": "corporate"
}
```

**v2 Request Format:**

```json
{
  "customerName": "Jan van der Berg",
  "eventDate": "2024-03-15",
  "eventTime": "18:00",
  "guestCount": 25,
  "serviceCategory": "corporate"
}
```

#### 2. Update Response Handling

**v1 Error Response:**

```json
{
  "error_code": "VALIDATION_ERROR",
  "error_message": "Guest count must be between 10 and 200",
  "data": {
    "field": "guest_count",
    "value": 5
  }
}
```

**v2 Error Response:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Guest count must be between 10 and 200",
    "details": {
      "field": "guestCount",
      "value": 5
    }
  }
}
```

#### 3. Update API Endpoints

| v1 Endpoint                | v2 Endpoint                | Changes                                  |
| -------------------------- | -------------------------- | ---------------------------------------- |
| `GET /api/v1/availability` | `GET /api/v2/availability` | Enhanced filtering options               |
| `POST /api/v1/bookings`    | `POST /api/v2/bookings`    | Additional validation, real-time updates |
| `GET /api/v1/quotes/{id}`  | `GET /api/v2/quotes/{id}`  | Enhanced quote breakdown                 |

#### 4. Code Examples

**JavaScript/TypeScript Migration:**

```typescript
// v1 Implementation
const createBookingV1 = async (bookingData: any) => {
  const response = await fetch("/api/v1/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customer_name: bookingData.customerName,
      event_date: bookingData.eventDate,
      event_time: bookingData.eventTime,
      guest_count: bookingData.guestCount,
      service: bookingData.serviceCategory,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_message);
  }

  return response.json();
};

// v2 Implementation
const createBookingV2 = async (bookingData: BookingRequest) => {
  const response = await fetch("/api/v2/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(bookingData), // Direct usage, no field transformation needed
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

**Python Migration:**

```python
# v1 Implementation
import requests

def create_booking_v1(booking_data: dict, token: str):
    url = "/api/v1/bookings"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    # Transform to v1 format
    v1_data = {
        "customer_name": booking_data["customerName"],
        "event_date": booking_data["eventDate"],
        "event_time": booking_data["eventTime"],
        "guest_count": booking_data["guestCount"],
        "service": booking_data["serviceCategory"]
    }

    response = requests.post(url, json=v1_data, headers=headers)
    response.raise_for_status()
    return response.json()

# v2 Implementation
def create_booking_v2(booking_data: dict, token: str):
    url = "/api/v2/bookings"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    response = requests.post(url, json=booking_data, headers=headers)

    if not response.ok:
        error_data = response.json()
        raise Exception(error_data["error"]["message"])

    return response.json()
```

#### 5. Gradual Migration Strategy

1. **Phase 1**: Update error handling to support both formats
2. **Phase 2**: Migrate read-only endpoints (GET requests)
3. **Phase 3**: Migrate write endpoints (POST/PUT/PATCH)
4. **Phase 4**: Enable real-time features
5. **Phase 5**: Remove v1 compatibility layer

## Migration from v2 to v3

### Key Changes in v3

1. **External Integration Support**: Direct integration with calendar, payment, CRM systems
2. **Advanced Analytics**: Enhanced metrics and reporting
3. **Improved Circuit Breaker**: Better fault tolerance
4. **Enhanced Security**: Additional security layers
5. **Performance Improvements**: Advanced caching and optimization

### Step-by-Step Migration

#### 1. Update Authentication

**v3 introduces enhanced JWT token validation:**

```typescript
// v2 Token Format
const tokenV2 = {
  sub: "user-id",
  exp: 1234567890,
  iat: 1234567890,
};

// v3 Enhanced Token Format
const tokenV3 = {
  sub: "user-id",
  exp: 1234567890,
  iat: 1234567890,
  scope: ["booking:read", "booking:write", "analytics:read"],
  version: "v3",
  integrations: ["calendar", "payment", "crm"],
};
```

#### 2. External Integration Endpoints

**New v3 Endpoints:**

```typescript
// Calendar Integration
POST / api / v3 / bookings / { id } / calendar - event;
DELETE / api / v3 / bookings / { id } / calendar - event;

// Payment Integration
POST / api / v3 / bookings / { id } / payment;
GET / api / v3 / payments / { transactionId } / status;

// CRM Integration
POST / api / v3 / contacts;
PUT / api / v3 / contacts / { id };

// Analytics
GET / api / v3 / analytics / bookings;
GET / api / v3 / analytics / revenue;
GET / api / v3 / analytics / performance;
```

#### 3. Enhanced Response Format

**v3 includes integration status and analytics data:**

```json
{
  "data": {
    "id": "booking-id",
    "customerName": "Jan van der Berg",
    "status": "confirmed"
    // ... other booking fields
  },
  "integrations": {
    "calendar": {
      "status": "synced",
      "eventId": "cal-event-123",
      "lastSync": "2024-03-15T10:30:00Z"
    },
    "payment": {
      "status": "pending",
      "transactionId": "pay-tx-456",
      "paymentUrl": "https://payment-provider.com/pay/456"
    },
    "crm": {
      "status": "synced",
      "contactId": "crm-contact-789"
    }
  },
  "analytics": {
    "bookingSource": "website",
    "sessionDuration": 1200,
    "conversionPath": ["homepage", "services", "booking"]
  }
}
```

#### 4. Code Examples

**Migration to v3 with Integrations:**

```typescript
interface BookingV3Response {
  data: Booking;
  integrations: {
    calendar?: IntegrationStatus;
    payment?: IntegrationStatus;
    crm?: IntegrationStatus;
  };
  analytics: AnalyticsData;
}

const createBookingV3 = async (
  bookingData: BookingRequest,
  integrations: string[] = [],
): Promise<BookingV3Response> => {
  const response = await fetch("/api/v3/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "X-Integrations": integrations.join(","), // Request specific integrations
    },
    body: JSON.stringify({
      ...bookingData,
      enableIntegrations: integrations,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};

// Usage with integrations
const booking = await createBookingV3(bookingData, [
  "calendar",
  "payment",
  "crm",
]);

// Handle integration results
if (booking.integrations.calendar?.status === "synced") {
  console.log("Calendar event created:", booking.integrations.calendar.eventId);
}

if (booking.integrations.payment?.status === "pending") {
  // Redirect to payment URL
  window.location.href = booking.integrations.payment.paymentUrl;
}
```

## Direct Migration from v1 to v3

For applications currently using v1, you can migrate directly to v3:

### Migration Checklist

- [ ] **Update field names**: Snake_case → camelCase
- [ ] **Update error handling**: Support new error format
- [ ] **Add integration handling**: Handle integration responses
- [ ] **Update authentication**: Ensure tokens have required scopes
- [ ] **Add analytics handling**: Process analytics data
- [ ] **Test all endpoints**: Verify functionality with v3
- [ ] **Update documentation**: Document integration usage

### Combined Migration Script

```typescript
class APIClientV3 {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    const url = `${this.baseUrl}/api/v3${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async createBooking(
    bookingData: any,
    enableIntegrations: string[] = [],
  ): Promise<any> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify({
        ...bookingData,
        enableIntegrations,
      }),
      headers: {
        "X-Integrations": enableIntegrations.join(","),
      },
    });
  }

  async getAnalytics(
    type: "bookings" | "revenue" | "performance",
    params: any = {},
  ): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/${type}?${queryString}`);
  }
}
```

## Deprecation Timeline

### v1 Deprecation Schedule

| Date       | Phase              | Action Required                   |
| ---------- | ------------------ | --------------------------------- |
| 2024-06-01 | Deprecation Notice | Start migration planning          |
| 2024-09-01 | Warning Phase      | Deprecation warnings in responses |
| 2024-11-01 | Limited Support    | Bug fixes only                    |
| 2024-12-31 | End of Life        | v1 endpoints disabled             |

### Migration Deadlines

- **v1 → v2**: Complete by November 1, 2024
- **v2 → v3**: Recommended by June 1, 2025
- **v1 → v3**: Complete by December 31, 2024

## Testing Your Migration

### Test Checklist

1. **Functionality Tests**

   - [ ] All CRUD operations work correctly
   - [ ] Error responses are handled properly
   - [ ] Authentication and authorization work
   - [ ] Rate limiting is respected

2. **Integration Tests**

   - [ ] Calendar integration creates events
   - [ ] Payment integration processes payments
   - [ ] CRM integration syncs contacts
   - [ ] Error handling for failed integrations

3. **Performance Tests**

   - [ ] Response times are acceptable
   - [ ] Circuit breaker functions correctly
   - [ ] Caching improves performance
   - [ ] Rate limits don't affect normal usage

4. **Analytics Tests**
   - [ ] Analytics data is captured
   - [ ] Metrics are accurate
   - [ ] Reporting endpoints work

### Testing Tools

```bash
# API Testing with curl
curl -X POST https://api.wesleysambacht.nl/v3/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Integrations: calendar,payment" \
  -d '{"customerName":"Test User","eventDate":"2024-04-01"}'

# Performance Testing with Artillery
npm install -g artillery
artillery run migration-test.yml
```

## Rollback Procedures

### Emergency Rollback

If issues arise during migration:

1. **Immediate Steps**

   ```bash
   # Switch back to previous version
   export API_VERSION=v2
   # or update environment variables
   ```

2. **Application-level Rollback**

   ```typescript
   const API_VERSION = process.env.MIGRATION_ISSUES === "true" ? "v2" : "v3";
   const baseUrl = `https://api.wesleysambacht.nl/${API_VERSION}`;
   ```

3. **Database Rollback** (if needed)
   - Ensure backward compatibility in data structures
   - Use feature flags to disable new features

### Gradual Rollback

For partial rollbacks:

```typescript
const endpoints = {
  bookings: process.env.ROLLBACK_BOOKINGS === "true" ? "v2" : "v3",
  analytics: process.env.ROLLBACK_ANALYTICS === "true" ? "v2" : "v3",
  integrations: "v3", // Keep advanced features if working
};
```

## Common Issues and Solutions

### Issue 1: Field Name Confusion

**Problem**: Mixed field naming conventions in requests

**Solution**:

```typescript
const normalizeFields = (data: any): any => {
  const fieldMap = {
    customer_name: "customerName",
    event_date: "eventDate",
    event_time: "eventTime",
    guest_count: "guestCount",
  };

  const normalized = { ...data };
  for (const [oldField, newField] of Object.entries(fieldMap)) {
    if (oldField in normalized) {
      normalized[newField] = normalized[oldField];
      delete normalized[oldField];
    }
  }
  return normalized;
};
```

### Issue 2: Integration Failures

**Problem**: External integrations fail or timeout

**Solution**: Implement proper error handling:

```typescript
const handleIntegrationResponse = (response: BookingV3Response) => {
  const { integrations } = response;

  // Check each integration status
  Object.entries(integrations).forEach(([type, status]) => {
    if (status?.status === "error") {
      console.warn(`${type} integration failed:`, status.error);
      // Handle gracefully - booking still succeeds
    }
  });
};
```

### Issue 3: Authentication Scope Issues

**Problem**: v3 requires additional token scopes

**Solution**: Update token generation:

```typescript
const generateV3Token = (userId: string, permissions: string[]) => {
  return jwt.sign(
    {
      sub: userId,
      scope: permissions,
      version: "v3",
      integrations: ["calendar", "payment", "crm"],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    },
    JWT_SECRET,
  );
};
```

### Issue 4: Rate Limiting Changes

**Problem**: Different rate limits in v3

**Solution**: Implement adaptive rate limiting:

```typescript
class RateLimitedClient {
  private version: string;
  private limits: Record<string, number>;

  constructor(version: string) {
    this.version = version;
    this.limits = {
      v1: 100,
      v2: 200,
      v3: 300,
    };
  }

  private async checkRateLimit(): Promise<void> {
    const limit = this.limits[this.version];
    // Implement rate limiting logic
  }
}
```

## Support and Resources

### Documentation

- [API Reference](../api-reference.md)
- [Integration Guide](../integrations.md)
- [Error Codes](../error-codes.md)

### Support Channels

- **Technical Support**: api-support@wesleysambacht.nl
- **Migration Help**: migration-help@wesleysambacht.nl
- **Documentation**: https://developers.wesleysambacht.nl

### Migration Timeline Assistance

For complex migrations or custom timelines, contact our migration support team. We provide:

- Custom migration planning
- Dedicated support during migration
- Performance optimization guidance
- Integration assistance

---

_This migration guide is maintained by the Wesley's Ambacht API Team. Last updated: March 2024_
