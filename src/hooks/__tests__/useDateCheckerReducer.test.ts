/**
 * Tests for useDateCheckerReducer hook
 * Validates state management optimization and logging integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDateCheckerReducer } from '../useDateCheckerReducer';
import { UserFlowLogger } from '@/lib/logger';
import { GUEST_COUNT_CONFIG } from '@/lib/date-checker-constants';

// Mock the logger
vi.mock('@/lib/logger', () => ({
  UserFlowLogger: {
    interaction: vi.fn()
  }
}));

describe('useDateCheckerReducer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useDateCheckerReducer());
    
    expect(result.current.state).toEqual({
      selectedDate: undefined,
      selectedTime: '',
      guestCount: GUEST_COUNT_CONFIG.default,
      step: 1
    });
  });

  it('should handle date selection correctly', () => {
    const { result } = renderHook(() => useDateCheckerReducer());
    const testDate = new Date('2024-12-25');
    const formattedDate = 'Monday 25 December';
    
    act(() => {
      result.current.actions.setDate(testDate, formattedDate, false);
    });
    
    expect(result.current.state.selectedDate).toBe(testDate);
    expect(result.current.state.step).toBe(2);
    expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
      'date_selected',
      'DateCheckerModalEnhanced',
      expect.objectContaining({
        selectedDate: testDate,
        formattedDate,
        isWeekend: false
      })
    );
  });

  it('should handle time selection correctly', () => {
    const { result } = renderHook(() => useDateCheckerReducer());
    const testTime = '18:00';
    
    act(() => {
      result.current.actions.setTime(testTime, '');
    });
    
    expect(result.current.state.selectedTime).toBe(testTime);
    expect(result.current.state.step).toBe(3);
    expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
      'time_selected',
      'DateCheckerModalEnhanced',
      expect.objectContaining({
        selectedTime: testTime
      })
    );
  });

  it('should handle guest count changes correctly', () => {
    const { result } = renderHook(() => useDateCheckerReducer());
    const newCount = 50;
    const previousCount = GUEST_COUNT_CONFIG.default;
    
    act(() => {
      result.current.actions.setGuestCount(newCount, previousCount);
    });
    
    expect(result.current.state.guestCount).toBe(newCount);
    expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
      'guest_count_changed',
      'DateCheckerModalEnhanced',
      expect.objectContaining({
        newCount,
        previousCount,
        difference: newCount - previousCount
      })
    );
  });

  it('should handle step navigation correctly', () => {
    const { result } = renderHook(() => useDateCheckerReducer());
    
    act(() => {
      result.current.actions.setStep(2, 'forward');
    });
    
    expect(result.current.state.step).toBe(2);
    expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
      'step_navigation',
      'DateCheckerModalEnhanced',
      expect.objectContaining({
        newStep: 2,
        direction: 'forward'
      })
    );
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useDateCheckerReducer());
    
    // Set some state first
    act(() => {
      result.current.actions.setDate(new Date(), 'test date', false);
      result.current.actions.setTime('18:00');
      result.current.actions.setGuestCount(100, 20);
    });
    
    // Then reset
    act(() => {
      result.current.actions.resetState();
    });
    
    expect(result.current.state).toEqual({
      selectedDate: undefined,
      selectedTime: '',
      guestCount: GUEST_COUNT_CONFIG.default,
      step: 1
    });
    
    expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
      'state_reset',
      'DateCheckerModalEnhanced',
      expect.any(Object)
    );
  });

  it('should maintain action reference stability', () => {
    const { result, rerender } = renderHook(() => useDateCheckerReducer());
    
    const initialActions = result.current.actions;
    
    // Trigger a state change
    act(() => {
      result.current.actions.setStep(2, 'forward');
    });
    
    // Rerender the hook
    rerender();
    
    // Actions should be the same reference (memoized)
    expect(result.current.actions).toBe(initialActions);
  });

  describe('SET_DATE action edge cases', () => {
    it('should handle invalid date strings gracefully', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      expect(() => {
        act(() => {
          result.current.actions.setDate(new Date('invalid'), 'Invalid Date', false);
        });
      }).toThrow('Invalid date string');
    });

    it('should advance step to 2 when date is set', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      const testDate = new Date('2024-12-25');
      
      act(() => {
        result.current.actions.setDate(testDate, 'Christmas Day', false);
      });
      
      expect(result.current.state.step).toBe(2);
      expect(result.current.state.selectedDate).toEqual(testDate);
    });

    it('should handle weekend flag correctly', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      const weekendDate = new Date('2024-12-22'); // Assuming this is a weekend
      
      act(() => {
        result.current.actions.setDate(weekendDate, 'Weekend Date', true);
      });
      
      expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
        'date_selected',
        'DateCheckerModalEnhanced',
        expect.objectContaining({
          isWeekend: true
        })
      );
    });
  });

  describe('SET_TIME action edge cases', () => {
    it('should advance step to 3 when time is set', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      act(() => {
        result.current.actions.setTime('19:00', '18:00');
      });
      
      expect(result.current.state.step).toBe(3);
      expect(result.current.state.selectedTime).toBe('19:00');
    });

    it('should handle empty previous time', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      act(() => {
        result.current.actions.setTime('19:00');
      });
      
      expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
        'time_selected',
        'DateCheckerModalEnhanced',
        expect.objectContaining({
          previousTime: '',
          selectedTime: '19:00'
        })
      );
    });
  });

  describe('SET_GUEST_COUNT action edge cases', () => {
    it('should not change step when guest count is updated', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      const initialStep = result.current.state.step;
      
      act(() => {
        result.current.actions.setGuestCount(100, 50);
      });
      
      expect(result.current.state.step).toBe(initialStep);
      expect(result.current.state.guestCount).toBe(100);
    });

    it('should calculate difference correctly', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      act(() => {
        result.current.actions.setGuestCount(75, 25);
      });
      
      expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
        'guest_count_changed',
        'DateCheckerModalEnhanced',
        expect.objectContaining({
          difference: 50
        })
      );
    });

    it('should handle negative differences', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      act(() => {
        result.current.actions.setGuestCount(10, 50);
      });
      
      expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
        'guest_count_changed',
        'DateCheckerModalEnhanced',
        expect.objectContaining({
          difference: -40
        })
      );
    });
  });

  describe('SET_STEP action edge cases', () => {
    it('should handle backward navigation', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      // First advance to step 3
      act(() => {
        result.current.actions.setStep(3, 'forward');
      });
      
      // Then go backward
      act(() => {
        result.current.actions.setStep(2, 'backward');
      });
      
      expect(result.current.state.step).toBe(2);
      expect(UserFlowLogger.interaction).toHaveBeenLastCalledWith(
        'step_navigation',
        'DateCheckerModalEnhanced',
        expect.objectContaining({
          direction: 'backward',
          newStep: 2,
          previousStep: 3
        })
      );
    });

    it('should handle step boundaries', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      // Try to go to step 0
      act(() => {
        result.current.actions.setStep(0, 'backward');
      });
      
      expect(result.current.state.step).toBe(0);
      
      // Try to go beyond step 3
      act(() => {
        result.current.actions.setStep(5, 'forward');
      });
      
      expect(result.current.state.step).toBe(5);
    });
  });

  describe('RESET_STATE action edge cases', () => {
    it('should preserve previous state in logs before reset', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      const testDate = new Date('2024-12-25');
      
      // Set up some state
      act(() => {
        result.current.actions.setDate(testDate, 'Test Date', false);
        result.current.actions.setTime('19:00');
        result.current.actions.setGuestCount(50, 20);
      });
      
      const stateBeforeReset = result.current.state;
      
      // Reset
      act(() => {
        result.current.actions.resetState();
      });
      
      expect(UserFlowLogger.interaction).toHaveBeenLastCalledWith(
        'state_reset',
        'DateCheckerModalEnhanced',
        expect.objectContaining({
          previousState: expect.objectContaining({
            selectedDate: testDate.toISOString(),
            selectedTime: '19:00',
            guestCount: 50,
            step: 3
          })
        })
      );
      
      expect(result.current.state).toEqual(initialState);
    });

    it('should handle reset from initial state', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      act(() => {
        result.current.actions.resetState();
      });
      
      expect(result.current.state).toEqual(initialState);
      expect(UserFlowLogger.interaction).toHaveBeenCalledWith(
        'state_reset',
        'DateCheckerModalEnhanced',
        expect.any(Object)
      );
    });
  });

  describe('State transitions', () => {
    it('should handle complete booking flow', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      const testDate = new Date('2024-12-25');
      
      // Step 1: Date selection
      act(() => {
        result.current.actions.setDate(testDate, 'Christmas Day', false);
      });
      
      expect(result.current.state.step).toBe(2);
      expect(result.current.state.selectedDate).toEqual(testDate);
      
      // Step 2: Time selection
      act(() => {
        result.current.actions.setTime('19:00');
      });
      
      expect(result.current.state.step).toBe(3);
      expect(result.current.state.selectedTime).toBe('19:00');
      
      // Step 3: Guest count adjustment
      act(() => {
        result.current.actions.setGuestCount(75, GUEST_COUNT_CONFIG.default);
      });
      
      expect(result.current.state.step).toBe(3);
      expect(result.current.state.guestCount).toBe(75);
      
      // Verify final state
      expect(result.current.state).toEqual({
        selectedDate: testDate,
        selectedTime: '19:00',
        guestCount: 75,
        step: 3
      });
    });

    it('should handle partial state updates', () => {
      const { result } = renderHook(() => useDateCheckerReducer());
      
      // Only set time without date
      act(() => {
        result.current.actions.setTime('18:00');
      });
      
      expect(result.current.state).toEqual({
        selectedDate: undefined,
        selectedTime: '18:00',
        guestCount: GUEST_COUNT_CONFIG.default,
        step: 3
      });
    });
  });
});