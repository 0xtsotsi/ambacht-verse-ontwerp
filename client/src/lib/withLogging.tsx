/**
 * Higher-order component for automatic component logging
 * Wraps components with lifecycle, performance, and props tracking
 */

import React, { ComponentType, useEffect, useRef, useMemo } from "react";
import { ComponentLogger } from "@/lib/logger";
import { useComponentTracking } from "@/hooks/useComponentLogger";

// Type definitions for withLogging
type LoggableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | LoggableValue[]
  | { [key: string]: LoggableValue };
type SanitizedProps = Record<string, LoggableValue>;
type PropChangeData = { old: LoggableValue; new: LoggableValue };

// Configuration for logging levels
type LoggingLevel = "none" | "basic" | "detailed" | "verbose";

interface LoggingConfig {
  level: LoggingLevel;
  lifecycle: boolean;
  performance: boolean;
  props: boolean;
  renders: boolean;
  slowRenderThreshold: number;
}

interface WithLoggingOptions {
  componentName?: string;
  config?: Partial<LoggingConfig>;
  excludeProps?: string[];
  enableInProduction?: boolean;
}

// Default logging configuration
const DEFAULT_CONFIG: LoggingConfig = {
  level: "detailed",
  lifecycle: true,
  performance: true,
  props: true,
  renders: true,
  slowRenderThreshold: 16,
};

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

/**
 * Sanitizes props by removing sensitive data and excluded props
 */
function sanitizeProps(
  props: Record<string, LoggableValue>,
  excludeProps: string[] = [],
): SanitizedProps {
  try {
    const sanitized = { ...props };
    const sensitiveKeys = [
      "password",
      "token",
      "apiKey",
      "secret",
      "authorization",
    ];

    // Remove sensitive and excluded props
    [...sensitiveKeys, ...excludeProps].forEach((key) => {
      if (key in sanitized) {
        delete sanitized[key];
      }
    });

    // Handle functions - just indicate they exist
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "function") {
        sanitized[key] = "[Function]";
      }
    });

    return sanitized;
  } catch (error) {
    console.error("Props sanitization error:", error);
    return {};
  }
}

/**
 * Determines if logging should be enabled based on environment and config
 */
function shouldEnableLogging(enableInProduction: boolean = false): boolean {
  return isDevelopment || enableInProduction;
}

/**
 * Gets the effective logging configuration based on level and custom overrides
 */
function getEffectiveConfig(
  customConfig: Partial<LoggingConfig> = {},
): LoggingConfig {
  const baseConfig = { ...DEFAULT_CONFIG, ...customConfig };

  // Adjust config based on level
  switch (baseConfig.level) {
    case "none":
      return {
        ...baseConfig,
        lifecycle: false,
        performance: false,
        props: false,
        renders: false,
      };
    case "basic":
      return { ...baseConfig, props: false, renders: false };
    case "detailed":
      return baseConfig;
    case "verbose":
      return { ...baseConfig, slowRenderThreshold: 5 }; // More sensitive to slow renders
    default:
      return baseConfig;
  }
}

/**
 * Higher-order component that adds comprehensive logging to any React component
 *
 * @param WrappedComponent - The component to wrap with logging
 * @param options - Configuration options for logging behavior
 * @returns Enhanced component with logging capabilities
 */
