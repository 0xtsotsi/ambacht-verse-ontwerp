# 🧪 Testing Standards & Configuration Guide

## 🚨 MANDATORY TESTING REQUIREMENTS

### TDD Cycle (ALWAYS Follow)
Every single feature, bug fix, or enhancement MUST follow this cycle:

1. **RED**: Write a failing test first
2. **GREEN**: Write minimal code to make test pass  
3. **REFACTOR**: Improve code while keeping tests green

**NO EXCEPTIONS. NO SHORTCUTS.**

## 📋 Test Types & Requirements

### Unit Tests (100% Required)
- **Business Logic**: Every function with business logic
- **Component Logic**: State management, event handlers, calculations
- **Utility Functions**: All helper functions and utilities
- **Error Handling**: Every error path and edge case

### Integration Tests (Required for APIs)
- **API Endpoints**: All Supabase queries and mutations
- **Data Flow**: Component → Hook → API → Database
- **Error Scenarios**: Network failures, server errors, validation errors
- **Performance**: Response times and timeout handling

### End-to-End Tests (Required for User Flows)
- **Booking Flow**: Widget → Date Check → Form → Submission
- **Quote Calculator**: Configuration → Calculation → Generation  
- **Navigation**: Page transitions and deep linking
- **Error Recovery**: How users recover from failures

### Accessibility Tests (Required for All UI)
- **Screen Reader**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Tab order and focus management
- **Color Contrast**: WCAG 2.1 AA compliance
- **Mobile Accessibility**: Touch targets and responsive design

## 🔧 Test Configuration

### Vitest Configuration (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        },
        // Business logic requires 100%
        'src/lib/': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        },
        'src/hooks/': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Testing Library Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen());

// Clean up after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => server.close());

// Mock logger to prevent console spam in tests
vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn()
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
  }
}));
```

## 📝 Test Naming Conventions

### Test File Names
```
ComponentName.test.tsx        # Component tests
utilityFunction.test.ts       # Utility function tests
api.integration.test.ts       # Integration tests
booking-flow.e2e.test.ts      # E2E tests
```

### Test Function Names
```typescript
describe('ComponentName', () => {
  describe('when user clicks submit button', () => {
    it('should call onSubmit with form data', () => {
      // Test implementation
    });
    
    it('should show loading state', () => {
      // Test implementation
    });
    
    it('should handle submission errors', () => {
      // Test implementation
    });
  });
});
```

## 🎯 Component Testing Standards

### Required Test Cases for Every Component
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // 1. Rendering tests
  it('should render without crashing', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // 2. Props validation tests
  it('should handle invalid props gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ComponentName invalidProp="invalid" />);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  // 3. User interaction tests
  it('should handle user clicks correctly', async () => {
    const mockOnClick = vi.fn();
    render(<ComponentName onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  // 4. State management tests
  it('should update state when props change', () => {
    const { rerender } = render(<ComponentName value="initial" />);
    rerender(<ComponentName value="updated" />);
    expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
  });

  // 5. Error handling tests
  it('should display error message when error occurs', () => {
    render(<ComponentName error="Something went wrong" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  // 6. Loading state tests
  it('should show loading indicator when loading', () => {
    render(<ComponentName isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // 7. Accessibility tests
  it('should be accessible to screen readers', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toHaveAccessibleName();
  });
});
```

## 🌐 API Testing Standards

