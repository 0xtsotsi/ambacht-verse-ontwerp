import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, level = 'component' } = this.props;
    
    // Enhanced error logging
    const errorReport = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      context: {
        level,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        errorId: this.state.errorId
      },
      retryCount: this.state.retryCount
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }

    // Send to monitoring service (Sentry, LogRocket, etc.)
    this.logErrorToService(errorReport);

    // Update state
    this.setState({
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    // Call custom error handler
    onError?.(error, errorInfo);
  }

  private logErrorToService = (errorReport: any) => {
    // In production, send to your error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry integration
      // Sentry.captureException(errorReport.error, {
      //   tags: { level: errorReport.context.level },
      //   extra: errorReport
      // });
      
      // For now, store in localStorage for debugging
      try {
        const existingErrors = JSON.parse(localStorage.getItem('wesley_errors') || '[]');
        existingErrors.push(errorReport);
        // Keep only last 10 errors
        const recentErrors = existingErrors.slice(-10);
        localStorage.setItem('wesley_errors', JSON.stringify(recentErrors));
      } catch (e) {
        console.warn('Failed to store error report:', e);
      }
    }
  };

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when props change (useful for route changes)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount(): void {
    // Clean up any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    });
  };

  handleRetry = (): void => {
    const { retryCount } = this.state;
    
    // Limit retry attempts
    if (retryCount >= 3) {
      this.handleReportError();
      return;
    }

    // Progressive retry delay
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    
    const timeout = setTimeout(() => {
      this.resetErrorBoundary();
    }, delay);
    
    this.retryTimeouts.push(timeout);
  };

  handleReportError = (): void => {
    const { error, errorId } = this.state;
    const emailSubject = `Wesley's Ambacht - Error Report ${errorId}`;
    const emailBody = `
Error Details:
- Error ID: ${errorId}
- Message: ${error?.message || 'Unknown error'}
- Time: ${new Date().toLocaleString()}
- Page: ${window.location.href}

Please describe what you were doing when this error occurred:

[Your description here]
    `.trim();

    const mailtoUrl = `mailto:support@wesleyambacht.nl?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl);
  };

  render(): ReactNode {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, level = 'component' } = this.props;

    if (!hasError) {
      return children;
    }

    // Custom fallback provided
    if (fallback) {
      return fallback;
    }

    // Different error UIs based on level
    if (level === 'critical') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-warm-cream p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <AlertTriangle className="h-16 w-16 text-accent-red mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-charcoal">Oeps, er ging iets mis!</h1>
              <p className="text-muted-foreground">
                Er is een onverwachte fout opgetreden. Onze excuses voor het ongemak.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Vernieuwen
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
              <Button 
                onClick={this.handleReportError}
                variant="ghost" 
                className="w-full text-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                Rapporteer deze fout
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (level === 'page') {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="h-12 w-12 text-accent-red mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-charcoal mb-2">
            Deze pagina kan niet worden geladen
          </h2>
          <p className="text-muted-foreground mb-6">
            Er is een fout opgetreden bij het laden van deze pagina.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={this.handleRetry} disabled={retryCount >= 3}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryCount >= 3 ? 'Te veel pogingen' : 'Opnieuw proberen'}
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Terug
            </Button>
          </div>
        </div>
      );
    }

    // Component level error
    return (
      <div className="p-4 border border-accent-red/20 rounded-lg bg-accent-red/5">
        <div className="flex items-center gap-2 text-accent-red mb-2">
          <Bug className="h-4 w-4" />
          <span className="text-sm font-medium">Component Error</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Dit onderdeel kan niet worden weergegeven.
        </p>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={this.handleRetry}
          disabled={retryCount >= 3}
        >
          {retryCount >= 3 ? 'Fout persistent' : 'Probeer opnieuw'}
        </Button>
      </div>
    );
  }
}

// HOC for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for throwing errors in functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: any) => {
    // This will be caught by the nearest error boundary
    throw error;
  };
};