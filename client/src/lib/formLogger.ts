// Simple stub for form logger - replaced complex logging for browser compatibility
export const FormLogger = {
  logFormSubmission: (...args: any[]) => console.log(...args),
  logFormValidation: (...args: any[]) => console.log(...args),
  logFieldInteraction: (...args: any[]) => console.log(...args)
};

export const useFormAnalytics = () => ({
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