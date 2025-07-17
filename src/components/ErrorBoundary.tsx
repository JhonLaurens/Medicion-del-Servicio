import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can send logs to an external service here
    if (import.meta.env?.MODE === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 border border-red-200 rounded">
          <h2 className="text-2xl font-bold text-red-700 mb-2">¡Ups! Algo salió mal.</h2>
          <p className="mb-4 text-red-600">
            Ocurrió un error inesperado. Por favor, intenta recargar la página.
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
              onClick={this.handleReload}
            >
              Recargar
            </button>
            <a
              href="/"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Volver al Inicio
            </a>
          </div>
          {import.meta.env?.MODE === 'development' && (
            <details className="mt-6 text-xs text-gray-500 whitespace-pre-wrap max-w-xl bg-gray-100 p-2 rounded">
              <summary>Detalles del error (solo para desarrollo)</summary>
              {this.state.error && this.state.error.toString()}
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
