/**
 * Custom hooks for comprehensive component state & lifecycle tracking
 * Provides logging for mount/unmount, state changes, re-renders, and performance
 * 
 * V5 Interactive Elegance Integration:
 * - Optimized for animation performance monitoring
 * - Real-time render tracking for smooth 60fps animations
 * - Memory usage monitoring for complex interactive components
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { ComponentLogger } from '@/lib/logger';

// Type definitions for logging hooks
interface UseLifecycleLoggerOptions {
  componentName: string;
  props?: Record<string, unknown>;
  enablePropLogging?: boolean;
}

interface UseStateLoggerOptions<T> {
  componentName: string;
  stateName: string;
  trigger?: string;
}

interface UseRenderLoggerOptions {
  componentName: string;
  dependencies?: unknown[];
  threshold?: number; // milliseconds for slow render detection
}

interface UsePerformanceLoggerOptions {
  componentName: string;
  slowRenderThreshold?: number; // milliseconds
  enableMemoryTracking?: boolean;
}

interface PerformanceMetrics {
  renderTime: number;
  isSlowRender: boolean;
  memoryUsage?: number;
  timestamp: string;
}

/**
 * Hook to track component lifecycle events (mount/unmount/updates)
 * Logs when components are created, destroyed, and when props change
 */
export function useLifecycleLogger({
  componentName,
  props,
  enablePropLogging = false
}: UseLifecycleLoggerOptions) {
  const previousPropsRef = useRef<Record<string, unknown>>();
  const mountedRef = useRef(false);

  // Track component mount
  useEffect(() => {
    try {
      ComponentLogger.lifecycle(componentName, 'mount', enablePropLogging ? props : undefined);
      mountedRef.current = true;

      // Cleanup function for unmount
      return () => {
        ComponentLogger.lifecycle(componentName, 'unmount');
        mountedRef.current = false;
      };
    } catch (error) {
      console.error(`Lifecycle logging error for ${componentName}:`, error);
    }
  }, [componentName, enablePropLogging, props]); // Mount/unmount with proper dependencies

  // Track prop changes
  useEffect(() => {
    try {
      if (mountedRef.current && props && enablePropLogging) {
        const prevProps = previousPropsRef.current;
        if (prevProps) {
          const changedProps = Object.keys(props).filter(
            key => props[key] !== prevProps[key]
          );
          
          if (changedProps.length > 0) {
            ComponentLogger.lifecycle(componentName, 'update', {
              changedProps,
              previousProps: prevProps,
              newProps: props
            });
          }
        }
        previousPropsRef.current = { ...props };
      }
    } catch (error) {
      console.error(`Props logging error for ${componentName}:`, error);
    }
  }, [props, componentName, enablePropLogging]);

  return {
    isComponentMounted: mountedRef.current
  };
}

/**
 * Hook to track state changes with previous/new values
 * Logs every state transition with detailed information
 */
export function useStateLogger<T>({
  componentName,
  stateName,
  trigger = 'state_update'
}: UseStateLoggerOptions<T>) {
  const previousStateRef = useRef<T>();

  const logStateChange = useCallback((newState: T, customTrigger?: string) => {
    try {
      const prevState = previousStateRef.current;
      const actualTrigger = customTrigger || trigger;

      ComponentLogger.stateChange(
        componentName,
        prevState,
        newState,
        `${stateName}: ${actualTrigger}`
      );

      previousStateRef.current = newState;
    } catch (error) {
      console.error(`State logging error for ${componentName}.${stateName}:`, error);
    }
  }, [componentName, stateName, trigger]);

  return {
    logStateChange,
    getPreviousState: () => previousStateRef.current
  };
}

/**
 * Hook to track component re-renders with dependency analysis
 * Identifies what caused re-renders and tracks render frequency
 */
