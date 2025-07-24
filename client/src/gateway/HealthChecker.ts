/**
 * Health Check System for API Gateway
 *
 * Provides comprehensive health monitoring for the API gateway and its dependencies.
 * Supports liveness probes, readiness probes, and dependency health checks.
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import { supabase } from "@/integrations/supabase/client";

export enum HealthStatus {
  HEALTHY = "healthy",
  UNHEALTHY = "unhealthy",
  DEGRADED = "degraded",
  UNKNOWN = "unknown",
}

export interface HealthCheck {
  name: string;
  description: string;
  check: () => Promise<HealthCheckResult>;
  timeout: number;
  critical: boolean;
}

export interface HealthCheckResult {
  status: HealthStatus;
  message?: string;
  responseTime?: number;
  details?: Record<string, unknown>;
  error?: Error;
}

export interface SystemHealth {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  version: string;
  checks: Record<string, HealthCheckResult>;
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    degraded: number;
    critical_failures: number;
  };
}

export interface ReadinessCheck {
  ready: boolean;
  timestamp: string;
  checks: Record<string, HealthCheckResult>;
  blocking_issues: string[];
}

/**
 * Health monitoring service
 */
export class HealthChecker {
  private readonly healthChecks = new Map<string, HealthCheck>();
  private lastHealthCheck: SystemHealth | null = null;
  private lastReadinessCheck: ReadinessCheck | null = null;
  private readonly startTime = Date.now();
  private readonly version = "1.0.0"; // Should be loaded from package.json

  constructor() {
    this.registerDefaultHealthChecks();
  }

  /**
   * Register default health checks
   */
  private registerDefaultHealthChecks(): void {
    // Database connectivity
    this.registerHealthCheck({
      name: "database",
      description: "Supabase database connectivity",
      timeout: 5000,
      critical: true,
      check: async () => {
        const startTime = Date.now();
        try {
          const { error } = await supabase
            .from("availability_slots")
            .select("count")
            .limit(1);

          const responseTime = Date.now() - startTime;

          if (error) {
            return {
              status: HealthStatus.UNHEALTHY,
              message: `Database query failed: ${error.message}`,
              responseTime,
              error,
            };
          }

          return {
            status: HealthStatus.HEALTHY,
            message: "Database connection successful",
            responseTime,
          };
        } catch (error) {
          return {
            status: HealthStatus.UNHEALTHY,
            message: "Database connection failed",
            responseTime: Date.now() - startTime,
            error: error as Error,
          };
        }
      },
    });

    // Memory usage
    this.registerHealthCheck({
      name: "memory",
      description: "System memory usage",
      timeout: 1000,
      critical: false,
      check: async () => {
        try {
          if (typeof performance !== "undefined" && performance.memory) {
            const memInfo = performance.memory;
            const usedMemory = memInfo.usedJSHeapSize;
            const totalMemory = memInfo.totalJSHeapSize;
            const memoryLimit = memInfo.jsHeapSizeLimit;

            const usagePercent = (usedMemory / memoryLimit) * 100;

            let status = HealthStatus.HEALTHY;
            let message = `Memory usage: ${usagePercent.toFixed(1)}%`;

            if (usagePercent > 90) {
              status = HealthStatus.UNHEALTHY;
              message = `Critical memory usage: ${usagePercent.toFixed(1)}%`;
            } else if (usagePercent > 75) {
              status = HealthStatus.DEGRADED;
              message = `High memory usage: ${usagePercent.toFixed(1)}%`;
            }

            return {
              status,
              message,
              responseTime: 1,
              details: {
                usedMemory: Math.round(usedMemory / 1024 / 1024), // MB
                totalMemory: Math.round(totalMemory / 1024 / 1024), // MB
                memoryLimit: Math.round(memoryLimit / 1024 / 1024), // MB
                usagePercent: Math.round(usagePercent * 100) / 100,
              },
            };
          }

          return {
            status: HealthStatus.UNKNOWN,
            message: "Memory information not available",
            responseTime: 1,
          };
        } catch (error) {
          return {
            status: HealthStatus.UNHEALTHY,
            message: "Failed to check memory usage",
            responseTime: 1,
            error: error as Error,
          };
        }
      },
    });

    // External API connectivity
    this.registerHealthCheck({
      name: "external_apis",
      description: "External API connectivity check",
      timeout: 10000,
      critical: false,
      check: async () => {
        const checks = [];

        // Check multiple external services
        const externalServices = [
          { name: "httpbin", url: "https://httpbin.org/status/200" },
          // Add other external services as needed
        ];

        const results = await Promise.allSettled(
          externalServices.map(async (service) => {
            const startTime = Date.now();
            try {
              const response = await fetch(service.url, {
                method: "GET",
                signal: AbortSignal.timeout(5000),
              });

              const responseTime = Date.now() - startTime;

              return {
                name: service.name,
                status: response.ok
                  ? HealthStatus.HEALTHY
                  : HealthStatus.UNHEALTHY,
                responseTime,
                statusCode: response.status,
              };
            } catch (error) {
              return {
                name: service.name,
                status: HealthStatus.UNHEALTHY,
                responseTime: Date.now() - startTime,
                error: error as Error,
              };
            }
          }),
        );

        const healthyCount = results.filter(
          (result) =>
            result.status === "fulfilled" &&
            result.value.status === HealthStatus.HEALTHY,
        ).length;

        const totalCount = results.length;
        const healthyPercentage = (healthyCount / totalCount) * 100;

        let overallStatus = HealthStatus.HEALTHY;
        if (healthyPercentage < 50) {
          overallStatus = HealthStatus.UNHEALTHY;
        } else if (healthyPercentage < 100) {
          overallStatus = HealthStatus.DEGRADED;
        }

        return {
          status: overallStatus,
          message: `${healthyCount}/${totalCount} external services healthy`,
          responseTime: Math.max(
            ...results.map((r) =>
              r.status === "fulfilled" ? r.value.responseTime : 5000,
            ),
          ),
          details: {
            services: results.map((result) =>
              result.status === "fulfilled"
                ? result.value
                : {
                    name: "unknown",
                    status: HealthStatus.UNHEALTHY,
                    error: result.reason,
                  },
            ),
            healthyPercentage: Math.round(healthyPercentage),
          },
        };
      },
    });
  }

