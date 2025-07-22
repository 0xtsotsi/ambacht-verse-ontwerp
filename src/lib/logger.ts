/**
 * Centralized logging system for Ambacht-Verse-Ontwerp
 * Provides structured logging for components, API calls, and user flows
 */

import winston from "winston";

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    component: 3,
    api: 4,
    user: 5,
    debug: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    component: "blue",
    api: "magenta",
    user: "cyan",
    debug: "grey",
  },
};

// Winston logger configuration
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: isDevelopment ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
  ),
  defaultMeta: {
    service: "ambacht-verse-ontwerp",
    environment: isDevelopment ? "development" : "production",
  },
  transports: [
    // Console transport for development
    ...(isDevelopment
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize({ colors: customLevels.colors }),
              winston.format.simple(),
            ),
          }),
        ]
      : []),

    // File transports for production
    ...(isProduction
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
            maxsize: 5242880, // 5MB
            maxFiles: 10,
          }),
        ]
      : []),
  ],
});

// Apply custom colors
winston.addColors(customLevels.colors);

// Component State & Lifecycle Logger
export const ComponentLogger = {
  /**
   * Log component state changes
   */
  stateChange: (
    componentName: string,
    prevState: unknown,
    newState: unknown,
    trigger: string,
  ) => {
    logger.log("component", "State Change", {
      type: "state_change",
      component: componentName,
      previousState: prevState,
      newState: newState,
      trigger: trigger,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log component lifecycle events
   */
  lifecycle: (
    componentName: string,
    event: "mount" | "unmount" | "update",
    props?: Record<string, unknown>,
  ) => {
    logger.log("component", "Lifecycle Event", {
      type: "lifecycle",
      component: componentName,
      event: event,
      props: props,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log component re-renders with reasons
   */
  rerender: (componentName: string, reason: string, dependencies: string[]) => {
    logger.log("component", "Re-render", {
      type: "rerender",
      component: componentName,
      reason: reason,
      dependencies: dependencies,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log component performance metrics
   */
  performance: (
    componentName: string,
    renderTime: number,
    isSlowRender: boolean,
  ) => {
    logger.log("component", "Performance", {
      type: "performance",
      component: componentName,
      renderTime: renderTime,
      isSlowRender: isSlowRender,
      timestamp: new Date().toISOString(),
    });
  },
};

// API Calls & Error Handling Logger
export const APILogger = {
  /**
   * Log API request start
   */
  request: (
    endpoint: string,
    method: string,
    payload?: unknown,
    requestId?: string,
  ) => {
    logger.log("api", "API Request", {
      type: "api_request",
      endpoint: endpoint,
      method: method,
      payload: payload,
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log API response
   */
  response: (
    endpoint: string,
    status: number,
    responseTime: number,
    requestId?: string,
    data?: unknown,
  ) => {
    logger.log("api", "API Response", {
      type: "api_response",
      endpoint: endpoint,
      status: status,
      responseTime: responseTime,
      requestId: requestId,
      dataSize: data ? JSON.stringify(data).length : 0,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log API errors with retry information
   */
  error: (
    endpoint: string,
    error: Error,
    retryAttempt: number = 0,
    requestId?: string,
  ) => {
    logger.error("API Error", {
      type: "api_error",
      endpoint: endpoint,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      retryAttempt: retryAttempt,
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log retry attempts
   */
  retry: (
    endpoint: string,
    attempt: number,
    maxAttempts: number,
    delay: number,
    requestId?: string,
  ) => {
    logger.log("api", "API Retry", {
      type: "api_retry",
      endpoint: endpoint,
      attempt: attempt,
      maxAttempts: maxAttempts,
      delay: delay,
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });
  },
};

// User Flow Tracking Logger
export const UserFlowLogger = {
  /**
   * Log user navigation
   */
  navigation: (
    from: string,
    to: string,
    sessionId: string,
    userId?: string,
  ) => {
    logger.log("user", "Navigation", {
      type: "navigation",
      from: from,
      to: to,
      sessionId: sessionId,
      userId: userId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log user interactions (clicks, form submissions, etc.)
   */
  interaction: (
    action: string,
    element: string,
    data?: Record<string, unknown>,
    sessionId?: string,
    userId?: string,
  ) => {
    logger.log("user", "User Interaction", {
      type: "interaction",
      action: action,
      element: element,
      data: data,
      sessionId: sessionId,
      userId: userId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log form submissions and validation errors
   */
  form: (
    formName: string,
    action: "submit" | "validate" | "error",
    data?: Record<string, unknown>,
    errors?: string[],
  ) => {
    logger.log("user", "Form Event", {
      type: "form_event",
      formName: formName,
      action: action,
      data: data,
      errors: errors,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log user errors and issues
   */
  error: (
    errorType: string,
    description: string,
    context?: Record<string, unknown>,
    sessionId?: string,
    userId?: string,
  ) => {
    logger.log("user", "User Error", {
      type: "user_error",
      errorType: errorType,
      description: description,
      context: context,
      sessionId: sessionId,
      userId: userId,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Create breadcrumb trail
   */
  breadcrumb: (
    action: string,
    data?: Record<string, unknown>,
    sessionId?: string,
  ) => {
    logger.log("user", "Breadcrumb", {
      type: "breadcrumb",
      action: action,
      data: data,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
    });
  },
};

// Utility functions
export const LoggerUtils = {
  /**
   * Generate unique request ID
   */
  generateRequestId: (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Generate unique session ID
   */
  generateSessionId: (): string => {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Sanitize sensitive data before logging
   */
  sanitizeData: (data: unknown): unknown => {
    if (!data || typeof data !== "object") return data;

    const sensitive = [
      "password",
      "token",
      "apiKey",
      "secret",
      "authorization",
    ];
    const sanitized = { ...data };

    for (const key in sanitized) {
      if (sensitive.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = "[REDACTED]";
      }
    }

    return sanitized;
  },
};

// Export the main logger for direct use
export default logger;

// Development helper to view logs in console with better formatting
if (isDevelopment) {
  (window as Window & { logger?: unknown }).logger = {
    component: ComponentLogger,
    api: APILogger,
    user: UserFlowLogger,
    utils: LoggerUtils,
    winston: logger,
  };
}
