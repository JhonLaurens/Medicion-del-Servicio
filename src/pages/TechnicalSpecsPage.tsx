import React from 'react';
import { TechnicalInfo } from '../types';

interface TechnicalSpecsPageProps {
  technicalInfo: TechnicalInfo;
}

const TechnicalSpecsPage: React.FC<TechnicalSpecsPageProps> = ({ technicalInfo }) => {
  // Validación de seguridad
  if (!technicalInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Información técnica no disponible</h2>
            <p className="text-yellow-700 mb-4">
              Los datos técnicos del estudio no están disponibles en este momento.
            </p>
            <p className="text-sm text-yellow-600">
              Por favor, intenta recargar la página o contacta al administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ficha Técnica y Metodológica
          </h1>
          <p className="text-gray-600">
            Especificaciones técnicas y metodológicas del estudio de satisfacción
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Universo Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {technicalInfo.universoTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Respuestas Válidas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {technicalInfo.totalEncuestados.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasa de Respuesta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {technicalInfo.porcentajeRespuesta}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">🎯</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Nivel de Confianza</p>
                <p className="text-2xl font-bold text-gray-900">
                  {technicalInfo.nivelConfianza}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nueva sección: Universo Depurado */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="mr-2">🔍</span>
              Universo Depurado
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                  <span className="mr-2">📋</span> Definición
                </h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  El universo depurado corresponde a la población objetivo total de {technicalInfo.universoTotal.toLocaleString()} 
                  individuos de los segmentos Personas y Empresas de Coltefinanciera, después de aplicar los criterios 
                  de elegibilidad y filtros metodológicos.
                </p>
              </div>
              
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                  <span className="mr-2">📊</span> Composición
                </h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  De este universo depurado se obtuvieron {technicalInfo.totalEncuestados.toLocaleString()} respuestas válidas, 
                  representando una tasa de respuesta del {technicalInfo.porcentajeRespuesta}% con un margen de error de ±{technicalInfo.margenError}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Objetivo General */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-teal-600 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🎯</span>
                Objetivo General
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {technicalInfo.objetivoGeneral}
              </p>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">⚙️</span>
                Especificaciones Técnicas
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                  <span className="mr-2">📋</span> Método de Recolección
                </h4>
                <p className="text-sm text-blue-700">
                  {technicalInfo.metodoRecoleccion}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                  <span className="mr-2">📅</span> Período de Campo
                </h4>
                <p className="text-sm text-blue-700">
                  {technicalInfo.periodoCampo}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                  <span className="mr-2">⚡</span> Universo Depurado
                </h4>
                <p className="text-sm text-blue-700">
                  {technicalInfo.universoTotal.toLocaleString()} individuos de los segmentos Personas y Empresas, 
                  después de aplicar criterios de elegibilidad y filtros metodológicos
                </p>
              </div>

              {technicalInfo.notaMetodologica && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-1 flex items-center">
                    <span className="mr-2">📝</span> Nota Metodológica
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {technicalInfo.notaMetodologica}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Métricas Evaluadas - Horizontal at bottom */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-green-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="mr-2">📊</span>
              Métricas Evaluadas
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {technicalInfo.metricasEvaluadas.map((metrica, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <h4 className="font-semibold text-green-800 text-sm">
                    {metrica}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecsPage;