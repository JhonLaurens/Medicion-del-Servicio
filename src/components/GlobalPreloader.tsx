import React, { useState, useEffect } from 'react';
import { useImagePreloader } from '../hooks/useImageLoader';

interface GlobalPreloaderProps {
  onComplete?: () => void;
  minDisplayTime?: number;
}

/**
 * Componente de preloader global para la aplicación
 * Precarga recursos críticos y muestra progreso
 */
const GlobalPreloader: React.FC<GlobalPreloaderProps> = ({
  onComplete,
  minDisplayTime = 1500
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [startTime] = useState(Date.now());

  // Imágenes críticas a precargar
  const criticalImages = [
    '/images/Coltefinanciera.png',
    '/images/logo.jpg'
  ];

  const {
    progress,
    isPreloading,
    preloadedCount,
    totalImages
  } = useImagePreloader(criticalImages);

  useEffect(() => {
    if (!isPreloading && progress === 100) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          setTimeout(onComplete, 300); // Esperar a que termine la animación
        }
      }, remainingTime);
    }
  }, [isPreloading, progress, startTime, minDisplayTime, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center text-white">
        {/* Logo placeholder */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
            <span className="text-3xl font-bold text-white">CF</span>
          </div>
        </div>

        {/* Company name */}
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          Coltefinanciera
        </h1>
        <p className="text-lg text-blue-200 mb-8 font-light">
          Sistema de Medición del Servicio
        </p>

        {/* Progress indicator */}
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-blue-200 mb-2">
              <span>Cargando recursos...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Loading details */}
          <div className="text-xs text-blue-300">
            <p>Recursos cargados: {preloadedCount} de {totalImages}</p>
            {isPreloading && (
              <div className="flex items-center justify-center mt-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Optimizando experiencia...</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading animation */}
        <div className="mt-8 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalPreloader;