import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook for optimized mouse tracking with throttling
 * @param enabled Whether mouse tracking is enabled
 * @param throttleMs Throttle time in milliseconds (default: 16ms for 60fps)
 * @returns Current mouse position {x, y}
 */
export function useOptimizedMouseTracking(enabled = true, throttleMs = 16) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    function handleMouseMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastUpdate >= throttleMs) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
        setLastUpdate(now);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, throttleMs, lastUpdate]);

  return mousePosition;
}

/**
 * Hook for calculating parallax effects based on mouse or scroll position
 * @param depth Depth factor for parallax effect (1-10)
 * @param inverse Whether to inverse the direction
 * @returns Transform values for use in CSS
 */
export function useParallaxEffect(depth = 5, inverse = false) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const updateParallax = useCallback((mouseX: number, mouseY: number) => {
    // Calculate center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate distance from center (normalized to -1 to 1)
    let xOffset = (mouseX - centerX) / centerX;
    let yOffset = (mouseY - centerY) / centerY;
    
    // Apply depth and inversion if needed
    const factor = depth * 0.1; // Scale depth to reasonable values
    if (inverse) {
      xOffset = -xOffset;
      yOffset = -yOffset;
    }
    
    setPosition({
      x: xOffset * factor * 20, // Max 20px movement by default
      y: yOffset * factor * 20,
    });
  }, [depth, inverse]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateParallax(e.clientX, e.clientY);
    };
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateParallax]);
  
  return {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    scrollY: scrollPosition,
  };
}

/**
 * Hook for optimized intersection observer
 * @param options Configuration options for the intersection observer
 * @returns IntersectionObserver API and visibility state
 */
export function useOptimizedIntersectionObserver(options?: {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  trackPerformance?: boolean;
}) {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    trackPerformance = false,
  } = options || {};
  
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());
  
  const observe = useCallback((element: Element) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            }
          });
        },
        { root, rootMargin, threshold }
      );
    }
    
    elementsRef.current.add(element);
    observerRef.current.observe(element);
  }, [root, rootMargin, threshold]);
  
  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(element);
    }
  }, []);
  
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      elementsRef.current.clear();
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  return {
    observe,
    unobserve,
    disconnect,
    isVisible,
  };
}