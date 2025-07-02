/**
 * Vitest setup file for testing environment configuration
 * Configures testing utilities and mocks for comprehensive testing
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Mock ResizeObserver for responsive components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock performance API for performance testing
Object.defineProperty(global, 'performance', {
  value: {
    ...global.performance,
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 10000000,
      jsHeapSizeLimit: 100000000
    }
  }
});

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
});

// Mock comprehensive logger to prevent console spam in tests
vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    log: vi.fn()
  },
  ComponentLogger: {
    lifecycle: vi.fn(),
    stateChange: vi.fn(),
    rerender: vi.fn(),
    performance: vi.fn()
  },
  APILogger: {
    request: vi.fn(),
    response: vi.fn(),
    error: vi.fn(),
    retry: vi.fn()
  },
  UserFlowLogger: {
    navigation: vi.fn(),
    interaction: vi.fn(),
    form: vi.fn(),
    error: vi.fn(),
    breadcrumb: vi.fn()
  },
  LoggerUtils: {
    generateRequestId: vi.fn(() => 'test-request-id'),
    generateSessionId: vi.fn(() => 'test-session-id'),
    sanitizeData: vi.fn(data => data)
  }
}));

// Mock Supabase client for API testing
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
      update: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ data: [], error: null }),
      upsert: vi.fn().mockResolvedValue({ data: [], error: null })
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null })
    },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null })
  }
}));

// Mock TanStack Query for API testing
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: vi.fn()
    })),
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isLoading: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: null
    })),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn()
    }))
  };
});

// Mock react-router-dom for navigation testing
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null })),
    useParams: vi.fn(() => ({})),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()])
  };
});

// Mock date-fns locale for internationalization testing
vi.mock('date-fns/locale', () => ({
  nl: {
    code: 'nl',
    formatDistance: vi.fn(),
    formatRelative: vi.fn(),
    localize: {
      ordinalNumber: vi.fn(),
      era: vi.fn(),
      quarter: vi.fn(),
      month: vi.fn(),
      day: vi.fn(),
      dayPeriod: vi.fn()
    },
    formatLong: {
      date: vi.fn(),
      time: vi.fn(),
      dateTime: vi.fn()
    },
    match: {
      ordinalNumber: vi.fn(),
      era: vi.fn(),
      quarter: vi.fn(),
      month: vi.fn(),
      day: vi.fn(),
      dayPeriod: vi.fn()
    }
  }
}));

// Mock Error Boundary for error testing
vi.mock('@/components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children, fallback }: any) => {
    try {
      return children;
    } catch (error) {
      return fallback || 'Error occurred';
    }
  },
  withErrorBoundary: (Component: any) => Component,
  AsyncErrorBoundary: ({ children }: any) => children
}));

// Global test utilities
export const createMockProps = (overrides = {}) => ({
  ...overrides
});

export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  currentTarget: { value: '' },
  ...overrides
});

export const createMockFormData = (data = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  phone: '+31612345678',
  guests: 25,
  date: new Date('2024-12-25'),
  time: '18:00',
  ...data
});

// Mock localStorage for session testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn()
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage for session testing
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn()
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Console spy utilities for testing
export const createConsoleSpy = () => {
  const consoleSpy = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {})
  };

  return {
    ...consoleSpy,
    restore: () => {
      Object.values(consoleSpy).forEach(spy => spy.mockRestore());
    }
  };
};

// Performance testing utilities
export const measurePerformance = async (fn: () => Promise<void> | void) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};

// Accessibility testing utilities
export const checkAccessibility = async (container: HTMLElement) => {
  // Mock accessibility check - would integrate with axe-core in real implementation
  const issues: string[] = [];
  
  // Check for alt text on images
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.getAttribute('alt')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for button accessibility
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.textContent && !button.getAttribute('aria-label')) {
      issues.push(`Button ${index + 1} missing accessible name`);
    }
  });

  return issues;
};