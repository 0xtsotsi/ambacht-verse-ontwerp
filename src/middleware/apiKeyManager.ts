/**
 * API Key Management System for Wesley's Ambacht
 * 
 * Features:
 * - Secure API key generation and validation
 * - Role-based access control (RBAC)
 * - Rate limiting per API key
 * - Key rotation and expiration
 * - Audit logging for API key usage
 * - Scoped permissions for different endpoints
 */

import { SafeLogger } from "@/lib/LoggerUtils";

// API Key scopes and permissions
export const API_SCOPES = {
  // Public read-only access
  'read:availability': {
    name: 'Check Availability',
    description: 'Read availability information',
    endpoints: ['/api/availability', '/api/check-date'],
    rateLimit: { requests: 500, windowMs: 60000 }, // 500 per minute
  },
  
  'read:services': {
    name: 'Read Services',
    description: 'Access service information and pricing',
    endpoints: ['/api/services', '/api/pricing'],
    rateLimit: { requests: 200, windowMs: 60000 }, // 200 per minute
  },
  
  // Quote calculations
  'create:quote': {
    name: 'Create Quotes',
    description: 'Generate price quotes',
    endpoints: ['/api/quote', '/api/calculate'],
    rateLimit: { requests: 100, windowMs: 60000 }, // 100 per minute
  },
  
  // Booking operations (more restricted)
  'create:booking': {
    name: 'Create Bookings',
    description: 'Submit booking requests',
    endpoints: ['/api/booking', '/api/reserve'],
    rateLimit: { requests: 20, windowMs: 60000 }, // 20 per minute
  },
  
  // Administrative access (highly restricted)
  'admin:bookings': {
    name: 'Booking Management',
    description: 'Manage booking data',
    endpoints: ['/api/admin/bookings'],
    rateLimit: { requests: 50, windowMs: 60000 }, // 50 per minute
  },
  
  'admin:analytics': {
    name: 'Analytics Access',
    description: 'Access analytics and reports',
    endpoints: ['/api/admin/analytics', '/api/admin/reports'],
    rateLimit: { requests: 100, windowMs: 60000 }, // 100 per minute
  },
} as const;

// API Key types
export const API_KEY_TYPES = {
  PUBLIC: 'public', // For website frontend
  PARTNER: 'partner', // For partner integrations
  INTERNAL: 'internal', // For internal services
  ADMIN: 'admin', // For administrative access
} as const;

type APIKeyType = typeof API_KEY_TYPES[keyof typeof API_KEY_TYPES];
type APIScope = keyof typeof API_SCOPES;

interface APIKey {
  id: string;
  key: string;
  name: string;
  type: APIKeyType;
  scopes: APIScope[];
  owner: string;
  created: Date;
  expires?: Date;
  lastUsed?: Date;
  usageCount: number;
  isActive: boolean;
  metadata: {
    description?: string;
    environment: 'development' | 'staging' | 'production';
    ipWhitelist?: string[];
    userAgent?: string;
  };
}

interface APIKeyUsage {
  keyId: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  ip: string;
  userAgent?: string;
  responseStatus: number;
  processingTime: number;
}

/**
 * API Key Management Class
 */
export class APIKeyManager {
  private static keys = new Map<string, APIKey>();
  private static usage = new Map<string, APIKeyUsage[]>();
  private static keyIndex = new Map<string, string>(); // key hash -> key id mapping

