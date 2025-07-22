
import { LoggerUtils as BaseLoggerUtils } from "./logger";

/**
 * Safe logger utility that wraps error-prone logging operations
 * to prevent error cascades from logging failures
 */
export const SafeLogger = {
  info: (message: string, ...args: any[]) => {
    try {
      console.info(message, ...args);
    } catch (error) {
      console.error("Error in SafeLogger.info:", error);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    try {
      console.warn(message, ...args);
    } catch (error) {
      console.error("Error in SafeLogger.warn:", error);
    }
  },
  
  error: (message: string, error: any, context?: Record<string, any>) => {
    try {
      console.error(message, error, context || {});
    } catch (loggingError) {
      console.error("Error in SafeLogger.error:", loggingError);
      console.error("Original error:", error);
    }
  },
  
  debug: (message: string, ...args: any[]) => {
    try {
      console.debug(message, ...args);
    } catch (error) {
      console.error("Error in SafeLogger.debug:", error);
    }
  },
  
  trace: (message: string, ...args: any[]) => {
    try {
      console.trace(message, ...args);
    } catch (error) {
      console.error("Error in SafeLogger.trace:", error);
    }
  },
  
  sanitizeData: (data: any): any => {
    try {
      return BaseLoggerUtils.sanitizeData(data);
    } catch (error) {
      console.error("Error in sanitizeData:", error);
      return { sanitizationError: true };
    }
  }
};
