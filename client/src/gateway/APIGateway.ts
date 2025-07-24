/**
 * API Gateway - Central routing and orchestration layer for Wesley's Ambacht
 *
 * Features:
 * - API versioning with backward compatibility
 * - Request/response transformation
 * - Middleware orchestration
 * - Circuit breaker pattern
 * - Health monitoring
 * - External integration abstraction
 * - Request routing and load balancing
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import { createVersioningMiddleware } from "@/middleware/apiVersioning";
import { CircuitBreaker } from "./CircuitBreaker";
import { HealthChecker } from "./HealthChecker";
import { RequestTransformer } from "./RequestTransformer";
import { ExternalIntegrations } from "./ExternalIntegrations";
import { MetricsCollector } from "./MetricsCollector";

export interface GatewayConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  circuitBreakerThreshold: number;
  healthCheckInterval: number;
  metricsEnabled: boolean;
  transformationsEnabled: boolean;
}

export interface RouteConfig {
  path: string;
  version: string;
  method: string;
  handler: RouteHandler;
  middleware?: MiddlewareFunction[];
  circuitBreaker?: boolean;
  timeout?: number;
  rateLimit?: {
    requests: number;
    window: number;
  };
  transformRequest?: boolean;
  transformResponse?: boolean;
}

export interface TransformationData {
  requestTransform?: Record<string, unknown>;
  responseTransform?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface MetricsData {
  requestCount: number;
  responseTime: number;
  errorCount: number;
  timestamp: number;
  route?: string;
  method?: string;
}

export interface ExpressLikeRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
}

export interface ExpressLikeResponse {
  status: (code: number) => { json: (data: unknown) => Response };
  setHeader: (name: string, value: string) => void;
  send: (data: unknown) => unknown;
}

export interface GatewayContext {
  requestId: string;
  startTime: number;
  route?: RouteConfig;
  transformations?: TransformationData;
  metrics?: MetricsData;
}

export interface ErrorDetails {
  timestamp?: number;
  requestId?: string;
  route?: string;
  stack?: string;
  [key: string]: unknown;
}

export interface GatewayRequest extends Request {
  apiVersion?: string;
  apiVersionMethod?: string;
  apiVersionWarnings?: string[];
  apiSecurityLevel?: string;
  rateLimitMultiplier?: number;
  gatewayContext?: {
    requestId: string;
    startTime: number;
    route?: RouteConfig;
    transformations?: TransformationData;
    metrics?: MetricsData;
  };
}

export interface GatewayResponse extends Response {
  gatewayHeaders?: Record<string, string>;
}

export type RouteHandler = (
  request: GatewayRequest,
  context: GatewayContext,
) => Promise<GatewayResponse>;

export type MiddlewareFunction = (
  request: GatewayRequest,
  response: GatewayResponse,
  next: () => Promise<void>,
) => Promise<void>;

export interface GatewayContext {
  config: GatewayConfig;
  circuitBreakers: Map<string, CircuitBreaker>;
  healthChecker: HealthChecker;
  metrics: MetricsCollector;
  transformers: RequestTransformer;
  integrations: ExternalIntegrations;
  requestId: string;
  startTime: number;
}

/**
 * Main API Gateway class - handles all incoming API requests
 */
export class APIGateway {
  private readonly config: GatewayConfig;
  private readonly routes: Map<string, RouteConfig> = new Map();
  private readonly circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private readonly healthChecker: HealthChecker;
  private readonly metrics: MetricsCollector;
  private readonly transformers: RequestTransformer;
  private readonly integrations: ExternalIntegrations;
  private readonly globalMiddleware: MiddlewareFunction[] = [];

  constructor(config: GatewayConfig) {
    this.config = config;
    this.healthChecker = new HealthChecker();
    this.metrics = new MetricsCollector();
    this.transformers = new RequestTransformer();
    this.integrations = new ExternalIntegrations();

    this.initializeGlobalMiddleware();
    this.startHealthChecks();
    this.startMetricsCollection();
  }

