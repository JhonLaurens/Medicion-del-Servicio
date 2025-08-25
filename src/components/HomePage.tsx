import React, { useState, useEffect } from "react";
import OptimizedImage from './OptimizedImage';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Precargar la imagen del logo
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = "/Medicion-del-Servicio/images/logo.jpg";
  }, []);

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      console.warn('⚠️ HomePage: Navigation handler not provided');
    }
  };

  const navigationButtons = [
    {
      id: "dashboard-general",
      icon: "📊",
      title: "Dashboard General",
      description: "Métricas principales",
      className: "bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer",
      ariaLabel: "Ir al Dashboard General con métricas principales"
    },
    {
      id: "analisis-geografico",
      icon: "🗺️",
      title: "Análisis Geográfico",
      description: "Por regiones",
      className: "bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer",
      ariaLabel: "Ir al Análisis Geográfico por regiones"
    },
    {
      id: "participacion-gerentes",
      icon: "👨‍💼",
      title: "Participación Gerentes",
      description: "✨ NUEVO",
      className: "bg-gradient-to-br from-yellow-400/25 to-orange-500/25 backdrop-blur-md rounded-xl p-5 border border-yellow-300/40 hover:from-yellow-400/35 hover:to-orange-500/35 hover:border-yellow-300/60 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer",
      ariaLabel: "Ir a Participación de Gerentes - Nueva funcionalidad",
      isNew: true
    },
    {
      id: "analisis-segmento",
      icon: "👥",
      title: "Análisis Segmentos",
      description: "Personas vs Empresas",
      className: "bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer",
      ariaLabel: "Ir al Análisis por Segmentos - Personas vs Empresas"
    },
    {
      id: "analisis-sugerencias",
      icon: "💡",
      title: "Sugerencias",
      description: "Insights del cliente",
      className: "bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer",
      ariaLabel: "Ir al Análisis de Sugerencias e insights del cliente"
    },
    {
      id: "explorador-datos",
      icon: "🔍",
      title: "Explorador",
      description: "Datos detallados",
      className: "bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer",
      ariaLabel: "Ir al Explorador de datos detallados"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0 grid-pattern"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 pb-64 text-center">
        {/* Corporate Header Section */}
        <header className="mb-12 animate-slide-in-top">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl mb-8">
            <OptimizedImage
              src="/images/logo.jpg"
              alt="Logo Coltefinanciera"
              className="w-28 h-28 object-contain mx-auto rounded-xl shadow-2xl border-4 border-white/20"
              fallbackSrc="/images/Coltefinanciera.png"
              enableLazyLoading={false}
              enableCache={true}
              showLoadingSpinner={true}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        </header>

        {/* Main title with enhanced typography */}
        <div className="max-w-5xl mx-auto mb-16 animate-scale-in">
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Resultados Medición
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent">
                del Servicio
              </span>
            </h1>

            {/* Corporate badge */}
            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-8 bg-yellow-400 text-blue-900 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg transform rotate-12">
              2024-2025
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light mb-6 text-blue-100">
              Coltefinanciera
            </h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg">
              <p className="text-lg sm:text-xl md:text-2xl text-blue-200 font-medium leading-relaxed">
                Gerencia del Talento Humano y Servicio al Cliente
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-blue-200">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></span>
                  <span>Análisis en Tiempo Real</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Dashboard Ejecutivo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced metrics badges */}
        <section className="mb-16 animate-fadeIn delay-500" aria-labelledby="study-characteristics">
          <h3 id="study-characteristics" className="text-lg font-semibold mb-6 text-blue-200">
            Características del Estudio
          </h3>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-6 sm:px-8 py-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                  1,445
                </div>
                <div className="text-sm font-medium text-blue-200">
                  Encuestados
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-6 sm:px-8 py-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                  95%
                </div>
                <div className="text-sm font-medium text-blue-200">
                  Nivel de Confianza
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-6 sm:px-8 py-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                  2.50%
                </div>
                <div className="text-sm font-medium text-blue-200">
                  Margen de Error
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="space-y-6 animate-fadeIn delay-700 mb-24">
          <p className="text-lg sm:text-xl text-blue-100 font-light">
            Sistema integral de análisis de satisfacción del cliente
          </p>
          <button
            onClick={() => handleNavigation("dashboard-general")}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer inline-block focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            aria-label="Explorar Dashboard General"
          >
            Explorar Dashboard
          </button>
        </section>
      </div>

      {/* Enhanced building silhouette with corporate skyline */}
      <div className="absolute bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-blue-900 to-transparent z-5 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute bottom-0 w-full h-full opacity-60"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          role="img"
          aria-label="Silueta decorativa de edificios corporativos"
        >
          <polygon
            fill="rgba(255,255,255,0.1)"
            points="0,200 0,120 80,100 120,90 180,110 240,85 300,95 360,75 420,90 480,70 540,85 600,95 660,80 720,100 780,85 840,95 900,75 960,90 1020,80 1080,100 1140,85 1200,90 1200,200"
          />
          <polygon
            fill="rgba(255,255,255,0.05)"
            points="0,200 0,140 60,125 100,130 160,115 220,125 280,110 340,120 400,105 460,115 520,100 580,110 640,120 700,105 760,115 820,100 880,110 940,95 1000,105 1060,90 1120,100 1180,95 1200,100 1200,200"
          />
        </svg>
      </div>

      {/* Features grid - enhanced visibility and spacing */}
      <nav className="absolute bottom-0 left-0 right-0 z-15 bg-gradient-to-t from-blue-900 via-blue-900/98 to-blue-900/80 pt-8 pb-6 px-4 sm:px-8" aria-label="Navegación principal">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
            {navigationButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleNavigation(button.id)}
                className={button.className}
                aria-label={button.ariaLabel}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigation(button.id);
                  }
                }}
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
                  {button.icon}
                </div>
                <div className={`text-xs sm:text-sm font-semibold mb-1 ${button.isNew ? 'text-yellow-100' : 'text-white'}`}>
                  {button.title}
                </div>
                {button.isNew ? (
                  <div className="inline-block bg-yellow-400/80 text-blue-900 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                    {button.description}
                  </div>
                ) : (
                  <div className="text-xs text-blue-200">{button.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;
