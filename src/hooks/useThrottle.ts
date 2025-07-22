/**
 * Custom hook for throttling function calls to optimize performance
 * Prevents excessive re-renders from high-frequency events like mousemove
 *
 * V5 Interactive Elegance Performance Optimization:
 * - Throttles mouse tracking to 16ms intervals (60fps)
 * - Prevents excessive state updates that cause animation jank
 * - Uses requestAnimationFrame for smooth performance
 */

import { useRef, useCallback, useEffect } from "react";

interface UseThrottleOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Hook to throttle function calls with configurable delay and behavior
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds between calls (default: 16ms for 60fps)
 * @param options - Configuration options
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 16,
  options: UseThrottleOptions = {},
): T {
  const { leading = true, trailing = true } = options;

  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T>>();
  const callbackRef = useRef(callback);

  // Update callback reference on every render
  callbackRef.current = callback;

  const throttledFunction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      lastArgsRef.current = args;

      // Execute immediately if leading is true and enough time has passed
      if (leading && timeSinceLastCall >= delay) {
        lastCallTimeRef.current = now;
        return callbackRef.current(...args);
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set up trailing call if enabled
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          lastCallTimeRef.current = Date.now();
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
          }
        }, delay - timeSinceLastCall);
      }
    },
    [delay, leading, trailing],
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledFunction;
}

/**
 * Hook to throttle state updates using requestAnimationFrame
 * Ensures smooth 60fps performance for animations
 * @param callback - Function to throttle
 * @returns Throttled function that uses requestAnimationFrame
 */
export function useAnimationThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
): T {
  const rafRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T>>();
  const callbackRef = useRef(callback);

  // Update callback reference on every render
  callbackRef.current = callback;

  const throttledFunction = useCallback((...args: Parameters<T>) => {
    lastArgsRef.current = args;

    if (rafRef.current) {
      return; // Already scheduled
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (lastArgsRef.current) {
        callbackRef.current(...lastArgsRef.current);
      }
    });
  }, []) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return throttledFunction;
}

/**
 * Hook to debounce function calls
 * Delays execution until after a specified delay has passed since the last call
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback reference on every render
  callbackRef.current = callback;

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}
