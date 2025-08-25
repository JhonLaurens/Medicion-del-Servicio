import React, { useEffect, useState, useMemo, useCallback, memo, lazy, Suspense } from 'react';
import { satisfactionDataService } from '../services/dataService';
import { KPIData } from '../types';
import { SURVEY_INFO } from '../data/questionsMap';

// Lazy loading para gráficos pesados
const LazyBarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const LazyPieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
const LazyResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));
const LazyBar = lazy(() => import('recharts').then(module => ({ default: module.Bar })));
const LazyPie = lazy(() => import('recharts').then(module => ({ default: module.Pie })));
const LazyCell = lazy(() => import('recharts').then(module => ({ default: module.Cell })));
const LazyXAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const LazyYAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const LazyCartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const LazyTooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));
const LazyLegend = lazy(() => import('recharts').then(module => ({ default: module.Legend })));

// Importar componentes memoizados
import { useSegmentAnalysis } from '../hooks/useSegmentAnalysis';
import MetricsCards from './SegmentAnalysis/MetricsCards';
import DistributionCharts from './SegmentAnalysis/DistributionCharts';
import ComparisonChart from './SegmentAnalysis/ComparisonChart';
import ExecutiveSummary from './SegmentAnalysis/ExecutiveSummary';

const SegmentAnalysis: React.FC = memo(() => {
  const {
    kpiData,
    isLoading,
    hasValidData,
    overallStats,
    distributionData,
    chartData
  } = useSegmentAnalysis();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando análisis por segmentos...</p>
            </div>
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
            📊 Análisis por Segmentos
          </h1>
          <p className="text-gray-600">
            Comparación detallada de satisfacción entre segmentos Personas y Empresarial
          </p>
        </div>

        {/* Resumen Ejecutivo */}
        <ExecutiveSummary 
          personasStats={overallStats.personasStats}
          empresasStats={overallStats.empresasStats}
          hasValidData={hasValidData} 
        />

        {/* Tarjetas de Métricas */}
        <MetricsCards 
          kpiData={kpiData} 
          hasValidData={hasValidData} 
        />

        {/* Gráficos de Distribución */}
        <DistributionCharts 
          personasData={distributionData.personasData}
          empresasData={distributionData.empresasData}
          personasTotal={distributionData.personasTotal}
          empresasTotal={distributionData.empresasTotal}
          hasValidData={hasValidData}
        />

        {/* Gráfico de Comparación */}
        <ComparisonChart 
          chartData={chartData} 
          hasValidData={hasValidData} 
        />

        {/* Información del Estudio */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del Estudio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Metodología</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Escala:</strong> 1-5 (1=Muy Insatisfecho, 5=Muy Satisfecho)</p>
                <p><strong>Segmentos:</strong> Personas Naturales vs. Empresariales</p>
                <p><strong>Período:</strong> {SURVEY_INFO.period}</p>
                <p><strong>Universo:</strong> {SURVEY_INFO.universeTotal.toLocaleString()} clientes</p>
                {SURVEY_INFO.measurementPeriods && (
                  <p><strong>Períodos de Medición:</strong> {SURVEY_INFO.measurementPeriods}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Interpretación de Colores</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  <span>Excelente (5) - Satisfacción óptima</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span>Bueno (4) - Satisfacción alta</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span>Necesita Mejora (1-3) - Oportunidad</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📊 Ficha Técnica del Estudio</h4>
              <p className="text-sm text-blue-700">
                Periodo: {SURVEY_INFO.period} • Respuestas válidas: {SURVEY_INFO.sampleSize.toLocaleString()}
              </p>
              <p className="mt-1">
                Universo: {SURVEY_INFO.universeTotal.toLocaleString()} • Tasa de respuesta: {SURVEY_INFO.responseRate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SegmentAnalysis.displayName = 'SegmentAnalysis';

export default SegmentAnalysis;
