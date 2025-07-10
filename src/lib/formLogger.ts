/**
 * Form Analytics System for Ambacht-Verse-Ontwerp
 * Tracks form interactions, submissions, errors, and conversion funnels
 */

import { UserFlowLogger, LoggerUtils } from '@/lib/logger';

// Define form field value types
export type FormFieldValue = string | number | boolean | Date | string[] | null;

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date';
  required: boolean;
  value?: FormFieldValue;
}

export interface FormAnalytics {
  formName: string;
  sessionId: string;
  startTime: number;
  fields: Record<string, FormFieldAnalytics>;
  submissions: FormSubmissionAnalytics[];
  abandonments: FormAbandonmentAnalytics[];
  errors: FormErrorAnalytics[];
}

export interface FormFieldAnalytics {
  fieldName: string;
  focusCount: number;
  totalFocusTime: number;
  changeCount: number;
  errorCount: number;
  firstInteraction?: number;
  lastInteraction?: number;
  completionRate: number;
  averageCharLength: number;
}

export interface FormSubmissionAnalytics {
  timestamp: number;
  completionTime: number;
  fieldsCompleted: string[];
  fieldsEmpty: string[];
  validationErrors: string[];
  successful: boolean;
  retryCount: number;
}

export interface FormAbandonmentAnalytics {
  timestamp: number;
  lastFieldInteracted: string;
  completionPercentage: number;
  timeSpent: number;
  reason?: 'navigation' | 'timeout' | 'error' | 'unknown';
}

export interface FormErrorAnalytics {
  timestamp: number;
  fieldName: string;
  errorType: string;
  errorMessage: string;
  userInput: FormFieldValue;
  validationRule: string;
}

// Form Analytics Manager Class
class FormAnalyticsManager {
  private activeFormsData: Map<string, FormAnalytics> = new Map();
  private fieldFocusTimers: Map<string, number> = new Map();

  // Initialize form tracking
  public initializeForm(formName: string, fields: FormField[]): string {
    const sessionId = LoggerUtils.generateSessionId();
    const formKey = `${formName}_${sessionId}`;
    
    const formAnalytics: FormAnalytics = {
      formName,
      sessionId,
      startTime: Date.now(),
      fields: {},
      submissions: [],
      abandonments: [],
      errors: []
    };

    // Initialize field analytics
    fields.forEach(field => {
      formAnalytics.fields[field.name] = {
        fieldName: field.name,
        focusCount: 0,
        totalFocusTime: 0,
        changeCount: 0,
        errorCount: 0,
        completionRate: 0,
        averageCharLength: 0
      };
    });

    this.activeFormsData.set(formKey, formAnalytics);
    
    // Log form initialization
    UserFlowLogger.form(formName, 'initialize', {
      fieldCount: fields.length,
      requiredFields: fields.filter(f => f.required).length,
      fieldTypes: fields.map(f => f.type)
    });

    UserFlowLogger.breadcrumb('form_initialized', {
      formName,
      fieldCount: fields.length
    }, sessionId);

    return formKey;
  }

  // Track field focus
  public trackFieldFocus(formKey: string, fieldName: string): void {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return;

    const field = formData.fields[fieldName];
    if (!field) return;

    field.focusCount++;
    field.firstInteraction = field.firstInteraction || Date.now();
    field.lastInteraction = Date.now();

    // Start focus timer
    const timerKey = `${formKey}_${fieldName}`;
    this.fieldFocusTimers.set(timerKey, Date.now());

    UserFlowLogger.interaction('field_focus', `${formData.formName}_${fieldName}`, {
      focusCount: field.focusCount,
      fieldType: this.getFieldType(formData.formName, fieldName)
    }, formData.sessionId);
  }

  // Track field blur
  public trackFieldBlur(formKey: string, fieldName: string): void {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return;

    const field = formData.fields[fieldName];
    if (!field) return;

    // Calculate focus time
    const timerKey = `${formKey}_${fieldName}`;
    const focusStartTime = this.fieldFocusTimers.get(timerKey);
    
    if (focusStartTime) {
      const focusTime = Date.now() - focusStartTime;
      field.totalFocusTime += focusTime;
      this.fieldFocusTimers.delete(timerKey);
    }

    field.lastInteraction = Date.now();

    UserFlowLogger.interaction('field_blur', `${formData.formName}_${fieldName}`, {
      totalFocusTime: field.totalFocusTime,
      averageFocusTime: field.totalFocusTime / field.focusCount
    }, formData.sessionId);
  }