  /**
   * Register a custom health check
   */
  public registerHealthCheck(check: HealthCheck): void {
    this.healthChecks.set(check.name, check);

    SafeLogger.info("Health check registered", {
      name: check.name,
      description: check.description,
      critical: check.critical,
      timeout: check.timeout,
    });
  }

  /**
   * Remove a health check
   */
  public unregisterHealthCheck(name: string): void {
    this.healthChecks.delete(name);
    SafeLogger.info("Health check unregistered", { name });
  }

  /**
   * Perform comprehensive health check
   */
  public async checkHealth(): Promise<SystemHealth> {
    const startTime = Date.now();
    const results = new Map<string, HealthCheckResult>();

    // Execute all health checks in parallel
    const checkPromises = Array.from(this.healthChecks.entries()).map(
      async ([name, check]) => {
        try {
          const result = await Promise.race([
            check.check(),
            this.timeoutPromise(check.timeout, name),
          ]);

          results.set(name, result);
        } catch (error) {
          results.set(name, {
            status: HealthStatus.UNHEALTHY,
            message: `Health check failed: ${error}`,
            error: error as Error,
            responseTime: Date.now() - startTime,
          });
        }
      },
    );

    await Promise.allSettled(checkPromises);

    // Calculate overall health status
    const healthResults = Array.from(results.values());
    const summary = this.calculateHealthSummary(healthResults);
    const overallStatus = this.determineOverallStatus(healthResults);

    const health: SystemHealth = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: this.version,
      checks: Object.fromEntries(results),
      summary,
    };

    this.lastHealthCheck = health;

    SafeLogger.info("Health check completed", {
      status: overallStatus,
      duration: Date.now() - startTime,
      summary,
    });

