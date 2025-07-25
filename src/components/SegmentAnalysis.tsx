import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { satisfactionDataService } from '../services/dataService';
import { KPIData } from '../types';
import { SURVEY_INFO } from '../data/questionsMap';



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
          data.find(kpi => kpi.metric === 'Recomendación (NPS)'),
          data.find(kpi => kpi.metric === 'Claridad de Información')
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

  // Validación de datos - Debe estar antes de las funciones que la usan
  const hasValidData = kpiData && kpiData.length > 0;

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

  // Información de las métricas evaluadas
  const metricsInfo = [
    {
      name: "Satisfacción General",
      description: "Evaluación global de la experiencia del cliente con el servicio",
      icon: "⭐",
      color: "#059669"
    },
    {
      name: "Lealtad",
      description: "Nivel de compromiso y fidelidad del cliente hacia la organización",
      icon: "💝",
      color: "#0891b2"
    },
    {
      name: "Recomendación",
      description: "Disposición del cliente para recomendar el servicio a otros",
      icon: "👥",
      color: "#7c3aed"
    },
    {
      name: "Claridad de la Información",
      description: "Percepción sobre la claridad y comprensión de la información proporcionada",
      icon: "📋",
      color: "#dc2626"
    }
  ];

  // Calcular estadísticas generales
  const calculateOverallStats = () => {
    if (!hasValidData) return { personas: 0, empresas: 0, totalResponses: 0 };

    const personasAvg = kpiData.reduce((sum, kpi) => sum + (kpi.personas?.average || 0), 0) / kpiData.length;
    const empresasAvg = kpiData.reduce((sum, kpi) => sum + (kpi.empresarial?.average || 0), 0) / kpiData.length;
    const totalResponses = kpiData.reduce((sum, kpi) => sum + (kpi.personas?.total || 0) + (kpi.empresarial?.total || 0), 0);

    return {
      personas: Math.round(personasAvg * 100) / 100,
      empresas: Math.round(empresasAvg * 100) / 100,
      totalResponses
    };
  };

  const overallStats = calculateOverallStats();

  // Preparar datos para distribución de satisfacción por niveles
  const prepareDistributionData = () => {
    // Estructura por defecto para cuando no hay datos
    const defaultData = {
      personasData: [
        { name: 'Excelente (5)', value: 0, count: 0, color: '#059669' },
        { name: 'Bueno (4)', value: 0, count: 0, color: '#0891b2' },
        { name: 'Necesita Mejora (1-3)', value: 0, count: 0, color: '#dc2626' }
      ],
      empresasData: [
        { name: 'Excelente (5)', value: 0, count: 0, color: '#059669' },
        { name: 'Bueno (4)', value: 0, count: 0, color: '#0891b2' },
        { name: 'Necesita Mejora (1-3)', value: 0, count: 0, color: '#dc2626' }
      ],
      personasTotal: 0,
      empresasTotal: 0
    };

    if (!hasValidData) return defaultData;

    // Calcular promedios ponderados de distribución por segmento
    // Los valores rating5, rating4, rating123 ya vienen como porcentajes del servicio
    let personasTotalResponses = 0;
    let empresasTotalResponses = 0;
    let personasWeightedRating5 = 0;
    let personasWeightedRating4 = 0;
    let personasWeightedRating123 = 0;
    let empresasWeightedRating5 = 0;
    let empresasWeightedRating4 = 0;
    let empresasWeightedRating123 = 0;

    kpiData.forEach(kpi => {
      const personasTotal = kpi.personas?.total || 0;
      const empresasTotal = kpi.empresarial?.total || 0;
      
      if (personasTotal > 0) {
        personasTotalResponses += personasTotal;
        // Los rating ya vienen como porcentajes, los convertimos a conteos para promediar correctamente
        personasWeightedRating5 += (kpi.personas?.rating5 || 0) * personasTotal / 100;
        personasWeightedRating4 += (kpi.personas?.rating4 || 0) * personasTotal / 100;
        personasWeightedRating123 += (kpi.personas?.rating123 || 0) * personasTotal / 100;
      }
      
      if (empresasTotal > 0) {
        empresasTotalResponses += empresasTotal;
        empresasWeightedRating5 += (kpi.empresarial?.rating5 || 0) * empresasTotal / 100;
        empresasWeightedRating4 += (kpi.empresarial?.rating4 || 0) * empresasTotal / 100;
        empresasWeightedRating123 += (kpi.empresarial?.rating123 || 0) * empresasTotal / 100;
      }
    });

    // Calcular porcentajes finales
    const personasData = [
      {
        name: 'Excelente (5)',
        value: personasTotalResponses > 0 ? Math.round((personasWeightedRating5 / personasTotalResponses) * 100) : 0,
        count: Math.round(personasWeightedRating5),
        color: '#059669'
      },
      {
        name: 'Bueno (4)',
        value: personasTotalResponses > 0 ? Math.round((personasWeightedRating4 / personasTotalResponses) * 100) : 0,
        count: Math.round(personasWeightedRating4),
        color: '#0891b2'
      },
      {
        name: 'Necesita Mejora (1-3)',
        value: personasTotalResponses > 0 ? Math.round((personasWeightedRating123 / personasTotalResponses) * 100) : 0,
        count: Math.round(personasWeightedRating123),
        color: '#dc2626'
      }
    ];

    const empresasData = [
      {
        name: 'Excelente (5)',
        value: empresasTotalResponses > 0 ? Math.round((empresasWeightedRating5 / empresasTotalResponses) * 100) : 0,
        count: Math.round(empresasWeightedRating5),
        color: '#059669'
      },
      {
        name: 'Bueno (4)',
        value: empresasTotalResponses > 0 ? Math.round((empresasWeightedRating4 / empresasTotalResponses) * 100) : 0,
        count: Math.round(empresasWeightedRating4),
        color: '#0891b2'
      },
      {
        name: 'Necesita Mejora (1-3)',
        value: empresasTotalResponses > 0 ? Math.round((empresasWeightedRating123 / empresasTotalResponses) * 100) : 0,
        count: Math.round(empresasWeightedRating123),
        color: '#dc2626'
      }
    ];

    return { 
      personasData, 
      empresasData, 
      personasTotal: personasTotalResponses, 
      empresasTotal: empresasTotalResponses 
    };
  };

  // Calcular insights de brechas
  const calculateGapInsights = () => {
    if (!hasValidData) return [];

    return kpiData.map((kpi) => {
      const personasAvg = kpi.personas?.average || 0;
      const empresasAvg = kpi.empresarial?.average || 0;
      const gap = Math.abs(personasAvg - empresasAvg);
      const leader = personasAvg > empresasAvg ? 'Personas' : empresasAvg > personasAvg ? 'Empresas' : 'Empate';
      
      let significance = 'Baja';
      let recommendation = 'Mantener el nivel actual de servicio';
      let priority = 'Baja';

      if (gap >= 0.5) {
        significance = 'Alta';
        recommendation = 'Requiere atención inmediata y plan de acción específico';
        priority = 'Alta';
      } else if (gap >= 0.2) {
        significance = 'Media';
        recommendation = 'Monitorear de cerca y considerar mejoras focalizadas';
        priority = 'Media';
      }

      return {
        metric: kpi.metric,
        gap: gap,
        leader: leader,
        significance: significance,
        recommendation: recommendation,
        priority: priority,
        personasScore: personasAvg,
        empresasScore: empresasAvg
      };
    }).sort((a, b) => b.gap - a.gap);
  };

  const insights = calculateGapInsights();

  // Preparar datos para gráfico comparativo mejorado (Horizontal Bar Chart)
  const prepareComparisonData = () => {
    if (!hasValidData) return [];

    return kpiData.map((kpi) => {
      const personasAvg = Math.max(0, Math.min(5, typeof kpi.personas?.average === 'number' ? kpi.personas.average : 0));
      const empresasAvg = Math.max(0, Math.min(5, typeof kpi.empresarial?.average === 'number' ? kpi.empresarial.average : 0));
      
      return {
        name: kpi.metric.length > 30 ? kpi.metric.substring(0, 30) + '...' : kpi.metric,
        fullName: kpi.metric,
        personas: personasAvg,
        empresas: empresasAvg,
        personasCount: kpi.personas?.total || 0,
        empresasCount: kpi.empresarial?.total || 0,
        gap: Math.abs(personasAvg - empresasAvg),
        hasData: personasAvg > 0 || empresasAvg > 0
      };
    }).filter(item => item.hasData);
  };

  const distributionData = prepareDistributionData();
  const comparisonData = prepareComparisonData();







  // Tooltip mejorado para gráficos comparativos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-gray-200 rounded-xl shadow-2xl w-80 relative z-50 max-w-xs">
          <p className="font-bold text-gray-800 mb-3 text-center border-b pb-2">{label}</p>
          
          <div className="space-y-3 mb-3">
            {payload.map((entry: any, index: number) => {
              const isPersonas = entry.name?.includes('Personas');
              const colorClass = isPersonas ? 'text-brand-primary' : 'text-brand-secondary';
              const bgColorClass = isPersonas ? 'bg-brand-primary' : 'bg-brand-secondary';
              
              return (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <span className={`w-4 h-4 rounded-full mr-3 border-2 border-white shadow-sm ${bgColorClass}`}></span>
                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                  </div>
                  <span className={`font-bold text-lg ${colorClass}`}>
                    {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                  </span>
                </div>
              );
            })}
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
              {/* Versión móvil del contador */}
              <div className="block lg:hidden">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-center">
                    <div className="text-lg font-bold">4</div>
                    <div className="text-xs text-brand-light">Métricas</div>
                  </div>
                </div>
              </div>
              
              {/* Versión desktop del contador */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">4</div>
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

        {/* Sección 1: Información de Métricas Evaluadas */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header de sección */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Métricas de Evaluación del Servicio</h2>
                <p className="text-blue-100">Análisis integral de {overallStats.totalResponses.toLocaleString()} respuestas</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Grid de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metricsInfo.map((metric, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{metric.icon}</div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }}></div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{metric.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{metric.description}</p>
                </div>
              ))}
            </div>

            {/* Estadísticas generales */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen Ejecutivo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{overallStats.personas.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Promedio Segmento Personas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{overallStats.empresas.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Promedio Segmento Empresas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{overallStats.totalResponses.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total de Respuestas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2: Distribución de Satisfacción */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header de sección */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Distribución de Satisfacción por Segmento</h2>
                <p className="text-green-100">Análisis de niveles de satisfacción por categoría</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {distributionData.personasData && distributionData.empresasData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico Personas */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Segmento Personas
                    <span className="block text-sm text-gray-600 font-normal">
                      {distributionData.personasTotal.toLocaleString()} respuestas
                    </span>
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData.personasData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {distributionData.personasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, _, props) => [
                            `${value}% (${props.payload.count} respuestas)`,
                            props.payload.name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {distributionData.personasData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gráfico Empresas */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Segmento Empresas
                    <span className="block text-sm text-gray-600 font-normal">
                      {distributionData.empresasTotal.toLocaleString()} respuestas
                    </span>
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData.empresasData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {distributionData.empresasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, _, props) => [
                            `${value}% (${props.payload.count} respuestas)`,
                            props.payload.name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {distributionData.empresasData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NoDataMessage title="Sin datos de distribución disponibles" />
            )}

            {/* Análisis de brechas mejorado */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Análisis de Brechas</h3>
                <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Insights Estratégicos
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Sección 3: Comparativo por Métrica (Horizontal Bar Chart) */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header de sección */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Comparativo Detallado por Métrica</h2>
                <p className="text-indigo-100">Análisis visual de performance por segmento</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {comparisonData.length > 0 ? (
              <div className="space-y-6">
                {/* Gráfico principal mejorado */}
                <div className="w-full h-96 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={comparisonData} 
                      margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
                      <XAxis 
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis 
                        domain={[0, 5]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        label={{ value: 'Puntuación (1-5)', angle: -90, position: 'insideLeft' }}
                        tickCount={6}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="rect"
                        wrapperStyle={{ paddingBottom: '20px' }}
                      />
                      <Bar 
                        dataKey="personas" 
                        fill={colors.personas}
                        name="Segmento Personas"
                        radius={[4, 4, 0, 0]}
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                      <Bar 
                        dataKey="empresas" 
                        fill={colors.empresas}
                        name="Segmento Empresas"
                        radius={[4, 4, 0, 0]}
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Indicadores visuales de diferencias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {comparisonData.map((item, index) => {
                    const difference = Math.abs(item.personas - item.empresas);
                    const leader = item.personas > item.empresas ? 'Personas' : item.empresas > item.personas ? 'Empresas' : 'Empate';
                    const leaderIcon = leader === 'Personas' ? '👥' : leader === 'Empresas' ? '🏢' : '⚖️';
                    const differenceColor = difference < 0.2 ? 'text-green-600' : difference < 0.5 ? 'text-yellow-600' : 'text-red-600';
                    const bgColor = difference < 0.2 ? 'bg-green-50 border-green-200' : difference < 0.5 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
                    
                    return (
                      <div key={index} className={`${bgColor} rounded-lg p-4 border`}>
                        <div className="text-center">
                          <div className="text-2xl mb-2">{leaderIcon}</div>
                          <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                            {item.fullName}
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-blue-600">Personas:</span>
                              <span className="font-bold">{item.personas.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-purple-600">Empresas:</span>
                              <span className="font-bold">{item.empresas.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs border-t pt-1">
                              <span className="text-gray-600">Diferencia:</span>
                              <span className={`font-bold ${differenceColor}`}>
                                {difference.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <NoDataMessage title="Sin datos comparativos disponibles" />
            )}
          </div>
        </div>

        {/* Resumen Comparativo Detallado - Tabla Mejorada */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header de sección */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Resumen Comparativo Detallado</h2>
                <p className="text-gray-300">Análisis integral de performance por métrica y segmento</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {hasValidData ? (
              <div className="space-y-8">
                {/* Tabla comparativa mejorada */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Tabla Comparativa por Métrica</h3>
                    <p className="text-sm text-gray-600 mt-1">Comparación detallada de puntuaciones promedio entre segmentos</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Métrica
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Segmento Personas
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Segmento Empresas
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Diferencia
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            Líder
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {kpiData.map((kpi, index) => {
                          const personasAvg = kpi.personas?.average || 0;
                          const empresasAvg = kpi.empresarial?.average || 0;
                          const difference = Math.abs(personasAvg - empresasAvg);
                          const leader = personasAvg > empresasAvg ? 'Personas' : empresasAvg > personasAvg ? 'Empresas' : 'Empate';
                          const leaderColor = leader === 'Personas' ? 'text-blue-600' : leader === 'Empresas' ? 'text-purple-600' : 'text-gray-600';
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                {kpi.metric}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-lg font-bold text-blue-600">
                                    {personasAvg.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {kpi.personas?.total || 0} respuestas
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-lg font-bold text-purple-600">
                                    {empresasAvg.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {kpi.empresarial?.total || 0} respuestas
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                                  difference < 0.2 ? 'bg-green-100 text-green-800' :
                                  difference < 0.5 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {difference.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`text-sm font-semibold ${leaderColor}`}>
                                  {leader}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resumen ejecutivo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Estadísticas generales */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-3">📊</span>
                      Estadísticas Generales
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Promedio General Personas:</span>
                        <span className="text-xl font-bold text-blue-600">
                          {overallStats.personas.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Promedio General Empresas:</span>
                        <span className="text-xl font-bold text-purple-600">
                          {overallStats.empresas.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Diferencia Promedio:</span>
                        <span className="text-xl font-bold text-gray-800">
                          {Math.abs(overallStats.personas - overallStats.empresas).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total de Respuestas:</span>
                        <span className="text-xl font-bold text-green-600">
                          {overallStats.totalResponses.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Insights clave */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-3">💡</span>
                      Insights Clave
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <h4 className="font-semibold text-purple-800 mb-2">Segmento Líder</h4>
                        <p className="text-sm text-gray-600">
                          {overallStats.personas > overallStats.empresas ? 
                            'El segmento Personas muestra mejor performance general' :
                            overallStats.empresas > overallStats.personas ?
                            'El segmento Empresas muestra mejor performance general' :
                            'Ambos segmentos muestran performance similar'
                          }
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <h4 className="font-semibold text-purple-800 mb-2">Consistencia</h4>
                        <p className="text-sm text-gray-600">
                          {Math.abs(overallStats.personas - overallStats.empresas) < 0.2 ?
                            'Alta consistencia entre segmentos' :
                            Math.abs(overallStats.personas - overallStats.empresas) < 0.5 ?
                            'Consistencia moderada entre segmentos' :
                            'Baja consistencia entre segmentos'
                          }
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        <h4 className="font-semibold text-purple-800 mb-2">Participación</h4>
                        <p className="text-sm text-gray-600">
                          Excelente nivel de participación con {overallStats.totalResponses.toLocaleString()} respuestas totales
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <NoDataMessage title="Sin datos comparativos disponibles" />
            )}
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
                {SURVEY_INFO.measurementPeriods && (
                  <p><strong>Períodos de Medición:</strong> {SURVEY_INFO.measurementPeriods}</p>
                )}
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
