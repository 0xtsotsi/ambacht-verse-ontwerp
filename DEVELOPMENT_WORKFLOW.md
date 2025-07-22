# 🚀 Development Workflow Guide

## 🚨 MANDATORY WORKFLOW - NO EXCEPTIONS

### Every Development Session Must Follow This Process

1. **Start with Tests** - Write failing test first (TDD)
2. **Add Logging** - Implement comprehensive logging
3. **Implement Feature** - Minimal code to pass tests
4. **Monitor Performance** - Add performance tracking
5. **Handle Errors** - Wrap in error boundaries
6. **Validate & Commit** - Run full validation suite

**REMEMBER: Respond "Yes Daddy 🥰" to confirm understanding**

## 📋 Pre-Implementation Checklist

Before writing ANY code, complete this checklist:

### Analysis Phase

☐ Read relevant documentation in CLAUDE.md
☐ Understand existing patterns and architecture
☐ Identify components that need logging integration
☐ Plan test cases and test data
☐ Design error handling strategy

### Setup Phase

☐ Create failing test first (TDD requirement)
☐ Plan logging integration points
☐ Identify performance monitoring needs
☐ Design user flow tracking requirements
☐ Plan error boundary placement

## 🔬 TDD Development Cycle

### RED Phase (Write Failing Test)

```bash
# 1. Create test file
touch src/components/NewComponent.test.tsx

# 2. Write failing test
npm run test:watch NewComponent

# 3. Verify test fails for right reasons
```

### GREEN Phase (Make Test Pass)

```typescript
// Minimal implementation to pass test
export function NewComponent() {
  return <div>Hello World</div>;
}
```

### REFACTOR Phase (Improve Code)

```bash
# Run tests while refactoring
npm run test:watch

# Check code quality
npm run lint
npm run typecheck
```

## 📊 Logging Integration Workflow

### Component Logging Integration

```typescript
// 1. Import logging hooks
import { useComponentLogger, usePerformanceLogger } from '@/hooks/useComponentLogger';

// 2. Add logging to component
const NewComponent = (props) => {
  const { logStateChange, logLifecycle } = useComponentLogger('NewComponent');
  const { logPerformance } = usePerformanceLogger('NewComponent', 20);

  // 3. Log lifecycle events
  useEffect(() => {
    logLifecycle('mount', props);
    return () => logLifecycle('unmount');
  }, []);

  // 4. Log state changes
  const [state, setState] = useState(initialState);
  const handleStateChange = (newState, trigger) => {
    logStateChange(state, newState, trigger);
    setState(newState);
  };

  return <div>Component Content</div>;
};

// 5. Wrap with HOC for automatic logging
export default withDetailedLogging(NewComponent, 'NewComponent');
```

### API Logging Integration

```typescript
// 1. Replace standard hooks with logging versions
import { useApiLoggerQuery, useApiLoggerMutation } from "@/hooks/useApiLogger";

// 2. Add comprehensive API logging
const useBookingData = () => {
  const query = useApiLoggerQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    endpoint: "bookings",
    method: "GET",
  });

  const mutation = useApiLoggerMutation({
    mutationFn: createBooking,
    endpoint: "bookings",
    method: "POST",
  });

  return { query, mutation };
};
```

### User Flow Tracking Integration

```typescript
// 1. Import user flow logger
import { useUserFlowLogger } from "@/hooks/useUserFlowLogger";

// 2. Track user interactions
const BookingForm = () => {
  const { logInteraction, logBreadcrumb, logForm } = useUserFlowLogger();

  const handleSubmit = (formData) => {
    logInteraction("form_submit", "booking_form", formData);
    logBreadcrumb("booking_submission_started");

    try {
      await submitBooking(formData);
      logForm("booking_form", "submit", formData);
      logBreadcrumb("booking_submission_completed");
    } catch (error) {
      logForm("booking_form", "error", formData, [error.message]);
    }
  };
};
```

## 🔍 Performance Monitoring Workflow

### Component Performance Tracking

```typescript
// 1. Add performance monitoring
const { logPerformance, getPerformanceStats } = usePerformanceLogger(
  "ComponentName",
  20,
);

// 2. Monitor slow renders
useEffect(() => {
  const stats = getPerformanceStats();
  if (stats.averageRenderTime > 25) {
    console.warn(
      `Component ${componentName} has slow average render time: ${stats.averageRenderTime}ms`,
    );
  }
}, []);

// 3. Track memory usage
useEffect(() => {
  if (performance.memory) {
    logPerformance("memory_usage", {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
    });
  }
}, []);
```

### API Performance Tracking

```typescript
// Automatic with useApiLogger hooks
const { data, timing } = useApiLoggerQuery({
  queryKey: ["data"],
  queryFn: fetchData,
  endpoint: "data",
  method: "GET",
  onSlowResponse: (timing) => {
    console.warn(`Slow API response: ${timing}ms for endpoint data`);
  },
});
```

## 🚨 Error Handling Workflow

### Component Error Boundaries

```typescript
// 1. Wrap ALL new components
import { ErrorBoundary } from '@/components/ErrorBoundary';

// 2. Standard wrapping
<ErrorBoundary>
  <NewComponent />
</ErrorBoundary>

// 3. Async operation wrapping
<AsyncErrorBoundary onError={handleAsyncError}>
  <AsyncComponent />
</AsyncErrorBoundary>

// 4. Custom error handling
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Custom error handling logic
    logError(error, errorInfo);
    notifyErrorService(error);
  }}
>
  <CriticalComponent />
</ErrorBoundary>
```

