/**
 * TanStack Query integration with comprehensive API logging
 * Tracks query success/error/loading states, cache hits/misses, and performance
 */

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { APILogger, LoggerUtils } from '@/lib/logger';
import { ApiPerformanceMonitor } from '@/lib/apiLogger';

interface UseApiLoggerQueryOptions<TData, TError = Error> {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  endpoint: string;
  method?: string;
}

interface UseApiLoggerMutationOptions<TData, TVariables, TError = Error> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  endpoint: string;
  method?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
}

/**
 * Enhanced useQuery with comprehensive logging
 */
export function useApiLoggerQuery<TData, TError = Error>(
  options: UseApiLoggerQueryOptions<TData, TError>
) {
  const queryClient = useQueryClient();
  const requestId = LoggerUtils.generateRequestId();
  const { endpoint, method = 'GET', queryKey, queryFn, ...queryOptions } = options;
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const startTime = Date.now();
      
      // Check if data is in cache
      const cachedData = queryClient.getQueryData(queryKey);
      const isCacheHit = cachedData !== undefined;
      
      // Log query start
      APILogger.request(endpoint, method, { queryKey, isCacheHit }, requestId);
      
      try {
        const data = await queryFn();
        const responseTime = Date.now() - startTime;
        
        // Record performance metrics
        ApiPerformanceMonitor.recordResponseTime(endpoint, responseTime);
        
        // Log successful response
        APILogger.response(
          endpoint,
          200,
          responseTime,
          requestId,
          { dataSize: JSON.stringify(data).length, isCacheHit }
        );
        
        return data;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const apiError = error as Error;
        
        // Log error
        APILogger.error(endpoint, apiError, 0, requestId);
        APILogger.response(endpoint, 500, responseTime, requestId);
        
        throw error;
      }
    },
    ...queryOptions,
    meta: {
      endpoint,
      method,
      requestId,
      ...queryOptions.meta
    }
  });
}

/**
 * Enhanced useMutation with comprehensive logging
 */
export function useApiLoggerMutation<TData, TVariables, TError = Error>(
  options: UseApiLoggerMutationOptions<TData, TVariables, TError>
) {
  const { endpoint, method = 'POST', mutationFn, onSuccess, onError } = options;
  
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const requestId = LoggerUtils.generateRequestId();
      const startTime = Date.now();
      const sanitizedVariables = LoggerUtils.sanitizeData(variables);
      
      // Log mutation start
      APILogger.request(endpoint, method, sanitizedVariables, requestId);
      
      try {
        const data = await mutationFn(variables);
        const responseTime = Date.now() - startTime;
        
        // Record performance metrics
        ApiPerformanceMonitor.recordResponseTime(endpoint, responseTime);
        
        // Log successful response
        APILogger.response(
          endpoint,
          200,
          responseTime,
          requestId,
          { dataSize: JSON.stringify(data).length }
        );
        
        return data;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const apiError = error as Error;
        
        // Log error
        APILogger.error(endpoint, apiError, 0, requestId);
        APILogger.response(endpoint, 500, responseTime, requestId);
        
        throw error;
      }
    },
    onSuccess: (data, variables, context) => {
      // Log successful mutation completion
      APILogger.request(
        `${endpoint}/success`,
        'POST',
        { operation: 'mutation_success' },
        LoggerUtils.generateRequestId()
      );
      
      onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      // Log mutation error completion
      APILogger.error(
        `${endpoint}/error`,
        error as Error,
        0,
        LoggerUtils.generateRequestId()
      );
      
      onError?.(error, variables);
    },
    meta: {
      endpoint,
      method
    }
  });
}

/**
 * Hook to track query cache performance
 */
export function useQueryCacheLogger() {
  const queryClient = useQueryClient();
  
  const logCacheStats = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const stats = {
      totalQueries: queries.length,
      staleQueries: queries.filter(q => q.isStale()).length,
      fetchingQueries: queries.filter(q => q.isFetching()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      cacheSize: queries.reduce((size, query) => {
        return size + (query.state.data ? JSON.stringify(query.state.data).length : 0);
      }, 0)
    };
    
    APILogger.request(
      'cache/stats',
      'GET',
      stats,
      LoggerUtils.generateRequestId()
    );
    
    return stats;
  };
  
  const logQueryDetails = (queryKey: QueryKey) => {
    const query = queryClient.getQueryState(queryKey);
    
    if (query) {
      APILogger.request(
        'cache/query-details',
        'GET',
        {
          queryKey,
          status: query.status,
          dataUpdatedAt: query.dataUpdatedAt,
          errorUpdatedAt: query.errorUpdatedAt,
          fetchStatus: query.fetchStatus,
          isStale: Date.now() - query.dataUpdatedAt > (query as { staleTime?: number }).staleTime || 0
        },
        LoggerUtils.generateRequestId()
      );
    }
  };
  
  return {
    logCacheStats,
    logQueryDetails
  };
}

/**
 * Hook to monitor API performance metrics
 */
export function useApiPerformanceLogger() {
  const getPerformanceReport = () => {
    const slowEndpoints = ApiPerformanceMonitor.getSlowEndpoints(2000);
    
    const report = {
      slowEndpoints,
      averageResponseTimes: slowEndpoints.reduce((acc, endpoint) => {
        acc[endpoint] = ApiPerformanceMonitor.getAverageResponseTime(endpoint);
        return acc;
      }, {} as Record<string, number>)
    };
    
    APILogger.request(
      'performance/report',
      'GET',
      report,
      LoggerUtils.generateRequestId()
    );
    
    return report;
  };
  
  const logSlowQuery = (endpoint: string, responseTime: number, threshold: number = 2000) => {
    if (responseTime > threshold) {
      APILogger.request(
        'performance/slow-query',
        'POST',
        { endpoint, responseTime, threshold },
        LoggerUtils.generateRequestId()
      );
    }
  };
  
  return {
    getPerformanceReport,
    logSlowQuery
  };
}

/**
 * Hook for comprehensive API monitoring dashboard data
 */
export function useApiMonitoring() {
  const cacheLogger = useQueryCacheLogger();
  const performanceLogger = useApiPerformanceLogger();
  
  const generateMonitoringReport = () => {
    const cacheStats = cacheLogger.logCacheStats();
    const performanceReport = performanceLogger.getPerformanceReport();
    
    const fullReport = {
      timestamp: new Date().toISOString(),
      cache: cacheStats,
      performance: performanceReport,
      summary: {
        totalApiCalls: cacheStats.totalQueries,
        errorRate: cacheStats.errorQueries / cacheStats.totalQueries,
        averageResponseTime: Object.values(performanceReport.averageResponseTimes)
          .reduce((sum, time) => sum + time, 0) / Object.keys(performanceReport.averageResponseTimes).length || 0
      }
    };
    
    APILogger.request(
      'monitoring/full-report',
      'GET',
      fullReport,
      LoggerUtils.generateRequestId()
    );
    
    return fullReport;
  };
  
  return {
    generateMonitoringReport,
    cacheLogger,
    performanceLogger
  };
}