/**
 * Metrics Collection System for API Gateway
 *
 * Provides comprehensive metrics collection, aggregation, and reporting
 * for monitoring API performance, usage patterns, and system health.
 */

import { SafeLogger } from "@/lib/LoggerUtils";

export interface RequestMetrics {
  requestId: string;
  timestamp: number;
  method: string;
  path: string;
  version?: string;
  statusCode: number;
  duration: number;
  responseSize?: number;
  userAgent?: string;
  clientIp?: string;
  cached?: boolean;
  errors?: string[];
}

export interface SystemMetrics {
  timestamp: number;
  memory: {
    used: number;
    total: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  performance: {
    eventLoopLag: number;
    uptime: number;
  };
  process: {
    cpuUsage: {
      user: number;
      system: number;
    };
    pid: number;
    version: string;
  };
}

export interface AggregatedMetrics {
  timeWindow: {
    start: number;
    end: number;
    durationMs: number;
  };
  requests: {
    total: number;
    successful: number;
    failed: number;
    byStatusCode: Record<number, number>;
    byMethod: Record<string, number>;
    byPath: Record<string, number>;
    byVersion: Record<string, number>;
  };
  performance: {
    averageResponseTime: number;
    medianResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    slowestRequests: RequestMetrics[];
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    byPath: Record<string, number>;
    recentErrors: Array<{
      timestamp: number;
      error: string;
      path: string;
      requestId: string;
    }>;
  };
  usage: {
    topPaths: Array<{ path: string; count: number }>;
    topVersions: Array<{ version: string; count: number }>;
    requestsPerMinute: number;
    peakRequestsPerMinute: number;
  };
}

export interface AlertRule {
  name: string;
  description: string;
  condition: (metrics: AggregatedMetrics) => boolean;
  severity: "low" | "medium" | "high" | "critical";
  cooldown: number; // Minutes before same alert can fire again
  enabled: boolean;
}

export interface Alert {
  id: string;
  rule: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: number;
  data: Record<string, unknown>;
  resolved?: boolean;
  resolvedAt?: number;
}

/**
 * Metrics collection and analysis service
 */
export class MetricsCollector {
  private requestMetrics: RequestMetrics[] = [];
  private systemMetrics: SystemMetrics[] = [];
  private readonly aggregationIntervals = new Map<string, NodeJS.Timeout>();
  private readonly alertRules = new Map<string, AlertRule>();
  private readonly activeAlerts = new Map<string, Alert>();
  private readonly alertCooldowns = new Map<string, number>();
  private readonly maxRequestMetrics = 10000; // Keep last 10k requests
  private readonly maxSystemMetrics = 1000; // Keep last 1k system metrics
  private readonly startTime = Date.now();

  constructor() {
    this.registerDefaultAlertRules();
    this.startSystemMetricsCollection();
    this.startPeriodicAggregation();
  }

  /**
   * Record a request metric
   */
  public recordRequest(
    requestId: string,
    metrics: Partial<RequestMetrics>,
  ): void {
    const requestMetric: RequestMetrics = {
      requestId,
      timestamp: Date.now(),
      method: metrics.method || "UNKNOWN",
      path: metrics.path || "unknown",
      version: metrics.version,
      statusCode: metrics.statusCode || 0,
      duration: metrics.duration || 0,
      responseSize: metrics.responseSize,
      userAgent: metrics.userAgent,
      clientIp: metrics.clientIp,
      cached: metrics.cached || false,
      errors: metrics.errors || [],
    };

    this.requestMetrics.push(requestMetric);

    // Trim metrics if we exceed the limit
    if (this.requestMetrics.length > this.maxRequestMetrics) {
      this.requestMetrics = this.requestMetrics.slice(-this.maxRequestMetrics);
    }

    SafeLogger.debug("Request metric recorded", {
      requestId,
      method: requestMetric.method,
      path: requestMetric.path,
      statusCode: requestMetric.statusCode,
      duration: requestMetric.duration,
    });
  }

  /**
   * Record an error metric
   */
  public recordError(requestId: string, error: Error | unknown): void {
    const errorMetric = {
      requestId,
      timestamp: Date.now(),
      error: error?.message || "Unknown error",
      stack: error?.stack,
      type: error?.constructor?.name || "Error",
    };

    SafeLogger.error("Error metric recorded", errorMetric);

    // Find and update the corresponding request metric
    const requestMetric = this.requestMetrics.find(
      (r) => r.requestId === requestId,
    );
    if (requestMetric) {
      requestMetric.errors = requestMetric.errors || [];
      requestMetric.errors.push(errorMetric.error);
    }
  }

