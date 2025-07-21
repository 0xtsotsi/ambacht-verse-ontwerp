import { useReducer, useCallback } from 'react';
import { 
  QUOTE_GUEST_CONFIG,
  type QuoteServiceCategory, 
  type QuoteServiceTier, 
  type QuoteAddOn 
} from '@/lib/quote-calculator-constants';
import { type QuoteBreakdown } from '@/lib/quote-calculations';

interface QuoteState {
  selectedCategory: QuoteServiceCategory;
  selectedTier: QuoteServiceTier;
  guestCount: number[];
  selectedAddOns: QuoteAddOn[];
  step: number;
  quote: QuoteBreakdown | null;
  isCalculating: boolean;
}

type QuoteAction = 
  | { type: 'SET_CATEGORY'; payload: QuoteServiceCategory }
  | { type: 'SET_TIER'; payload: QuoteServiceTier }
  | { type: 'SET_GUEST_COUNT'; payload: number[] }
  | { type: 'TOGGLE_ADD_ON'; payload: QuoteAddOn }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_QUOTE'; payload: QuoteBreakdown | null }
  | { type: 'SET_CALCULATING'; payload: boolean }
  | { type: 'RESET_STATE' };

const initialState: QuoteState = {
  selectedCategory: 'corporate',
  selectedTier: 'premium',
  guestCount: [QUOTE_GUEST_CONFIG.default],
  selectedAddOns: [],
  step: 1,
  quote: null,
  isCalculating: false
};

function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        step: 2
      };
    case 'SET_TIER':
      return {
        ...state,
        selectedTier: action.payload,
        step: 3
      };
    case 'SET_GUEST_COUNT':
      return {
        ...state,
        guestCount: action.payload
      };
    case 'TOGGLE_ADD_ON':
      return {
        ...state,
        selectedAddOns: state.selectedAddOns.includes(action.payload)
          ? state.selectedAddOns.filter(id => id !== action.payload)
          : [...state.selectedAddOns, action.payload]
      };
    case 'SET_STEP':
      return {
        ...state,
        step: action.payload
      };
    case 'SET_QUOTE':
      return {
        ...state,
        quote: action.payload
      };
    case 'SET_CALCULATING':
      return {
        ...state,
        isCalculating: action.payload
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

/**
 * Custom hook for quote calculator state management
 * Provides centralized state management with reducer pattern
 */
export function useQuoteReducer() {
  const [state, dispatch] = useReducer(quoteReducer, initialState);

  const actions = {
    setCategory: useCallback((category: QuoteServiceCategory) => {
      dispatch({ type: 'SET_CATEGORY', payload: category });
    }, []),

    setTier: useCallback((tier: QuoteServiceTier) => {
      dispatch({ type: 'SET_TIER', payload: tier });
    }, []),

    setGuestCount: useCallback((count: number[]) => {
      dispatch({ type: 'SET_GUEST_COUNT', payload: count });
    }, []),

    toggleAddOn: useCallback((addOn: QuoteAddOn) => {
      dispatch({ type: 'TOGGLE_ADD_ON', payload: addOn });
    }, []),

    setStep: useCallback((step: number) => {
      dispatch({ type: 'SET_STEP', payload: step });
    }, []),

    setQuote: useCallback((quote: QuoteBreakdown | null) => {
      dispatch({ type: 'SET_QUOTE', payload: quote });
    }, []),

    setCalculating: useCallback((calculating: boolean) => {
      dispatch({ type: 'SET_CALCULATING', payload: calculating });
    }, []),

    resetState: useCallback(() => {
      dispatch({ type: 'RESET_STATE' });
    }, [])
  };

  return {
    state,
    actions
  };
}