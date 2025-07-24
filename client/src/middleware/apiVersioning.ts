/**
 * API Versioning Security Policies for Wesley's Ambacht
 *
 * Features:
 * - Version-based security policies
 * - Backward compatibility security controls
 * - Version deprecation warnings
 * - Security policy enforcement per API version
 * - Version-specific rate limiting
 * - Migration path security validation
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import {
  SecurityMonitor,
  SECURITY_EVENT_TYPES,
  SEVERITY_LEVELS,
} from "./securityMonitor";

// API Version definitions
export const API_VERSIONS = {
  v1: {
    version: "1.0.0",
    status: "deprecated",
    deprecated: new Date("2024-12-01"),
    sunsetDate: new Date("2025-06-01"),
    securityLevel: "legacy",
    supportedEndpoints: [
      "/api/v1/availability",
      "/api/v1/services",
      "/api/v1/quote",
    ],
  },
  v2: {
    version: "2.0.0",
    status: "current",
    deprecated: null,
    sunsetDate: null,
    securityLevel: "standard",
    supportedEndpoints: [
      "/api/v2/availability",
      "/api/v2/services",
      "/api/v2/quote",
      "/api/v2/booking",
    ],
  },
  v3: {
    version: "3.0.0",
    status: "beta",
    deprecated: null,
    sunsetDate: null,
    securityLevel: "enhanced",
    supportedEndpoints: [
      "/api/v3/availability",
      "/api/v3/services",
      "/api/v3/quote",
      "/api/v3/booking",
      "/api/v3/analytics",
    ],
  },
} as const;

type APIVersion = keyof typeof API_VERSIONS;

// Security policies per version
const VERSION_SECURITY_POLICIES = {
  v1: {
    requireHTTPS: false, // Legacy support
    requireAPIKey: false,
    maxRequestSize: "1mb",
    allowedMethods: ["GET", "POST"],
    requiredHeaders: [],
    rateLimitMultiplier: 0.5, // Reduced limits for legacy
    securityHeaders: {
      "X-API-Version": "v1",
      "X-API-Status": "deprecated",
      "X-API-Sunset": "2025-06-01",
      Warning:
        '299 - "API version v1 is deprecated. Please migrate to v2 or v3"',
    },
    allowedFeatures: ["basic"],
    restrictions: [
      "No real-time features",
      "Limited data access",
      "Read-only operations preferred",
    ],
  },
  v2: {
    requireHTTPS: true,
    requireAPIKey: true,
    maxRequestSize: "5mb",
    allowedMethods: ["GET", "POST", "PUT", "DELETE"],
    requiredHeaders: ["Content-Type"],
    rateLimitMultiplier: 1.0,
    securityHeaders: {
      "X-API-Version": "v2",
      "X-API-Status": "current",
    },
    allowedFeatures: ["basic", "booking", "notifications"],
    restrictions: [],
  },
  v3: {
    requireHTTPS: true,
    requireAPIKey: true,
    maxRequestSize: "10mb",
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    requiredHeaders: ["Content-Type", "User-Agent"],
    rateLimitMultiplier: 1.5, // Higher limits for new version
    securityHeaders: {
      "X-API-Version": "v3",
      "X-API-Status": "beta",
      "X-API-Features": "enhanced-security,real-time,analytics",
    },
    allowedFeatures: [
      "basic",
      "booking",
      "notifications",
      "real-time",
      "analytics",
    ],
    restrictions: ["Beta features may change", "Enhanced monitoring enabled"],
  },
} as const;

/**
 * API Version Detection and Validation
 */