  /**
   * Collect current system metrics
   */
  public collectSystemMetrics(): void {
    const systemMetric: SystemMetrics = {
      timestamp: Date.now(),
      memory: this.getMemoryMetrics(),
      performance: this.getPerformanceMetrics(),
      process: this.getProcessMetrics(),
    };

    this.systemMetrics.push(systemMetric);

    // Trim system metrics if we exceed the limit
    if (this.systemMetrics.length > this.maxSystemMetrics) {
      this.systemMetrics = this.systemMetrics.slice(-this.maxSystemMetrics);
    }
  }

  /**
   * Get aggregated metrics for a time period
   */
  public getAggregatedMetrics(
    startTime?: number,
    endTime?: number,
  ): AggregatedMetrics {
    const now = Date.now();
    const start = startTime || now - 3600000; // Default: last hour
    const end = endTime || now;

    const filteredRequests = this.requestMetrics.filter(
      (r) => r.timestamp >= start && r.timestamp <= end,
    );

    return this.aggregateRequestMetrics(filteredRequests, start, end);
  }

  /**
   * Get all metrics in different formats
   */
  public async getMetrics(): Promise<{
    current: AggregatedMetrics;
    lastHour: AggregatedMetrics;
    last24Hours: AggregatedMetrics;
    system: SystemMetrics[];
    alerts: Alert[];
  }> {
    const now = Date.now();

    return {
      current: this.getAggregatedMetrics(now - 300000, now), // Last 5 minutes
      lastHour: this.getAggregatedMetrics(now - 3600000, now),
      last24Hours: this.getAggregatedMetrics(now - 86400000, now),
      system: this.systemMetrics.slice(-100), // Last 100 system metrics
      alerts: Array.from(this.activeAlerts.values()),
    };
  }

