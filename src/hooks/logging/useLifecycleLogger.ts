import { useEffect, useRef } from "react";
import { ComponentLogger } from "@/lib/logger";

interface UseLifecycleLoggerOptions {
  componentName: string;
  props?: Record<string, unknown>;
  enablePropLogging?: boolean;
}

/**
 * Hook to track component lifecycle events (mount/unmount/updates)
 * Logs when components are created, destroyed, and when props change
 */
export function useLifecycleLogger({
  componentName,
  props,
  enablePropLogging = false,
}: UseLifecycleLoggerOptions) {
  const previousPropsRef = useRef<Record<string, unknown>>();
  const mountedRef = useRef(false);

  // Track component mount
  useEffect(() => {
    try {
      ComponentLogger.lifecycle(
        componentName,
        "mount",
        enablePropLogging ? props : undefined,
      );
      mountedRef.current = true;

      // Cleanup function for unmount
      return () => {
        ComponentLogger.lifecycle(componentName, "unmount");
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
            (key) => props[key] !== prevProps[key],
          );

          if (changedProps.length > 0) {
            ComponentLogger.lifecycle(componentName, "update", {
              changedProps,
              previousProps: prevProps,
              newProps: props,
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
    isComponentMounted: mountedRef.current,
  };
}
