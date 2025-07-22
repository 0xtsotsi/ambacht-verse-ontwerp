/**
 * User Flow Tracking Hooks for Ambacht-Verse-Ontwerp
 * Provides comprehensive user journey tracking with breadcrumb system
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { UserFlowLogger, LoggerUtils } from "@/lib/logger";

// Session management
let globalSessionId: string | null = null;

const getSessionId = (): string => {
  if (!globalSessionId) {
    globalSessionId = LoggerUtils.generateSessionId();
  }
  return globalSessionId;
};

// Navigation tracking hook
export const useNavigationLogger = () => {
  const previousPath = useRef<string>("");

  const logNavigation = useCallback((currentPath: string) => {
    const sessionId = getSessionId();
    const from = previousPath.current || "initial_load";

    UserFlowLogger.navigation(from, currentPath, sessionId);
    UserFlowLogger.breadcrumb(
      "navigation",
      {
        from,
        to: currentPath,
        timestamp: new Date().toISOString(),
      },
      sessionId,
    );

    previousPath.current = currentPath;
  }, []);

  // Track section scrolling within page
  const logSectionView = useCallback(
    (sectionId: string, scrollDepth: number) => {
      const sessionId = getSessionId();

      UserFlowLogger.interaction(
        "section_view",
        sectionId,
        {
          scrollDepth,
          viewportHeight: window.innerHeight,
          documentHeight: document.documentElement.scrollHeight,
        },
        sessionId,
      );

      UserFlowLogger.breadcrumb(
        "section_view",
        {
          section: sectionId,
          scrollDepth,
          timeSpent: Date.now(),
        },
        sessionId,
      );
    },
    [],
  );

  return { logNavigation, logSectionView };
};

// Interaction tracking hook
export const useInteractionLogger = () => {
  const logClick = useCallback(
    (element: string, additionalData?: Record<string, unknown>) => {
      const sessionId = getSessionId();

      UserFlowLogger.interaction(
        "click",
        element,
        {
          ...additionalData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
        sessionId,
      );

      UserFlowLogger.breadcrumb(
        "user_click",
        {
          element,
          data: additionalData,
        },
        sessionId,
      );
    },
    [],
  );

  const logFormInteraction = useCallback(
    (
      action: "focus" | "blur" | "change" | "submit",
      formName: string,
      fieldName?: string,
      value?: unknown,
    ) => {
      const sessionId = getSessionId();

      UserFlowLogger.interaction(
        `form_${action}`,
        `${formName}_${fieldName || "form"}`,
        {
          formName,
          fieldName,
          value: LoggerUtils.sanitizeData(value),
          action,
        },
        sessionId,
      );

      UserFlowLogger.breadcrumb(
        "form_interaction",
        {
          action,
          form: formName,
          field: fieldName,
          valueLength: typeof value === "string" ? value.length : 0,
        },
        sessionId,
      );
    },
    [],
  );

  const logButtonPress = useCallback((buttonName: string, context?: string) => {
    const sessionId = getSessionId();

    UserFlowLogger.interaction(
      "button_press",
      buttonName,
      {
        context,
        timestamp: new Date().toISOString(),
      },
      sessionId,
    );

    UserFlowLogger.breadcrumb(
      "button_press",
      {
        button: buttonName,
        context,
      },
      sessionId,
    );
  }, []);

  return { logClick, logFormInteraction, logButtonPress };
};

// Session tracking hook
export const useSessionLogger = () => {
  const [sessionData, setSessionData] = useState({
    sessionId: getSessionId(),
    startTime: Date.now(),
    pageViews: 0,
    interactions: 0,
  });

  const incrementPageViews = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      pageViews: prev.pageViews + 1,
    }));
  }, []);

  const incrementInteractions = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      interactions: prev.interactions + 1,
    }));
  }, []);

  const getSessionDuration = useCallback(() => {
    return Date.now() - sessionData.startTime;
  }, [sessionData.startTime]);

  const logSessionEnd = useCallback(() => {
    const sessionId = getSessionId();
    const duration = getSessionDuration();

    UserFlowLogger.interaction(
      "session_end",
      "session",
      {
        duration,
        pageViews: sessionData.pageViews,
        interactions: sessionData.interactions,
        endTime: new Date().toISOString(),
      },
      sessionId,
    );

    UserFlowLogger.breadcrumb(
      "session_summary",
      {
        duration,
        pageViews: sessionData.pageViews,
        interactions: sessionData.interactions,
      },
      sessionId,
    );
  }, [sessionData, getSessionDuration]);

  // Log session start
  useEffect(() => {
    const sessionId = getSessionId();

    UserFlowLogger.interaction(
      "session_start",
      "session",
      {
        startTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        language: navigator.language,
      },
      sessionId,
    );

    UserFlowLogger.breadcrumb(
      "session_start",
      {
        userAgent: navigator.userAgent,
        language: navigator.language,
      },
      sessionId,
    );

    // Handle page unload
    const handleUnload = () => logSessionEnd();
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      logSessionEnd();
    };
  }, [logSessionEnd]);

  return {
    sessionData,
    incrementPageViews,
    incrementInteractions,
    getSessionDuration,
    logSessionEnd,
  };
};

// Breadcrumb logger with user journey context
export const useBreadcrumbLogger = () => {
  const journeySteps = useRef<
    Array<{
      action: string;
      timestamp: number;
      data?: Record<string, unknown>;
    }>
  >([]);

  const addBreadcrumb = useCallback(
    (action: string, data?: Record<string, unknown>) => {
      const sessionId = getSessionId();
      const step = {
        action,
        timestamp: Date.now(),
        data: LoggerUtils.sanitizeData(data),
      };

      journeySteps.current.push(step);

      UserFlowLogger.breadcrumb(
        action,
        {
          ...data,
          journeyStep: journeySteps.current.length,
          previousSteps: journeySteps.current.slice(-5), // Last 5 steps for context
        },
        sessionId,
      );
    },
    [],
  );

  const getJourneyPath = useCallback(() => {
    return journeySteps.current.map((step) => step.action);
  }, []);

  const getJourneyDuration = useCallback(() => {
    if (journeySteps.current.length === 0) return 0;
    const start = journeySteps.current[0].timestamp;
    const end = journeySteps.current[journeySteps.current.length - 1].timestamp;
    return end - start;
  }, []);

  const logJourneySummary = useCallback(
    (outcome: "completed" | "abandoned" | "error") => {
      const sessionId = getSessionId();

      UserFlowLogger.interaction(
        "journey_summary",
        "user_journey",
        {
          outcome,
          steps: journeySteps.current.length,
          duration: getJourneyDuration(),
          path: getJourneyPath(),
          completionRate:
            outcome === "completed"
              ? 100
              : journeySteps.current.length > 0
                ? (journeySteps.current.filter((s) =>
                    s.action.includes("completed"),
                  ).length /
                    journeySteps.current.length) *
                  100
                : 0,
        },
        sessionId,
      );
    },
    [getJourneyDuration, getJourneyPath],
  );

  const clearJourney = useCallback(() => {
    journeySteps.current = [];
  }, []);

  return {
    addBreadcrumb,
    getJourneyPath,
    getJourneyDuration,
    logJourneySummary,
    clearJourney,
    journeySteps: journeySteps.current,
  };
};

// Error tracking with user context
export const useErrorLogger = () => {
  const logUserError = useCallback(
    (
      errorType: string,
      errorMessage: string,
      errorContext?: Record<string, unknown>,
      userAction?: string,
    ) => {
      const sessionId = getSessionId();

      UserFlowLogger.error(
        errorType,
        errorMessage,
        {
          ...errorContext,
          userAction,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
        sessionId,
      );

      UserFlowLogger.breadcrumb(
        "error_encountered",
        {
          type: errorType,
          message: errorMessage,
          userAction,
          recoverable: errorContext?.recoverable ?? false,
        },
        sessionId,
      );
    },
    [],
  );

  const logRecoveryAction = useCallback(
    (originalError: string, recoveryAction: string, successful: boolean) => {
      const sessionId = getSessionId();

      UserFlowLogger.interaction(
        "error_recovery",
        recoveryAction,
        {
          originalError,
          successful,
          timestamp: new Date().toISOString(),
        },
        sessionId,
      );

      UserFlowLogger.breadcrumb(
        "error_recovery",
        {
          originalError,
          recoveryAction,
          successful,
        },
        sessionId,
      );
    },
    [],
  );

  return { logUserError, logRecoveryAction };
};