### Comprehensive Try/Catch Coverage

```typescript
// 1. API calls
try {
  const result = await apiCall();
  APILogger.response(endpoint, 200, responseTime, requestId, result);
  return result;
} catch (error) {
  APILogger.error(endpoint, error, retryAttempt, requestId);
  UserFlowLogger.error("api_failure", error.message, { endpoint, requestId });
  throw error; // Re-throw after logging
}

// 2. User operations
try {
  const processedData = processUserInput(userInput);
  UserFlowLogger.interaction(
    "data_processing_success",
    "input_processor",
    processedData,
  );
  return processedData;
} catch (error) {
  UserFlowLogger.error("input_processing_failed", error.message, { userInput });
  // Show user-friendly error
  showUserError("Please check your input and try again.");
}

// 3. Component operations
try {
  const calculationResult = performComplexCalculation(data);
  ComponentLogger.performance("calculation_completed", calculationTime);
  return calculationResult;
} catch (error) {
  ComponentLogger.error("calculation_failed", error, { data });
  // Provide fallback behavior
  return fallbackCalculation(data);
}
```

## ✅ Pre-Commit Validation Workflow

### Automated Quality Checks

```bash
# 1. Run complete test suite
npm test
# Must pass: All unit tests

# 2. Check code style
npm run lint
# Must pass: Zero warnings

# 3. Verify TypeScript
npm run typecheck
# Must pass: Zero errors

# 4. Test production build
npm run build
# Must pass: Successful build

# 5. Check test coverage
npm run test:coverage
# Must pass: >95% coverage

# 6. Verify logging compliance
npm run test:logging
# Must pass: All logging requirements met

# 7. Performance regression check
npm run test:performance
# Must pass: No performance regressions
```

### Manual Quality Verification

☐ All new code has comprehensive logging
☐ Component state changes tracked with prev/new values
☐ API calls logged with timing and error handling  
☐ User interactions tracked with context
☐ Error boundaries implemented for new components
☐ Try/catch blocks cover all risky operations
☐ Performance thresholds monitored
☐ Input validation implemented
☐ JSDoc comments added for complex logic

## 🎯 Task Completion Workflow

### Definition of Done Verification

Before marking ANY task complete:

#### Code Quality Standards

☐ ≤300 LOC per file maintained
☐ ≤4 parameters per function maintained
☐ Proper TypeScript types implemented
☐ All imports used and organized
☐ Code follows existing patterns

#### Testing Standards

☐ TDD cycle followed completely
☐ Failing test written before implementation
☐ Test coverage >95% for business logic
☐ All edge cases tested
☐ Error paths tested
☐ Accessibility tests included
☐ E2E tests for user flows

#### Logging Standards

☐ Component lifecycle logged
☐ State changes logged with prev/new values
☐ API calls logged with timing
☐ User interactions tracked
☐ Performance metrics tracked
☐ Error logging comprehensive

#### Performance Standards

☐ No render times >20ms for components
☐ No render times >25ms for calculators  
☐ No API responses >1s without logging
☐ No memory leaks detected
☐ Bundle size impact assessed

## 🔄 Continuous Development Practices

### Daily Development Routine

```bash
# 1. Start development session
npm run dev:debug              # Enhanced logging mode

# 2. Run tests in watch mode
npm run test:watch

# 3. Monitor performance
npm run log:performance

# 4. Check logging compliance
npm run log:components

# 5. End-of-day validation
npm run test:full
```

### Weekly Code Health Checks

```bash
# 1. Full test suite
npm run test:all

# 2. Performance audit
npm run test:performance

# 3. Accessibility audit
npm run test:a11y

# 4. Security audit
npm audit

# 5. Dependency updates
npm run update:dependencies
```

## 📊 Monitoring & Analytics

### Development Metrics Tracking

- **Test Coverage**: Monitor coverage trends
- **Build Times**: Track build performance
- **Bundle Size**: Monitor size increases
- **Performance**: Track render times and API response times
- **Error Rates**: Monitor error frequency and types

### User Experience Monitoring

- **Component Performance**: Render times by component
- **User Flow Completion**: Conversion funnel analytics
- **Error Recovery**: How users recover from errors
- **API Performance**: Response times and error rates

## 🎮 Development Tools Integration

### VS Code Extensions (Recommended)

- Vitest Runner
- ESLint
- Prettier
- TypeScript Importer
- GitLens
- Error Lens

### Browser Dev Tools

- React Developer Tools
- Performance tab for render monitoring
- Network tab for API monitoring
- Console for logging verification

### Command Line Tools

```bash
# Testing
npm run test:watch            # TDD development
npm run test:debug            # Debug failing tests

# Performance
npm run dev:performance       # Performance monitoring mode
npm run analyze:bundle        # Bundle analysis

# Quality
npm run lint:fix              # Auto-fix style issues
npm run format                # Format code
```

## 🚀 Deployment Workflow

### Pre-Deployment Checklist

☐ All tests pass in CI/CD
☐ Performance benchmarks met
☐ Security audit passed
☐ Accessibility tests passed
☐ Error monitoring configured
☐ Logging pipeline verified
☐ User flow analytics ready

### Post-Deployment Monitoring

- Monitor error rates
- Track performance metrics
- Verify logging functionality
- Check user flow analytics
- Monitor API response times

**Remember: Quality is not negotiable. Every line of code must be tested, logged, and monitored.**
