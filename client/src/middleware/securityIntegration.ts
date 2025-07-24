/**
 * Security Integration Middleware for Wesley's Ambacht
 *
 * Combines all security measures into a unified middleware system:
 * - Rate limiting with DDoS protection
 * - Security headers and CORS
 * - Input validation and sanitization
 * - API key authentication
 * - Security monitoring and alerting
 * - Request/response logging
 */

import { RateLimiter } from "./rateLimiter";
import { SecurityHeaders } from "./securityHeaders";
import { InputValidationMiddleware, InputSanitizer } from "./inputSanitization";
import { APIKeyManager } from "./apiKeyManager";
import {
  SecurityMonitor,
  SECURITY_EVENT_TYPES,
  SEVERITY_LEVELS,
} from "./securityMonitor";
import { JWTAuthenticationManager } from "./jwtAuthentication";
import { APIVersionManager } from "./apiVersioning";
import { SafeLogger } from "@/lib/LoggerUtils";

// Security configuration
export interface SecurityConfig {
  enableRateLimiting: boolean;
  enableSecurityHeaders: boolean;
  enableInputValidation: boolean;
  enableAPIKeyAuth: boolean;
  enableSecurityMonitoring: boolean;
  requireAPIKey: boolean;
  logAllRequests: boolean;
  blockMaliciousRequests: boolean;
  ddosProtection: boolean;
}

// Default security configuration
const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableRateLimiting: true,
  enableSecurityHeaders: true,
  enableInputValidation: true,
  enableAPIKeyAuth: false, // Optional for public endpoints
  enableSecurityMonitoring: true,
  requireAPIKey: false,
  logAllRequests: true,
  blockMaliciousRequests: true,
  ddosProtection: true,
};

// Request context for security processing
interface SecurityContext {
  clientIP: string;
  userAgent?: string;
  endpoint: string;
  method: string;
  startTime: number;
  apiKey?: string;
  rateLimitResult?: {
    allowed: boolean;
    remaining?: number;
    resetTime?: Date;
    message?: string;
  };
  validationResult?: {
    isValid: boolean;
    threats?: string[];
    sanitizedData?: any;
  };
  blocked?: {
    reason: string;
    source: string;
  };
}

/**
 * Comprehensive Security Middleware
 */
export class SecurityIntegration {
  private static config: SecurityConfig = DEFAULT_SECURITY_CONFIG;

  /**
   * Configure security settings
   */
  static configure(config: Partial<SecurityConfig>): void {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
    SafeLogger.info("Security integration configured", this.config);
  }

