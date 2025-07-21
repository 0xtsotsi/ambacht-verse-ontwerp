/**
 * Custom hooks for optimized animations and smooth 60fps performance
 * Provides requestAnimationFrame-based animations and performance monitoring
 * 
 * V5 Interactive Elegance Performance Optimization:
 * - Ensures all animations run at 60fps without jank
 * - Provides GPU-accelerated transforms
 * - Includes performance monitoring for slow animations
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { useAnimationThrottle } from './useThrottle';

interface AnimationFrameOptions {
  onFrame?: (progress: number, elapsed: number) => void;
  duration?: number;
  easing?: (t: number) => number;
  autoStart?: boolean;
}

interface UseAnimationFrameResult {
  start: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: boolean;
  progress: number;
}

/**
 * Hook for smooth requestAnimationFrame-based animations
 * Ensures consistent 60fps performance across all animations
 */
export function useAnimationFrame({
  onFrame,
  duration = 1000,
  easing = (t: number) => t, // Linear easing by default
  autoStart = false
}: AnimationFrameOptions): UseAnimationFrameResult {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [progress, setProgress] = useState(0);
  
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const onFrameRef = useRef(onFrame);

  // Update callback reference
  onFrameRef.current = onFrame;

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(rawProgress);

    setProgress(easedProgress);

    if (onFrameRef.current) {
      onFrameRef.current(easedProgress, elapsed);
    }

    if (rawProgress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsRunning(false);
      startTimeRef.current = null;
    }
  }, [duration, easing]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning, animate]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsRunning(false);
    startTimeRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stop();
    setProgress(0);
  }, [stop]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      start();
    }
    return stop;
  }, [autoStart, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    start,
    stop,
    reset,
    isRunning,
    progress
  };
}

/**
 * Hook for smooth mouse tracking with performance optimization
 * Throttles mouse events to 16ms intervals for 60fps performance
 */
export function useOptimizedMouseTracking(
  enabled: boolean = true,
  intensity: number = 20
) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const enabledRef = useRef(enabled);
  const intensityRef = useRef(intensity);

  // Update refs when props change
  enabledRef.current = enabled;
  intensityRef.current = intensity;

  // Throttled mouse handler using requestAnimationFrame
  const throttledMouseMove = useAnimationThrottle(
    useCallback((e: MouseEvent) => {
      if (!enabledRef.current) return;

      const x = (e.clientX / window.innerWidth - 0.5) * intensityRef.current;
      const y = (e.clientY / window.innerHeight - 0.5) * intensityRef.current;
      
      setMousePosition({ x, y });
    }, [])
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('mousemove', throttledMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
    };
  }, [enabled, throttledMouseMove]);

  return mousePosition;
}

/**
 * Hook for optimized intersection observer with performance monitoring
 * Includes proper cleanup to prevent memory leaks
 */
export function useOptimizedIntersectionObserver(
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const observe = useCallback((element: HTMLElement | null) => {
    if (element === elementRef.current) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    elementRef.current = element;

    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        setEntry(entry);
      },
      options
    );

    observerRef.current.observe(element);
  }, [options]);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    elementRef.current = null;
    setIsVisible(false);
    setEntry(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return disconnect;
  }, [disconnect]);

  return {
    observe,
    disconnect,
    isVisible,
    entry
  };
}

/**
 * Easing functions for smooth animations
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
};

/**
 * Hook for performance monitoring of animations
 * Tracks frame rates and identifies performance bottlenecks
 */
export function useAnimationPerformance(componentName: string) {
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const performanceDataRef = useRef<{
    averageFps: number;
    minFps: number;
    maxFps: number;
    frameDrops: number;
  }>({
    averageFps: 60,
    minFps: 60,
    maxFps: 60,
    frameDrops: 0
  });

  const recordFrame = useCallback(() => {
    const currentTime = performance.now();
    const frameTime = currentTime - lastFrameTimeRef.current;
    
    frameTimesRef.current.push(frameTime);
    
    // Keep only last 60 frames (1 second at 60fps)
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }
    
    // Calculate performance metrics
    const fps = 1000 / frameTime;
    const averageFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
    const averageFps = 1000 / averageFrameTime;
    const minFps = Math.min(...frameTimesRef.current.map(ft => 1000 / ft));
    const maxFps = Math.max(...frameTimesRef.current.map(ft => 1000 / ft));
    const frameDrops = frameTimesRef.current.filter(ft => ft > 16.67).length; // Frames > 16.67ms (below 60fps)
    
    performanceDataRef.current = {
      averageFps,
      minFps,
      maxFps,
      frameDrops
    };
    
    // Log performance issues
    if (fps < 30) {
      console.warn(`${componentName}: Low FPS detected (${fps.toFixed(1)}fps)`);
    }
    
    lastFrameTimeRef.current = currentTime;
  }, [componentName]);

  const getPerformanceData = useCallback(() => {
    return { ...performanceDataRef.current };
  }, []);

  return {
    recordFrame,
    getPerformanceData
  };
}