export class APIVersionManager {
  /**
   * Extract API version from request
   */
  static extractVersion(request: Request): {
    version: APIVersion | null;
    method: "header" | "path" | "query" | "default";
  } {
    const url = new URL(request.url);

    // Method 1: Check version header
    const versionHeader =
      request.headers.get("X-API-Version") ||
      request.headers.get("Accept-Version");
    if (versionHeader && versionHeader in API_VERSIONS) {
      return { version: versionHeader as APIVersion, method: "header" };
    }

    // Method 2: Check URL path
    const pathMatch = url.pathname.match(/^\/api\/(v[1-3])\//);
    if (pathMatch && pathMatch[1] in API_VERSIONS) {
      return { version: pathMatch[1] as APIVersion, method: "path" };
    }

    // Method 3: Check query parameter
    const queryVersion = url.searchParams.get("version");
    if (queryVersion && queryVersion in API_VERSIONS) {
      return { version: queryVersion as APIVersion, method: "query" };
    }

    // Method 4: Default to current version
    return { version: "v2", method: "default" };
  }

  /**
   * Validate version compatibility and security requirements
   */
  static async validateVersionRequest(
    request: Request,
    version: APIVersion,
    endpoint: string,
  ): Promise<{
    allowed: boolean;
    response?: Response;
    warnings: string[];
    securityLevel: string;
  }> {
    const warnings: string[] = [];
    const versionConfig = API_VERSIONS[version];
    const securityPolicy = VERSION_SECURITY_POLICIES[version];

    // Check if version exists
    if (!versionConfig) {
      return {
        allowed: false,
        response: this.createVersionErrorResponse("Unsupported API version"),
        warnings: [],
        securityLevel: "unknown",
      };
    }

    // Check if version is deprecated
    if (versionConfig.status === "deprecated") {
      warnings.push(
        `API version ${version} is deprecated and will be sunset on ${versionConfig.sunsetDate?.toISOString().split("T")[0]}`,
      );

      // Log deprecation usage
      SecurityMonitor.logEvent(
        SECURITY_EVENT_TYPES.SUSPICIOUS_ACTIVITY,
        SEVERITY_LEVELS.LOW,
        this.getClientIP(request),
        {
          event: "deprecated_api_version_used",
          version,
          endpoint,
          sunsetDate: versionConfig.sunsetDate,
        },
        {
          userAgent: request.headers.get("user-agent"),
          endpoint,
        },
      );

      // Block requests if past sunset date
      if (versionConfig.sunsetDate && new Date() > versionConfig.sunsetDate) {
        return {
          allowed: false,
          response: this.createVersionErrorResponse(
            `API version ${version} has been sunset. Please upgrade to a supported version.`,
            410, // Gone
          ),
          warnings,
          securityLevel: versionConfig.securityLevel,
        };
      }
    }

    // Check endpoint support
    if (
      !versionConfig.supportedEndpoints.some(
        (supportedEndpoint) =>
          endpoint.startsWith(supportedEndpoint) ||
          new RegExp(supportedEndpoint.replace("*", ".*")).test(endpoint),
      )
    ) {
      return {
        allowed: false,
        response: this.createVersionErrorResponse(
          `Endpoint ${endpoint} is not supported in API version ${version}`,
          404,
        ),
        warnings,
        securityLevel: versionConfig.securityLevel,
      };
    }

    // Check HTTPS requirement
    if (securityPolicy.requireHTTPS && !request.url.startsWith("https://")) {
      return {
        allowed: false,
        response: this.createVersionErrorResponse(
          `API version ${version} requires HTTPS`,
          426, // Upgrade Required
        ),
        warnings,
        securityLevel: versionConfig.securityLevel,
      };
    }

    // Check required headers
    for (const header of securityPolicy.requiredHeaders) {
      if (!request.headers.has(header.toLowerCase())) {
        warnings.push(`Missing required header: ${header}`);
      }
    }

    // Check method support
    if (!securityPolicy.allowedMethods.includes(request.method)) {
      return {
        allowed: false,
        response: this.createVersionErrorResponse(
          `Method ${request.method} not allowed for API version ${version}`,
          405, // Method Not Allowed
        ),
        warnings,
        securityLevel: versionConfig.securityLevel,
      };
    }

    // Check content length (if applicable)
    const contentLength = request.headers.get("content-length");
    if (contentLength) {
      const maxSize = this.parseSize(securityPolicy.maxRequestSize);
      if (parseInt(contentLength) > maxSize) {
        return {
          allowed: false,
          response: this.createVersionErrorResponse(
            `Request too large. Maximum size for API version ${version}: ${securityPolicy.maxRequestSize}`,
            413, // Payload Too Large
          ),
          warnings,
          securityLevel: versionConfig.securityLevel,
        };
      }
    }

    return {
      allowed: true,
      warnings,
      securityLevel: versionConfig.securityLevel,
    };
  }

  /**
   * Apply version-specific security headers to response
   */
  static applyVersionHeaders(
    response: Response,
    version: APIVersion,
  ): Response {
    const securityPolicy = VERSION_SECURITY_POLICIES[version];

    // Apply version-specific security headers
    Object.entries(securityPolicy.securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Add version info headers
    response.headers.set("X-API-Version-Status", API_VERSIONS[version].status);
    response.headers.set(
      "X-API-Security-Level",
      API_VERSIONS[version].securityLevel,
    );

    // Add deprecation headers if applicable
    if (
      API_VERSIONS[version].status === "deprecated" &&
      API_VERSIONS[version].sunsetDate
    ) {
      response.headers.set(
        "Sunset",
        API_VERSIONS[version].sunsetDate!.toUTCString(),
      );
      response.headers.set("Link", '</api/v2/>; rel="successor-version"');
    }

    return response;
  }

  /**
   * Get rate limit multiplier for version
   */
  static getRateLimitMultiplier(version: APIVersion): number {
    return VERSION_SECURITY_POLICIES[version].rateLimitMultiplier;
  }

  /**
   * Check if feature is allowed for version
   */
  static isFeatureAllowed(version: APIVersion, feature: string): boolean {
    return VERSION_SECURITY_POLICIES[version].allowedFeatures.includes(feature);
  }

  /**
   * Get version migration recommendations
   */
  static getUpgradeRecommendations(currentVersion: APIVersion): {
    recommendedVersion: APIVersion;
    benefits: string[];
    migrationSteps: string[];
    securityImprovements: string[];
  } {
    const recommendations = {
      v1: {
        recommendedVersion: "v2" as APIVersion,
        benefits: [
          "Enhanced security with HTTPS requirement",
          "API key authentication",
          "Improved rate limiting",
          "Better error handling",
          "Support for booking operations",
        ],
        migrationSteps: [
          "Update API endpoints from /api/v1/* to /api/v2/*",
          "Implement API key authentication",
          "Ensure HTTPS is used for all requests",
          "Update request/response formats as needed",
          "Test all functionality with new version",
        ],
        securityImprovements: [
          "HTTPS enforcement",
          "API key requirement",
          "Enhanced input validation",
          "Better rate limiting",
          "Improved audit logging",
        ],
      },
      v2: {
        recommendedVersion: "v3" as APIVersion,
        benefits: [
          "Real-time features support",
          "Enhanced analytics access",
          "Higher rate limits",
          "PATCH method support",
          "Advanced security features",
        ],
        migrationSteps: [
          "Update API endpoints from /api/v2/* to /api/v3/*",
          "Add User-Agent header to requests",
          "Implement real-time event handling if needed",
          "Update to handle new response formats",
          "Test beta features thoroughly",
        ],
        securityImprovements: [
          "Enhanced monitoring",
          "Real-time threat detection",
          "Advanced analytics",
          "Better user agent validation",
          "Improved request tracking",
        ],
      },
      v3: {
        recommendedVersion: "v3" as APIVersion,
        benefits: ["You are using the latest version"],
        migrationSteps: ["No migration needed"],
        securityImprovements: ["Already using latest security features"],
      },
    };

    return recommendations[currentVersion];
  }

  // Private helper methods

  private static getClientIP(request: Request): string {
    return (
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"
    );
  }

  private static parseSize(sizeStr: string): number {
    const units: { [key: string]: number } = {
      b: 1,
      kb: 1024,
      mb: 1024 * 1024,
      gb: 1024 * 1024 * 1024,
    };

    const match = sizeStr.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2] || "b";

    return Math.floor(value * (units[unit] || 1));
  }

  private static createVersionErrorResponse(
    message: string,
    status: number = 400,
  ): Response {
    return new Response(
      JSON.stringify({
        error: "API Version Error",
        message: message,
        supportedVersions: Object.keys(API_VERSIONS),
        currentVersion: "v2",
        documentation: "https://wesley-ambacht.nl/api/docs",
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          "X-API-Error": "version-error",
        },
      },
    );
  }
}

/**
 * API Versioning Middleware
 */
export function createVersioningMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      // Convert to standard Request
      const request =
        req instanceof Request
          ? req
          : new Request(req.url, {
              method: req.method,
              headers: req.headers,
              body:
                req.method !== "GET" && req.method !== "HEAD"
                  ? JSON.stringify(req.body)
                  : undefined,
            });