    return health;
  }

  /**
   * Perform readiness check (subset of health checks that must pass)
   */
  public async checkReadiness(): Promise<ReadinessCheck> {
    const criticalChecks = Array.from(this.healthChecks.entries()).filter(
      ([, check]) => check.critical,
    );

    const results = new Map<string, HealthCheckResult>();
    const blockingIssues: string[] = [];

    // Execute critical checks
    for (const [name, check] of criticalChecks) {
      try {
        const result = await Promise.race([
          check.check(),
          this.timeoutPromise(check.timeout, name),
        ]);

        results.set(name, result);

        if (result.status === HealthStatus.UNHEALTHY) {
          blockingIssues.push(
            `${name}: ${result.message || "Health check failed"}`,
          );
        }
      } catch (error) {
        const errorResult = {
          status: HealthStatus.UNHEALTHY,
          message: `Critical check failed: ${error}`,
          error: error as Error,
        };

        results.set(name, errorResult);
        blockingIssues.push(`${name}: ${errorResult.message}`);
      }
    }

    const ready = blockingIssues.length === 0;

    const readinessCheck: ReadinessCheck = {
      ready,
      timestamp: new Date().toISOString(),
      checks: Object.fromEntries(results),
      blocking_issues: blockingIssues,
    };

    this.lastReadinessCheck = readinessCheck;

    SafeLogger.info("Readiness check completed", {
      ready,
      blockingIssues: blockingIssues.length,
    });

    return readinessCheck;
  }

  /**
   * Get the last health check result
   */
  public getLastHealthCheck(): SystemHealth | null {
    return this.lastHealthCheck;
  }

  /**
   * Get the last readiness check result
   */
  public getLastReadinessCheck(): ReadinessCheck | null {
    return this.lastReadinessCheck;
  }

  /**
   * Start periodic health checks
   */
  public startPeriodicHealthChecks(interval: number = 60000): void {
    setInterval(async () => {
      try {
        await this.checkHealth();
      } catch (error) {
        SafeLogger.error("Periodic health check failed", error);
      }
    }, interval);

    SafeLogger.info("Periodic health checks started", { interval });
  }

  /**
   * Perform a single health check and log the result
   */
  public async performHealthCheck(): void {
    try {
      const health = await this.checkHealth();

      if (health.status !== HealthStatus.HEALTHY) {
        SafeLogger.warn("System health degraded", {
          status: health.status,
          unhealthyChecks: Object.entries(health.checks)
            .filter(([, result]) => result.status !== HealthStatus.HEALTHY)
            .map(([name]) => name),
        });
      }
    } catch (error) {
      SafeLogger.error("Health check execution failed", error);
    }
  }

  // Private helper methods

  private timeoutPromise(
    timeout: number,
    checkName: string,
  ): Promise<HealthCheckResult> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(`Health check '${checkName}' timed out after ${timeout}ms`),
        );
      }, timeout);
    });
  }

  private calculateHealthSummary(results: HealthCheckResult[]) {
    return {
      total: results.length,
      healthy: results.filter((r) => r.status === HealthStatus.HEALTHY).length,
      unhealthy: results.filter((r) => r.status === HealthStatus.UNHEALTHY)
        .length,
      degraded: results.filter((r) => r.status === HealthStatus.DEGRADED)
        .length,
      critical_failures: results.filter(
        (r) => r.status === HealthStatus.UNHEALTHY,
      ).length,
    };
  }

  private determineOverallStatus(results: HealthCheckResult[]): HealthStatus {
    const criticalChecks = Array.from(this.healthChecks.values())
      .filter((check) => check.critical)
      .map((check) => check.name);

    // Check if any critical checks failed
    const criticalFailures = results.filter(
      (result) =>
        result.status === HealthStatus.UNHEALTHY &&
        criticalChecks.includes(this.getCheckNameForResult(result)),
    );

    if (criticalFailures.length > 0) {
      return HealthStatus.UNHEALTHY;
    }

    // Check overall health distribution
    const unhealthyCount = results.filter(
      (r) => r.status === HealthStatus.UNHEALTHY,
    ).length;
    const degradedCount = results.filter(
      (r) => r.status === HealthStatus.DEGRADED,
    ).length;
    const totalCount = results.length;

    if (unhealthyCount > 0) {
      return unhealthyCount / totalCount > 0.5
        ? HealthStatus.UNHEALTHY
        : HealthStatus.DEGRADED;
    }

    if (degradedCount > 0) {
      return HealthStatus.DEGRADED;
    }

    return HealthStatus.HEALTHY;
  }

  private getCheckNameForResult(result: HealthCheckResult): string {
    // This is a simplified approach - in a real implementation,
    // you might want to include the check name in the result
    return "unknown";
  }
}

/**
 * Health check factory functions
 */
export const createHealthCheck = {
  /**
   * HTTP endpoint health check
   */
  httpEndpoint: (
    name: string,
    url: string,
    timeout: number = 5000,
  ): HealthCheck => ({
    name,
    description: `HTTP endpoint check: ${url}`,
    timeout,
    critical: true,
    check: async () => {
      const startTime = Date.now();
      try {
        const response = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(timeout),
        });

        const responseTime = Date.now() - startTime;

        return {
          status: response.ok ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
          message: `HTTP ${response.status}`,
          responseTime,
          details: {
            url,
            statusCode: response.status,
            statusText: response.statusText,
          },
        };
      } catch (error) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: `HTTP request failed: ${error}`,
          responseTime: Date.now() - startTime,
          error: error as Error,
        };
      }
    },
  }),

  /**
   * Database query health check
   */
  databaseQuery: (name: string, queryFn: () => Promise<void>): HealthCheck => ({
    name,
    description: `Database query check: ${name}`,
    timeout: 5000,
    critical: true,
    check: async () => {
      const startTime = Date.now();
      try {
        await queryFn();
        return {
          status: HealthStatus.HEALTHY,
          message: "Database query successful",
          responseTime: Date.now() - startTime,
        };
      } catch (error) {
        return {
          status: HealthStatus.UNHEALTHY,
          message: `Database query failed: ${error}`,
          responseTime: Date.now() - startTime,
          error: error as Error,
        };
      }
    },
  }),

  /**
   * Custom function health check
   */
  custom: (
    name: string,
    description: string,
    checkFn: () => Promise<HealthCheckResult>,
    critical: boolean = false,
    timeout: number = 5000,
  ): HealthCheck => ({
    name,
    description,
    timeout,
    critical,
    check: checkFn,
  }),
};
