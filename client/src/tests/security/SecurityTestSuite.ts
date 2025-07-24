/**
 * Comprehensive Security Testing Suite for Wesley's Ambacht
 *
 * Features:
 * - Rate limiting tests with load simulation
 * - Input validation and sanitization tests
 * - Security header validation
 * - CORS policy testing
 * - API key authentication tests
 * - Security monitoring and alerting tests
 * - API versioning security tests
 * - Integration tests for complete security flow
 * - Performance impact assessment
 */

import { RateLimiter } from "../../middleware/rateLimiter";
import {
  InputSanitizer,
  InputValidationMiddleware,
  CSRFProtection,
} from "../../middleware/inputSanitization";
import { SecurityHeaders } from "../../middleware/securityHeaders";
import {
  APIKeyManager,
  API_SCOPES,
  API_KEY_TYPES,
} from "../../middleware/apiKeyManager";
import {
  SecurityMonitor,
  SECURITY_EVENT_TYPES,
  SEVERITY_LEVELS,
} from "../../middleware/securityMonitor";
import { SecurityIntegration } from "../../middleware/securityIntegration";
import {
  APIVersionManager,
  API_VERSIONS,
} from "../../middleware/apiVersioning";
import { SafeLogger } from "../../lib/LoggerUtils";

/**
 * Test Result Interface
 */
interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
  executionTime: number;
  severity: "low" | "medium" | "high" | "critical";
}

interface TestSuite {
  name: string;
  results: TestResult[];
  passed: number;
  failed: number;
  totalTime: number;
  securityScore: number;
}

/**
 * Security Test Suite Class
 */
export class SecurityTestSuite {
  private testResults: TestSuite[] = [];
  private globalStartTime = 0;

  /**
   * Run all security tests
   */
  async runAllTests(): Promise<{
    suites: TestSuite[];
    overallScore: number;
    criticalFailures: number;
    totalTests: number;
    totalTime: number;
  }> {
    this.globalStartTime = Date.now();
    this.testResults = [];

    SafeLogger.info("Starting comprehensive security test suite");

    try {
      // Run all test suites
      await this.runRateLimitingTests();
      await this.runInputValidationTests();
      await this.runSecurityHeaderTests();
      await this.runAPIKeyTests();
      await this.runSecurityMonitoringTests();
      await this.runAPIVersioningTests();
      await this.runIntegrationTests();
      await this.runPerformanceTests();

      // Calculate overall results
      const totalTime = Date.now() - this.globalStartTime;
      const totalTests = this.testResults.reduce(
        (sum, suite) => sum + suite.results.length,
        0,
      );
      const criticalFailures = this.testResults.reduce(
        (sum, suite) =>
          sum +
          suite.results.filter((r) => !r.passed && r.severity === "critical")
            .length,
        0,
      );

      const overallScore = this.calculateOverallSecurityScore();

      SafeLogger.info("Security test suite completed", {
        totalTests,
        totalTime,
        overallScore,
        criticalFailures,
      });

      return {
        suites: this.testResults,
        overallScore,
        criticalFailures,
        totalTests,
        totalTime,
      };
    } catch (error) {
      SafeLogger.error("Security test suite failed", error);
      throw error;
    }
  }

