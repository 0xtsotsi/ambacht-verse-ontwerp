/**
 * Circuit Breaker Pattern Implementation
 *
 * Provides fault tolerance by preventing cascading failures in distributed systems.
 * Monitors failures and temporarily stops calls to failing services.
 */

import { SafeLogger } from "@/lib/LoggerUtils";

export enum CircuitState {
  CLOSED = "closed", // Normal operation
  OPEN = "open", // Blocking all requests
  HALF_OPEN = "half-open", // Testing if service is back
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  resetTimeout: number; // Time before attempting to close (ms)
  monitoringPeriod: number; // Time window for failure tracking (ms)
  successThreshold: number; // Successes needed to close from half-open
  timeout: number; // Request timeout (ms)
}

export interface CircuitBreakerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  timeouts: number;
  circuitOpened: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  currentState: CircuitState;
  failureRate: number;
}

/**
 * Circuit Breaker class implementing the Circuit Breaker pattern
 */
export class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private lastSuccessTime = 0;
  private nextAttemptTime = 0;
  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private timeouts = 0;
  private circuitOpenedCount = 0;
  private recentRequests: { timestamp: number; success: boolean }[] = [];

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 60000, // 1 minute
      successThreshold: 3,
      timeout: 10000, // 10 seconds
      ...config,
    };

    SafeLogger.info("Circuit breaker initialized", {
      failureThreshold: this.config.failureThreshold,
      resetTimeout: this.config.resetTimeout,
      monitoringPeriod: this.config.monitoringPeriod,
    });
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() >= this.nextAttemptTime) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
        SafeLogger.info("Circuit breaker transitioning to half-open state");
      } else {
        this.totalRequests++;
        throw new CircuitBreakerOpenError(
          `Circuit breaker is open. Next attempt allowed at ${new Date(this.nextAttemptTime).toISOString()}`,
        );
      }
    }

    this.totalRequests++;
    const startTime = Date.now();

    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(fn);

      const duration = Date.now() - startTime;
      this.onSuccess(duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.onFailure(error, duration);
      throw error;
    }
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        this.timeouts++;
        reject(
          new CircuitBreakerTimeoutError(
            `Operation timed out after ${this.config.timeout}ms`,
          ),
        );
      }, this.config.timeout);
    });

    return Promise.race([fn(), timeout]);
  }

  /**
   * Handle successful execution
   */
  private onSuccess(duration: number): void {
    this.successfulRequests++;
    this.lastSuccessTime = Date.now();
    this.addRecentRequest(true);

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.close();
      }
    } else if (this.state === CircuitState.CLOSED) {
      this.failureCount = Math.max(0, this.failureCount - 1);
    }

    SafeLogger.debug("Circuit breaker - successful execution", {
      state: this.state,
      duration,
      successCount: this.successCount,
      failureCount: this.failureCount,
    });
  }

  /**
   * Handle failed execution
   */
  private onFailure(error: Error, duration: number): void {
    this.failedRequests++;
    this.lastFailureTime = Date.now();
    this.addRecentRequest(false);
    this.failureCount++;

    SafeLogger.warn("Circuit breaker - failed execution", {
      state: this.state,
      error: error?.message,
      duration,
      failureCount: this.failureCount,
      threshold: this.config.failureThreshold,
    });

    if (this.state === CircuitState.HALF_OPEN) {
      this.open();
    } else if (this.state === CircuitState.CLOSED && this.shouldOpen()) {
      this.open();
    }
  }

  /**
   * Add request to recent requests tracking
   */
  private addRecentRequest(success: boolean): void {
    const now = Date.now();
    this.recentRequests.push({ timestamp: now, success });

    // Clean up old requests outside monitoring period
    const cutoff = now - this.config.monitoringPeriod;
    this.recentRequests = this.recentRequests.filter(
      (request) => request.timestamp > cutoff,
    );
  }

  /**
   * Check if circuit should open based on failure rate
   */
  private shouldOpen(): boolean {
    const now = Date.now();
    const cutoff = now - this.config.monitoringPeriod;

    // Get requests within monitoring period
    const recentRequestsInPeriod = this.recentRequests.filter(
      (request) => request.timestamp > cutoff,
    );

    if (recentRequestsInPeriod.length < this.config.failureThreshold) {
      return false;
    }

    const failures = recentRequestsInPeriod.filter(
      (request) => !request.success,
    ).length;
    const failureRate = failures / recentRequestsInPeriod.length;

    // Open if failure rate is above 50% and we have enough failures
    return failures >= this.config.failureThreshold && failureRate > 0.5;
  }

  /**
   * Open the circuit breaker
   */
  private open(): void {
    this.state = CircuitState.OPEN;
    this.nextAttemptTime = Date.now() + this.config.resetTimeout;
    this.circuitOpenedCount++;

    SafeLogger.warn("Circuit breaker opened", {
      failureCount: this.failureCount,
      nextAttemptTime: new Date(this.nextAttemptTime).toISOString(),
      totalFailures: this.failedRequests,
      failureRate: this.getFailureRate(),
    });
  }

  /**
   * Close the circuit breaker
   */
  private close(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;

    SafeLogger.info("Circuit breaker closed", {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failureRate: this.getFailureRate(),
    });
  }

  /**
   * Get current failure rate
   */
  private getFailureRate(): number {
    if (this.totalRequests === 0) return 0;
    return (this.failedRequests / this.totalRequests) * 100;
  }

  /**
   * Get circuit breaker metrics
   */
  public getMetrics(): CircuitBreakerMetrics {
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      timeouts: this.timeouts,
      circuitOpened: this.circuitOpenedCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      currentState: this.state,
      failureRate: this.getFailureRate(),
    };
  }

  /**
   * Get current state
   */
  public getState(): CircuitState {
    return this.state;
  }

  /**
   * Check if circuit is open
   */
  public isOpen(): boolean {
    return this.state === CircuitState.OPEN;
  }

  /**
   * Check if circuit is closed
   */
  public isClosed(): boolean {
    return this.state === CircuitState.CLOSED;
  }

  /**
   * Check if circuit is half-open
   */
  public isHalfOpen(): boolean {
    return this.state === CircuitState.HALF_OPEN;
  }

  /**
   * Force open the circuit (for testing/maintenance)
   */
  public forceOpen(): void {
    this.state = CircuitState.OPEN;
    this.nextAttemptTime = Date.now() + this.config.resetTimeout;

    SafeLogger.warn("Circuit breaker force opened");
  }

  /**
   * Force close the circuit (for testing/maintenance)
   */
  public forceClose(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;

    SafeLogger.info("Circuit breaker force closed");
  }

  /**
   * Reset circuit breaker statistics
   */
  public reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.lastSuccessTime = 0;
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.timeouts = 0;
    this.circuitOpenedCount = 0;
    this.recentRequests = [];

    SafeLogger.info("Circuit breaker reset");
  }
}

