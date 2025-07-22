/**
 * Comprehensive error classification system for API calls
 * Provides detailed error categorization, context extraction, and recovery suggestions
 */

import { APILogger, LoggerUtils } from "./logger";

// Type definitions for error handling
type ErrorPayload =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | undefined;

// Define possible error-like objects
interface ErrorLike {
  message?: string;
  name?: string;
  type?: string;
  status?: number;
  statusCode?: number;
  code?: string | number;
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      message?: string;
      code?: string | number;
    };
  };
  statusText?: string;
}

export interface ErrorContext {
  endpoint: string;
  method: string;
  payload?: ErrorPayload;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  userAgent?: string;
  requestId: string;
}

export interface ClassifiedError {
  type: ErrorType;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  code?: string | number;
  retryable: boolean;
  recoverySuggestion: string;
  context: ErrorContext;
}

export type ErrorType =
  | "network"
  | "server"
  | "validation"
  | "authentication"
  | "authorization"
  | "rate_limit"
  | "timeout"
  | "unknown";

export type ErrorCategory =
  | "connectivity"
  | "client_error"
  | "server_error"
  | "security"
  | "business_logic"
  | "system";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Network error patterns and classification
 */
const NETWORK_ERROR_PATTERNS = [
  /network/i,
  /timeout/i,
  /fetch/i,
  /connection/i,
  /offline/i,
  /dns/i,
  /cors/i,
];

/**
 * Server error status codes
 */
const SERVER_ERROR_CODES = [500, 502, 503, 504, 507, 508, 510, 511];

/**
 * Client error status codes
 */
const CLIENT_ERROR_CODES = [400, 401, 403, 404, 405, 406, 409, 410, 422, 429];

/**
 * Authentication/Authorization error codes
 */
const AUTH_ERROR_CODES = [401, 403];

/**
 * Rate limiting error codes
 */
const RATE_LIMIT_CODES = [429];

/**
 * Timeout error codes
 */
const TIMEOUT_CODES = [408, 504];

/**
 * Classifies errors based on multiple factors
 */
export function classifyError(
  error: Error | ErrorLike | string,
  context: Partial<ErrorContext>,
): ClassifiedError {
  const requestId = LoggerUtils.generateRequestId();
  const timestamp = new Date().toISOString();

  const fullContext: ErrorContext = {
    endpoint: context.endpoint || "unknown",
    method: context.method || "GET",
    payload: LoggerUtils.sanitizeData(context.payload),
    userId: context.userId,
    sessionId: context.sessionId,
    timestamp,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    requestId,
    ...context,
  };

  // Extract status code and message
  const status = extractStatusCode(error);
  const message = extractErrorMessage(error);
  const code = extractErrorCode(error);

  // Determine error type
  const type = determineErrorType(error, status, message);

  // Determine category and severity
  const category = determineErrorCategory(type, status);
  const severity = determineErrorSeverity(type, status);

  // Determine if retryable
  const retryable = isRetryable(type, status);

  // Generate recovery suggestion
  const recoverySuggestion = generateRecoverySuggestion(
    type,
    status,
    fullContext,
  );

  const classifiedError: ClassifiedError = {
    type,
    category,
    severity,
    message,
    code,
    retryable,
    recoverySuggestion,
    context: fullContext,
  };

  // Log the classified error
  logClassifiedError(classifiedError);

  return classifiedError;
}

/**
 * Extracts status code from error object
 */
function extractStatusCode(
  error: Error | ErrorLike | string,
): number | undefined {
  return (
    error?.status || error?.response?.status || error?.statusCode || error?.code
  );
}

/**
 * Extracts error message from error object
 */
function extractErrorMessage(error: Error | ErrorLike | string): string {
  if (typeof error === "string") return error;

  return (
    error?.message ||
    error?.response?.data?.message ||
    error?.response?.statusText ||
    error?.statusText ||
    "Unknown error occurred"
  );
}

/**
 * Extracts error code from error object
 */
function extractErrorCode(
  error: Error | ErrorLike | string,
): string | number | undefined {
  return (
    error?.code ||
    error?.response?.data?.code ||
    error?.status ||
    error?.statusCode
  );
}

/**
 * Determines the error type based on various factors
 */
