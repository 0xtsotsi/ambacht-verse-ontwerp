/**
 * DateChecker state management with useReducer
 * Optimizes rendering by co-locating state updates and integrating logging
 */

import { useReducer, useCallback } from "react";
import { GUEST_COUNT_CONFIG } from "@/lib/date-checker-constants";
import { UserFlowLogger } from "@/lib/logger";

export interface DateCheckerState {
  selectedDate?: Date;
  selectedTime: string;
  guestCount: number;
  step: number;
}

// Serializable version of the state for actions and logging
export interface SerializableDateCheckerState {
  selectedDate?: string; // ISO string instead of Date
  selectedTime: string;
  guestCount: number;
  step: number;
}

export type DateCheckerAction =
  | {
      type: "SET_DATE";
      payload: {
        dateIsoString: string;
        formattedDate: string;
        isWeekend: boolean;
      };
    }
  | { type: "SET_TIME"; payload: { time: string; previousTime?: string } }
  | {
      type: "SET_GUEST_COUNT";
      payload: { count: number; previousCount: number };
    }
  | {
      type: "SET_STEP";
      payload: { step: number; direction: "forward" | "backward" };
    }
  | { type: "RESET_STATE"; payload?: undefined };

const initialState: DateCheckerState = {
  selectedDate: undefined,
  selectedTime: "",
  guestCount: GUEST_COUNT_CONFIG.default,
  step: 1,
};

// Helper functions for serialization
const serializeStateForLogging = (
  state: DateCheckerState,
): SerializableDateCheckerState => ({
  selectedDate: state.selectedDate?.toISOString(),
  selectedTime: state.selectedTime,
  guestCount: state.guestCount,
  step: state.step,
});

const dateFromIsoString = (isoString: string): Date => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${isoString}`);
  }
  return date;
};

const dateCheckerReducer = (
  state: DateCheckerState,
  action: DateCheckerAction,
): DateCheckerState => {
  switch (action.type) {
    case "SET_DATE": {
      const selectedDate = dateFromIsoString(action.payload.dateIsoString);
      const newState = {
        ...state,
        selectedDate,
        step: 2,
      };

      // Integrated logging with serializable data
      UserFlowLogger.interaction("date_selected", "DateCheckerModalEnhanced", {
        previousDate: state.selectedDate?.toISOString(),
        selectedDate: action.payload.dateIsoString,
        formattedDate: action.payload.formattedDate,
        isWeekend: action.payload.isWeekend,
      });

      return newState;
    }

    case "SET_TIME": {
      const newState = {
        ...state,
        selectedTime: action.payload.time,
        step: 3,
      };

      UserFlowLogger.interaction("time_selected", "DateCheckerModalEnhanced", {
        previousTime: action.payload.previousTime || state.selectedTime,
        selectedTime: action.payload.time,
      });

      return newState;
    }

    case "SET_GUEST_COUNT": {
      const newState = {
        ...state,
        guestCount: action.payload.count,
      };

      UserFlowLogger.interaction(
        "guest_count_changed",
        "DateCheckerModalEnhanced",
        {
          previousCount: action.payload.previousCount,
          newCount: action.payload.count,
          difference: action.payload.count - action.payload.previousCount,
        },
      );

      return newState;
    }

    case "SET_STEP": {
      const newState = {
        ...state,
        step: action.payload.step,
      };

      UserFlowLogger.interaction(
        "step_navigation",
        "DateCheckerModalEnhanced",
        {
          previousStep: state.step,
          newStep: action.payload.step,
          direction: action.payload.direction,
        },
      );

      return newState;
    }

    case "RESET_STATE": {
      UserFlowLogger.interaction("state_reset", "DateCheckerModalEnhanced", {
        previousState: serializeStateForLogging(state),
      });

      return initialState;
    }

    default:
      return state;
  }
};

export const useDateCheckerReducer = () => {
  const [state, dispatch] = useReducer(dateCheckerReducer, initialState);

  // Memoized action creators to prevent unnecessary re-renders
  const setDate = useCallback(
    (date: Date, formattedDate: string, isWeekend: boolean) => {
      dispatch({
        type: "SET_DATE",
        payload: {
          dateIsoString: date.toISOString(),
          formattedDate,
          isWeekend,
        },
      });
    },
    [],
  );

  const setTime = useCallback((time: string, previousTime?: string) => {
    dispatch({
      type: "SET_TIME",
      payload: { time, previousTime },
    });
  }, []);

  const setGuestCount = useCallback((count: number, previousCount: number) => {
    dispatch({
      type: "SET_GUEST_COUNT",
      payload: { count, previousCount },
    });
  }, []);

  const setStep = useCallback(
    (step: number, direction: "forward" | "backward") => {
      dispatch({
        type: "SET_STEP",
        payload: { step, direction },
      });
    },
    [],
  );

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  return {
    state,
    actions: {
      setDate,
      setTime,
      setGuestCount,
      setStep,
      resetState,
    },
  };
};
