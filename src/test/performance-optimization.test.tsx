/**
 * Performance optimization tests for V5 Interactive Elegance
 * Tests throttling, memoization, and animation frame optimizations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useThrottle, useAnimationThrottle, useDebounce } from '../hooks/useThrottle';
import { useOptimizedMouseTracking, useOptimizedIntersectionObserver } from '../hooks/useAnimationOptimization';

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  global.requestAnimationFrame = mockRequestAnimationFrame;
  global.cancelAnimationFrame = mockCancelAnimationFrame;
  mockRequestAnimationFrame.mockImplementation((cb) => {
    return setTimeout(cb, 16);
  });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('useThrottle', () => {
  it('should throttle function calls to specified interval', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useThrottle(mockFn, 100));
    
    // Call the throttled function multiple times
    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });
    
    // Should only call once immediately (leading edge)
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test1');
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Should call again with the last arguments (trailing edge)
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith('test3');
  });
  
  it('should default to 16ms interval for 60fps', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useThrottle(mockFn));
    
    act(() => {
      result.current('test');
    });
    
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    act(() => {
      vi.advanceTimersByTime(15);
      result.current('test2');
    });
    
    // Should not call again within 16ms
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    act(() => {
      vi.advanceTimersByTime(2);
    });
    
    // Should call after 16ms total
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe('useAnimationThrottle', () => {
  it('should throttle using requestAnimationFrame', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useAnimationThrottle(mockFn));
    
    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });
    
    // Should only schedule one animation frame
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledTimes(0);
    
    // Execute the animation frame
    act(() => {
      vi.advanceTimersByTime(16);
    });
    
    // Should call with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test3');
  });
  
  it('should cancel animation frame on unmount', () => {
    const mockFn = vi.fn();
    const { result, unmount } = renderHook(() => useAnimationThrottle(mockFn));
    
    act(() => {
      result.current('test');
    });
    
    unmount();
    
    expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
  });
});

describe('useDebounce', () => {
  it('should debounce function calls', () => {
    const mockFn = vi.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 100));
    
    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });
    
    // Should not call immediately
    expect(mockFn).toHaveBeenCalledTimes(0);
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Should call once with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test3');
  });
});

describe('useOptimizedMouseTracking', () => {
  it('should track mouse movement with throttling', () => {
    const mockAddEventListener = vi.fn();
    const mockRemoveEventListener = vi.fn();
    
    Object.defineProperty(window, 'addEventListener', {
      value: mockAddEventListener,
      writable: true
    });
    
    Object.defineProperty(window, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true
    });
    
    Object.defineProperty(window, 'innerWidth', {
      value: 1000,
      writable: true
    });
    
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true
    });
    
    const { result, unmount } = renderHook(() => useOptimizedMouseTracking(true, 20));
    
    expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function), { passive: true });
    expect(result.current).toEqual({ x: 0, y: 0 });
    
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });
  
  it('should not track when disabled', () => {
    const mockAddEventListener = vi.fn();
    
    Object.defineProperty(window, 'addEventListener', {
      value: mockAddEventListener,
      writable: true
    });
    
    renderHook(() => useOptimizedMouseTracking(false, 20));
    
    expect(mockAddEventListener).not.toHaveBeenCalled();
  });
});

describe('useOptimizedIntersectionObserver', () => {
  it('should create and clean up intersection observer', () => {
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();
    
    const MockIntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn()
    }));
    
    global.IntersectionObserver = MockIntersectionObserver;
    
    const { result, unmount } = renderHook(() => useOptimizedIntersectionObserver());
    
    expect(result.current.isVisible).toBe(false);
    
    // Create a mock element
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.observe(mockElement);
    });
    
    expect(MockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    expect(mockObserve).toHaveBeenCalledWith(mockElement);
    
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
  
  it('should update visibility state when intersecting', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;
    
    const MockIntersectionObserver = vi.fn().mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      };
    });
    
    global.IntersectionObserver = MockIntersectionObserver;
    
    const { result } = renderHook(() => useOptimizedIntersectionObserver());
    
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.observe(mockElement);
    });
    
    expect(result.current.isVisible).toBe(false);
    
    // Simulate intersection
    act(() => {
      intersectionCallback([{
        isIntersecting: true,
        target: mockElement
      } as IntersectionObserverEntry]);
    });
    
    expect(result.current.isVisible).toBe(true);
  });
});