import { expect, APIRequestContext } from '@playwright/test';

/**
 * Comprehensive API Client for Wesley's Ambacht Catering API Testing
 * 
 * This client provides:
 * - Standardized request/response handling
 * - Authentication management
 * - Error handling and retry logic
 * - Performance metrics collection
 * - Response validation
 */

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
  responseTime: number;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
}

export class APIClient {
  private request: APIRequestContext;
  private baseURL: string;
  private authToken?: string;
  private defaultHeaders: Record<string, string>;
  private performanceMetrics: Array<{
    endpoint: string;
    method: string;
    responseTime: number;
    status: number;
    timestamp: Date;
  }> = [];

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Playwright-API-Test-Client/1.0'
    };
  }

  /**
   * Set authentication token for all requests
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = undefined;
  }

  /**
   * Set custom headers for all requests
   */
  setHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get request headers including authentication
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  /**
   * Make a GET request
   */
  async get<T = any>(endpoint: string, options?: {
    params?: Record<string, string | number>;
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse<T>> {
    return this.makeRequest('GET', endpoint, options);
  }

  /**
   * Make a POST request
   */
  async post<T = any>(endpoint: string, data?: any, options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse<T>> {
    return this.makeRequest('POST', endpoint, { ...options, data });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse<T>> {
    return this.makeRequest('PATCH', endpoint, { ...options, data });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(endpoint: string, options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse<T>> {
    return this.makeRequest('DELETE', endpoint, options);
  }

  /**
   * Make a generic HTTP request with performance tracking
   */
  private async makeRequest<T = any>(
    method: string,
    endpoint: string,
    options?: {
      data?: any;
      params?: Record<string, string | number>;
      headers?: Record<string, string>;
      timeout?: number;
    }
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options?.headers);
    const startTime = Date.now();

    try {
      // Build URL with query parameters
      const urlWithParams = options?.params 
        ? `${url}?${new URLSearchParams(Object.entries(options.params).map(([k, v]) => [k, v.toString()]))}`
        : url;

      const response = await this.request.fetch(urlWithParams, {
        method,
        headers,
        data: options?.data ? JSON.stringify(options.data) : undefined,
        timeout: options?.timeout || 15000
      });

      const responseTime = Date.now() - startTime;
      const responseHeaders: Record<string, string> = {};
      
      // Extract response headers
      response.headers().forEach((value, name) => {
        responseHeaders[name] = value;
      });

      let responseData: T;
      const contentType = responseHeaders['content-type'] || '';
      
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text() as any;
      }

      // Record performance metrics
      this.performanceMetrics.push({
        endpoint,
        method,
        responseTime,
        status: response.status(),
        timestamp: new Date()
      });

      const apiResponse: ApiResponse<T> = {
        status: response.status(),
        data: responseData,
        headers: responseHeaders,
        responseTime,
        success: response.ok()
      };

      return apiResponse;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Record failed request metrics
      this.performanceMetrics.push({
        endpoint,
        method,
        responseTime,
        status: 0,
        timestamp: new Date()
      });

      throw new Error(`API request failed: ${error}`);
    }
  }

  /**
   * Assert successful response
   */
  async assertSuccess<T>(response: ApiResponse<T>): Promise<T> {
    expect(response.success, `Expected successful response but got ${response.status}`).toBe(true);
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    return response.data;
  }

  /**
   * Assert error response
   */
  async assertError(response: ApiResponse, expectedStatus?: number): Promise<ApiError> {
    expect(response.success, `Expected error response but got successful status ${response.status}`).toBe(false);
    
    if (expectedStatus) {
      expect(response.status).toBe(expectedStatus);
    }
    
    expect(response.data).toHaveProperty('error');
    expect(response.data.error).toHaveProperty('code');
    expect(response.data.error).toHaveProperty('message');
    
    return response.data.error;
  }

  /**
   * Assert response schema matches expected structure
   */
  async assertSchema(data: any, schema: any) {
    // Basic schema validation - in a real implementation, use a library like Joi or Zod
    for (const [key, expectedType] of Object.entries(schema)) {
      expect(data).toHaveProperty(key);
      
      if (expectedType === 'string') {
        expect(typeof data[key]).toBe('string');
      } else if (expectedType === 'number') {
        expect(typeof data[key]).toBe('number');
      } else if (expectedType === 'boolean') {
        expect(typeof data[key]).toBe('boolean');
      } else if (expectedType === 'array') {
        expect(Array.isArray(data[key])).toBe(true);
      } else if (expectedType === 'object') {
        expect(typeof data[key]).toBe('object');
        expect(data[key]).not.toBeNull();
      }
    }
  }

  /**
   * Assert response time is within acceptable limits
   */
  assertPerformance(response: ApiResponse, maxResponseTime: number) {
    expect(response.responseTime, 
      `Response time ${response.responseTime}ms exceeded limit of ${maxResponseTime}ms`
    ).toBeLessThanOrEqual(maxResponseTime);
  }

  /**
   * Get performance metrics for analysis
   */
  getPerformanceMetrics() {
    return [...this.performanceMetrics];
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const metrics = this.performanceMetrics;
    if (metrics.length === 0) return null;

    const responseTimes = metrics.map(m => m.responseTime);
    const successfulRequests = metrics.filter(m => m.status >= 200 && m.status < 300);
    const errorRequests = metrics.filter(m => m.status >= 400);

    return {
      totalRequests: metrics.length,
      successfulRequests: successfulRequests.length,
      errorRequests: errorRequests.length,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      successRate: (successfulRequests.length / metrics.length) * 100,
      endpointBreakdown: this.getEndpointBreakdown()
    };
  }

  /**
   * Get breakdown of metrics by endpoint
   */
  private getEndpointBreakdown() {
    const breakdown: Record<string, {
      calls: number;
      averageResponseTime: number;
      successRate: number;
    }> = {};

    this.performanceMetrics.forEach(metric => {
      const key = `${metric.method} ${metric.endpoint}`;
      
      if (!breakdown[key]) {
        breakdown[key] = { calls: 0, averageResponseTime: 0, successRate: 0 };
      }
      
      breakdown[key].calls++;
    });

    // Calculate averages
    Object.keys(breakdown).forEach(key => {
      const [method, endpoint] = key.split(' ', 2);
      const metrics = this.performanceMetrics.filter(m => 
        m.method === method && m.endpoint === endpoint
      );
      
      const responseTimes = metrics.map(m => m.responseTime);
      const successful = metrics.filter(m => m.status >= 200 && m.status < 300);
      
      breakdown[key].averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      breakdown[key].successRate = (successful.length / metrics.length) * 100;
    });

    return breakdown;
  }

  /**
   * Clear performance metrics
   */
  clearMetrics() {
    this.performanceMetrics = [];
  }
}

/**
 * Booking-specific API methods
 */
export class BookingAPI extends APIClient {
  /**
   * Create a new booking
   */
  async createBooking(bookingData: {
    customer_name: string;
    customer_email: string;
    event_date: string;
    event_time: string;
    guest_count: number;
    service_category: string;
    service_tier?: string;
    special_requests?: string;
    dietary_restrictions?: string;
  }) {
    return this.post('/bookings', bookingData);
  }

  /**
   * Get booking by ID
   */
  async getBooking(id: string) {
    return this.get(`/bookings/${id}`);
  }

  /**
   * List bookings with filtering
   */
  async listBookings(filters?: {
    status?: string;
    service_category?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }) {
    return this.get('/bookings', { params: filters || {} });
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(id: string, status: string, notes?: string) {
    return this.patch(`/bookings/${id}`, { status, notes });
  }

  /**
   * Add services to booking
   */
  async addBookingServices(id: string, services: Array<{
    service_id: string;
    quantity?: number;
  }>) {
    return this.post(`/bookings/${id}/add-ons`, { services });
  }
}

/**
 * Availability-specific API methods
 */
export class AvailabilityAPI extends APIClient {
  /**
   * Get availability slots
   */
  async getAvailability(dateRange?: { start_date?: string; end_date?: string }) {
    return this.get('/availability', { params: dateRange || {} });
  }

  /**
   * Check specific slot availability
   */
  async checkAvailability(date: string, time: string) {
    return this.post('/availability/check', { date, time });
  }

  /**
   * Get available time slots for a date
   */
  async getTimeSlots(date: string) {
    return this.get(`/availability/slots/${date}`);
  }
}

/**
 * Quote-specific API methods
 */
export class QuoteAPI extends APIClient {
  /**
   * Generate a new quote
   */
  async generateQuote(quoteData: {
    service_category: string;
    service_tier: string;
    guest_count: number;
    event_date?: string;
    selected_add_ons?: string[];
    custom_notes?: string;
  }) {
    return this.post('/quotes', quoteData);
  }

  /**
   * Get quote by ID
   */
  async getQuote(id: string) {
    return this.get(`/quotes/${id}`);
  }

  /**
   * Update quote status
   */
  async updateQuoteStatus(id: string, status: string) {
    return this.patch(`/quotes/${id}`, { status });
  }
}

/**
 * Add-on Services API methods
 */
export class AddOnServicesAPI extends APIClient {
  /**
   * List all add-on services
   */
  async listAddOnServices(category?: string) {
    const params = category ? { category } : {};
    return this.get('/add-on-services', { params });
  }
}