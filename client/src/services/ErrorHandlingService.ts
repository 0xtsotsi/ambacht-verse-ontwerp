import { SafeLogger } from "@/lib/LoggerUtils";
import { UserFlowLogger } from "@/lib/logger";

export interface ErrorContext {
  componentName: string;
  action: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, unknown>;
}

export interface ErrorClassification {
  severity: "low" | "medium" | "high" | "critical";
  category: "user" | "system" | "network" | "validation" | "business";
  recoverable: boolean;
  retryable: boolean;
}

export interface ErrorResponse {
  userMessage: string;
  internalMessage: string;
  classification: ErrorClassification;
  shouldRetry: boolean;
  retryDelay?: number;
}

/**
 * Centralized error handling service
 * Provides consistent error processing, logging, and user feedback
 */
export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private retryAttempts = new Map<string, number>();

  private constructor() {}

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  /**
   * Process and classify errors with appropriate response
   */
  handleError(error: Error, context: ErrorContext): ErrorResponse {
    const classification = this.classifyError(error);
    const errorKey = `${context.componentName}_${context.action}`;

    // Log error with full context
    SafeLogger.error("Error handled by ErrorHandlingService:", error, {
      ...context,
      classification,
      timestamp: new Date().toISOString(),
    });

    // Track user flow error
    UserFlowLogger.error(`${context.action}_error`, error.message, {
      componentName: context.componentName,
      classification,
      ...context.additionalData,
    });

    // Determine retry logic
    const currentAttempts = this.retryAttempts.get(errorKey) || 0;
    const shouldRetry = classification.retryable && currentAttempts < 3;

    if (shouldRetry) {
      this.retryAttempts.set(errorKey, currentAttempts + 1);
    }

    return {
      userMessage: this.generateUserMessage(error, classification),
      internalMessage: error.message,
      classification,
      shouldRetry,
      retryDelay: this.calculateRetryDelay(currentAttempts),
    };
  }

  /**
   * Classify error based on type and message
   */
  private classifyError(error: Error): ErrorClassification {
    const message = error.message.toLowerCase();

    // Network errors
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("timeout")
    ) {
      return {
        severity: "medium",
        category: "network",
        recoverable: true,
        retryable: true,
      };
    }

    // Validation errors
    if (
      message.includes("validation") ||
      message.includes("invalid") ||
      message.includes("required")
    ) {
      return {
        severity: "low",
        category: "validation",
        recoverable: true,
        retryable: false,
      };
    }

    // Business logic errors
    if (
      message.includes("booking") ||
      message.includes("availability") ||
      message.includes("quote")
    ) {
      return {
        severity: "medium",
        category: "business",
        recoverable: true,
        retryable: false,
      };
    }

    // System errors
    if (
      message.includes("system") ||
      message.includes("database") ||
      message.includes("server")
    ) {
      return {
        severity: "high",
        category: "system",
        recoverable: false,
        retryable: true,
      };
    }

    // Default classification
    return {
      severity: "medium",
      category: "system",
      recoverable: false,
      retryable: false,
    };
  }

  /**
   * Generate user-friendly error messages
   */
  private generateUserMessage(
    error: Error,
    classification: ErrorClassification,
  ): string {
    switch (classification.category) {
      case "network":
        return "Er is een verbindingsprobleem opgetreden. Controleer uw internetverbinding en probeer het opnieuw.";
      case "validation":
        return "Controleer uw invoer en probeer het opnieuw.";
      case "business":
        return "Er is een probleem opgetreden met uw aanvraag. Probeer het opnieuw of neem contact met ons op.";
      case "system":
        return "Er is een technisch probleem opgetreden. We werken eraan om dit op te lossen.";
      default:
        return "Er is een onverwachte fout opgetreden. Probeer het opnieuw of neem contact met ons op.";
    }
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempts: number): number {
    return Math.min(1000 * Math.pow(2, attempts), 10000); // Max 10 seconds
  }

  /**
   * Clear retry attempts for successful operations
   */
  clearRetryAttempts(componentName: string, action: string): void {
    const errorKey = `${componentName}_${action}`;
    this.retryAttempts.delete(errorKey);
  }

  /**
   * Get current retry count for debugging
   */
  getRetryCount(componentName: string, action: string): number {
    const errorKey = `${componentName}_${action}`;
    return this.retryAttempts.get(errorKey) || 0;
  }
}
