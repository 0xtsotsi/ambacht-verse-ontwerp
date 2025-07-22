/**
 * Logger utilities for data sanitization and safe logging
 * Prevents sensitive information from being logged
 */

// Type definitions for better type safety
type LoggableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Error
  | LoggableValue[]
  | { [key: string]: LoggableValue };

type SanitizedValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SanitizedValue[]
  | { [key: string]: SanitizedValue };

interface SanitizationOptions {
  removeFields?: string[];
  maskFields?: string[];
  maxDepth?: number;
}

interface SanitizedError {
  timestamp: string;
  type: "error";
  name?: string;
  message?: string;
  stack?: string;
  error?: SanitizedValue;
  context?: SanitizedValue;
}

interface SanitizedInteraction {
  timestamp: string;
  eventType: string;
  component: string;
  data?: SanitizedValue;
}

// Sensitive fields that should be sanitized or removed
const SENSITIVE_FIELDS = [
  "password",
  "token",
  "apiKey",
  "secret",
  "email",
  "phone",
  "creditCard",
  "ssn",
  "passport",
  "personalId",
] as const;

// Fields that should be completely removed from logs
const REMOVE_FIELDS = ["password", "token", "apiKey", "secret"] as const;

// Fields that should be masked but kept for debugging
const MASK_FIELDS = [
  "email",
  "phone",
  "creditCard",
  "ssn",
  "passport",
  "personalId",
] as const;

/**
 * Sanitizes data by removing or masking sensitive information
 * @param data - Data to sanitize
 * @param options - Sanitization options
 * @returns Sanitized data safe for logging
 */
export function sanitizeData(
  data: LoggableValue,
  options: SanitizationOptions = {},
): SanitizedValue {
  const {
    removeFields = [...REMOVE_FIELDS],
    maskFields = [...MASK_FIELDS],
    maxDepth = 10,
  } = options;

  if (maxDepth <= 0) {
    return "[Max depth reached]";
  }

  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    // Check if the string looks like sensitive data
    if (isEmailLike(data)) {
      return maskEmail(data);
    }
    if (isPhoneLike(data)) {
      return maskPhone(data);
    }
    if (isCreditCardLike(data)) {
      return maskCreditCard(data);
    }
    return data;
  }

  if (typeof data === "number" || typeof data === "boolean") {
    return data;
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (data instanceof Error) {
    return {
      name: data.name,
      message: data.message,
      stack: data.stack ? "[Stack trace available]" : undefined,
    };
  }

  if (Array.isArray(data)) {
    return data.map((item) =>
      sanitizeData(item, { ...options, maxDepth: maxDepth - 1 }),
    );
  }

  if (typeof data === "object") {
    const sanitized: { [key: string]: SanitizedValue } = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();

      // Remove sensitive fields completely
      if (
        removeFields.some((field) => lowerKey.includes(field.toLowerCase()))
      ) {
        sanitized[key] = "[REMOVED]";
        continue;
      }

      // Mask sensitive fields
      if (maskFields.some((field) => lowerKey.includes(field.toLowerCase()))) {
        sanitized[key] = maskValue(value);
        continue;
      }

      // Recursively sanitize nested objects
      sanitized[key] = sanitizeData(value, {
        ...options,
        maxDepth: maxDepth - 1,
      });
    }

    return sanitized;
  }

  return data;
}

/**
 * Creates a safe error object for logging
 * @param error - Error to sanitize
 * @param context - Additional context to include
 * @returns Sanitized error object
 */
export function sanitizeError(
  error: Error | string | LoggableValue,
  context?: Record<string, LoggableValue>,
): SanitizedError {
  const sanitizedError: SanitizedError = {
    timestamp: new Date().toISOString(),
    type: "error",
  };

  if (error instanceof Error) {
    sanitizedError.name = error.name;
    sanitizedError.message = error.message;
    sanitizedError.stack = error.stack ? "[Stack trace available]" : undefined;
  } else if (typeof error === "string") {
    sanitizedError.message = error;
  } else {
    sanitizedError.error = sanitizeData(error);
  }

  if (context) {
    sanitizedError.context = sanitizeData(context);
  }

  return sanitizedError;
}

/**
 * Sanitizes user interaction data for logging
 * @param eventType - Type of interaction
 * @param component - Component name
 * @param data - Interaction data
 * @returns Sanitized interaction data
 */
export function sanitizeInteractionData(
  eventType: string,
  component: string,
  data?: Record<string, LoggableValue>,
): SanitizedInteraction {
  return {
    timestamp: new Date().toISOString(),
    eventType,
    component,
    data: data ? sanitizeData(data) : undefined,
  };
}

// Helper functions for pattern detection
function isEmailLike(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value);
}

function isPhoneLike(value: string): boolean {
  // Simple phone pattern detection
  return /^\+?[\d\s\-()]{10,}$/.test(value);
}

function isCreditCardLike(value: string): boolean {
  // Simple credit card pattern detection (strips spaces/dashes)
  const cleaned = value.replace(/[\s-]/g, "");
  return /^\d{13,19}$/.test(cleaned);
}

function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  if (!username || !domain) return "[MASKED_EMAIL]";

  const maskedUsername =
    username.length > 2
      ? username.substring(0, 2) + "*".repeat(username.length - 2)
      : "*".repeat(username.length);

  return `${maskedUsername}@${domain}`;
}

function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 4) return "[MASKED_PHONE]";

  return (
    cleaned.substring(0, 2) +
    "*".repeat(cleaned.length - 4) +
    cleaned.substring(cleaned.length - 2)
  );
}

function maskCreditCard(card: string): string {
  const cleaned = card.replace(/\D/g, "");
  if (cleaned.length < 8) return "[MASKED_CARD]";

  return (
    cleaned.substring(0, 4) +
    "*".repeat(cleaned.length - 8) +
    cleaned.substring(cleaned.length - 4)
  );
}

function maskValue(value: LoggableValue): string {
  if (typeof value === "string") {
    if (value.length <= 2) return "[MASKED]";
    return value.substring(0, 2) + "*".repeat(Math.max(value.length - 2, 3));
  }
  return "[MASKED]";
}

/**
 * Safe console logger that sanitizes all output with proper type inference
 */
export const SafeLogger = {
  log: (message: string, data?: LoggableValue) => {
    console.log(message, data ? sanitizeData(data) : "");
  },

  error: (
    message: string,
    error?: Error | string | LoggableValue,
    context?: Record<string, LoggableValue>,
  ) => {
    console.error(message, sanitizeError(error, context));
  },

  warn: (message: string, data?: LoggableValue) => {
    console.warn(message, data ? sanitizeData(data) : "");
  },

  info: (message: string, data?: LoggableValue) => {
    console.info(message, data ? sanitizeData(data) : "");
  },
};
