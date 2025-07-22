/**
 * SendGrid Email Integration
 *
 * Provides integration with SendGrid email service for transactional emails.
 * Handles email sending, template management, and delivery tracking.
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import {
  EmailIntegration,
  EmailMessage,
  IntegrationConfig,
  IntegrationResponse,
  IntegrationStatus,
  IntegrationType,
} from "../ExternalIntegrations";
import { MetricsCollector } from "../MetricsCollector";

interface SendGridCredentials {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

interface SendGridMessage {
  to: Array<{
    email: string;
    name?: string;
  }>;
  from: {
    email: string;
    name?: string;
  };
  cc?: Array<{
    email: string;
    name?: string;
  }>;
  bcc?: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  content: Array<{
    type: "text/plain" | "text/html";
    value: string;
  }>;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition?: "attachment" | "inline";
  }>;
  template_id?: string;
  dynamic_template_data?: Record<string, unknown>;
  custom_args?: Record<string, string>;
  tracking_settings?: {
    click_tracking?: {
      enable: boolean;
      enable_text?: boolean;
    };
    open_tracking?: {
      enable: boolean;
      substitution_tag?: string;
    };
    subscription_tracking?: {
      enable: boolean;
      text?: string;
      html?: string;
      substitution_tag?: string;
    };
  };
}

interface SendGridResponse {
  message_id?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * SendGrid email integration implementation
 */
export class SendGridEmailIntegration extends EmailIntegration {
  private credentials: SendGridCredentials;
  private readonly baseUrl = "https://api.sendgrid.com/v3";

  constructor(
    config: IntegrationConfig,
    metrics?: MetricsCollector,
    credentials?: SendGridCredentials,
  ) {
    super(config, metrics);

    if (!credentials) {
      throw new Error("SendGrid credentials are required");
    }

    this.credentials = credentials;
    this.validateCredentials();
  }

  /**
   * Send email
   */
  async sendEmail(
    message: EmailMessage,
  ): Promise<IntegrationResponse<{ messageId: string }>> {
    return this.executeWithProtection(async () => {
      const sendGridMessage = this.convertToSendGridMessage(message);
      const response = await this.makeApiRequest<SendGridResponse[]>(
        "POST",
        "/mail/send",
        { personalizations: [sendGridMessage], ...this.getBaseMessageData(sendGridMessage) },
      );

      // SendGrid returns 202 with no body for successful sends
      // Extract message ID from response headers or generate one
      const messageId = this.extractMessageId(response) || `sg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      SafeLogger.info("SendGrid email sent", {
        messageId,
        to: message.to,
        subject: message.subject,
        hasHtml: !!message.htmlContent,
        hasText: !!message.textContent,
        hasAttachments: !!message.attachments?.length,
      });

      return { messageId };
    }, "sendEmail");
  }

  /**
   * Send template email
   */
  async sendTemplateEmail(
    templateId: string,
    to: string[],
    data: Record<string, unknown>,
    subject?: string,
  ): Promise<IntegrationResponse<{ messageId: string }>> {
    return this.executeWithProtection(async () => {
      const message: SendGridMessage = {
        to: to.map((email) => ({ email })),
        from: {
          email: this.credentials.fromEmail,
          name: this.credentials.fromName,
        },
        subject: subject || "{{ subject }}", // Let template handle subject if not provided
        content: [], // Template content will be used
        template_id: templateId,
        dynamic_template_data: data,
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
      };

      const response = await this.makeApiRequest<SendGridResponse[]>(
        "POST",
        "/mail/send",
        { personalizations: [message], ...this.getBaseMessageData(message) },
      );

      const messageId = this.extractMessageId(response) || `sg_template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      SafeLogger.info("SendGrid template email sent", {
        messageId,
        templateId,
        to,
        dataKeys: Object.keys(data),
      });

      return { messageId };
    }, "sendTemplateEmail");
  }

