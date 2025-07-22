/**
 * Webhook Event System - Core event-driven infrastructure for external integrations
 *
 * Features:
 * - Event generation and dispatching
 * - Reliable delivery with retry mechanisms
 * - Event payload templating and validation
 * - Webhook subscription management
 * - Delivery tracking and health monitoring
 * - Security with signature validation
 * - Dead letter queue for failed deliveries
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import { MetricsCollector } from "@/gateway/MetricsCollector";
import crypto from "crypto";

export enum WebhookEventType {
  // Booking events
  BOOKING_CREATED = "booking.created",
  BOOKING_UPDATED = "booking.updated",
  BOOKING_CONFIRMED = "booking.confirmed",
  BOOKING_CANCELLED = "booking.cancelled",
  BOOKING_COMPLETED = "booking.completed",

  // Payment events
  PAYMENT_INITIATED = "payment.initiated",
  PAYMENT_COMPLETED = "payment.completed",
  PAYMENT_FAILED = "payment.failed",
  PAYMENT_REFUNDED = "payment.refunded",

  // Calendar events
  CALENDAR_SLOT_RESERVED = "calendar.slot_reserved",
  CALENDAR_SLOT_RELEASED = "calendar.slot_released",
  CALENDAR_AVAILABILITY_CHANGED = "calendar.availability_changed",

  // Customer events
  CUSTOMER_CREATED = "customer.created",
  CUSTOMER_UPDATED = "customer.updated",
  CUSTOMER_PREFERENCES_CHANGED = "customer.preferences_changed",

  // Quote events
  QUOTE_GENERATED = "quote.generated",
  QUOTE_SENT = "quote.sent",
  QUOTE_ACCEPTED = "quote.accepted",
  QUOTE_REJECTED = "quote.rejected",
  QUOTE_EXPIRED = "quote.expired",

  // System events
  SYSTEM_MAINTENANCE_SCHEDULED = "system.maintenance_scheduled",
  SYSTEM_CAPACITY_ALERT = "system.capacity_alert",
  SYSTEM_ERROR_THRESHOLD_EXCEEDED = "system.error_threshold_exceeded",

  // Integration events
  INTEGRATION_STATUS_CHANGED = "integration.status_changed",
  INTEGRATION_HEALTH_CHECK_FAILED = "integration.health_check_failed",
}

export enum WebhookDeliveryStatus {
  PENDING = "pending",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  FAILED = "failed",
  DEAD_LETTER = "dead_letter",
  CANCELLED = "cancelled",
}

export interface WebhookEventPayload<T = any> {
  id: string;
  type: WebhookEventType;
  version: string;
  timestamp: string;
  data: T;
  metadata: {
    source: string;
    resourceId?: string;
    userId?: string;
    sessionId?: string;
    correlationId?: string;
    environment: string;
  };
  test?: boolean;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEventType[];
  active: boolean;
  secret: string;
  metadata: {
    name?: string;
    description?: string;
    provider?: string;
    tags?: string[];
  };
  config: {
    timeout: number;
    retryAttempts: number;
    retryDelayMs: number;
    signatureHeader: string;
    contentType: string;
    customHeaders?: Record<string, string>;
  };
  filters?: {
    resourceIds?: string[];
    userIds?: string[];
    conditions?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
  lastDeliveredAt?: Date;
  failureCount: number;
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventId: string;
  payload: WebhookEventPayload;
  status: WebhookDeliveryStatus;
  url: string;
  httpMethod: string;
  requestHeaders: Record<string, string>;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  errorMessage?: string;
  attemptCount: number;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metrics: {
    requestDuration?: number;
    requestSize: number;
    responseSize?: number;
  };
}

export interface WebhookEventFilter {
  types?: WebhookEventType[];
  resourceIds?: string[];
  userIds?: string[];
  startDate?: Date;
  endDate?: Date;
  status?: WebhookDeliveryStatus[];
  subscriptionIds?: string[];
}

/**
 * Main Webhook Event System class
 */
