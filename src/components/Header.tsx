import React, { useState, useEffect } from "react";

interface HeaderProps {
  currentPage?: string;
  onNavigateHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigateHome }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Precargar la imagen del logo
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = "/Medicion-del-Servicio/images/Coltefinanciera.png";

    // Actualizar la hora cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleHomeNavigation = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      console.warn('⚠️ Header: Home navigation handler not provided');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getPageTitle = (page?: string) => {
    const titles: Record<string, string> = {
      'dashboard-general': 'Dashboard General',
      'analisis-geografico': 'Análisis Geográfico',
      'participacion-gerentes': 'Participación Gerentes',
      'analisis-segmento': 'Análisis por Segmentos',
      'analisis-sugerencias': 'Análisis de Sugerencias',
      'explorador-datos': 'Explorador de Datos',
      'home': 'Inicio'
    };
    return titles[page || 'home'] || 'Analytics Platform';
  };

  return (
    <header className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent shadow-2xl border-b-4 border-brand-accent relative overflow-hidden">
      {/* Pattern overlay for premium feel */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-10 pattern-dots"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left section - Logo and System Title */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              onClick={handleHomeNavigation}
              className="bg-white p-2 sm:p-3 rounded-xl shadow-lg ring-2 ring-white/20 backdrop-blur-sm hover:ring-white/40 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Ir al inicio"
            >
              {imageError ? (
                <div className="h-8 sm:h-12 w-8 sm:w-12 bg-brand-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">CF</span>
                </div>
              ) : (
                <img
                  src="/Medicion-del-Servicio/images/Coltefinanciera.png"
                  alt="Logo Coltefinanciera"
                  className={`h-8 sm:h-12 w-auto object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </button>
            <div className="space-y-1">
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                {getPageTitle(currentPage)}
              </h1>
              <p className="text-brand-light text-xs sm:text-sm font-medium tracking-wide">
                Sistema de Medición del Servicio
              </p>
              <div className="hidden sm:flex items-center space-x-2 text-xs text-brand-light/80">
                <span aria-hidden="true">📊</span>
                <span>Dashboard Ejecutivo</span>
                <span aria-hidden="true">•</span>
                <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full font-semibold">
                  En Tiempo Real
                </span>
              </div>
            </div>
          </div>

          {/* Right section - Analytics badge and status */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile status indicator */}
            <div className="flex sm:hidden flex-col items-end">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-white text-xs font-medium">Activo</span>
              </div>
              <div className="text-xs text-brand-light">
                {formatTime(currentTime)}
              </div>
            </div>

            {/* Desktop analytics badge */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-white/20 shadow-lg">
                <div className="text-center">
                  <h2 className="text-sm sm:text-lg font-bold text-white mb-1">
                    Customer Analytics
                  </h2>
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-brand-light text-xs">
                    <div className="text-center">
                      <div className="font-bold text-white text-sm sm:text-base">1,445</div>
                      <div className="text-xs">Respuestas</div>
                    </div>
                    <div className="w-px h-6 sm:h-8 bg-white/20"></div>
                    <div className="text-center">
                      <div className="font-bold text-white text-sm sm:text-base">95%</div>
                      <div className="text-xs">Confianza</div>
                    </div>
                    <div className="w-px h-6 sm:h-8 bg-white/20"></div>
                    <div className="text-center">
                      <div className="font-bold text-white text-sm sm:text-base">2.5%</div>
                      <div className="text-xs">Error</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop status indicator */}
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-white text-sm font-medium">
                    Sistema Activo
                  </span>
                </div>
                <div className="text-xs text-brand-light text-center">
                  <div>Última actualización: Hoy</div>
                  <div>{formatTime(currentTime)}</div>
                </div>
              </div>
            </div>

            {/* Tablet analytics badge */}
            <div className="hidden md:flex lg:hidden bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 shadow-lg">
              <div className="text-center">
                <div className="flex items-center space-x-3 text-brand-light text-xs">
                  <div className="text-center">
                    <div className="font-bold text-white text-sm">1,445</div>
                    <div className="text-xs">Respuestas</div>
                  </div>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm">95%</div>
                    <div className="text-xs">Confianza</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile page indicator */}
        <div className="sm:hidden mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-brand-light">
            <span>Dashboard Ejecutivo</span>
            <div className="flex items-center space-x-2">
              <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full font-semibold">
                En Tiempo Real
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
