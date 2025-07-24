/**
 * JWT Authentication Middleware for Wesley's Ambacht API
 *
 * Provides comprehensive JWT-based authentication with Supabase integration:
 * - Bearer token validation with JWT parsing
 * - Refresh token mechanism and automatic renewal
 * - Session management with concurrent login limits
 * - User-based rate limiting alongside IP-based controls
 * - Authentication audit logging and security events
 * - Integration with existing security monitoring system
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import { SecurityMonitor, SECURITY_EVENT_TYPES, SEVERITY_LEVELS } from "./securityMonitor";
import { supabase } from "@/integrations/supabase/client";

// JWT Configuration
const JWT_CONFIG = {
  // Token validation settings
  issuerValidation: true,
  audienceValidation: true,
  clockTolerance: 60, // 60 seconds clock skew tolerance
  
  // Session settings
  maxConcurrentSessions: 5, // Max concurrent sessions per user
  sessionTimeoutMs: 24 * 60 * 60 * 1000, // 24 hours
  
  // Refresh token settings
  refreshThresholdMs: 5 * 60 * 1000, // Refresh when 5 minutes left
  refreshGracePeriodMs: 2 * 60 * 1000, // 2 minute grace period
  
  // Rate limiting for authenticated users
  userRateLimits: {
    default: { requests: 1000, windowMs: 60 * 60 * 1000 }, // 1000 per hour
    premium: { requests: 5000, windowMs: 60 * 60 * 1000 }, // 5000 per hour
    admin: { requests: 10000, windowMs: 60 * 60 * 1000 }, // 10000 per hour
  },
} as const;

// Authentication context
interface AuthContext {
  user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
    tier: 'default' | 'premium' | 'admin';
  };
  session: {
    id: string;
    createdAt: Date;
    lastActivity: Date;
    userAgent?: string;
    ip: string;
  };
  token: {
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
    needsRefresh: boolean;
  };
}

// Session tracking
interface UserSession {
  sessionId: string;
  userId: string;
  ip: string;
  userAgent?: string;
  createdAt: Date;
  lastActivity: Date;
  tokenHash: string;
}

// User rate limiting
interface UserRateLimit {
  userId: string;
  requests: Array<{ timestamp: number; endpoint: string }>;
  tier: 'default' | 'premium' | 'admin';
}

/**
 * JWT Authentication Manager
 */
export class JWTAuthenticationManager {
  private static activeSessions = new Map<string, UserSession>(); // sessionId -> session
  private static userSessions = new Map<string, Set<string>>(); // userId -> Set<sessionId>
  private static userRateLimits = new Map<string, UserRateLimit>(); // userId -> rate limit data
  private static refreshTokens = new Map<string, string>(); // userId -> refreshToken

