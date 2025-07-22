import { useRef, useCallback, useEffect } from "react";
import { ComponentLogger } from "@/lib/logger";

interface UsePerformanceLoggerOptions {
  componentName: string;
  slowRenderThreshold?: number; // 16ms = 60fps threshold
  enableMemoryTracking?: boolean;
}

interface PerformanceMetrics {
  renderTime: number;
  isSlowRender: boolean;
  memoryUsage?: number;
  timestamp: string;
}

/**
 * Hook to track component performance metrics
 * Measures render times and identifies slow renders
 */
export function usePerformanceLogger({
  componentName,
  slowRenderThreshold = 16, // 16ms = 60fps threshold
  enableMemoryTracking = false,
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
        if (enableMemoryTracking && "memory" in performance) {
          memoryUsage = (
            performance as Performance & { memory?: { usedJSHeapSize: number } }
          ).memory?.usedJSHeapSize;
        }

        const metrics: PerformanceMetrics = {
          renderTime,
          isSlowRender,
          memoryUsage,
          timestamp: new Date().toISOString(),
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

    const renderTimes = data.map((d) => d.renderTime);
    const slowRenders = data.filter((d) => d.isSlowRender).length;

    return {
      totalRenders: data.length,
      averageRenderTime:
        renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
      maxRenderTime: Math.max(...renderTimes),
      minRenderTime: Math.min(...renderTimes),
      slowRenderCount: slowRenders,
      slowRenderPercentage: (slowRenders / data.length) * 100,
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
    performanceHistory: performanceDataRef.current,
  };
}
