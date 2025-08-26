import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GenericErrorFallback, NetworkErrorFallback, DataCorruptionFallback } from './LoadingFallbacks';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para mostrar la UI de error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error para debugging
    console.error(`Error en ${this.props.componentName || 'Componente'}:`, error);
    console.error('Error Info:', errorInfo);
    
    // Actualizar estado con información del error
    this.setState({
      error,
      errorInfo
    });

    // Reportar errores específicos de Symbol.iterator
    if (error.message.includes('Symbol.iterator') || error.message.includes('not iterable')) {
      console.error('🚨 Error de Symbol.iterator detectado:', {
        component: this.props.componentName,
        error: error.message,
        stack: error.stack
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Fallback personalizado si se proporciona
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Determinar el tipo de error y usar el fallback apropiado
      const error = this.state.error;
      const errorMessage = error?.message || '';

      // Error de red o conectividad
      if (errorMessage.includes('fetch') || 
          errorMessage.includes('network') || 
          errorMessage.includes('Failed to load') ||
          errorMessage.includes('NetworkError')) {
        return (
          <NetworkErrorFallback 
            onRetry={this.handleRetry}
            error={errorMessage}
          />
        );
      }

      // Error de datos corruptos o Symbol.iterator
      if (errorMessage.includes('Symbol.iterator') || 
          errorMessage.includes('not iterable') ||
          errorMessage.includes('is not a function') ||
          errorMessage.includes('Cannot read property')) {
        return (
          <DataCorruptionFallback 
            onReset={this.handleRetry}
            details={`Error de iteración de datos: ${errorMessage}`}
          />
        );
      }

      // Error genérico
      return (
        <GenericErrorFallback 
          componentName={this.props.componentName}
          onRetry={this.handleRetry}
          error={error}
        />
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;