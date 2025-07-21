import { useRef, useMemo } from 'react';
import { ComponentLogger } from '@/lib/logger';

interface UseRenderLoggerOptions {
  componentName: string;
  dependencies?: unknown[];
  threshold?: number; // milliseconds for slow render detection
}

/**
 * Hook to track component re-renders with dependency analysis
 * Identifies what caused re-renders and tracks render frequency
 */
export function useRenderLogger({
  componentName,
  dependencies = [],
  threshold = 100
}: UseRenderLoggerOptions) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());
  const previousDepsRef = useRef<unknown[]>(dependencies);

  // Track render count and frequency
  const renderInfo = useMemo(() => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    renderCountRef.current += 1;

    try {
      // Identify changed dependencies
      const changedDeps = dependencies
        .map((dep, index) => ({ index, current: dep, previous: previousDepsRef.current[index] }))
        .filter(({ current, previous }) => current !== previous)
        .map(({ index }) => `dep[${index}]`);

      const reason = changedDeps.length > 0 
        ? `Dependencies changed: ${changedDeps.join(', ')}`
        : 'Forced re-render or initial render';

      // Log if render is frequent (less than threshold ms since last render)
      if (renderCountRef.current > 1 && timeSinceLastRender < threshold) {
        ComponentLogger.rerender(componentName, `${reason} (frequent render)`, changedDeps);
      } else if (renderCountRef.current > 1) {
        ComponentLogger.rerender(componentName, reason, changedDeps);
      }

      previousDepsRef.current = [...dependencies];
      lastRenderTimeRef.current = now;

      return {
        renderCount: renderCountRef.current,
        timeSinceLastRender,
        changedDependencies: changedDeps
      };
    } catch (error) {
      console.error(`Render logging error for ${componentName}:`, error);
      return {
        renderCount: renderCountRef.current,
        timeSinceLastRender,
        changedDependencies: []
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return renderInfo;
}