  /**
   * Main security middleware function
   */
  static async processRequest(
    request: Request,
    config?: Partial<SecurityConfig>,
  ): Promise<{
    allowed: boolean;
    response?: Response;
    context: SecurityContext;
  }> {
    const activeConfig = { ...this.config, ...config };
    const startTime = Date.now();

    // Initialize security context
    const context: SecurityContext = {
      clientIP: this.getClientIP(request),
      userAgent: request.headers.get("user-agent") || undefined,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      startTime,
    };

    try {
      // Step 1: Security Monitoring - Check if IP is blocked
      if (activeConfig.enableSecurityMonitoring) {
        if (SecurityMonitor.isIPBlocked(context.clientIP)) {
          context.blocked = {
            reason: "IP blocked by security monitoring",
            source: "SecurityMonitor",
          };

          const response = this.createBlockedResponse(
            "Access Denied",
            "Your IP address has been blocked due to suspicious activity",
          );
          return { allowed: false, response, context };
        }
      }

      // Step 2: Rate Limiting and DDoS Protection
      if (activeConfig.enableRateLimiting) {
        const rateLimitResult = await RateLimiter.checkRateLimit(
          request,
          context.endpoint,
        );
        context.rateLimitResult = rateLimitResult;

        if (!rateLimitResult.allowed) {
          if (activeConfig.enableSecurityMonitoring) {
            SecurityMonitor.logEvent(
              SECURITY_EVENT_TYPES.RATE_LIMIT_EXCEEDED,
              SEVERITY_LEVELS.MEDIUM,
              context.clientIP,
              {
                endpoint: context.endpoint,
                method: context.method,
                message: rateLimitResult.message,
              },
              {
                userAgent: context.userAgent,
                endpoint: context.endpoint,
              },
            );
          }

          const response = this.createRateLimitResponse(rateLimitResult);
          return { allowed: false, response, context };
        }
      }

      // Step 3: API Key Authentication (if required)
      if (activeConfig.enableAPIKeyAuth || activeConfig.requireAPIKey) {
        const apiKey = this.extractAPIKey(request);

        if (activeConfig.requireAPIKey && !apiKey) {
          const response = this.createUnauthorizedResponse("API key required");
          return { allowed: false, response, context };
        }

        if (apiKey) {
          const apiValidation = await APIKeyManager.validateAPIKey(
            apiKey,
            context.endpoint,
            context.method,
            request,
          );

          if (!apiValidation.isValid) {
            if (activeConfig.enableSecurityMonitoring) {
              SecurityMonitor.logEvent(
                SECURITY_EVENT_TYPES.INVALID_API_KEY,
                SEVERITY_LEVELS.HIGH,
                context.clientIP,
                {
                  error: apiValidation.error,
                  endpoint: context.endpoint,
                },
                {
                  userAgent: context.userAgent,
                  endpoint: context.endpoint,
                },
              );
            }

            const status = apiValidation.rateLimitExceeded ? 429 : 401;
            const response = this.createUnauthorizedResponse(
              apiValidation.error || "Invalid API key",
              status,
            );
            return { allowed: false, response, context };
          }

          context.apiKey = apiKey;
        }
      }

      // Step 4: Input Validation and Sanitization
      if (
        activeConfig.enableInputValidation &&
        ["POST", "PUT", "PATCH"].includes(context.method)
      ) {
        const validationResult =
          await InputValidationMiddleware.validateRequest(request);
        context.validationResult = validationResult;

        if (!validationResult.isValid) {
          if (
            activeConfig.enableSecurityMonitoring &&
            validationResult.threats &&
            validationResult.threats.length > 0
          ) {
            // Get request body for threat analysis
            let requestBody = "";
            try {
              const clonedRequest = request.clone();
              requestBody = await clonedRequest.text();
            } catch (error) {
              SafeLogger.warn(
                "Could not clone request for threat analysis",
                error,
              );
            }

            SecurityMonitor.trackMaliciousInput(
              context.clientIP,
              requestBody,
              validationResult.threats,
              context.endpoint,
              context.userAgent,
            );
          }

          if (
            activeConfig.blockMaliciousRequests &&
            validationResult.threats &&
            validationResult.threats.length > 0
          ) {
            context.blocked = {
              reason: `Malicious input detected: ${validationResult.threats.join(", ")}`,
              source: "InputValidation",
            };

            const response = this.createSecurityThreatResponse(
              validationResult.threats,
            );
            return { allowed: false, response, context };
          }

          const response = this.createValidationErrorResponse(
            validationResult.errors,
          );
          return { allowed: false, response, context };
        }
      }

      // Step 5: Log successful security check
      if (
        activeConfig.logAllRequests &&
        activeConfig.enableSecurityMonitoring
      ) {
        SecurityMonitor.logEvent(
          SECURITY_EVENT_TYPES.AUTH_SUCCESS,
          SEVERITY_LEVELS.LOW,
          context.clientIP,
          {
            endpoint: context.endpoint,
            method: context.method,
            hasApiKey: !!context.apiKey,
          },
          {
            userAgent: context.userAgent,
            endpoint: context.endpoint,
          },
        );
      }

      return { allowed: true, context };
    } catch (error) {
      SafeLogger.error("Security middleware error", error, {
        endpoint: context.endpoint,
        method: context.method,
        ip: context.clientIP,
      });

      // Log security system error
      if (activeConfig.enableSecurityMonitoring) {
        SecurityMonitor.logEvent(
          SECURITY_EVENT_TYPES.SECURITY_BREACH,
          SEVERITY_LEVELS.HIGH,
          context.clientIP,
          {
            error: "Security middleware failure",
            endpoint: context.endpoint,
            method: context.method,
          },
          {
            userAgent: context.userAgent,
            endpoint: context.endpoint,
          },
        );
      }

      const response = new Response(
        JSON.stringify({
          error: "Security system error",
          message: "An error occurred processing your request",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );

      return { allowed: false, response, context };
    }
  }

  /**
   * Apply security headers to response
   */
  static applySecurityHeaders(request: Request, response: Response): Response {
    if (this.config.enableSecurityHeaders) {
      SecurityHeaders.applyHeaders(request, response);
    }
    return response;
  }

  /**
   * Handle preflight CORS requests
   */
  static handlePreflight(request: Request): Response | null {
    if (request.method === "OPTIONS" && this.config.enableSecurityHeaders) {
      return SecurityHeaders.handlePreflight(request);
    }
    return null;
  }

  /**
   * Create middleware for various frameworks
   */
  static createMiddleware(framework: "express" | "fetch" | "vite" = "fetch") {
    switch (framework) {
      case "express":
        return async (req: any, res: any, next: any) => {
          try {
            // Convert to standard Request
            const request = new Request(
              `${req.protocol}://${req.get("host")}${req.originalUrl}`,
              {
                method: req.method,
                headers: req.headers,
                body:
                  req.method !== "GET" && req.method !== "HEAD"
                    ? JSON.stringify(req.body)
                    : undefined,
              },
            );

            const result = await this.processRequest(request);

            if (!result.allowed) {
              // Apply security headers to error response
              if (result.response) {
                result.response.headers.forEach((value, key) => {
                  res.setHeader(key, value);
                });
                return res
                  .status(result.response.status)
                  .json(await result.response.json());
              }
              return res.status(403).json({ error: "Request blocked" });
            }

            // Apply security headers
            if (this.config.enableSecurityHeaders) {
              SecurityHeaders.applyHeaders(request, res);
            }

            // Attach security context to request
            req.securityContext = result.context;
            if (result.context.validationResult?.sanitizedData) {
              req.body = result.context.validationResult.sanitizedData;
            }

            if (next) next();
          } catch (error) {
            SafeLogger.error("Express security middleware error", error);
            if (next) next();
          }
        };

      case "fetch":
        return async (request: Request): Promise<Response | null> => {
          try {
            // Handle preflight requests
            const preflightResponse = this.handlePreflight(request);
            if (preflightResponse) return preflightResponse;

            const result = await this.processRequest(request);

            if (!result.allowed) {
              return (
                result.response || new Response("Forbidden", { status: 403 })
              );
            }

            return null; // Allow request to proceed
          } catch (error) {
            SafeLogger.error("Fetch security middleware error", error);
            return new Response("Security error", { status: 500 });
          }
        };

      case "vite":
        return (req: any, res: any, next: any) => {
          // Handle preflight requests first
          if (req.method === "OPTIONS" && this.config.enableSecurityHeaders) {
            const request = new Request(
              `${req.protocol}://${req.get("host")}${req.originalUrl}`,
              {
                method: req.method,
                headers: req.headers,
              },
            );

            const preflightResponse = SecurityHeaders.handlePreflight(request);
            res.status(preflightResponse.status);
            preflightResponse.headers.forEach((value, key) => {
              res.setHeader(key, value);
            });
            return res.end();
          }

          // Apply security headers to all responses
          if (this.config.enableSecurityHeaders) {
            const request = new Request(
              `${req.protocol}://${req.get("host")}${req.originalUrl}`,
              {
                method: req.method,
                headers: req.headers,
              },
            );
            SecurityHeaders.applyHeaders(request, res);
          }

          if (next) next();
        };

      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  }

  // Utility methods

  private static getClientIP(request: Request): string {
    const headers = request.headers;
    return (
      headers.get("cf-connecting-ip") || // Cloudflare
      headers.get("x-real-ip") || // Nginx proxy
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Standard proxy header
      headers.get("x-client-ip") || // Alternative header
      "unknown"
    );
  }

  private static extractAPIKey(request: Request): string | null {
    return (
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      new URL(request.url).searchParams.get("api_key") ||
      null
    );
  }

  private static createBlockedResponse(
    title: string,
    message: string,
  ): Response {
    return new Response(
      JSON.stringify({
        error: title,
        message: message,
        blocked: true,
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Security-Block": "true",
        },
      },
    );
  }

  private static createRateLimitResponse(rateLimitResult: any): Response {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message:
          rateLimitResult.message ||
          "Te veel verzoeken. Probeer het later opnieuw.",
        retryAfter: rateLimitResult.resetTime,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": rateLimitResult.resetTime
            ? Math.ceil(
                (rateLimitResult.resetTime.getTime() - Date.now()) / 1000,
              ).toString()
            : "60",
          "X-RateLimit-Remaining": (rateLimitResult.remaining || 0).toString(),
        },
      },
    );
  }

