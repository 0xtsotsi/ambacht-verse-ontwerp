
import { useRef, useCallback, useState } from "react";
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
  const [state, setState] = useState<T>();

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

  // Modified to return tuple-like structure with logStateChange property
  const returnValue = [state, setState] as const;
  (returnValue as any).logStateChange = logStateChange;
  (returnValue as any).getPreviousState = () => previousStateRef.current;

  return returnValue;
}

// This function is used to create a state logger within other hooks
export function createStateLogger<T>(
  componentName: string,
  stateName: string,
) {
  const previousStateRef = useRef<T>();

  const logStateChange = useCallback(
    (newState: T, trigger = "state_update") => {
      try {
        const prevState = previousStateRef.current;
        
        ComponentLogger.stateChange(
          componentName,
          prevState,
          newState,
          `${stateName}: ${trigger}`,
        );
        
        previousStateRef.current = newState;
      } catch (error) {
        console.error(
          `State logging error for ${componentName}.${stateName}:`,
          error,
        );
      }
    },
    [componentName, stateName],
  );
  
  return {
    logStateChange,
    getPreviousState: () => previousStateRef.current,
  };
}
