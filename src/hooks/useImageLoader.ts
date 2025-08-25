import { useState, useEffect, useCallback } from 'react';

interface ImageLoaderOptions {
  enableLazyLoading?: boolean;
  enableCache?: boolean;
  placeholder?: string;
  fallback?: string;
}

interface ImageLoaderState {
  src: string;
  isLoaded: boolean;
  isLoading: boolean;
  hasError: boolean;
  loadedSrc?: string;
}

// Cache global para imágenes
const imageCache = new Map<string, boolean>();
const preloadedImages = new Set<string>();

/**
 * Hook personalizado para optimizar la carga de imágenes
 * Incluye lazy loading, cache y manejo de errores
 */
export const useImageLoader = (
  imagePath: string,
  options: ImageLoaderOptions = {}
): ImageLoaderState => {
  const {
    enableLazyLoading = true,
    enableCache = true,
    placeholder = '',
    fallback = ''
  } = options;

  const [state, setState] = useState<ImageLoaderState>({
    src: placeholder || imagePath,
    isLoaded: false,
    isLoading: false,
    hasError: false
  });

  // Función para determinar la ruta de imagen según el entorno
  const getImagePath = useCallback((path: string): string => {
    if (!path) return '';
    
    const isVercel = typeof window !== 'undefined' && 
      window.location.hostname.includes('vercel.app');
    const isDevelopment = import.meta.env.DEV;
    
    // Si la ruta ya es absoluta (http/https), devolverla tal como está
    if (path.startsWith('http')) return path;
    
    // Para rutas relativas, aplicar la lógica de entorno
    if (isVercel || isDevelopment) {
      return path.startsWith('/') ? path : `/${path}`;
    } else {
      const basePath = '/Medicion-del-Servicio';
      return path.startsWith('/') ? `${basePath}${path}` : `${basePath}/${path}`;
    }
  }, []);

  // Función para precargar imagen
  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Verificar cache primero
      if (enableCache && imageCache.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        if (enableCache) {
          imageCache.set(src, true);
          preloadedImages.add(src);
        }
        resolve();
      };
      
      img.onerror = () => {
        if (enableCache) {
          imageCache.set(src, false);
        }
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }, [enableCache]);

  // Función para cargar imagen
  const loadImage = useCallback(async () => {
    const fullPath = getImagePath(imagePath);
    
    if (!fullPath) {
      setState(prev => ({ ...prev, hasError: true, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, hasError: false }));

    try {
      await preloadImage(fullPath);
      setState(prev => ({
        ...prev,
        src: fullPath,
        loadedSrc: fullPath,
        isLoaded: true,
        isLoading: false,
        hasError: false
      }));
    } catch (error) {
      console.warn(`⚠️ useImageLoader: Failed to load image ${fullPath}:`, error);
      
      // Intentar cargar fallback si está disponible
      if (fallback && fallback !== fullPath) {
        try {
          const fallbackPath = getImagePath(fallback);
          await preloadImage(fallbackPath);
          setState(prev => ({
            ...prev,
            src: fallbackPath,
            loadedSrc: fallbackPath,
            isLoaded: true,
            isLoading: false,
            hasError: false
          }));
        } catch (fallbackError) {
          setState(prev => ({
            ...prev,
            hasError: true,
            isLoading: false
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          hasError: true,
          isLoading: false
        }));
      }
    }
  }, [imagePath, getImagePath, preloadImage, fallback]);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!enableLazyLoading) {
      loadImage();
      return;
    }

    // Para lazy loading, esperamos a que el componente esté visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px' // Comenzar a cargar 50px antes de que sea visible
      }
    );

    // Crear un elemento temporal para observar
    const tempElement = document.createElement('div');
    observer.observe(tempElement);

    return () => {
      observer.disconnect();
    };
  }, [enableLazyLoading, loadImage]);

  return state;
};

/**
 * Hook para precargar múltiples imágenes
 */
export const useImagePreloader = (imagePaths: string[]) => {
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadErrors, setPreloadErrors] = useState<string[]>([]);

  const preloadImages = useCallback(async () => {
    if (imagePaths.length === 0) return;

    setIsPreloading(true);
    setPreloadedCount(0);
    setPreloadErrors([]);

    const errors: string[] = [];
    let loaded = 0;

    for (const path of imagePaths) {
      try {
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            loaded++;
            setPreloadedCount(loaded);
            resolve();
          };
          img.onerror = () => reject(new Error(`Failed to preload: ${path}`));
          img.src = path;
        });
      } catch (error) {
        errors.push(path);
        console.warn(`⚠️ useImagePreloader: Failed to preload ${path}:`, error);
      }
    }

    setPreloadErrors(errors);
    setIsPreloading(false);
  }, [imagePaths]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return {
    preloadedCount,
    totalImages: imagePaths.length,
    isPreloading,
    preloadErrors,
    progress: imagePaths.length > 0 ? (preloadedCount / imagePaths.length) * 100 : 0
  };
};

/**
 * Función utilitaria para limpiar el cache de imágenes
 */
export const clearImageCache = () => {
  imageCache.clear();
  preloadedImages.clear();
};

/**
 * Función utilitaria para obtener estadísticas del cache
 */
export const getImageCacheStats = () => {
  return {
    totalCached: imageCache.size,
    successfullyLoaded: Array.from(imageCache.values()).filter(Boolean).length,
    failedToLoad: Array.from(imageCache.values()).filter(v => !v).length,
    preloadedImages: preloadedImages.size
  };
};