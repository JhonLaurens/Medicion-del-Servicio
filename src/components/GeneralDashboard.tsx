import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { satisfactionDataService } from '../services/dataService';
import { KPIData } from '../types';
import TooltipPregunta from './TooltipPregunta';
import ExecutiveKPICard from './ExecutiveKPICard';
import { getQuestionByDisplayName, SURVEY_INFO } from '../data/questionsMap';

const GeneralDashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 GeneralDashboard: Starting data load...');
        
        await satisfactionDataService.loadData();
        
        const totalRecords = satisfactionDataService.getData().length;
        console.log('✅ GeneralDashboard: Data loaded successfully, total records:', totalRecords);
        
        if (totalRecords === 0) {
          console.warn('⚠️ GeneralDashboard: No data found in CSV file');
          return;
        }
        
        const data = satisfactionDataService.getKPIData();
        console.log('📈 GeneralDashboard: KPI data generated:', {
          kpiCount: data.length,
          metrics: data.map(kpi => kpi.metric)
        });
        
        setKpiData(data);
        
      } catch (error) {
        console.error('❌ GeneralDashboard: Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const colors = {
    rating5: '#1e40af', // Blue - Excelente
    rating4: '#10b981', // Green - Bueno  
    rating123: '#ef4444' // Red - Necesita mejora
  };

  const prepareStackedData = (kpi: KPIData) => {
    const sanitizePercentage = (value: number): number => {
      if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) return 0;
      if (value < 0) return 0;
      if (value > 100) return 100;
      return Math.round(value * 10) / 10;
    };

    if (!kpi || !kpi.consolidado || !kpi.personas || !kpi.empresarial) {
      return [
        { name: 'Consolidado', rating5: 0, rating4: 0, rating123: 0, average: 0 },
        { name: 'Personas', rating5: 0, rating4: 0, rating123: 0, average: 0 },
        { name: 'Empresas', rating5: 0, rating4: 0, rating123: 0, average: 0 }
      ];
    }

    return [
      {
        name: 'Consolidado',
        rating5: sanitizePercentage(kpi.consolidado.rating5),
        rating4: sanitizePercentage(kpi.consolidado.rating4),
        rating123: sanitizePercentage(kpi.consolidado.rating123),
        average: kpi.consolidado.average
      },
      {
        name: 'Personas',
        rating5: sanitizePercentage(kpi.personas.rating5),
        rating4: sanitizePercentage(kpi.personas.rating4),
        rating123: sanitizePercentage(kpi.personas.rating123),
        average: kpi.personas.average
      },
      {
        name: 'Empresas',
        rating5: sanitizePercentage(kpi.empresarial.rating5),
        rating4: sanitizePercentage(kpi.empresarial.rating4),
        rating123: sanitizePercentage(kpi.empresarial.rating123),
        average: kpi.empresarial.average
      }
    ];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalEstimado = 1400;
      const cant5 = Math.round((data?.rating5 || 0) * totalEstimado / 100);
      const cant4 = Math.round((data?.rating4 || 0) * totalEstimado / 100);
      const cant123 = Math.round((data?.rating123 || 0) * totalEstimado / 100);
      
      return (
        <div className="tooltip-corporate">
          <div className="font-semibold text-gray-800 mb-3 text-center border-b pb-2">{label}</div>
          <div className="text-lg font-bold text-brand-primary mb-3 text-center">
            Promedio: {typeof data?.average === 'number' ? data.average.toFixed(2) : '0.00'}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                <span className="text-sm">Excelente (5)</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{typeof data?.rating5 === 'number' ? data.rating5.toFixed(1) : '0.0'}%</span>
                <div className="text-xs text-gray-500">≈{cant5} resp.</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-sm">Bueno (4)</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{typeof data?.rating4 === 'number' ? data.rating4.toFixed(1) : '0.0'}%</span>
                <div className="text-xs text-gray-500">≈{cant4} resp.</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-sm">Mejora (1-3)</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{typeof data?.rating123 === 'number' ? data.rating123.toFixed(1) : '0.0'}%</span>
                <div className="text-xs text-gray-500">≈{cant123} resp.</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const evolutionData = [
    { year: '2023', total: 4.35, personas: 4.38, empresas: 4.28 },
    { 
      year: '2025', 
      total: kpiData.length > 0 ? kpiData[0].consolidado.average : 0, 
      personas: kpiData.length > 0 ? kpiData[0].personas.average : 0, 
      empresas: kpiData.length > 0 ? kpiData[0].empresarial.average : 0 
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
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

  if (!kpiData || kpiData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin Datos Disponibles</h2>
              <p className="text-gray-600">No se encontraron datos para mostrar en el dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        
        {/* Header Professional */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-4xl font-bold mb-2">Dashboard General de Satisfacción</h1>
                <p className="text-brand-light text-lg">
                  Vista consolidada de KPIs y métricas principales del servicio al cliente
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{kpiData.length}</div>
                    <div className="text-sm text-brand-light">Métricas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiData.slice(0, 4).map((kpi, index) => {
                const personasAvg = typeof kpi.personas?.average === 'number' ? kpi.personas.average : 0;
                const empresasAvg = typeof kpi.empresarial?.average === 'number' ? kpi.empresarial.average : 0;
                const gap = Math.abs(personasAvg - empresasAvg);
                
                const priority = gap > 0.5 ? 'high' : gap > 0.2 ? 'medium' : 'low';
                const trend = personasAvg > 4.0 ? 'up' : personasAvg > 3.5 ? 'stable' : 'down';
                
                return (
                  <ExecutiveKPICard
                    key={index}
                    title={kpi.metric}
                    personasValue={personasAvg}
                    empresasValue={empresasAvg}
                    metric="Escala 1-5"
                    priority={priority}
                    trend={trend}
                  />
                );
              })}
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="col-span-2 chart-container-premium">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="section-header text-2xl font-bold text-gray-800">
                    Resumen Ejecutivo de Rendimiento
                  </h3>
                  <div className="badge-status">
                    <span>Datos Actualizados</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {kpiData.slice(0, 2).map((kpi, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="text-center mb-4">
                        <h4 className="font-bold text-gray-800 mb-2">{kpi.metric}</h4>
                        <div className="text-3xl font-bold text-brand-primary">
                          {typeof kpi.consolidado.average === 'number' ? kpi.consolidado.average.toFixed(2) : '0.00'}
                        </div>
                        <div className="text-sm text-gray-500">Promedio General</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                          <span className="text-xs text-gray-600">Personas</span>
                          <span className="font-bold text-brand-primary">
                            {typeof kpi.personas.average === 'number' ? kpi.personas.average.toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                          <span className="text-xs text-gray-600">Empresas</span>
                          <span className="font-bold text-brand-secondary">
                            {typeof kpi.empresarial.average === 'number' ? kpi.empresarial.average.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-container-premium">
                <h3 className="section-header text-xl font-bold text-gray-800 mb-6">
                  Estadísticas del Estudio
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,445</div>
                    <div className="text-sm text-blue-800">Total Encuestados</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-green-800">Nivel de Confianza</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">2.50%</div>
                    <div className="text-sm text-amber-800">Margen de Error</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-sm font-bold text-purple-600">Período</div>
                    <div className="text-xs text-purple-800">{SURVEY_INFO.period}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Charts */}
        <div className="grid lg:grid-cols-1 gap-8">
          {/* Stacked bar charts for each KPI */}
          {kpiData.map((kpi, index) => {
            const questionMapping = getQuestionByDisplayName(kpi.metric);
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                {questionMapping ? (
                  <TooltipPregunta questionMapping={questionMapping}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 cursor-help flex items-center">
                      {kpi.metric} - Distribución por Calificación
                      <span className="ml-2 text-blue-500 text-sm">ℹ️</span>
                    </h3>
                  </TooltipPregunta>
                ) : (
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">{kpi.metric} - Distribución por Calificación</h3>
                )}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareStackedData(kpi)} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      type="number"
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickFormatter={(value) => {
                        // Asegurar que el valor sea un número válido y esté en rango
                        const numValue = Number(value);
                        if (isNaN(numValue) || !isFinite(numValue)) return '0%';
                        if (numValue < 0) return '0%';
                        if (numValue > 100) return '100%';
                        return `${Math.round(numValue)}%`;
                      }}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      allowDataOverflow={false}
                      allowDecimals={false}
                      includeHidden={false}
                      interval={0}
                      label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Bar 
                      dataKey="rating123" 
                      stackId="a" 
                      fill={colors.rating123} 
                      name="Calificación 1-3"
                    />
                    <Bar 
                      dataKey="rating4" 
                      stackId="a" 
                      fill={colors.rating4} 
                      name="Calificación 4"
                    />
                    <Bar 
                      dataKey="rating5" 
                      stackId="a" 
                      fill={colors.rating5} 
                      name="Calificación 5"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Excelente (5) ⭐⭐⭐⭐⭐</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Bueno (4) ⭐⭐⭐⭐</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Necesita mejora (1-3) ⭐⭐⭐</span>
                </div>
              </div>
            </div>
            );
          })}

          {/* Evolution Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Evolución del Indicador General de Servicio por Segmento</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d1d5db' }}
                    label={{ value: 'Promedio (1-5)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value.toFixed(2)}`,
                      name === 'total' ? 'Total Coltefinanciera' : name === 'personas' ? 'Personas' : 'Empresas'
                    ]}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="total" fill="#1e40af" name="total" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="personas" fill="#10b981" name="personas" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="empresas" fill="#8b5cf6" name="empresas" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Evolution Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Total Coltefinanciera</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Segmento Personas</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Segmento Empresas</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Section - Professional Layout */}
        {kpiData.map((kpi, index) => {
          const question = getQuestionByDisplayName(kpi.metric);
          
          return (
            <div key={index} className="chart-container-premium">
              <div className="flex items-center justify-between mb-6">
                {question ? (
                  <TooltipPregunta questionMapping={question}>
                    <div className="flex items-center space-x-3 cursor-help">
                      <h3 className="section-header text-2xl font-bold text-gray-800">
                        {kpi.metric} - Distribución por Calificación
                      </h3>
                      <span className="text-brand-primary text-lg">ℹ️</span>
                    </div>
                  </TooltipPregunta>
                ) : (
                  <h3 className="section-header text-2xl font-bold text-gray-800">
                    {kpi.metric} - Distribución por Calificación
                  </h3>
                )}
                
                <div className="flex items-center space-x-3">
                  <div className="badge-status">
                    Datos Consolidados
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <span className="text-xl">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareStackedData(kpi)} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      type="number"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickFormatter={(value) => {
                        const numValue = Number(value);
                        if (isNaN(numValue) || !isFinite(numValue)) return '0%';
                        if (numValue < 0) return '0%';
                        if (numValue > 100) return '100%';
                        return `${Math.round(numValue)}%`;
                      }}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      allowDataOverflow={false}
                      allowDecimals={false}
                      includeHidden={false}
                      interval={0}
                      label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Bar 
                      dataKey="rating123" 
                      stackId="a" 
                      fill="#ef4444" 
                      name="Calificación 1-3"
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar 
                      dataKey="rating4" 
                      stackId="a" 
                      fill="#10b981" 
                      name="Calificación 4"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar 
                      dataKey="rating5" 
                      stackId="a" 
                      fill="#1e40af" 
                      name="Calificación 5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Enhanced Legend */}
              <div className="flex justify-center space-x-8 mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Excelente (5) ⭐⭐⭐⭐⭐</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Bueno (4) ⭐⭐⭐⭐</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Necesita mejora (1-3) ⭐⭐⭐</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Evolution Chart - Enhanced */}
        <div className="chart-container-premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-header text-2xl font-bold text-gray-800">
              Evolución del Indicador General de Servicio por Segmento
            </h3>
            <div className="flex items-center space-x-3">
              <div className="badge-new">
                Comparativo Temporal
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <span className="text-xl">📈</span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolutionData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  label={{ value: 'Promedio (1-5)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value.toFixed(2)}`,
                    name === 'total' ? 'Total Coltefinanciera' : name === 'personas' ? 'Personas' : 'Empresas'
                  ]}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="total" fill="#1e40af" name="total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="personas" fill="#10b981" name="personas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="empresas" fill="#8b5cf6" name="empresas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Evolution Legend */}
          <div className="flex justify-center space-x-8 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Total Coltefinanciera</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Segmento Personas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Segmento Empresas</span>
            </div>
          </div>
        </div>

        {/* Footer with study information */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          <div className="text-center">
            <h3 className="section-header text-2xl font-bold text-gray-800 mb-6">
              Información del Estudio
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{SURVEY_INFO.sampleSize.toLocaleString()}</div>
                <div className="text-sm font-medium text-blue-800">Encuestas Válidas</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">{SURVEY_INFO.responseRate}</div>
                <div className="text-sm font-medium text-green-800">Tasa de Respuesta</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">{SURVEY_INFO.universeTotal.toLocaleString()}</div>
                <div className="text-sm font-medium text-purple-800">Universo Total</div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-amber-600 mb-2">2.50%</div>
                <div className="text-sm font-medium text-amber-800">Margen de Error</div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Período del Estudio:</strong> {SURVEY_INFO.period} • 
                <strong> Metodología:</strong> Encuesta digital dirigida • 
                <strong> Segmentos:</strong> Personas Naturales y Empresariales
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
