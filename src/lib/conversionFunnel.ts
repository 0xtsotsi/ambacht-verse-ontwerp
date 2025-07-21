/**
 * Conversion Funnel Tracking System for Ambacht-Verse-Ontwerp
 * Tracks user progression through booking and quote generation flows
 */

import { UserFlowLogger, LoggerUtils } from '@/lib/logger';

export interface FunnelStep {
  stepName: string;
  stepOrder: number;
  required: boolean;
  category: 'booking' | 'quote' | 'navigation' | 'engagement';
}

export interface FunnelSession {
  sessionId: string;
  funnelType: 'booking_flow' | 'quote_calculator' | 'date_checker' | 'contact_form';
  startTime: number;
  currentStep: number;
  completedSteps: string[];
  abandonedAtStep?: string;
  completionTime?: number;
  conversionData?: any;
}

export interface ConversionMetrics {
  totalSessions: number;
  completedSessions: number;
  conversionRate: number;
  averageCompletionTime: number;
  dropOffPoints: Record<string, number>;
  stepCompletionRates: Record<string, number>;
}

// Predefined funnel steps for different flows
export const FUNNEL_DEFINITIONS = {
  booking_flow: [
    { stepName: 'widget_interaction', stepOrder: 1, required: true, category: 'engagement' as const },
    { stepName: 'date_checker_open', stepOrder: 2, required: true, category: 'booking' as const },
    { stepName: 'date_selection', stepOrder: 3, required: true, category: 'booking' as const },
    { stepName: 'guest_count_selection', stepOrder: 4, required: true, category: 'booking' as const },
    { stepName: 'time_selection', stepOrder: 5, required: true, category: 'booking' as const },
    { stepName: 'booking_form_open', stepOrder: 6, required: true, category: 'booking' as const },
    { stepName: 'form_field_completion', stepOrder: 7, required: true, category: 'booking' as const },
    { stepName: 'form_submission', stepOrder: 8, required: true, category: 'booking' as const },
    { stepName: 'booking_confirmation', stepOrder: 9, required: true, category: 'booking' as const }
  ],
  quote_calculator: [
    { stepName: 'calculator_open', stepOrder: 1, required: true, category: 'quote' as const },
    { stepName: 'service_category_selection', stepOrder: 2, required: true, category: 'quote' as const },
    { stepName: 'service_tier_selection', stepOrder: 3, required: true, category: 'quote' as const },
    { stepName: 'guest_count_input', stepOrder: 4, required: true, category: 'quote' as const },
    { stepName: 'addon_selection', stepOrder: 5, required: false, category: 'quote' as const },
    { stepName: 'quote_calculation', stepOrder: 6, required: true, category: 'quote' as const },
    { stepName: 'quote_display', stepOrder: 7, required: true, category: 'quote' as const },
    { stepName: 'detailed_quote_request', stepOrder: 8, required: false, category: 'quote' as const }
  ],
  date_checker: [
    { stepName: 'date_checker_open', stepOrder: 1, required: true, category: 'booking' as const },
    { stepName: 'calendar_interaction', stepOrder: 2, required: true, category: 'booking' as const },
    { stepName: 'date_selection', stepOrder: 3, required: true, category: 'booking' as const },
    { stepName: 'time_slot_selection', stepOrder: 4, required: true, category: 'booking' as const },
    { stepName: 'availability_confirmation', stepOrder: 5, required: true, category: 'booking' as const }
  ],
  contact_form: [
    { stepName: 'form_view', stepOrder: 1, required: true, category: 'engagement' as const },
    { stepName: 'first_field_interaction', stepOrder: 2, required: true, category: 'engagement' as const },
    { stepName: 'form_completion', stepOrder: 3, required: true, category: 'engagement' as const },
    { stepName: 'form_submission', stepOrder: 4, required: true, category: 'engagement' as const }
  ]
};

// Conversion Funnel Manager Class
class ConversionFunnelManager {
  private activeFunnels: Map<string, FunnelSession> = new Map();
  private completedFunnels: FunnelSession[] = [];

