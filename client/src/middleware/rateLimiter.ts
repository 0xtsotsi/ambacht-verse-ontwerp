/**
 * Rate Limiting Middleware for Wesley's Ambacht API Security
 *
 * Implements tiered rate limiting based on endpoint types:
 * - General API: 100 req/min
 * - Availability checks: 500 req/min
 * - Booking endpoints: 50 req/min
 *
 * Features:
 * - IP-based tracking with Redis-like in-memory store
 * - Sliding window rate limiting
 * - Different limits per endpoint category
 * - DDoS protection with automatic blocking
 * - Security monitoring integration
 */

import { SafeLogger } from "@/lib/LoggerUtils";

// Rate limit tiers
export const RATE_LIMIT_TIERS = {
  general: {
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: "Te veel verzoeken. Probeer het over een minuut opnieuw.",
    skipSuccessfulRequests: false,
  },
  availability: {
    windowMs: 60 * 1000, // 1 minute
    max: 500,
    message:
      "Te veel beschikbaarheidscontroles. Probeer het over een minuut opnieuw.",
    skipSuccessfulRequests: true,
  },
  booking: {
    windowMs: 60 * 1000, // 1 minute
    max: 50,
    message: "Te veel boekingsverzoeken. Probeer het over een minuut opnieuw.",
    skipSuccessfulRequests: false,
  },
  quote: {
    windowMs: 60 * 1000, // 1 minute
    max: 200,
    message: "Te veel offerteaanvragen. Probeer het over een minuut opnieuw.",
    skipSuccessfulRequests: true,
  },
} as const;

// DDoS protection thresholds
const DDOS_PROTECTION = {
  suspiciousThreshold: 1000, // requests per 5 minutes
  blockThreshold: 2000, // requests per 5 minutes
  blockDurationMs: 15 * 60 * 1000, // 15 minutes
  windowMs: 5 * 60 * 1000, // 5 minutes
};

// In-memory store for rate limiting (Redis alternative for simple deployments)
interface RateLimitEntry {
  requests: Array<{ timestamp: number; endpoint: string; userAgent?: string }>;
  blocked?: {
    until: number;
    reason: string;
  };
}

