# Floating Booking Widget - Test Documentation

## Overview

This document describes the comprehensive testing strategy for the Floating Booking Widget feature implemented for Wesley's Ambacht catering service.

## Test Structure

### 1. Unit Tests (`floating-booking-widget.spec.ts`)
Tests individual widget behaviors in isolation:
- **Visibility Logic**: Widget appears after scroll threshold
- **Expand/Collapse**: State management and UI transitions
- **Click Handlers**: Booking and phone button functionality
- **Keyboard Navigation**: Full keyboard accessibility
- **ARIA Compliance**: Proper labels and roles
- **Mobile Optimization**: Touch targets and responsive behavior

### 2. Accessibility Tests (`accessibility.spec.ts`)
Ensures WCAG 2.1 AA compliance:
- **Axe-core Scanning**: Automated accessibility violation detection
- **Color Contrast**: Verifies text readability
- **Focus Management**: Keyboard navigation flow
- **Screen Reader Support**: Proper ARIA implementation
- **Reduced Motion**: Respects user preferences
- **Touch Targets**: Minimum 44x44px for mobile

### 3. Integration Tests (`integration/booking-flow.spec.ts`)
Tests complete user journeys:
- **Full Booking Flow**: Widget → Form → Submission
- **Phone Contact Flow**: Clipboard functionality
- **Mobile Journey**: Tel: link handling
- **Keyboard-Only Journey**: Complete accessibility path
- **Error Handling**: Form validation and recovery
- **Performance Impact**: Widget doesn't block interactions

### 4. Visual Regression Tests
Captures visual snapshots:
- **Collapsed State**: Desktop and mobile views
- **Expanded State**: All interactive states
- **Hover States**: Visual feedback
- **Focus States**: Keyboard navigation indicators

## Running Tests

### Local Development
```bash
# Install Playwright browsers (first time only)
npm run test:install

# Run all tests
npm test

# Run specific test suites
npm run test:widget      # Widget functionality tests
npm run test:a11y        # Accessibility tests  
npm run test:mobile      # Mobile-specific tests
npm run test:visual      # Visual regression tests

# Interactive mode
npm run test:ui          # Opens Playwright UI
npm run test:debug       # Debug mode with browser
npm run test:headed      # Run with visible browser

# Update visual snapshots
npm run test:update-snapshots
```

### CI/CD Pipeline
Tests run automatically on:
- Push to `main` or `develop` branches
- Pull request creation/update
- Manual workflow dispatch

## Test Coverage

### Functional Coverage
- ✅ Widget visibility triggers
- ✅ Expand/collapse animations
- ✅ Scroll to booking form
- ✅ Phone number clipboard copy
- ✅ Toast notifications
- ✅ Form submission flow
- ✅ Mobile tel: link handling

### Browser Coverage
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)
- ✅ Microsoft Edge

### Accessibility Coverage
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast (4.5:1 minimum)
- ✅ Focus indicators
- ✅ Touch target sizes
- ✅ Reduced motion support
- ✅ ARIA labels and roles

### Performance Metrics
- Page load: < 3s DOM ready, < 5s complete
- Widget animation: 60fps minimum
- No blocking of main thread
- No layout shifts from widget

## Test Data

### Default Test Values
```javascript
{
  name: "Test Gebruiker",
  email: "test@example.com",
  message: "Ik wil graag een reservering maken voor 20 personen.",
  phone: "+31 20 123 4567"
}
```

### Viewport Sizes
- Desktop: 1280x720 (default)
- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)

## Debugging Failed Tests

### Local Debugging
1. Run with `--headed` flag to see browser
2. Use `test:debug` for step-by-step execution
3. Check `test-results/` folder for:
   - Screenshots on failure
   - Videos of test execution
   - Trace files for timeline analysis

### CI Debugging
1. Download artifacts from GitHub Actions
2. View HTML report with `npx playwright show-report`
3. Check visual diff images for regression tests
4. Review console logs in test output

## Best Practices

### Writing New Tests
1. Use descriptive test names
2. Follow AAA pattern: Arrange, Act, Assert
3. Use data-testid for reliable selectors
4. Mock external dependencies
5. Keep tests independent and idempotent

### Maintaining Tests
1. Run tests before committing
2. Update snapshots intentionally
3. Fix flaky tests immediately
4. Keep test data realistic
5. Document complex test scenarios

## Known Limitations

1. **Tel: URLs**: Playwright cannot fully test phone dialing
2. **Clipboard API**: Requires permission grants in tests
3. **Animations**: May need explicit waits for completion
4. **Touch Events**: Limited simulation in desktop browsers

## Future Enhancements

1. **Performance Budgets**: Add Lighthouse CI integration
2. **Cross-Browser Screenshots**: Visual tests on all browsers
3. **Load Testing**: Widget performance under stress
4. **A/B Testing**: Support for variant testing
5. **Analytics Validation**: Ensure tracking works correctly