  /**
   * Generate a new API key
   */
  static generateAPIKey(
    name: string,
    type: APIKeyType,
    scopes: APIScope[],
    owner: string,
    options: {
      description?: string;
      environment?: 'development' | 'staging' | 'production';
      expiresInDays?: number;
      ipWhitelist?: string[];
    } = {}
  ): APIKey {
    const id = this.generateId();
    const key = this.generateSecureKey(type);
    const keyHash = this.hashKey(key);
    
    const expires = options.expiresInDays 
      ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const apiKey: APIKey = {
      id,
      key: keyHash, // Store hashed version
      name,
      type,
      scopes,
      owner,
      created: new Date(),
      expires,
      usageCount: 0,
      isActive: true,
      metadata: {
        description: options.description,
        environment: options.environment || 'production',
        ipWhitelist: options.ipWhitelist,
      },
    };

    this.keys.set(id, apiKey);
    this.keyIndex.set(keyHash, id);
    this.usage.set(id, []);

    SafeLogger.info("API key generated", {
      keyId: id,
      name,
      type,
      scopes,
      owner,
      environment: options.environment,
    });

    // Return the actual key only once during generation
    return {
      ...apiKey,
      key, // Return unhashed key for user to store securely
    };
  }

  /**
   * Validate API key and check permissions
   */
  static async validateAPIKey(
    providedKey: string,
    endpoint: string,
    method: string,
    request: Request
  ): Promise<{
    isValid: boolean;
    key?: APIKey;
    error?: string;
    rateLimitExceeded?: boolean;
  }> {
    try {
      const keyHash = this.hashKey(providedKey);
      const keyId = this.keyIndex.get(keyHash);
      
      if (!keyId) {
        SafeLogger.warn("Invalid API key attempted", {
          endpoint,
          method,
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        });
        return { isValid: false, error: 'Invalid API key' };
      }

      const apiKey = this.keys.get(keyId);
      if (!apiKey) {
        return { isValid: false, error: 'API key not found' };
      }

      // Check if key is active
      if (!apiKey.isActive) {
        SafeLogger.warn("Inactive API key used", { keyId, endpoint });
        return { isValid: false, error: 'API key is inactive' };
      }

      // Check expiration
      if (apiKey.expires && new Date() > apiKey.expires) {
        SafeLogger.warn("Expired API key used", { keyId, endpoint });
        return { isValid: false, error: 'API key has expired' };
      }

      // Check IP whitelist
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      if (apiKey.metadata.ipWhitelist && apiKey.metadata.ipWhitelist.length > 0) {
        if (!apiKey.metadata.ipWhitelist.includes(clientIP)) {
          SafeLogger.warn("API key used from unauthorized IP", {
            keyId,
            authorizedIPs: apiKey.metadata.ipWhitelist,
            actualIP: clientIP,
          });
          return { isValid: false, error: 'Unauthorized IP address' };
        }
      }

      // Check endpoint permissions
      const hasPermission = this.checkEndpointPermission(apiKey, endpoint);
      if (!hasPermission) {
        SafeLogger.warn("API key lacks permission for endpoint", {
          keyId,
          endpoint,
          scopes: apiKey.scopes,
        });
        return { isValid: false, error: 'Insufficient permissions for this endpoint' };
      }

      // Check rate limits
      const rateLimitResult = await this.checkRateLimit(apiKey, endpoint);
      if (!rateLimitResult.allowed) {
        SafeLogger.warn("API key rate limit exceeded", {
          keyId,
          endpoint,
          usage: rateLimitResult.currentUsage,
          limit: rateLimitResult.limit,
        });
        return { 
          isValid: false, 
          error: 'Rate limit exceeded',
          rateLimitExceeded: true,
        };
      }

      // Record usage
      this.recordUsage(keyId, endpoint, method, request, 200, 0);

      // Update last used timestamp
      apiKey.lastUsed = new Date();
      apiKey.usageCount++;

      return { isValid: true, key: apiKey };

    } catch (error) {
      SafeLogger.error("API key validation error", error);
      return { isValid: false, error: 'Validation system error' };
    }
  }

