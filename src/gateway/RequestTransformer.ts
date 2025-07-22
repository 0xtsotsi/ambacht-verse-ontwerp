/**
 * Request/Response Transformation Layer
 *
 * Provides request and response transformation capabilities for API versioning,
 * data format conversion, and integration compatibility.
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import { GatewayRequest, GatewayResponse } from "./APIGateway";

export interface TransformationRule {
  name: string;
  description: string;
  condition: (request: GatewayRequest) => boolean;
  transformRequest?: (request: GatewayRequest) => Promise<GatewayRequest>;
  transformResponse?: (
    response: GatewayResponse,
    request: GatewayRequest,
  ) => Promise<GatewayResponse>;
  enabled: boolean;
  priority: number; // Lower numbers run first
}

export interface TransformationContext {
  originalRequest: GatewayRequest;
  transformedRequest: GatewayRequest;
  requestTransformations: string[];
  responseTransformations: string[];
  startTime: number;
}

/**
 * Request/Response transformation service
 */
export class RequestTransformer {
  private transformationRules = new Map<string, TransformationRule>();
  private transformationMetrics = new Map<
    string,
    {
      executions: number;
      successes: number;
      failures: number;
      averageTime: number;
    }
  >();

  constructor() {
    this.registerDefaultTransformations();
  }