export class WebhookEventSystem {
  private subscriptions = new Map<string, WebhookSubscription>();
  private deliveries = new Map<string, WebhookDelivery>();
  private eventHistory = new Map<string, WebhookEventPayload>();
  private deadLetterQueue: WebhookDelivery[] = [];
  private metrics?: MetricsCollector;
  private retryQueue: WebhookDelivery[] = [];
  private isProcessingRetries = false;

  private readonly DEFAULT_TIMEOUT = 10000; // 10 seconds
  private readonly DEFAULT_RETRY_ATTEMPTS = 3;
  private readonly DEFAULT_RETRY_DELAY = 1000; // 1 second
  private readonly MAX_RETRY_DELAY = 300000; // 5 minutes
  private readonly DEAD_LETTER_THRESHOLD = 5;
  private readonly EVENT_HISTORY_LIMIT = 10000;

  constructor(metrics?: MetricsCollector) {
    this.metrics = metrics;
    this.startRetryProcessor();
    this.startHealthMonitoring();
  }

  /**
   * Register a webhook subscription
   */
  public registerSubscription(
    subscription: Omit<
      WebhookSubscription,
      "id" | "secret" | "createdAt" | "updatedAt" | "failureCount"
    >,
  ): WebhookSubscription {
    const id = this.generateId();
    const secret = this.generateSecret();

    const newSubscription: WebhookSubscription = {
      id,
      secret,
      failureCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...subscription,
      config: {
        timeout: this.DEFAULT_TIMEOUT,
        retryAttempts: this.DEFAULT_RETRY_ATTEMPTS,
        retryDelayMs: this.DEFAULT_RETRY_DELAY,
        signatureHeader: "X-Webhook-Signature",
        contentType: "application/json",
        ...subscription.config,
      },
    };

    this.subscriptions.set(id, newSubscription);

    SafeLogger.info("Webhook subscription registered", {
      subscriptionId: id,
      url: subscription.url,
      events: subscription.events,
      provider: subscription.metadata.provider,
    });

    this.metrics?.recordRequest(`webhook_subscription_${id}`, {
      method: "REGISTER",
      path: "/webhooks/subscriptions",
      statusCode: 201,
      duration: 0,
    });

    return newSubscription;
  }

  /**
   * Update webhook subscription
   */
  public updateSubscription(
    id: string,
    updates: Partial<WebhookSubscription>,
  ): boolean {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      return false;
    }

    const updatedSubscription = {
      ...subscription,
      ...updates,
      id, // Preserve ID
      secret: subscription.secret, // Preserve secret
      updatedAt: new Date(),
    };

    this.subscriptions.set(id, updatedSubscription);

    SafeLogger.info("Webhook subscription updated", {
      subscriptionId: id,
      updates: Object.keys(updates),
    });

