/**
 * Analytics Manager for Ambacht-Verse-Ontwerp
 * Centralizes all analytics data collection and provides dashboard structure
 */

import { formAnalytics, FormAnalytics } from "./formLogger";
import {
  conversionFunnel,
  ConversionMetrics,
  FUNNEL_DEFINITIONS,
} from "./conversionFunnel";
import { UserFlowLogger, LoggerUtils } from "./logger";

export interface UserSessionAnalytics {
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  interactions: number;
  conversions: number;
  userAgent: string;
  referrer: string;
  language: string;
}

export interface NavigationAnalytics {
  from: string;
  to: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface InteractionAnalytics {
  action: string;
  element: string;
  timestamp: number;
  sessionId: string;
  data?: Record<string, unknown>;
}

export interface AnalyticsDashboard {
  overview: {
    totalSessions: number;
    uniqueUsers: number;
    averageSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    topPages: Array<{ page: string; views: number; avgTime: number }>;
    topInteractions: Array<{ element: string; count: number; type: string }>;
  };
  conversions: {
    funnelMetrics: Record<string, ConversionMetrics>;
    topConversionPaths: Array<{
      path: string[];
      count: number;
      avgTime: number;
    }>;
    dropOffAnalysis: Array<{
      step: string;
      dropOffRate: number;
      recoveryRate: number;
    }>;
    conversionTrends: Array<{
      date: string;
      conversions: number;
      rate: number;
    }>;
  };
  forms: {
    formMetrics: Record<string, FormAnalytics>;
    fieldAnalytics: Array<{
      formName: string;
      fieldName: string;
      completionRate: number;
      errorRate: number;
      avgTime: number;
    }>;
    abandonmentReasons: Record<string, number>;
    submissionTrends: Array<{
      date: string;
      submissions: number;
      errors: number;
    }>;
  };
  userBehavior: {
    sessionPatterns: Array<{
      pattern: string;
      frequency: number;
      conversionRate: number;
    }>;
    deviceAnalytics: Record<
      string,
      { count: number; avgDuration: number; conversionRate: number }
    >;
    timeOnSite: Array<{ timeRange: string; count: number; percentage: number }>;
    heatmapData: Array<{
      element: string;
      clicks: number;
      hovers: number;
      position: { x: number; y: number };
    }>;
  };
  performance: {
    loadTimes: Array<{
      page: string;
      avgLoadTime: number;
      p95LoadTime: number;
    }>;
    errorRates: Array<{
      type: string;
      count: number;
      trend: "up" | "down" | "stable";
    }>;
    userFeedback: Array<{
      type: "positive" | "negative" | "neutral";
      count: number;
      sources: string[];
    }>;
  };
}

// Analytics Manager Class
class AnalyticsManager {
  private sessions: Map<string, UserSessionAnalytics> = new Map();
  private navigationEvents: NavigationAnalytics[] = [];
  private interactionEvents: InteractionAnalytics[] = [];

  // Initialize user session
  public initializeSession(sessionId: string): void {
    const session: UserSessionAnalytics = {
      sessionId,
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      conversions: 0,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      language: navigator.language,
    };

    this.sessions.set(sessionId, session);

    UserFlowLogger.interaction(
      "analytics_session_start",
      "session",
      {
        sessionId,
        userAgent: session.userAgent,
        referrer: session.referrer,
        language: session.language,
      },
      sessionId,
    );
  }

  // Track page view
  public trackPageView(sessionId: string, page: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.pageViews++;
    }

    UserFlowLogger.interaction(
      "page_view",
      page,
      {
        sessionId,
        timestamp: Date.now(),
        pageViewCount: session?.pageViews || 1,
      },
      sessionId,
    );
  }

  // Track navigation
  public trackNavigation(
    from: string,
    to: string,
    sessionId: string,
    userId?: string,
  ): void {
    const navigationEvent: NavigationAnalytics = {
      from,
      to,
      timestamp: Date.now(),
      sessionId,
      userId,
    };

    this.navigationEvents.push(navigationEvent);

    UserFlowLogger.navigation(from, to, sessionId, userId);
  }

