/**
 * Security Monitoring and Alerting System for Wesley's Ambacht
 *
 * Features:
 * - Real-time security event monitoring
 * - Failed authentication tracking
 * - Suspicious pattern detection
 * - Performance metric tracking
 * - Automated alerting system
 * - Security dashboard metrics
 * - GDPR compliance monitoring
 */

import { SafeLogger } from "@/lib/LoggerUtils";

// Security event types
export const SECURITY_EVENT_TYPES = {
  // Authentication events
  AUTH_SUCCESS: "auth_success",
  AUTH_FAILURE: "auth_failure",
  AUTH_LOCKED: "auth_locked",

  // Rate limiting events
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
  RATE_LIMIT_WARNING: "rate_limit_warning",

  // Input validation events
  XSS_ATTEMPT: "xss_attempt",
  SQL_INJECTION_ATTEMPT: "sql_injection_attempt",
  MALICIOUS_INPUT: "malicious_input",

  // API security events
  INVALID_API_KEY: "invalid_api_key",
  API_ABUSE: "api_abuse",
  UNAUTHORIZED_ACCESS: "unauthorized_access",

  // System security events
  DDOS_DETECTED: "ddos_detected",
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
  SECURITY_BREACH: "security_breach",

  // Privacy/GDPR events
  DATA_ACCESS: "data_access",
  DATA_EXPORT: "data_export",
  DATA_DELETION: "data_deletion",
} as const;

type SecurityEventType =
  (typeof SECURITY_EVENT_TYPES)[keyof typeof SECURITY_EVENT_TYPES];

// Severity levels
export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

type SeverityLevel = (typeof SEVERITY_LEVELS)[keyof typeof SEVERITY_LEVELS];

// Security event interface
interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SeverityLevel;
  timestamp: Date;
  ip: string;
  userAgent?: string;
  userId?: string;
  endpoint?: string;
  details: Record<string, any>;
  resolved?: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Alert configuration
interface AlertRule {
  id: string;
  name: string;
  eventType: SecurityEventType | "any";
  severity: SeverityLevel;
  threshold: number;
  timeWindowMs: number;
  enabled: boolean;
  actions: AlertAction[];
}

interface AlertAction {
  type: "email" | "webhook" | "log" | "block_ip";
  config: Record<string, any>;
}

// Monitoring metrics
interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  recentEvents: SecurityEvent[];
  topAttackerIPs: Array<{ ip: string; count: number }>;
  authFailureRate: number;
  apiAbuseRate: number;
  systemHealth: "healthy" | "warning" | "critical";
}

/**
 * Security Monitoring System
 */
export class SecurityMonitor {
  private static events: SecurityEvent[] = [];
  private static alertRules: AlertRule[] = [];
  private static blockedIPs = new Set<string>();
  private static suspiciousIPs = new Map<
    string,
    { count: number; lastSeen: Date }
  >();

  /**
   * Initialize security monitoring with default alert rules
   */
  static initialize(): void {
    this.setupDefaultAlertRules();
    this.startCleanupTimer();

    SafeLogger.info("Security monitoring initialized", {
      alertRules: this.alertRules.length,
      monitoringActive: true,
    });
  }

