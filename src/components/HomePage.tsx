import React from 'react';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 grid-pattern">
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-8 pb-64 text-center">
        {/* Corporate Header Section */}
        <div className="mb-12 animate-slide-in-top">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl mb-8">
            <img 
              src="/images/logo.jpg" 
              alt="Logo Coltefinanciera" 
              className="w-28 h-28 object-contain mx-auto rounded-xl shadow-2xl border-4 border-white/20"
            />
          </div>
        </div>

        {/* Main title with enhanced typography */}
        <div className="max-w-5xl mx-auto mb-16 animate-scale-in">
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                Resultados Medición
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent">
                del Servicio
              </span>
            </h1>
            
            {/* Corporate badge */}
            <div className="absolute -top-6 -right-8 bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg transform rotate-12">
              2024-2025
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-blue-100">
              Coltefinanciera
            </h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
              <p className="text-xl md:text-2xl text-blue-200 font-medium leading-relaxed">
                Gerencia del Talento Humano y Servicio al Cliente
              </p>
              <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-blue-200">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Análisis en Tiempo Real</span>
                </span>
                <span>•</span>
                <span>Dashboard Ejecutivo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced metrics badges */}
        <div className="mb-16 animate-fadeIn delay-500">
          <h3 className="text-lg font-semibold mb-6 text-blue-200">Características del Estudio</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">1,445</div>
                <div className="text-sm font-medium text-blue-200">Encuestados</div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">95%</div>
                <div className="text-sm font-medium text-blue-200">Nivel de Confianza</div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">2.50%</div>
                <div className="text-sm font-medium text-blue-200">Margen de Error</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="space-y-6 animate-fadeIn delay-700 mb-24">
          <p className="text-xl text-blue-100 font-light">
            Sistema integral de análisis de satisfacción del cliente
          </p>
          <button 
            onClick={() => onNavigate?.('dashboard-general')}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer inline-block"
          >
            Explorar Dashboard
          </button>
        </div>
      </div>

      {/* Enhanced building silhouette with corporate skyline */}
      <div className="absolute bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-blue-900 to-transparent z-5 pointer-events-none">
        <svg className="absolute bottom-0 w-full h-full opacity-60" viewBox="0 0 1200 200" preserveAspectRatio="none">
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
      <div className="absolute bottom-0 left-0 right-0 z-15 bg-gradient-to-t from-blue-900 via-blue-900/98 to-blue-900/80 pt-8 pb-6 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Dashboard General */}
            <button 
              onClick={() => onNavigate?.('dashboard-general')}
              className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <div className="text-sm font-semibold text-white mb-1">Dashboard General</div>
              <div className="text-xs text-blue-200">Métricas principales</div>
            </button>

            {/* Análisis Geográfico */}
            <button 
              onClick={() => onNavigate?.('analisis-geografico')}
              className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🗺️</div>
              <div className="text-sm font-semibold text-white mb-1">Análisis Geográfico</div>
              <div className="text-xs text-blue-200">Por regiones</div>
            </button>

            {/* Participación de Gerentes */}
            <button 
              onClick={() => onNavigate?.('participacion-gerentes')}
              className="bg-gradient-to-br from-yellow-400/25 to-orange-500/25 backdrop-blur-md rounded-xl p-5 border border-yellow-300/40 hover:from-yellow-400/35 hover:to-orange-500/35 hover:border-yellow-300/60 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👨‍💼</div>
              <div className="text-sm font-semibold text-yellow-100 mb-1">Participación Gerentes</div>
              <div className="inline-block bg-yellow-400/80 text-blue-900 px-2 py-1 rounded-full text-xs font-bold shadow-sm">✨ NUEVO</div>
            </button>

            {/* Análisis por Segmentos */}
            <button 
              onClick={() => onNavigate?.('analisis-segmento')}
              className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
              <div className="text-sm font-semibold text-white mb-1">Análisis Segmentos</div>
              <div className="text-xs text-blue-200">Personas vs Empresas</div>
            </button>

            {/* Análisis de Sugerencias */}
            <button 
              onClick={() => onNavigate?.('analisis-sugerencias')}
              className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💡</div>
              <div className="text-sm font-semibold text-white mb-1">Sugerencias</div>
              <div className="text-xs text-blue-200">Insights del cliente</div>
            </button>

            {/* Explorador de Datos */}
            <button 
              onClick={() => onNavigate?.('explorador-datos')}
              className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔍</div>
              <div className="text-sm font-semibold text-white mb-1">Explorador</div>
              <div className="text-xs text-blue-200">Datos detallados</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
