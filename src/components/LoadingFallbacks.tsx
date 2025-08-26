import React from 'react';

// Fallback para gráficos que no pueden cargar
export const ChartLoadingFallback: React.FC<{ title?: string; height?: string }> = ({ 
  title = "Gráfico", 
  height = "h-80" 
}) => (
  <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${height} flex items-center justify-center`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Cargando {title}...</p>
      <p className="text-gray-500 text-sm mt-2">Por favor espere un momento</p>
    </div>
  </div>
);

// Fallback para cuando no hay datos disponibles
export const NoDataFallback: React.FC<{ 
  title?: string; 
  message?: string;
  icon?: string;
}> = ({ 
  title = "Sin Datos", 
  message = "No hay información disponible en este momento.",
  icon = "📊"
}) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-yellow-800 mb-2">{title}</h3>
    <p className="text-yellow-700 mb-4">{message}</p>
    <div className="text-sm text-yellow-600">
      <p>Posibles causas:</p>
      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Los datos aún se están cargando</li>
        <li>No hay registros para los filtros seleccionados</li>
        <li>Error temporal de conectividad</li>
      </ul>
    </div>
  </div>
);

// Fallback para errores de red o conectividad
export const NetworkErrorFallback: React.FC<{ 
  onRetry?: () => void;
  error?: string;
}> = ({ onRetry, error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          🌐 Error de Conectividad
        </h3>
        <p className="text-red-700 mb-4">
          No se pudo cargar la información. Verifique su conexión a internet.
        </p>
        {error && (
          <details className="bg-red-100 rounded p-3 mb-4">
            <summary className="cursor-pointer font-medium text-red-800">
              Detalles del error
            </summary>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </details>
        )}
        <div className="flex space-x-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              🔄 Reintentar
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            🔃 Recargar Página
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Fallback para datos corruptos o inválidos
export const DataCorruptionFallback: React.FC<{ 
  onReset?: () => void;
  details?: string;
}> = ({ onReset, details }) => (
  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          🔧 Datos Inválidos
        </h3>
        <p className="text-orange-700 mb-4">
          Los datos recibidos no tienen el formato esperado. Esto puede deberse a una actualización del sistema.
        </p>
        {details && (
          <details className="bg-orange-100 rounded p-3 mb-4">
            <summary className="cursor-pointer font-medium text-orange-800">
              Información técnica
            </summary>
            <p className="mt-2 text-sm text-orange-700">{details}</p>
          </details>
        )}
        <div className="flex space-x-3">
          {onReset && (
            <button
              onClick={onReset}
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200"
            >
              🔄 Restablecer
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            🔃 Recargar Página
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Fallback genérico para componentes que fallan
export const GenericErrorFallback: React.FC<{ 
  componentName?: string;
  onRetry?: () => void;
  error?: Error;
}> = ({ componentName = "Componente", onRetry, error }) => (
  <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
    <div className="text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Error en {componentName}
      </h3>
      <p className="text-gray-600 mb-4">
        Este componente no pudo cargarse correctamente.
      </p>
      {error && (
        <details className="bg-gray-100 rounded p-3 mb-4 text-left">
          <summary className="cursor-pointer font-medium text-gray-800 text-center">
            Ver detalles del error
          </summary>
          <div className="mt-2 text-sm text-gray-700">
            <p><strong>Mensaje:</strong> {error.message}</p>
            {error.stack && (
              <pre className="mt-2 text-xs bg-gray-200 p-2 rounded overflow-auto max-h-32">
                {error.stack}
              </pre>
            )}
          </div>
        </details>
      )}
      <div className="flex justify-center space-x-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            🔄 Reintentar
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          🔃 Recargar Página
        </button>
      </div>
    </div>
  </div>
);

// Skeleton loader para tablas
export const TableSkeletonLoader: React.FC<{ 
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-12 rounded mb-4"></div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 mb-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="bg-gray-200 h-8 rounded flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);

// Skeleton loader para gráficos
export const ChartSkeletonLoader: React.FC<{ height?: string }> = ({ height = "h-80" }) => (
  <div className={`animate-pulse ${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
    <div className="text-center">
      <div className="bg-gray-200 h-16 w-16 rounded-full mx-auto mb-4"></div>
      <div className="bg-gray-200 h-4 w-32 rounded mx-auto mb-2"></div>
      <div className="bg-gray-200 h-3 w-24 rounded mx-auto"></div>
    </div>
  </div>
);