  /**
   * Log security event
   */
  static logEvent(
    type: SecurityEventType,
    severity: SeverityLevel,
    ip: string,
    details: Record<string, any>,
    options: {
      userAgent?: string;
      userId?: string;
      endpoint?: string;
    } = {},
  ): string {
    const eventId = this.generateEventId();

    const event: SecurityEvent = {
      id: eventId,
      type,
      severity,
      timestamp: new Date(),
      ip,
      userAgent: options.userAgent,
      userId: options.userId,
      endpoint: options.endpoint,
      details,
      resolved: false,
    };

    this.events.push(event);

    // Keep only last 10000 events to prevent memory issues
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000);
    }

    // Track suspicious IPs
    this.trackSuspiciousIP(ip, severity);

    // Check alert rules
    this.checkAlertRules(event);

    // Log to system
    SafeLogger.security("Security event logged", {
      eventId,
      type,
      severity,
      ip,
      endpoint: options.endpoint,
      details,
    });

    return eventId;
  }

  /**
   * Track failed authentication attempts
   */
  static trackAuthFailure(
    ip: string,
    details: {
      username?: string;
      endpoint: string;
      reason: string;
      userAgent?: string;
    },
  ): void {
    this.logEvent(
      SECURITY_EVENT_TYPES.AUTH_FAILURE,
      SEVERITY_LEVELS.MEDIUM,
      ip,
      details,
      {
        userAgent: details.userAgent,
        endpoint: details.endpoint,
      },
    );

    // Check for brute force patterns
    const recentFailures = this.getRecentAuthFailures(ip);

    if (recentFailures.length >= 5) {
      // 5 failures in window
      this.logEvent(
        SECURITY_EVENT_TYPES.AUTH_LOCKED,
        SEVERITY_LEVELS.HIGH,
        ip,
        {
          reason: "Too many failed authentication attempts",
          failureCount: recentFailures.length,
          timeWindow: "5 minutes",
        },
      );

      // Block IP temporarily
      this.blockIP(ip, "Brute force authentication attempts", 15 * 60 * 1000); // 15 minutes
    }
  }

  /**
   * Track suspicious input patterns
   */
  static trackMaliciousInput(
    ip: string,
    input: string,
    threats: string[],
    endpoint: string,
    userAgent?: string,
  ): void {
    const severity =
      threats.includes("SQL Injection") || threats.includes("XSS Attack")
        ? SEVERITY_LEVELS.CRITICAL
        : SEVERITY_LEVELS.HIGH;

    const eventType = threats.includes("SQL Injection")
      ? SECURITY_EVENT_TYPES.SQL_INJECTION_ATTEMPT
      : threats.includes("XSS Attack")
        ? SECURITY_EVENT_TYPES.XSS_ATTEMPT
        : SECURITY_EVENT_TYPES.MALICIOUS_INPUT;

    this.logEvent(
      eventType,
      severity,
      ip,
      {
        threats,
        inputLength: input.length,
        inputPreview: input.substring(0, 100),
      },
      {
        userAgent,
        endpoint,
      },
    );

    // Auto-block IPs with critical threats
    if (severity === SEVERITY_LEVELS.CRITICAL) {
      this.blockIP(
        ip,
        `Critical security threat: ${threats.join(", ")}`,
        60 * 60 * 1000,
      ); // 1 hour
    }
  }

  /**
   * Track API abuse
   */
  static trackAPIAbuse(
    ip: string,
    apiKey: string,
    endpoint: string,
    details: Record<string, any>,
  ): void {
    this.logEvent(
      SECURITY_EVENT_TYPES.API_ABUSE,
      SEVERITY_LEVELS.HIGH,
      ip,
      {
        apiKey: apiKey.substring(0, 8) + "...", // Don't log full API key
        ...details,
      },
      {
        endpoint,
      },
    );
  }

  /**
   * Track GDPR compliance events
   */
  static trackDataAccess(
    userId: string,
    dataType: string,
    purpose: string,
    ip: string,
    userAgent?: string,
  ): void {
    this.logEvent(
      SECURITY_EVENT_TYPES.DATA_ACCESS,
      SEVERITY_LEVELS.LOW,
      ip,
      {
        dataType,
        purpose,
        complianceNote: "GDPR data access logged",
      },
      {
        userId,
        userAgent,
      },
    );
  }

  /**
   * Get security metrics for dashboard
   */
  static getMetrics(timeWindowHours: number = 24): SecurityMetrics {
    const cutoffTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);
    const recentEvents = this.events.filter(
      (event) => event.timestamp >= cutoffTime,
    );

    // Count events by type
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};

    for (const event of recentEvents) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] =
        (eventsBySeverity[event.severity] || 0) + 1;
      ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
    }

    // Top attacker IPs
    const topAttackerIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate rates
    const totalRequests = recentEvents.length;
    const authFailures = eventsByType[SECURITY_EVENT_TYPES.AUTH_FAILURE] || 0;
    const apiAbuse = eventsByType[SECURITY_EVENT_TYPES.API_ABUSE] || 0;

    const authFailureRate =
      totalRequests > 0 ? authFailures / totalRequests : 0;
    const apiAbuseRate = totalRequests > 0 ? apiAbuse / totalRequests : 0;

    // Determine system health
    const criticalEvents = eventsBySeverity[SEVERITY_LEVELS.CRITICAL] || 0;
    const highEvents = eventsBySeverity[SEVERITY_LEVELS.HIGH] || 0;

    let systemHealth: "healthy" | "warning" | "critical" = "healthy";
    if (criticalEvents > 0) {
      systemHealth = "critical";
    } else if (highEvents > 5 || authFailureRate > 0.1) {
      systemHealth = "warning";
    }

    return {
      totalEvents: recentEvents.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: recentEvents.slice(-50), // Last 50 events
      topAttackerIPs,
      authFailureRate,
      apiAbuseRate,
      systemHealth,
    };
  }

  /**
   * Get events by criteria
   */
  static getEvents(
    criteria: {
      type?: SecurityEventType;
      severity?: SeverityLevel;
      ip?: string;
      userId?: string;
      resolved?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ): SecurityEvent[] {
    let filteredEvents = [...this.events];

    // Apply filters
    if (criteria.type) {
      filteredEvents = filteredEvents.filter(
        (event) => event.type === criteria.type,
      );
    }
    if (criteria.severity) {
      filteredEvents = filteredEvents.filter(
        (event) => event.severity === criteria.severity,
      );
    }
    if (criteria.ip) {
      filteredEvents = filteredEvents.filter(
        (event) => event.ip === criteria.ip,
      );
    }
    if (criteria.userId) {
      filteredEvents = filteredEvents.filter(
        (event) => event.userId === criteria.userId,
      );
    }
    if (criteria.resolved !== undefined) {
      filteredEvents = filteredEvents.filter(
        (event) => event.resolved === criteria.resolved,
      );
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );

    // Apply pagination
    const offset = criteria.offset || 0;
    const limit = criteria.limit || 100;

    return filteredEvents.slice(offset, offset + limit);
  }

  /**
   * Resolve security event
   */
  static resolveEvent(
    eventId: string,
    resolvedBy: string,
    notes?: string,
  ): boolean {
    const event = this.events.find((e) => e.id === eventId);
    if (!event) {
      return false;
    }

    event.resolved = true;
    event.resolvedAt = new Date();
    event.resolvedBy = resolvedBy;

    if (notes) {
      event.details.resolutionNotes = notes;
    }

    SafeLogger.info("Security event resolved", {
      eventId,
      resolvedBy,
      notes,
    });

    return true;
  }

  /**
   * Block IP address
   */
  static blockIP(ip: string, reason: string, durationMs: number): void {
    this.blockedIPs.add(ip);

    // Unblock after duration
    setTimeout(() => {
      this.blockedIPs.delete(ip);
      SafeLogger.info("IP unblocked", { ip, reason: "Timeout expired" });
    }, durationMs);

    this.logEvent(
      SECURITY_EVENT_TYPES.SECURITY_BREACH,
      SEVERITY_LEVELS.HIGH,
      ip,
      {
        action: "IP blocked",
        reason,
        duration: durationMs,
      },
    );
  }

  /**
   * Check if IP is blocked
   */
  static isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Get blocked IPs
   */
  static getBlockedIPs(): string[] {
    return Array.from(this.blockedIPs);
  }

  // Private helper methods

  private static trackSuspiciousIP(ip: string, severity: SeverityLevel): void {
    const current = this.suspiciousIPs.get(ip) || {
      count: 0,
      lastSeen: new Date(),
    };
    current.count +=
      severity === SEVERITY_LEVELS.CRITICAL
        ? 3
        : severity === SEVERITY_LEVELS.HIGH
          ? 2
          : 1;
    current.lastSeen = new Date();

    this.suspiciousIPs.set(ip, current);

    // Auto-block highly suspicious IPs
    if (current.count >= 10) {
      this.blockIP(ip, "Highly suspicious activity pattern", 30 * 60 * 1000); // 30 minutes
    }
  }

  private static getRecentAuthFailures(ip: string): SecurityEvent[] {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.events.filter(
      (event) =>
        event.type === SECURITY_EVENT_TYPES.AUTH_FAILURE &&
        event.ip === ip &&
        event.timestamp >= fiveMinutesAgo,
    );
  }

  private static checkAlertRules(event: SecurityEvent): void {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;

      if (rule.eventType !== "any" && rule.eventType !== event.type) continue;

      // Check if we've reached the threshold within the time window
      const windowStart = new Date(Date.now() - rule.timeWindowMs);
      const matchingEvents = this.events.filter(
        (e) =>
          e.timestamp >= windowStart &&
          (rule.eventType === "any" || e.type === event.type) &&
          e.severity === rule.severity,
      );

      if (matchingEvents.length >= rule.threshold) {
        this.triggerAlert(rule, matchingEvents);
      }
    }
  }

  private static triggerAlert(rule: AlertRule, events: SecurityEvent[]): void {
    SafeLogger.warn("Security alert triggered", {
      ruleName: rule.name,
      eventCount: events.length,
      threshold: rule.threshold,
      timeWindow: rule.timeWindowMs,
    });

    for (const action of rule.actions) {
      this.executeAlertAction(action, rule, events);
    }
  }

  private static executeAlertAction(
    action: AlertAction,
    rule: AlertRule,
    events: SecurityEvent[],
  ): void {
    try {
      switch (action.type) {
        case "log":
          SafeLogger.error("Security Alert", {
            rule: rule.name,
            events: events.length,
            recentEvents: events.slice(-3),
          });
          break;

        case "block_ip":
          if (events.length > 0) {
            const ipsToBlock = [...new Set(events.map((e) => e.ip))];
            for (const ip of ipsToBlock) {
              this.blockIP(
                ip,
                `Alert rule triggered: ${rule.name}`,
                60 * 60 * 1000,
              ); // 1 hour
            }
          }
          break;

        case "webhook":
          // In a real implementation, send HTTP request to webhook URL
          SafeLogger.info("Webhook alert would be sent", {
            url: action.config.url,
            rule: rule.name,
            events: events.length,
          });
          break;

        case "email":
          // In a real implementation, send email alert
          SafeLogger.info("Email alert would be sent", {
            to: action.config.recipients,
            rule: rule.name,
            events: events.length,
          });
          break;
      }
    } catch (error) {
      SafeLogger.error("Failed to execute alert action", error, {
        actionType: action.type,
        ruleName: rule.name,
      });
    }
  }

  private static setupDefaultAlertRules(): void {
    this.alertRules = [
      {
        id: "brute_force",
        name: "Brute Force Attack",
        eventType: SECURITY_EVENT_TYPES.AUTH_FAILURE,
        severity: SEVERITY_LEVELS.MEDIUM,
        threshold: 5,
        timeWindowMs: 5 * 60 * 1000, // 5 minutes
        enabled: true,
        actions: [
          { type: "log", config: {} },
          { type: "block_ip", config: {} },
        ],
      },
      {
        id: "sql_injection",
        name: "SQL Injection Attempts",
        eventType: SECURITY_EVENT_TYPES.SQL_INJECTION_ATTEMPT,
        severity: SEVERITY_LEVELS.CRITICAL,
        threshold: 1,
        timeWindowMs: 60 * 1000, // 1 minute
        enabled: true,
        actions: [
          { type: "log", config: {} },
          { type: "block_ip", config: {} },
        ],
      },
      {
        id: "ddos_protection",
        name: "DDoS Attack",
        eventType: SECURITY_EVENT_TYPES.DDOS_DETECTED,
        severity: SEVERITY_LEVELS.CRITICAL,
        threshold: 1,
        timeWindowMs: 60 * 1000, // 1 minute
        enabled: true,
        actions: [
          { type: "log", config: {} },
          { type: "block_ip", config: {} },
        ],
      },
    ];
  }

  private static startCleanupTimer(): void {
    // Clean up old events and suspicious IPs every hour
    setInterval(
      () => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oldEventCount = this.events.length;
        this.events = this.events.filter(
          (event) => event.timestamp >= oneWeekAgo,
        );

        // Clean up old suspicious IPs
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        for (const [ip, data] of this.suspiciousIPs.entries()) {
          if (data.lastSeen < oneDayAgo) {
            this.suspiciousIPs.delete(ip);
          }
        }

        if (oldEventCount !== this.events.length) {
          SafeLogger.info("Security monitoring cleanup completed", {
            removedEvents: oldEventCount - this.events.length,
            remainingEvents: this.events.length,
          });
        }
      },
      60 * 60 * 1000,
    ); // 1 hour
  }

  private static generateEventId(): string {
    return `sec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
  }
}

/**
 * React hook for security monitoring dashboard
 */
export function useSecurityMonitoring() {
  const getMetrics = (timeWindowHours: number = 24) => {
    return SecurityMonitor.getMetrics(timeWindowHours);
  };

  const getEvents = (
    criteria: Parameters<typeof SecurityMonitor.getEvents>[0] = {},
  ) => {
    return SecurityMonitor.getEvents(criteria);
  };

  const resolveEvent = (eventId: string, notes?: string) => {
    return SecurityMonitor.resolveEvent(eventId, "dashboard_user", notes);
  };

  return {
    getMetrics,
    getEvents,
    resolveEvent,
    isIPBlocked: SecurityMonitor.isIPBlocked,
    getBlockedIPs: SecurityMonitor.getBlockedIPs,
  };
}

/**
 * Middleware to integrate security monitoring
 */
export function createSecurityMonitoringMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();

    // Track request
    const ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.ip ||
      "unknown";
    const userAgent = req.headers["user-agent"];

    // Check if IP is blocked
    if (SecurityMonitor.isIPBlocked(ip)) {
      SafeLogger.warn("Blocked IP attempted access", { ip, url: req.url });
      return res.status(403).json({
        error: "Access Denied",
        message: "Your IP address has been blocked due to suspicious activity",
      });
    }

    // Monitor response
    const originalSend = res.send;
    res.send = function (data: any) {
      const processingTime = Date.now() - startTime;

      // Log suspicious response patterns
      if (res.statusCode >= 400) {
        SecurityMonitor.logEvent(
          SECURITY_EVENT_TYPES.SUSPICIOUS_ACTIVITY,
          res.statusCode >= 500 ? SEVERITY_LEVELS.HIGH : SEVERITY_LEVELS.LOW,
          ip,
          {
            statusCode: res.statusCode,
            endpoint: req.path || req.url,
            method: req.method,
            processingTime,
          },
          {
            userAgent,
            endpoint: req.path || req.url,
          },
        );
      }

      return originalSend.call(this, data);
    };

    if (next) next();
  };
}

// Initialize monitoring when module is loaded
SecurityMonitor.initialize();
