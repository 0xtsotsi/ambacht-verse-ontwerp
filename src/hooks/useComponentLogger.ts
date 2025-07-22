import { useRef, useEffect, useCallback, useState } from "react";

export type LoggableValue = 
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: LoggableValue }
  | LoggableValue[];

interface LoggerConfig {
  componentName: string;
  props?: Record<string, LoggableValue>;
  enablePropLogging?: boolean;
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

export function useLifecycleLogger(config: LoggerConfig) {
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

export function useRenderLogger(config: LoggerConfig) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    if (config.enablePropLogging) {
      console.log(`[${config.componentName}] Render #${renderCount.current}`, config.props || {});
    }
  });
  
  return renderCount.current;
}

export function useStateLogger<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  
  const wrappedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(newState);
  }, []);
  
  return [state, wrappedSetState] as const;
}