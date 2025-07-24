/**
 * External Integrations Abstraction Layer
 *
 * Provides unified interfaces for integrating with external services like
 * calendar systems, payment processors, email/SMS services, CRM, and accounting software.
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import { CircuitBreaker } from "./CircuitBreaker";
import { MetricsCollector } from "./MetricsCollector";

export enum IntegrationType {
  CALENDAR = "calendar",
  PAYMENT = "payment",
  EMAIL = "email",
  SMS = "sms",
  CRM = "crm",
  ACCOUNTING = "accounting",
  NOTIFICATION = "notification",
}

export enum IntegrationStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ERROR = "error",
  MAINTENANCE = "maintenance",
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  credentials: Record<string, string>;
  settings: Record<string, unknown>;
  timeout: number;
  retryAttempts: number;
  circuitBreakerEnabled: boolean;
}

export interface IntegrationResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata: {
    requestId: string;
    timestamp: number;
    duration: number;
    provider: string;
    cached?: boolean;
  };
}

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  reminders?: Array<{ minutes: number; method: "email" | "popup" }>;
  customFields?: Record<string, unknown>;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerId?: string;
  metadata?: Record<string, unknown>;
  returnUrl?: string;
  webhookUrl?: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentUrl?: string;
  amount: number;
  currency: string;
  fees?: number;
  processorResponse?: unknown;
}

export interface EmailMessage {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
  templateId?: string;
  templateData?: Record<string, unknown>;
}

export interface SMSMessage {
  to: string[];
  message: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
}

export interface CRMContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
  source?: string;
}

export interface AccountingTransaction {
  id?: string;
  type: "income" | "expense";
  amount: number;
  currency: string;
  description: string;
  category?: string;
  customerId?: string;
  invoiceId?: string;
  date: Date;
  taxRate?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Base integration class
 */
export abstract class BaseIntegration {
  protected config: IntegrationConfig;
  protected circuitBreaker?: CircuitBreaker;
  protected metrics?: MetricsCollector;

  constructor(config: IntegrationConfig, metrics?: MetricsCollector) {
    this.config = config;
    this.metrics = metrics;

    if (config.circuitBreakerEnabled) {
      this.circuitBreaker = new CircuitBreaker({
        failureThreshold: 3,
        resetTimeout: 60000,
        timeout: config.timeout,
      });
    }
  }

  protected async executeWithProtection<T>(
    operation: () => Promise<T>,
    operationName: string,
  ): Promise<IntegrationResponse<T>> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      let result: T;

      if (this.circuitBreaker) {
        result = await this.circuitBreaker.execute(operation);
      } else {
        result = await operation();
      }

      const duration = Date.now() - startTime;

      // Record success metrics
      this.metrics?.recordRequest(requestId, {
        method: operationName,
        path: `${this.config.type}/${this.config.provider}`,
        statusCode: 200,
        duration,
      });

      SafeLogger.info("Integration operation succeeded", {
        provider: this.config.provider,
        type: this.config.type,
        operation: operationName,
        duration,
      });

      return {
        success: true,
        data: result,
        metadata: {
          requestId,
          timestamp: Date.now(),
          duration,
          provider: this.config.provider,
        },
      };
    } catch (error: unknown) {
      const duration = Date.now() - startTime;

      // Record error metrics
      this.metrics?.recordRequest(requestId, {
        method: operationName,
        path: `${this.config.type}/${this.config.provider}`,
        statusCode: 500,
        duration,
        errors: [error instanceof Error ? error.message : String(error)],
      });

      this.metrics?.recordError(requestId, error);

      SafeLogger.error("Integration operation failed", {
        provider: this.config.provider,
        type: this.config.type,
        operation: operationName,
        error: error.message,
        duration,
      });

      return {
        success: false,
        error: {
          code: error.code || "INTEGRATION_ERROR",
          message: error.message || "Integration operation failed",
          details: error.details || {},
        },
        metadata: {
          requestId,
          timestamp: Date.now(),
          duration,
          provider: this.config.provider,
        },
      };
    }
  }

  public getConfig(): IntegrationConfig {
    return { ...this.config };
  }

  public getStatus(): IntegrationStatus {
    return this.config.status;
  }

  public setStatus(status: IntegrationStatus): void {
    this.config.status = status;
    SafeLogger.info("Integration status changed", {
      provider: this.config.provider,
      type: this.config.type,
      status,
    });
  }

  abstract healthCheck(): Promise<
    IntegrationResponse<{ healthy: boolean; details?: unknown }>
  >;
}

/**
 * Calendar integration abstract class
 */
