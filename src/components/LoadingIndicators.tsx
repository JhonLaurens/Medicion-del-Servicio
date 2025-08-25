import React, { useState, useEffect } from 'react';
import { FadeIn, ScaleIn } from './AnimatedTransitions';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
}

/**
 * Pantalla de carga mejorada con animaciones y progreso
 */
export const EnhancedLoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Cargando...',
  submessage,
  progress,
  showProgress = false,
  className = ''
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-md mx-auto px-6">
        <FadeIn>
          {/* Logo placeholder */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
              <span className="text-2xl font-bold text-white">CF</span>
            </div>
          </div>

          {/* Loading spinner */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 mx-auto mt-2 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {message}{dots}
            </h2>
            
            {submessage && (
              <p className="text-blue-200 text-lg">
                {submessage}
              </p>
            )}

            {/* Progress bar */}
            {showProgress && typeof progress === 'number' && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-blue-200 mb-2">
                  <span>Progreso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Loading tips */}
            <div className="mt-8 text-sm text-blue-300">
              <p>💡 Optimizando la experiencia para usted...</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

/**
 * Componente skeleton para estados de carga
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Cargando contenido"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

interface CardSkeletonProps {
  showAvatar?: boolean;
  lines?: number;
  className?: string;
}

/**
 * Skeleton para tarjetas de contenido
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showAvatar = false,
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="animate-pulse">
        {showAvatar && (
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
              <Skeleton variant="text" height={16} className="mb-2" />
              <Skeleton variant="text" height={12} width="60%" />
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              height={16}
              width={index === lines - 1 ? '75%' : '100%'}
            />
          ))}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </div>
      </div>
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Skeleton para tablas
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={index} variant="text" height={16} />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <Skeleton key={colIndex} variant="text" height={16} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie' | 'area';
  className?: string;
}

/**
 * Skeleton para gráficos
 */
export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  type = 'bar',
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="animate-pulse">
        {/* Title */}
        <div className="mb-6">
          <Skeleton variant="text" height={24} width="40%" className="mb-2" />
          <Skeleton variant="text" height={16} width="60%" />
        </div>
        
        {/* Chart area */}
        <div className="h-64 bg-gray-100 rounded-lg flex items-end justify-center p-4">
          {type === 'bar' && (
            <div className="flex items-end space-x-2 h-full w-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-t flex-1"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              ))}
            </div>
          )}
          
          {type === 'pie' && (
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
          )}
          
          {(type === 'line' || type === 'area') && (
            <div className="w-full h-full bg-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton variant="rectangular" width={12} height={12} />
              <Skeleton variant="text" width={60} height={12} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface InlineLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * Indicador de carga inline
 */
export const InlineLoading: React.FC<InlineLoadingProps> = ({
  size = 'md',
  color = 'blue-600',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-${color} rounded-full animate-spin`}></div>
      <span className="text-sm text-gray-600">Cargando...</span>
    </div>
  );
};

interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Botón con estado de carga
 */
export const ButtonWithLoading: React.FC<ButtonLoadingProps> = ({
  loading,
  children,
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <button
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={loading || disabled}
      className={`
        relative px-4 py-2 bg-blue-600 text-white rounded-lg
        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-blue-300
        transition-all duration-200 ${className}
      `}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

/**
 * Hook para gestionar estados de carga
 */
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset
  };
};