  // Track field value changes
  public trackFieldChange(formKey: string, fieldName: string, value: FormFieldValue): void {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return;

    const field = formData.fields[fieldName];
    if (!field) return;

    field.changeCount++;
    field.lastInteraction = Date.now();
    
    // Calculate completion rate and average character length
    if (typeof value === 'string') {
      field.averageCharLength = (field.averageCharLength * (field.changeCount - 1) + value.length) / field.changeCount;
      field.completionRate = value.length > 0 ? 100 : 0;
    }

    UserFlowLogger.interaction('field_change', `${formData.formName}_${fieldName}`, {
      changeCount: field.changeCount,
      valueLength: typeof value === 'string' ? value.length : 0,
      completionRate: field.completionRate
    }, formData.sessionId);

    UserFlowLogger.breadcrumb('field_updated', {
      form: formData.formName,
      field: fieldName,
      progress: this.calculateFormProgress(formKey)
    }, formData.sessionId);
  }

  // Track validation errors
  public trackValidationError(
    formKey: string, 
    fieldName: string, 
    errorType: string, 
    errorMessage: string,
    userInput: FormFieldValue,
    validationRule: string
  ): void {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return;

    const field = formData.fields[fieldName];
    if (field) {
      field.errorCount++;
    }

    const errorAnalytics: FormErrorAnalytics = {
      timestamp: Date.now(),
      fieldName,
      errorType,
      errorMessage,
      userInput: LoggerUtils.sanitizeData(userInput),
      validationRule
    };

    formData.errors.push(errorAnalytics);

    UserFlowLogger.form(formData.formName, 'error', {
      fieldName,
      errorType,
      errorMessage,
      totalErrors: formData.errors.length
    }, [errorMessage]);

    UserFlowLogger.breadcrumb('validation_error', {
      form: formData.formName,
      field: fieldName,
      errorType
    }, formData.sessionId);
  }

  // Track form submission
  public trackFormSubmission(
    formKey: string, 
    formValues: Record<string, FormFieldValue>, 
    validationErrors: string[] = [],
    successful: boolean = true
  ): void {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return;

    const completionTime = Date.now() - formData.startTime;
    const fieldsCompleted = Object.keys(formValues).filter(key => {
      const value = formValues[key];
      return value !== null && value !== undefined && value !== '';
    });
    const fieldsEmpty = Object.keys(formData.fields).filter(key => !fieldsCompleted.includes(key));

    const submissionAnalytics: FormSubmissionAnalytics = {
      timestamp: Date.now(),
      completionTime,
      fieldsCompleted,
      fieldsEmpty,
      validationErrors,
      successful,
      retryCount: formData.submissions.length
    };

    formData.submissions.push(submissionAnalytics);

    UserFlowLogger.form(formData.formName, 'submit', {
      completionTime,
      fieldsCompleted: fieldsCompleted.length,
      fieldsEmpty: fieldsEmpty.length,
      validationErrors: validationErrors.length,
      successful,
      retryCount: submissionAnalytics.retryCount
    }, validationErrors);

    UserFlowLogger.breadcrumb('form_submitted', {
      form: formData.formName,
      successful,
      completionTime,
      retryCount: submissionAnalytics.retryCount
    }, formData.sessionId);

    // Log conversion funnel completion
    if (successful) {
      this.logConversionFunnelStep(formKey, 'form_submission_success', {
        formName: formData.formName,
        completionTime,
        fieldsCompleted: fieldsCompleted.length
      });
    }
  }

  // Track form abandonment
  public trackFormAbandonment(
    formKey: string, 
    reason: 'navigation' | 'timeout' | 'error' | 'unknown' = 'unknown'
  ): void {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return;

    const lastFieldInteracted = this.getLastInteractedField(formKey);
    const completionPercentage = this.calculateFormProgress(formKey);
    const timeSpent = Date.now() - formData.startTime;

    const abandonmentAnalytics: FormAbandonmentAnalytics = {
      timestamp: Date.now(),
      lastFieldInteracted,
      completionPercentage,
      timeSpent,
      reason
    };

    formData.abandonments.push(abandonmentAnalytics);

    UserFlowLogger.interaction('form_abandonment', formData.formName, {
      reason,
      lastFieldInteracted,
      completionPercentage,
      timeSpent
    }, formData.sessionId);

    UserFlowLogger.breadcrumb('form_abandoned', {
      form: formData.formName,
      reason,
      progress: completionPercentage
    }, formData.sessionId);
  }