  /**
   * Register default transformation rules
   */
  private registerDefaultTransformations(): void {
    // API version compatibility transformations
    this.registerTransformation({
      name: "v1_to_v2_request",
      description: "Transform v1 request format to v2",
      priority: 10,
      enabled: true,
      condition: (request) => {
        return (
          request.apiVersion === "v1" &&
          new URL(request.url).pathname.startsWith("/api/v1/")
        );
      },
      transformRequest: async (request) => {
        const url = new URL(request.url);

        // Transform URL path from v1 to v2
        const newPath = url.pathname.replace("/api/v1/", "/api/v2/");
        const newUrl = new URL(request.url);
        newUrl.pathname = newPath;

        // Create new request with transformed URL
        const transformedRequest = new Request(newUrl.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.body,
        }) as GatewayRequest;

        // Copy gateway context
        transformedRequest.gatewayContext = request.gatewayContext;
        transformedRequest.apiVersion = "v2"; // Upgrade version

        // Transform request body for v1 to v2 compatibility
        if (request.method !== "GET" && request.method !== "HEAD") {
          try {
            const body = await request.json();
            const transformedBody = this.transformV1ToV2RequestBody(body);

            const newRequest = new Request(newUrl.toString(), {
              method: request.method,
              headers: {
                ...Object.fromEntries(request.headers.entries()),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(transformedBody),
            }) as GatewayRequest;

            newRequest.gatewayContext = transformedRequest.gatewayContext;
            newRequest.apiVersion = "v2";

            SafeLogger.info("V1 to V2 request transformation applied", {
              originalPath: url.pathname,
              newPath,
              transformations: ["url_path", "request_body"],
            });

            return newRequest;
          } catch (error) {
            SafeLogger.warn("Failed to transform v1 request body", error);
            return transformedRequest;
          }
        }

        return transformedRequest;
      },
    });

    // V2 to V1 response transformation
    this.registerTransformation({
      name: "v2_to_v1_response",
      description: "Transform v2 response format to v1",
      priority: 10,
      enabled: true,
      condition: (request) => {
        return request.apiVersion === "v1";
      },
      transformResponse: async (response, request) => {
        try {
          const responseData = await response.json();
          const transformedData =
            this.transformV2ToV1ResponseBody(responseData);

          const transformedResponse = new Response(
            JSON.stringify(transformedData),
            {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            },
          ) as GatewayResponse;

          SafeLogger.info("V2 to V1 response transformation applied", {
            status: response.status,
            transformations: ["response_body"],
          });

          return transformedResponse;
        } catch (error) {
          SafeLogger.warn("Failed to transform v2 response to v1", error);
          return response;
        }
      },
    });

    // Date format standardization
    this.registerTransformation({
      name: "standardize_date_format",
      description: "Standardize date formats in requests and responses",
      priority: 20,
      enabled: true,
      condition: () => true, // Apply to all requests
      transformRequest: async (request) => {
        if (request.method === "GET" || request.method === "HEAD") {
          return request;
        }

        try {
          const body = await request.json();
          const transformedBody = this.standardizeDateFormats(body);

          const newRequest = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(transformedBody),
          }) as GatewayRequest;

          newRequest.gatewayContext = request.gatewayContext;
          newRequest.apiVersion = request.apiVersion;

          return newRequest;
        } catch (error) {
          return request;
        }
      },
      transformResponse: async (response, request) => {
        try {
          const responseData = await response.json();
          const transformedData = this.standardizeDateFormats(responseData);

          return new Response(JSON.stringify(transformedData), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          }) as GatewayResponse;
        } catch (error) {
          return response;
        }
      },
    });

    // Error format standardization
    this.registerTransformation({
      name: "standardize_error_format",
      description: "Standardize error response format",
      priority: 5,
      enabled: true,
      condition: (request) => true,
      transformResponse: async (response, request) => {
        // Only transform error responses
        if (response.status < 400) {
          return response;
        }

        try {
          const errorData = await response.json();
          const standardizedError = this.standardizeErrorFormat(
            errorData,
            request.apiVersion,
          );

          const transformedResponse = new Response(
            JSON.stringify(standardizedError),
            {
              status: response.status,
              statusText: response.statusText,
              headers: {
                ...Object.fromEntries(response.headers.entries()),
                "Content-Type": "application/json",
              },
            },
          ) as GatewayResponse;

          SafeLogger.debug("Error format standardization applied", {
            status: response.status,
            version: request.apiVersion,
          });

          return transformedResponse;
        } catch (error) {
          SafeLogger.warn("Failed to standardize error format", error);
          return response;
        }
      },
    });
  }

  /**
   * Register a transformation rule
   */
  public registerTransformation(rule: TransformationRule): void {
    this.transformationRules.set(rule.name, rule);

    // Initialize metrics
    this.transformationMetrics.set(rule.name, {
      executions: 0,
      successes: 0,
      failures: 0,
      averageTime: 0,
    });

    SafeLogger.info("Transformation rule registered", {
      name: rule.name,
      description: rule.description,
      priority: rule.priority,
      enabled: rule.enabled,
    });
  }

  /**
   * Remove a transformation rule
   */
  public unregisterTransformation(name: string): void {
    this.transformationRules.delete(name);
    this.transformationMetrics.delete(name);

    SafeLogger.info("Transformation rule unregistered", { name });
  }

  /**
   * Transform request using applicable rules
   */
  public async transformRequest(
    request: GatewayRequest,
  ): Promise<GatewayRequest> {
    let transformedRequest = request;
    const appliedTransformations: string[] = [];
    const startTime = performance.now();

    // Get applicable transformation rules, sorted by priority
    const applicableRules = Array.from(this.transformationRules.values())
      .filter(
        (rule) =>
          rule.enabled && rule.condition(request) && rule.transformRequest,
      )
      .sort((a, b) => a.priority - b.priority);

    for (const rule of applicableRules) {
      const ruleStartTime = performance.now();

      try {
        const newRequest = await rule.transformRequest!(transformedRequest);
        transformedRequest = newRequest;
        appliedTransformations.push(rule.name);

        // Update metrics
        this.updateTransformationMetrics(
          rule.name,
          true,
          performance.now() - ruleStartTime,
        );
      } catch (error) {
        SafeLogger.error("Request transformation failed", {
          rule: rule.name,
          error,
        });

        // Update metrics
        this.updateTransformationMetrics(
          rule.name,
          false,
          performance.now() - ruleStartTime,
        );
      }
    }

    if (appliedTransformations.length > 0) {
      const duration = performance.now() - startTime;

      SafeLogger.debug("Request transformations applied", {
        transformations: appliedTransformations,
        duration: Math.round(duration),
        requestId: request.gatewayContext?.requestId,
      });

      // Store transformation context
      if (transformedRequest.gatewayContext) {
        transformedRequest.gatewayContext.transformations = {
          ...transformedRequest.gatewayContext.transformations,
          request: appliedTransformations,
        };
      }
    }

    return transformedRequest;
  }

  /**
   * Transform response using applicable rules
   */
  public async transformResponse(
    response: GatewayResponse,
    request: GatewayRequest,
  ): Promise<GatewayResponse> {
    let transformedResponse = response;
    const appliedTransformations: string[] = [];
    const startTime = performance.now();

    // Get applicable transformation rules, sorted by priority
    const applicableRules = Array.from(this.transformationRules.values())
      .filter(
        (rule) =>
          rule.enabled && rule.condition(request) && rule.transformResponse,
      )
      .sort((a, b) => a.priority - b.priority);

    for (const rule of applicableRules) {
      const ruleStartTime = performance.now();

      try {
        const newResponse = await rule.transformResponse!(
          transformedResponse,
          request,
        );
        transformedResponse = newResponse;
        appliedTransformations.push(rule.name);

        // Update metrics
        this.updateTransformationMetrics(
          rule.name,
          true,
          performance.now() - ruleStartTime,
        );
      } catch (error) {
        SafeLogger.error("Response transformation failed", {
          rule: rule.name,
          error,
        });

        // Update metrics
        this.updateTransformationMetrics(
          rule.name,
          false,
          performance.now() - ruleStartTime,
        );
      }
    }

    if (appliedTransformations.length > 0) {
      const duration = performance.now() - startTime;

      SafeLogger.debug("Response transformations applied", {
        transformations: appliedTransformations,
        duration: Math.round(duration),
        requestId: request.gatewayContext?.requestId,
      });

      // Add transformation headers
      transformedResponse.headers.set(
        "X-Transformations-Applied",
        appliedTransformations.join(","),
      );

      // Store transformation context
      if (request.gatewayContext) {
        request.gatewayContext.transformations = {
          ...request.gatewayContext.transformations,
          response: appliedTransformations,
        };
      }
    }

    return transformedResponse;
  }

  /**
   * Get transformation metrics
   */
  public getTransformationMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};

    for (const [name, data] of this.transformationMetrics) {
      metrics[name] = {
        ...data,
        successRate:
          data.executions > 0 ? (data.successes / data.executions) * 100 : 0,
        failureRate:
          data.executions > 0 ? (data.failures / data.executions) * 100 : 0,
      };
    }

    return metrics;
  }

  /**
   * Enable or disable a transformation rule
   */
  public setTransformationEnabled(name: string, enabled: boolean): void {
    const rule = this.transformationRules.get(name);
    if (rule) {
      rule.enabled = enabled;
      SafeLogger.info("Transformation rule toggled", { name, enabled });
    }
  }

  // Private transformation methods

  private transformV1ToV2RequestBody(body: any): any {
    const transformed = { ...body };

    // Transform field names
    if ("guest_count" in transformed && !("guestCount" in transformed)) {
      transformed.guestCount = transformed.guest_count;
      delete transformed.guest_count;
    }

    if ("event_date" in transformed && !("eventDate" in transformed)) {
      transformed.eventDate = transformed.event_date;
      delete transformed.event_date;
    }

    if ("event_time" in transformed && !("eventTime" in transformed)) {
      transformed.eventTime = transformed.event_time;
      delete transformed.event_time;
    }

    // Transform service category format
    if ("service" in transformed && !("serviceCategory" in transformed)) {
      transformed.serviceCategory = transformed.service;
      delete transformed.service;
    }

    return transformed;
  }

  private transformV2ToV1ResponseBody(body: any): any {
    const transformed = { ...body };

    // Transform field names back to v1 format
    if ("guestCount" in transformed) {
      transformed.guest_count = transformed.guestCount;
      delete transformed.guestCount;
    }

    if ("eventDate" in transformed) {
      transformed.event_date = transformed.eventDate;
      delete transformed.eventDate;
    }

    if ("eventTime" in transformed) {
      transformed.event_time = transformed.eventTime;
      delete transformed.eventTime;
    }

    if ("serviceCategory" in transformed) {
      transformed.service = transformed.serviceCategory;
      delete transformed.serviceCategory;
    }

    // Remove v2-specific fields
    delete transformed.realTimeSupport;
    delete transformed.analyticsData;

    return transformed;
  }

  private standardizeDateFormats(obj: any): any {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.standardizeDateFormats(item));
    }

    const transformed = { ...obj };

    for (const [key, value] of Object.entries(transformed)) {
      if (typeof value === "string" && this.isDateString(value)) {
        // Standardize to ISO format
        try {
          const date = new Date(value);
          transformed[key] = date.toISOString();
        } catch (error) {
          // Keep original value if parsing fails
        }
      } else if (typeof value === "object") {
        transformed[key] = this.standardizeDateFormats(value);
      }
    }

    return transformed;
  }

  private isDateString(str: string): boolean {
    // Check common date patterns
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO format
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
    ];

    return (
      datePatterns.some((pattern) => pattern.test(str)) &&
      !isNaN(Date.parse(str))
    );
  }

  private standardizeErrorFormat(error: any, apiVersion?: string): any {
    // Standard error format
    const standardError = {
      error: {
        code: error.code || error.error_code || "UNKNOWN_ERROR",
        message: error.message || error.error_message || "An error occurred",
        details: error.details || error.data || {},
      },
    };

    // Add version-specific fields
    if (apiVersion === "v1") {
      // V1 uses snake_case
      return {
        error_code: standardError.error.code,
        error_message: standardError.error.message,
        data: standardError.error.details,
      };
    }

    return standardError;
  }

  private updateTransformationMetrics(
    name: string,
    success: boolean,
    duration: number,
  ): void {
    const metrics = this.transformationMetrics.get(name);
    if (!metrics) return;

    metrics.executions++;

    if (success) {
      metrics.successes++;
    } else {
      metrics.failures++;
    }

    // Update average time using exponential moving average
    if (metrics.executions === 1) {
      metrics.averageTime = duration;
    } else {
      metrics.averageTime = metrics.averageTime * 0.9 + duration * 0.1;
    }

    this.transformationMetrics.set(name, metrics);
  }
}

