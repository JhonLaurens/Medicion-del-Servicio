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
    // Puedes enviar logs a un servicio externo aquí
    if (import.meta.env?.MODE === 'development') {
      console.error('ErrorBoundary atrapó un error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 border border-red-200 rounded">
          <h2 className="text-2xl font-bold text-red-700 mb-2">¡Algo salió mal!</h2>
          <p className="mb-4 text-red-600">Ocurrió un error inesperado en esta sección. Puedes volver al inicio o intentar recargar la página.</p>
          <details className="text-xs text-gray-500 whitespace-pre-wrap max-w-xl mb-4">
            {this.state.error && this.state.error.toString()}
          </details>
          <button className="bg-blue-700 text-white px-4 py-2 rounded" onClick={() => window.location.href = '/'}>
            Volver al Inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
