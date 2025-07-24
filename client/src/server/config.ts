/**
 * Server Configuration for Wesley's Ambacht API
 * 
 * Centralized configuration management with environment-based settings
 * Integrates with existing security middleware and logging systems
 */

import dotenv from 'dotenv';
import { ServerConfig, EnvironmentVariables } from './types';
import { SafeLogger } from '@/lib/LoggerUtils';

// Load environment variables
dotenv.config();

/**
 * Validate required environment variables
 */
function validateEnvironment(): EnvironmentVariables {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'JWT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return process.env as EnvironmentVariables;
}

/**
 * Get server configuration based on environment
 */
export function getServerConfig(): ServerConfig {
  const env = validateEnvironment();
  const isDevelopment = env.NODE_ENV === 'development';
  const isProduction = env.NODE_ENV === 'production';
  const isTest = env.NODE_ENV === 'test';

  const config: ServerConfig = {
    // Server basics
    port: parseInt(env.PORT || '3001'),
    host: env.HOST || (isDevelopment ? 'localhost' : '0.0.0.0'),
    environment: (env.NODE_ENV as 'development' | 'production' | 'test') || 'development',

    // Security configuration
    enableSecurity: true,
    enableRateLimiting: !isTest, // Disable for testing
    enableCORS: true,
    corsOrigin: env.CORS_ORIGIN?.split(',') || [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative dev port
      'https://wesleysambacht.nl', // Production frontend
      'https://www.wesleysambacht.nl', // Production with www
      ...(isDevelopment ? ['http://localhost:8080'] : []) // Additional dev origins
    ],

    // Database configuration
    database: {
      url: env.VITE_SUPABASE_URL,
      poolSize: parseInt(env.DB_POOL_SIZE || '10'),
      timeout: parseInt(env.DB_TIMEOUT || '30000'),
    },

    // Logging configuration
    logging: {
      level: (env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || (isDevelopment ? 'debug' : 'info'),
      enableConsole: true,
      enableFile: isProduction,
      filePath: env.LOG_FILE_PATH || './logs/server.log',
    },

    // Performance settings
    enableCompression: !isDevelopment, // Disable compression in dev for faster builds
    enableCaching: !isDevelopment,
    requestTimeout: parseInt(env.REQUEST_TIMEOUT || '30000'),

    // Monitoring settings
    enableHealthChecks: true,
    enableMetrics: true,
    metricsEndpoint: '/metrics',

    // API versioning
    enableVersioning: true,
    currentVersion: 'v3',
    supportedVersions: ['v1', 'v2', 'v3'],
  };

  // Log configuration in development
  if (isDevelopment) {
    SafeLogger.info('Server configuration loaded', {
      port: config.port,
      host: config.host,
      environment: config.environment,
      corsOrigin: config.corsOrigin,
      enableSecurity: config.enableSecurity,
      enableRateLimiting: config.enableRateLimiting,
    });
  }

  return config;
}

/**
 * Security configuration for different environments
 */
export function getSecurityConfig() {
  const env = validateEnvironment();
  const isDevelopment = env.NODE_ENV === 'development';

  return {
    enableRateLimiting: !isDevelopment,
    enableSecurityHeaders: true,
    enableInputValidation: true,
    enableAPIKeyAuth: false, // Optional for public endpoints
    enableSecurityMonitoring: true,
    requireAPIKey: false,
    logAllRequests: true,
    blockMaliciousRequests: true,
    ddosProtection: !isDevelopment,

    // Rate limiting configuration
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: isDevelopment ? 1000 : 100, // More requests in dev
      message: {
        error: 'Te veel verzoeken',
        message: 'U heeft te veel verzoeken gedaan. Probeer het over een paar minuten opnieuw.',
        retryAfter: 900 // 15 minutes in seconds
      }
    },

    // CORS configuration
    cors: {
      origin: env.CORS_ORIGIN?.split(',') || [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://wesleysambacht.nl',
        'https://www.wesleysambacht.nl'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
        'X-Request-ID'
      ],
      exposedHeaders: [
        'X-Request-ID',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset'
      ]
    },

    // Helmet security headers configuration
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", env.VITE_SUPABASE_URL],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    }
  };
}

