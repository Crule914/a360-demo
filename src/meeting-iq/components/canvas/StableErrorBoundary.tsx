// @ts-nocheck
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorBoundary?: string;
}

export class StableErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 2;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorBoundary: error.name 
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging with specific detection for Date rendering errors
    if (process.env.NODE_ENV === 'development') {
      const isDateError = error.message.includes('Objects are not valid as a React child');
      console.error('🚨 StableErrorBoundary caught:', {
        message: error.message,
        isDateRenderingError: isDateError,
        errorType: error.name,
        componentStack: errorInfo.componentStack?.split('\n').slice(0, 3).join('\n')
      });
      
      if (isDateError) {
        console.error('💡 Likely cause: Direct Date object rendering in JSX. Use date formatting utilities instead.');
      }
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="m-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Component Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>This component encountered an error and couldn't render.</p>
            {this.retryCount < this.maxRetries && (
              <button
                onClick={this.handleRetry}
                className="text-sm bg-destructive text-destructive-foreground px-2 py-1 rounded hover:bg-destructive/90"
              >
                Try Again ({this.maxRetries - this.retryCount} attempts left)
              </button>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}