  // Track interaction
  public trackInteraction(
    action: string,
    element: string,
    data: Record<string, unknown>,
    sessionId: string,
  ): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.interactions++;
    }

    const interactionEvent: InteractionAnalytics = {
      action,
      element,
      timestamp: Date.now(),
      sessionId,
      data: LoggerUtils.sanitizeData(data),
    };

    this.interactionEvents.push(interactionEvent);

    UserFlowLogger.interaction(action, element, data, sessionId);
  }

  // Track conversion
  public trackConversion(
    sessionId: string,
    conversionType: string,
    value?: number,
  ): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.conversions++;
    }

    UserFlowLogger.interaction(
      "conversion",
      conversionType,
      {
        sessionId,
        value,
        timestamp: Date.now(),
        totalConversions: session?.conversions || 1,
      },
      sessionId,
    );
  }

  // End session
  public endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;

      UserFlowLogger.interaction(
        "analytics_session_end",
        "session",
        {
          sessionId,
          duration: session.duration,
          pageViews: session.pageViews,
          interactions: session.interactions,
          conversions: session.conversions,
        },
        sessionId,
      );
    }
  }

  // Generate analytics dashboard
  public generateDashboard(timeRange?: {
    start: number;
    end: number;
  }): AnalyticsDashboard {
    const now = Date.now();
    const range = timeRange || {
      start: now - 30 * 24 * 60 * 60 * 1000,
      end: now,
    }; // Default: last 30 days

    // Filter data by time range
    const filteredSessions = Array.from(this.sessions.values()).filter(
      (session) =>
        session.startTime >= range.start && session.startTime <= range.end,
    );

    const filteredNavigations = this.navigationEvents.filter(
      (nav) => nav.timestamp >= range.start && nav.timestamp <= range.end,
    );

    const filteredInteractions = this.interactionEvents.filter(
      (interaction) =>
        interaction.timestamp >= range.start &&
        interaction.timestamp <= range.end,
    );

    // Calculate overview metrics
    const totalSessions = filteredSessions.length;
    const uniqueUsers = new Set(filteredSessions.map((s) => s.sessionId)).size;
    const avgSessionDuration =
      filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0) /
      totalSessions;
    const totalConversions = filteredSessions.reduce(
      (sum, s) => sum + s.conversions,
      0,
    );
    const conversionRate =
      totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

    // Calculate bounce rate (sessions with only 1 page view)
    const bounceRate =
      (filteredSessions.filter((s) => s.pageViews <= 1).length /
        totalSessions) *
      100;

    // Get top pages
    const pageViews = new Map<string, { count: number; totalTime: number }>();
    filteredNavigations.forEach((nav) => {
      const current = pageViews.get(nav.to) || { count: 0, totalTime: 0 };
      pageViews.set(nav.to, {
        count: current.count + 1,
        totalTime: current.totalTime,
      });
    });

    const topPages = Array.from(pageViews.entries())
      .map(([page, data]) => ({
        page,
        views: data.count,
        avgTime: data.totalTime / data.count,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Get top interactions
    const interactionCounts = new Map<string, number>();
    filteredInteractions.forEach((interaction) => {
      const key = `${interaction.element}_${interaction.action}`;
      interactionCounts.set(key, (interactionCounts.get(key) || 0) + 1);
    });

    const topInteractions = Array.from(interactionCounts.entries())
      .map(([key, count]) => {
        const [element, type] = key.split("_");
        return { element, count, type };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get conversion funnel metrics
    const funnelMetrics: Record<string, ConversionMetrics> = {};
    Object.keys(FUNNEL_DEFINITIONS).forEach((funnelType) => {
      funnelMetrics[funnelType] = conversionFunnel.getConversionMetrics(
        funnelType as keyof typeof FUNNEL_DEFINITIONS,
        range,
      );
    });

    return {
      overview: {
        totalSessions,
        uniqueUsers,
        averageSessionDuration: avgSessionDuration,
        bounceRate,
        conversionRate,
        topPages,
        topInteractions,
      },
      conversions: {
        funnelMetrics,
        topConversionPaths: this.calculateConversionPaths(filteredSessions),
        dropOffAnalysis: this.calculateDropOffAnalysis(funnelMetrics),
        conversionTrends: this.calculateConversionTrends(
          filteredSessions,
          range,
        ),
      },
      forms: {
        formMetrics: this.getFormMetrics(),
        fieldAnalytics: this.calculateFieldAnalytics(),
        abandonmentReasons: this.calculateAbandonmentReasons(),
        submissionTrends: this.calculateSubmissionTrends(range),
      },
      userBehavior: {
        sessionPatterns: this.calculateSessionPatterns(filteredSessions),
        deviceAnalytics: this.calculateDeviceAnalytics(filteredSessions),
        timeOnSite: this.calculateTimeOnSite(filteredSessions),
        heatmapData: this.calculateHeatmapData(filteredInteractions),
      },
      performance: {
        loadTimes: this.calculateLoadTimes(),
        errorRates: this.calculateErrorRates(range),
        userFeedback: this.calculateUserFeedback(),
      },
    };
  }

  // Private helper methods
  private calculateConversionPaths(sessions: UserSessionAnalytics[]) {
    // Implementation for conversion path analysis
    return [];
  }

  private calculateDropOffAnalysis(
    funnelMetrics: Record<string, ConversionMetrics>,
  ) {
    return Object.entries(funnelMetrics).map(([funnel, metrics]) => {
      const totalDropOffs = Object.values(metrics.dropOffPoints).reduce(
        (sum, count) => sum + count,
        0,
      );
      const avgDropOffRate = (totalDropOffs / metrics.totalSessions) * 100;

      return {
        step: funnel,
        dropOffRate: avgDropOffRate,
        recoveryRate: metrics.conversionRate, // Simplified
      };
    });
  }

  private calculateConversionTrends(
    sessions: UserSessionAnalytics[],
    range: { start: number; end: number },
  ) {
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.ceil((range.end - range.start) / dayMs);
    const trends = [];

    for (let i = 0; i < days; i++) {
      const dayStart = range.start + i * dayMs;
      const dayEnd = dayStart + dayMs;

      const daySessions = sessions.filter(
        (s) => s.startTime >= dayStart && s.startTime < dayEnd,
      );
      const dayConversions = daySessions.reduce(
        (sum, s) => sum + s.conversions,
        0,
      );
      const dayRate =
        daySessions.length > 0
          ? (dayConversions / daySessions.length) * 100
          : 0;

      trends.push({
        date: new Date(dayStart).toISOString().split("T")[0],
        conversions: dayConversions,
        rate: dayRate,
      });
    }

    return trends;
  }

  private getFormMetrics(): Record<string, FormAnalytics> {
    // This would integrate with formAnalytics to get actual form data
    return {};
  }

  private calculateFieldAnalytics() {
    // Implementation for field-level analytics
    return [];
  }

  private calculateAbandonmentReasons(): Record<string, number> {
    // Implementation for abandonment reason analysis
    return {};
  }

  private calculateSubmissionTrends(range: { start: number; end: number }) {
    // Implementation for submission trend analysis
    return [];
  }

  private calculateSessionPatterns(sessions: UserSessionAnalytics[]) {
    // Implementation for session pattern analysis
    return [];
  }

  private calculateDeviceAnalytics(sessions: UserSessionAnalytics[]) {
    const deviceData: Record<
      string,
      { count: number; avgDuration: number; conversionRate: number }
    > = {};

    sessions.forEach((session) => {
      const device = this.getDeviceType(session.userAgent);
      if (!deviceData[device]) {
        deviceData[device] = { count: 0, avgDuration: 0, conversionRate: 0 };
      }

      deviceData[device].count++;
      deviceData[device].avgDuration += session.duration || 0;
    });

    // Calculate averages
    Object.keys(deviceData).forEach((device) => {
      deviceData[device].avgDuration /= deviceData[device].count;
    });

    return deviceData;
  }

  private calculateTimeOnSite(sessions: UserSessionAnalytics[]) {
    const timeRanges = [
      { range: "0-30s", min: 0, max: 30000 },
      { range: "30s-1m", min: 30000, max: 60000 },
      { range: "1-2m", min: 60000, max: 120000 },
      { range: "2-5m", min: 120000, max: 300000 },
      { range: "5m+", min: 300000, max: Infinity },
    ];

    const results = timeRanges.map((range) => ({
      timeRange: range.range,
      count: sessions.filter((s) => {
        const duration = s.duration || 0;
        return duration >= range.min && duration < range.max;
      }).length,
      percentage: 0,
    }));

    // Calculate percentages
    const totalSessions = sessions.length;
    results.forEach((result) => {
      result.percentage =
        totalSessions > 0 ? (result.count / totalSessions) * 100 : 0;
    });

    return results;
  }

  private calculateHeatmapData(interactions: InteractionAnalytics[]) {
    const heatmapData = new Map<
      string,
      { clicks: number; hovers: number; position: { x: number; y: number } }
    >();

    interactions.forEach((interaction) => {
      const current = heatmapData.get(interaction.element) || {
        clicks: 0,
        hovers: 0,
        position: { x: 0, y: 0 },
      };

      if (interaction.action === "click") current.clicks++;
      if (interaction.action === "hover") current.hovers++;

      heatmapData.set(interaction.element, current);
    });

    return Array.from(heatmapData.entries()).map(([element, data]) => ({
      element,
      ...data,
    }));
  }

  private calculateLoadTimes() {
    // Implementation for load time analysis
    return [];
  }

  private calculateErrorRates(range: { start: number; end: number }) {
    // Implementation for error rate analysis
    return [];
  }

  private calculateUserFeedback() {
    // Implementation for user feedback analysis
    return [];
  }

  private getDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return "mobile";
    if (/Tablet/.test(userAgent)) return "tablet";
    return "desktop";
  }

  // Cleanup old data
  public cleanup(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - maxAge;

    // Clean up sessions
    for (const [sessionId, session] of this.sessions) {
      if (session.startTime < cutoffTime) {
        this.sessions.delete(sessionId);
      }
    }

    // Clean up navigation events
    this.navigationEvents = this.navigationEvents.filter(
      (nav) => nav.timestamp > cutoffTime,
    );

    // Clean up interaction events
    this.interactionEvents = this.interactionEvents.filter(
      (interaction) => interaction.timestamp > cutoffTime,
    );

    // Clean up conversion funnel data
    conversionFunnel.cleanupOldSessions(maxAge);
  }
}

// Export singleton instance
export const analyticsManager = new AnalyticsManager();

// React hook for analytics
export const useAnalytics = () => {
  const initializeSession = () => {
    const sessionId = LoggerUtils.generateSessionId();
    analyticsManager.initializeSession(sessionId);
    return sessionId;
  };

  const trackPageView = (sessionId: string, page: string) => {
    analyticsManager.trackPageView(sessionId, page);
  };

  const trackNavigation = (
    from: string,
    to: string,
    sessionId: string,
    userId?: string,
  ) => {
    analyticsManager.trackNavigation(from, to, sessionId, userId);
  };

  const trackInteraction = (
    action: string,
    element: string,
    data: Record<string, unknown>,
    sessionId: string,
  ) => {
    analyticsManager.trackInteraction(action, element, data, sessionId);
  };

  const trackConversion = (
    sessionId: string,
    conversionType: string,
    value?: number,
  ) => {
    analyticsManager.trackConversion(sessionId, conversionType, value);
  };

  const endSession = (sessionId: string) => {
    analyticsManager.endSession(sessionId);
  };

  const getDashboard = (timeRange?: { start: number; end: number }) => {
    return analyticsManager.generateDashboard(timeRange);
  };

  return {
    initializeSession,
    trackPageView,
    trackNavigation,
    trackInteraction,
    trackConversion,
    endSession,
    getDashboard,
  };
};
