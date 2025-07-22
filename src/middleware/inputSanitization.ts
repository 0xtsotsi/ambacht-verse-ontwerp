/**
 * Input Sanitization and Validation Middleware for Wesley's Ambacht
 *
 * Comprehensive protection against:
 * - SQL Injection attacks
 * - XSS (Cross-Site Scripting) attacks
 * - CSRF (Cross-Site Request Forgery)
 * - NoSQL injection
 * - Command injection
 * - Path traversal attacks
 * - Data validation and type safety
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import { ValidationService } from "@/services/ValidationService";

// Dangerous patterns to detect
const SECURITY_PATTERNS = {
  // SQL Injection patterns
  sqlInjection: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /('|(\\x27)|(\\x2D\\x2D)|(%27)|(%2D%2D))/gi,
    /((;)|(;)|(\x3B))/gi,
    /(\|\||\band\b|\bor\b)/gi,
  ],

  // XSS patterns
  xss: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
    /<link\b[^>]*>/gi,
    /<meta\b[^>]*>/gi,
  ],

  // NoSQL injection patterns
  nosqlInjection: [
    /\$where/gi,
    /\$regex/gi,
    /\$ne/gi,
    /\$gt/gi,
    /\$lt/gi,
    /\$in/gi,
    /\$nin/gi,
  ],

  // Command injection patterns
  commandInjection: [
    /(\||&|;|\$\(|`)/g,
    /(exec|eval|system|shell_exec|passthru|popen)/gi,
  ],

  // Path traversal patterns
  pathTraversal: [
    /(\.\.\/|\.\.\\)/g,
    /(\/etc\/passwd|\/etc\/shadow|\/etc\/hosts)/gi,
    /(\\windows\\system32|\\boot\.ini)/gi,
  ],
};

// CSRF token configuration
const CSRF_CONFIG = {
  tokenLength: 32,
  headerName: "X-CSRF-Token",
  cookieName: "csrf_token",
  sessionKey: "csrf_token",
  maxAge: 3600000, // 1 hour
};

/**
 * Generate cryptographically secure CSRF token
 */
function generateCSRFToken(): string {
  const array = new Uint8Array(CSRF_CONFIG.tokenLength);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  /**
   * Sanitize string input to prevent XSS
   */
  static sanitizeString(input: string): string {
    if (typeof input !== "string") return "";

    return (
      input
        // HTML entity encoding
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;")
        // Remove null bytes and control characters
        .replace(/\0/g, "")
        .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
        // Normalize whitespace
        .trim()
        .replace(/\s+/g, " ")
        // Limit length
        .substring(0, 10000)
    );
  }

  /**
   * Sanitize HTML content (more permissive for rich text)
   */
  static sanitizeHTML(input: string): string {
    if (typeof input !== "string") return "";

    // Allow basic formatting but remove dangerous elements
    const allowedTags = [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
    ];
    const allowedAttributes: string[] = [];

    // Remove script tags and event handlers
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/data:/gi, "");

    // Remove non-allowed tags (basic implementation)
    sanitized = sanitized.replace(
      /<(?!\/?(?:p|br|strong|b|em|i|u|ul|ol|li)\b)[^>]*>/gi,
      "",
    );

    return sanitized.substring(0, 50000); // Limit HTML content length
  }

  /**
   * Sanitize email addresses
   */
  static sanitizeEmail(input: string): string {
    if (typeof input !== "string") return "";

    return input
      .trim()
      .toLowerCase()
      .replace(/[^\w@.-]/g, "") // Keep only word chars, @, ., -
      .substring(0, 254); // RFC 5321 limit
  }

  /**
   * Sanitize phone numbers
   */
  static sanitizePhone(input: string): string {
    if (typeof input !== "string") return "";

    return input
      .replace(/[^\d\s\-+()]/g, "") // Keep only digits, spaces, dashes, plus, parentheses
      .trim()
      .substring(0, 20);
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(input: any): number | null {
    if (typeof input === "number" && !isNaN(input) && isFinite(input)) {
      return input;
    }

    if (typeof input === "string") {
      const num = parseFloat(input.replace(/[^\d.-]/g, ""));
      return !isNaN(num) && isFinite(num) ? num : null;
    }

    return null;
  }

  /**
   * Sanitize date input
   */
  static sanitizeDate(input: any): Date | null {
    if (input instanceof Date && !isNaN(input.getTime())) {
      return input;
    }

    if (typeof input === "string" || typeof input === "number") {
      const date = new Date(input);
      if (!isNaN(date.getTime())) {
        // Ensure date is within reasonable bounds
        const now = new Date();
        const minDate = new Date(now.getFullYear() - 1, 0, 1);
        const maxDate = new Date(now.getFullYear() + 10, 11, 31);

        if (date >= minDate && date <= maxDate) {
          return date;
        }
      }
    }

    return null;
  }

  /**
   * Detect potential security threats in input
   */
  static detectThreats(input: string): {
    threats: string[];
    riskLevel: "low" | "medium" | "high" | "critical";
  } {
    const threats: string[] = [];
    let maxRiskLevel: "low" | "medium" | "high" | "critical" = "low";

    if (typeof input !== "string") {
      return { threats, riskLevel: maxRiskLevel };
    }

    // Check SQL injection
    for (const pattern of SECURITY_PATTERNS.sqlInjection) {
      if (pattern.test(input)) {
        threats.push("SQL Injection");
        maxRiskLevel = "critical";
        break;
      }
    }

    // Check XSS
    for (const pattern of SECURITY_PATTERNS.xss) {
      if (pattern.test(input)) {
        threats.push("XSS Attack");
        maxRiskLevel = "critical";
        break;
      }
    }

    // Check NoSQL injection
    for (const pattern of SECURITY_PATTERNS.nosqlInjection) {
      if (pattern.test(input)) {
        threats.push("NoSQL Injection");
        if (maxRiskLevel !== "critical") maxRiskLevel = "high";
      }
    }

    // Check command injection
    for (const pattern of SECURITY_PATTERNS.commandInjection) {
      if (pattern.test(input)) {
        threats.push("Command Injection");
        maxRiskLevel = "critical";
        break;
      }
    }

    // Check path traversal
    for (const pattern of SECURITY_PATTERNS.pathTraversal) {
      if (pattern.test(input)) {
        threats.push("Path Traversal");
        if (maxRiskLevel !== "critical") maxRiskLevel = "high";
      }
    }

    return { threats, riskLevel: maxRiskLevel };
  }
}

