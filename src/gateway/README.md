# Wesley's Ambacht API Gateway

A comprehensive, production-ready API Gateway implementation for Wesley's Ambacht catering services, featuring versioning, circuit breakers, health monitoring, external integrations, and request transformation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Components](#components)
- [Usage Examples](#usage-examples)
- [Monitoring and Health Checks](#monitoring-and-health-checks)
- [External Integrations](#external-integrations)
- [Migration and Versioning](#migration-and-versioning)
- [Performance and Scaling](#performance-and-scaling)
- [Security](#security)
- [Development and Testing](#development-and-testing)
- [API Documentation](#api-documentation)

## Overview

The Wesley's Ambacht API Gateway serves as the central entry point for all API requests to the catering booking system. It provides a unified interface for multiple API versions while handling authentication, rate limiting, request transformation, circuit breaking, and external service integrations.

### Key Benefits

- **Unified API Interface**: Single entry point for all API versions (v1, v2, v3)
- **Backward Compatibility**: Seamless support for legacy API versions
- **High Availability**: Circuit breaker patterns and health monitoring
- **Scalable Architecture**: Designed for high-throughput production environments
- **External Integration Ready**: Built-in support for calendar, payment, CRM, and other services
- **Comprehensive Monitoring**: Real-time metrics, alerts, and performance tracking

## Features

### Core Gateway Features

- **Multi-version API Support**: Automatic routing and transformation between v1, v2, and v3
- **Request/Response Transformation**: Automatic field mapping and format conversion
- **Circuit Breaker Pattern**: Fault tolerance with automatic recovery
- **Rate Limiting**: Version-aware rate limiting with configurable thresholds
- **Health Monitoring**: Comprehensive health checks and readiness probes
- **Metrics Collection**: Real-time performance metrics and alerting
- **Security Middleware**: Authentication, authorization, and security headers
- **External Integrations**: Unified interface for calendar, payment, CRM, and accounting systems

### Advanced Features

- **Smart Request Routing**: Path-based routing with wildcard and parameter support
- **Automatic Retry Logic**: Configurable retry mechanisms for failed requests
- **Response Caching**: Intelligent caching for improved performance
- **Request Logging**: Comprehensive request/response logging with correlation IDs
- **Error Standardization**: Consistent error formats across all API versions
- **Migration Assistance**: Tools and guides for seamless version migrations

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Apps   │───▶│   API Gateway    │───▶│  Backend APIs   │
│                 │    │                  │    │                 │
│ - Web App       │    │ - Routing        │    │ - Supabase      │
│ - Mobile App    │    │ - Transformation │    │ - Business Logic│
│ - Partner APIs  │    │ - Security       │    │ - Database      │
└─────────────────┘    │ - Rate Limiting  │    └─────────────────┘
                       │ - Health Checks  │             │
                       │ - Metrics        │             │
                       └──────────────────┘             │
                                │                       │
                       ┌──────────────────┐             │
                       │   External       │◀────────────┘
                       │  Integrations    │
                       │                  │
                       │ - Calendar       │
                       │ - Payment        │
                       │ - CRM            │
                       │ - Email/SMS      │
                       │ - Accounting     │
                       └──────────────────┘
```

### Component Architecture

```
APIGateway
├── CircuitBreaker       # Fault tolerance
├── HealthChecker        # Health monitoring
├── MetricsCollector     # Performance tracking
├── RequestTransformer   # Version compatibility
├── ExternalIntegrations # Third-party services
└── Middleware Stack
    ├── Security
    ├── Versioning
    ├── Rate Limiting
    ├── Metrics
    ├── Transformation
    └── Circuit Breaker
```

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Basic Usage

```typescript
import { APIGateway, DEFAULT_GATEWAY_CONFIG } from "./gateway/APIGateway";

// Initialize the gateway
const gateway = new APIGateway(DEFAULT_GATEWAY_CONFIG);

// Register your routes
gateway.registerRoute({
  path: "/api/v3/bookings",
  version: "v3",
  method: "POST",
  handler: async (request, context) => {
    // Your booking logic here
    return new Response(JSON.stringify({ success: true }));
  },
  middleware: [
    // Custom middleware
  ],
  circuitBreaker: true,
  transformRequest: true,
  transformResponse: true,
  rateLimit: {
    requests: 50,
    window: 60000, // 1 minute
  },
});

// Handle incoming requests
const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    return await gateway.handleRequest(request);
  },
});

console.log("API Gateway running on http://localhost:3000");
```

## Configuration

### Environment Variables

```bash
# Gateway Configuration
GATEWAY_BASE_URL=https://api.wesleysambacht.nl
GATEWAY_TIMEOUT=30000
GATEWAY_RETRY_ATTEMPTS=3
GATEWAY_CIRCUIT_BREAKER_THRESHOLD=5
GATEWAY_HEALTH_CHECK_INTERVAL=60000

# Feature Toggles
ENABLE_METRICS=true
ENABLE_TRANSFORMATIONS=true
ENABLE_CIRCUIT_BREAKERS=true
ENABLE_RATE_LIMITING=true

# External Integrations
CALENDAR_API_KEY=your_calendar_api_key
PAYMENT_API_KEY=your_payment_api_key
CRM_API_KEY=your_crm_api_key
EMAIL_API_KEY=your_email_api_key

# Monitoring
METRICS_ENDPOINT=/metrics
HEALTH_ENDPOINT=/health
READINESS_ENDPOINT=/ready
```

### Gateway Configuration

```typescript
import { GatewayConfig } from "./gateway/APIGateway";

const config: GatewayConfig = {
  baseUrl: process.env.GATEWAY_BASE_URL || "https://api.wesleysambacht.nl",
  timeout: 30000,
  retryAttempts: 3,
  circuitBreakerThreshold: 5,
  healthCheckInterval: 60000,
  metricsEnabled: true,
  transformationsEnabled: true,
};
```

## Components

### 1. APIGateway (Main Orchestrator)

The central gateway class that orchestrates all requests and responses.

```typescript
import { APIGateway } from "./gateway/APIGateway";

const gateway = new APIGateway(config);

// Register routes
gateway.registerRoute({
  path: "/api/v3/bookings/:id",
  version: "v3",
  method: "GET",
  handler: async (request, context) => {
    const id = context.params.id;
    // Handle booking retrieval
  },
});
```

### 2. CircuitBreaker (Fault Tolerance)

Implements the circuit breaker pattern for resilient service communication.

```typescript
import { CircuitBreaker } from "./gateway/CircuitBreaker";

const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
  monitoringPeriod: 30000,
});

// Use with async operations
const result = await circuitBreaker.execute(async () => {
  return await externalServiceCall();
});
```

### 3. HealthChecker (Health Monitoring)

Provides comprehensive health and readiness checks.

```typescript
import { HealthChecker } from "./gateway/HealthChecker";

const healthChecker = new HealthChecker();

// Add custom health checks
healthChecker.addHealthCheck("database", {
  check: async () => {
    // Check database connectivity
    return { healthy: true };
  },
  timeout: 5000,
  interval: 30000,
});

// Check health status
const health = await healthChecker.checkHealth();
console.log(`System is ${health.status}`);
```

### 4. MetricsCollector (Performance Monitoring)

Collects and aggregates performance metrics with alerting capabilities.

```typescript
import { MetricsCollector } from "./gateway/MetricsCollector";

const metrics = new MetricsCollector();

// Record request metrics
metrics.recordRequest("req_123", {
  method: "POST",
  path: "/api/v3/bookings",
  statusCode: 201,
  duration: 150,
});

// Get aggregated metrics
const summary = await metrics.getMetrics();
console.log(
  `Average response time: ${summary.current.performance.averageResponseTime}ms`,
);
```

### 5. RequestTransformer (Version Compatibility)

Handles automatic transformation between API versions.

```typescript
import { RequestTransformer } from "./gateway/RequestTransformer";

const transformer = new RequestTransformer();

// Transform request
const transformedRequest = await transformer.transformRequest(request);

// Transform response
const transformedResponse = await transformer.transformResponse(
  response,
  request,
);
```

### 6. ExternalIntegrations (Third-party Services)

Unified interface for external service integrations.

```typescript
import { ExternalIntegrations } from "./gateway/ExternalIntegrations";

const integrations = new ExternalIntegrations();

// Calendar integration
const calendarResult = await integrations.createCalendarEvent({
  title: "Catering Event",
  startTime: new Date("2024-03-15T18:00:00Z"),
  endTime: new Date("2024-03-15T22:00:00Z"),
  attendees: ["customer@example.com"],
});

// Payment integration
const paymentResult = await integrations.createPayment({
  amount: 250.0,
  currency: "EUR",
  description: "Catering service payment",
});
```

## Usage Examples

### Basic Request Handling

```typescript
// Set up the gateway
const gateway = new APIGateway(config);

// Register a simple route
gateway.registerRoute({
  path: "/api/v3/health",
  version: "v3",
  method: "GET",
  handler: async (request, context) => {
    return new Response(JSON.stringify({ status: "healthy" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
});
```

### Advanced Route with Middleware

```typescript
gateway.registerRoute({
  path: "/api/v3/bookings",
  version: "v3",
  method: "POST",
  handler: async (request, context) => {
    // Extract booking data
    const bookingData = await request.json();

    // Create booking with integrations
    const booking = await createBooking(bookingData);

    // Trigger external integrations
    if (bookingData.enableIntegrations?.includes("calendar")) {
      await context.integrations.createCalendarEvent({
        title: `Catering for ${booking.customerName}`,
        startTime: new Date(booking.eventDate + "T" + booking.eventTime),
        endTime: new Date(booking.eventDate + "T" + booking.eventTime),
      });
    }

    return new Response(JSON.stringify({ data: booking }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },
  middleware: [
    // Custom validation middleware
    async (request, response, next) => {
      const body = await request.json();
      if (!body.customerName) {
        throw new Error("Customer name is required");
      }
      await next();
    },
  ],
  circuitBreaker: true,
  transformRequest: true,
  transformResponse: true,
  rateLimit: {
    requests: 50,
    window: 60000,
  },
});
```

### Version-Specific Routing

```typescript
// v1 endpoint (legacy)
gateway.registerRoute({
  path: "/api/v1/bookings",
  version: "v1",
  method: "POST",
  handler: async (request, context) => {
    // Handle legacy v1 format
    const data = await request.json();
    // Transform and process
    return legacyBookingHandler(data);
  },
  transformResponse: true, // Enable v1 response transformation
});

// v3 endpoint (current)
gateway.registerRoute({
  path: "/api/v3/bookings",
  version: "v3",
  method: "POST",
  handler: async (request, context) => {
    // Handle modern v3 format with integrations
    return modernBookingHandler(request, context);
  },
  circuitBreaker: true,
  transformRequest: true,
});
```

## Monitoring and Health Checks

### Built-in Endpoints

The gateway provides several monitoring endpoints:

- `GET /health` - Overall system health
- `GET /ready` - Readiness probe for Kubernetes
- `GET /metrics` - Performance metrics and statistics

### Custom Health Checks

```typescript
const healthChecker = new HealthChecker();

// Database health check
healthChecker.addHealthCheck("database", {
  check: async () => {
    try {
      await database.query("SELECT 1");
      return { healthy: true };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  },
  timeout: 5000,
  interval: 30000,
});

// External API health check
healthChecker.addHealthCheck("payment-api", {
  check: async () => {
    try {
      const response = await fetch("https://payment-api.com/health");
      return { healthy: response.ok };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  },
  timeout: 10000,
  interval: 60000,
});
```

### Metrics and Alerting

```typescript
const metrics = new MetricsCollector();

// Custom alert rule
metrics.registerAlertRule({
  name: "booking_creation_errors",
  description: "High error rate on booking creation",
  severity: "high",
  cooldown: 15, // minutes
  enabled: true,
  condition: (metrics) => {
    const bookingErrors = metrics.errors.byPath["/api/v3/bookings"] || 0;
    const bookingRequests = metrics.requests.byPath["/api/v3/bookings"] || 0;
    return bookingRequests > 10 && bookingErrors / bookingRequests > 0.1;
  },
});
```

## External Integrations

### Calendar Integration

```typescript
import { createIntegration } from "./gateway/ExternalIntegrations";

// Register calendar integration
const calendarIntegration = createIntegration.mockCalendar("google-calendar");
integrations.registerIntegration(calendarIntegration);

// Use in your handlers
const event = await integrations.createCalendarEvent({
  title: "Catering Event - Corporate Lunch",
  description: "Premium catering service for 25 guests",
  startTime: new Date("2024-03-15T12:00:00Z"),
  endTime: new Date("2024-03-15T14:00:00Z"),
  location: "Conference Room A, Amsterdam",
  attendees: ["customer@company.com", "organizer@wesleysambacht.nl"],
});
```

### Payment Integration

```typescript
// Process payment
const payment = await integrations.createPayment({
  amount: 375.0,
  currency: "EUR",
  description: "Premium catering service - 25 guests",
  customerId: "customer_123",
  returnUrl: "https://wesleysambacht.nl/booking/success",
  webhookUrl: "https://api.wesleysambacht.nl/webhooks/payment",
});

// Handle payment webhook
gateway.registerRoute({
  path: "/webhooks/payment",
  version: "v3",
  method: "POST",
  handler: async (request, context) => {
    const paymentData = await request.json();

    // Update booking status
    await updateBookingPaymentStatus(paymentData.bookingId, paymentData.status);

    // Send confirmation email
    if (paymentData.status === "completed") {
      await context.integrations.sendEmail({
        to: [paymentData.customerEmail],
        subject: "Payment Confirmed - Wesley's Ambacht",
        htmlContent: generatePaymentConfirmationEmail(paymentData),
      });
    }

    return new Response("OK", { status: 200 });
  },
});
```

### CRM Integration

```typescript
// Create or update customer in CRM
const contact = await integrations.createCRMContact({
  email: "customer@example.com",
  firstName: "Jan",
  lastName: "van der Berg",
  company: "ABC Consulting B.V.",
  phone: "+31 6 12345678",
  tags: ["catering-customer", "corporate"],
  customFields: {
    eventType: "corporate",
    guestCount: 25,
    lastBookingDate: "2024-03-15",
  },
  source: "api-gateway-v3",
});
```

## Migration and Versioning

### Automatic Version Transformation

The gateway automatically transforms requests and responses between API versions:

```typescript
// Client sends v1 request
const v1Request = {
  customer_name: "Jan van der Berg",
  event_date: "2024-03-15",
  guest_count: 25,
  service: "corporate",
};

// Gateway automatically transforms to v2/v3 format internally
const transformedRequest = {
  customerName: "Jan van der Berg",
  eventDate: "2024-03-15",
  guestCount: 25,
  serviceCategory: "corporate",
};
```

### Migration Warnings

The gateway provides deprecation warnings for older API versions:

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-API-Version: v1
X-Deprecation-Warning: API version v1 is deprecated. Please migrate to v3 by 2024-12-31
X-Migration-Guide: https://docs.wesleysambacht.nl/migration/v1-to-v3
```

### Version Negotiation

Clients can specify their preferred API version:

```http
GET /api/bookings HTTP/1.1
Accept: application/json
X-API-Version: v3
```

## Performance and Scaling

### Circuit Breaker Configuration

```typescript
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5, // Open after 5 failures
  resetTimeout: 60000, // Try to close after 60 seconds
  monitoringPeriod: 30000, // Monitor period for failure counting
  timeout: 10000, // Individual request timeout
});
```

### Rate Limiting

```typescript
// Version-aware rate limiting
gateway.registerRoute({
  path: "/api/v3/bookings",
  version: "v3",
  method: "POST",
  handler: bookingHandler,
  rateLimit: {
    requests: 50, // 50 requests
    window: 60000, // per minute
  },
});
```

### Performance Optimization

```typescript
// Enable response caching
gateway.registerRoute({
  path: "/api/v3/availability",
  version: "v3",
  method: "GET",
  handler: availabilityHandler,
  cache: {
    ttl: 300000, // 5 minutes
    vary: ["date", "location"],
  },
});
```

## Security

### Security Headers

The gateway automatically applies security headers to all responses:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Request-ID: req_1234567890_abcdef
```

### Authentication and Authorization

```typescript
// Custom authentication middleware
const authMiddleware = async (request, response, next) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    request.user = payload;
    await next();
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Apply to routes
gateway.registerRoute({
  path: "/api/v3/bookings",
  version: "v3",
  method: "POST",
  handler: bookingHandler,
  middleware: [authMiddleware],
});
```

## Development and Testing

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Performance tests
npm run test:performance

# Health check tests
npm run test:health
```

### Development Mode

```typescript
import { createMetricsCollector } from "./gateway/MetricsCollector";

// Use development metrics collector (reduced alerting)
const metrics = createMetricsCollector.development();

const gateway = new APIGateway({
  ...config,
  metricsEnabled: true,
  transformationsEnabled: true,
});
```

### Testing External Integrations

```typescript
import { createIntegration } from "./gateway/ExternalIntegrations";

// Use mock integrations for testing
const mockCalendar = createIntegration.mockCalendar("test-calendar");
const mockPayment = createIntegration.mockPayment("test-payment");

integrations.registerIntegration(mockCalendar);
integrations.registerIntegration(mockPayment);
```

## API Documentation

### OpenAPI Integration

The gateway works seamlessly with the existing OpenAPI specification:

- **Base URL**: `https://api.wesleysambacht.nl`
- **API Versions**: v1, v2, v3
- **Authentication**: Bearer JWT tokens
- **Rate Limits**: Version-specific limits
- **Error Format**: Standardized error responses

### Key Endpoints

| Endpoint               | Version | Method | Description                      |
| ---------------------- | ------- | ------ | -------------------------------- |
| `/api/v3/bookings`     | v3      | POST   | Create booking with integrations |
| `/api/v3/availability` | v3      | GET    | Get availability with caching    |
| `/api/v3/quotes`       | v3      | POST   | Generate quote with analytics    |
| `/health`              | All     | GET    | Health check                     |
| `/ready`               | All     | GET    | Readiness probe                  |
| `/metrics`             | All     | GET    | Performance metrics              |

### Response Format

All v3 responses follow this format:

```json
{
  "data": {
    // Primary response data
  },
  "integrations": {
    "calendar": { "status": "synced", "eventId": "cal_123" },
    "payment": { "status": "pending", "transactionId": "pay_456" },
    "crm": { "status": "synced", "contactId": "crm_789" }
  },
  "analytics": {
    "bookingSource": "website",
    "sessionDuration": 1200,
    "conversionPath": ["homepage", "services", "booking"]
  }
}
```

---

## Support and Maintenance

For support, questions, or issues:

- **Technical Support**: api-support@wesleysambacht.nl
- **Migration Help**: migration-help@wesleysambacht.nl
- **Documentation**: https://developers.wesleysambacht.nl
- **Status Page**: https://status.wesleysambacht.nl

## License

This API Gateway is part of the Wesley's Ambacht platform and is proprietary software.

---

_This documentation is maintained by the Wesley's Ambacht Development Team. Last updated: March 2024_
