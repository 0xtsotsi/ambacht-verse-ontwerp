
import { useCallback } from "react";
import { UserFlowLogger } from "@/lib/logger";

/**
 * Hook for logging user interactions within components
 */
export function useInteractionLogger() {
  // Log form interaction events
  const logFormInteraction = useCallback(
    (action: string, componentName: string, fieldName: string, value?: string) => {
      UserFlowLogger.interaction(`form_${action}`, componentName, {
        field: fieldName,
        value: value || "",
        timestamp: Date.now(),
      });
    },
    []
  );

  // Log button clicks
  const logButtonPress = useCallback(
    (action: string, componentName: string, data?: Record<string, any>) => {
      UserFlowLogger.interaction(`button_${action}`, componentName, {
        ...data,
        timestamp: Date.now(),
      });
    },
    []
  );

  // Log navigation actions
  const logNavigation = useCallback(
    (from: string, to: string, userId?: string) => {
      const sessionId = localStorage.getItem("session_id") || "unknown_session";
      UserFlowLogger.navigation(from, to, sessionId, userId);
    },
    []
  );

  return {
    logFormInteraction,
    logButtonPress,
    logNavigation,
  };
}

/**
 * Hook for creating breadcrumb trails of user actions
 */
export function useBreadcrumbLogger() {
  const breadcrumbs: { action: string; timestamp: number; data?: Record<string, any> }[] = [];

  // Add a breadcrumb to the trail
  const addBreadcrumb = useCallback(
    (action: string, data?: Record<string, any>) => {
      const sessionId = localStorage.getItem("session_id") || "unknown_session";
      const breadcrumb = {
        action,
        timestamp: Date.now(),
        data,
      };
      
      breadcrumbs.push(breadcrumb);
      
      UserFlowLogger.breadcrumb(action, data, sessionId);
      
      return breadcrumb;
    },
    [breadcrumbs]
  );

  // Log a summary of the journey
  const logJourneySummary = useCallback(
    (outcome: "completed" | "abandoned" | "error") => {
      const sessionId = localStorage.getItem("session_id") || "unknown_session";
      
      UserFlowLogger.interaction("journey_summary", "UserFlow", {
        outcome,
        breadcrumbCount: breadcrumbs.length,
        duration: breadcrumbs.length > 0 
          ? Date.now() - breadcrumbs[0].timestamp 
          : 0,
        sessionId,
      });
    },
    [breadcrumbs]
  );

  return {
    addBreadcrumb,
    logJourneySummary,
    getBreadcrumbs: () => [...breadcrumbs],
  };
}