/**
 * CSRF Protection utilities
 */
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  /**
   * Generate CSRF token for session
   */
  static generateToken(sessionId: string): string {
    const token = generateCSRFToken();
    const expires = Date.now() + CSRF_CONFIG.maxAge;

    this.tokens.set(sessionId, { token, expires });

    // Cleanup expired tokens
    this.cleanupExpiredTokens();

    return token;
  }

  /**
   * Validate CSRF token
   */
  static validateToken(sessionId: string, providedToken: string): boolean {
    const tokenData = this.tokens.get(sessionId);

    if (!tokenData) {
      SafeLogger.warn("CSRF token validation failed: No token for session", {
        sessionId,
      });
      return false;
    }

    if (Date.now() > tokenData.expires) {
      SafeLogger.warn("CSRF token validation failed: Token expired", {
        sessionId,
      });
      this.tokens.delete(sessionId);
      return false;
    }

    if (tokenData.token !== providedToken) {
      SafeLogger.warn("CSRF token validation failed: Token mismatch", {
        sessionId,
      });
      return false;
    }

    return true;
  }

  /**
   * Clean up expired tokens
   */
  private static cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [sessionId, tokenData] of this.tokens.entries()) {
      if (now > tokenData.expires) {
        this.tokens.delete(sessionId);
      }
    }
  }

  /**
   * Get token for session (for client-side access)
   */
  static getToken(sessionId: string): string | null {
    const tokenData = this.tokens.get(sessionId);
    if (tokenData && Date.now() <= tokenData.expires) {
      return tokenData.token;
    }
    return null;
  }
}

/**
 * Main input validation and sanitization middleware
 */
