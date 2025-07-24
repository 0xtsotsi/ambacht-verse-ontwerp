// Simple stub for animation optimization - replaced complex animation tracking for browser compatibility
export const useAnimationPerformance = () => ({
  recordFrame: () => {},
  getPerformanceData: () => ({
    averageFps: 60,
    frameCount: 0,
    droppedFrames: 0
  }),
  startTracking: () => {},
  stopTracking: () => {}
});

export const useOptimizedMouseTracking = () => ({
  trackMouseMovement: () => {},
  trackMouseClick: () => {},
  trackScrollPosition: () => {},
  getMouseData: () => ({
    x: 0,
    y: 0,
    velocity: 0
  })
});

export const useOptimizedIntersectionObserver = () => ({
  observe: () => {},
  unobserve: () => {},
  isIntersecting: false,
  intersectionRatio: 0
});

export default useAnimationPerformance;