export abstract class CalendarIntegration extends BaseIntegration {
  abstract createEvent(
    event: CalendarEvent,
  ): Promise<IntegrationResponse<{ eventId: string }>>;
  abstract updateEvent(
    eventId: string,
    event: Partial<CalendarEvent>,
  ): Promise<IntegrationResponse<void>>;
  abstract deleteEvent(eventId: string): Promise<IntegrationResponse<void>>;
  abstract getEvent(
    eventId: string,
  ): Promise<IntegrationResponse<CalendarEvent>>;
  abstract listEvents(
    startDate: Date,
    endDate: Date,
  ): Promise<IntegrationResponse<CalendarEvent[]>>;
}

/**
 * Payment integration abstract class
 */
export abstract class PaymentIntegration extends BaseIntegration {
  abstract createPayment(
    request: PaymentRequest,
  ): Promise<IntegrationResponse<PaymentResponse>>;
  abstract getPaymentStatus(
    transactionId: string,
  ): Promise<IntegrationResponse<PaymentResponse>>;
  abstract refundPayment(
    transactionId: string,
    amount?: number,
  ): Promise<IntegrationResponse<{ refundId: string }>>;
  abstract capturePayment(
    transactionId: string,
  ): Promise<IntegrationResponse<PaymentResponse>>;
}

/**
 * Email integration abstract class
 */
export abstract class EmailIntegration extends BaseIntegration {
  abstract sendEmail(
    message: EmailMessage,
  ): Promise<IntegrationResponse<{ messageId: string }>>;
  abstract sendTemplateEmail(
    templateId: string,
    to: string[],
    data: Record<string, unknown>,
  ): Promise<IntegrationResponse<{ messageId: string }>>;
  abstract getEmailStatus(
    messageId: string,
  ): Promise<IntegrationResponse<{ status: string; delivered?: boolean }>>;
}

/**
 * SMS integration abstract class
 */
export abstract class SMSIntegration extends BaseIntegration {
  abstract sendSMS(
    message: SMSMessage,
  ): Promise<IntegrationResponse<{ messageId: string }>>;
  abstract getDeliveryStatus(
    messageId: string,
  ): Promise<IntegrationResponse<{ status: string; delivered?: boolean }>>;
}

/**
 * CRM integration abstract class
 */
export abstract class CRMIntegration extends BaseIntegration {
  abstract createContact(
    contact: CRMContact,
  ): Promise<IntegrationResponse<{ contactId: string }>>;
  abstract updateContact(
    contactId: string,
    contact: Partial<CRMContact>,
  ): Promise<IntegrationResponse<void>>;
  abstract getContact(
    contactId: string,
  ): Promise<IntegrationResponse<CRMContact>>;
  abstract findContactByEmail(
    email: string,
  ): Promise<IntegrationResponse<CRMContact | null>>;
  abstract addContactTag(
    contactId: string,
    tag: string,
  ): Promise<IntegrationResponse<void>>;
}

/**
 * Accounting integration abstract class
 */
export abstract class AccountingIntegration extends BaseIntegration {
  abstract createTransaction(
    transaction: AccountingTransaction,
  ): Promise<IntegrationResponse<{ transactionId: string }>>;
  abstract createInvoice(
    invoice: unknown,
  ): Promise<IntegrationResponse<{ invoiceId: string }>>;
  abstract getTransaction(
    transactionId: string,
  ): Promise<IntegrationResponse<AccountingTransaction>>;
  abstract listTransactions(
    startDate: Date,
    endDate: Date,
  ): Promise<IntegrationResponse<AccountingTransaction[]>>;
}

/**
 * External integrations manager
 */
export class ExternalIntegrations {
  private readonly integrations = new Map<string, BaseIntegration>();
  private readonly integrationsByType = new Map<
    IntegrationType,
    Map<string, BaseIntegration>
  >();
  private readonly metrics?: MetricsCollector;

  constructor(metrics?: MetricsCollector) {
    this.metrics = metrics;
    this.initializeDefaultIntegrations();
  }

  /**
   * Register an integration
   */
  public registerIntegration(integration: BaseIntegration): void {
    const config = integration.getConfig();
    this.integrations.set(config.id, integration);

    if (!this.integrationsByType.has(config.type)) {
      this.integrationsByType.set(config.type, new Map());
    }

    this.integrationsByType.get(config.type)!.set(config.id, integration);

    SafeLogger.info("Integration registered", {
      id: config.id,
      name: config.name,
      type: config.type,
      provider: config.provider,
    });
  }

  /**
   * Get integration by ID
   */
  public getIntegration(id: string): BaseIntegration | null {
    return this.integrations.get(id) || null;
  }

  /**
   * Get integrations by type
   */
  public getIntegrationsByType<T extends BaseIntegration>(
    type: IntegrationType,
  ): T[] {
    const typeMap = this.integrationsByType.get(type);
    return typeMap ? (Array.from(typeMap.values()) as T[]) : [];
  }