  // Start a new funnel session
  public startFunnel(
    funnelType: keyof typeof FUNNEL_DEFINITIONS,
    sessionId?: string
  ): string {
    const id = sessionId || LoggerUtils.generateSessionId();
    const session: FunnelSession = {
      sessionId: id,
      funnelType,
      startTime: Date.now(),
      currentStep: 0,
      completedSteps: []
    };

    this.activeFunnels.set(id, session);

    UserFlowLogger.interaction('funnel_start', funnelType, {
      sessionId: id,
      funnelType,
      startTime: session.startTime
    }, id);

    UserFlowLogger.breadcrumb('funnel_started', {
      funnelType,
      totalSteps: FUNNEL_DEFINITIONS[funnelType].length
    }, id);

    return id;
  }

  // Log progress to next funnel step
  public logFunnelStep(
    sessionId: string,
    stepName: string,
    stepData?: any
  ): boolean {
    const session = this.activeFunnels.get(sessionId);
    if (!session) return false;

    const funnelSteps = FUNNEL_DEFINITIONS[session.funnelType];
    const stepDefinition = funnelSteps.find(s => s.stepName === stepName);
    
    if (!stepDefinition) {
      UserFlowLogger.error('funnel_step_error', `Unknown step: ${stepName}`, {
        sessionId,
        funnelType: session.funnelType,
        stepName
      }, sessionId);
      return false;
    }

    // Update session
    session.currentStep = Math.max(session.currentStep, stepDefinition.stepOrder);
    if (!session.completedSteps.includes(stepName)) {
      session.completedSteps.push(stepName);
    }

    UserFlowLogger.interaction('funnel_step_complete', stepName, {
      sessionId,
      funnelType: session.funnelType,
      stepOrder: stepDefinition.stepOrder,
      stepData: LoggerUtils.sanitizeData(stepData),
      totalCompletedSteps: session.completedSteps.length,
      progressPercentage: (session.completedSteps.length / funnelSteps.length) * 100
    }, sessionId);

    UserFlowLogger.breadcrumb('funnel_progress', {
      step: stepName,
      stepOrder: stepDefinition.stepOrder,
      progress: (session.completedSteps.length / funnelSteps.length) * 100,
      data: stepData
    }, sessionId);

    // Check if funnel is complete
    const requiredSteps = funnelSteps.filter(s => s.required);
    const completedRequiredSteps = requiredSteps.filter(s => 
      session.completedSteps.includes(s.stepName)
    );

    if (completedRequiredSteps.length === requiredSteps.length) {
      this.completeFunnel(sessionId, stepData);
    }

    return true;
  }

  // Log funnel abandonment
  public abandonFunnel(
    sessionId: string,
    reason: 'navigation' | 'timeout' | 'error' | 'user_choice' | 'unknown' = 'unknown',
    abandonmentData?: any
  ): void {
    const session = this.activeFunnels.get(sessionId);
    if (!session) return;

    const funnelSteps = FUNNEL_DEFINITIONS[session.funnelType];
    const lastCompletedStep = session.completedSteps[session.completedSteps.length - 1];
    const abandonmentStep = lastCompletedStep || 'initial';

    session.abandonedAtStep = abandonmentStep;

    UserFlowLogger.interaction('funnel_abandoned', session.funnelType, {
      sessionId,
      reason,
      abandonedAtStep: abandonmentStep,
      stepsCompleted: session.completedSteps.length,
      totalSteps: funnelSteps.length,
      completionPercentage: (session.completedSteps.length / funnelSteps.length) * 100,
      timeSpent: Date.now() - session.startTime,
      abandonmentData: LoggerUtils.sanitizeData(abandonmentData)
    }, sessionId);

    UserFlowLogger.breadcrumb('funnel_abandoned', {
      funnelType: session.funnelType,
      reason,
      stepsCompleted: session.completedSteps.length,
      abandonmentStep
    }, sessionId);

    // Move to completed funnels for analytics
    this.completedFunnels.push(session);
    this.activeFunnels.delete(sessionId);
  }

  // Complete a funnel successfully
  public completeFunnel(sessionId: string, conversionData?: any): void {
    const session = this.activeFunnels.get(sessionId);
    if (!session) return;

    session.completionTime = Date.now() - session.startTime;
    session.conversionData = LoggerUtils.sanitizeData(conversionData);

    UserFlowLogger.interaction('funnel_completed', session.funnelType, {
      sessionId,
      completionTime: session.completionTime,
      stepsCompleted: session.completedSteps.length,
      conversionData: session.conversionData
    }, sessionId);

    UserFlowLogger.breadcrumb('funnel_converted', {
      funnelType: session.funnelType,
      completionTime: session.completionTime,
      stepsCount: session.completedSteps.length
    }, sessionId);

    // Move to completed funnels
    this.completedFunnels.push(session);
    this.activeFunnels.delete(sessionId);
  }

