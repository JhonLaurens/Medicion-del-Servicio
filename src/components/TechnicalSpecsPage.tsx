import React, { useEffect, useState } from 'react';
import { satisfactionDataService } from '../services/dataService';
import { TechnicalInfo } from '../types';

const TechnicalSpecsPage: React.FC = () => {
  const [technicalInfo, setTechnicalInfo] = useState<TechnicalInfo | null>(null);

  useEffect(() => {
    const loadTechnicalInfo = async () => {
      await satisfactionDataService.loadData();
      setTechnicalInfo(satisfactionDataService.getTechnicalInfo());
    };

    loadTechnicalInfo();
  }, []);

  if (!technicalInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <h1 className="text-3xl font-bold mb-2">Ficha Técnica y Metodológica</h1>
          <p className="text-blue-100">Detalles del estudio de medición del servicio</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Main specifications */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Objetivo General</h3>
                <p className="text-gray-600 leading-relaxed">{technicalInfo.objetivoGeneral}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Universo Total</h4>
                  <p className="text-2xl font-bold text-blue-600">{technicalInfo.universoTotal.toLocaleString()}</p>
                  <p className="text-xs text-blue-500">clientes</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Total Encuestados</h4>
                  <p className="text-2xl font-bold text-green-600">{technicalInfo.totalEncuestados.toLocaleString()}</p>
                  <p className="text-xs text-green-500">respuestas</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-800 mb-1">% de Respuesta</h4>
                  <p className="text-2xl font-bold text-amber-600">{technicalInfo.porcentajeRespuesta}%</p>
                  <p className="text-xs text-amber-500">tasa de respuesta</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-purple-800 mb-1">Nivel de Confianza</h4>
                  <p className="text-2xl font-bold text-purple-600">{technicalInfo.nivelConfianza}</p>
                  <p className="text-xs text-purple-500">estadístico</p>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalles del Estudio</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Margen de Error</span>
                    <span className="text-gray-800 font-semibold">{technicalInfo.margenError}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Período de Campo</span>
                    <span className="text-gray-800 font-semibold">{technicalInfo.periodoCampo}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Método de Recolección</span>
                    <span className="text-gray-800 font-semibold">{technicalInfo.metodoRecoleccion}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Métricas Evaluadas</h3>
                <div className="space-y-3">
                  {technicalInfo.metricasEvaluadas.map((metrica, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{metrica}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quality indicators */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Indicadores de Calidad del Estudio</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Representatividad</h4>
                <p className="text-sm text-gray-600">Muestra representativa de ambos segmentos</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Confiabilidad</h4>
                <p className="text-sm text-gray-600">95% de nivel de confianza estadística</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Precisión</h4>
                <p className="text-sm text-gray-600">Margen de error menor al 0.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecsPage;
