/**
 * Stripe Payment Integration
 *
 * Provides integration with Stripe payment processing API.
 * Handles payment creation, status tracking, refunds, and webhook processing.
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import {
  PaymentIntegration,
  PaymentRequest,
  PaymentResponse,
  IntegrationConfig,
  IntegrationResponse,
  IntegrationStatus,
  IntegrationType,
} from "../ExternalIntegrations";
import { MetricsCollector } from "../MetricsCollector";

interface StripeCredentials {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
}

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "requires_payment_method" | "requires_confirmation" | "requires_action" | 
          "processing" | "requires_capture" | "canceled" | "succeeded";
  client_secret?: string;
  description?: string;
  metadata?: Record<string, string>;
  customer?: string;
  payment_method?: string;
  receipt_email?: string;
  application_fee_amount?: number;
  transfer_data?: {
    destination: string;
  };
}

interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

/**
 * Stripe payment integration implementation
 */
export class StripePaymentIntegration extends PaymentIntegration {
  private credentials: StripeCredentials;
  private readonly baseUrl = "https://api.stripe.com/v1";
  private readonly apiVersion = "2024-06-20";

  constructor(
    config: IntegrationConfig,
    metrics?: MetricsCollector,
    credentials?: StripeCredentials,
  ) {
    super(config, metrics);

    if (!credentials) {
      throw new Error("Stripe credentials are required");
    }

    this.credentials = credentials;
    this.validateCredentials();
  }