export class InputValidationMiddleware {
  /**
   * Validate and sanitize request data
   */
  static async validateRequest(
    request: Request,
    body?: any,
  ): Promise<{
    isValid: boolean;
    sanitizedData?: any;
    errors: string[];
    warnings: string[];
    threats: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const threats: string[] = [];
    let sanitizedData: any = {};

    try {
      // Parse body if needed
      let requestData = body;
      if (!requestData && request.body) {
        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          try {
            requestData = await request.json();
          } catch (error) {
            errors.push("Invalid JSON format");
            return { isValid: false, errors, warnings, threats };
          }
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          try {
            const formData = await request.formData();
            requestData = {};
            for (const [key, value] of formData.entries()) {
              requestData[key] = value;
            }
          } catch (error) {
            errors.push("Invalid form data");
            return { isValid: false, errors, warnings, threats };
          }
        }
      }

      if (!requestData) {
        return { isValid: true, sanitizedData: {}, errors, warnings, threats };
      }

      // Validate and sanitize each field
      sanitizedData = await this.sanitizeObject(
        requestData,
        errors,
        warnings,
        threats,
      );

      // Log security events if threats detected
      if (threats.length > 0) {
        SafeLogger.warn("Security threats detected in request", {
          url: request.url,
          method: request.method,
          threats,
          ip: request.headers.get("x-forwarded-for") || "unknown",
        });
      }

      return {
        isValid: errors.length === 0,
        sanitizedData,
        errors,
        warnings,
        threats,
      };
    } catch (error) {
      SafeLogger.error("Input validation error", error);
      errors.push("Validation system error");
      return { isValid: false, errors, warnings, threats };
    }
  }

  /**
   * Recursively sanitize object properties
   */
  private static async sanitizeObject(
    obj: any,
    errors: string[],
    warnings: string[],
    threats: string[],
  ): Promise<any> {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return Promise.all(
        obj.map((item) => this.sanitizeObject(item, errors, warnings, threats)),
      );
    }

    if (typeof obj === "object") {
      const sanitized: any = {};

      for (const [key, value] of Object.entries(obj)) {
        // Sanitize key name
        const sanitizedKey = InputSanitizer.sanitizeString(key);

        if (sanitizedKey !== key) {
          warnings.push(`Property name '${key}' was sanitized`);
        }

        // Sanitize value
        sanitized[sanitizedKey] = await this.sanitizeValue(
          value,
          sanitizedKey,
          errors,
          warnings,
          threats,
        );
      }

      return sanitized;
    }

    return this.sanitizeValue(obj, "unknown", errors, warnings, threats);
  }

  /**
   * Sanitize individual values based on context
   */
  private static async sanitizeValue(
    value: any,
    fieldName: string,
    errors: string[],
    warnings: string[],
    threats: string[],
  ): Promise<any> {
    if (value === null || value === undefined) return value;

    if (typeof value === "string") {
      // Detect threats first
      const threatResult = InputSanitizer.detectThreats(value);
      if (threatResult.threats.length > 0) {
        threats.push(...threatResult.threats);

        if (threatResult.riskLevel === "critical") {
          errors.push(`Critical security threat detected in ${fieldName}`);
          return ""; // Reject completely
        }
      }

      // Field-specific sanitization
      switch (fieldName.toLowerCase()) {
        case "email":
        case "email_address":
          return InputSanitizer.sanitizeEmail(value);

        case "phone":
        case "phone_number":
        case "telephone":
          return InputSanitizer.sanitizePhone(value);

        case "description":
        case "notes":
        case "comments":
          return InputSanitizer.sanitizeHTML(value);

        default:
          return InputSanitizer.sanitizeString(value);
      }
    }

    if (typeof value === "number") {
      const sanitized = InputSanitizer.sanitizeNumber(value);
      if (sanitized === null) {
        warnings.push(`Invalid number in ${fieldName}`);
        return 0;
      }
      return sanitized;
    }

    if (
      value instanceof Date ||
      (typeof value === "string" && fieldName.toLowerCase().includes("date"))
    ) {
      const sanitized = InputSanitizer.sanitizeDate(value);
      if (sanitized === null) {
        warnings.push(`Invalid date in ${fieldName}`);
        return null;
      }
      return sanitized;
    }

    if (typeof value === "boolean") {
      return Boolean(value);
    }

    if (typeof value === "object") {
      return this.sanitizeObject(value, errors, warnings, threats);
    }

    // Convert other types to string and sanitize
    return InputSanitizer.sanitizeString(String(value));
  }

  /**
   * Create middleware function
   */
  static createMiddleware() {
    return async (req: any, res: any, next: any) => {
      try {
        // Convert to standard Request if needed
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

        const validation = await this.validateRequest(request, req.body);

        if (!validation.isValid) {
          SafeLogger.warn("Request validation failed", {
            url: request.url,
            errors: validation.errors,
            threats: validation.threats,
          });

          return res.status
            ? res.status(400).json({
                error: "Invalid input",
                message: "De ingevoerde gegevens zijn niet geldig",
                details: validation.errors,
              })
            : new Response(
                JSON.stringify({
                  error: "Invalid input",
                  message: "De ingevoerde gegevens zijn niet geldig",
                  details: validation.errors,
                }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
        }

        // Attach sanitized data to request
        if (req.body && validation.sanitizedData) {
          req.body = validation.sanitizedData;
          req.sanitizedData = validation.sanitizedData;
        }

        if (next) next();
      } catch (error) {
        SafeLogger.error("Input validation middleware error", error);
        if (next) next();
      }
    };
  }
}

/**
 * React hook for client-side input validation
 */
export function useInputValidation() {
  const validateInput = (value: any, fieldName: string = "input") => {
    if (typeof value === "string") {
      const threats = InputSanitizer.detectThreats(value);
      const sanitized = InputSanitizer.sanitizeString(value);

      return {
        isValid: threats.threats.length === 0,
        sanitized,
        threats: threats.threats,
        riskLevel: threats.riskLevel,
      };
    }

    return {
      isValid: true,
      sanitized: value,
      threats: [],
      riskLevel: "low" as const,
    };
  };

  return { validateInput };
}
