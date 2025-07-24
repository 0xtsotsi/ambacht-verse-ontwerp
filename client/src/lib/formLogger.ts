// Simple stub for form logger - replaced complex logging for browser compatibility
export const FormLogger = {
  logFormSubmission: (...args: any[]) => console.log(...args),
  logFormValidation: (...args: any[]) => console.log(...args),
  logFieldInteraction: (...args: any[]) => console.log(...args)
};

export const useFormAnalytics = (formName?: string, formFields?: FormField[]) => ({
  initializeForm: () => `form_${Date.now()}`,
  trackFocus: (...args: any[]) => console.log(...args),
  trackBlur: (...args: any[]) => console.log(...args),
  trackChange: (...args: any[]) => console.log(...args),
  trackSubmission: (...args: any[]) => console.log(...args),
  trackAbandonment: (...args: any[]) => console.log(...args),
  logFunnelStep: (...args: any[]) => console.log(...args),
  cleanup: () => {},
  trackFormSubmission: (...args: any[]) => console.log(...args),
  trackFormValidation: (...args: any[]) => console.log(...args),
  trackFieldInteraction: (...args: any[]) => console.log(...args),
  trackFormError: (...args: any[]) => console.log(...args)
});

export interface FormField {
  name: string;
  type: string;
  required?: boolean;
  value?: any;
}

export default FormLogger;