  /**
   * Get the primary (active) integration for a type
   */
  public getPrimaryIntegration<T extends BaseIntegration>(
    type: IntegrationType,
  ): T | null {
    const integrations = this.getIntegrationsByType<T>(type);
    return (
      integrations.find(
        (integration) => integration.getStatus() === IntegrationStatus.ACTIVE,
      ) || null
    );
  }

  /**
   * Calendar operations using primary calendar integration
   */
  public async createCalendarEvent(
    event: CalendarEvent,
  ): Promise<IntegrationResponse<{ eventId: string }>> {
    const calendar = this.getPrimaryIntegration<CalendarIntegration>(
      IntegrationType.CALENDAR,
    );
    if (!calendar) {
      return this.createErrorResponse("No active calendar integration found");
    }

    return calendar.createEvent(event);
  }

  /**
   * Payment operations using primary payment integration
   */
  public async createPayment(
    request: PaymentRequest,
  ): Promise<IntegrationResponse<PaymentResponse>> {
    const payment = this.getPrimaryIntegration<PaymentIntegration>(
      IntegrationType.PAYMENT,
    );
    if (!payment) {
      return this.createErrorResponse("No active payment integration found");
    }

    return payment.createPayment(request);
  }

  /**
   * Email operations using primary email integration
   */
  public async sendEmail(
    message: EmailMessage,
  ): Promise<IntegrationResponse<{ messageId: string }>> {
    const email = this.getPrimaryIntegration<EmailIntegration>(
      IntegrationType.EMAIL,
    );
    if (!email) {
      return this.createErrorResponse("No active email integration found");
    }

    return email.sendEmail(message);
  }

  /**
   * SMS operations using primary SMS integration
   */
  public async sendSMS(
    message: SMSMessage,
  ): Promise<IntegrationResponse<{ messageId: string }>> {
    const sms = this.getPrimaryIntegration<SMSIntegration>(IntegrationType.SMS);
    if (!sms) {
      return this.createErrorResponse("No active SMS integration found");
    }

    return sms.sendSMS(message);
  }

  /**
   * CRM operations using primary CRM integration
   */
  public async createCRMContact(
    contact: CRMContact,
  ): Promise<IntegrationResponse<{ contactId: string }>> {
    const crm = this.getPrimaryIntegration<CRMIntegration>(IntegrationType.CRM);
    if (!crm) {
      return this.createErrorResponse("No active CRM integration found");
    }

    return crm.createContact(contact);
  }

  /**
   * Accounting operations using primary accounting integration
   */
  public async createAccountingTransaction(
    transaction: AccountingTransaction,
  ): Promise<IntegrationResponse<{ transactionId: string }>> {
    const accounting = this.getPrimaryIntegration<AccountingIntegration>(
      IntegrationType.ACCOUNTING,
    );
    if (!accounting) {
      return this.createErrorResponse("No active accounting integration found");
    }

    return accounting.createTransaction(transaction);
  }

