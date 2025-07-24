// Simple stub for logger - replaced complex logging for browser compatibility
export const LoggerUtils = {
  sanitizeData: (data: any) => data,
  generateRequestId: () => Math.random().toString(36).substr(2, 9),
  generateSessionId: () => Math.random().toString(36).substr(2, 9)
};

export const UserFlowLogger = {
  log: (...args: any[]) => console.log(...args),
  interaction: (...args: any[]) => console.log(...args),
  navigation: (...args: any[]) => console.log(...args)
};

export const APILogger = {
  log: (...args: any[]) => console.log(...args)
};

const logger = {
  info: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  debug: (...args: any[]) => console.debug(...args)
};

export default logger;