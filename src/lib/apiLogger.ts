/**
 * Comprehensive API logging utilities for Supabase calls with automatic logging,
 * error classification, retry mechanisms, and performance monitoring.
 */

import { APILogger, LoggerUtils } from './logger';

// Error classification types
export type ErrorType = 'network' | 'server' | 'validation' | 'authentication' | 'unknown';

export interface ApiCallMetrics {
  endpoint: string;
  method: string;
  requestId: string;
  startTime: number;
  responseTime?: number;
  status?: number;
  dataSize?: number;
  error?: Error;
  retryAttempt: number;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

// Default retry configuration with exponential backoff
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2
};

/**
 * Classifies errors based on type and status code
 */
export function classifyError(error: any, status?: number): ErrorType {
  if (status) {
    if (status === 401 || status === 403) return 'authentication';
    if (status >= 400 && status < 500) return 'validation';
    if (status >= 500) return 'server';
  }
  
  if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
    return 'network';
  }
  
  if (error?.message?.includes('timeout') || error?.message?.includes('fetch')) {
    return 'network';
  }
  
  return 'unknown';
}

/**
 * Calculates exponential backoff delay
 */
export function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Wrapper for Supabase calls with comprehensive logging and retry logic
 */
export async function withApiLogging<T>(
  operation: () => Promise<T>,
  endpoint: string,
  method: string = 'GET',
  payload?: any,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  const requestId = LoggerUtils.generateRequestId();
  const sanitizedPayload = LoggerUtils.sanitizeData(payload);
  
  const metrics: ApiCallMetrics = {
    endpoint,
    method,
    requestId,
    startTime: Date.now(),
    retryAttempt: 0
  };

  // Log initial request
  APILogger.request(endpoint, method, sanitizedPayload, requestId);

  for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
    metrics.retryAttempt = attempt;
    
    try {
      if (attempt > 1) {
        const delay = calculateBackoffDelay(attempt - 1, retryConfig);
        APILogger.retry(endpoint, attempt, retryConfig.maxAttempts, delay, requestId);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const result = await operation();
      
      // Calculate response metrics
      metrics.responseTime = Date.now() - metrics.startTime;
      metrics.status = 200; // Assume success if no error
      metrics.dataSize = result ? JSON.stringify(result).length : 0;
      
      // Log successful response
      APILogger.response(endpoint, 200, metrics.responseTime, requestId, result);
      
      return result;
    } catch (error) {
      const apiError = error as Error;
      metrics.error = apiError;
      metrics.responseTime = Date.now() - metrics.startTime;
      
      // Extract status from Supabase error if available
      const status = (error as any)?.status || (error as any)?.code || 500;
      metrics.status = status;
      
      const errorType = classifyError(apiError, status);
      
      // Log error with classification
      APILogger.error(endpoint, apiError, attempt, requestId);
      
      // Don't retry on authentication or validation errors
      if (errorType === 'authentication' || errorType === 'validation' || attempt === retryConfig.maxAttempts) {
        // Log final response with error status
        APILogger.response(endpoint, status, metrics.responseTime, requestId);
        throw apiError;
      }
    }
  }
  
  throw new Error('Max retry attempts exceeded');
}

/**
 * Wrapper specifically for Supabase queries with enhanced logging
 */
export async function withSupabaseLogging<T>(
  queryBuilder: any,
  endpoint: string,
  method: string = 'GET'
): Promise<T> {
  return withApiLogging(
    async () => {
      const { data, error } = await queryBuilder;
      if (error) throw error;
      return data;
    },
    endpoint,
    method
  );
}

/**
 * Wrapper for Supabase RPC calls with logging
 */
export async function withSupabaseRpcLogging<T>(
  rpcCall: () => Promise<{ data: T; error: any }>,
  rpcName: string,
  params?: any
): Promise<T> {
  return withApiLogging(
    async () => {
      const { data, error } = await rpcCall();
      if (error) throw error;
      return data;
    },
    `rpc/${rpcName}`,
    'POST',
    params
  );
}

/**
 * Enhanced error logging with full context
 */
export function logApiError(
  endpoint: string,
  error: Error,
  context: {
    method?: string;
    payload?: any;
    userId?: string;
    sessionId?: string;
    retryAttempt?: number;
  } = {}
) {
  const requestId = LoggerUtils.generateRequestId();
  const sanitizedPayload = LoggerUtils.sanitizeData(context.payload);
  
  APILogger.error(endpoint, error, context.retryAttempt || 0, requestId);
  
  // Additional context logging
  if (context.userId || context.sessionId) {
    APILogger.request(
      endpoint,
      context.method || 'UNKNOWN',
      {
        ...sanitizedPayload,
        userId: context.userId,
        sessionId: context.sessionId,
        context: 'error_logging'
      },
      requestId
    );
  }
}

/**
 * Performance monitoring utility
 */
export class ApiPerformanceMonitor {
  private static metrics = new Map<string, number[]>();
  
  static recordResponseTime(endpoint: string, responseTime: number) {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, []);
    }
    
    const times = this.metrics.get(endpoint)!;
    times.push(responseTime);
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }
  }
  
  static getAverageResponseTime(endpoint: string): number {
    const times = this.metrics.get(endpoint) || [];
    if (times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  static getSlowEndpoints(threshold: number = 2000): string[] {
    return Array.from(this.metrics.entries())
      .filter(([_, times]) => {
        const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
        return avg > threshold;
      })
      .map(([endpoint]) => endpoint);
  }
}