/**
 * Circuit Breaker Open Error
 */
export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

/**
 * Circuit Breaker Timeout Error
 */
export class CircuitBreakerTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerTimeoutError";
  }
}

/**
 * Factory function to create circuit breaker with preset configurations
 */
export const createCircuitBreaker = {
  /**
   * Fast-failing circuit breaker for external APIs
   */
  forExternalAPI: (): CircuitBreaker =>
    new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 30000, // 30 seconds
      monitoringPeriod: 30000,
      successThreshold: 2,
      timeout: 5000, // 5 seconds
    }),

  /**
   * Tolerant circuit breaker for internal services
   */
  forInternalService: (): CircuitBreaker =>
    new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 60000,
      successThreshold: 3,
      timeout: 10000, // 10 seconds
    }),

  /**
   * Strict circuit breaker for critical services
   */
  forCriticalService: (): CircuitBreaker =>
    new CircuitBreaker({
      failureThreshold: 2,
      resetTimeout: 120000, // 2 minutes
      monitoringPeriod: 30000,
      successThreshold: 5,
      timeout: 3000, // 3 seconds
    }),

  /**
   * Lenient circuit breaker for batch operations
   */
  forBatchOperations: (): CircuitBreaker =>
    new CircuitBreaker({
      failureThreshold: 10,
      resetTimeout: 300000, // 5 minutes
      monitoringPeriod: 120000,
      successThreshold: 3,
      timeout: 30000, // 30 seconds
    }),
};

/**
 * Circuit breaker registry for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private circuitBreakers = new Map<string, CircuitBreaker>();

  /**
   * Get or create a circuit breaker
   */
  public getOrCreate(
    name: string,
    config?: Partial<CircuitBreakerConfig>,
  ): CircuitBreaker {
    if (!this.circuitBreakers.has(name)) {
      this.circuitBreakers.set(name, new CircuitBreaker(config));
    }
    return this.circuitBreakers.get(name)!;
  }

  /**
   * Get all circuit breaker metrics
   */
  public getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};

    for (const [name, breaker] of this.circuitBreakers) {
      metrics[name] = breaker.getMetrics();
    }

    return metrics;
  }

  /**
   * Get circuit breakers by state
   */
  public getByState(state: CircuitState): Record<string, CircuitBreaker> {
    const result: Record<string, CircuitBreaker> = {};

    for (const [name, breaker] of this.circuitBreakers) {
      if (breaker.getState() === state) {
        result[name] = breaker;
      }
    }

    return result;
  }

  /**
   * Reset all circuit breakers
   */
  public resetAll(): void {
    for (const breaker of this.circuitBreakers.values()) {
      breaker.reset();
    }

    SafeLogger.info("All circuit breakers reset");
  }
}

// Global circuit breaker registry instance
export const circuitBreakerRegistry = new CircuitBreakerRegistry();
