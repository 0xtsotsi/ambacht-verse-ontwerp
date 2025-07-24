/**
 * Security Headers Middleware for Wesley's Ambacht
 * 
 * Implements comprehensive security headers and CORS configuration:
 * - Content Security Policy (CSP)
 * - HSTS (HTTP Strict Transport Security)
 * - X-Frame-Options (Clickjacking protection)
 * - X-Content-Type-Options (MIME sniffing protection)
 * - X-XSS-Protection (XSS filtering)
 * - Referrer-Policy (Information leakage control)
 * - CORS with strict origin validation
 */

import { SafeLogger } from "@/lib/LoggerUtils";

// Security configuration
const SECURITY_CONFIG = {
  // Content Security Policy
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Vite/React in development
      "https://unpkg.com", // For CDN resources
      "https://cdn.jsdelivr.net", // For CDN resources
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind and inline styles
      "https://fonts.googleapis.com",
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
    ],
    imgSrc: [
      "'self'",
      "data:", // For base64 images
      "https:", // Allow HTTPS images
      "blob:", // For generated images
    ],
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
    connectSrc: [
      "'self'",
      "https://*.supabase.co", // Supabase API
      "https://*.supabase.com", // Supabase API
      "wss://*.supabase.co", // Supabase realtime
      process.env.NODE_ENV === 'development' ? "ws://localhost:*" : "", // Vite HMR
    ].filter(Boolean),
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: process.env.NODE_ENV === 'production',
  },

  // CORS configuration
  cors: {
    allowedOrigins: [
      "https://ambacht-verse-ontwerp.vercel.app",
      "https://wesley-ambacht.nl",
      "https://www.wesley-ambacht.nl",
      ...(process.env.NODE_ENV === 'development' ? [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ] : []),
    ],
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-API-Key",
      "Accept",
      "Origin",
      "Cache-Control",
      "Pragma",
    ],
    exposedHeaders: [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
      "X-Content-Length",
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // HSTS configuration
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // Additional security headers
  additionalHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=(), microphone=(), geolocation=()',
      'fullscreen=(self), payment=()',
    ].join(', '),
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
  },
};

/**
 * Generate Content Security Policy string
 */
function generateCSPString(): string {
  const csp = SECURITY_CONFIG.csp;
  const directives: string[] = [];

  // Add all CSP directives
  Object.entries(csp).forEach(([key, value]) => {
    if (key === 'upgradeInsecureRequests' && value) {
      directives.push('upgrade-insecure-requests');
    } else if (Array.isArray(value) && value.length > 0) {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      directives.push(`${kebabKey} ${value.join(' ')}`);
    }
  });

  return directives.join('; ');
}

/**
 * Check if origin is allowed for CORS
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  const allowedOrigins = SECURITY_CONFIG.cors.allowedOrigins;
  
  // Check exact matches
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  
  // Check wildcard patterns for development
  if (process.env.NODE_ENV === 'development') {
    const localhostPattern = /^https?:\/\/localhost:\d+$/;
    const localhostIPPattern = /^https?:\/\/127\.0\.0\.1:\d+$/;
    
    if (localhostPattern.test(origin) || localhostIPPattern.test(origin)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Security Headers Middleware Class
 */
export class SecurityHeaders {
  /**
   * Apply security headers to response
   */
  static applyHeaders(request: Request, response: any): void {
    try {
      const origin = request.headers.get('origin');
      
      // Apply CORS headers
      this.applyCORSHeaders(origin, response);
      
      // Apply security headers
      this.applySecurityHeaders(response);
      
      // Apply CSP
      const cspString = generateCSPString();
      response.headers.set('Content-Security-Policy', cspString);
      
      // Apply HSTS (only for HTTPS)
      if (request.url.startsWith('https://')) {
        const hstsValue = `max-age=${SECURITY_CONFIG.hsts.maxAge}; includeSubDomains; preload`;
        response.headers.set('Strict-Transport-Security', hstsValue);
      }
      
      SafeLogger.debug("Security headers applied", {
        origin,
        url: request.url,
        method: request.method,
      });
      
    } catch (error) {
      SafeLogger.error("Error applying security headers", error, {
        url: request.url,
        method: request.method,
      });
    }
  }

