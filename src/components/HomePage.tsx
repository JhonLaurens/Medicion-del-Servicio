import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Logo placeholder */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-4xl font-bold text-white">C</span>
          </div>
        </div>

        {/* Main title */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Resultados Medición del Servicio
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-blue-100">
            Coltefinanciera
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-200 mb-12 font-light">
            Gerencia del Talento Humano y Servicio al Cliente
          </p>
        </div>

        {/* Year badge */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-8 py-3 mb-8">
          <span className="text-2xl font-semibold">2024</span>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <p className="text-lg text-blue-100">
            Análisis completo de satisfacción del cliente
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-sm font-medium">1,445 Encuestados</span>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-sm font-medium">Nivel de Confianza 95%</span>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-sm font-medium">Margen de Error 0.48%</span>
            </div>
          </div>
        </div>

        {/* Navigation hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <p className="text-sm text-blue-200 mb-2">Explora los resultados</p>
            <div className="w-6 h-6 border-2 border-blue-200 rounded-full mx-auto flex items-center justify-center">
              <span className="text-blue-200">↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Building silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900 to-transparent">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <polygon
            fill="rgba(255,255,255,0.1)"
            points="0,200 0,100 100,80 200,90 300,70 400,85 500,75 600,95 700,65 800,85 900,75 1000,90 1100,80 1200,85 1200,200"
          />
        </svg>
      </div>

      {/* Características principales */}
      <div className="mt-16 w-full max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold mb-8 text-center">Características del Análisis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard General */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all">
            <div className="text-3xl mb-4">📊</div>
            <h4 className="text-lg font-semibold mb-2">Dashboard General</h4>
            <p className="text-blue-100 text-sm">Visualización completa de KPIs y métricas principales de satisfacción.</p>
          </div>

          {/* Análisis Geográfico */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all">
            <div className="text-3xl mb-4">🗺️</div>
            <h4 className="text-lg font-semibold mb-2">Análisis Geográfico</h4>
            <p className="text-blue-100 text-sm">Distribución de satisfacción por regiones y departamentos.</p>
          </div>

          {/* Participación de Gerentes - NUEVO */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-opacity-20 backdrop-blur-sm rounded-lg p-6 hover:from-yellow-300 hover:to-orange-400 transition-all border-2 border-yellow-300 border-opacity-50">
            <div className="text-3xl mb-4">👨‍💼</div>
            <h4 className="text-lg font-semibold mb-2">Participación de Gerentes ✨</h4>
            <p className="text-white text-sm font-medium">Análisis detallado de participación y cobertura por gerente. ¡NUEVO!</p>
          </div>

          {/* Análisis por Segmentos */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all">
            <div className="text-3xl mb-4">👥</div>
            <h4 className="text-lg font-semibold mb-2">Análisis por Segmentos</h4>
            <p className="text-blue-100 text-sm">Segmentación por edad, género y tipo de cliente.</p>
          </div>

          {/* Análisis de Sugerencias */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all">
            <div className="text-3xl mb-4">💡</div>
            <h4 className="text-lg font-semibold mb-2">Análisis de Sugerencias</h4>
            <p className="text-blue-100 text-sm">Categorización y análisis de comentarios y sugerencias.</p>
          </div>

          {/* Explorador de Datos */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all">
            <div className="text-3xl mb-4">🔍</div>
            <h4 className="text-lg font-semibold mb-2">Explorador de Datos</h4>
            <p className="text-blue-100 text-sm">Herramienta interactiva para exploración detallada de datos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