  /**
   * Validate JWT token and extract user information
   */
  static async validateJWT(
    token: string,
    request: Request
  ): Promise<{
    isValid: boolean;
    authContext?: AuthContext;
    error?: string;
    needsRefresh?: boolean;
  }> {
    try {
      SafeLogger.debug("Validating JWT token", {
        tokenLength: token.length,
        url: request.url,
      });

      // Use Supabase to validate the JWT token
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        SafeLogger.warn("JWT validation failed", {
          error: userError?.message,
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        });
        
        return {
          isValid: false,
          error: userError?.message || 'Invalid token',
        };
      }

      // Parse JWT to get expiration (without verification - Supabase already validated)
      const tokenPayload = this.parseJWTPayload(token);
      if (!tokenPayload) {
        return {
          isValid: false,
          error: 'Malformed token',
        };
      }

      const expiresAt = new Date(tokenPayload.exp * 1000);
      const now = new Date();
      const timeToExpiry = expiresAt.getTime() - now.getTime();

      // Check if token needs refresh
      const needsRefresh = timeToExpiry < JWT_CONFIG.refreshThresholdMs;

      // Get user metadata and role
      const userRole = user.app_metadata?.role || 'user';
      const userTier = this.getUserTier(userRole);
      const permissions = this.getUserPermissions(userRole);

      // Create or update session
      const sessionResult = await this.manageUserSession(user.id, request, token);
      if (!sessionResult.success) {
        return {
          isValid: false,
          error: sessionResult.error,
        };
      }

      // Check user-based rate limiting
      const rateLimitResult = await this.checkUserRateLimit(user.id, request.url, userTier);
      if (!rateLimitResult.allowed) {
        SecurityMonitor.logEvent(
          SECURITY_EVENT_TYPES.RATE_LIMIT_EXCEEDED,
          SEVERITY_LEVELS.MEDIUM,
          request.headers.get('x-forwarded-for') || 'unknown',
          {
            userId: user.id,
            rateLimitType: 'user-based',
            endpoint: request.url,
            tier: userTier,
          }
        );

        return {
          isValid: false,
          error: 'User rate limit exceeded',
        };
      }

      const authContext: AuthContext = {
        user: {
          id: user.id,
          email: user.email || '',
          role: userRole,
          permissions,
          tier: userTier,
        },
        session: sessionResult.session!,
        token: {
          accessToken: token,
          refreshToken: this.refreshTokens.get(user.id),
          expiresAt,
          needsRefresh,
        },
      };

      // Log successful authentication
      SecurityMonitor.logEvent(
        SECURITY_EVENT_TYPES.AUTH_SUCCESS,
        SEVERITY_LEVELS.LOW,
        request.headers.get('x-forwarded-for') || 'unknown',
        {
          userId: user.id,
          email: user.email,
          role: userRole,
          sessionId: sessionResult.session!.id,
        },
        {
          userAgent: request.headers.get('user-agent'),
          endpoint: request.url,
          userId: user.id,
        }
      );

      return {
        isValid: true,
        authContext,
        needsRefresh,
      };

    } catch (error) {
      SafeLogger.error("JWT validation error", error);
      
      SecurityMonitor.logEvent(
        SECURITY_EVENT_TYPES.AUTH_FAILURE,
        SEVERITY_LEVELS.HIGH,
        request.headers.get('x-forwarded-for') || 'unknown',
        {
          error: 'JWT validation system error',
          endpoint: request.url,
        }
      );

      return {
        isValid: false,
        error: 'Authentication system error',
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(
    refreshToken: string,
    request: Request
  ): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    error?: string;
  }> {
    try {
      SafeLogger.debug("Refreshing access token");

      // Use Supabase to refresh the token
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        SafeLogger.warn("Token refresh failed", {
          error: error?.message,
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        });

        return {
          success: false,
          error: error?.message || 'Token refresh failed',
        };
      }

      const { access_token, refresh_token, expires_at } = data.session;
      const expiresAt = new Date((expires_at || 0) * 1000);

      // Update stored refresh token
      if (data.user) {
        this.refreshTokens.set(data.user.id, refresh_token || refreshToken);
      }

      SafeLogger.info("Access token refreshed successfully", {
        userId: data.user?.id,
        expiresAt: expiresAt.toISOString(),
      });

      return {
        success: true,
        accessToken: access_token,
        refreshToken: refresh_token || refreshToken,
        expiresAt,
      };

    } catch (error) {
      SafeLogger.error("Token refresh error", error);
      return {
        success: false,
        error: 'Token refresh system error',
      };
    }
  }

  /**
   * Revoke user session (logout)
   */
  static async revokeSession(
    sessionId: string,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return { success: false, error: 'Session not found' };
      }

      // Remove session from tracking
      this.activeSessions.delete(sessionId);
      
      const userSessions = this.userSessions.get(session.userId);
      if (userSessions) {
        userSessions.delete(sessionId);
        if (userSessions.size === 0) {
          this.userSessions.delete(session.userId);
        }
      }

      // Remove refresh token
      this.refreshTokens.delete(session.userId);