  /**
   * Create payment
   */
  async createPayment(
    request: PaymentRequest,
  ): Promise<IntegrationResponse<PaymentResponse>> {
    return this.executeWithProtection(async () => {
      // Create or get customer if customerId is provided
      let customerId: string | undefined;
      if (request.customerId) {
        const customerResponse = await this.getOrCreateCustomer(request);
        customerId = customerResponse.id;
      }

      // Create payment intent
      const paymentIntentData: Partial<StripePaymentIntent> = {
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: request.currency.toLowerCase(),
        description: request.description,
        metadata: {
          bookingId: request.metadata?.bookingId?.toString() || "",
          source: "wesley-ambacht-api",
          ...request.metadata,
        },
      };

      if (customerId) {
        paymentIntentData.customer = customerId;
      }

      const paymentIntent = await this.makeApiRequest<StripePaymentIntent>(
        "POST",
        "/payment_intents",
        paymentIntentData,
      );

      const paymentResponse: PaymentResponse = {
        transactionId: paymentIntent.id,
        status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
        paymentUrl: request.returnUrl 
          ? `${request.returnUrl}?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}`
          : undefined,
        amount: request.amount,
        currency: request.currency,
        processorResponse: paymentIntent,
      };

      SafeLogger.info("Stripe payment created", {
        paymentIntentId: paymentIntent.id,
        amount: request.amount,
        currency: request.currency,
        status: paymentIntent.status,
        customerId,
      });

      return paymentResponse;
    }, "createPayment");
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(
    transactionId: string,
  ): Promise<IntegrationResponse<PaymentResponse>> {
    return this.executeWithProtection(async () => {
      const paymentIntent = await this.makeApiRequest<StripePaymentIntent>(
        "GET",
        `/payment_intents/${transactionId}`,
      );

      const paymentResponse: PaymentResponse = {
        transactionId: paymentIntent.id,
        status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        processorResponse: paymentIntent,
      };

      SafeLogger.info("Stripe payment status retrieved", {
        paymentIntentId: transactionId,
        status: paymentIntent.status,
      });

      return paymentResponse;
    }, "getPaymentStatus");
  }

  /**
   * Refund payment
   */
  async refundPayment(
    transactionId: string,
    amount?: number,
  ): Promise<IntegrationResponse<{ refundId: string }>> {
    return this.executeWithProtection(async () => {
      const refundData: any = {
        payment_intent: transactionId,
        metadata: {
          source: "wesley-ambacht-api",
          timestamp: new Date().toISOString(),
        },
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.makeApiRequest<{ id: string; amount: number; status: string }>(
        "POST",
        "/refunds",
        refundData,
      );

      SafeLogger.info("Stripe refund created", {
        refundId: refund.id,
        paymentIntentId: transactionId,
        amount: amount || "full",
        status: refund.status,
      });

      return { refundId: refund.id };
    }, "refundPayment");
  }

  /**
   * Capture payment (for payments that require manual capture)
   */
  async capturePayment(
    transactionId: string,
  ): Promise<IntegrationResponse<PaymentResponse>> {
    return this.executeWithProtection(async () => {
      const paymentIntent = await this.makeApiRequest<StripePaymentIntent>(
        "POST",
        `/payment_intents/${transactionId}/capture`,
      );

      const paymentResponse: PaymentResponse = {
        transactionId: paymentIntent.id,
        status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        processorResponse: paymentIntent,
      };

      SafeLogger.info("Stripe payment captured", {
        paymentIntentId: transactionId,
        amount: paymentResponse.amount,
        status: paymentIntent.status,
      });

      return paymentResponse;
    }, "capturePayment");
  }

  /**
   * Create setup intent for saving payment method
   */
  async createSetupIntent(
    customerId: string,
    metadata?: Record<string, string>,
  ): Promise<IntegrationResponse<{ setupIntentId: string; clientSecret: string }>> {
    return this.executeWithProtection(async () => {
      const setupIntent = await this.makeApiRequest<{
        id: string;
        client_secret: string;
        status: string;
      }>(
        "POST",
        "/setup_intents",
        {
          customer: customerId,
          usage: "off_session",
          metadata: {
            source: "wesley-ambacht-api",
            ...metadata,
          },
        },
      );

      SafeLogger.info("Stripe setup intent created", {
        setupIntentId: setupIntent.id,
        customerId,
        status: setupIntent.status,
      });

      return {
        setupIntentId: setupIntent.id,
        clientSecret: setupIntent.client_secret,
      };
    }, "createSetupIntent");
  }

  /**
   * List customer payment methods
   */
  async getCustomerPaymentMethods(
    customerId: string,
  ): Promise<IntegrationResponse<Array<{ id: string; type: string; last4?: string }>>> {
    return this.executeWithProtection(async () => {
      const paymentMethods = await this.makeApiRequest<{
        data: Array<{
          id: string;
          type: string;
          card?: { last4: string; brand: string };
        }>;
      }>("GET", `/customers/${customerId}/payment_methods?type=card`);

      const methods = paymentMethods.data.map((pm) => ({
        id: pm.id,
        type: pm.type,
        last4: pm.card?.last4,
        brand: pm.card?.brand,
      }));

      SafeLogger.info("Stripe payment methods retrieved", {
        customerId,
        count: methods.length,
      });

      return methods;
    }, "getCustomerPaymentMethods");
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(
    payload: string,
    signature: string,
  ): Promise<IntegrationResponse<{ eventType: string; processed: boolean }>> {
    return this.executeWithProtection(async () => {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        throw new Error("Invalid webhook signature");
      }

      const event = JSON.parse(payload);

      SafeLogger.info("Stripe webhook event received", {
        eventType: event.type,
        eventId: event.id,
      });

      // Process different event types
      let processed = false;

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSucceeded(event.data.object);
          processed = true;
          break;

        case "payment_intent.payment_failed":
          await this.handlePaymentFailed(event.data.object);
          processed = true;
          break;

        case "charge.dispute.created":
          await this.handleChargeDispute(event.data.object);
          processed = true;
          break;

        default:
          SafeLogger.info(`Unhandled Stripe webhook event: ${event.type}`);
      }

      return {
        eventType: event.type,
        processed,
      };
    }, "processWebhookEvent");
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<IntegrationResponse<{ healthy: boolean }>> {
    return this.executeWithProtection(async () => {
      // Simple health check - verify API connectivity
      const balance = await this.makeApiRequest<{
        available: Array<{ amount: number; currency: string }>;
        pending: Array<{ amount: number; currency: string }>;
      }>("GET", "/balance");

      const healthy = Array.isArray(balance.available);

      SafeLogger.info("Stripe health check", {
        healthy,
        availableBalance: balance.available?.length || 0,
        pendingBalance: balance.pending?.length || 0,
      });

      return { healthy };
    }, "healthCheck");
  }

  // Private methods

  private async makeApiRequest<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.credentials.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": this.apiVersion,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      if (typeof body === "object") {
        options.body = this.encodeFormData(body);
      } else {
        options.body = body as string;
      }
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  private async getOrCreateCustomer(
    request: PaymentRequest,
  ): Promise<StripeCustomer> {
    // In a real implementation, you'd first check if customer exists
    // For now, we'll create a new customer or use existing ID
    if (request.customerId && request.customerId.startsWith("cus_")) {
      // It's already a Stripe customer ID
      const customer = await this.makeApiRequest<StripeCustomer>(
        "GET",
        `/customers/${request.customerId}`,
      );
      return customer;
    }

    // Create new customer
    const customerData = {
      email: request.metadata?.email || "",
      name: request.metadata?.customerName || "",
      metadata: {
        source: "wesley-ambacht-api",
        originalId: request.customerId || "",
        ...request.metadata,
      },
    };

    const customer = await this.makeApiRequest<StripeCustomer>(
      "POST",
      "/customers",
      customerData,
    );

    return customer;
  }

  private mapStripeStatusToPaymentStatus(
    stripeStatus: StripePaymentIntent["status"],
  ): PaymentResponse["status"] {
    switch (stripeStatus) {
      case "succeeded":
        return "completed";
      case "requires_payment_method":
      case "requires_confirmation":
      case "requires_action":
      case "processing":
      case "requires_capture":
        return "pending";
      case "canceled":
        return "cancelled";
      default:
        return "failed";
    }
  }

  private encodeFormData(data: unknown): string {
    const params = new URLSearchParams();
    
    const encode = (obj: any, prefix = ""): void => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const encodedKey = prefix ? `${prefix}[${key}]` : key;
          
          if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            encode(value, encodedKey);
          } else {
            params.append(encodedKey, String(value));
          }
        }
      }
    };

    encode(data);
    return params.toString();
  }

  private verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require("crypto");
      const expectedSignature = crypto
        .createHmac("sha256", this.credentials.webhookSecret)
        .update(payload, "utf8")
        .digest("hex");

      const providedSignature = signature.split("=")[1];
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(providedSignature, "hex"),
      );
    } catch (error) {
      SafeLogger.error("Error verifying Stripe webhook signature", error);
      return false;
    }
  }

  private async handlePaymentSucceeded(paymentIntent: StripePaymentIntent): Promise<void> {
    SafeLogger.info("Payment succeeded webhook processed", {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
    
    // Here you would typically:
    // 1. Update booking status in your database
    // 2. Send confirmation emails
    // 3. Trigger calendar event creation
    // 4. Update CRM records
    // This would integrate with your webhook event system
  }

  private async handlePaymentFailed(paymentIntent: StripePaymentIntent): Promise<void> {
    SafeLogger.warn("Payment failed webhook processed", {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
    
    // Handle payment failure:
    // 1. Update booking status
    // 2. Send failure notification
    // 3. Release calendar slots
  }

  private async handleChargeDispute(charge: any): Promise<void> {
    SafeLogger.warn("Charge dispute webhook processed", {
      chargeId: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency,
      reason: charge.dispute?.reason,
    });
    
    // Handle disputes:
    // 1. Alert administrators
    // 2. Gather evidence
    // 3. Update records
  }

  private validateCredentials(): void {
    const required = ["secretKey", "publishableKey", "webhookSecret"];
    const missing = required.filter(
      (key) => !this.credentials[key as keyof StripeCredentials],
    );

    if (missing.length > 0) {
      throw new Error(`Missing Stripe credentials: ${missing.join(", ")}`);
    }

    // Validate secret key format
    if (!this.credentials.secretKey.startsWith("sk_")) {
      throw new Error("Invalid Stripe secret key format");
    }

    // Validate publishable key format
    if (!this.credentials.publishableKey.startsWith("pk_")) {
      throw new Error("Invalid Stripe publishable key format");
    }
  }
}

/**
 * Create Stripe payment integration instance
 */
export function createStripePaymentIntegration(
  credentials: StripeCredentials,
  metrics?: MetricsCollector,
): StripePaymentIntegration {
  const config: IntegrationConfig = {
    id: "stripe-payments",
    name: "Stripe Payments",
    type: IntegrationType.PAYMENT,
    provider: "stripe",
    status: IntegrationStatus.ACTIVE,
    credentials: {
      secretKey: credentials.secretKey,
      publishableKey: credentials.publishableKey,
      webhookSecret: credentials.webhookSecret,
    },
    settings: {
      currency: "EUR",
      captureMethod: "automatic",
      setupFutureUsage: "off_session",
    },
    timeout: 15000,
    retryAttempts: 3,
    circuitBreakerEnabled: true,
  };

  return new StripePaymentIntegration(config, metrics, credentials);
}