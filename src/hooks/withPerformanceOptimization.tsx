/**
 * Higher-order component for performance optimization and detailed logging
 * Wraps components with React.memo, performance monitoring, and comprehensive logging
 * 
 * V5 Interactive Elegance Performance Optimization:
 * - Automatic memoization with custom comparison
 * - Performance monitoring with 60fps threshold
 * - Comprehensive logging for development insights
 * - Memory leak prevention with proper cleanup
 */

import React, { ComponentType, memo, useCallback, useMemo } from 'react';
import { useComponentTracking } from './useComponentLogger';
import { useAnimationPerformance } from './useAnimationOptimization';

interface WithPerformanceOptimizationOptions {
  componentName: string;
  enablePropLogging?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableAnimationTracking?: boolean;
  customPropsComparison?: (prevProps: Record<string, unknown>, nextProps: Record<string, unknown>) => boolean;
  slowRenderThreshold?: number;
}

/**
 * Higher-order component that adds performance optimizations and logging
 * @param WrappedComponent - Component to wrap
 * @param options - Configuration options
 * @returns Optimized component with performance monitoring and logging
 */
export function withPerformanceOptimization<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPerformanceOptimizationOptions
) {
  const {
    componentName,
    enablePropLogging = true,
    enablePerformanceMonitoring = true,
    enableAnimationTracking = true,
    customPropsComparison,
    slowRenderThreshold = 16
  } = options;

  const OptimizedComponent = memo((props: P) => {
    // Component tracking for comprehensive logging
    const tracking = useComponentTracking(componentName, {
      enableLifecycleLogging: true,
      enableStateLogging: true,
      enableRenderLogging: true,
      enablePerformanceLogging: enablePerformanceMonitoring,
      props: enablePropLogging ? props : undefined,
      dependencies: Object.values(props)
    });

    // Animation performance monitoring (always call hook, conditionally enable)
    const animationPerformance = useAnimationPerformance(componentName);

    // Record animation frame if enabled
    const recordAnimationFrame = useCallback(() => {
      if (enableAnimationTracking && animationPerformance) {
        animationPerformance.recordFrame();
      }
    }, [animationPerformance]);

    // Create enhanced props with performance utilities
    const enhancedProps = useMemo(() => {
      const baseProps = props as P & { onAnimationFrame?: () => void; getPerformanceData?: () => unknown };
      
      if (enableAnimationTracking) {
        return {
          ...baseProps,
          onAnimationFrame: recordAnimationFrame,
          getPerformanceData: enableAnimationTracking ? animationPerformance?.getPerformanceData : undefined
        };
      }
      
      return baseProps;
    }, [props, recordAnimationFrame, animationPerformance]);

    // Log performance data periodically in development
    React.useEffect(() => {
      if (process.env.NODE_ENV === 'development' && enablePerformanceMonitoring) {
        const interval = setInterval(() => {
          const performanceStats = tracking.performance?.getPerformanceStats();
          const animationStats = enableAnimationTracking ? animationPerformance?.getPerformanceData() : null;
          
          if (performanceStats && performanceStats.slowRenderCount > 0) {
            console.log(`${componentName} Performance Report:`, {
              component: componentName,
              renders: performanceStats.totalRenders,
              averageRenderTime: performanceStats.averageRenderTime.toFixed(2) + 'ms',
              slowRenders: performanceStats.slowRenderCount,
              slowRenderPercentage: performanceStats.slowRenderPercentage.toFixed(1) + '%',
              animationFps: animationStats?.averageFps?.toFixed(1) || 'N/A'
            });
          }
        }, 10000); // Report every 10 seconds

        return () => clearInterval(interval);
      }
    }, [tracking, animationPerformance]);

    return <WrappedComponent {...enhancedProps} />;
  }, customPropsComparison);

  OptimizedComponent.displayName = `withPerformanceOptimization(${componentName})`;
  
  return OptimizedComponent;
}

/**
 * Default props comparison function that performs shallow comparison
 * with special handling for functions and objects
 */
export const defaultPropsComparison = (prevProps: Record<string, unknown>, nextProps: Record<string, unknown>): boolean => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  for (const key of prevKeys) {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];
    
    // Handle functions - compare by reference
    if (typeof prevValue === 'function' && typeof nextValue === 'function') {
      if (prevValue !== nextValue) {
        return false;
      }
      continue;
    }
    
    // Handle objects - shallow comparison
    if (typeof prevValue === 'object' && typeof nextValue === 'object') {
      if (prevValue === null || nextValue === null) {
        if (prevValue !== nextValue) {
          return false;
        }
        continue;
      }
      
      // Simple shallow comparison for objects
      const prevObjectKeys = Object.keys(prevValue);
      const nextObjectKeys = Object.keys(nextValue);
      
      if (prevObjectKeys.length !== nextObjectKeys.length) {
        return false;
      }
      
      for (const objKey of prevObjectKeys) {
        if (prevValue[objKey] !== nextValue[objKey]) {
          return false;
        }
      }
      continue;
    }
    
    // Handle primitives
    if (prevValue !== nextValue) {
      return false;
    }
  }
  
  return true;
};

/**
 * Utility function to create a memoized component with performance optimization
 * @param component - Component to optimize
 * @param componentName - Name for logging
 * @param options - Additional options
 * @returns Optimized component
 */
export function createOptimizedComponent<P extends object>(
  component: ComponentType<P>,
  componentName: string,
  options: Partial<WithPerformanceOptimizationOptions> = {}
) {
  return withPerformanceOptimization(component, {
    componentName,
    ...options
  });
}

/**
 * Performance optimization preset configurations
 */
export const performancePresets = {
  // For components with frequent updates (like forms)
  highFrequency: {
    enablePropLogging: false,
    enablePerformanceMonitoring: true,
    enableAnimationTracking: true,
    slowRenderThreshold: 8 // Stricter threshold for high-frequency components
  },
  
  // For components with animations
  animated: {
    enablePropLogging: false,
    enablePerformanceMonitoring: true,
    enableAnimationTracking: true,
    slowRenderThreshold: 16 // Standard 60fps threshold
  },
  
  // For heavy components that should be optimized
  heavy: {
    enablePropLogging: true,
    enablePerformanceMonitoring: true,
    enableAnimationTracking: false,
    slowRenderThreshold: 32 // More lenient for heavy components
  },
  
  // For components that rarely change
  static: {
    enablePropLogging: false,
    enablePerformanceMonitoring: false,
    enableAnimationTracking: false,
    customPropsComparison: () => true // Never re-render unless forced
  }
};