export function withLogging<P extends Record<string, LoggableValue>>(
  WrappedComponent: ComponentType<P>,
  options: WithLoggingOptions = {},
) {
  const {
    componentName = WrappedComponent.displayName ||
      WrappedComponent.name ||
      "UnknownComponent",
    config = {},
    excludeProps = [],
    enableInProduction = false,
  } = options;

  const LoggingWrapper = React.forwardRef<unknown, P>((props, ref) => {
    const loggingEnabled = shouldEnableLogging(enableInProduction);
    const effectiveConfig = getEffectiveConfig(config);
    const renderCountRef = useRef(0);
    const lastPropsRef = useRef<P>();

    // Sanitize props for logging
    const sanitizedProps = useMemo(
      () =>
        loggingEnabled && effectiveConfig.props
          ? sanitizeProps(props as Record<string, LoggableValue>, excludeProps)
          : {},
      [props, effectiveConfig.props, loggingEnabled],
    );

    // Use component tracking hooks (always called, but conditionally enabled)
    const tracking = useComponentTracking(componentName, {
      enableLifecycleLogging: loggingEnabled && effectiveConfig.lifecycle,
      enableRenderLogging: loggingEnabled && effectiveConfig.renders,
      enablePerformanceLogging: loggingEnabled && effectiveConfig.performance,
      props: sanitizedProps,
      dependencies: [props],
    });

    // Track prop changes
    useEffect(() => {
      try {
        if (loggingEnabled && effectiveConfig.props && lastPropsRef.current) {
          const prevProps = lastPropsRef.current;
          const currentProps = props;

          // Find changed props
          const changedProps: string[] = [];
          const propChanges: Record<string, PropChangeData> = {};

          Object.keys({ ...prevProps, ...currentProps }).forEach((key) => {
            if (prevProps[key as keyof P] !== currentProps[key as keyof P]) {
              changedProps.push(key);
              propChanges[key] = {
                old: prevProps[key as keyof P],
                new: currentProps[key as keyof P],
              };
            }
          });

          if (changedProps.length > 0) {
            ComponentLogger.stateChange(
              componentName,
              lastPropsRef.current,
              props,
              `Props changed: ${changedProps.join(", ")}`,
            );
          }
        }
        lastPropsRef.current = props;
      } catch (error) {
        console.error(
          `Props change logging error for ${componentName}:`,
          error,
        );
      }
    }, [props, effectiveConfig.props, loggingEnabled]);

    // Track render count
    useEffect(() => {
      renderCountRef.current += 1;

      if (
        loggingEnabled &&
        effectiveConfig.renders &&
        renderCountRef.current > 1
      ) {
        ComponentLogger.rerender(
          componentName,
          `Render #${renderCountRef.current}`,
          [],
        );
      }
    });

    // Log component mounting with initial props
    useEffect(() => {
      if (loggingEnabled && effectiveConfig.lifecycle) {
        ComponentLogger.lifecycle(componentName, "mount", {
          initialProps: sanitizedProps,
          renderCount: renderCountRef.current,
        });
      }
    }, [loggingEnabled, effectiveConfig.lifecycle, sanitizedProps]); // Added proper dependencies

    // Performance monitoring wrapper
    const WrappedComponentWithPerf = useMemo(() => {
      if (!loggingEnabled || !effectiveConfig.performance) {
        return <WrappedComponent {...props} ref={ref} />;
      }

      return (
        <PerformanceWrapper
          componentName={componentName}
          threshold={effectiveConfig.slowRenderThreshold}
        >
          <WrappedComponent {...props} ref={ref} />
        </PerformanceWrapper>
      );
    }, [
      props,
      ref,
      loggingEnabled,
      effectiveConfig.performance,
      effectiveConfig.slowRenderThreshold,
    ]);

    // Early return if logging is disabled, but after all hooks are called
    if (!loggingEnabled) {
      return <WrappedComponent {...props} ref={ref} />;
    }

    return WrappedComponentWithPerf;
  });

  // Set display name for better debugging
  LoggingWrapper.displayName = `withLogging(${componentName})`;

  return LoggingWrapper;
}

/**
 * Performance monitoring wrapper component
 * Measures and logs render performance metrics
 */
interface PerformanceWrapperProps {
  componentName: string;
  threshold: number;
  children: React.ReactNode;
}

function PerformanceWrapper({
  componentName,
  threshold,
  children,
}: PerformanceWrapperProps) {
  const startTimeRef = useRef<number>();
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();

    // Setup performance observer for detailed metrics
    if ("PerformanceObserver" in window) {
      try {
        performanceObserverRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name.includes(componentName)) {
              ComponentLogger.performance(
                componentName,
                entry.duration,
                entry.duration > threshold,
              );
            }
          });
        });

        performanceObserverRef.current.observe({ entryTypes: ["measure"] });
      } catch (error) {
        console.warn("PerformanceObserver setup failed:", error);
      }
    }

    return () => {
      if (startTimeRef.current) {
        const renderTime = performance.now() - startTimeRef.current;
        const isSlowRender = renderTime > threshold;

        ComponentLogger.performance(componentName, renderTime, isSlowRender);
      }

      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
    };
  });

  return <>{children}</>;
}

/**
 * Convenience function to create a logging wrapper with predefined configs
 */
export const withBasicLogging = <P extends Record<string, LoggableValue>>(
  component: ComponentType<P>,
  componentName?: string,
) =>
  withLogging(component, {
    componentName,
    config: { level: "basic" },
  });

export const withDetailedLogging = <P extends Record<string, LoggableValue>>(
  component: ComponentType<P>,
  componentName?: string,
) =>
  withLogging(component, {
    componentName,
    config: { level: "detailed" },
  });

export const withVerboseLogging = <P extends Record<string, LoggableValue>>(
  component: ComponentType<P>,
  componentName?: string,
) =>
  withLogging(component, {
    componentName,
    config: { level: "verbose" },
  });

/**
 * Hook for manual logging within components
 * Useful for custom logging that doesn't fit the HOC pattern
 */
export function useManualLogging(componentName: string) {
  const logEvent = (event: string, data?: LoggableValue) => {
    try {
      ComponentLogger.lifecycle(componentName, "update", { event, data });
    } catch (error) {
      console.error(`Manual logging error for ${componentName}:`, error);
    }
  };

  const logError = (error: Error, context?: LoggableValue) => {
    try {
      ComponentLogger.lifecycle(componentName, "update", {
        event: "error",
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        context,
      });
    } catch (logError) {
      console.error(`Error logging failed for ${componentName}:`, logError);
    }
  };

  return { logEvent, logError };
}
