import React, { useRef, useEffect, useState } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: string;
  enableLazyLoading?: boolean;
  enableCache?: boolean;
  showLoadingSpinner?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Componente de imagen optimizado con lazy loading, cache y manejo de errores
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  placeholder,
  enableLazyLoading = true,
  enableCache = true,
  showLoadingSpinner = true,
  onLoad,
  onError,
  style,
  sizes,
  loading = 'lazy'
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!enableLazyLoading);
  
  const imageState = useImageLoader(
    isInView ? src : '',
    {
      enableLazyLoading: false, // Manejamos lazy loading manualmente
      enableCache,
      placeholder,
      fallback: fallbackSrc
    }
  );

  // Intersection Observer para lazy loading manual
  useEffect(() => {
    if (!enableLazyLoading || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [enableLazyLoading, isInView]);

  // Callbacks
  useEffect(() => {
    if (imageState.isLoaded && onLoad) {
      onLoad();
    }
  }, [imageState.isLoaded, onLoad]);

  useEffect(() => {
    if (imageState.hasError && onError) {
      onError(new Error(`Failed to load image: ${src}`));
    }
  }, [imageState.hasError, onError, src]);

  // Renderizar placeholder mientras carga
  if (!isInView || imageState.isLoading) {
    return (
      <div 
        ref={imgRef}
        className={`${className} flex items-center justify-center bg-gray-200 animate-pulse`}
        style={style}
        role="img"
        aria-label={`Cargando: ${alt}`}
      >
        {showLoadingSpinner && (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500">Cargando...</span>
          </div>
        )}
      </div>
    );
  }

  // Renderizar fallback si hay error
  if (imageState.hasError) {
    return (
      <div 
        ref={imgRef}
        className={`${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300`}
        style={style}
        role="img"
        aria-label={`Error al cargar: ${alt}`}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  // Renderizar imagen cargada
  return (
    <img
      ref={imgRef}
      src={imageState.src}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        imageState.isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={style}
      sizes={sizes}
      loading={loading}
      decoding="async"
      onLoad={() => {
        if (onLoad) onLoad();
      }}
      onError={() => {
        if (onError) onError(new Error(`Failed to load image: ${src}`));
      }}
    />
  );
};

export default OptimizedImage;