import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell, PieChart, Pie } from 'recharts';
import { satisfactionDataService } from '../services/dataService';
import { KPIData } from '../types';
import TooltipPregunta from './TooltipPregunta';
import { getQuestionByDisplayName, SURVEY_INFO } from '../data/questionsMap';

const SegmentAnalysis: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await satisfactionDataService.loadData();
        const data = satisfactionDataService.getKPIData();
        
        // Ordenar métricas en orden jerárquico consistente
        const orderedData = [
          data.find(kpi => kpi.metric === 'Satisfacción General'),
          data.find(kpi => kpi.metric === 'Lealtad'),
          data.find(kpi => kpi.metric === 'Recomendación'),
          data.find(kpi => kpi.metric === 'Claridad de la Información (Atención)')
        ].filter(Boolean) as KPIData[];
        
        setKpiData(orderedData);
      } catch (error) {
        console.error('Error loading segment analysis data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Paleta de colores mejorada y consistente con la marca
  const colors = {
    rating5: '#059669',      // Verde corporativo - Excelente
    rating4: '#0891b2',      // Azul corporativo - Bueno  
    rating123: '#dc2626',    // Rojo corporativo - Necesita mejora
    personas: '#1a5f7a',     // Azul marca - Segmento Personas
    empresas: '#2c8aa6',     // Azul claro marca - Segmento Empresas
    neutral: '#6b7280',      // Gris - Neutral
    gradient: {
      excellent: ['#059669', '#10b981'],
      good: ['#0891b2', '#06b6d4'],
      needs: ['#dc2626', '#ef4444'],
      brand: ['#1a5f7a', '#2c8aa6', '#57a3c4']
    }
  };

  // Análisis automático de brechas entre segmentos
  const calculateInsights = (data: KPIData[]) => {
    const insights = data.map(kpi => {
      const personasAvg = typeof kpi.personas?.average === 'number' ? kpi.personas.average : 0;
      const empresarialAvg = typeof kpi.empresarial?.average === 'number' ? kpi.empresarial.average : 0;
      const gap = Math.abs(personasAvg - empresarialAvg);
      const leader = personasAvg > empresarialAvg ? 'Personas' : empresarialAvg > personasAvg ? 'Empresas' : 'Empate';
      
      return {
        metric: kpi.metric,
        gap,
        leader,
        personasAvg,
        empresarialAvg,
        significance: gap > 0.5 ? 'Alta' : gap > 0.2 ? 'Media' : 'Baja'
      };
    });
    
    return insights.sort((a, b) => b.gap - a.gap);
  };

  // Preparar datos para gráfico comparativo mejorado (Dumbbell-style)
  const prepareDumbbellData = () => {
    if (!hasValidData) return [];

    return kpiData.map((kpi, index) => {
      const personasAvg = Math.max(0, Math.min(5, typeof kpi.personas?.average === 'number' ? kpi.personas.average : 0));
      const empresasAvg = Math.max(0, Math.min(5, typeof kpi.empresarial?.average === 'number' ? kpi.empresarial.average : 0));
      
      return {
        name: kpi.metric.length > 25 ? kpi.metric.substring(0, 25) + '...' : kpi.metric,
        fullName: kpi.metric,
        personas: personasAvg,
        empresas: empresasAvg,
        min: Math.min(personasAvg, empresasAvg),
        max: Math.max(personasAvg, empresasAvg),
        gap: Math.abs(personasAvg - empresasAvg),
        hasData: personasAvg > 0 || empresasAvg > 0
      };
    }).filter(item => item.hasData);
  };

  // Preparar datos para distribución de calificaciones
  const prepareDistributionData = () => {
    if (!hasValidData) return [];

    // Obtener datos agregados de todas las métricas
    const personasData = kpiData.reduce((acc, kpi) => {
      acc.rating5 += kpi.personas?.rating5 || 0;
      acc.rating4 += kpi.personas?.rating4 || 0;
      acc.rating123 += kpi.personas?.rating123 || 0;
      return acc;
    }, { rating5: 0, rating4: 0, rating123: 0 });

    const empresasData = kpiData.reduce((acc, kpi) => {
      acc.rating5 += kpi.empresarial?.rating5 || 0;
      acc.rating4 += kpi.empresarial?.rating4 || 0;
      acc.rating123 += kpi.empresarial?.rating123 || 0;
      return acc;
    }, { rating5: 0, rating4: 0, rating123: 0 });

    // Normalizar por número de métricas
    const numMetrics = kpiData.length;
    
    return [
      {
        rating: 'Excelente (5)',
        personas: Math.round((personasData.rating5 / numMetrics) * 10) / 10,
        empresas: Math.round((empresasData.rating5 / numMetrics) * 10) / 10,
        fill: colors.rating5
      },
      {
        rating: 'Bueno (4)',
        personas: Math.round((personasData.rating4 / numMetrics) * 10) / 10,
        empresas: Math.round((empresasData.rating4 / numMetrics) * 10) / 10,
        fill: colors.rating4
      },
      {
        rating: 'Necesita Mejora (1-3)',
        personas: Math.round((personasData.rating123 / numMetrics) * 10) / 10,
        empresas: Math.round((empresasData.rating123 / numMetrics) * 10) / 10,
        fill: colors.rating123
      }
    ];
  };

  // Preparar datos para línea de tendencias comparativas
  const prepareComparisonData = () => {
    return prepareDumbbellData();
  };

  // Tooltip mejorado para gráficos comparativos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-gray-200 rounded-xl shadow-2xl w-80 relative z-50 max-w-xs">
          <p className="font-bold text-gray-800 mb-3 text-center border-b pb-2">{label}</p>
          
          <div className="space-y-3 mb-3">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <span 
                    className="w-4 h-4 rounded-full mr-3 border-2 border-white shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                </div>
                <span className="font-bold text-lg" style={{ color: entry.color }}>
                  {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                </span>
              </div>
            ))}
          </div>
          
          {payload[0]?.payload?.gap && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 text-center border border-blue-200">
              <p className="text-sm text-gray-700 mb-1">Diferencia entre segmentos</p>
              <p className="text-lg font-bold text-gray-800">
                {payload[0].payload.gap.toFixed(2)} puntos
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {payload[0].payload.gap > 0.5 ? 'Brecha significativa' : 
                 payload[0].payload.gap > 0.2 ? 'Brecha moderada' : 'Brecha mínima'}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Componente para mostrar cuando no hay datos
  const NoDataMessage = ({ title }: { title: string }) => (
    <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
      <div className="text-gray-400 text-4xl mb-4">📊</div>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">No hay datos disponibles para mostrar en este momento</p>
    </div>
  );

  // Validación de datos
  const hasValidData = kpiData && kpiData.length > 0;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Análisis Comparativo por Segmento</h1>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <strong>Cargando...</strong> Preparando análisis comparativo de segmentos...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasValidData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Análisis Comparativo por Segmento</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Sin datos:</strong> No se encontraron datos para realizar el análisis comparativo.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const insights = calculateInsights(kpiData);
  const comparisonData = prepareComparisonData();
  const distributionData = prepareDistributionData();
  const dumbbellData = prepareDumbbellData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        
        {/* Header Profesional Mejorado */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header con gradiente corporativo */}
          <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-4xl font-bold mb-2">Análisis Comparativo por Segmento</h1>
                <p className="text-brand-light text-lg font-medium">
                  Comparación detallada de satisfacción entre segmentos Personas y Empresas
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{kpiData.length}</div>
                    <div className="text-sm text-brand-light">Métricas Analizadas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contenido del header */}
          <div className="p-8">
            {/* Nota sobre muestra empresarial - Diseño mejorado */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-2 rounded-full">
                  <span className="text-amber-600 text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-800 mb-2">Consideración Metodológica</h3>
                  <p className="text-amber-700 leading-relaxed">
                    <strong>Segmento Empresarial:</strong> Muestra reducida (13 registros) vs <strong>Segmento Personas</strong> (1,432 registros). 
                    Los indicadores empresariales se presentan con fines comparativos y requieren interpretación cuidadosa debido al tamaño limitado de la muestra.
                  </p>
                </div>
              </div>
            </div>

            {/* KPIs Principales Rediseñados */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiData.map((kpi, index) => {
                const personasAvg = typeof kpi.personas?.average === 'number' ? kpi.personas.average : 0;
                const empresasAvg = typeof kpi.empresarial?.average === 'number' ? kpi.empresarial.average : 0;
                const gap = Math.abs(personasAvg - empresasAvg);
                
                return (
                  <div key={index} className="group relative">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Header de la métrica */}
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-gray-800 text-sm mb-2 leading-tight" title={kpi.metric}>
                          {kpi.metric.length > 25 ? kpi.metric.substring(0, 25) + '...' : kpi.metric}
                        </h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full mx-auto"></div>
                      </div>
                      
                      {/* Datos comparativos */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                            <span className="text-xs text-gray-600 font-medium">Personas</span>
                          </div>
                          <span className="text-lg font-bold text-brand-primary">{personasAvg.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-brand-secondary rounded-full"></div>
                            <span className="text-xs text-gray-600 font-medium">Empresas</span>
                          </div>
                          <span className="text-lg font-bold text-brand-secondary">{empresasAvg.toFixed(2)}</span>
                        </div>
                        
                        {/* Brecha con indicador visual */}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 font-medium">Brecha</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-bold ${
                                gap > 0.5 ? 'text-red-600' : gap > 0.2 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {gap.toFixed(2)}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${
                                gap > 0.5 ? 'bg-red-500' : gap > 0.2 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Overlay de hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Leyenda mejorada */}
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex items-center space-x-3 bg-brand-primary/10 px-4 py-2 rounded-lg">
                <div className="w-4 h-4 bg-brand-primary rounded-full shadow-sm"></div>
                <span className="text-sm font-semibold text-brand-dark">Segmento Personas (n=1,432)</span>
              </div>
              <div className="flex items-center space-x-3 bg-brand-secondary/10 px-4 py-2 rounded-lg">
                <div className="w-4 h-4 bg-brand-secondary rounded-full shadow-sm"></div>
                <span className="text-sm font-semibold text-brand-dark">Segmento Empresas (n=13)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2: Distribución de Calificaciones - Diseño Profesional */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header de sección */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Distribución de Calificaciones por Segmento</h2>
                <p className="text-gray-300">Análisis detallado de la distribución de respuestas por categoría de calificación</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico de distribución mejorado */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Promedio de Distribución por Categoría</h3>
                  <div className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Vista Comparativa
                  </div>
                </div>
                {distributionData.length > 0 ? (
                  <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="rating"
                          tick={{ fontSize: 10, fill: '#6b7280' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="rect"
                        />
                        <Bar 
                          dataKey="personas" 
                          fill={colors.personas}
                          name="Personas"
                          radius={[4, 4, 0, 0]}
                          stroke="#ffffff"
                          strokeWidth={1}
                          minPointSize={8}
                          maxBarSize={50}
                        />
                        <Bar 
                          dataKey="empresas" 
                          fill={colors.empresas}
                          name="Empresas"
                          radius={[4, 4, 0, 0]}
                          stroke="#ffffff"
                          strokeWidth={1}
                          minPointSize={8}
                          maxBarSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <NoDataMessage title="Sin datos de distribución disponibles" />
                )}
              </div>

              {/* Análisis de brechas mejorado */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Análisis de Brechas</h3>
                  <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Insights Estratégicos
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500 p-2 rounded-full">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <h4 className="font-bold text-green-800 text-lg">Brechas Mínimas</h4>
                      </div>
                      <div className="text-3xl font-bold text-green-700">
                        {insights.filter(i => i.significance === 'Baja').length}
                      </div>
                    </div>
                    <p className="text-green-700 font-medium">Segmentos con performance similar (&lt;0.2 puntos)</p>
                    <p className="text-green-600 text-sm mt-2">
                      Indica alineación en la experiencia del cliente entre segmentos
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border-l-4 border-yellow-500 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-yellow-500 p-2 rounded-full">
                          <span className="text-white text-sm">!</span>
                        </div>
                        <h4 className="font-bold text-yellow-800 text-lg">Brechas Moderadas</h4>
                      </div>
                      <div className="text-3xl font-bold text-yellow-700">
                        {insights.filter(i => i.significance === 'Media').length}
                      </div>
                    </div>
                    <p className="text-yellow-700 font-medium">Diferencias observables entre segmentos (0.2-0.5 puntos)</p>
                    <p className="text-yellow-600 text-sm mt-2">
                      Requiere monitoreo y posibles ajustes estratégicos
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border-l-4 border-red-500 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-red-500 p-2 rounded-full">
                          <span className="text-white text-sm">⚠</span>
                        </div>
                        <h4 className="font-bold text-red-800 text-lg">Brechas Significativas</h4>
                      </div>
                      <div className="text-3xl font-bold text-red-700">
                        {insights.filter(i => i.significance === 'Alta').length}
                      </div>
                    </div>
                    <p className="text-red-700 font-medium">Diferencias críticas (&gt;0.5 puntos)</p>
                    <p className="text-red-600 text-sm mt-2">
                      Requieren atención prioritaria e intervención inmediata
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 3: Comparativo por Métrica (Dumbbell Style) */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comparativo Detallado por Métrica</h2>
          
          {dumbbellData.length > 0 ? (
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="horizontal"
                  data={dumbbellData} 
                  margin={{ top: 20, right: 50, left: 140, bottom: 20 }}
                  maxBarSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number"
                    domain={[0, 5]}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    label={{ value: 'Puntuación (1-5)', position: 'insideBottom', offset: -10 }}
                    tickCount={6}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    width={140}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="rect"
                  />
                  <Bar 
                    dataKey="personas" 
                    fill={colors.personas}
                    name="Segmento Personas"
                    radius={[0, 4, 4, 0]}
                    stroke="#ffffff"
                    strokeWidth={1}
                    minPointSize={8}
                  />
                  <Bar 
                    dataKey="empresas" 
                    fill={colors.empresas}
                    name="Segmento Empresas"
                    radius={[0, 4, 4, 0]}
                    stroke="#ffffff"
                    strokeWidth={1}
                    minPointSize={8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoDataMessage title="Sin datos comparativos disponibles" />
          )}
        </div>

        {/* Sección 4: Gráfico de Líneas Comparativo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tendencia Comparativa entre Segmentos</h2>
          
          {comparisonData.length > 0 ? (
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={comparisonData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    label={{ value: 'Puntuación (1-5)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="personas" 
                    stroke={colors.personas}
                    strokeWidth={3}
                    dot={{ fill: colors.personas, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                    name="Segmento Personas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="empresas" 
                    stroke={colors.empresas}
                    strokeWidth={3}
                    dot={{ fill: colors.empresas, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                    name="Segmento Empresas"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <NoDataMessage title="Sin datos de tendencia disponibles" />
          )}
        </div>

        {/* Resumen Comparativo Detallado */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen Comparativo Detallado</h2>
          
          <div className="overflow-x-auto relative">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full relative">
                <thead className="sticky top-0 bg-white z-20 shadow-sm">
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-0 w-1/3">Métrica</th>
                    <th className="text-center py-4 px-4 font-semibold text-blue-700 min-w-0 w-1/6">Personas</th>
                    <th className="text-center py-4 px-4 font-semibold text-purple-700 min-w-0 w-1/6">Empresas</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700 min-w-0 w-1/6">Brecha</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700 min-w-0 w-1/6">Líder</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map((insight, index) => {
                    const questionMapping = getQuestionByDisplayName(insight.metric);
                    const personasExc = kpiData.find(k => k.metric === insight.metric)?.personas?.rating5 || 0;
                    const empresarialExc = kpiData.find(k => k.metric === insight.metric)?.empresarial?.rating5 || 0;
                    
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                        <td className="py-4 px-4 min-w-0">
                          <div className="flex flex-col">
                            {questionMapping ? (
                              <div className="relative">
                                <TooltipPregunta questionMapping={questionMapping}>
                                  <span className="font-semibold text-gray-800 cursor-help hover:text-blue-600 flex items-center transition-colors group-hover:text-blue-700">
                                    <span className="truncate block max-w-xs" title={insight.metric}>
                                      {insight.metric}
                                    </span>
                                    <span className="ml-2 text-blue-500 text-sm flex-shrink-0">ℹ️</span>
                                  </span>
                                </TooltipPregunta>
                              </div>
                            ) : (
                              <span className="font-semibold text-gray-800 truncate block max-w-xs" title={insight.metric}>
                                {insight.metric}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 mt-1 flex-shrink-0">
                              Pregunta {questionMapping?.questionNumber || 'N/A'} - Escala 1-5
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2 min-w-0">
                          <div className="bg-blue-50 rounded-lg p-2 mx-1">
                            <div className="text-xl font-bold text-blue-700 mb-1">{insight.personasAvg.toFixed(2)}</div>
                            <div className="text-xs font-medium text-blue-600">{personasExc.toFixed(0)}% exc.</div>
                            <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                              <div 
                                className={`bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ${
                                  insight.personasAvg >= 4.5 ? 'w-full' :
                                  insight.personasAvg >= 4.0 ? 'w-5/6' :
                                  insight.personasAvg >= 3.5 ? 'w-3/4' :
                                  insight.personasAvg >= 3.0 ? 'w-3/5' :
                                  insight.personasAvg >= 2.5 ? 'w-1/2' :
                                  insight.personasAvg >= 2.0 ? 'w-2/5' :
                                  insight.personasAvg >= 1.5 ? 'w-1/3' :
                                  insight.personasAvg >= 1.0 ? 'w-1/4' : 'w-1/12'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2 min-w-0">
                          <div className="bg-purple-50 rounded-lg p-2 mx-1">
                            <div className="text-xl font-bold text-purple-700 mb-1">{insight.empresarialAvg.toFixed(2)}</div>
                            <div className="text-xs font-medium text-purple-600">{empresarialExc.toFixed(0)}% exc.</div>
                            <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                              <div 
                                className={`bg-purple-600 h-1.5 rounded-full transition-all duration-1000 ${
                                  insight.empresarialAvg >= 4.5 ? 'w-full' :
                                  insight.empresarialAvg >= 4.0 ? 'w-5/6' :
                                  insight.empresarialAvg >= 3.5 ? 'w-3/4' :
                                  insight.empresarialAvg >= 3.0 ? 'w-3/5' :
                                  insight.empresarialAvg >= 2.5 ? 'w-1/2' :
                                  insight.empresarialAvg >= 2.0 ? 'w-2/5' :
                                  insight.empresarialAvg >= 1.5 ? 'w-1/3' :
                                  insight.empresarialAvg >= 1.0 ? 'w-1/4' : 'w-1/12'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2 min-w-0">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold whitespace-nowrap ${
                            insight.gap > 0.5 ? 'bg-red-100 text-red-700' :
                            insight.gap > 0.2 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {insight.gap.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 font-medium">
                            {insight.significance}
                          </div>
                        </td>
                        <td className="text-center py-4 px-2 min-w-0">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold whitespace-nowrap ${
                            insight.leader === 'Personas' ? 'bg-blue-100 text-blue-700' :
                            insight.leader === 'Empresas' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {insight.leader}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enhanced Legend y Análisis Final */}
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
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Interpretación de Colores</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span>Excelente (5) - Satisfacción óptima</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
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
};

export default SegmentAnalysis;
