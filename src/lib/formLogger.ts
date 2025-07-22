
import { useRef, useCallback, useEffect } from "react";
import { UserFlowLogger } from "@/lib/logger";

export type FormFieldValue = string | number | boolean | null | undefined;

export interface FormField {
  name: string;
  type: string;
  required: boolean;
}

interface FormTracking {
  formId: string;
  startTime: number;
  fields: {
    [fieldName: string]: {
      focused: number;
      blurred: number;
      changed: number;
      timeSpent: number;
      lastFocusTime: number | null;
    };
  };
  completed: boolean;
}

/**
 * Hook for comprehensive form analytics tracking
 */
export function useFormAnalytics(formName: string, fields: FormField[]) {
  const formTrackingRef = useRef<FormTracking>({
    formId: `form_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    startTime: Date.now(),
    fields: {},
    completed: false,
  });

  // Initialize field tracking
  useEffect(() => {
    const fieldTracking: { [key: string]: any } = {};
    
    fields.forEach((field) => {
      fieldTracking[field.name] = {
        focused: 0,
        blurred: 0,
        changed: 0,
        timeSpent: 0,
        lastFocusTime: null,
      };
    });
    
    formTrackingRef.current.fields = fieldTracking;
  }, [fields]);

  // Initialize form tracking
  const initializeForm = useCallback(() => {
    const formKey = formTrackingRef.current.formId;
    
    UserFlowLogger.form(formName, "submit", {
      event: "form_initialized",
      formId: formKey,
      fieldCount: fields.length,
      requiredFieldCount: fields.filter(f => f.required).length,
    });
    
    return formKey;
  }, [formName, fields]);

  // Track field focus
  const trackFocus = useCallback((fieldName: string) => {
    const field = formTrackingRef.current.fields[fieldName];
    
    if (field) {
      field.focused += 1;
      field.lastFocusTime = Date.now();
      
      UserFlowLogger.form(formName, "validate", {
        event: "field_focus",
        field: fieldName,
        focusCount: field.focused,
      });
    }
  }, [formName]);

  // Track field blur
  const trackBlur = useCallback((fieldName: string) => {
    const field = formTrackingRef.current.fields[fieldName];
    
    if (field && field.lastFocusTime) {
      field.blurred += 1;
      const timeSpent = Date.now() - field.lastFocusTime;
      field.timeSpent += timeSpent;
      field.lastFocusTime = null;
      
      UserFlowLogger.form(formName, "validate", {
        event: "field_blur",
        field: fieldName,
        blurCount: field.blurred,
        timeSpent,
        totalTimeSpent: field.timeSpent,
      });
    }
  }, [formName]);

  // Track field changes
  const trackChange = useCallback((fieldName: string, value: FormFieldValue) => {
    const field = formTrackingRef.current.fields[fieldName];
    
    if (field) {
      field.changed += 1;
      
      UserFlowLogger.form(formName, "validate", {
        event: "field_change",
        field: fieldName,
        changeCount: field.changed,
        valueLength: value ? String(value).length : 0,
      });
    }
  }, [formName]);

  // Track form submission
  const trackSubmission = useCallback(
    (data: Record<string, FormFieldValue>, validationErrors: string[], isSuccessful: boolean) => {
      const tracking = formTrackingRef.current;
      const duration = Date.now() - tracking.startTime;
      
      tracking.completed = isSuccessful;
      
      const fieldStats = Object.entries(tracking.fields).map(([name, stats]) => ({
        name,
        focused: stats.focused,
        changed: stats.changed,
        timeSpent: stats.timeSpent,
      }));
      
      UserFlowLogger.form(formName, isSuccessful ? "submit" : "error", {
        event: "form_submission",
        formId: tracking.formId,
        duration,
        isSuccessful,
        fieldCount: Object.keys(tracking.fields).length,
        fieldStats,
        errorCount: validationErrors.length,
        errors: validationErrors,
      });
      
      return isSuccessful;
    },
    [formName]
  );

  // Track form abandonment
  const trackAbandonment = useCallback((reason: string) => {
    const tracking = formTrackingRef.current;
    const duration = Date.now() - tracking.startTime;
    
    const fieldsInteracted = Object.entries(tracking.fields).filter(
      ([_, stats]) => stats.focused > 0
    ).length;
    
    UserFlowLogger.form(formName, "error", {
      event: "form_abandoned",
      formId: tracking.formId,
      reason,
      duration,
      fieldsInteracted,
      fieldsTotal: Object.keys(tracking.fields).length,
      completionPercentage: (fieldsInteracted / Object.keys(tracking.fields).length) * 100,
    });
  }, [formName]);

  // Track funnel steps
  const logFunnelStep = useCallback(
    (step: string, data?: Record<string, any>) => {
      UserFlowLogger.interaction(`form_step_${step}`, formName, {
        formId: formTrackingRef.current.formId,
        timestamp: Date.now(),
        ...data,
      });
    },
    [formName]
  );

  // Cleanup tracking on unmount
  const cleanup = useCallback(() => {
    const tracking = formTrackingRef.current;
    
    if (!tracking.completed) {
      const filledFields = Object.entries(tracking.fields).filter(
        ([_, stats]) => stats.changed > 0
      ).length;
      
      if (filledFields > 0) {
        trackAbandonment("component_unmounted");
      }
    }
  }, [trackAbandonment]);

  return {
    initializeForm,
    trackFocus,
    trackBlur,
    trackChange,
    trackSubmission,
    trackAbandonment,
    logFunnelStep,
    cleanup,
    getFormStats: () => ({ ...formTrackingRef.current }),
  };
}