/**
 * Transformation rule factory functions
 */
export const createTransformationRule = {
  /**
   * Field mapping transformation
   */
  fieldMapping: (
    name: string,
    fieldMappings: Record<string, string>,
    condition?: (request: GatewayRequest) => boolean,
  ): TransformationRule => ({
    name,
    description: `Field mapping transformation: ${Object.keys(fieldMappings).join(", ")}`,
    priority: 50,
    enabled: true,
    condition: condition || (() => true),
    transformRequest: async (request) => {
      if (request.method === "GET" || request.method === "HEAD") {
        return request;
      }

      try {
        const body = await request.json();
        const transformedBody = { ...body };

        for (const [oldField, newField] of Object.entries(fieldMappings)) {
          if (oldField in transformedBody) {
            transformedBody[newField] = transformedBody[oldField];
            delete transformedBody[oldField];
          }
        }

        return new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(transformedBody),
        }) as GatewayRequest;
      } catch (error) {
        return request;
      }
    },
  }),

  /**
   * Header transformation
   */
  headerTransform: (
    name: string,
    headerMappings: Record<string, string | null>, // null to remove header
    condition?: (request: GatewayRequest) => boolean,
  ): TransformationRule => ({
    name,
    description: `Header transformation: ${Object.keys(headerMappings).join(", ")}`,
    priority: 10,
    enabled: true,
    condition: condition || (() => true),
    transformRequest: async (request) => {
      const headers = new Headers(request.headers);

      for (const [oldHeader, newHeader] of Object.entries(headerMappings)) {
        if (headers.has(oldHeader)) {
          const value = headers.get(oldHeader);
          headers.delete(oldHeader);

          if (newHeader && value) {
            headers.set(newHeader, value);
          }
        }
      }

      const transformedRequest = new Request(request.url, {
        method: request.method,
        headers,
        body: request.body,
      }) as GatewayRequest;

      transformedRequest.gatewayContext = request.gatewayContext;
      transformedRequest.apiVersion = request.apiVersion;

      return transformedRequest;
    },
  }),
};