/**
 * Database connection configuration
 */
export function getDatabaseConfig() {
  const env = validateEnvironment();
  
  return {
    url: env.VITE_SUPABASE_URL,
    anonKey: env.VITE_SUPABASE_ANON_KEY,
    serviceKey: env.SUPABASE_SERVICE_KEY,
    options: {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // Server-side doesn't need persistent sessions
        detectSessionInUrl: false
      },
      realtime: {
        enabled: false // Disable realtime for server-side operations
      }
    }
  };
}

/**
 * Health check configuration
 */
export function getHealthCheckConfig() {
  const env = validateEnvironment();
  
  return {
    interval: parseInt(env.HEALTH_CHECK_INTERVAL || '60000'), // 1 minute
    timeout: parseInt(env.HEALTH_CHECK_TIMEOUT || '5000'), // 5 seconds
    retries: parseInt(env.HEALTH_CHECK_RETRIES || '3'),
    
    // Services to monitor
    services: [
      {
        name: 'database',
        type: 'supabase',
        url: env.VITE_SUPABASE_URL,
        timeout: 5000,
      },
      {
        name: 'external-api',
        type: 'http',
        url: 'https://api.external-service.com/health',
        timeout: 3000,
        optional: true, // Don't fail overall health if this fails
      }
    ]
  };
}

/**
 * Logging configuration with Winston
 */
export function getLoggingConfig() {
  const env = validateEnvironment();
  const isDevelopment = env.NODE_ENV === 'development';
  
  return {
    level: env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    format: isDevelopment ? 'simple' : 'json',
    
    transports: {
      console: {
        enabled: true,
        colorize: isDevelopment,
        timestamp: true,
      },
      
      file: {
        enabled: !isDevelopment,
        filename: env.LOG_FILE_PATH || './logs/server.log',
        maxSize: '10m',
        maxFiles: '14d',
        compress: true,
      },
      
      error: {
        enabled: true,
        filename: env.ERROR_LOG_PATH || './logs/error.log',
        level: 'error',
        maxSize: '10m',
        maxFiles: '30d',
      }
    },
    
    // Additional metadata to include in all logs
    defaultMeta: {
      service: 'wesley-ambacht-api',
      version: process.env.npm_package_version || '1.0.0',
      environment: env.NODE_ENV,
    }
  };
}

/**
 * Performance and optimization configuration
 */
export function getPerformanceConfig() {
  const env = validateEnvironment();
  const isDevelopment = env.NODE_ENV === 'development';
  
  return {
    // Compression settings
    compression: {
      enabled: !isDevelopment,
      level: 6, // Balanced compression level
      threshold: 1024, // Only compress responses > 1KB
    },
    
    // Request timeout settings
    timeout: {
      server: parseInt(env.SERVER_TIMEOUT || '30000'),
      database: parseInt(env.DB_TIMEOUT || '10000'),
      external: parseInt(env.EXTERNAL_TIMEOUT || '5000'),
    },
    
    // Cache settings
    cache: {
      enabled: !isDevelopment,
      ttl: parseInt(env.CACHE_TTL || '300'), // 5 minutes default
      maxKeys: parseInt(env.CACHE_MAX_KEYS || '1000'),
    },
    
    // Body parsing limits
    limits: {
      json: env.JSON_LIMIT || '1mb',
      urlencoded: env.URLENCODED_LIMIT || '1mb',
      raw: env.RAW_LIMIT || '1mb',
      text: env.TEXT_LIMIT || '1mb',
    }
  };
}

// Export singleton configuration instance
export const serverConfig = getServerConfig();
export const securityConfig = getSecurityConfig();
export const databaseConfig = getDatabaseConfig();
export const healthCheckConfig = getHealthCheckConfig();
export const loggingConfig = getLoggingConfig();
export const performanceConfig = getPerformanceConfig();