    return true;
  }

  /**
   * Remove webhook subscription
   */
  public removeSubscription(id: string): boolean {
    const removed = this.subscriptions.delete(id);

    if (removed) {
      SafeLogger.info("Webhook subscription removed", { subscriptionId: id });

      // Cancel pending deliveries for this subscription
      this.retryQueue = this.retryQueue.filter(
        (delivery) => delivery.subscriptionId !== id,
      );
    }

    return removed;
  }

  /**
   * Get webhook subscription by ID
   */
  public getSubscription(id: string): WebhookSubscription | null {
    return this.subscriptions.get(id) || null;
  }

  /**
   * List webhook subscriptions with optional filtering
   */
  public listSubscriptions(filter?: {
    active?: boolean;
    events?: WebhookEventType[];
    provider?: string;
  }): WebhookSubscription[] {
    let subscriptions = Array.from(this.subscriptions.values());

    if (filter?.active !== undefined) {
      subscriptions = subscriptions.filter(
        (sub) => sub.active === filter.active,
      );
    }

    if (filter?.events?.length) {
      subscriptions = subscriptions.filter((sub) =>
        filter.events!.some((event) => sub.events.includes(event)),
      );
    }

    if (filter?.provider) {
      subscriptions = subscriptions.filter(
        (sub) => sub.metadata.provider === filter.provider,
      );
    }

    return subscriptions;
  }

  /**
   * Emit webhook event to all matching subscriptions
   */
  public async emitEvent<T = any>(
    eventType: WebhookEventType,
    data: T,
    metadata: WebhookEventPayload["metadata"],
  ): Promise<string> {
    const eventId = this.generateId();
    const timestamp = new Date().toISOString();

    const payload: WebhookEventPayload<T> = {
      id: eventId,
      type: eventType,
      version: "1.0",
      timestamp,
      data,
      metadata: {
        ...metadata,
        environment: process.env.NODE_ENV || "development",
      },
    };

    // Store event in history
    this.eventHistory.set(eventId, payload);
    this.limitEventHistory();

    SafeLogger.info("Webhook event emitted", {
      eventId,
      type: eventType,
      resourceId: metadata.resourceId,
    });

    // Find matching subscriptions
    const matchingSubscriptions = this.findMatchingSubscriptions(
      eventType,
      payload,
    );

    SafeLogger.info(
      `Found ${matchingSubscriptions.length} matching subscriptions for event`,
      {
        eventId,
        subscriptions: matchingSubscriptions.map((s) => s.id),
      },
    );

    // Create deliveries for each matching subscription
    const deliveryPromises = matchingSubscriptions.map((subscription) =>
      this.createDelivery(subscription, payload),
    );

    await Promise.allSettled(deliveryPromises);

    this.metrics?.recordRequest(eventId, {
      method: "EMIT",
      path: `/webhooks/events/${eventType}`,
      statusCode: 200,
      duration: 0,
      metadata: { subscriptionCount: matchingSubscriptions.length },
    });

    return eventId;
  }

  /**
   * Get webhook delivery by ID
   */
  public getDelivery(id: string): WebhookDelivery | null {
    return this.deliveries.get(id) || null;
  }

  /**
   * List webhook deliveries with filtering
   */
  public listDeliveries(filter?: WebhookEventFilter): WebhookDelivery[] {
    let deliveries = Array.from(this.deliveries.values());

    if (filter?.subscriptionIds?.length) {
      deliveries = deliveries.filter((d) =>
        filter.subscriptionIds!.includes(d.subscriptionId),
      );
    }

    if (filter?.status?.length) {
      deliveries = deliveries.filter((d) => filter.status!.includes(d.status));
    }

    if (filter?.types?.length) {
      deliveries = deliveries.filter((d) =>
        filter.types!.includes(d.payload.type),
      );
    }

    if (filter?.startDate) {
      deliveries = deliveries.filter((d) => d.createdAt >= filter.startDate!);
    }

    if (filter?.endDate) {
      deliveries = deliveries.filter((d) => d.createdAt <= filter.endDate!);
    }

    // Sort by creation date (newest first)
    return deliveries.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  /**
   * Retry failed webhook delivery
   */
  public async retryDelivery(deliveryId: string): Promise<boolean> {
    const delivery = this.deliveries.get(deliveryId);
    if (!delivery || delivery.status === WebhookDeliveryStatus.DELIVERED) {
      return false;
    }

    // Reset delivery status and add to retry queue
    delivery.status = WebhookDeliveryStatus.PENDING;
    delivery.nextRetryAt = undefined;
    delivery.errorMessage = undefined;

    this.retryQueue.push(delivery);

    SafeLogger.info("Webhook delivery queued for retry", {
      deliveryId: delivery.id,
      subscriptionId: delivery.subscriptionId,
    });

    return true;
  }

  /**
   * Get webhook statistics
   */
  public getStatistics(): {
    subscriptions: {
      total: number;
      active: number;
      inactive: number;
    };
    deliveries: {
      total: number;
      delivered: number;
      failed: number;
      pending: number;
      deadLetter: number;
    };
    events: {
      total: number;
      recentCount: number;
      topEvents: Array<{ type: string; count: number }>;
    };
    health: {
      successRate: number;
      avgDeliveryTime: number;
      retryQueueSize: number;
      deadLetterQueueSize: number;
    };
  } {
    const subscriptions = Array.from(this.subscriptions.values());
    const deliveries = Array.from(this.deliveries.values());
    const events = Array.from(this.eventHistory.values());

    // Calculate delivery statistics
    const deliveredCount = deliveries.filter(
      (d) => d.status === WebhookDeliveryStatus.DELIVERED,
    ).length;
    const failedCount = deliveries.filter(
      (d) => d.status === WebhookDeliveryStatus.FAILED,
    ).length;
    const pendingCount = deliveries.filter(
      (d) => d.status === WebhookDeliveryStatus.PENDING,
    ).length;
    const deadLetterCount = this.deadLetterQueue.length;

    // Calculate success rate
    const totalAttempts = deliveredCount + failedCount;
    const successRate =
      totalAttempts > 0 ? (deliveredCount / totalAttempts) * 100 : 100;

    // Calculate average delivery time
    const deliveredWithTimes = deliveries.filter(
      (d) =>
        d.status === WebhookDeliveryStatus.DELIVERED &&
        d.metrics.requestDuration,
    );
    const avgDeliveryTime =
      deliveredWithTimes.length > 0
        ? deliveredWithTimes.reduce(
            (sum, d) => sum + (d.metrics.requestDuration || 0),
            0,
          ) / deliveredWithTimes.length
        : 0;

    // Count events by type
    const eventCounts = new Map<string, number>();
    events.forEach((event) => {
      const count = eventCounts.get(event.type) || 0;
      eventCounts.set(event.type, count + 1);
    });

    const topEvents = Array.from(eventCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent events (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = events.filter(
      (event) => new Date(event.timestamp) >= oneDayAgo,
    ).length;

    return {
      subscriptions: {
        total: subscriptions.length,
        active: subscriptions.filter((s) => s.active).length,
        inactive: subscriptions.filter((s) => !s.active).length,
      },
      deliveries: {
        total: deliveries.length,
        delivered: deliveredCount,
        failed: failedCount,
        pending: pendingCount,
        deadLetter: deadLetterCount,
      },
      events: {
        total: events.length,
        recentCount,
        topEvents,
      },
      health: {
        successRate: Math.round(successRate * 100) / 100,
        avgDeliveryTime: Math.round(avgDeliveryTime),
        retryQueueSize: this.retryQueue.length,
        deadLetterQueueSize: deadLetterCount,
      },
    };
  }

  /**
   * Validate webhook signature
   */
  public validateSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex"),
    );
  }

  /**
   * Generate webhook signature
   */
  public generateSignature(payload: string, secret: string): string {
    return crypto
      .createHmac("sha256", secret)
      .update(payload, "utf8")
      .digest("hex");
  }

  // Private methods

  private findMatchingSubscriptions(
    eventType: WebhookEventType,
    payload: WebhookEventPayload,
  ): WebhookSubscription[] {
    return Array.from(this.subscriptions.values()).filter((subscription) => {
      // Must be active
      if (!subscription.active) return false;

      // Must be subscribed to this event type
      if (!subscription.events.includes(eventType)) return false;

      // Apply filters if defined
      if (subscription.filters) {
        const { resourceIds, userIds, conditions } = subscription.filters;

        if (
          resourceIds?.length &&
          payload.metadata.resourceId &&
          !resourceIds.includes(payload.metadata.resourceId)
        ) {
          return false;
        }

        if (
          userIds?.length &&
          payload.metadata.userId &&
          !userIds.includes(payload.metadata.userId)
        ) {
          return false;
        }

        if (conditions && !this.matchesConditions(payload, conditions)) {
          return false;
        }
      }

      return true;
    });
  }

  private matchesConditions(
    payload: WebhookEventPayload,
    conditions: Record<string, any>,
  ): boolean {
    // Simple condition matching - can be extended for complex logic
    for (const [key, value] of Object.entries(conditions)) {
      const payloadValue = this.getNestedValue(payload.data, key);
      if (payloadValue !== value) {
        return false;
      }
    }
    return true;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  private async createDelivery(
    subscription: WebhookSubscription,
    payload: WebhookEventPayload,
  ): Promise<void> {
    const deliveryId = this.generateId();
    const payloadJson = JSON.stringify(payload);
    const signature = this.generateSignature(payloadJson, subscription.secret);

    const delivery: WebhookDelivery = {
      id: deliveryId,
      subscriptionId: subscription.id,
      eventId: payload.id,
      payload,
      status: WebhookDeliveryStatus.PENDING,
      url: subscription.url,
      httpMethod: "POST",
      requestHeaders: {
        "Content-Type": subscription.config.contentType,
        [subscription.config.signatureHeader]: `sha256=${signature}`,
        "User-Agent": "Wesley-Ambacht-Webhooks/1.0",
        "X-Webhook-Event": payload.type,
        "X-Webhook-Delivery": deliveryId,
        ...subscription.config.customHeaders,
      },
      attemptCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: {
        requestSize: Buffer.byteLength(payloadJson, "utf8"),
      },
    };

    this.deliveries.set(deliveryId, delivery);
    this.retryQueue.push(delivery);

    SafeLogger.info("Webhook delivery created", {
      deliveryId,
      subscriptionId: subscription.id,
      eventType: payload.type,
      url: subscription.url,
    });
  }

  private startRetryProcessor(): void {
    setInterval(async () => {
      if (this.isProcessingRetries || this.retryQueue.length === 0) {
        return;
      }

      this.isProcessingRetries = true;

      try {
        // Process deliveries that are ready for retry
        const readyForRetry = this.retryQueue.filter(
          (delivery) =>
            !delivery.nextRetryAt || delivery.nextRetryAt <= new Date(),
        );

        if (readyForRetry.length > 0) {
          SafeLogger.info(
            `Processing ${readyForRetry.length} webhook deliveries`,
          );

          const deliveryPromises = readyForRetry.map((delivery) =>
            this.processDelivery(delivery),
          );

          await Promise.allSettled(deliveryPromises);

          // Remove processed deliveries from retry queue
          this.retryQueue = this.retryQueue.filter(
            (delivery) =>
              !readyForRetry.some((processed) => processed.id === delivery.id),
          );
        }
      } catch (error) {
        SafeLogger.error("Error processing webhook retry queue", error);
      } finally {
        this.isProcessingRetries = false;
      }
    }, 5000); // Process every 5 seconds
  }

  private async processDelivery(delivery: WebhookDelivery): Promise<void> {
    const subscription = this.subscriptions.get(delivery.subscriptionId);
    if (!subscription) {
      SafeLogger.warn("Subscription not found for delivery", {
        deliveryId: delivery.id,
        subscriptionId: delivery.subscriptionId,
      });
      delivery.status = WebhookDeliveryStatus.CANCELLED;
      return;
    }

    delivery.status = WebhookDeliveryStatus.DELIVERING;
    delivery.attemptCount++;
    delivery.updatedAt = new Date();

    const startTime = Date.now();
    const payload = JSON.stringify(delivery.payload);

    try {
      const response = await fetch(delivery.url, {
        method: delivery.httpMethod,
        headers: delivery.requestHeaders,
        body: payload,
        signal: AbortSignal.timeout(subscription.config.timeout),
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();

      delivery.responseStatus = response.status;
      delivery.responseHeaders = Object.fromEntries(response.headers.entries());
      delivery.responseBody = responseText;
      delivery.metrics.requestDuration = duration;
      delivery.metrics.responseSize = Buffer.byteLength(responseText, "utf8");

      if (response.ok) {
        delivery.status = WebhookDeliveryStatus.DELIVERED;
        delivery.deliveredAt = new Date();
        subscription.lastDeliveredAt = new Date();
        subscription.failureCount = 0;

        SafeLogger.info("Webhook delivered successfully", {
          deliveryId: delivery.id,
          subscriptionId: subscription.id,
          url: delivery.url,
          status: response.status,
          duration,
        });

        this.metrics?.recordRequest(delivery.id, {
          method: "POST",
          path: delivery.url,
          statusCode: response.status,
          duration,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      delivery.errorMessage = error.message;
      delivery.metrics.requestDuration = duration;

      SafeLogger.error("Webhook delivery failed", {
        deliveryId: delivery.id,
        subscriptionId: subscription.id,
        url: delivery.url,
        attempt: delivery.attemptCount,
        error: error.message,
        duration,
      });

      this.metrics?.recordError(delivery.id, error);

      // Determine if we should retry or move to dead letter queue
      if (delivery.attemptCount < subscription.config.retryAttempts) {
        // Schedule retry with exponential backoff
        const delay = this.calculateRetryDelay(
          delivery.attemptCount,
          subscription.config.retryDelayMs,
        );
        delivery.nextRetryAt = new Date(Date.now() + delay);
        delivery.status = WebhookDeliveryStatus.PENDING;

        // Add back to retry queue
        this.retryQueue.push(delivery);

        SafeLogger.info("Webhook delivery scheduled for retry", {
          deliveryId: delivery.id,
          attempt: delivery.attemptCount,
          nextRetryAt: delivery.nextRetryAt,
          delay,
        });
      } else {
        // Move to dead letter queue
        delivery.status = WebhookDeliveryStatus.DEAD_LETTER;
        this.deadLetterQueue.push(delivery);
        subscription.failureCount++;

        SafeLogger.warn("Webhook delivery moved to dead letter queue", {
          deliveryId: delivery.id,
          subscriptionId: subscription.id,
          url: delivery.url,
          attempts: delivery.attemptCount,
        });

        // Disable subscription if too many failures
        if (subscription.failureCount >= this.DEAD_LETTER_THRESHOLD) {
          subscription.active = false;
          SafeLogger.warn(
            "Webhook subscription disabled due to repeated failures",
            {
              subscriptionId: subscription.id,
              failureCount: subscription.failureCount,
            },
          );
        }
      }
    }

    delivery.updatedAt = new Date();
    this.subscriptions.set(subscription.id, subscription);
    this.deliveries.set(delivery.id, delivery);
  }

  private calculateRetryDelay(
    attemptNumber: number,
    baseDelay: number,
  ): number {
    // Exponential backoff with jitter
    const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
    return Math.min(exponentialDelay + jitter, this.MAX_RETRY_DELAY);
  }

  private startHealthMonitoring(): void {
    setInterval(() => {
      const stats = this.getStatistics();

      SafeLogger.info("Webhook system health check", {
        subscriptions: stats.subscriptions,
        successRate: stats.health.successRate,
        avgDeliveryTime: stats.health.avgDeliveryTime,
        retryQueueSize: stats.health.retryQueueSize,
        deadLetterQueueSize: stats.health.deadLetterQueueSize,
      });

      // Alert if success rate is too low
      if (stats.health.successRate < 90 && stats.deliveries.total > 10) {
        SafeLogger.warn("Webhook success rate below threshold", {
          successRate: stats.health.successRate,
          threshold: 90,
        });
      }

      // Alert if retry queue is getting too large
      if (stats.health.retryQueueSize > 100) {
        SafeLogger.warn("Webhook retry queue size high", {
          size: stats.health.retryQueueSize,
          threshold: 100,
        });
      }
    }, 300000); // Check every 5 minutes
  }

  private limitEventHistory(): void {
    if (this.eventHistory.size > this.EVENT_HISTORY_LIMIT) {
      const entries = Array.from(this.eventHistory.entries());
      entries.sort(
        (a, b) =>
          new Date(a[1].timestamp).getTime() -
          new Date(b[1].timestamp).getTime(),
      );

      // Remove oldest 10% of events
      const toRemove = Math.floor(this.EVENT_HISTORY_LIMIT * 0.1);
      for (let i = 0; i < toRemove; i++) {
        this.eventHistory.delete(entries[i][0]);
      }
    }
  }

  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateSecret(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}

/**
 * Default webhook event system instance
 */
export const defaultWebhookSystem = new WebhookEventSystem();