export function useRenderLogger({
  componentName,
  dependencies = [],
  threshold = 100
}: UseRenderLoggerOptions) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());
  const previousDepsRef = useRef<unknown[]>(dependencies);

  // Track render count and frequency
  const renderInfo = useMemo(() => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    renderCountRef.current += 1;

    try {
      // Identify changed dependencies
      const changedDeps = dependencies
        .map((dep, index) => ({ index, current: dep, previous: previousDepsRef.current[index] }))
        .filter(({ current, previous }) => current !== previous)
        .map(({ index }) => `dep[${index}]`);

      const reason = changedDeps.length > 0 
        ? `Dependencies changed: ${changedDeps.join(', ')}`
        : 'Forced re-render or initial render';

      // Log if render is frequent (less than threshold ms since last render)
      if (renderCountRef.current > 1 && timeSinceLastRender < threshold) {
        ComponentLogger.rerender(componentName, `${reason} (frequent render)`, changedDeps);
      } else if (renderCountRef.current > 1) {
        ComponentLogger.rerender(componentName, reason, changedDeps);
      }

      previousDepsRef.current = [...dependencies];
      lastRenderTimeRef.current = now;

      return {
        renderCount: renderCountRef.current,
        timeSinceLastRender,
        changedDependencies: changedDeps
      };
    } catch (error) {
      console.error(`Render logging error for ${componentName}:`, error);
      return {
        renderCount: renderCountRef.current,
        timeSinceLastRender,
        changedDependencies: []
      };
    }
  }, [dependencies, componentName, threshold]);

  return renderInfo;
}

/**
 * Hook to track component performance metrics
 * Measures render times and identifies slow renders
 */
export function usePerformanceLogger({
  componentName,
  slowRenderThreshold = 16, // 16ms = 60fps threshold
  enableMemoryTracking = false
}: UsePerformanceLoggerOptions) {
  const renderStartTimeRef = useRef<number>();
  const performanceDataRef = useRef<PerformanceMetrics[]>([]);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    renderStartTimeRef.current = performance.now();
  }, []);

  // End performance measurement and log results
  const endMeasurement = useCallback(() => {
    try {
      if (renderStartTimeRef.current) {
        const renderTime = performance.now() - renderStartTimeRef.current;
        const isSlowRender = renderTime > slowRenderThreshold;
        
        let memoryUsage: number | undefined;
        if (enableMemoryTracking && 'memory' in performance) {
          memoryUsage = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
        }

        const metrics: PerformanceMetrics = {
          renderTime,
          isSlowRender,
          memoryUsage,
          timestamp: new Date().toISOString()
        };

        // Store metrics for analysis
        performanceDataRef.current.push(metrics);
        
        // Keep only last 100 measurements to prevent memory leaks
        if (performanceDataRef.current.length > 100) {
          performanceDataRef.current = performanceDataRef.current.slice(-100);
        }

        ComponentLogger.performance(componentName, renderTime, isSlowRender);
        
        renderStartTimeRef.current = undefined;
        return metrics;
      }
    } catch (error) {
      console.error(`Performance logging error for ${componentName}:`, error);
    }
    return null;
  }, [componentName, slowRenderThreshold, enableMemoryTracking]);

  // Get performance statistics
  const getPerformanceStats = useCallback(() => {
    const data = performanceDataRef.current;
    if (data.length === 0) return null;

    const renderTimes = data.map(d => d.renderTime);
    const slowRenders = data.filter(d => d.isSlowRender).length;

    return {
      totalRenders: data.length,
      averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
      maxRenderTime: Math.max(...renderTimes),
      minRenderTime: Math.min(...renderTimes),
      slowRenderCount: slowRenders,
      slowRenderPercentage: (slowRenders / data.length) * 100
    };
  }, []);

  // Auto-start measurement on every render
  useEffect(() => {
    startMeasurement();
    return endMeasurement;
  });

  return {
    startMeasurement,
    endMeasurement,
    getPerformanceStats,
    performanceHistory: performanceDataRef.current
  };
}

// Utility hook that combines all logging functionality
export function useComponentTracking(componentName: string, options: {
  enableLifecycleLogging?: boolean;
  enableStateLogging?: boolean;
  enableRenderLogging?: boolean;
  enablePerformanceLogging?: boolean;
  props?: Record<string, unknown>;
  dependencies?: unknown[];
} = {}) {
  const {
    enableLifecycleLogging = true,
    enableStateLogging = true,
    enableRenderLogging = true,
    enablePerformanceLogging = true,
    props,
    dependencies = []
  } = options;

  // Always call hooks, but conditionally enable their functionality
  const lifecycle = useLifecycleLogger({ 
    componentName, 
    props, 
    enablePropLogging: enableLifecycleLogging 
  });

  const renderInfo = useRenderLogger({ 
    componentName, 
    dependencies: enableRenderLogging ? dependencies : [] 
  });

  const performance = usePerformanceLogger({ 
    componentName, 
    enableMemoryTracking: enablePerformanceLogging 
  });

  return {
    lifecycle: enableLifecycleLogging ? lifecycle : null,
    renderInfo: enableRenderLogging ? renderInfo : null,
    performance: enablePerformanceLogging ? performance : null,
    // Removed createStateLogger to avoid hook-in-callback issue
    // Users should call useStateLogger directly when needed
  };
}