  /**
   * Health check all integrations
   */
  public async performHealthChecks(): Promise<
    Record<string, IntegrationResponse<{ healthy: boolean }>>
  > {
    const results: Record<
      string,
      IntegrationResponse<{ healthy: boolean }>
    > = {};

    const healthCheckPromises = Array.from(this.integrations.entries()).map(
      async ([id, integration]) => {
        try {
          const result = await integration.healthCheck();
          results[id] = result;
        } catch (error: unknown) {
          results[id] = this.createErrorResponse(
            `Health check failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      },
    );

    await Promise.allSettled(healthCheckPromises);
    return results;
  }

  /**
   * Get integration status summary
   */
  public getIntegrationStatus(): {
    total: number;
    byStatus: Record<IntegrationStatus, number>;
    byType: Record<IntegrationType, number>;
    integrations: Array<{
      id: string;
      name: string;
      type: IntegrationType;
      provider: string;
      status: IntegrationStatus;
    }>;
  } {
    const integrations = Array.from(this.integrations.values());

    const byStatus = integrations.reduce(
      (acc, integration) => {
        const status = integration.getStatus();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<IntegrationStatus, number>,
    );

    const byType = integrations.reduce(
      (acc, integration) => {
        const config = integration.getConfig();
        acc[config.type] = (acc[config.type] || 0) + 1;
        return acc;
      },
      {} as Record<IntegrationType, number>,
    );

    return {
      total: integrations.length,
      byStatus,
      byType,
      integrations: integrations.map((integration) => {
        const config = integration.getConfig();
        return {
          id: config.id,
          name: config.name,
          type: config.type,
          provider: config.provider,
          status: config.status,
        };
      }),
    };
  }

  /**
   * Remove an integration
   */
  public removeIntegration(id: string): boolean {
    const integration = this.integrations.get(id);
    if (!integration) {
      return false;
    }

    const config = integration.getConfig();

    this.integrations.delete(id);

    const typeMap = this.integrationsByType.get(config.type);
    if (typeMap) {
      typeMap.delete(id);
    }

    SafeLogger.info("Integration removed", {
      id,
      type: config.type,
      provider: config.provider,
    });
    return true;
  }

  /**
   * Initialize default mock integrations for development
   */
  private initializeDefaultIntegrations(): void {
    // These would typically be replaced with real integrations in production
    SafeLogger.info("External integrations manager initialized");
  }

  private createErrorResponse<T>(message: string): IntegrationResponse<T> {
    return {
      success: false,
      error: {
        code: "INTEGRATION_NOT_AVAILABLE",
        message,
      },
      metadata: {
        requestId: `error_${Date.now()}`,
        timestamp: Date.now(),
        duration: 0,
        provider: "none",
      },
    };
  }
}

/**
 * Integration factory for creating common integration types
 */
export const createIntegration = {
  /**
   * Mock calendar integration for development
   */
  mockCalendar: (id: string = "mock-calendar"): CalendarIntegration => {
    class MockCalendarIntegration extends CalendarIntegration {
      async createEvent(
        event: CalendarEvent,
      ): Promise<IntegrationResponse<{ eventId: string }>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate API delay
          return { eventId: `cal_${Date.now()}` };
        }, "createEvent");
      }

      async updateEvent(
        eventId: string,
        event: Partial<CalendarEvent>,
      ): Promise<IntegrationResponse<void>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }, "updateEvent");
      }

      async deleteEvent(eventId: string): Promise<IntegrationResponse<void>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }, "deleteEvent");
      }

      async getEvent(
        eventId: string,
      ): Promise<IntegrationResponse<CalendarEvent>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return {
            id: eventId,
            title: "Mock Event",
            startTime: new Date(),
            endTime: new Date(Date.now() + 3600000),
          };
        }, "getEvent");
      }

      async listEvents(
        startDate: Date,
        endDate: Date,
      ): Promise<IntegrationResponse<CalendarEvent[]>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return [];
        }, "listEvents");
      }

      async healthCheck(): Promise<IntegrationResponse<{ healthy: boolean }>> {
        return this.executeWithProtection(async () => {
          return { healthy: true };
        }, "healthCheck");
      }
    }

    return new MockCalendarIntegration({
      id,
      name: "Mock Calendar",
      type: IntegrationType.CALENDAR,
      provider: "mock",
      status: IntegrationStatus.ACTIVE,
      credentials: {},
      settings: {},
      timeout: 5000,
      retryAttempts: 3,
      circuitBreakerEnabled: false,
    });
  },

  /**
   * Mock payment integration for development
   */
  mockPayment: (id: string = "mock-payment"): PaymentIntegration => {
    class MockPaymentIntegration extends PaymentIntegration {
      async createPayment(
        request: PaymentRequest,
      ): Promise<IntegrationResponse<PaymentResponse>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return {
            transactionId: `pay_${Date.now()}`,
            status: "pending",
            paymentUrl: "https://mock-payment.example.com",
            amount: request.amount,
            currency: request.currency,
          };
        }, "createPayment");
      }

      async getPaymentStatus(
        transactionId: string,
      ): Promise<IntegrationResponse<PaymentResponse>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return {
            transactionId,
            status: "completed",
            amount: 100.0,
            currency: "EUR",
          };
        }, "getPaymentStatus");
      }

      async refundPayment(
        transactionId: string,
        amount?: number,
      ): Promise<IntegrationResponse<{ refundId: string }>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 150));
          return { refundId: `refund_${Date.now()}` };
        }, "refundPayment");
      }

      async capturePayment(
        transactionId: string,
      ): Promise<IntegrationResponse<PaymentResponse>> {
        return this.executeWithProtection(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return {
            transactionId,
            status: "completed",
            amount: 100.0,
            currency: "EUR",
          };
        }, "capturePayment");
      }

      async healthCheck(): Promise<IntegrationResponse<{ healthy: boolean }>> {
        return this.executeWithProtection(async () => {
          return { healthy: true };
        }, "healthCheck");
      }
    }

    return new MockPaymentIntegration({
      id,
      name: "Mock Payment",
      type: IntegrationType.PAYMENT,
      provider: "mock",
      status: IntegrationStatus.ACTIVE,
      credentials: {},
      settings: {},
      timeout: 10000,
      retryAttempts: 3,
      circuitBreakerEnabled: true,
    });
  },
};
