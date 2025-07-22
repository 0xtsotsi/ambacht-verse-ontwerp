/**
 * Response Helpers for Wesley's Ambacht API
 * 
 * Extends Express Response with consistent API response formats
 * Integrates with existing logging and error handling systems
 */

import { Response } from 'express';
import { 
  WesleyResponse, 
  APIResponse, 
  APIError, 
  ValidationError, 
  ResponseMeta, 
  HttpStatus, 
  ErrorCodes 
} from './types';
import { SafeLogger } from '@/lib/LoggerUtils';
import { serverConfig } from './config';

/**
 * Create standardized response metadata
 */
function createResponseMeta(
  requestId: string,
  processingTime?: number,
  warnings?: string[]
): ResponseMeta {
  return {
    requestId,
    timestamp: new Date().toISOString(),
    version: serverConfig.currentVersion,
    processingTime: processingTime || 0,
    warnings: warnings?.length ? warnings : undefined,
  };
}

/**
 * Create standardized error object
 */
function createAPIError(
  code: string,
  message: string,
  requestId: string,
  details?: Record<string, any>,
  field?: string
): APIError {
  return {
    code,
    message,
    details,
    field,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

/**
 * Extended Response class with Wesley's Ambacht specific methods
 */
export class WesleyResponseImpl {
  constructor(private res: Response, private requestId: string, private startTime: number) {}

  /**
   * Send success response with data
   */
  success<T>(data: T, message?: string, warnings?: string[]): Response {
    const processingTime = Date.now() - this.startTime;
    
    const response: APIResponse<T> = {
      success: true,
      data,
      message,
      meta: createResponseMeta(this.requestId, processingTime, warnings),
    };

    // Log success response
    SafeLogger.info('API Success Response', {
      requestId: this.requestId,
      processingTime,
      dataType: typeof data,
      hasMessage: !!message,
      warningCount: warnings?.length || 0,
    });

    return this.res.status(HttpStatus.OK).json(response);
  }

  /**
   * Send created response (201)
   */
  created<T>(data: T, message?: string): Response {
    const processingTime = Date.now() - this.startTime;
    
    const response: APIResponse<T> = {
      success: true,
      data,
      message: message || 'Resource created successfully',
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.info('API Created Response', {
      requestId: this.requestId,
      processingTime,
      dataType: typeof data,
    });

    return this.res.status(HttpStatus.CREATED).json(response);
  }

  /**
   * Send no content response (204)
   */
  noContent(): Response {
    const processingTime = Date.now() - this.startTime;
    
    SafeLogger.info('API No Content Response', {
      requestId: this.requestId,
      processingTime,
    });

    return this.res.status(HttpStatus.NO_CONTENT).send();
  }

  /**
   * Send validation error response (400)
   */
  validationError(errors: ValidationError[], message?: string): Response {
    const processingTime = Date.now() - this.startTime;
    
    const response: APIResponse = {
      success: false,
      message: message || 'Validatiefout: Controleer de ingevoerde gegevens',
      error: createAPIError(
        ErrorCodes.VALIDATION_ERROR,
        message || 'Validation failed',
        this.requestId,
        { errors }
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.warn('API Validation Error', {
      requestId: this.requestId,
      processingTime,
      errorCount: errors.length,
      fields: errors.map(e => e.field),
    });

    return this.res.status(HttpStatus.BAD_REQUEST).json(response);
  }

  /**
   * Send unauthorized error response (401)
   */
  unauthorizedError(message?: string): Response {
    const processingTime = Date.now() - this.startTime;
    const defaultMessage = 'Ongeautoriseerd: Geldige authenticatie vereist';
    
    const response: APIResponse = {
      success: false,
      message: message || defaultMessage,
      error: createAPIError(
        ErrorCodes.UNAUTHORIZED,
        message || 'Unauthorized access',
        this.requestId
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.warn('API Unauthorized Access', {
      requestId: this.requestId,
      processingTime,
      customMessage: !!message,
    });

    this.res.setHeader('WWW-Authenticate', 'Bearer realm="Wesley\'s Ambacht API"');
    return this.res.status(HttpStatus.UNAUTHORIZED).json(response);
  }

  /**
   * Send forbidden error response (403)
   */
  forbiddenError(message?: string): Response {
    const processingTime = Date.now() - this.startTime;
    const defaultMessage = 'Verboden: Onvoldoende rechten voor deze actie';
    
    const response: APIResponse = {
      success: false,
      message: message || defaultMessage,
      error: createAPIError(
        ErrorCodes.FORBIDDEN,
        message || 'Access forbidden',
        this.requestId
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.warn('API Forbidden Access', {
      requestId: this.requestId,
      processingTime,
      customMessage: !!message,
    });

    return this.res.status(HttpStatus.FORBIDDEN).json(response);
  }

  /**
   * Send not found error response (404)
   */
  notFoundError(resource?: string): Response {
    const processingTime = Date.now() - this.startTime;
    const defaultMessage = 'Niet gevonden: Het gevraagde item bestaat niet';
    const message = resource 
      ? `${resource} niet gevonden` 
      : defaultMessage;
    
    const response: APIResponse = {
      success: false,
      message,
      error: createAPIError(
        ErrorCodes.NOT_FOUND,
        message,
        this.requestId,
        { resource }
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.info('API Not Found', {
      requestId: this.requestId,
      processingTime,
      resource: resource || 'unknown',
    });

    return this.res.status(HttpStatus.NOT_FOUND).json(response);
  }

  /**
   * Send conflict error response (409)
   */
  conflictError(message?: string): Response {
    const processingTime = Date.now() - this.startTime;
    const defaultMessage = 'Conflict: De actie kan niet worden voltooid vanwege een conflict';
    
    const response: APIResponse = {
      success: false,
      message: message || defaultMessage,
      error: createAPIError(
        ErrorCodes.CONFLICT,
        message || 'Resource conflict',
        this.requestId
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.warn('API Conflict Error', {
      requestId: this.requestId,
      processingTime,
      customMessage: !!message,
    });

    return this.res.status(HttpStatus.CONFLICT).json(response);
  }

  /**
   * Send rate limit error response (429)
   */
  rateLimitError(resetTime: Date, message?: string): Response {
    const processingTime = Date.now() - this.startTime;
    const defaultMessage = 'Te veel verzoeken: U heeft de limiet bereikt. Probeer het later opnieuw.';
    const retryAfterSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
    
    const response: APIResponse = {
      success: false,
      message: message || defaultMessage,
      error: createAPIError(
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        message || 'Rate limit exceeded',
        this.requestId,
        { 
          resetTime: resetTime.toISOString(),
          retryAfterSeconds 
        }
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.warn('API Rate Limit Exceeded', {
      requestId: this.requestId,
      processingTime,
      retryAfterSeconds,
    });

    this.res.setHeader('Retry-After', retryAfterSeconds.toString());
    this.res.setHeader('X-RateLimit-Reset', Math.floor(resetTime.getTime() / 1000).toString());
    
    return this.res.status(HttpStatus.TOO_MANY_REQUESTS).json(response);
  }

  /**
   * Send internal server error response (500)
   */
  internalError(message?: string, errorId?: string): Response {
    const processingTime = Date.now() - this.startTime;
    const defaultMessage = 'Interne serverfout: Er is een onverwachte fout opgetreden';
    
    const response: APIResponse = {
      success: false,
      message: message || defaultMessage,
      error: createAPIError(
        ErrorCodes.INTERNAL_ERROR,
        message || 'Internal server error',
        this.requestId,
        errorId ? { errorId } : undefined
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.error('API Internal Server Error', {
      requestId: this.requestId,
      processingTime,
      errorId: errorId || 'none',
      customMessage: !!message,
    });

    return this.res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
  }

  /**
   * Send business logic error response (422)
   */
  businessError(code: string, message: string, details?: Record<string, any>): Response {
    const processingTime = Date.now() - this.startTime;
    
    const response: APIResponse = {
      success: false,
      message,
      error: createAPIError(
        code,
        message,
        this.requestId,
        details
      ),
      meta: createResponseMeta(this.requestId, processingTime),
    };

    SafeLogger.warn('API Business Logic Error', {
      requestId: this.requestId,
      processingTime,
      errorCode: code,
      hasDetails: !!details,
    });

    return this.res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
  }

  /**
   * Send paginated response
   */
  paginated<T>(
    data: T[], 
    page: number, 
    limit: number, 
    total: number,
    message?: string,
    warnings?: string[]
  ): Response {
    const processingTime = Date.now() - this.startTime;
    const totalPages = Math.ceil(total / limit);
    
    const response: APIResponse<T[]> = {
      success: true,
      data,
      message,
      meta: {
        ...createResponseMeta(this.requestId, processingTime, warnings),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };

    SafeLogger.info('API Paginated Response', {
      requestId: this.requestId,
      processingTime,
      page,
      limit,
      total,
      totalPages,
      itemCount: data.length,
    });

    return this.res.status(HttpStatus.OK).json(response);
  }

  /**
   * Send health check response
   */
  health(status: 'healthy' | 'unhealthy' | 'degraded', data?: any): Response {
    const processingTime = Date.now() - this.startTime;
    const httpStatus = status === 'healthy' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    
    const response = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: serverConfig.currentVersion,
      requestId: this.requestId,
      processingTime,
      ...data,
    };

    // Don't log healthy responses to avoid spam
    if (status !== 'healthy') {
      SafeLogger.warn('API Health Check Issue', {
        requestId: this.requestId,
        status,
        processingTime,
      });
    }

    return this.res.status(httpStatus).json(response);
  }
}

/**
 * Extend Express Response prototype with Wesley's Ambacht methods
 */
export function extendResponse(res: Response, requestId: string, startTime: number): WesleyResponse {
  const wesley = new WesleyResponseImpl(res, requestId, startTime);
  
  // Attach methods to response object
  (res as WesleyResponse).success = wesley.success.bind(wesley);
  (res as WesleyResponse).created = wesley.created.bind(wesley);
  (res as WesleyResponse).noContent = wesley.noContent.bind(wesley);
  (res as WesleyResponse).validationError = wesley.validationError.bind(wesley);
  (res as WesleyResponse).unauthorizedError = wesley.unauthorizedError.bind(wesley);
  (res as WesleyResponse).forbiddenError = wesley.forbiddenError.bind(wesley);
  (res as WesleyResponse).notFoundError = wesley.notFoundError.bind(wesley);
  (res as WesleyResponse).conflictError = wesley.conflictError.bind(wesley);
  (res as WesleyResponse).rateLimitError = wesley.rateLimitError.bind(wesley);
  (res as WesleyResponse).internalError = wesley.internalError.bind(wesley);

  // Set request ID and metrics
  (res as WesleyResponse).requestId = requestId;
  (res as WesleyResponse).metrics = {
    processingTime: 0,
    dbQueries: 0,
    cacheHits: 0,
  };

  return res as WesleyResponse;
}

/**
 * Utility functions for creating responses outside of middleware context
 */
export const ResponseHelpers = {
  createSuccessResponse<T>(data: T, requestId: string, message?: string): APIResponse<T> {
    return {
      success: true,
      data,
      message,
      meta: createResponseMeta(requestId),
    };
  },

  createErrorResponse(
    code: string, 
    message: string, 
    requestId: string, 
    details?: Record<string, any>
  ): APIResponse {
    return {
      success: false,
      message,
      error: createAPIError(code, message, requestId, details),
      meta: createResponseMeta(requestId),
    };
  },

  createValidationResponse(errors: ValidationError[], requestId: string): APIResponse {
    return {
      success: false,
      message: 'Validatiefout: Controleer de ingevoerde gegevens',
      error: createAPIError(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        requestId,
        { errors }
      ),
      meta: createResponseMeta(requestId),
    };
  },
};