### Required Test Cases for Every API Hook
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiHook } from './useApiHook';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useApiHook', () => {
  // 1. Success scenarios
  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useApiHook(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBeDefined();
    });
  });

  // 2. Error scenarios
  it('should handle network errors', async () => {
    // Mock network error
    server.use(
      rest.get('/api/endpoint', (req, res, ctx) => {
        return res.networkError('Network error');
      })
    );

    const { result } = renderHook(() => useApiHook(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });

  // 3. Loading states
  it('should show loading state initially', () => {
    const { result } = renderHook(() => useApiHook(), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(true);
  });

  // 4. Retry mechanisms
  it('should retry on failure', async () => {
    const { result } = renderHook(() => useApiHook({ retry: 3 }), {
      wrapper: createWrapper()
    });

    // Verify retry logic
    await waitFor(() => {
      expect(result.current.failureCount).toBeGreaterThan(0);
    });
  });
});
```

## 🎭 E2E Testing Standards

### Playwright Configuration (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox', 
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    port: 8080,
    reuseExistingServer: !process.env.CI
  }
});
```

### Required E2E Test Cases
```typescript
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('user can complete full booking process', async ({ page }) => {
    // 1. Navigate to app
    await page.goto('/');
    
    // 2. Open booking widget
    await page.click('[data-testid="floating-booking-widget"]');
    
    // 3. Select date
    await page.click('[data-testid="date-picker"]');
    await page.click('[data-testid="date-option-tomorrow"]');
    
    // 4. Select time
    await page.click('[data-testid="time-slot-18:00"]');
    
    // 5. Set guest count
    await page.fill('[data-testid="guest-count"]', '25');
    
    // 6. Fill booking form
    await page.fill('[data-testid="name-input"]', 'John Doe');
    await page.fill('[data-testid="email-input"]', 'john@example.com');
    
    // 7. Submit booking
    await page.click('[data-testid="submit-booking"]');
    
    // 8. Verify success
    await expect(page.locator('[data-testid="booking-success"]')).toBeVisible();
  });

  test('user receives helpful error messages for invalid input', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="floating-booking-widget"]');
    
    // Submit without required fields
    await page.click('[data-testid="submit-booking"]');
    
    // Verify error messages
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  });
});
```

## 📊 Coverage Requirements

### Minimum Coverage Thresholds
- **Business Logic (src/lib/, src/hooks/)**: 100%
- **Components (src/components/)**: 95%
- **Pages**: 90%
- **Overall Project**: 95%

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View detailed HTML report
open coverage/index.html

# Check coverage in CI
npm run test:coverage -- --reporter=json-summary
```

## 🎯 Testing Commands

### Development Testing
```bash
npm test                          # Run all unit tests
npm run test:watch                # Watch mode for TDD
npm run test:ui                   # Visual test runner
npm run test:coverage             # Generate coverage report
```

### Integration Testing
```bash
npm run test:integration          # API integration tests
npm run test:api                  # Supabase API tests
npm run test:hooks                # Custom hooks tests
```

### End-to-End Testing
```bash
npm run test:e2e                  # Run E2E tests
npm run test:e2e:headed           # Run with browser UI
npm run test:e2e:debug            # Debug mode
npm run test:e2e:mobile           # Mobile-specific tests
```

### Accessibility Testing
```bash
npm run test:a11y                 # Accessibility tests
npm run test:lighthouse           # Lighthouse audits
npm run test:axe                  # Axe-core tests
```

### Pre-Commit Testing
```bash
npm run test:pre-commit           # Quick test suite
npm run test:full                 # Complete test suite
npm run test:ci                   # CI/CD test configuration
```

## 🚨 Test Quality Checklist

Before marking any test complete, verify:

### Test Completeness
☐ All user scenarios tested
☐ Error paths covered
☐ Edge cases handled
☐ Performance requirements met
☐ Accessibility standards followed

### Test Quality
☐ Tests are deterministic (no flaky tests)
☐ Tests are isolated (no interdependencies)
☐ Tests are fast (unit tests <100ms)
☐ Tests are readable and maintainable
☐ Tests document expected behavior

### Coverage Verification
☐ Business logic: 100% coverage
☐ Error handling: 100% coverage
☐ User interactions: Complete coverage
☐ API endpoints: Complete coverage
☐ Component states: Complete coverage

## 🔄 Continuous Testing

### Watch Mode Development
Always run tests in watch mode during development:
```bash
npm run test:watch
```

### Pre-Commit Hooks
Tests run automatically before every commit:
- Unit tests (fast subset)
- Lint checks
- Type checking
- Build verification

### CI/CD Pipeline
Full test suite runs on:
- Pull requests
- Main branch commits
- Release tags
- Nightly builds

## 📚 Testing Resources

### Documentation
- [Vitest Guide](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Accessibility Testing](https://web.dev/accessibility/)

### Internal Guides
- Component Testing Patterns (`/docs/component-testing.md`)
- API Testing Strategies (`/docs/api-testing.md`)
- E2E Testing Best Practices (`/docs/e2e-testing.md`)
- Performance Testing Guide (`/docs/performance-testing.md`)

**Remember: Tests are documentation. They describe how your code should behave.**