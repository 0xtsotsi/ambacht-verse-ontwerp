/**
 * Wesley's Ambacht REST API Routes
 * Comprehensive REST API endpoints for catering website functionality
 *
 * Agent 2: REST API Endpoints Implementation
 * Leverages existing Supabase database layer and validation services
 */

import { Express, Request, Response, NextFunction } from "express";
import { bookingRoutes } from "./bookings";
import { availabilityRoutes } from "./availability";
import { quoteRoutes } from "./quotes";
import { addOnRoutes } from "./addOns";
import { webhookRoutes } from "./webhooks";
import { ValidationService } from "@/services/ValidationService";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";
import { SafeLogger } from "@/lib/LoggerUtils";

// API Response interface
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

// Request context interface
export interface RequestContext extends Request {
  requestId: string;
  startTime: number;
  validationService: ValidationService;
  errorService: ErrorHandlingService;
}

/**
 * Global middleware for all API routes
 */
export function setupAPIMiddleware(app: Express) {
  const validationService = ValidationService.getInstance();
  const errorService = ErrorHandlingService.getInstance();

  // Request ID and timing middleware
  app.use("/api/v3", (req: Request, res: Response, next: NextFunction) => {
    const context = req as RequestContext;
    context.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    context.startTime = Date.now();
    context.validationService = validationService;
    context.errorService = errorService;

    // Add request ID to response headers
    res.setHeader("X-Request-ID", context.requestId);
    res.setHeader("X-API-Version", "v3");

    next();
  });

  // Request logging middleware
  app.use("/api/v3", (req: Request, res: Response, next: NextFunction) => {
    const context = req as RequestContext;

    SafeLogger.info("API Request", {
      requestId: context.requestId,
      method: req.method,
      path: req.path,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    // Log response on finish
    res.on("finish", () => {
      const duration = Date.now() - context.startTime;
      SafeLogger.info("API Response", {
        requestId: context.requestId,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get("Content-Length"),
      });
    });

    next();
  });

  // JSON parsing with error handling
  app.use("/api/v3", (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "POST" || req.method === "PATCH") {
      if (!req.is("application/json")) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              "Invalid content type. Expected application/json",
              "INVALID_CONTENT_TYPE",
              (req as RequestContext).requestId,
            ),
          );
      }
    }
    next();
  });
}

/**
 * Setup all API routes
 */
export function setupAPIRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/v3/health", (req: Request, res: Response) => {
    const context = req as RequestContext;
    res.json(
      createSuccessResponse(
        {
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "v3",
          services: {
            database: "connected",
            validation: "active",
            errorHandling: "active",
          },
        },
        context.requestId,
      ),
    );
  });

  // Register route modules
  app.use("/api/v3", bookingRoutes);
  app.use("/api/v3", availabilityRoutes);
  app.use("/api/v3", quoteRoutes);
  app.use("/api/v3", addOnRoutes);
  app.use("/api/v3", webhookRoutes);

  // 404 handler for API routes
  app.use("/api/v3/*", (req: Request, res: Response) => {
    const context = req as RequestContext;
    res
      .status(404)
      .json(
        createErrorResponse(
          `API endpoint ${req.method} ${req.path} not found`,
          "ENDPOINT_NOT_FOUND",
          context.requestId,
        ),
      );
  });

  // Global error handler for API routes
  app.use(
    "/api/v3",
    (error: Error, req: Request, res: Response, next: NextFunction) => {
      const context = req as RequestContext;

      const errorResponse = context.errorService.handleError(error, {
        componentName: "API",
        action: `${req.method} ${req.path}`,
        additionalData: {
          requestId: context.requestId,
          body: req.body,
          query: req.query,
          params: req.params,
        },
      });

      const statusCode = getStatusCodeFromError(
        error,
        errorResponse.classification.severity,
      );

      res
        .status(statusCode)
        .json(
          createErrorResponse(
            errorResponse.userMessage,
            errorResponse.classification.category.toUpperCase(),
            context.requestId,
            errorResponse.shouldRetry
              ? { retryAfter: errorResponse.retryDelay }
              : undefined,
          ),
        );
    },
  );
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data: T,
  requestId: string,
  meta?: Record<string, any>,
): APIResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: "v3",
      requestId,
      ...meta,
    },
  };
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  code: string,
  requestId: string,
  details?: any,
): APIResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: "v3",
      requestId,
    },
  };
}

/**
 * Get appropriate HTTP status code from error
 */
function getStatusCodeFromError(error: Error, severity: string): number {
  const message = error.message.toLowerCase();

  // Validation errors
  if (
    message.includes("validation") ||
    message.includes("invalid") ||
    message.includes("required")
  ) {
    return 400;
  }

  // Not found errors
  if (message.includes("not found") || message.includes("does not exist")) {
    return 404;
  }

  // Availability/business logic errors
  if (message.includes("not available") || message.includes("unavailable")) {
    return 409; // Conflict
  }

  // Unauthorized errors
  if (message.includes("unauthorized") || message.includes("forbidden")) {
    return 403;
  }

  // Rate limit errors
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return 429;
  }

  // Server errors based on severity
  switch (severity) {
    case "low":
      return 400;
    case "medium":
      return 500;
    case "high":
    case "critical":
      return 503; // Service Unavailable
    default:
      return 500;
  }
}

/**
 * Async wrapper for route handlers
 */
export function asyncHandler(
  handler: (
    req: RequestContext,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const context = req as RequestContext;
    Promise.resolve(handler(context, res, next)).catch(next);
  };
}

/**
 * Validation middleware factory
 */
export function validateRequest(
  validationFn: (data: any) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  },
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const context = req as RequestContext;
    const dataToValidate = { ...req.body, ...req.query, ...req.params };

    const validation = validationFn(dataToValidate);

    if (!validation.isValid) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            validation.errors.join(", "),
            "VALIDATION_ERROR",
            context.requestId,
            { errors: validation.errors, warnings: validation.warnings },
          ),
        );
    }

    // Attach warnings to request context for potential response inclusion
    if (validation.warnings.length > 0) {
      context.validationWarnings = validation.warnings;
    }

    next();
  };
}

// Extend RequestContext to include validation warnings
declare global {
  namespace Express {
    interface Request {
      validationWarnings?: string[];
    }
  }
}
