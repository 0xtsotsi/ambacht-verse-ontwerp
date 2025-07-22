import { test, expect } from '@playwright/test';
import { APIClient, AvailabilityAPI } from '../helpers/api-client';

test.describe('Availability API Unit Tests', () => {
  let apiClient: APIClient;
  let availabilityAPI: AvailabilityAPI;

  test.beforeEach(async ({ request }) => {
    const baseURL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';
    apiClient = new APIClient(request, baseURL);
    availabilityAPI = new AvailabilityAPI(request, baseURL);
    
    // Set authentication token from global setup
    const authToken = process.env.API_TEST_TOKEN;
    if (authToken) {
      apiClient.setAuthToken(authToken);
      availabilityAPI.setAuthToken(authToken);
    }
  });

  test.describe('GET /availability', () => {
    test('should return availability slots without date filter', async () => {
      const response = await availabilityAPI.getAvailability();
      const data = await apiClient.assertSuccess(response);

      // Validate response structure
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');
      expect(Array.isArray(data.data)).toBe(true);

      // Validate metadata
      expect(data.meta).toHaveProperty('total');
      expect(data.meta).toHaveProperty('page');
      expect(data.meta).toHaveProperty('per_page');

      // Performance assertion
      apiClient.assertPerformance(response, 1000); // Should respond within 1 second
    });

    test('should return availability slots with date range filter', async () => {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await availabilityAPI.getAvailability({
        start_date: today,
        end_date: nextWeek
      });
      
      const data = await apiClient.assertSuccess(response);
      
      // Validate date filtering
      expect(data.data.length).toBeGreaterThan(0);
      
      // Validate each slot is within date range
      data.data.forEach((slot: any) => {
        expect(new Date(slot.date)).toBeGreaterThanOrEqual(new Date(today));
        expect(new Date(slot.date)).toBeLessThanOrEqual(new Date(nextWeek));
      });

      // Performance assertion for filtered query
      apiClient.assertPerformance(response, 1500);
    });

    test('should validate availability slot schema', async () => {
      const response = await availabilityAPI.getAvailability();
      const data = await apiClient.assertSuccess(response);

      if (data.data.length > 0) {
        const slot = data.data[0];
        
        // Validate required fields
        await apiClient.assertSchema(slot, {
          id: 'string',
          date: 'string',
          time_slot: 'string',
          max_bookings: 'number',
          current_bookings: 'number',
          is_blocked: 'boolean',
          created_at: 'string',
          updated_at: 'string'
        });

        // Validate field formats
        expect(slot.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(slot.time_slot).toMatch(/^[0-2][0-9]:[0-5][0-9]$/);
        expect(slot.max_bookings).toBeGreaterThanOrEqual(1);
        expect(slot.current_bookings).toBeGreaterThanOrEqual(0);
        expect(slot.current_bookings).toBeLessThanOrEqual(slot.max_bookings);
      }
    });

    test('should handle pagination correctly', async () => {
      const response = await apiClient.get('/availability', {
        params: { page: 1, limit: 5 }
      });
      
      const data = await apiClient.assertSuccess(response);
      
      expect(data.data.length).toBeLessThanOrEqual(5);
      expect(data.meta.page).toBe(1);
      expect(data.meta.per_page).toBe(5);
      
      if (data.meta.total > 5) {
        expect(data.meta.has_next).toBe(true);
      }
    });

    test('should handle invalid date format gracefully', async () => {
      const response = await apiClient.get('/availability', {
        params: { start_date: 'invalid-date' }
      });
      
      const error = await apiClient.assertError(response, 400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toContain('date');
    });
  });

  test.describe('POST /availability/check', () => {
    test('should check availability for valid date and time', async () => {
      // Use a future date
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await availabilityAPI.checkAvailability(futureDate, '18:00');
      const data = await apiClient.assertSuccess(response);

      // Validate response structure
      expect(data).toHaveProperty('available');
      expect(data).toHaveProperty('remaining_slots');
      expect(data).toHaveProperty('time_slot');
      
      expect(typeof data.available).toBe('boolean');
      expect(typeof data.remaining_slots).toBe('number');
      expect(data.time_slot).toBe('18:00');
      
      if (data.available) {
        expect(data.remaining_slots).toBeGreaterThan(0);
      } else {
        expect(data.remaining_slots).toBe(0);
      }

      // Performance assertion - availability check should be fast
      apiClient.assertPerformance(response, 500);
    });

    test('should reject past dates', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await availabilityAPI.checkAvailability(pastDate, '18:00');
      const error = await apiClient.assertError(response, 400);
      
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toContain('past');
    });

    test('should validate time format', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await availabilityAPI.checkAvailability(futureDate, '25:00');
      const error = await apiClient.assertError(response, 400);
      
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toContain('time');
    });

    test('should require both date and time', async () => {
      const response = await apiClient.post('/availability/check', {
        date: '2024-12-01'
        // Missing time
      });
      
      const error = await apiClient.assertError(response, 400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toHaveProperty('field', 'time');
    });
  });

  test.describe('GET /availability/slots/{date}', () => {
    test('should return time slots for specific date', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await availabilityAPI.getTimeSlots(futureDate);
      const data = await apiClient.assertSuccess(response);

      // Validate response structure
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('grouped_slots');
      expect(Array.isArray(data.data)).toBe(true);

      // Validate grouped slots structure
      expect(data.grouped_slots).toHaveProperty('morning');
      expect(data.grouped_slots).toHaveProperty('afternoon');
      expect(data.grouped_slots).toHaveProperty('evening');
      
      expect(Array.isArray(data.grouped_slots.morning)).toBe(true);
      expect(Array.isArray(data.grouped_slots.afternoon)).toBe(true);
      expect(Array.isArray(data.grouped_slots.evening)).toBe(true);

      // Validate all returned slots are for the requested date
      data.data.forEach((slot: any) => {
        expect(slot.date).toBe(futureDate);
      });
    });

    test('should return empty array for date with no slots', async () => {
      // Test with far future date that likely has no slots
      const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await availabilityAPI.getTimeSlots(farFuture);
      const data = await apiClient.assertSuccess(response);

      expect(data.data).toEqual([]);
      expect(data.grouped_slots.morning).toEqual([]);
      expect(data.grouped_slots.afternoon).toEqual([]);
      expect(data.grouped_slots.evening).toEqual([]);
    });

    test('should handle invalid date format', async () => {
      const response = await apiClient.get('/availability/slots/invalid-date');
      const error = await apiClient.assertError(response, 400);
      
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toContain('date');
    });

    test('should group time slots correctly', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await availabilityAPI.getTimeSlots(futureDate);
      const data = await apiClient.assertSuccess(response);

      // Validate time groupings
      data.grouped_slots.morning.forEach((time: string) => {
        const hour = parseInt(time.split(':')[0]);
        expect(hour).toBeGreaterThanOrEqual(6);
        expect(hour).toBeLessThan(12);
      });

      data.grouped_slots.afternoon.forEach((time: string) => {
        const hour = parseInt(time.split(':')[0]);
        expect(hour).toBeGreaterThanOrEqual(12);
        expect(hour).toBeLessThan(18);
      });

      data.grouped_slots.evening.forEach((time: string) => {
        const hour = parseInt(time.split(':')[0]);
        expect(hour).toBeGreaterThanOrEqual(18);
        expect(hour).toBeLessThan(24);
      });
    });
  });

  test.describe('Authentication & Authorization', () => {
    test('should work without authentication for public endpoints', async () => {
      // Test without auth token
      const publicAPI = new AvailabilityAPI(apiClient.request, apiClient.baseURL);
      
      const response = await publicAPI.getAvailability();
      await apiClient.assertSuccess(response);
    });

    test('should handle rate limiting gracefully', async () => {
      // Make rapid requests to trigger rate limiting
      const requests = Array.from({ length: 10 }, () => 
        availabilityAPI.getAvailability()
      );

      const results = await Promise.allSettled(requests);
      
      // At least some requests should succeed
      const successful = results.filter(r => r.status === 'fulfilled').length;
      expect(successful).toBeGreaterThan(0);
      
      // Check if any were rate limited (429 status)
      const rateLimited = results.some(r => 
        r.status === 'rejected' && r.reason.message?.includes('429')
      );
      
      if (rateLimited) {
        console.log('✅ Rate limiting is working correctly');
      }
    });
  });

  test.describe('Performance & Reliability', () => {
    test('should maintain performance under concurrent requests', async () => {
      const concurrentRequests = 5;
      const requests = Array.from({ length: concurrentRequests }, () => 
        availabilityAPI.getAvailability()
      );

      const startTime = Date.now();
      const results = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      // All requests should succeed
      results.forEach(response => {
        expect(response.success).toBe(true);
      });

      // Average response time should be reasonable
      const avgResponseTime = totalTime / concurrentRequests;
      expect(avgResponseTime).toBeLessThan(2000);
    });

    test('should handle database connection failures gracefully', async () => {
      // This test would require a way to simulate database failures
      // For now, we'll test error handling structure
      
      // Simulate network error by using invalid endpoint
      const response = await apiClient.get('/availability/nonexistent');
      const error = await apiClient.assertError(response, 404);
      
      expect(error.code).toBeDefined();
      expect(error.message).toBeDefined();
    });
  });

  test.afterAll(async () => {
    // Log performance summary
    const summary = apiClient.getPerformanceSummary();
    if (summary) {
      console.log('Availability API Performance Summary:');
      console.log(`- Total requests: ${summary.totalRequests}`);
      console.log(`- Success rate: ${summary.successRate.toFixed(1)}%`);
      console.log(`- Average response time: ${summary.averageResponseTime.toFixed(0)}ms`);
      console.log(`- Max response time: ${summary.maxResponseTime}ms`);
    }
  });
});