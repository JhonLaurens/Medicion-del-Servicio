// Utilidad para manejar rutas de assets (imágenes, archivos) según el entorno
export const getAssetPath = (assetPath: string): string => {
  // Detectar si estamos en modo desarrollo
  const isDev = detectDevelopmentMode();
  
  // Remover slash inicial si existe para normalizar
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  
  if (isDev) {
    // En desarrollo, usar ruta directa
    return `/${normalizedPath}`;
  } else {
    // En producción, usar ruta con base path
    return `/Medicion-del-Servicio/${normalizedPath}`;
  }
};

// Función para detectar el modo de desarrollo
const detectDevelopmentMode = (): boolean => {
  try {
    // Método 1: import.meta.env
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env.MODE === 'development' || (import.meta as any).env.DEV === true;
    }
    
    // Método 2: hostname
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }
    
    // Método 3: puerto de desarrollo
    if (typeof window !== 'undefined') {
      return window.location.port === '5173' || window.location.port === '3000';
    }
    
    return false;
  } catch (error) {
    console.warn('Error detecting development mode:', error);
    return false;
  }
};

// Rutas específicas de imágenes
export const IMAGES = {
  logo: getAssetPath('images/logo.jpg'),
  coltefinanciera: getAssetPath('images/Coltefinanciera.png'),
} as const;