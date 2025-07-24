// Simple stub for user flow logger - replaced complex logging for browser compatibility
export const useUserFlowLogger = () => ({
  logUserFlow: (...args: any[]) => console.log(...args),
  trackUserAction: (...args: any[]) => console.log(...args),
  startUserFlow: (...args: any[]) => console.log(...args),
  endUserFlow: (...args: any[]) => console.log(...args)
});

export const useBreadcrumbLogger = () => ({
  addBreadcrumb: (...args: any[]) => console.log(...args),
  logJourneySummary: (...args: any[]) => console.log(...args),
  clearBreadcrumbs: (...args: any[]) => console.log(...args)
});

export const useInteractionLogger = () => ({
  logInteraction: (...args: any[]) => console.log(...args),
  trackUserAction: (...args: any[]) => console.log(...args),
  logButtonClick: (...args: any[]) => console.log(...args),
  logFormInteraction: (...args: any[]) => console.log(...args),
  logClick: (...args: any[]) => console.log(...args),
  logButtonPress: (...args: any[]) => console.log(...args)
});

export default useUserFlowLogger;