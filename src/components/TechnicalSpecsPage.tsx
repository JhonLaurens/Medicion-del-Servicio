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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
                <div className="loading-skeleton w-48 h-6 rounded mx-auto mb-2"></div>
                <div className="loading-skeleton w-32 h-4 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent px-8 py-8">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-4xl font-bold mb-3">Ficha Técnica y Metodológica</h1>
                <p className="text-brand-light text-lg">Especificaciones completas del estudio de medición del servicio</p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl">📋</div>
                    <div className="text-sm text-brand-light mt-2">Metodología</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="metric-card-executive bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{technicalInfo.universoTotal.toLocaleString()}</div>
                  <div className="text-sm font-medium text-blue-800">Universo Total</div>
                  <div className="text-xs text-blue-600 mt-1">clientes</div>
                </div>
              </div>

              <div className="metric-card-executive bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{technicalInfo.totalEncuestados.toLocaleString()}</div>
                  <div className="text-sm font-medium text-green-800">Total Encuestados</div>
                  <div className="text-xs text-green-600 mt-1">respuestas válidas</div>
                </div>
              </div>

              <div className="metric-card-executive bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{technicalInfo.porcentajeRespuesta}%</div>
                  <div className="text-sm font-medium text-amber-800">Tasa de Respuesta</div>
                  <div className="text-xs text-amber-600 mt-1">participación</div>
                </div>
              </div>

              <div className="metric-card-executive bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{technicalInfo.nivelConfianza}</div>
                  <div className="text-sm font-medium text-purple-800">Nivel de Confianza</div>
                  <div className="text-xs text-purple-600 mt-1">estadístico</div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Objective and Details */}
              <div className="space-y-6">
                <div className="chart-container-premium">
                  <div className="border-l-4 border-brand-primary pl-6 mb-6">
                    <h3 className="section-header text-xl font-bold text-gray-800 mb-3">Objetivo General</h3>
                    <p className="text-gray-600 leading-relaxed">{technicalInfo.objetivoGeneral}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 mb-4">Detalles del Estudio</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <span className="text-gray-700 font-medium">Margen de Error</span>
                        <span className="text-gray-800 font-bold">{technicalInfo.margenError}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                        <span className="text-gray-700 font-medium">Período de Campo</span>
                        <span className="text-gray-800 font-bold">{technicalInfo.periodoCampo}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                        <span className="text-gray-700 font-medium">Método de Recolección</span>
                        <span className="text-gray-800 font-bold">{technicalInfo.metodoRecoleccion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Methodology and Approach */}
              <div className="chart-container-premium">
                <h3 className="section-header text-xl font-bold text-gray-800 mb-6">Metodología</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Diseño del Estudio</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Estudio cuantitativo de satisfacción del cliente mediante encuesta estructurada digital.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Segmentación</h4>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Análisis diferenciado por segmentos: Personas Naturales y Empresariales.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">Escalas de Medición</h4>
                    <p className="text-purple-700 text-sm leading-relaxed">
                      Escala Likert de 5 puntos (1=Muy Insatisfecho, 5=Muy Satisfecho).
                    </p>
                  </div>
                </div>

                {/* Quality Indicators */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm border">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">✓</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Representatividad</h4>
                    <p className="text-xs text-gray-600">Muestra representativa de ambos segmentos</p>
                  </div>
                  
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm border">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Confiabilidad</h4>
                    <p className="text-xs text-gray-600">95% de nivel de confianza estadística</p>
                  </div>
                  
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm border">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Precisión</h4>
                    <p className="text-xs text-gray-600">Margen de error estadístico aceptable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          <h3 className="section-header text-2xl font-bold text-gray-800 mb-8 text-center">
            Especificaciones Técnicas Adicionales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-3">Población Objetivo</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Clientes activos de Coltefinanciera en los segmentos Personas Naturales y Empresariales
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-3">Instrumento</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cuestionario estructurado con preguntas sobre satisfacción, lealtad, recomendación y claridad
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-3">Procesamiento</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Análisis estadístico avanzado con segmentación automática y cálculo de indicadores
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Nota Metodológica:</strong> Este estudio fue diseñado siguiendo las mejores prácticas en investigación de mercados 
                y satisfacción del cliente, garantizando la validez y confiabilidad de los resultados obtenidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecsPage;