  /**
   * Initialize global middleware stack
   */
  private initializeGlobalMiddleware(): void {
    // Security middleware (always first)
    this.globalMiddleware.push(this.securityMiddleware.bind(this));

    // Versioning middleware
    this.globalMiddleware.push(this.versioningMiddleware.bind(this));

    // Rate limiting middleware
    this.globalMiddleware.push(this.rateLimitMiddleware.bind(this));

    // Metrics collection middleware
    this.globalMiddleware.push(this.metricsMiddleware.bind(this));

    // Request transformation middleware
    this.globalMiddleware.push(this.transformationMiddleware.bind(this));

    // Circuit breaker middleware
    this.globalMiddleware.push(this.circuitBreakerMiddleware.bind(this));
  }

  /**
   * Register a route with the gateway
   */
  public registerRoute(route: RouteConfig): void {
    const routeKey = `${route.method}:${route.path}`;
    this.routes.set(routeKey, route);

    // Initialize circuit breaker if needed
    if (route.circuitBreaker) {
      const breakerKey = `${route.version}:${route.path}`;
      this.circuitBreakers.set(
        breakerKey,
        new CircuitBreaker({
          failureThreshold: this.config.circuitBreakerThreshold,
          resetTimeout: 60000,
          monitoringPeriod: 30000,
        }),
      );
    }

    SafeLogger.info("Route registered", {
      path: route.path,
      version: route.version,
      method: route.method,
      middleware: route.middleware?.length || 0,
      circuitBreaker: route.circuitBreaker,
    });
  }

  /**
   * Register multiple routes
   */
  public registerRoutes(routes: RouteConfig[]): void {
    routes.forEach((route) => this.registerRoute(route));
  }

  /**
   * Main request handler - entry point for all API requests
   */
  public async handleRequest(request: Request): Promise<Response> {
    const startTime = performance.now();
    const requestId = this.generateRequestId();

    // Convert to GatewayRequest
    const gatewayRequest = this.createGatewayRequest(request, {
      requestId,
      startTime,
    });

    try {
      // Create gateway context
      const context: GatewayContext = {
        config: this.config,
        circuitBreakers: this.circuitBreakers,
        healthChecker: this.healthChecker,
        metrics: this.metrics,
        transformers: this.transformers,
        integrations: this.integrations,
        requestId,
        startTime,
      };

      // Check for health check endpoints
      const healthResponse = await this.handleHealthChecks(gatewayRequest);
      if (healthResponse) {
        return healthResponse;
      }

      // Find matching route
      const route = this.findRoute(gatewayRequest);
      if (!route) {
        return this.createErrorResponse(
          "Route not found",
          404,
          "ROUTE_NOT_FOUND",
          { path: new URL(gatewayRequest.url).pathname },
        );
      }

      // Set route in context
      gatewayRequest.gatewayContext.route = route;

      // Execute middleware chain and route handler
      const response = await this.executeMiddlewareChain(
        gatewayRequest,
        context,
        route,
      );

      // Record metrics
      this.recordRequestMetrics(gatewayRequest, response, startTime);

      return response;
    } catch (error) {
      SafeLogger.error("Gateway request handling error", error);
      this.metrics.recordError(requestId, error);

      return this.createErrorResponse(
        "Internal server error",
        500,
        "INTERNAL_ERROR",
        { requestId },
      );
    }
  }

  /**
   * Execute middleware chain and route handler
   */
  private async executeMiddlewareChain(
    request: GatewayRequest,
    context: GatewayContext,
    route: RouteConfig,
  ): Promise<GatewayResponse> {
    let response: GatewayResponse = new Response() as GatewayResponse;
    let middlewareIndex = 0;

    // Combine global and route-specific middleware
    const allMiddleware = [
      ...this.globalMiddleware,
      ...(route.middleware || []),
    ];

    const next = async (): Promise<void> => {
      if (middlewareIndex < allMiddleware.length) {
        const middleware = allMiddleware[middlewareIndex++];
        await middleware(request, response, next);
      } else {
        // Execute route handler
        response = await route.handler(request, context);
      }
    };

    await next();
    return response;
  }

