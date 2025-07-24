/**
 * Server Type Definitions for Wesley's Ambacht API
 * 
 * Provides comprehensive TypeScript types for the Express.js server implementation
 * Integrates with existing Supabase database types and security middleware
 */

import { Request, Response, NextFunction } from 'express';
import { Database } from '../integrations/supabase/types';
import { SecurityContext } from '../middleware/securityIntegration';

// Re-export database types for server use
export type { Database };
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

/**
 * Extended Express Request with Wesley's Ambacht specific properties
 */
export interface WesleyRequest extends Request {
  // Security context from middleware
  securityContext?: SecurityContext;
  
  // Request metadata
  requestId: string;
  startTime: number;
  
  // API versioning
  apiVersion?: string;
  apiVersionMethod?: string;
  apiVersionWarnings?: string[];
  
  // Rate limiting
  rateLimitInfo?: {
    remaining: number;
    resetTime: Date;
    limit: number;
  };
  
  // User authentication
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'admin' | 'staff';
    permissions: string[];
  };
  
  // Client information
  clientInfo?: {
    ip: string;
    userAgent: string;
    location?: string;
    device?: string;
  };
  
  // Performance tracking
  performance?: {
    startTime: number;
    dbQueries: number;
    cacheHits: number;
    cacheMisses: number;
  };
}

/**
 * Extended Express Response with Wesley's Ambacht specific properties
 */
export interface WesleyResponse extends Response {
  // Request tracking
  requestId?: string;
  
  // Performance metrics
  metrics?: {
    processingTime: number;
    dbQueries: number;
    cacheHits: number;
  };
  
  // Success response helpers
  success<T>(data: T, message?: string): WesleyResponse;
  
  // Error response helpers
  validationError(errors: ValidationError[]): WesleyResponse;
  unauthorizedError(message?: string): WesleyResponse;
  forbiddenError(message?: string): WesleyResponse;
  notFoundError(resource?: string): WesleyResponse;
  conflictError(message?: string): WesleyResponse;
  internalError(message?: string, errorId?: string): WesleyResponse;
  
  // Rate limiting response
  rateLimitError(resetTime: Date, message?: string): WesleyResponse;
}

/**
 * Middleware function type with Wesley's Ambacht specific interfaces
 */
export type WesleyMiddleware = (
  req: WesleyRequest,
  res: WesleyResponse,
  next: NextFunction
) => Promise<void> | void;

/**
 * Route handler type with Wesley's Ambacht specific interfaces
 */
export type WesleyRouteHandler = (
  req: WesleyRequest,
  res: WesleyResponse,
  next?: NextFunction
) => Promise<void> | void;

/**
 * API Response structure
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: APIError;
  meta?: ResponseMeta;
}

/**
 * API Error structure
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Validation Error structure
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  code: string;
}

/**
 * Response metadata
 */
export interface ResponseMeta {
  requestId: string;
  timestamp: string;
  version: string;
  processingTime: number;
  pagination?: PaginationMeta;
  warnings?: string[];
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Server configuration
 */
export interface ServerConfig {
  // Server basics
  port: number;
  host: string;
  environment: 'development' | 'production' | 'test';
  
  // Security
  enableSecurity: boolean;
  enableRateLimiting: boolean;
  enableCORS: boolean;
  corsOrigin: string | string[];
  
  // Database
  database: {
    url: string;
    poolSize: number;
    timeout: number;
  };
  
  // Logging
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    enableConsole: boolean;
    enableFile: boolean;
    filePath?: string;
  };
  
  // Performance
  enableCompression: boolean;
  enableCaching: boolean;
  requestTimeout: number;
  
  // Monitoring
  enableHealthChecks: boolean;
  enableMetrics: boolean;
  metricsEndpoint: string;
  
  // API versioning
  enableVersioning: boolean;
  currentVersion: string;
  supportedVersions: string[];
}

/**
 * Route configuration
 */
export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: WesleyRouteHandler;
  middleware?: WesleyMiddleware[];
  
  // Security
  requireAuth?: boolean;
  requiredRole?: 'customer' | 'admin' | 'staff';
  requiredPermissions?: string[];
  
  // Rate limiting
  rateLimit?: {
    windowMs: number;
    max: number;
    message?: string;
  };
  
  // Validation
  validation?: {
    body?: any; // Zod schema
    query?: any; // Zod schema
    params?: any; // Zod schema
  };
  
  // Documentation
  description?: string;
  tags?: string[];
}

/**
 * Health check result
 */
export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: string;
  responseTime?: number;
  details?: Record<string, any>;
}

/**
 * System health status
 */
export interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  services: HealthCheck[];
  system: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
    };
    disk: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

/**
 * Metrics data structure
 */
export interface ServerMetrics {
  requests: {
    total: number;
    success: number;
    error: number;
    rate: number; // requests per second
  };
  
  response: {
    averageTime: number;
    p50: number;
    p90: number;
    p99: number;
  };
  
  errors: {
    total: number;
    rate: number;
    byCode: Record<string, number>;
  };
  
  database: {
    connections: number;
    queries: number;
    slowQueries: number;
    averageQueryTime: number;
  };
  
  memory: {
    used: number;
    total: number;
    heapUsed: number;
    heapTotal: number;
  };
  
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
}

/**
 * Environment variables interface
 */
export interface EnvironmentVariables {
  // Server
  PORT: string;
  HOST: string;
  NODE_ENV: string;
  
  // Database
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  
  // Security
  JWT_SECRET: string;
  API_KEY_SECRET: string;
  CORS_ORIGIN: string;
  
  // External services
  SENDGRID_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  
  // Monitoring
  SENTRY_DSN?: string;
  LOG_LEVEL: string;
}

/**
 * Error types for consistent error handling
 */
export enum ErrorCodes {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Authentication/Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Business logic errors
  BOOKING_UNAVAILABLE = 'BOOKING_UNAVAILABLE',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
}

/**
 * HTTP Status codes for consistent responses
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}