  /**
   * Get email status (requires SendGrid Event Webhook or Activity API)
   */
  async getEmailStatus(
    messageId: string,
  ): Promise<IntegrationResponse<{ status: string; delivered?: boolean }>> {
    return this.executeWithProtection(async () => {
      // Note: SendGrid doesn't provide a direct message status API
      // This would typically require implementing webhook handling
      // For now, we'll simulate status checking
      
      SafeLogger.info("SendGrid email status check", {
        messageId,
        note: "Status checking requires webhook implementation",
      });

      // In a real implementation, you would:
      // 1. Store message IDs and track them via webhooks
      // 2. Query your own database for delivery status
      // 3. Use SendGrid's Activity API (if available for your plan)

      return {
        status: "sent", // Default status since we can't check without webhooks
        delivered: undefined, // Unknown without webhook data
      };
    }, "getEmailStatus");
  }

  /**
   * Get email statistics
   */
  async getEmailStatistics(
    startDate: Date,
    endDate?: Date,
  ): Promise<IntegrationResponse<{
    sent: number;
    delivered: number;
    opens: number;
    clicks: number;
    bounces: number;
    spam_reports: number;
  }>> {
    return this.executeWithProtection(async () => {
      const params = new URLSearchParams({
        start_date: startDate.toISOString().split('T')[0],
        aggregated_by: "day",
      });

      if (endDate) {
        params.append("end_date", endDate.toISOString().split('T')[0]);
      }

      const stats = await this.makeApiRequest<Array<{
        date: string;
        stats: Array<{
          metrics: {
            requests: number;
            delivered: number;
            unique_opens: number;
            unique_clicks: number;
            bounces: number;
            spam_reports: number;
          };
        }>;
      }>>("GET", `/stats?${params}`);

      // Aggregate statistics
      const totals = stats.reduce(
        (acc, day) => {
          day.stats.forEach((stat) => {
            acc.sent += stat.metrics.requests;
            acc.delivered += stat.metrics.delivered;
            acc.opens += stat.metrics.unique_opens;
            acc.clicks += stat.metrics.unique_clicks;
            acc.bounces += stat.metrics.bounces;
            acc.spam_reports += stat.metrics.spam_reports;
          });
          return acc;
        },
        {
          sent: 0,
          delivered: 0,
          opens: 0,
          clicks: 0,
          bounces: 0,
          spam_reports: 0,
        },
      );

      SafeLogger.info("SendGrid email statistics retrieved", {
        period: `${startDate.toISOString().split('T')[0]} - ${endDate?.toISOString().split('T')[0] || 'now'}`,
        totals,
      });

      return totals;
    }, "getEmailStatistics");
  }