      const { version, method } = APIVersionManager.extractVersion(request);
      const endpoint = new URL(request.url).pathname;

      if (!version) {
        return res.status(400).json({
          error: "Invalid API version",
          supportedVersions: Object.keys(API_VERSIONS),
        });
      }

      // Validate version requirements
      const validation = await APIVersionManager.validateVersionRequest(
        request,
        version,
        endpoint,
      );

      if (!validation.allowed) {
        if (validation.response) {
          const responseData = await validation.response.json();
          return res.status(validation.response.status).json(responseData);
        }
        return res.status(400).json({ error: "Version validation failed" });
      }

      // Attach version info to request
      req.apiVersion = version;
      req.apiVersionMethod = method;
      req.apiVersionWarnings = validation.warnings;
      req.apiSecurityLevel = validation.securityLevel;
      req.rateLimitMultiplier =
        APIVersionManager.getRateLimitMultiplier(version);

      // Add version headers to response
      const originalSend = res.send;
      res.send = function (data: any) {
        // Apply version-specific headers
        const versionHeaders =
          VERSION_SECURITY_POLICIES[version].securityHeaders;
        Object.entries(versionHeaders).forEach(([key, value]) => {
          res.setHeader(key, value);
        });

        // Add warnings if any
        if (validation.warnings.length > 0) {
          res.setHeader("X-API-Warnings", validation.warnings.join("; "));
        }

        return originalSend.call(this, data);
      };

      if (next) next();
    } catch (error) {
      SafeLogger.error("API versioning middleware error", error);
      if (next) next();
    }
  };
}

/**
 * React hook for API version management
 */
export function useAPIVersioning() {
  const getCurrentVersion = (): APIVersion => {
    // Try to detect from current API calls or default to v2
    return "v2";
  };

  const getVersionInfo = (version: APIVersion) => {
    return API_VERSIONS[version];
  };

  const getUpgradeRecommendations = (version: APIVersion) => {
    return APIVersionManager.getUpgradeRecommendations(version);
  };

  const checkFeatureSupport = (version: APIVersion, feature: string) => {
    return APIVersionManager.isFeatureAllowed(version, feature);
  };

  return {
    getCurrentVersion,
    getVersionInfo,
    getUpgradeRecommendations,
    checkFeatureSupport,
    supportedVersions: Object.keys(API_VERSIONS) as APIVersion[],
  };
}
