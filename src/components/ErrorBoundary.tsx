/**
 * Error Boundary component for comprehensive error catching and logging
 * Complies with 300 LOC limit and ≤4 parameters per function
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import logger, { LoggerUtils } from '@/lib/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error boundary with comprehensive logging and user-friendly fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: LoggerUtils.generateRequestId()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = LoggerUtils.generateRequestId();
    
    // Log error with comprehensive context
    logger.error('React Error Boundary Caught Error', {
      type: 'react_error_boundary',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      errorId: errorId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });

    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { hasError } = this.state;
    const { resetOnPropsChange } = this.props;
    
    if (hasError && prevProps.children !== this.props.children && resetOnPropsChange) {
      this.handleRetry();
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  handleRetry = (): void => {
    logger.info('Error Boundary Reset Attempted', {
      type: 'error_boundary_reset',
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = (): void => {
    logger.info('Page Reload Requested', {
      type: 'page_reload',
      errorId: this.state.errorId,
      timestamp: new Date().toISOString()
    });
    
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error, errorId } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Er is iets misgegaan
              </h2>
              <p className="text-gray-600 mt-2">
                We hebben een onverwachte fout gedetecteerd. Onze ontwikkelaars zijn op de hoogte gesteld.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error details for development */}
              {import.meta.env.DEV && error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800">Foutdetails:</p>
                  <p className="text-xs text-red-700 mt-1 font-mono">
                    {error.message}
                  </p>
                  {errorId && (
                    <p className="text-xs text-red-600 mt-1">
                      Error ID: {errorId}
                    </p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center gap-2"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4" />
                  Opnieuw proberen
                </Button>
                
                <Button 
                  onClick={this.handleReload}
                  className="flex-1 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Pagina herladen
                </Button>
              </div>

              {/* Support information */}
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Als het probleem aanhoudt, neem dan contact op met onze support.
                </p>
                {errorId && (
                  <p className="text-xs text-gray-400 mt-1">
                    Fout ID: {errorId}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// Export only the ErrorBoundary component to satisfy react-refresh/only-export-components
// HOC functionality can be added to a separate file if needed

/**
 * Specific error boundary for async operations
 */
export function AsyncErrorBoundary({ children, onError }: { 
  children: ReactNode; 
  onError?: (error: Error) => void; 
}) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('Async Operation Error', {
          type: 'async_error',
          error: {
            message: error.message,
            stack: error.stack
          },
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        });
        onError?.(error);
      }}
      fallback={
        <div className="p-4 text-center text-gray-600">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <p>Er is een fout opgetreden bij het laden van deze content.</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}