  /**
   * Register an alert rule
   */
  public registerAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.name, rule);
    SafeLogger.info("Alert rule registered", {
      name: rule.name,
      severity: rule.severity,
      enabled: rule.enabled,
    });
  }

  /**
   * Remove an alert rule
   */
  public removeAlertRule(name: string): void {
    this.alertRules.delete(name);
    this.alertCooldowns.delete(name);
    SafeLogger.info("Alert rule removed", { name });
  }

  /**
   * Enable or disable an alert rule
   */
  public setAlertRuleEnabled(name: string, enabled: boolean): void {
    const rule = this.alertRules.get(name);
    if (rule) {
      rule.enabled = enabled;
      SafeLogger.info("Alert rule toggled", { name, enabled });
    }
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    uptime: number;
    requestsTotal: number;
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    memoryUsage: number;
    systemHealth: "healthy" | "warning" | "critical";
  } {
    const now = Date.now();
    const lastHour = this.getAggregatedMetrics(now - 3600000, now);
    const latestSystem = this.systemMetrics[this.systemMetrics.length - 1];

    const errorRate =
      lastHour.requests.total > 0
        ? (lastHour.requests.failed / lastHour.requests.total) * 100
        : 0;

    const memoryUsage = latestSystem
      ? (latestSystem.memory.heapUsed / latestSystem.memory.heapTotal) * 100
      : 0;

    let systemHealth: "healthy" | "warning" | "critical" = "healthy";
    if (
      errorRate > 10 ||
      memoryUsage > 90 ||
      lastHour.performance.averageResponseTime > 5000
    ) {
      systemHealth = "critical";
    } else if (
      errorRate > 5 ||
      memoryUsage > 75 ||
      lastHour.performance.averageResponseTime > 2000
    ) {
      systemHealth = "warning";
    }

    return {
      uptime: Date.now() - this.startTime,
      requestsTotal: this.requestMetrics.length,
      requestsPerMinute: lastHour.usage.requestsPerMinute,
      averageResponseTime: lastHour.performance.averageResponseTime,
      errorRate,
      memoryUsage,
      systemHealth,
    };
  }

  // Private methods

  private registerDefaultAlertRules(): void {
    // High error rate alert
    this.registerAlertRule({
      name: "high_error_rate",
      description: "Error rate above 5% for 5+ minutes",
      severity: "high",
      cooldown: 10,
      enabled: true,
      condition: (metrics) => {
        return (
          metrics.requests.total > 10 &&
          metrics.requests.failed / metrics.requests.total > 0.05
        );
      },
    });

    // Slow response time alert
    this.registerAlertRule({
      name: "slow_response_time",
      description: "Average response time above 2 seconds",
      severity: "medium",
      cooldown: 15,
      enabled: true,
      condition: (metrics) => {
        return metrics.performance.averageResponseTime > 2000;
      },
    });

    // High memory usage alert
    this.registerAlertRule({
      name: "high_memory_usage",
      description: "Memory usage above 85%",
      severity: "high",
      cooldown: 5,
      enabled: true,
      condition: () => {
        const latest = this.systemMetrics[this.systemMetrics.length - 1];
        return (
          latest && latest.memory.heapUsed / latest.memory.heapTotal > 0.85
        );
      },
    });

    // Request volume spike alert
    this.registerAlertRule({
      name: "request_volume_spike",
      description: "Request volume 3x above normal",
      severity: "medium",
      cooldown: 10,
      enabled: true,
      condition: (metrics) => {
        return (
          metrics.usage.requestsPerMinute >
          metrics.usage.peakRequestsPerMinute * 3
        );
      },
    });
  }

  private aggregateRequestMetrics(
    requests: RequestMetrics[],
    start: number,
    end: number,
  ): AggregatedMetrics {
    if (requests.length === 0) {
      return this.createEmptyAggregatedMetrics(start, end);
    }

    const durations = requests.map((r) => r.duration).sort((a, b) => a - b);
    const successful = requests.filter(
      (r) => r.statusCode >= 200 && r.statusCode < 400,
    );
    const failed = requests.filter((r) => r.statusCode >= 400);

    // Calculate percentiles
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);
    const medianIndex = Math.floor(durations.length * 0.5);

    // Group by various dimensions
    const byStatusCode = this.groupBy(requests, (r) => r.statusCode);
    const byMethod = this.groupBy(requests, (r) => r.method);
    const byPath = this.groupBy(requests, (r) => r.path);
    const byVersion = this.groupBy(
      requests.filter((r) => r.version),
      (r) => r.version!,
    );

    // Get top paths
    const pathCounts = this.countBy(requests, (r) => r.path);
    const topPaths = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top versions
    const versionCounts = this.countBy(
      requests.filter((r) => r.version),
      (r) => r.version!,
    );
    const topVersions = Object.entries(versionCounts)
      .map(([version, count]) => ({ version, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate requests per minute
    const durationMinutes = (end - start) / 60000;
    const requestsPerMinute =
      durationMinutes > 0 ? requests.length / durationMinutes : 0;

    // Get recent errors
    const recentErrors = requests
      .filter((r) => r.errors && r.errors.length > 0)
      .slice(-10)
      .map((r) => ({
        timestamp: r.timestamp,
        error: r.errors![0],
        path: r.path,
        requestId: r.requestId,
      }));

    // Get slowest requests
    const slowestRequests = requests
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    return {
      timeWindow: {
        start,
        end,
        durationMs: end - start,
      },
      requests: {
        total: requests.length,
        successful: successful.length,
        failed: failed.length,
        byStatusCode,
        byMethod,
        byPath,
        byVersion,
      },
      performance: {
        averageResponseTime:
          durations.length > 0
            ? durations.reduce((sum, d) => sum + d, 0) / durations.length
            : 0,
        medianResponseTime: durations[medianIndex] || 0,
        p95ResponseTime: durations[p95Index] || 0,
        p99ResponseTime: durations[p99Index] || 0,
        slowestRequests,
      },
      errors: {
        total: recentErrors.length,
        byType: {},
        byPath: this.countBy(failed, (r) => r.path),
        recentErrors,
      },
      usage: {
        topPaths,
        topVersions,
        requestsPerMinute,
        peakRequestsPerMinute: requestsPerMinute, // Simplified for now
      },
    };
  }

  private createEmptyAggregatedMetrics(
    start: number,
    end: number,
  ): AggregatedMetrics {
    return {
      timeWindow: { start, end, durationMs: end - start },
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byStatusCode: {},
        byMethod: {},
        byPath: {},
        byVersion: {},
      },
      performance: {
        averageResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        slowestRequests: [],
      },
      errors: {
        total: 0,
        byType: {},
        byPath: {},
        recentErrors: [],
      },
      usage: {
        topPaths: [],
        topVersions: [],
        requestsPerMinute: 0,
        peakRequestsPerMinute: 0,
      },
    };
  }

  private getMemoryMetrics() {
    if (typeof process !== "undefined" && process.memoryUsage) {
      const memory = process.memoryUsage();
      return {
        used: memory.heapUsed,
        total: memory.heapTotal,
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal,
        external: memory.external,
        rss: memory.rss,
      };
    }

    // Browser fallback
    if (typeof performance !== "undefined" && performance.memory) {
      const memory = performance.memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        external: 0,
        rss: memory.totalJSHeapSize,
      };
    }

    return {
      used: 0,
      total: 0,
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      rss: 0,
    };
  }

  private getPerformanceMetrics() {
    const uptime = Date.now() - this.startTime;

    return {
      eventLoopLag: 0, // Would need more sophisticated measurement
      uptime,
    };
  }

  private getProcessMetrics() {
    if (typeof process !== "undefined") {
      const cpuUsage = process.cpuUsage
        ? process.cpuUsage()
        : { user: 0, system: 0 };

      return {
        cpuUsage,
        pid: process.pid || 0,
        version: process.version || "unknown",
      };
    }

    return {
      cpuUsage: { user: 0, system: 0 },
      pid: 0,
      version: "browser",
    };
  }

  private startSystemMetricsCollection(): void {
    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
  }

  private startPeriodicAggregation(): void {
    // Check for alerts every minute
    setInterval(() => {
      this.checkAlerts();
    }, 60000);
  }

  private checkAlerts(): void {
    const metrics = this.getAggregatedMetrics(Date.now() - 300000); // Last 5 minutes

    for (const [name, rule] of this.alertRules) {
      if (!rule.enabled) continue;

      // Check cooldown
      const lastAlert = this.alertCooldowns.get(name) || 0;
      if (Date.now() - lastAlert < rule.cooldown * 60000) {
        continue;
      }

      try {
        if (rule.condition(metrics)) {
          this.fireAlert(rule, metrics);
        }
      } catch (error) {
        SafeLogger.error("Alert rule evaluation failed", { rule: name, error });
      }
    }
  }

  private fireAlert(rule: AlertRule, metrics: AggregatedMetrics): void {
    const alertId = `alert_${Date.now()}_${rule.name}`;
    const alert: Alert = {
      id: alertId,
      rule: rule.name,
      severity: rule.severity,
      message: rule.description,
      timestamp: Date.now(),
      data: {
        metrics: {
          requestsTotal: metrics.requests.total,
          errorRate:
            metrics.requests.total > 0
              ? (metrics.requests.failed / metrics.requests.total) * 100
              : 0,
          averageResponseTime: metrics.performance.averageResponseTime,
        },
      },
    };

    this.activeAlerts.set(alertId, alert);
    this.alertCooldowns.set(rule.name, Date.now());

    SafeLogger.warn("Alert fired", {
      rule: rule.name,
      severity: rule.severity,
      message: rule.description,
      data: alert.data,
    });
  }

  private groupBy<T>(
    items: T[],
    keyFn: (item: T) => string | number,
  ): Record<string | number, number> {
    const result: Record<string | number, number> = {};

    for (const item of items) {
      const key = keyFn(item);
      result[key] = (result[key] || 0) + 1;
    }

    return result;
  }

  private countBy<T>(
    items: T[],
    keyFn: (item: T) => string,
  ): Record<string, number> {
    const result: Record<string, number> = {};

    for (const item of items) {
      const key = keyFn(item);
      result[key] = (result[key] || 0) + 1;
    }

    return result;
  }
}