  /**
   * Check if API key has permission for endpoint
   */
  private static checkEndpointPermission(apiKey: APIKey, endpoint: string): boolean {
    for (const scope of apiKey.scopes) {
      const scopeConfig = API_SCOPES[scope];
      if (scopeConfig.endpoints.some(pattern => 
        endpoint.startsWith(pattern) || new RegExp(pattern.replace('*', '.*')).test(endpoint)
      )) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check rate limits for API key
   */
  private static async checkRateLimit(
    apiKey: APIKey,
    endpoint: string
  ): Promise<{
    allowed: boolean;
    currentUsage: number;
    limit: number;
    resetTime: Date;
  }> {
    const usage = this.usage.get(apiKey.id) || [];
    
    // Find the most restrictive rate limit for this endpoint
    let mostRestrictiveLimit = { requests: Infinity, windowMs: 60000 };
    
    for (const scope of apiKey.scopes) {
      const scopeConfig = API_SCOPES[scope];
      if (scopeConfig.endpoints.some(pattern => endpoint.startsWith(pattern))) {
        if (scopeConfig.rateLimit.requests < mostRestrictiveLimit.requests) {
          mostRestrictiveLimit = scopeConfig.rateLimit;
        }
      }
    }

    if (mostRestrictiveLimit.requests === Infinity) {
      return {
        allowed: true,
        currentUsage: 0,
        limit: mostRestrictiveLimit.requests,
        resetTime: new Date(Date.now() + mostRestrictiveLimit.windowMs),
      };
    }

    // Count recent requests within the window
    const now = Date.now();
    const windowStart = now - mostRestrictiveLimit.windowMs;
    const recentUsage = usage.filter(u => 
      u.timestamp.getTime() > windowStart && 
      u.endpoint.startsWith(endpoint.split('?')[0]) // Ignore query parameters
    );

    const allowed = recentUsage.length < mostRestrictiveLimit.requests;
    const resetTime = new Date(now + mostRestrictiveLimit.windowMs);

    return {
      allowed,
      currentUsage: recentUsage.length,
      limit: mostRestrictiveLimit.requests,
      resetTime,
    };
  }

  /**
   * Record API key usage
   */
  private static recordUsage(
    keyId: string,
    endpoint: string,
    method: string,
    request: Request,
    responseStatus: number,
    processingTime: number
  ): void {
    const usage = this.usage.get(keyId) || [];
    
    const newUsage: APIKeyUsage = {
      keyId,
      endpoint,
      method,
      timestamp: new Date(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent'),
      responseStatus,
      processingTime,
    };

    usage.push(newUsage);

    // Keep only last 1000 usage records per key
    if (usage.length > 1000) {
      usage.splice(0, usage.length - 1000);
    }

    this.usage.set(keyId, usage);
  }

  /**
   * Deactivate API key
   */
  static deactivateKey(keyId: string, reason: string): boolean {
    const apiKey = this.keys.get(keyId);
    if (!apiKey) {
      return false;
    }

    apiKey.isActive = false;
    
    SafeLogger.info("API key deactivated", {
      keyId,
      name: apiKey.name,
      reason,
      owner: apiKey.owner,
    });

    return true;
  }

  /**
   * Rotate API key (generate new key, deactivate old)
   */
  static rotateKey(keyId: string): APIKey | null {
    const existingKey = this.keys.get(keyId);
    if (!existingKey) {
      return null;
    }

    // Deactivate old key
    this.deactivateKey(keyId, 'Key rotation');

    // Generate new key with same configuration
    const newKey = this.generateAPIKey(
      existingKey.name,
      existingKey.type,
      existingKey.scopes,
      existingKey.owner,
      {
        description: existingKey.metadata.description,
        environment: existingKey.metadata.environment,
        ipWhitelist: existingKey.metadata.ipWhitelist,
      }
    );

    SafeLogger.info("API key rotated", {
      oldKeyId: keyId,
      newKeyId: newKey.id,
      owner: existingKey.owner,
    });

    return newKey;
  }

  /**
   * Get usage statistics for API key
   */
  static getUsageStats(keyId: string, days: number = 7): {
    totalRequests: number;
    requestsByDay: Array<{ date: string; count: number }>;
    endpointStats: Array<{ endpoint: string; count: number }>;
    errorRate: number;
  } {
    const usage = this.usage.get(keyId) || [];
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const recentUsage = usage.filter(u => u.timestamp >= cutoffDate);

    // Group by day
    const requestsByDay = new Map<string, number>();
    const endpointCounts = new Map<string, number>();
    let errorCount = 0;

    for (const record of recentUsage) {
      const day = record.timestamp.toISOString().split('T')[0];
      requestsByDay.set(day, (requestsByDay.get(day) || 0) + 1);
      
      endpointCounts.set(record.endpoint, (endpointCounts.get(record.endpoint) || 0) + 1);
      
      if (record.responseStatus >= 400) {
        errorCount++;
      }
    }

    return {
      totalRequests: recentUsage.length,
      requestsByDay: Array.from(requestsByDay.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      endpointStats: Array.from(endpointCounts.entries())
        .map(([endpoint, count]) => ({ endpoint, count }))
        .sort((a, b) => b.count - a.count),
      errorRate: recentUsage.length > 0 ? errorCount / recentUsage.length : 0,
    };
  }

  /**
   * List all API keys (admin function)
   */
  static listKeys(): Array<Omit<APIKey, 'key'>> {
    return Array.from(this.keys.values()).map(key => ({
      ...key,
      key: `${key.key.substring(0, 8)}...`, // Show only first 8 chars
    }));
  }

  // Utility functions
  private static generateId(): string {
    return `ak_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
  }

  private static generateSecureKey(type: APIKeyType): string {
    const prefix = type === 'admin' ? 'adm' : type === 'internal' ? 'int' : type === 'partner' ? 'ptn' : 'pub';
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(32)), 
      byte => byte.toString(16).padStart(2, '0')).join('');
    return `${prefix}_${randomPart}`;
  }

  private static hashKey(key: string): string {
    // Simple hash for demo - in production use crypto.subtle.digest
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

/**
 * Express/Connect middleware for API key authentication
 */
export function createAPIKeyMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      // Get API key from header or query parameter
      const apiKey = req.headers['x-api-key'] || 
                    req.headers['authorization']?.replace('Bearer ', '') ||
                    req.query.api_key;

      if (!apiKey) {
        return res.status(401).json({
          error: 'Missing API key',
          message: 'API key is required for this endpoint',
        });
      }

      // Convert to standard Request
      const request = req instanceof Request ? req : new Request(req.url, {
        method: req.method,
        headers: req.headers,
      });

      const validation = await APIKeyManager.validateAPIKey(
        apiKey,
        req.path || req.url,
        req.method,
        request
      );

      if (!validation.isValid) {
        const status = validation.rateLimitExceeded ? 429 : 401;
        return res.status(status).json({
          error: validation.error,
          message: validation.rateLimitExceeded 
            ? 'API rate limit exceeded. Please try again later.'
            : 'Invalid or unauthorized API key',
        });
      }

      // Attach API key info to request
      req.apiKey = validation.key;
      req.apiKeyId = validation.key!.id;

      if (next) next();
    } catch (error) {
      SafeLogger.error("API key middleware error", error);
      if (next) next();
    }
  };
}

/**
 * React hook for API key management (admin interface)
 */
export function useAPIKeyManagement() {
  const generateKey = (
    name: string,
    type: APIKeyType,
    scopes: APIScope[],
    options: any = {}
  ) => {
    return APIKeyManager.generateAPIKey(name, type, scopes, 'user', options);
  };

  const getUsageStats = (keyId: string, days: number = 7) => {
    return APIKeyManager.getUsageStats(keyId, days);
  };

  return {
    generateKey,
    getUsageStats,
    listKeys: APIKeyManager.listKeys,
    deactivateKey: APIKeyManager.deactivateKey,
    rotateKey: APIKeyManager.rotateKey,
  };
}