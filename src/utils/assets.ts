// Utilidad centralizada para detección de entorno
export const detectDevelopmentMode = (): boolean => {
  try {
    // Método 1: import.meta.env (más confiable en Vite)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const env = (import.meta as any).env;
      return env.MODE === 'development' || env.DEV === true;
    }
    
    // Método 2: hostname (para casos donde import.meta no esté disponible)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return true;
      }
    }
    
    // Método 3: puerto de desarrollo
    if (typeof window !== 'undefined') {
      const port = window.location.port;
      if (port === '5173' || port === '3000' || port === '8080') {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.warn('Error detecting development mode:', error);
    return false;
  }
};

// Cache para evitar recálculos
let cachedIsDev: boolean | null = null;
let cachedPaths: Record<string, string> = {};

// Utilidad para manejar rutas de assets (imágenes, archivos) según el entorno
export const getAssetPath = (assetPath: string): string => {
  // Usar cache para evitar recálculos
  if (cachedPaths[assetPath]) {
    return cachedPaths[assetPath];
  }

  // Detectar modo desarrollo solo una vez
  if (cachedIsDev === null) {
    cachedIsDev = detectDevelopmentMode();
  }
  
  // Normalizar ruta (remover slash inicial si existe)
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  
  let finalPath: string;
  if (cachedIsDev) {
    // En desarrollo, usar ruta directa
    finalPath = `/${normalizedPath}`;
  } else {
    // En producción, usar ruta con base path
    finalPath = `/Medicion-del-Servicio/${normalizedPath}`;
  }
  
  // Guardar en cache
  cachedPaths[assetPath] = finalPath;
  
  return finalPath;
};

// Función para validar si un asset existe (opcional, para debugging)
export const validateAssetPath = async (assetPath: string): Promise<boolean> => {
  try {
    const response = await fetch(assetPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Función para limpiar cache (útil para testing o cambios de entorno)
export const clearAssetCache = (): void => {
  cachedIsDev = null;
  cachedPaths = {};
};

// Rutas específicas de imágenes con lazy loading
export const IMAGES = {
  get logo() {
    return getAssetPath('images/logo.jpg');
  },
  get coltefinanciera() {
    return getAssetPath('images/Coltefinanciera.png');
  },
} as const;

// Función helper para precargar imágenes
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Función para precargar todas las imágenes del sistema
export const preloadAllImages = async (): Promise<void> => {
  try {
    await Promise.all([
      preloadImage(IMAGES.logo),
      preloadImage(IMAGES.coltefinanciera)
    ]);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};