  // Get funnel status
  public getFunnelStatus(sessionId: string): FunnelSession | null {
    return this.activeFunnels.get(sessionId) || null;
  }

  // Generate conversion metrics
  public getConversionMetrics(
    funnelType?: keyof typeof FUNNEL_DEFINITIONS,
    timeRange?: { start: number; end: number }
  ): ConversionMetrics {
    let relevantSessions = this.completedFunnels;

    // Filter by funnel type
    if (funnelType) {
      relevantSessions = relevantSessions.filter(s => s.funnelType === funnelType);
    }

    // Filter by time range
    if (timeRange) {
      relevantSessions = relevantSessions.filter(s => 
        s.startTime >= timeRange.start && s.startTime <= timeRange.end
      );
    }

    const totalSessions = relevantSessions.length;
    const completedSessions = relevantSessions.filter(s => 
      s.completionTime !== undefined
    ).length;

    const conversionRate = totalSessions > 0 ? 
      (completedSessions / totalSessions) * 100 : 0;

    const averageCompletionTime = completedSessions > 0 ?
      relevantSessions
        .filter(s => s.completionTime)
        .reduce((sum, s) => sum + (s.completionTime || 0), 0) / completedSessions : 0;

    // Calculate drop-off points
    const dropOffPoints: Record<string, number> = {};
    const stepCompletionRates: Record<string, number> = {};

    relevantSessions.forEach(session => {
      if (session.abandonedAtStep) {
        dropOffPoints[session.abandonedAtStep] = 
          (dropOffPoints[session.abandonedAtStep] || 0) + 1;
      }

      session.completedSteps.forEach(step => {
        stepCompletionRates[step] = (stepCompletionRates[step] || 0) + 1;
      });
    });

    // Convert counts to rates
    Object.keys(stepCompletionRates).forEach(step => {
      stepCompletionRates[step] = 
        (stepCompletionRates[step] / totalSessions) * 100;
    });

    return {
      totalSessions,
      completedSessions,
      conversionRate,
      averageCompletionTime,
      dropOffPoints,
      stepCompletionRates
    };
  }

  // Get analytics dashboard data
  public getDashboardData() {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return {
      today: this.getConversionMetrics(undefined, { 
        start: now - dayMs, 
        end: now 
      }),
      week: this.getConversionMetrics(undefined, { 
        start: now - (7 * dayMs), 
        end: now 
      }),
      month: this.getConversionMetrics(undefined, { 
        start: now - (30 * dayMs), 
        end: now 
      }),
      byFunnelType: {
        booking_flow: this.getConversionMetrics('booking_flow'),
        quote_calculator: this.getConversionMetrics('quote_calculator'),
        date_checker: this.getConversionMetrics('date_checker'),
        contact_form: this.getConversionMetrics('contact_form')
      },
      activeFunnels: this.activeFunnels.size,
      totalCompletedFunnels: this.completedFunnels.length
    };
  }

  // Cleanup old completed sessions
  public cleanupOldSessions(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - maxAge;
    this.completedFunnels = this.completedFunnels.filter(
      session => session.startTime > cutoffTime
    );
  }
}

// Export singleton instance
export const conversionFunnel = new ConversionFunnelManager();

// React hook for funnel tracking
export const useConversionFunnel = (funnelType: keyof typeof FUNNEL_DEFINITIONS) => {
  let sessionId: string;

  const startFunnel = () => {
    sessionId = conversionFunnel.startFunnel(funnelType);
    return sessionId;
  };

  const logStep = (stepName: string, stepData?: any) => {
    if (sessionId) {
      return conversionFunnel.logFunnelStep(sessionId, stepName, stepData);
    }
    return false;
  };

  const abandon = (reason?: 'navigation' | 'timeout' | 'error' | 'user_choice' | 'unknown', data?: any) => {
    if (sessionId) {
      conversionFunnel.abandonFunnel(sessionId, reason, data);
    }
  };

  const complete = (conversionData?: any) => {
    if (sessionId) {
      conversionFunnel.completeFunnel(sessionId, conversionData);
    }
  };

  const getStatus = () => {
    if (sessionId) {
      return conversionFunnel.getFunnelStatus(sessionId);
    }
    return null;
  };

  return {
    startFunnel,
    logStep,
    abandon,
    complete,
    getStatus,
    sessionId
  };
};