      // Log session revocation
      SecurityMonitor.logEvent(
        SECURITY_EVENT_TYPES.AUTH_SUCCESS, // Using success for logout
        SEVERITY_LEVELS.LOW,
        session.ip,
        {
          action: 'session_revoked',
          sessionId,
          userId: session.userId,
        }
      );

      SafeLogger.info("Session revoked", {
        sessionId,
        userId: session.userId,
      });

      return { success: true };

    } catch (error) {
      SafeLogger.error("Session revocation error", error);
      return { success: false, error: 'Session revocation failed' };
    }
  }

  /**
   * Revoke all sessions for a user
   */
  static async revokeAllUserSessions(userId: string): Promise<{ success: boolean; revokedCount: number }> {
    try {
      const userSessions = this.userSessions.get(userId) || new Set();
      const revokedCount = userSessions.size;

      for (const sessionId of userSessions) {
        await this.revokeSession(sessionId, userId);
      }

      SafeLogger.info("All user sessions revoked", {
        userId,
        revokedCount,
      });

      return { success: true, revokedCount };

    } catch (error) {
      SafeLogger.error("Bulk session revocation error", error);
      return { success: false, revokedCount: 0 };
    }
  }

  /**
   * Get authentication statistics
   */
  static getAuthStats(): {
    activeSessions: number;
    activeUsers: number;
    userRateLimits: number;
    sessionsByUser: Array<{ userId: string; sessionCount: number }>;
  } {
    const sessionsByUser: Array<{ userId: string; sessionCount: number }> = [];
    
    for (const [userId, sessions] of this.userSessions.entries()) {
      sessionsByUser.push({
        userId,
        sessionCount: sessions.size,
      });
    }

    return {
      activeSessions: this.activeSessions.size,
      activeUsers: this.userSessions.size,
      userRateLimits: this.userRateLimits.size,
      sessionsByUser: sessionsByUser.sort((a, b) => b.sessionCount - a.sessionCount),
    };
  }

  // Private helper methods

  private static parseJWTPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private static getUserTier(role: string): 'default' | 'premium' | 'admin' {
    if (role === 'admin' || role === 'super_admin') return 'admin';
    if (role === 'premium' || role === 'pro') return 'premium';
    return 'default';
  }

  private static getUserPermissions(role: string): string[] {
    const permissions: { [key: string]: string[] } = {
      user: ['read:own_data', 'create:booking', 'read:services'],
      premium: ['read:own_data', 'create:booking', 'read:services', 'read:analytics'],
      admin: ['*'], // All permissions
      super_admin: ['*'], // All permissions
    };

    return permissions[role] || permissions.user;
  }

  private static async manageUserSession(
    userId: string,
    request: Request,
    token: string
  ): Promise<{
    success: boolean;
    session?: {
      id: string;
      createdAt: Date;
      lastActivity: Date;
      userAgent?: string;
      ip: string;
    };
    error?: string;
  }> {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;
    const tokenHash = this.hashToken(token);

    // Check for existing session with same token
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.userId === userId && session.tokenHash === tokenHash) {
        // Update existing session
        session.lastActivity = new Date();
        session.ip = ip;
        session.userAgent = userAgent;

        return {
          success: true,
          session: {
            id: sessionId,
            createdAt: session.createdAt,
            lastActivity: session.lastActivity,
            userAgent: session.userAgent,
            ip: session.ip,
          },
        };
      }
    }

    // Check concurrent session limit
    const existingUserSessions = this.userSessions.get(userId);
    if (existingUserSessions && existingUserSessions.size >= JWT_CONFIG.maxConcurrentSessions) {
      // Remove oldest session
      const oldestSessionId = Array.from(existingUserSessions)[0];
      await this.revokeSession(oldestSessionId, userId);

      SafeLogger.warn("Concurrent session limit exceeded, removed oldest session", {
        userId,
        limit: JWT_CONFIG.maxConcurrentSessions,
        removedSessionId: oldestSessionId,
      });
    }

    // Create new session
    const sessionId = this.generateSessionId();
    const now = new Date();

    const newSession: UserSession = {
      sessionId,
      userId,
      ip,
      userAgent,
      createdAt: now,
      lastActivity: now,
      tokenHash,
    };

    this.activeSessions.set(sessionId, newSession);

    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);

    return {
      success: true,
      session: {
        id: sessionId,
        createdAt: now,
        lastActivity: now,
        userAgent,
        ip,
      },
    };
  }

  private static async checkUserRateLimit(
    userId: string,
    endpoint: string,
    tier: 'default' | 'premium' | 'admin'
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: Date;
  }> {
    const now = Date.now();
    const limits = JWT_CONFIG.userRateLimits[tier];
    const windowStart = now - limits.windowMs;

    if (!this.userRateLimits.has(userId)) {
      this.userRateLimits.set(userId, {
        userId,
        requests: [],
        tier,
      });
    }

    const userLimit = this.userRateLimits.get(userId)!;
    
    // Remove old requests outside window
    userLimit.requests = userLimit.requests.filter(req => req.timestamp > windowStart);

    // Check if limit exceeded
    const allowed = userLimit.requests.length < limits.requests;
    
    if (allowed) {
      // Add current request
      userLimit.requests.push({
        timestamp: now,
        endpoint,
      });
    }

    const remaining = Math.max(0, limits.requests - userLimit.requests.length);
    const resetTime = new Date(now + limits.windowMs);

    return {
      allowed,
      remaining,
      resetTime,
    };
  }

  private static hashToken(token: string): string {
    // Simple hash for token comparison (in production use proper crypto)
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      const char = token.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private static generateSessionId(): string {
    return `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
  }

  // Cleanup expired sessions (run periodically)
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.activeSessions.entries()) {
      const timeSinceActivity = now - session.lastActivity.getTime();
      
      if (timeSinceActivity > JWT_CONFIG.sessionTimeoutMs) {
        expiredSessions.push(sessionId);
      }
    }

    for (const sessionId of expiredSessions) {
      this.revokeSession(sessionId);
    }

    if (expiredSessions.length > 0) {
      SafeLogger.info("Cleaned up expired sessions", {
        expiredCount: expiredSessions.length,
        remainingCount: this.activeSessions.size,
      });
    }
  }
}

/**
 * JWT Authentication Middleware
 */
export class JWTMiddleware {
  /**
   * Create JWT authentication middleware
   */
  static createMiddleware(options: {
    required?: boolean;
    permissions?: string[];
    roles?: string[];
  } = {}) {
    return async (req: any, res: any, next: any) => {
      try {
        // Extract JWT token
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') 
          ? authHeader.substring(7) 
          : req.headers['x-access-token'] || req.query.token;

        if (!token) {
          if (options.required) {
            return res.status(401).json({
              error: 'Authentication required',
              message: 'JWT token is required for this endpoint',
            });
          }
          
          // Allow anonymous access
          req.auth = null;
          if (next) next();
          return;
        }

        // Convert to standard Request
        const request = req instanceof Request ? req : new Request(req.url, {
          method: req.method,
          headers: req.headers,
        });

        // Validate JWT
        const validation = await JWTAuthenticationManager.validateJWT(token, request);

        if (!validation.isValid) {
          SecurityMonitor.trackAuthFailure(
            request.headers.get('x-forwarded-for') || 'unknown',
            {
              username: 'jwt_user',
              endpoint: req.path || req.url,
              reason: validation.error || 'Invalid JWT',
              userAgent: request.headers.get('user-agent') || undefined,
            }
          );

          return res.status(401).json({
            error: 'Authentication failed',
            message: validation.error || 'Invalid or expired token',
            needsRefresh: validation.needsRefresh,
          });
        }

        const authContext = validation.authContext!;

        // Check role permissions
        if (options.roles && options.roles.length > 0) {
          if (!options.roles.includes(authContext.user.role)) {
            return res.status(403).json({
              error: 'Insufficient privileges',
              message: 'You do not have permission to access this resource',
              requiredRoles: options.roles,
              userRole: authContext.user.role,
            });
          }
        }

        // Check specific permissions
        if (options.permissions && options.permissions.length > 0) {
          const hasPermission = authContext.user.permissions.includes('*') || 
            options.permissions.some(perm => authContext.user.permissions.includes(perm));

          if (!hasPermission) {
            return res.status(403).json({
              error: 'Insufficient permissions',
              message: 'You do not have the required permissions for this action',
              requiredPermissions: options.permissions,
              userPermissions: authContext.user.permissions,
            });
          }
        }

        // Attach auth context to request
        req.auth = authContext;
        req.user = authContext.user;
        req.session = authContext.session;

        // Set refresh token header if needed
        if (validation.needsRefresh) {
          res.setHeader('X-Token-Refresh-Needed', 'true');
          res.setHeader('X-Token-Expires-At', authContext.token.expiresAt.toISOString());
        }

        if (next) next();
      } catch (error) {
        SafeLogger.error("JWT middleware error", error);
        
        return res.status(500).json({
          error: 'Authentication system error',
          message: 'An error occurred during authentication',
        });
      }
    };
  }

  /**
   * Refresh token endpoint handler
   */
  static async handleTokenRefresh(req: any, res: any) {
    try {
      const refreshToken = req.body?.refresh_token || req.headers['x-refresh-token'];

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token required',
          message: 'Refresh token is required to obtain a new access token',
        });
      }

      const request = req instanceof Request ? req : new Request(req.url, {
        method: req.method,
        headers: req.headers,
      });

      const result = await JWTAuthenticationManager.refreshAccessToken(refreshToken, request);

      if (!result.success) {
        return res.status(401).json({
          error: 'Token refresh failed',
          message: result.error || 'Unable to refresh access token',
        });
      }

      return res.json({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
        expires_at: result.expiresAt?.toISOString(),
        token_type: 'Bearer',
      });

    } catch (error) {
      SafeLogger.error("Token refresh handler error", error);
      return res.status(500).json({
        error: 'Token refresh system error',
        message: 'An error occurred during token refresh',
      });
    }
  }

  /**
   * Logout endpoint handler
   */
  static async handleLogout(req: any, res: any) {
    try {
      const sessionId = req.session?.id;
      const userId = req.user?.id;

      if (sessionId) {
        const result = await JWTAuthenticationManager.revokeSession(sessionId, userId);
        
        if (result.success) {
          return res.json({
            message: 'Successfully logged out',
            sessionRevoked: true,
          });
        }
      }

      return res.json({
        message: 'Logout processed',
        sessionRevoked: false,
      });

    } catch (error) {
      SafeLogger.error("Logout handler error", error);
      return res.status(500).json({
        error: 'Logout system error',
        message: 'An error occurred during logout',
      });
    }
  }
}

/**
 * React hook for JWT authentication
 */
export function useJWTAuth() {
  const refreshToken = async (refreshToken: string) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return await response.json();
    } catch (error) {
      SafeLogger.error("Client token refresh error", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      // Clear local storage regardless of response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      return response.ok;
    } catch (error) {
      SafeLogger.error("Client logout error", error);
      // Still clear local storage on error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
  };

  return {
    refreshToken,
    logout,
  };
}

// Start session cleanup timer
setInterval(() => {
  JWTAuthenticationManager.cleanupExpiredSessions();
}, 15 * 60 * 1000); // Every 15 minutes

// Initialize authentication monitoring
SafeLogger.info("JWT Authentication system initialized", {
  maxConcurrentSessions: JWT_CONFIG.maxConcurrentSessions,
  sessionTimeoutMs: JWT_CONFIG.sessionTimeoutMs,
  refreshThresholdMs: JWT_CONFIG.refreshThresholdMs,
});