  /**
   * Find matching route for request
   */
  private findRoute(request: GatewayRequest): RouteConfig | null {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    // Try exact match first
    const exactKey = `${method}:${pathname}`;
    if (this.routes.has(exactKey)) {
      return this.routes.get(exactKey)!;
    }

    // Try pattern matching
    for (const [key, route] of this.routes.entries()) {
      if (key.startsWith(`${method}:`)) {
        const routePath = key.substring(method.length + 1);
        if (this.matchPath(pathname, routePath)) {
          return route;
        }
      }
    }

    return null;
  }

  /**
   * Match path with patterns (supports wildcards and parameters)
   */
  private matchPath(pathname: string, routePath: string): boolean {
    // Convert route path to regex pattern
    const pattern = routePath
      .replace(/:[^/]+/g, "([^/]+)") // Parameters
      .replace(/\*/g, ".*") // Wildcards
      .replace(/\//g, "\\/"); // Escape slashes

    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  }

  /**
   * Handle health check endpoints
   */
  private async handleHealthChecks(
    request: GatewayRequest,
  ): Promise<Response | null> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    switch (pathname) {
      case "/health":
        return this.createHealthResponse();

      case "/ready":
        return this.createReadinessResponse();

      case "/metrics":
        return this.createMetricsResponse();

      default:
        return null;
    }
  }