  /**
   * Apply CORS headers
   */
  private static applyCORSHeaders(origin: string | null, response: any): void {
    const corsConfig = SECURITY_CONFIG.cors;
    
    // Check if origin is allowed
    if (origin && isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Vary', 'Origin');
    } else if (!origin) {
      // Same-origin request
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
    response.headers.set('Access-Control-Expose-Headers', corsConfig.exposedHeaders.join(', '));
    response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());
    
    if (corsConfig.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }

  /**
   * Apply additional security headers
   */
  private static applySecurityHeaders(response: any): void {
    Object.entries(SECURITY_CONFIG.additionalHeaders).forEach(([header, value]) => {
      response.headers.set(header, value);
    });
  }

  /**
   * Handle preflight OPTIONS requests
   */
  static handlePreflight(request: Request): Response {
    const origin = request.headers.get('origin');
    
    if (!isOriginAllowed(origin)) {
      return new Response(null, {
        status: 403,
        statusText: 'Forbidden: Origin not allowed',
      });
    }

    const response = new Response(null, {
      status: 204,
      headers: {
        'Content-Length': '0',
      },
    });

    this.applyCORSHeaders(origin, response);
    this.applySecurityHeaders(response);

    return response;
  }

  /**
   * Create security middleware for various frameworks
   */
  static createMiddleware() {
    return {
      // Express/Connect style middleware
      express: (req: any, res: any, next: any) => {
        try {
          // Convert to standard Request if needed
          const request = req instanceof Request ? req : new Request(req.url, {
            method: req.method,
            headers: req.headers,
          });

          this.applyHeaders(request, res);
          
          if (next) next();
        } catch (error) {
          SafeLogger.error("Security middleware error", error);
          if (next) next();
        }
      },

      // Fetch API middleware
      fetch: (request: Request, response: Response) => {
        this.applyHeaders(request, response);
        return response;
      },

      // Vite dev server middleware
      vite: (req: any, res: any, next: any) => {
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
          const request = new Request(`${req.protocol}://${req.get('host')}${req.originalUrl}`, {
            method: req.method,
            headers: req.headers,
          });
          
          const response = this.handlePreflight(request);
          
          res.status(response.status);
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          
          return res.end();
        }

        // Apply headers to regular requests
        const request = new Request(`${req.protocol}://${req.get('host')}${req.originalUrl}`, {
          method: req.method,
          headers: req.headers,
        });

        this.applyHeaders(request, res);
        
        if (next) next();
      },
    };
  }

  /**
   * Validate security configuration
   */
  static validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate CSP
    if (!SECURITY_CONFIG.csp.defaultSrc.includes("'self'")) {
      errors.push("CSP default-src should include 'self'");
    }

    if (SECURITY_CONFIG.csp.objectSrc.includes("'unsafe-inline'")) {
      errors.push("CSP object-src should not allow unsafe-inline");
    }

    // Validate CORS
    if (SECURITY_CONFIG.cors.allowedOrigins.length === 0) {
      errors.push("CORS must have at least one allowed origin");
    }

    // Validate HSTS
    if (SECURITY_CONFIG.hsts.maxAge < 31536000) {
      errors.push("HSTS max-age should be at least 1 year (31536000 seconds)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get security configuration for monitoring
   */
  static getConfig() {
    return {
      csp: generateCSPString(),
      cors: SECURITY_CONFIG.cors,
      hsts: SECURITY_CONFIG.hsts,
      headers: SECURITY_CONFIG.additionalHeaders,
    };
  }
}

/**
 * React hook for security header status
 */
export function useSecurityHeaders() {
  const checkSecurityHeaders = async (url?: string): Promise<{
    csp: boolean;
    hsts: boolean;
    xFrame: boolean;
    xContentType: boolean;
    cors: boolean;
  }> => {
    try {
      const targetUrl = url || window.location.href;
      const response = await fetch(targetUrl, { method: 'HEAD' });
      
      return {
        csp: response.headers.has('content-security-policy'),
        hsts: response.headers.has('strict-transport-security'),
        xFrame: response.headers.has('x-frame-options'),
        xContentType: response.headers.has('x-content-type-options'),
        cors: response.headers.has('access-control-allow-origin'),
      };
    } catch (error) {
      SafeLogger.error("Failed to check security headers", error);
      return {
        csp: false,
        hsts: false,
        xFrame: false,
        xContentType: false,
        cors: false,
      };
    }
  };

  return {
    checkSecurityHeaders,
  };
}

/**
 * Security audit function
 */
export function auditSecurityHeaders(): {
  score: number;
  passed: string[];
  failed: string[];
  recommendations: string[];
} {
  const config = SecurityHeaders.getConfig();
  const validation = SecurityHeaders.validateConfig();
  
  const passed: string[] = [];
  const failed: string[] = [];
  const recommendations: string[] = [];

  // Check CSP
  if (config.csp.includes("default-src 'self'")) {
    passed.push("Content Security Policy configured");
  } else {
    failed.push("Content Security Policy missing or misconfigured");
    recommendations.push("Configure a strict Content Security Policy");
  }

  // Check HSTS
  if (config.hsts.maxAge >= 31536000) {
    passed.push("HTTP Strict Transport Security configured");
  } else {
    failed.push("HSTS not configured or too short");
    recommendations.push("Enable HSTS with minimum 1-year max-age");
  }

  // Check frame protection
  if (config.headers['X-Frame-Options'] === 'DENY') {
    passed.push("Clickjacking protection enabled");
  } else {
    failed.push("X-Frame-Options not configured");
    recommendations.push("Set X-Frame-Options to DENY or SAMEORIGIN");
  }

  // Check MIME type protection
  if (config.headers['X-Content-Type-Options'] === 'nosniff') {
    passed.push("MIME type sniffing protection enabled");
  } else {
    failed.push("X-Content-Type-Options not configured");
    recommendations.push("Set X-Content-Type-Options to nosniff");
  }

  // Check CORS
  if (config.cors.allowedOrigins.length > 0) {
    passed.push("CORS properly configured");
  } else {
    failed.push("CORS not configured");
    recommendations.push("Configure CORS with specific allowed origins");
  }

  // Add validation errors
  failed.push(...validation.errors);

  const score = Math.round((passed.length / (passed.length + failed.length)) * 100);

  return {
    score,
    passed,
    failed,
    recommendations,
  };
}