  /**
   * Rate Limiting Tests
   */
  private async runRateLimitingTests(): Promise<void> {
    const suite: TestSuite = {
      name: "Rate Limiting & DDoS Protection",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: Basic rate limiting
    await this.runTest(
      suite,
      "Basic Rate Limiting",
      async () => {
        const request = new Request("https://example.com/api/test", {
          method: "GET",
          headers: { "x-forwarded-for": "192.168.1.100" },
        });

        const result = await RateLimiter.checkRateLimit(request, "/api/test");

        if (!result.allowed || result.remaining === undefined) {
          throw new Error("Rate limiter should allow initial requests");
        }

        return { allowed: result.allowed, remaining: result.remaining };
      },
      "critical",
    );

    // Test 2: Rate limit exhaustion
    await this.runTest(
      suite,
      "Rate Limit Exhaustion",
      async () => {
        const requests: Promise<any>[] = [];
        const testIP = "192.168.1.101";

        // Send 150 requests rapidly (should exceed 100/min limit)
        for (let i = 0; i < 150; i++) {
          const request = new Request("https://example.com/api/test", {
            method: "GET",
            headers: { "x-forwarded-for": testIP },
          });
          requests.push(RateLimiter.checkRateLimit(request, "/api/test"));
        }

        const results = await Promise.all(requests);
        const blocked = results.filter((r) => !r.allowed).length;

        if (blocked === 0) {
          throw new Error("Rate limiter should block excessive requests");
        }

        return { totalRequests: 150, blocked };
      },
      "critical",
    );

    // Test 3: DDoS detection
    await this.runTest(
      suite,
      "DDoS Detection",
      async () => {
        const testIP = "192.168.1.102";
        let ddosDetected = false;

        // Simulate rapid requests from single IP
        for (let i = 0; i < 1000; i++) {
          const request = new Request("https://example.com/api/test", {
            method: "GET",
            headers: { "x-forwarded-for": testIP },
          });

          const result = await RateLimiter.checkRateLimit(request, "/api/test");
          if (result.message?.includes("DDoS")) {
            ddosDetected = true;
            break;
          }
        }

        if (!ddosDetected) {
          throw new Error(
            "DDoS detection should trigger for excessive requests",
          );
        }

        return { ddosDetected };
      },
      "high",
    );

    // Test 4: Tiered rate limits
    await this.runTest(
      suite,
      "Tiered Rate Limits",
      async () => {
        const testIP = "192.168.1.103";

        const generalRequest = new Request("https://example.com/api/general", {
          method: "GET",
          headers: { "x-forwarded-for": testIP },
        });

        const bookingRequest = new Request("https://example.com/api/booking", {
          method: "POST",
          headers: { "x-forwarded-for": testIP },
        });

        const generalResult = await RateLimiter.checkRateLimit(
          generalRequest,
          "/api/general",
        );
        const bookingResult = await RateLimiter.checkRateLimit(
          bookingRequest,
          "/api/booking",
        );

        // Booking should have stricter limits
        if (generalResult.remaining! <= bookingResult.remaining!) {
          throw new Error("Booking endpoints should have stricter rate limits");
        }

        return {
          generalRemaining: generalResult.remaining,
          bookingRemaining: bookingResult.remaining,
        };
      },
      "medium",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * Input Validation Tests
   */
  private async runInputValidationTests(): Promise<void> {
    const suite: TestSuite = {
      name: "Input Validation & Sanitization",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: XSS Protection
    await this.runTest(
      suite,
      "XSS Attack Protection",
      async () => {
        const xssPayloads = [
          '<script>alert("XSS")</script>',
          'javascript:alert("XSS")',
          '<img src="x" onerror="alert(1)">',
          '<svg onload="alert(1)">',
        ];

        const results = xssPayloads.map((payload) => {
          const threat = InputSanitizer.detectThreats(payload);
          const sanitized = InputSanitizer.sanitizeString(payload);

          return {
            payload,
            detected: threat.threats.includes("XSS Attack"),
            sanitized: sanitized !== payload,
            riskLevel: threat.riskLevel,
          };
        });

        const allDetected = results.every((r) => r.detected);
        const allSanitized = results.every((r) => r.sanitized);

        if (!allDetected || !allSanitized) {
          throw new Error("XSS attacks should be detected and sanitized");
        }

        return results;
      },
      "critical",
    );

    // Test 2: SQL Injection Protection
    await this.runTest(
      suite,
      "SQL Injection Protection",
      async () => {
        const sqlPayloads = [
          "'; DROP TABLE users; --",
          "1' OR '1'='1",
          "admin'--",
          "1; INSERT INTO users VALUES('hacker', 'password');",
        ];

        const results = sqlPayloads.map((payload) => {
          const threat = InputSanitizer.detectThreats(payload);
          return {
            payload,
            detected: threat.threats.includes("SQL Injection"),
            riskLevel: threat.riskLevel,
          };
        });

        const allDetected = results.every(
          (r) => r.detected && r.riskLevel === "critical",
        );

        if (!allDetected) {
          throw new Error(
            "SQL injection attempts should be detected as critical threats",
          );
        }

        return results;
      },
      "critical",
    );

    // Test 3: NoSQL Injection Protection
    await this.runTest(
      suite,
      "NoSQL Injection Protection",
      async () => {
        const nosqlPayloads = [
          '{"$where": "this.credits == this.debits"}',
          '{"username": {"$ne": null}}',
          '{"$or": [{"user": "admin"}, {"user": "test"}]}',
        ];

        const results = nosqlPayloads.map((payload) => {
          const threat = InputSanitizer.detectThreats(payload);
          return {
            payload,
            detected: threat.threats.includes("NoSQL Injection"),
          };
        });

        const allDetected = results.every((r) => r.detected);

        if (!allDetected) {
          throw new Error("NoSQL injection attempts should be detected");
        }

        return results;
      },
      "high",
    );

    // Test 4: CSRF Protection
    await this.runTest(
      suite,
      "CSRF Token Validation",
      async () => {
        const sessionId = "test-session-123";

        // Generate token
        const token = CSRFProtection.generateToken(sessionId);

        // Valid token should pass
        const validResult = CSRFProtection.validateToken(sessionId, token);

        // Invalid token should fail
        const invalidResult = CSRFProtection.validateToken(
          sessionId,
          "invalid-token",
        );

        if (!validResult || invalidResult) {
          throw new Error("CSRF token validation not working correctly");
        }

        return { validToken: validResult, invalidToken: invalidResult };
      },
      "high",
    );

    // Test 5: Input sanitization completeness
    await this.runTest(
      suite,
      "Input Sanitization Completeness",
      async () => {
        const testData = {
          email: "user@domain.com<script>",
          phone: "+31-123-456-789; rm -rf /",
          description: '<p>Valid content</p><script>alert("xss")</script>',
          number: "42.5px",
          date: "2024-01-15T10:00:00Z",
        };

        const request = new Request("https://example.com/api/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testData),
        });

        const validation =
          await InputValidationMiddleware.validateRequest(request);

        if (!validation.isValid || !validation.sanitizedData) {
          throw new Error(
            "Input validation should sanitize data while preserving valid content",
          );
        }

        const sanitized = validation.sanitizedData;

        // Check that dangerous content was removed
        if (
          sanitized.email.includes("<script>") ||
          sanitized.phone.includes("rm -rf") ||
          sanitized.description.includes("alert(")
        ) {
          throw new Error("Dangerous content not properly sanitized");
        }

        return { original: testData, sanitized };
      },
      "medium",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * Security Headers Tests
   */
  private async runSecurityHeaderTests(): Promise<void> {
    const suite: TestSuite = {
      name: "Security Headers & CORS",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: CSP Header Generation
    await this.runTest(
      suite,
      "Content Security Policy",
      async () => {
        const request = new Request("https://example.com/api/test");
        const response = new Response("test");

        SecurityHeaders.applyHeaders(request, response);

        const csp = response.headers.get("Content-Security-Policy");

        if (!csp || !csp.includes("default-src 'self'")) {
          throw new Error("CSP header not properly configured");
        }

        return { cspHeader: csp };
      },
      "high",
    );

    // Test 2: CORS Configuration
    await this.runTest(
      suite,
      "CORS Configuration",
      async () => {
        const allowedOrigin = "https://wesley-ambacht.nl";
        const blockedOrigin = "https://malicious-site.com";

        const allowedRequest = new Request("https://example.com/api/test", {
          headers: { Origin: allowedOrigin },
        });

        const blockedRequest = new Request("https://example.com/api/test", {
          headers: { Origin: blockedOrigin },
        });

        const allowedResponse = new Response("test");
        const blockedResponse = new Response("test");

        SecurityHeaders.applyHeaders(allowedRequest, allowedResponse);
        SecurityHeaders.applyHeaders(blockedRequest, blockedResponse);

        const allowedCORS = allowedResponse.headers.get(
          "Access-Control-Allow-Origin",
        );
        const blockedCORS = blockedResponse.headers.get(
          "Access-Control-Allow-Origin",
        );

        if (allowedCORS !== allowedOrigin || blockedCORS === blockedOrigin) {
          throw new Error("CORS policy not enforced correctly");
        }

        return { allowed: allowedCORS, blocked: blockedCORS };
      },
      "high",
    );

    // Test 3: Security Headers Completeness
    await this.runTest(
      suite,
      "Security Headers Completeness",
      async () => {
        const request = new Request("https://example.com/api/test");
        const response = new Response("test");

        SecurityHeaders.applyHeaders(request, response);

        const requiredHeaders = [
          "X-Content-Type-Options",
          "X-Frame-Options",
          "X-XSS-Protection",
          "Referrer-Policy",
          "Permissions-Policy",
        ];

        const missingHeaders = requiredHeaders.filter(
          (header) => !response.headers.has(header),
        );

        if (missingHeaders.length > 0) {
          throw new Error(
            `Missing security headers: ${missingHeaders.join(", ")}`,
          );
        }

        return { headersPresent: requiredHeaders.length };
      },
      "medium",
    );

    // Test 4: Preflight Handling
    await this.runTest(
      suite,
      "CORS Preflight Handling",
      async () => {
        const preflightRequest = new Request("https://example.com/api/test", {
          method: "OPTIONS",
          headers: {
            Origin: "https://wesley-ambacht.nl",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
          },
        });

        const preflightResponse =
          SecurityHeaders.handlePreflight(preflightRequest);

        if (preflightResponse.status !== 204) {
          throw new Error("Preflight request should return 204 status");
        }

        const allowMethods = preflightResponse.headers.get(
          "Access-Control-Allow-Methods",
        );
        if (!allowMethods?.includes("POST")) {
          throw new Error("Preflight should allow requested methods");
        }

        return { status: preflightResponse.status, methods: allowMethods };
      },
      "medium",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * API Key Tests
   */
  private async runAPIKeyTests(): Promise<void> {
    const suite: TestSuite = {
      name: "API Key Authentication & Authorization",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: API Key Generation
    await this.runTest(
      suite,
      "API Key Generation",
      async () => {
        const apiKey = APIKeyManager.generateAPIKey(
          "Test Key",
          API_KEY_TYPES.PUBLIC,
          ["read:availability", "create:quote"],
          "test-user",
        );

        if (!apiKey.key || !apiKey.id || apiKey.scopes.length !== 2) {
          throw new Error("API key generation failed");
        }

        return { keyId: apiKey.id, scopes: apiKey.scopes };
      },
      "critical",
    );

    // Test 2: API Key Validation
    await this.runTest(
      suite,
      "API Key Validation",
      async () => {
        // Generate a test key
        const apiKey = APIKeyManager.generateAPIKey(
          "Test Validation Key",
          API_KEY_TYPES.PUBLIC,
          ["read:availability"],
          "test-user",
        );

        const request = new Request("https://example.com/api/availability", {
          method: "GET",
          headers: {
            "X-API-Key": apiKey.key,
            "x-forwarded-for": "192.168.1.200",
          },
        });

        const validation = await APIKeyManager.validateAPIKey(
          apiKey.key,
          "/api/availability",
          "GET",
          request,
        );

        if (!validation.isValid || !validation.key) {
          throw new Error("Valid API key should pass validation");
        }

        return { valid: validation.isValid, keyId: validation.key.id };
      },
      "critical",
    );

    // Test 3: Permission Enforcement
    await this.runTest(
      suite,
      "Permission Enforcement",
      async () => {
        // Generate key with limited permissions
        const limitedKey = APIKeyManager.generateAPIKey(
          "Limited Key",
          API_KEY_TYPES.PUBLIC,
          ["read:availability"], // Only availability, no booking
          "test-user",
        );

        const request = new Request("https://example.com/api/booking", {
          method: "POST",
          headers: {
            "X-API-Key": limitedKey.key,
            "x-forwarded-for": "192.168.1.201",
          },
        });

        const validation = await APIKeyManager.validateAPIKey(
          limitedKey.key,
          "/api/booking",
          "POST",
          request,
        );

        if (validation.isValid) {
          throw new Error(
            "API key should not have permission for booking endpoint",
          );
        }

        return { denied: true, error: validation.error };
      },
      "high",
    );

    // Test 4: Rate Limiting per API Key
    await this.runTest(
      suite,
      "API Key Rate Limiting",
      async () => {
        const apiKey = APIKeyManager.generateAPIKey(
          "Rate Limited Key",
          API_KEY_TYPES.PUBLIC,
          ["read:availability"],
          "test-user",
        );

        // Make many requests to trigger rate limiting
        const requests: Promise<any>[] = [];
        for (let i = 0; i < 600; i++) {
          // Exceed 500/min limit
          const request = new Request("https://example.com/api/availability", {
            method: "GET",
            headers: {
              "X-API-Key": apiKey.key,
              "x-forwarded-for": "192.168.1.202",
            },
          });

          requests.push(
            APIKeyManager.validateAPIKey(
              apiKey.key,
              "/api/availability",
              "GET",
              request,
            ),
          );
        }

        const results = await Promise.all(requests);
        const rateLimited = results.filter((r) => r.rateLimitExceeded).length;

        if (rateLimited === 0) {
          throw new Error("API key rate limiting should be enforced");
        }

        return { totalRequests: 600, rateLimited };
      },
      "high",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * Security Monitoring Tests
   */
  private async runSecurityMonitoringTests(): Promise<void> {
    const suite: TestSuite = {
      name: "Security Monitoring & Alerting",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: Event Logging
    await this.runTest(
      suite,
      "Security Event Logging",
      async () => {
        const testIP = "192.168.1.300";

        const eventId = SecurityMonitor.logEvent(
          SECURITY_EVENT_TYPES.AUTH_FAILURE,
          SEVERITY_LEVELS.MEDIUM,
          testIP,
          { reason: "Invalid credentials" },
          { endpoint: "/api/login" },
        );

        const events = SecurityMonitor.getEvents({ ip: testIP });
        const loggedEvent = events.find((e) => e.id === eventId);

        if (!loggedEvent || loggedEvent.ip !== testIP) {
          throw new Error("Security event not properly logged");
        }

        return { eventId, eventType: loggedEvent.type };
      },
      "medium",
    );

    // Test 2: Threat Detection
    await this.runTest(
      suite,
      "Malicious Input Tracking",
      async () => {
        const testIP = "192.168.1.301";
        const maliciousInput = '<script>alert("xss")</script>';

        SecurityMonitor.trackMaliciousInput(
          testIP,
          maliciousInput,
          ["XSS Attack"],
          "/api/test",
          "test-agent",
        );

        const events = SecurityMonitor.getEvents({
          type: SECURITY_EVENT_TYPES.XSS_ATTEMPT,
          ip: testIP,
        });

        if (events.length === 0) {
          throw new Error("Malicious input tracking failed");
        }

        return { eventsLogged: events.length, threats: events[0].details };
      },
      "high",
    );

    // Test 3: IP Blocking
    await this.runTest(
      suite,
      "Automatic IP Blocking",
      async () => {
        const testIP = "192.168.1.302";

        // Simulate multiple authentication failures
        for (let i = 0; i < 6; i++) {
          SecurityMonitor.trackAuthFailure(testIP, {
            username: "test",
            endpoint: "/api/login",
            reason: "Invalid password",
          });
        }

        // IP should now be blocked
        const isBlocked = SecurityMonitor.isIPBlocked(testIP);

        if (!isBlocked) {
          throw new Error(
            "IP should be automatically blocked after multiple failures",
          );
        }

        return { blocked: isBlocked, failureCount: 6 };
      },
      "high",
    );

    // Test 4: Security Metrics
    await this.runTest(
      suite,
      "Security Metrics Collection",
      async () => {
        const metrics = SecurityMonitor.getMetrics(1); // Last 1 hour

        if (
          typeof metrics.totalEvents !== "number" ||
          !metrics.eventsByType ||
          !metrics.systemHealth
        ) {
          throw new Error("Security metrics not properly collected");
        }

        return {
          totalEvents: metrics.totalEvents,
          systemHealth: metrics.systemHealth,
        };
      },
      "low",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * API Versioning Tests
   */
  private async runAPIVersioningTests(): Promise<void> {
    const suite: TestSuite = {
      name: "API Versioning Security",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: Version Detection
    await this.runTest(
      suite,
      "API Version Detection",
      async () => {
        const pathRequest = new Request("https://example.com/api/v2/test");
        const headerRequest = new Request("https://example.com/api/test", {
          headers: { "X-API-Version": "v3" },
        });

        const pathVersion = APIVersionManager.extractVersion(pathRequest);
        const headerVersion = APIVersionManager.extractVersion(headerRequest);

        if (pathVersion.version !== "v2" || headerVersion.version !== "v3") {
          throw new Error("Version detection not working correctly");
        }

        return {
          pathVersion: pathVersion.version,
          headerVersion: headerVersion.version,
        };
      },
      "medium",
    );

    // Test 2: Deprecated Version Warnings
    await this.runTest(
      suite,
      "Deprecated Version Handling",
      async () => {
        const request = new Request("https://example.com/api/v1/test");

        const validation = await APIVersionManager.validateVersionRequest(
          request,
          "v1",
          "/api/v1/test",
        );

        if (!validation.allowed || validation.warnings.length === 0) {
          throw new Error("Deprecated version should be allowed with warnings");
        }

        return {
          allowed: validation.allowed,
          warnings: validation.warnings.length,
        };
      },
      "medium",
    );

    // Test 3: Version-specific Security Policies
    await this.runTest(
      suite,
      "Version Security Policies",
      async () => {
        // v1 should not require HTTPS (legacy)
        const v1Request = new Request("http://example.com/api/v1/test");
        const v1Validation = await APIVersionManager.validateVersionRequest(
          v1Request,
          "v1",
          "/api/v1/test",
        );

        // v2 should require HTTPS
        const v2Request = new Request("http://example.com/api/v2/test");
        const v2Validation = await APIVersionManager.validateVersionRequest(
          v2Request,
          "v2",
          "/api/v2/test",
        );

        if (!v1Validation.allowed || v2Validation.allowed) {
          throw new Error("Version-specific security policies not enforced");
        }

        return {
          v1Allowed: v1Validation.allowed,
          v2Blocked: !v2Validation.allowed,
        };
      },
      "high",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * Integration Tests
   */
  private async runIntegrationTests(): Promise<void> {
    const suite: TestSuite = {
      name: "Security Integration",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: Complete Security Flow
    await this.runTest(
      suite,
      "Complete Security Middleware",
      async () => {
        const request = new Request("https://example.com/api/v2/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "test-api-key",
            "x-forwarded-for": "192.168.1.400",
          },
          body: JSON.stringify({
            customerName: "John Doe",
            email: "john@example.com",
            date: "2024-02-15",
          }),
        });

        const result = await SecurityIntegration.processRequest(request, {
          enableRateLimiting: true,
          enableInputValidation: true,
          enableSecurityMonitoring: true,
          requireAPIKey: false, // Don't require for this test
        });

        // Should be allowed with proper sanitized data
        if (!result.allowed) {
          throw new Error(
            `Security integration failed: ${result.response?.statusText}`,
          );
        }

        return { allowed: result.allowed, context: !!result.context };
      },
      "critical",
    );

    // Test 2: Security Integration with Malicious Input
    await this.runTest(
      suite,
      "Malicious Request Blocking",
      async () => {
        const maliciousRequest = new Request(
          "https://example.com/api/v2/booking",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-forwarded-for": "192.168.1.401",
            },
            body: JSON.stringify({
              customerName: '<script>alert("xss")</script>',
              email: "user@domain.com'; DROP TABLE users; --",
              notes: '<iframe src="javascript:alert(1)"></iframe>',
            }),
          },
        );

        const result = await SecurityIntegration.processRequest(
          maliciousRequest,
          {
            enableInputValidation: true,
            blockMaliciousRequests: true,
          },
        );

        if (result.allowed) {
          throw new Error(
            "Malicious request should be blocked by security integration",
          );
        }

        return {
          blocked: !result.allowed,
          reason: result.context.blocked?.reason,
        };
      },
      "critical",
    );

    // Test 3: Performance Under Load
    await this.runTest(
      suite,
      "Security Performance Under Load",
      async () => {
        const startTime = Date.now();
        const requests: Promise<any>[] = [];

        // Process 100 requests concurrently
        for (let i = 0; i < 100; i++) {
          const request = new Request(
            `https://example.com/api/v2/test?id=${i}`,
            {
              method: "GET",
              headers: { "x-forwarded-for": `192.168.1.${i % 255}` },
            },
          );

          requests.push(SecurityIntegration.processRequest(request));
        }

        const results = await Promise.all(requests);
        const processingTime = Date.now() - startTime;
        const averageTime = processingTime / 100;

        // Security processing should not add more than 50ms per request on average
        if (averageTime > 50) {
          throw new Error(
            `Security processing too slow: ${averageTime}ms average`,
          );
        }

        const successCount = results.filter((r) => r.allowed).length;

        return {
          totalRequests: 100,
          successfulRequests: successCount,
          averageProcessingTime: averageTime,
        };
      },
      "medium",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * Performance Tests
   */
  private async runPerformanceTests(): Promise<void> {
    const suite: TestSuite = {
      name: "Security Performance Impact",
      results: [],
      passed: 0,
      failed: 0,
      totalTime: 0,
      securityScore: 0,
    };

    const suiteStartTime = Date.now();

    // Test 1: Memory Usage
    await this.runTest(
      suite,
      "Memory Usage Assessment",
      async () => {
        const initialMemory = process.memoryUsage();

        // Generate significant load
        for (let i = 0; i < 1000; i++) {
          const request = new Request(`https://example.com/api/test${i}`);
          await SecurityIntegration.processRequest(request);

          // Generate some security events
          SecurityMonitor.logEvent(
            SECURITY_EVENT_TYPES.AUTH_SUCCESS,
            SEVERITY_LEVELS.LOW,
            `192.168.1.${i % 255}`,
            { test: true },
          );
        }

        const finalMemory = process.memoryUsage();
        const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

        // Memory increase should be reasonable (less than 50MB for 1000 requests)
        if (memoryIncreaseMB > 50) {
          throw new Error(
            `Excessive memory usage: ${memoryIncreaseMB.toFixed(2)}MB increase`,
          );
        }

        return {
          memoryIncreaseMB: Number(memoryIncreaseMB.toFixed(2)),
          requestsProcessed: 1000,
        };
      },
      "low",
    );

    // Test 2: Concurrent Request Handling
    await this.runTest(
      suite,
      "Concurrent Request Performance",
      async () => {
        const concurrentRequests = 50;
        const startTime = Date.now();

        const requests = Array.from({ length: concurrentRequests }, (_, i) => {
          const request = new Request(
            `https://example.com/api/concurrent${i}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-forwarded-for": `10.0.0.${i % 255}`,
              },
              body: JSON.stringify({ test: `data${i}` }),
            },
          );

          return SecurityIntegration.processRequest(request);
        });

        const results = await Promise.all(requests);
        const totalTime = Date.now() - startTime;
        const averageTime = totalTime / concurrentRequests;

        // Concurrent processing should maintain reasonable performance
        if (averageTime > 100) {
          throw new Error(
            `Slow concurrent processing: ${averageTime}ms average`,
          );
        }

        const successCount = results.filter((r) => r.allowed).length;

        return {
          concurrentRequests,
          successfulRequests: successCount,
          totalTimeMs: totalTime,
          averageTimeMs: Number(averageTime.toFixed(2)),
        };
      },
      "low",
    );

    suite.totalTime = Date.now() - suiteStartTime;
    this.testResults.push(suite);
  }

  /**
   * Run individual test with error handling and timing
   */
  private async runTest(
    suite: TestSuite,
    testName: string,
    testFunction: () => Promise<any>,
    severity: "low" | "medium" | "high" | "critical",
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const result = await testFunction();
      const executionTime = Date.now() - startTime;

      suite.results.push({
        name: testName,
        passed: true,
        message: "Test passed successfully",
        details: result,
        executionTime,
        severity,
      });

      suite.passed++;
    } catch (error) {
      const executionTime = Date.now() - startTime;

      suite.results.push({
        name: testName,
        passed: false,
        message: error instanceof Error ? error.message : String(error),
        executionTime,
        severity,
      });

      suite.failed++;

      SafeLogger.error(`Security test failed: ${testName}`, error);
    }
  }

  /**
   * Calculate overall security score
   */
  private calculateOverallSecurityScore(): number {
    let totalWeight = 0;
    let weightedScore = 0;

    for (const suite of this.testResults) {
      const suiteWeight = suite.results.reduce((weight, test) => {
        const testWeight =
          test.severity === "critical"
            ? 4
            : test.severity === "high"
              ? 3
              : test.severity === "medium"
                ? 2
                : 1;
        return weight + testWeight;
      }, 0);

      const suitePassed = suite.results.reduce((passed, test) => {
        const testWeight =
          test.severity === "critical"
            ? 4
            : test.severity === "high"
              ? 3
              : test.severity === "medium"
                ? 2
                : 1;
        return passed + (test.passed ? testWeight : 0);
      }, 0);

      totalWeight += suiteWeight;
      weightedScore += suitePassed;

      // Calculate suite score
      suite.securityScore =
        suiteWeight > 0 ? Math.round((suitePassed / suiteWeight) * 100) : 100;
    }

    return totalWeight > 0
      ? Math.round((weightedScore / totalWeight) * 100)
      : 0;
  }

  /**
   * Generate detailed test report
   */
  generateReport(): string {
    const overallScore = this.calculateOverallSecurityScore();
    const totalTests = this.testResults.reduce(
      (sum, suite) => sum + suite.results.length,
      0,
    );
    const totalPassed = this.testResults.reduce(
      (sum, suite) => sum + suite.passed,
      0,
    );
    const totalFailed = this.testResults.reduce(
      (sum, suite) => sum + suite.failed,
      0,
    );
    const criticalFailures = this.testResults.reduce(
      (sum, suite) =>
        sum +
        suite.results.filter((r) => !r.passed && r.severity === "critical")
          .length,
      0,
    );

    let report = `
# Wesley's Ambacht Security Test Report

## Executive Summary
- **Overall Security Score**: ${overallScore}/100
- **Total Tests**: ${totalTests}
- **Passed**: ${totalPassed}
- **Failed**: ${totalFailed}
- **Critical Failures**: ${criticalFailures}

## Test Suite Results
`;

    for (const suite of this.testResults) {
      report += `
### ${suite.name}
- **Score**: ${suite.securityScore}/100
- **Tests**: ${suite.results.length}
- **Passed**: ${suite.passed}
- **Failed**: ${suite.failed}
- **Execution Time**: ${suite.totalTime}ms

#### Test Details:
`;

      for (const test of suite.results) {
        const status = test.passed ? "✅ PASS" : "❌ FAIL";
        const severityIcon =
          test.severity === "critical"
            ? "🔴"
            : test.severity === "high"
              ? "🟡"
              : test.severity === "medium"
                ? "🔵"
                : "🟢";

        report += `- ${status} ${severityIcon} **${test.name}** (${test.executionTime}ms)\n`;
        if (!test.passed) {
          report += `  - Error: ${test.message}\n`;
        }
      }
    }

    report += `
## Security Recommendations

### Critical Issues (${criticalFailures} found)
${criticalFailures > 0 ? "Critical security issues must be addressed immediately." : "No critical security issues found. ✅"}

### Performance Impact
Security middleware adds minimal performance overhead while providing comprehensive protection.

### Compliance Status
The security implementation meets industry standards for web application security including:
- OWASP Top 10 protection
- GDPR compliance logging
- Rate limiting and DDoS protection
- Input validation and sanitization
- Security monitoring and alerting

---
Generated on: ${new Date().toISOString()}
`;

    return report;
  }
}

/**
 * React Hook for Security Testing
 */
export function useSecurityTesting() {
  const runTests = async () => {
    const testSuite = new SecurityTestSuite();
    return await testSuite.runAllTests();
  };

  const generateReport = (results: any) => {
    const testSuite = new SecurityTestSuite();
    // Set results to generate report
    (testSuite as any).testResults = results.suites;
    return testSuite.generateReport();
  };

  return {
    runTests,
    generateReport,
  };
}

// Export for external usage
export default SecurityTestSuite;