  /**
   * Create health check response
   */
  private async createHealthResponse(): Promise<Response> {
    const health = await this.healthChecker.checkHealth();
    const status = health.status === "healthy" ? 200 : 503;

    return new Response(JSON.stringify(health), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  }

  /**
   * Create readiness check response
   */
  private async createReadinessResponse(): Promise<Response> {
    const readiness = await this.healthChecker.checkReadiness();
    const status = readiness.ready ? 200 : 503;

    return new Response(JSON.stringify(readiness), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  }

  /**
   * Create metrics response
   */
  private async createMetricsResponse(): Promise<Response> {
    const metrics = await this.metrics.getMetrics();

    return new Response(JSON.stringify(metrics), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  // Middleware implementations

  /**
   * Security middleware
   */
  private async securityMiddleware(
    request: GatewayRequest,
    response: GatewayResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    // Add security headers
    response.headers?.set("X-Content-Type-Options", "nosniff");
    response.headers?.set("X-Frame-Options", "DENY");
    response.headers?.set("X-XSS-Protection", "1; mode=block");
    response.headers?.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );

    // Add request ID
    if (request.gatewayContext?.requestId) {
      response.headers?.set("X-Request-ID", request.gatewayContext.requestId);
    }

    await next();
  }

  /**
   * Versioning middleware
   */
  private async versioningMiddleware(
    request: GatewayRequest,
    response: GatewayResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    // Use existing versioning middleware
    const versioningHandler = createVersioningMiddleware();

    // Convert to Express-like interface
    const req: ExpressLikeRequest = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    };

    const res: ExpressLikeResponse = {
      status: (code: number) => ({ json: (data: unknown) => response }),
      setHeader: (name: string, value: string) =>
        response.headers?.set(name, value),
      send: (data: unknown) => data,
    };

    await versioningHandler(req, res, next);
  }

  /**
   * Rate limiting middleware
   */
  private async rateLimitMiddleware(
    request: GatewayRequest,
    response: GatewayResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    // Apply version-specific rate limiting
    const multiplier = request.rateLimitMultiplier || 1.0;
    const route = request.gatewayContext?.route;

    if (route?.rateLimit) {
      const limit = Math.floor(route.rateLimit.requests * multiplier);
      const window = route.rateLimit.window;

      // Check rate limit (implementation would use Redis or in-memory store)
      const clientId = this.getClientIdentifier(request);
      const allowed = await this.checkRateLimit(clientId, limit, window);

      if (!allowed) {
        throw new Error("Rate limit exceeded");
      }

      // Add rate limit headers
      response.headers?.set("X-RateLimit-Limit", limit.toString());
      response.headers?.set("X-RateLimit-Window", window.toString());
    }

    await next();
  }

  /**
   * Metrics collection middleware
   */
  private async metricsMiddleware(
    request: GatewayRequest,
    response: GatewayResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    if (this.config.metricsEnabled) {
      const startTime = performance.now();

      await next();

      const duration = performance.now() - startTime;
      this.metrics.recordRequest(
        request.gatewayContext?.requestId || "unknown",
        {
          method: request.method,
          path: new URL(request.url).pathname,
          version: request.apiVersion,
          duration,
          statusCode: response.status,
        },
      );
    } else {
      await next();
    }
  }

  /**
   * Request transformation middleware
   */
  private async transformationMiddleware(
    request: GatewayRequest,
    response: GatewayResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    if (this.config.transformationsEnabled) {
      const route = request.gatewayContext?.route;

      if (route?.transformRequest) {
        await this.transformers.transformRequest(request);
      }

      await next();

      if (route?.transformResponse) {
        await this.transformers.transformResponse(response, request);
      }
    } else {
      await next();
    }
  }

  /**
   * Circuit breaker middleware
   */
  private async circuitBreakerMiddleware(
    request: GatewayRequest,
    response: GatewayResponse,
    next: () => Promise<void>,
  ): Promise<void> {
    const route = request.gatewayContext?.route;

    if (route?.circuitBreaker) {
      const breakerKey = `${route.version}:${route.path}`;
      const circuitBreaker = this.circuitBreakers.get(breakerKey);

      if (circuitBreaker) {
        await circuitBreaker.execute(async () => {
          await next();
        });
      } else {
        await next();
      }
    } else {
      await next();
    }
  }

  // Helper methods

  private createGatewayRequest(
    request: Request,
    context: GatewayContext,
  ): GatewayRequest {
    const gatewayRequest = request as GatewayRequest;
    gatewayRequest.gatewayContext = context;
    return gatewayRequest;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private getClientIdentifier(request: GatewayRequest): string {
    return (
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"
    );
  }

  private async checkRateLimit(
    clientId: string,
    limit: number,
    window: number,
  ): Promise<boolean> {
    // Implementation would use Redis or in-memory rate limiter
    // For now, return true (no rate limiting)
    return true;
  }

  private recordRequestMetrics(
    request: GatewayRequest,
    response: GatewayResponse,
    startTime: number,
  ): void {
    const duration = performance.now() - startTime;
    const url = new URL(request.url);

    SafeLogger.info("Gateway request completed", {
      requestId: request.gatewayContext?.requestId,
      method: request.method,
      path: url.pathname,
      status: response.status,
      duration: Math.round(duration),
      version: request.apiVersion,
    });
  }

  private createErrorResponse(
    message: string,
    status: number,
    code: string,
    details?: ErrorDetails,
  ): Response {
    return new Response(
      JSON.stringify({
        error: {
          code,
          message,
          details,
        },
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  private startHealthChecks(): void {
    setInterval(() => {
      this.healthChecker.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  private startMetricsCollection(): void {
    if (this.config.metricsEnabled) {
      setInterval(() => {
        this.metrics.collectSystemMetrics();
      }, 30000); // Collect system metrics every 30 seconds
    }
  }
}

/**
 * Default gateway configuration
 */
export const DEFAULT_GATEWAY_CONFIG: GatewayConfig = {
  baseUrl: process.env.GATEWAY_BASE_URL || "https://api.wesleysambacht.nl",
  timeout: 30000,
  retryAttempts: 3,
  circuitBreakerThreshold: 5,
  healthCheckInterval: 60000,
  metricsEnabled: true,
  transformationsEnabled: true,
};
