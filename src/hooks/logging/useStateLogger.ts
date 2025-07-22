import { useRef, useCallback } from "react";
import { ComponentLogger } from "@/lib/logger";

interface UseStateLoggerOptions<T> {
  componentName: string;
  stateName: string;
  trigger?: string;
}

/**
 * Hook to track state changes with previous/new values
 * Logs every state transition with detailed information
 */
export function useStateLogger<T>({
  componentName,
  stateName,
  trigger = "state_update",
}: UseStateLoggerOptions<T>) {
  const previousStateRef = useRef<T>();

  const logStateChange = useCallback(
    (newState: T, customTrigger?: string) => {
      try {
        const prevState = previousStateRef.current;
        const actualTrigger = customTrigger || trigger;

        ComponentLogger.stateChange(
          componentName,
          prevState,
          newState,
          `${stateName}: ${actualTrigger}`,
        );

        previousStateRef.current = newState;
      } catch (error) {
        console.error(
          `State logging error for ${componentName}.${stateName}:`,
          error,
        );
      }
    },
    [componentName, stateName, trigger],
  );

  return {
    logStateChange,
    getPreviousState: () => previousStateRef.current,
  };
}