function determineErrorType(
  error: Error | ErrorLike | string,
  status?: number,
  message?: string,
): ErrorType {
  // Check status code first
  if (status) {
    if (AUTH_ERROR_CODES.includes(status)) return "authentication";
    if (RATE_LIMIT_CODES.includes(status)) return "rate_limit";
    if (TIMEOUT_CODES.includes(status)) return "timeout";
    if (SERVER_ERROR_CODES.includes(status)) return "server";
    if (CLIENT_ERROR_CODES.includes(status)) return "validation";
  }

  // Check error name/type
  if (error?.name === "NetworkError" || error?.type === "network") {
    return "network";
  }

  // Check message patterns
  if (message) {
    if (NETWORK_ERROR_PATTERNS.some((pattern) => pattern.test(message))) {
      return "network";
    }

    if (/unauthorized|forbidden|access.denied/i.test(message)) {
      return "authentication";
    }

    if (/validation|invalid|required|format/i.test(message)) {
      return "validation";
    }

    if (/timeout|timed.out/i.test(message)) {
      return "timeout";
    }

    if (/rate.limit|too.many.requests/i.test(message)) {
      return "rate_limit";
    }
  }

  return "unknown";
}

/**
 * Determines error category based on type and status
 */
function determineErrorCategory(
  type: ErrorType,
  status?: number,
): ErrorCategory {
  switch (type) {
    case "network":
    case "timeout":
      return "connectivity";

    case "authentication":
    case "authorization":
      return "security";

    case "validation":
      return "business_logic";

    case "server":
      return "server_error";

    case "rate_limit":
      return "system";

    default:
      if (status && status >= 400 && status < 500) {
        return "client_error";
      }
      if (status && status >= 500) {
        return "server_error";
      }
      return "system";
  }
}

/**
 * Determines error severity based on type and status
 */
function determineErrorSeverity(
  type: ErrorType,
  status?: number,
): ErrorSeverity {
  switch (type) {
    case "authentication":
    case "authorization":
      return "high";

    case "server":
      return status === 500 ? "critical" : "high";

    case "network":
    case "timeout":
      return "medium";

    case "rate_limit":
      return "medium";

    case "validation":
      return "low";

    default:
      if (status && status >= 500) return "high";
      if (status && status >= 400) return "medium";
      return "low";
  }
}

/**
 * Determines if an error is retryable
 */
function isRetryable(type: ErrorType, status?: number): boolean {
  // Never retry authentication or validation errors
  if (type === "authentication" || type === "validation") {
    return false;
  }

  // Retry network, timeout, and some server errors
  if (type === "network" || type === "timeout") {
    return true;
  }

  if (type === "server") {
    // Retry 500, 502, 503, 504 but not others
    return [500, 502, 503, 504].includes(status || 0);
  }

  if (type === "rate_limit") {
    return true; // With delay
  }

  return false;
}

/**
 * Generates recovery suggestions based on error type
 */
function generateRecoverySuggestion(
  type: ErrorType,
  status?: number,
  context?: ErrorContext,
): string {
  switch (type) {
    case "network":
      return "Check your internet connection and try again. If the problem persists, it may be a temporary network issue.";

    case "timeout":
      return "The request timed out. Try again with a shorter operation or check your connection speed.";

    case "authentication":
      return "Authentication failed. Please log in again or check your credentials.";

    case "authorization":
      return "You don't have permission to perform this action. Contact support if you believe this is an error.";

    case "validation":
      return "Please check your input data for errors and try again.";

    case "rate_limit":
      return "Too many requests. Please wait a moment before trying again.";

    case "server":
      if (status === 500) {
        return "Internal server error. The issue is on our end - please try again later.";
      }
      return "Server error occurred. Please try again later or contact support if the issue persists.";

    default:
      return "An unexpected error occurred. Please try again or contact support if the problem continues.";
  }
}

/**
 * Logs classified error with full context
 */
function logClassifiedError(classifiedError: ClassifiedError): void {
  APILogger.error(
    classifiedError.context.endpoint,
    new Error(classifiedError.message),
    0,
    classifiedError.context.requestId,
  );

  // Additional structured logging
  APILogger.request(
    "error-classification",
    "POST",
    {
      type: classifiedError.type,
      category: classifiedError.category,
      severity: classifiedError.severity,
      retryable: classifiedError.retryable,
      code: classifiedError.code,
      context: classifiedError.context,
    },
    classifiedError.context.requestId,
  );
}

/**
 * Error recovery utilities
 */
export class ErrorRecovery {
  /**
   * Gets retry delay based on error type and attempt
   */
  static getRetryDelay(type: ErrorType, attempt: number): number {
    const baseDelays = {
      network: 1000,
      timeout: 2000,
      server: 1500,
      rate_limit: 5000,
      unknown: 1000,
    };

    const baseDelay = baseDelays[type] || 1000;
    return Math.min(baseDelay * Math.pow(2, attempt - 1), 30000);
  }

  /**
   * Determines maximum retry attempts for error type
   */
  static getMaxRetries(type: ErrorType): number {
    const maxRetries = {
      network: 3,
      timeout: 2,
      server: 3,
      rate_limit: 1,
      unknown: 1,
      authentication: 0,
      validation: 0,
      authorization: 0,
    };

    return maxRetries[type] || 0;
  }
}