  private static createUnauthorizedResponse(
    message: string,
    status: number = 401,
  ): Response {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
        message: message,
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": 'Bearer realm="API"',
        },
      },
    );
  }

  private static createValidationErrorResponse(errors: string[]): Response {
    return new Response(
      JSON.stringify({
        error: "Validation Error",
        message: "De ingevoerde gegevens zijn niet geldig",
        details: errors,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  private static createSecurityThreatResponse(threats: string[]): Response {
    return new Response(
      JSON.stringify({
        error: "Security Threat Detected",
        message:
          "Uw verzoek bevat potentieel gevaarlijke inhoud en is geblokkeerd",
        blocked: true,
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Security-Threat": threats.join(","),
        },
      },
    );
  }

  /**
   * Get security status for monitoring
   */
  static getSecurityStatus(): {
    config: SecurityConfig;
    rateLimitStats: any;
    securityMetrics: any;
    blockedIPs: string[];
  } {
    return {
      config: this.config,
      rateLimitStats: RateLimiter.getStats(),
      securityMetrics: SecurityMonitor.getMetrics(),
      blockedIPs: SecurityMonitor.getBlockedIPs(),
    };
  }
}

/**
 * React hook for security status monitoring
 */
export function useSecurityStatus() {
  const getStatus = () => {
    return SecurityIntegration.getSecurityStatus();
  };

  const configure = (config: Partial<SecurityConfig>) => {
    SecurityIntegration.configure(config);
  };

  return {
    getStatus,
    configure,
  };
}

/**
 * Utility function to create a secure API endpoint wrapper
 */
export function withSecurity(
  handler: (request: Request, context: SecurityContext) => Promise<Response>,
  config?: Partial<SecurityConfig>,
) {
  return async (request: Request): Promise<Response> => {
    // Process security checks
    const securityResult = await SecurityIntegration.processRequest(
      request,
      config,
    );

    if (!securityResult.allowed) {
      return (
        securityResult.response || new Response("Forbidden", { status: 403 })
      );
    }

    try {
      // Call the actual handler with security context
      const response = await handler(request, securityResult.context);

      // Apply security headers to response
      return SecurityIntegration.applySecurityHeaders(request, response);
    } catch (error) {
      SafeLogger.error("Secure handler error", error);

      // Log security incident
      SecurityMonitor.logEvent(
        SECURITY_EVENT_TYPES.SECURITY_BREACH,
        SEVERITY_LEVELS.HIGH,
        securityResult.context.clientIP,
        {
          error: "Handler execution error",
          endpoint: securityResult.context.endpoint,
        },
        {
          userAgent: securityResult.context.userAgent,
          endpoint: securityResult.context.endpoint,
        },
      );

      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: "Er is een fout opgetreden bij het verwerken van uw verzoek",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  };
}

// Initialize security integration
SecurityIntegration.configure(DEFAULT_SECURITY_CONFIG);
