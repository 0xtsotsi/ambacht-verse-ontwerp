
import { useRef, useCallback } from "react";
import { UserFlowLogger } from "@/lib/logger";

interface FunnelStep {
  name: string;
  timestamp: number;
  data?: Record<string, any>;
}

interface ConversionFunnel {
  id: string;
  name: string;
  startTime: number;
  steps: FunnelStep[];
  completed: boolean;
  abandoned: boolean;
  completionData?: Record<string, any>;
  abandonmentReason?: string;
}

/**
 * Hook for tracking user conversion funnels
 * @param funnelName Name of the conversion funnel
 */
export function useConversionFunnel(funnelName: string) {
  const funnelRef = useRef<ConversionFunnel>({
    id: `funnel_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: funnelName,
    startTime: Date.now(),
    steps: [],
    completed: false,
    abandoned: false,
  });

  // Start tracking a new funnel
  const startFunnel = useCallback(() => {
    const funnelId = funnelRef.current.id;
    funnelRef.current.steps = [];
    funnelRef.current.completed = false;
    funnelRef.current.abandoned = false;
    funnelRef.current.startTime = Date.now();
    
    UserFlowLogger.interaction("funnel_start", funnelName, {
      funnelId,
      timestamp: funnelRef.current.startTime,
    });
    
    return funnelId;
  }, [funnelName]);

  // Log a step in the funnel
  const logStep = useCallback(
    (stepName: string, data?: Record<string, any>) => {
      const funnel = funnelRef.current;
      const step: FunnelStep = {
        name: stepName,
        timestamp: Date.now(),
        data,
      };
      
      funnel.steps.push(step);
      
      UserFlowLogger.interaction("funnel_step", funnelName, {
        funnelId: funnel.id,
        step: stepName,
        stepNumber: funnel.steps.length,
        data,
        timeSinceStart: Date.now() - funnel.startTime,
      });
      
      return step;
    },
    [funnelName]
  );

  // Mark the funnel as complete
  const complete = useCallback(
    (data?: Record<string, any>) => {
      const funnel = funnelRef.current;
      
      if (funnel.completed || funnel.abandoned) {
        return;
      }
      
      funnel.completed = true;
      funnel.completionData = data;
      
      const duration = Date.now() - funnel.startTime;
      
      UserFlowLogger.interaction("funnel_complete", funnelName, {
        funnelId: funnel.id,
        duration,
        steps: funnel.steps.length,
        stepNames: funnel.steps.map(s => s.name),
        data,
      });
      
      return {
        duration,
        steps: funnel.steps,
      };
    },
    [funnelName]
  );

  // Mark the funnel as abandoned
  const abandon = useCallback(
    (reason: string, data?: Record<string, any>) => {
      const funnel = funnelRef.current;
      
      if (funnel.completed || funnel.abandoned) {
        return;
      }
      
      funnel.abandoned = true;
      funnel.abandonmentReason = reason;
      
      const duration = Date.now() - funnel.startTime;
      const lastStep = funnel.steps.length > 0 
        ? funnel.steps[funnel.steps.length - 1].name 
        : "none";
      
      UserFlowLogger.interaction("funnel_abandon", funnelName, {
        funnelId: funnel.id,
        reason,
        duration,
        lastStep,
        stepsCompleted: funnel.steps.length,
        data,
      });
      
      return {
        duration,
        lastStep,
        steps: funnel.steps,
      };
    },
    [funnelName]
  );

  return {
    startFunnel,
    logStep,
    complete,
    abandon,
    getFunnelStats: () => ({ ...funnelRef.current }),
  };
}