  /**
   * Validate email address
   */
  async validateEmailAddress(
    email: string,
  ): Promise<IntegrationResponse<{
    valid: boolean;
    reason?: string;
    suggestion?: string;
  }>> {
    return this.executeWithProtection(async () => {
      const response = await this.makeApiRequest<{
        result: {
          email: string;
          verdict: "Valid" | "Invalid" | "Risky";
          score: number;
          local: string;
          host: string;
          suggestion?: string;
          checks: {
            domain: {
              has_valid_address_syntax: boolean;
              has_mx_or_a_record: boolean;
              is_suspected_disposable_address: boolean;
            };
            local_part: {
              is_suspected_role_address: boolean;
            };
            additional: {
              has_known_bounces: boolean;
              has_suspected_bounces: boolean;
            };
          };
        };
      }>(`GET`, `/validations/email?email=${encodeURIComponent(email)}`);

      const result = response.result;
      const valid = result.verdict === "Valid";

      SafeLogger.info("SendGrid email validation", {
        email,
        valid,
        verdict: result.verdict,
        score: result.score,
      });

      return {
        valid,
        reason: valid ? undefined : `Verdict: ${result.verdict}`,
        suggestion: result.suggestion,
      };
    }, "validateEmailAddress");
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<IntegrationResponse<{ healthy: boolean }>> {
    return this.executeWithProtection(async () => {
      // Check API key validity by getting account information
      const response = await this.makeApiRequest<{ email: string; first_name: string; last_name: string }>(
        "GET",
        "/user/account",
      );

      const healthy = !!response.email;

      SafeLogger.info("SendGrid health check", {
        healthy,
        accountEmail: response.email,
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
      Authorization: `Bearer ${this.credentials.apiKey}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // SendGrid returns 202 for successful email sends (no body)
    if (response.status === 202 && method === "POST" && path === "/mail/send") {
      return {} as T; // Empty response for successful send
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  private convertToSendGridMessage(message: EmailMessage): SendGridMessage {
    const sendGridMessage: SendGridMessage = {
      to: message.to.map((email) => ({ email })),
      from: {
        email: this.credentials.fromEmail,
        name: this.credentials.fromName,
      },
      subject: message.subject,
      content: [],
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
      },
    };

    // Add CC recipients
    if (message.cc?.length) {
      sendGridMessage.cc = message.cc.map((email) => ({ email }));
    }

    // Add BCC recipients
    if (message.bcc?.length) {
      sendGridMessage.bcc = message.bcc.map((email) => ({ email }));
    }

    // Add content
    if (message.textContent) {
      sendGridMessage.content.push({
        type: "text/plain",
        value: message.textContent,
      });
    }

    if (message.htmlContent) {
      sendGridMessage.content.push({
        type: "text/html",
        value: message.htmlContent,
      });
    }

    // Add attachments
    if (message.attachments?.length) {
      sendGridMessage.attachments = message.attachments.map((attachment) => ({
        content: attachment.content,
        filename: attachment.filename,
        type: attachment.contentType,
        disposition: "attachment",
      }));
    }

    // Handle template
    if (message.templateId) {
      sendGridMessage.template_id = message.templateId;
      if (message.templateData) {
        sendGridMessage.dynamic_template_data = message.templateData;
      }
    }

    return sendGridMessage;
  }

  private getBaseMessageData(message: SendGridMessage) {
    return {
      from: message.from,
      reply_to: message.from, // Use same as from address
      subject: message.subject,
      content: message.content,
      template_id: message.template_id,
      tracking_settings: message.tracking_settings,
      custom_args: {
        source: "wesley-ambacht-api",
        timestamp: new Date().toISOString(),
        ...message.custom_args,
      },
    };
  }

  private extractMessageId(response: any): string | null {
    // SendGrid doesn't return message ID in response body
    // In a real implementation, you might extract from headers
    // or implement webhook handling to track message IDs
    return null;
  }

  private validateCredentials(): void {
    const required = ["apiKey", "fromEmail", "fromName"];
    const missing = required.filter(
      (key) => !this.credentials[key as keyof SendGridCredentials],
    );

    if (missing.length > 0) {
      throw new Error(`Missing SendGrid credentials: ${missing.join(", ")}`);
    }

    // Validate API key format
    if (!this.credentials.apiKey.startsWith("SG.")) {
      throw new Error("Invalid SendGrid API key format");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.credentials.fromEmail)) {
      throw new Error("Invalid from email address format");
    }
  }
}

/**
 * Create SendGrid email integration instance
 */
export function createSendGridEmailIntegration(
  credentials: SendGridCredentials,
  metrics?: MetricsCollector,
): SendGridEmailIntegration {
  const config: IntegrationConfig = {
    id: "sendgrid-email",
    name: "SendGrid Email",
    type: IntegrationType.EMAIL,
    provider: "sendgrid",
    status: IntegrationStatus.ACTIVE,
    credentials: {
      apiKey: credentials.apiKey,
      fromEmail: credentials.fromEmail,
      fromName: credentials.fromName,
    },
    settings: {
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribeTracking: true,
    },
    timeout: 10000,
    retryAttempts: 3,
    circuitBreakerEnabled: true,
  };

  return new SendGridEmailIntegration(config, metrics, credentials);
}