/**
 * Google Calendar Integration
 *
 * Provides integration with Google Calendar API for event management.
 * Handles authentication, event CRUD operations, and availability checking.
 */

import { SafeLogger } from "@/lib/LoggerUtils";
import {
  CalendarIntegration,
  CalendarEvent,
  IntegrationConfig,
  IntegrationResponse,
  IntegrationStatus,
  IntegrationType,
} from "../ExternalIntegrations";
import { MetricsCollector } from "../MetricsCollector";

interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  }>;
  reminders?: {
    useDefault?: boolean;
    overrides?: Array<{
      method: "email" | "popup";
      minutes: number;
    }>;
  };
  extendedProperties?: {
    private?: Record<string, string>;
    shared?: Record<string, string>;
  };
}

interface GoogleCalendarCredentials {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  calendarId: string;
}

/**
 * Google Calendar integration implementation
 */
export class GoogleCalendarIntegration extends CalendarIntegration {
  private credentials: GoogleCalendarCredentials;
  private readonly baseUrl = "https://www.googleapis.com/calendar/v3";
  private readonly timeZone = "Europe/Amsterdam";

  constructor(
    config: IntegrationConfig,
    metrics?: MetricsCollector,
    credentials?: GoogleCalendarCredentials,
  ) {
    super(config, metrics);

    if (!credentials) {
      throw new Error("Google Calendar credentials are required");
    }

    this.credentials = credentials;
    this.validateCredentials();
  }

  /**
   * Create calendar event
   */
  async createEvent(
    event: CalendarEvent,
  ): Promise<IntegrationResponse<{ eventId: string }>> {
    return this.executeWithProtection(async () => {
      const googleEvent = this.convertToGoogleEvent(event);

      const response = await this.makeApiRequest(
        "POST",
        `/calendars/${encodeURIComponent(this.credentials.calendarId)}/events`,
        googleEvent,
      );

      const createdEvent = await response.json();

      SafeLogger.info("Google Calendar event created", {
        eventId: createdEvent.id,
        title: event.title,
        startTime: event.startTime.toISOString(),
      });

      return { eventId: createdEvent.id };
    }, "createEvent");
  }

  /**
   * Update calendar event
   */
  async updateEvent(
    eventId: string,
    event: Partial<CalendarEvent>,
  ): Promise<IntegrationResponse<void>> {
    return this.executeWithProtection(async () => {
      // First get existing event to merge changes
      const existingResponse = await this.makeApiRequest(
        "GET",
        `/calendars/${encodeURIComponent(this.credentials.calendarId)}/events/${eventId}`,
      );
      const existingEvent = await existingResponse.json();

      // Convert partial event to Google format
      const updates: Partial<GoogleCalendarEvent> = {};

      if (event.title) updates.summary = event.title;
      if (event.description) updates.description = event.description;
      if (event.location) updates.location = event.location;

      if (event.startTime) {
        updates.start = {
          dateTime: event.startTime.toISOString(),
          timeZone: this.timeZone,
        };
      }

      if (event.endTime) {
        updates.end = {
          dateTime: event.endTime.toISOString(),
          timeZone: this.timeZone,
        };
      }

      if (event.attendees) {
        updates.attendees = event.attendees.map((email) => ({ email }));
      }

      if (event.reminders) {
        updates.reminders = {
          overrides: event.reminders.map((reminder) => ({
            method: reminder.method,
            minutes: reminder.minutes,
          })),
        };
      }

      // Merge with existing event
      const updatedEvent = { ...existingEvent, ...updates };

      await this.makeApiRequest(
        "PUT",
        `/calendars/${encodeURIComponent(this.credentials.calendarId)}/events/${eventId}`,
        updatedEvent,
      );

      SafeLogger.info("Google Calendar event updated", {
        eventId,
        updates: Object.keys(updates),
      });
    }, "updateEvent");
  }