/**
 * Factory functions for creating metrics collectors with different configurations
 */
export const createMetricsCollector = {
  /**
   * Production metrics collector with full features
   */
  production: (): MetricsCollector => {
    const collector = new MetricsCollector();

    // Add production-specific alert rules
    collector.registerAlertRule({
      name: "critical_error_rate",
      description: "Critical error rate above 15%",
      severity: "critical",
      cooldown: 5,
      enabled: true,
      condition: (metrics) => {
        return (
          metrics.requests.total > 10 &&
          metrics.requests.failed / metrics.requests.total > 0.15
        );
      },
    });

    return collector;
  },

  /**
   * Development metrics collector with relaxed thresholds
   */
  development: (): MetricsCollector => {
    const collector = new MetricsCollector();

    // Disable some alerts in development
    collector.setAlertRuleEnabled("high_memory_usage", false);
    collector.setAlertRuleEnabled("request_volume_spike", false);

    return collector;
  },

  /**
   * Minimal metrics collector for testing
   */
  testing: (): MetricsCollector => {
    const collector = new MetricsCollector();

    // Disable all alerts in testing
    collector.setAlertRuleEnabled("high_error_rate", false);
    collector.setAlertRuleEnabled("slow_response_time", false);
    collector.setAlertRuleEnabled("high_memory_usage", false);
    collector.setAlertRuleEnabled("request_volume_spike", false);

    return collector;
  },
};