  // Log conversion funnel steps
  public logConversionFunnelStep(
    formKey: string, 
    stepName: string, 
    stepData?: Record<string, unknown>
  ): void {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return;

    UserFlowLogger.interaction('funnel_step', stepName, {
      ...stepData,
      formName: formData.formName,
      stepTimestamp: Date.now(),
      timeFromFormStart: Date.now() - formData.startTime
    }, formData.sessionId);

    UserFlowLogger.breadcrumb('funnel_progress', {
      step: stepName,
      form: formData.formName,
      data: stepData
    }, formData.sessionId);
  }

  // Generate form analytics report
  public generateFormReport(formKey: string): FormAnalytics | null {
    return this.activeFormsData.get(formKey) || null;
  }

  // Cleanup form data
  public cleanupForm(formKey: string): void {
    this.activeFormsData.delete(formKey);
    
    // Clear any remaining timers
    for (const [timerKey, _] of this.fieldFocusTimers) {
      if (timerKey.startsWith(formKey)) {
        this.fieldFocusTimers.delete(timerKey);
      }
    }
  }

  // Private helper methods
  private getFieldType(formName: string, fieldName: string): string {
    // This would ideally come from form configuration
    return 'text'; // Default fallback
  }

  private calculateFormProgress(formKey: string): number {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return 0;

    const totalFields = Object.keys(formData.fields).length;
    const completedFields = Object.values(formData.fields).filter(
      field => field.completionRate > 0
    ).length;

    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  }

  private getLastInteractedField(formKey: string): string {
    const formData = this.activeFormsData.get(formKey);
    if (!formData) return '';

    let lastField = '';
    let lastTime = 0;

    Object.values(formData.fields).forEach(field => {
      if (field.lastInteraction && field.lastInteraction > lastTime) {
        lastTime = field.lastInteraction;
        lastField = field.fieldName;
      }
    });

    return lastField;
  }
}

// Export singleton instance
export const formAnalytics = new FormAnalyticsManager();

// React hook for form analytics
export const useFormAnalytics = (formName: string, fields: FormField[]) => {
  let formKey: string;

  const initializeForm = () => {
    formKey = formAnalytics.initializeForm(formName, fields);
    return formKey;
  };

  const trackFocus = (fieldName: string) => {
    if (formKey) formAnalytics.trackFieldFocus(formKey, fieldName);
  };

  const trackBlur = (fieldName: string) => {
    if (formKey) formAnalytics.trackFieldBlur(formKey, fieldName);
  };

  const trackChange = (fieldName: string, value: FormFieldValue) => {
    if (formKey) formAnalytics.trackFieldChange(formKey, fieldName, value);
  };

  const trackError = (fieldName: string, errorType: string, errorMessage: string, userInput: FormFieldValue, validationRule: string) => {
    if (formKey) formAnalytics.trackValidationError(formKey, fieldName, errorType, errorMessage, userInput, validationRule);
  };

  const trackSubmission = (formValues: Record<string, FormFieldValue>, validationErrors: string[] = [], successful: boolean = true) => {
    if (formKey) formAnalytics.trackFormSubmission(formKey, formValues, validationErrors, successful);
  };

  const trackAbandonment = (reason: 'navigation' | 'timeout' | 'error' | 'unknown' = 'unknown') => {
    if (formKey) formAnalytics.trackFormAbandonment(formKey, reason);
  };

  const logFunnelStep = (stepName: string, stepData?: Record<string, unknown>) => {
    if (formKey) formAnalytics.logConversionFunnelStep(formKey, stepName, stepData);
  };

  const cleanup = () => {
    if (formKey) formAnalytics.cleanupForm(formKey);
  };

  return {
    initializeForm,
    trackFocus,
    trackBlur,
    trackChange,
    trackError,
    trackSubmission,
    trackAbandonment,
    logFunnelStep,
    cleanup
  };
};