  /**
   * Delete calendar event
   */
  async deleteEvent(eventId: string): Promise<IntegrationResponse<void>> {
    return this.executeWithProtection(async () => {
      await this.makeApiRequest(
        "DELETE",
        `/calendars/${encodeURIComponent(this.credentials.calendarId)}/events/${eventId}`,
      );

      SafeLogger.info("Google Calendar event deleted", { eventId });
    }, "deleteEvent");
  }

  /**
   * Get calendar event
   */
  async getEvent(
    eventId: string,
  ): Promise<IntegrationResponse<CalendarEvent>> {
    return this.executeWithProtection(async () => {
      const response = await this.makeApiRequest(
        "GET",
        `/calendars/${encodeURIComponent(this.credentials.calendarId)}/events/${eventId}`,
      );

      const googleEvent = await response.json();
      const event = this.convertFromGoogleEvent(googleEvent);

      SafeLogger.info("Google Calendar event retrieved", { eventId });

      return event;
    }, "getEvent");
  }

  /**
   * List calendar events
   */
  async listEvents(
    startDate: Date,
    endDate: Date,
  ): Promise<IntegrationResponse<CalendarEvent[]>> {
    return this.executeWithProtection(async () => {
      const params = new URLSearchParams({
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "1000",
      });

      const response = await this.makeApiRequest(
        "GET",
        `/calendars/${encodeURIComponent(this.credentials.calendarId)}/events?${params}`,
      );

      const data = await response.json();
      const events = data.items.map((googleEvent: GoogleCalendarEvent) =>
        this.convertFromGoogleEvent(googleEvent),
      );

      SafeLogger.info("Google Calendar events listed", {
        count: events.length,
        period: `${startDate.toISOString()} - ${endDate.toISOString()}`,
      });

      return events;
    }, "listEvents");
  }

  /**
   * Check calendar availability
   */
  async checkAvailability(
    startDate: Date,
    endDate: Date,
    durationMinutes: number,
  ): Promise<IntegrationResponse<Array<{ start: Date; end: Date }>>> {
    return this.executeWithProtection(async () => {
      // Get all events in the time range
      const eventsResponse = await this.listEvents(startDate, endDate);
      if (!eventsResponse.success) {
        throw new Error("Failed to fetch events for availability check");
      }

      const events = eventsResponse.data || [];
      const availableSlots: Array<{ start: Date; end: Date }> = [];

      // Simple availability algorithm - find gaps between events
      const sortedEvents = events.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      );

      let currentTime = startDate;
      const slotDurationMs = durationMinutes * 60 * 1000;

      for (const event of sortedEvents) {
        // Check if there's a gap before this event
        const gapDuration = event.startTime.getTime() - currentTime.getTime();
        if (gapDuration >= slotDurationMs) {
          availableSlots.push({
            start: new Date(currentTime),
            end: new Date(event.startTime.getTime() - 1),
          });
        }
        currentTime = new Date(Math.max(currentTime.getTime(), event.endTime.getTime()));
      }

      // Check for availability after the last event
      if (currentTime < endDate) {
        const remainingTime = endDate.getTime() - currentTime.getTime();
        if (remainingTime >= slotDurationMs) {
          availableSlots.push({
            start: new Date(currentTime),
            end: endDate,
          });
        }
      }

      SafeLogger.info("Google Calendar availability checked", {
        period: `${startDate.toISOString()} - ${endDate.toISOString()}`,
        durationMinutes,
        availableSlots: availableSlots.length,
      });

      return availableSlots;
    }, "checkAvailability");
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<IntegrationResponse<{ healthy: boolean }>> {
    return this.executeWithProtection(async () => {
      // Simple health check - verify we can access the calendar
      const response = await this.makeApiRequest(
        "GET",
        `/calendars/${encodeURIComponent(this.credentials.calendarId)}`,
      );

      const calendar = await response.json();
      const healthy = !!calendar.id;

      SafeLogger.info("Google Calendar health check", {
        healthy,
        calendarId: this.credentials.calendarId,
      });

      return { healthy };
    }, "healthCheck");
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<void> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        refresh_token: this.credentials.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh Google Calendar access token");
    }