class RateLimitStore {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000,
    );
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = Math.max(
      ...Object.values(RATE_LIMIT_TIERS).map((tier) => tier.windowMs),
    );

    for (const [key, entry] of this.store.entries()) {
      // Remove old requests
      entry.requests = entry.requests.filter(
        (req) => now - req.timestamp <= maxAge,
      );

      // Remove expired blocks
      if (entry.blocked && now > entry.blocked.until) {
        delete entry.blocked;
      }

      // Remove empty entries
      if (entry.requests.length === 0 && !entry.blocked) {
        this.store.delete(key);
      }
    }
  }

  getEntry(key: string): RateLimitEntry {
    if (!this.store.has(key)) {
      this.store.set(key, { requests: [] });
    }
    return this.store.get(key)!;
  }

  addRequest(key: string, endpoint: string, userAgent?: string): void {
    const entry = this.getEntry(key);
    entry.requests.push({
      timestamp: Date.now(),
      endpoint,
      userAgent,
    });
  }

  blockIP(
    key: string,
    reason: string,
    durationMs: number = DDOS_PROTECTION.blockDurationMs,
  ): void {
    const entry = this.getEntry(key);
    entry.blocked = {
      until: Date.now() + durationMs,
      reason,
    };

    SafeLogger.warn("IP blocked for security", {
      ip: key,
      reason,
      duration: durationMs,
      blockedUntil: new Date(entry.blocked.until).toISOString(),
    });
  }

  isBlocked(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry?.blocked) return false;

    if (Date.now() > entry.blocked.until) {
      delete entry.blocked;
      return false;
    }

    return true;
  }

  getBlockInfo(key: string): { reason: string; until: Date } | null {
    const entry = this.store.get(key);
    if (!entry?.blocked) return null;

    return {
      reason: entry.blocked.reason,
      until: new Date(entry.blocked.until),
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Global rate limit store
const rateLimitStore = new RateLimitStore();

// Security event types
export const SECURITY_EVENTS = {
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
  DDOS_DETECTED: "ddos_detected",
  IP_BLOCKED: "ip_blocked",
} as const;

// Get client IP from request
function getClientIP(req: Request): string {
  // Check various headers for the real IP
  const headers = req.headers;

  return (
    headers.get("cf-connecting-ip") || // Cloudflare
    headers.get("x-real-ip") || // Nginx proxy
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Standard proxy header
    headers.get("x-client-ip") || // Alternative header
    "unknown"
  );
}

// Get endpoint category from URL
function getEndpointCategory(url: string): keyof typeof RATE_LIMIT_TIERS {
  const path = new URL(url).pathname.toLowerCase();

  if (path.includes("/availability") || path.includes("/check-date")) {
    return "availability";
  }
  if (path.includes("/booking") || path.includes("/reserve")) {
    return "booking";
  }
  if (path.includes("/quote") || path.includes("/calculate")) {
    return "quote";
  }

  return "general";
}

// Rate limiting middleware
export class RateLimiter {
  static async checkRateLimit(
    request: Request,
    endpoint?: string,
  ): Promise<{
    allowed: boolean;
    remaining?: number;
    resetTime?: Date;
    message?: string;
  }> {
    const clientIP = getClientIP(request);
    const category = getEndpointCategory(request.url);
    const tier = RATE_LIMIT_TIERS[category];
    const now = Date.now();

    // Check if IP is blocked
    if (rateLimitStore.isBlocked(clientIP)) {
      const blockInfo = rateLimitStore.getBlockInfo(clientIP);
      SafeLogger.warn("Blocked IP attempted request", {
        ip: clientIP,
        url: request.url,
        blockReason: blockInfo?.reason,
        blockedUntil: blockInfo?.until,
      });

      return {
        allowed: false,
        message: `IP geblokkeerd vanwege ${blockInfo?.reason}. Probeer opnieuw na ${blockInfo?.until?.toLocaleTimeString("nl-NL")}`,
      };
    }

    const entry = rateLimitStore.getEntry(clientIP);

    // Filter requests within the current window
    const windowStart = now - tier.windowMs;
    const recentRequests = entry.requests.filter(
      (req) => req.timestamp > windowStart,
    );

    // Check for DDoS patterns
    await this.checkDDoSProtection(clientIP, entry, request);

    // Check rate limit
    if (recentRequests.length >= tier.max) {
      SafeLogger.warn("Rate limit exceeded", {
        ip: clientIP,
        category,
        requests: recentRequests.length,
        limit: tier.max,
        windowMs: tier.windowMs,
        url: request.url,
      });

      // Track security event
      this.trackSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
        ip: clientIP,
        category,
        requestCount: recentRequests.length,
        limit: tier.max,
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(now + tier.windowMs),
        message: tier.message,
      };
    }

    // Add current request
    rateLimitStore.addRequest(
      clientIP,
      endpoint || request.url,
      request.headers.get("user-agent") || undefined,
    );

    const remaining = tier.max - recentRequests.length - 1;
    const resetTime = new Date(
      Math.max(...recentRequests.map((r) => r.timestamp)) + tier.windowMs,
    );

    return {
      allowed: true,
      remaining,
      resetTime,
    };
  }

  private static async checkDDoSProtection(
    clientIP: string,
    entry: RateLimitEntry,
    request: Request,
  ): Promise<void> {
    const now = Date.now();
    const ddosWindow = now - DDOS_PROTECTION.windowMs;
    const recentRequests = entry.requests.filter(
      (req) => req.timestamp > ddosWindow,
    );

    // Check for suspicious activity
    if (recentRequests.length >= DDOS_PROTECTION.suspiciousThreshold) {
      SafeLogger.warn("Suspicious activity detected", {
        ip: clientIP,
        requests: recentRequests.length,
        threshold: DDOS_PROTECTION.suspiciousThreshold,
        timeWindow: DDOS_PROTECTION.windowMs,
        userAgent: request.headers.get("user-agent"),
        url: request.url,
      });

      this.trackSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
        ip: clientIP,
        requestCount: recentRequests.length,
        threshold: DDOS_PROTECTION.suspiciousThreshold,
      });
    }

    // Block for DDoS
    if (recentRequests.length >= DDOS_PROTECTION.blockThreshold) {
      rateLimitStore.blockIP(
        clientIP,
        "DDoS aanval gedetecteerd",
        DDOS_PROTECTION.blockDurationMs,
      );

      SafeLogger.error("DDoS attack detected - IP blocked", {
        ip: clientIP,
        requests: recentRequests.length,
        threshold: DDOS_PROTECTION.blockThreshold,
        blockDuration: DDOS_PROTECTION.blockDurationMs,
        userAgent: request.headers.get("user-agent"),
      });

      this.trackSecurityEvent(SECURITY_EVENTS.DDOS_DETECTED, {
        ip: clientIP,
        requestCount: recentRequests.length,
        blocked: true,
      });
    }
  }

  private static trackSecurityEvent(
    eventType: string,
    details: Record<string, any>,
  ): void {
    SafeLogger.security("Security event tracked", {
      event: eventType,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }

  // Manual IP blocking for security incidents
  static blockIP(
    ip: string,
    reason: string,
    durationMs: number = DDOS_PROTECTION.blockDurationMs,
  ): void {
    rateLimitStore.blockIP(ip, reason, durationMs);
    this.trackSecurityEvent(SECURITY_EVENTS.IP_BLOCKED, {
      ip,
      reason,
      duration: durationMs,
      manual: true,
    });
  }

  // Get rate limit stats for monitoring
  static getStats(): {
    totalTrackedIPs: number;
    blockedIPs: number;
    recentRequests: number;
  } {
    const now = Date.now();
    const windowMs = 60 * 1000; // Last minute
    let totalTrackedIPs = 0;
    let blockedIPs = 0;
    let recentRequests = 0;

    for (const [, entry] of (rateLimitStore as any).store.entries()) {
      totalTrackedIPs++;

      if (entry.blocked && now < entry.blocked.until) {
        blockedIPs++;
      }

      recentRequests += entry.requests.filter(
        (req: any) => now - req.timestamp <= windowMs,
      ).length;
    }

    return {
      totalTrackedIPs,
      blockedIPs,
      recentRequests,
    };
  }

  // Clear rate limiting data (for testing)
  static clearAll(): void {
    (rateLimitStore as any).store.clear();
  }
}

// Express/Connect style middleware wrapper
export function createRateLimitMiddleware(
  category?: keyof typeof RATE_LIMIT_TIERS,
) {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const result = await RateLimiter.checkRateLimit(req);

      // Set rate limit headers
      if (res.setHeader) {
        res.setHeader(
          "X-RateLimit-Limit",
          RATE_LIMIT_TIERS[category || "general"].max,
        );
        if (result.remaining !== undefined) {
          res.setHeader("X-RateLimit-Remaining", result.remaining);
        }
        if (result.resetTime) {
          res.setHeader(
            "X-RateLimit-Reset",
            Math.ceil(result.resetTime.getTime() / 1000),
          );
        }
      }

      if (!result.allowed) {
        return res.status
          ? res.status(429).json({
              error: "Rate limit exceeded",
              message: result.message,
              retryAfter: result.resetTime,
            })
          : new Response(
              JSON.stringify({
                error: "Rate limit exceeded",
                message: result.message,
                retryAfter: result.resetTime,
              }),
              {
                status: 429,
                headers: {
                  "Content-Type": "application/json",
                  "Retry-After": result.resetTime
                    ? Math.ceil(
                        (result.resetTime.getTime() - Date.now()) / 1000,
                      ).toString()
                    : "60",
                },
              },
            );
      }

      if (next) next();
    } catch (error) {
      SafeLogger.error("Rate limiting error", error);
      if (next) next();
    }
  };
}

// React hook for client-side rate limit awareness
export function useRateLimitStatus() {
  return {
    checkRateLimit: async (endpoint: string): Promise<boolean> => {
      try {
        const response = await fetch(endpoint, { method: "HEAD" });
        const remaining = response.headers.get("X-RateLimit-Remaining");
        return remaining ? parseInt(remaining) > 0 : true;
      } catch {
        return true; // Default to allowing if check fails
      }
    },

    getRemainingRequests: async (endpoint: string): Promise<number | null> => {
      try {
        const response = await fetch(endpoint, { method: "HEAD" });
        const remaining = response.headers.get("X-RateLimit-Remaining");
        return remaining ? parseInt(remaining) : null;
      } catch {
        return null;
      }
    },
  };
}
