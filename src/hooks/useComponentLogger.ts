
import { useRef, useEffect, useCallback, useState } from "react";

export type LoggableValue = 
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: LoggableValue }
  | LoggableValue[];

export interface BookingState {
  selectedDate: Date;
  [key: string]: any;
}

interface LoggerConfig {
  componentName: string;
  props?: Record<string, LoggableValue>;
  enablePropLogging?: boolean;
  dependencies?: any[];
  stateName?: string;
}

interface PerformanceLoggerOptions {
  componentName: string;
  slowRenderThreshold?: number;
  enableMemoryTracking?: boolean;
  logLevel?: "debug" | "info" | "warn" | "error";
}

interface PerformanceStats {
  renderTime: number;
  renderCount: number;
  slowRenders: number;
  memory?: {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  };
}

/**
 * Hook for tracking component performance metrics
 */
export function usePerformanceLogger(options: PerformanceLoggerOptions) {
  const {
    componentName,
    slowRenderThreshold = 16,
    enableMemoryTracking = false,
    logLevel = "debug",
  } = options;

  const stats = useRef<PerformanceStats>({
    renderTime: 0,
    renderCount: 0,
    slowRenders: 0,
    memory: {},
  });

  const renderStartTime = useRef(performance.now());

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime.current;
    
    stats.current.renderCount++;
    stats.current.renderTime += renderDuration;
    
    if (renderDuration > slowRenderThreshold) {
      stats.current.slowRenders++;
      if (logLevel !== "debug") {
        console.warn(
          `[${componentName}] Slow render: ${renderDuration.toFixed(2)}ms`
        );
      }
    }
    
    if (enableMemoryTracking && (performance as any).memory) {
      stats.current.memory = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }
    
    renderStartTime.current = performance.now();
  });

  const getPerformanceStats = useCallback(() => {
    return { ...stats.current };
  }, []);

  return {
    getPerformanceStats,
    resetStats: () => {
      stats.current = {
        renderTime: 0,
        renderCount: 0,
        slowRenders: 0,
        memory: {},
      };
    },
  };
}

/**
 * Hook for tracking component lifecycle events
 * Works with either a string componentName or a config object
 */
export function useLifecycleLogger(configOrName: LoggerConfig | string, props?: Record<string, LoggableValue>) {
  const config = typeof configOrName === 'string' 
    ? { componentName: configOrName, props } 
    : configOrName;

  useEffect(() => {
    const { componentName, props } = config;
    console.log(`[${componentName}] Mounted`, props || '');
    return () => {
      console.log(`[${componentName}] Unmounted`);
    };
  }, [config]);

  return {
    logEvent: (eventName: string, data?: Record<string, LoggableValue>) => {
      console.log(`[${config.componentName}] ${eventName}`, data || '');
    }
  };
}

/**
 * Hook for tracking component renders
 * Works with either a string componentName or a config object
 */
export function useRenderLogger(configOrName: LoggerConfig | string, props?: Record<string, LoggableValue>) {
  const renderCount = useRef(0);
  const config = typeof configOrName === 'string' 
    ? { componentName: configOrName, props, enablePropLogging: !!props } 
    : configOrName;
  
  useEffect(() => {
    renderCount.current += 1;
    if (config.enablePropLogging) {
      console.log(`[${config.componentName}] Render #${renderCount.current}`, config.props || {});
    }
  });
  
  return renderCount.current;
}

/**
 * Hook for tracking state changes
 */
export function useStateLogger<T>(initialStateOrConfig: T | LoggerConfig, initialState?: T) {
  const isConfig = typeof initialStateOrConfig === 'object' && 'componentName' in initialStateOrConfig;
  const actualInitialState = isConfig ? (initialState || {} as T) : initialStateOrConfig;
  const config = isConfig ? initialStateOrConfig as LoggerConfig : { componentName: 'Component' };
  
  const [state, setState] = useState<T>(actualInitialState as T);
  const prevStateRef = useRef<T>(actualInitialState as T);
  
  const logStateChange = useCallback((newState: T, description?: string) => {
    console.log(`[${config.componentName}] State${config.stateName ? ` (${config.stateName})` : ''} changed:`, {
      description,
      from: prevStateRef.current,
      to: newState
    });
    prevStateRef.current = newState;
  }, [config]);
  
  const wrappedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(s => {
      const nextState = typeof newState === 'function' 
        ? (newState as ((prev: T) => T))(s) 
        : newState;
      
      logStateChange(nextState);
      return nextState;
    });
  }, [logStateChange]);
  
  // For compatibility with existing code
  const returnValue = [state, wrappedSetState] as const;
  (returnValue as any).logStateChange = logStateChange;
  (returnValue as any).getPreviousState = () => prevStateRef.current;
  
  return returnValue;
}

/**
 * Component tracking hook with support for props, state, and performance
 */
export function useComponentTracking(componentNameOrConfig: string | LoggerConfig, options?: {
  props?: Record<string, LoggableValue>;
  dependencies?: any[];
  enableLifecycleLogging?: boolean;
  enableRenderLogging?: boolean;
  enablePerformanceLogging?: boolean;
  enableStateLogging?: boolean;
}) {
  const config = typeof componentNameOrConfig === 'string' 
    ? { componentName: componentNameOrConfig, ...options } 
    : componentNameOrConfig;
    
  const mountTime = useRef(Date.now());
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  useEffect(() => {
    if (config.enableLifecycleLogging) {
      console.log(`[${config.componentName}] Mounted`, config.props || {});
    }
    return () => {
      if (config.enableLifecycleLogging) {
        const unmountTime = Date.now();
        const lifespanMs = unmountTime - mountTime.current;
        console.log(`[${config.componentName}] Unmounted after ${lifespanMs}ms`);
      }
    };
  }, [config]);
  
  useEffect(() => {
    if (config.dependencies && config.dependencies.length > 0 && config.enableRenderLogging) {
      renderCount.current += 1;
      const now = Date.now();
      const timeSinceLastRender = now - lastRenderTime.current;
      lastRenderTime.current = now;
      console.log(`[${config.componentName}] Dependency update #${renderCount.current}`, {
        timeSinceLastRender
      });
    }
  }, config.dependencies || []);
  
  const trackEvent = useCallback((eventName: string, data?: Record<string, LoggableValue>) => {
    console.log(`[${config.componentName}] ${eventName}`, data || {});
  }, [config.componentName]);

  // Add state logger creation function
  const createStateLogger = useCallback(<T>(stateName: string) => {
    const prevValueRef = useRef<T>();

    return {
      logStateChange: (newValue: T, trigger = "update") => {
        console.log(`[${config.componentName}][${stateName}] ${trigger}:`, {
          previous: prevValueRef.current,
          current: newValue,
        });
        prevValueRef.current = newValue;
      },
      getPreviousValue: () => prevValueRef.current,
    };
  }, [config.componentName]);
  
  return { 
    trackEvent,
    createStateLogger,
    renderInfo: {
      count: renderCount.current,
      timeSinceLastRender: Date.now() - lastRenderTime.current,
      renderCount: renderCount.current
    },
    performance: {
      mountTime: mountTime.current,
      getDuration: () => Date.now() - mountTime.current,
      getPerformanceStats: () => ({
        renderCount: renderCount.current,
        duration: Date.now() - mountTime.current,
        averageRenderTime: renderCount.current > 0 ? 
          (Date.now() - mountTime.current) / renderCount.current : 0
      })
    }
  };
}