    const data = await response.json();
    this.credentials.accessToken = data.access_token;

    SafeLogger.info("Google Calendar access token refreshed");
  }

  // Private methods

  private async makeApiRequest(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.credentials.accessToken}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    let response = await fetch(url, options);

    // Handle token expiration
    if (response.status === 401) {
      await this.refreshAccessToken();
      headers.Authorization = `Bearer ${this.credentials.accessToken}`;
      options.headers = headers;
      response = await fetch(url, options);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Calendar API error: ${response.status} ${error}`);
    }

    return response;
  }

  private convertToGoogleEvent(event: CalendarEvent): GoogleCalendarEvent {
    const googleEvent: GoogleCalendarEvent = {
      summary: event.title,
      start: {
        dateTime: event.startTime.toISOString(),
        timeZone: this.timeZone,
      },
      end: {
        dateTime: event.endTime.toISOString(),
        timeZone: this.timeZone,
      },
    };

    if (event.description) {
      googleEvent.description = event.description;
    }

    if (event.location) {
      googleEvent.location = event.location;
    }

    if (event.attendees?.length) {
      googleEvent.attendees = event.attendees.map((email) => ({ email }));
    }

    if (event.reminders?.length) {
      googleEvent.reminders = {
        overrides: event.reminders.map((reminder) => ({
          method: reminder.method,
          minutes: reminder.minutes,
        })),
      };
    }

    // Store custom fields in extended properties
    if (event.customFields) {
      googleEvent.extendedProperties = {
        private: event.customFields as Record<string, string>,
      };
    }

    return googleEvent;
  }

  private convertFromGoogleEvent(googleEvent: GoogleCalendarEvent): CalendarEvent {
    const event: CalendarEvent = {
      id: googleEvent.id,
      title: googleEvent.summary,
      startTime: new Date(googleEvent.start.dateTime),
      endTime: new Date(googleEvent.end.dateTime),
    };

    if (googleEvent.description) {
      event.description = googleEvent.description;
    }

    if (googleEvent.location) {
      event.location = googleEvent.location;
    }

    if (googleEvent.attendees?.length) {
      event.attendees = googleEvent.attendees.map((attendee) => attendee.email);
    }

    if (googleEvent.reminders?.overrides?.length) {
      event.reminders = googleEvent.reminders.overrides.map((override) => ({
        method: override.method,
        minutes: override.minutes,
      }));
    }

    if (googleEvent.extendedProperties?.private) {
      event.customFields = googleEvent.extendedProperties.private;
    }

    return event;
  }

  private validateCredentials(): void {
    const required = ["clientId", "clientSecret", "accessToken", "refreshToken", "calendarId"];
    const missing = required.filter((key) => !this.credentials[key as keyof GoogleCalendarCredentials]);

    if (missing.length > 0) {
      throw new Error(`Missing Google Calendar credentials: ${missing.join(", ")}`);
    }
  }
}

/**
 * Create Google Calendar integration instance
 */
export function createGoogleCalendarIntegration(
  credentials: GoogleCalendarCredentials,
  metrics?: MetricsCollector,
): GoogleCalendarIntegration {
  const config: IntegrationConfig = {
    id: "google-calendar",
    name: "Google Calendar",
    type: IntegrationType.CALENDAR,
    provider: "google",
    status: IntegrationStatus.ACTIVE,
    credentials: {
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      calendarId: credentials.calendarId,
    },
    settings: {
      timeZone: "Europe/Amsterdam",
      syncInterval: 300000, // 5 minutes
    },
    timeout: 10000,
    retryAttempts: 3,
    circuitBreakerEnabled: true,
  };

  return new GoogleCalendarIntegration(config, metrics, credentials);
}