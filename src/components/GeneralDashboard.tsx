import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { satisfactionDataService } from '../services/dataService';
import { KPIData } from '../types';

const GeneralDashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
  const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 GeneralDashboard: Starting data load...');
        console.log('📊 GeneralDashboard: Current data state before load:', satisfactionDataService.getData().length);
        
        await satisfactionDataService.loadData();
        
        const totalRecords = satisfactionDataService.getData().length;
        console.log('✅ GeneralDashboard: Data loaded successfully, total records:', totalRecords);
        
        if (totalRecords === 0) {
          console.warn('⚠️ GeneralDashboard: No data found in CSV file');
          return;
        }
        
        console.log('🔄 GeneralDashboard: Generating KPI data...');
        const data = satisfactionDataService.getKPIData();
        console.log('📈 GeneralDashboard: KPI data generated:', {
          kpiCount: data.length,
          metrics: data.map(kpi => kpi.metric),
          firstKPI: data[0] || null
        });
        
        setKpiData(data);
        console.log('✅ GeneralDashboard: State updated with KPI data');
        
      } catch (error) {
        console.error('❌ GeneralDashboard: Error loading dashboard data:', error);
        console.error('❌ GeneralDashboard: Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        });
      } finally {
        setIsLoading(false);
        console.log('🏁 GeneralDashboard: Data loading process completed');
      }
    };

    loadData();
  }, []);

  const colors = {
    rating5: '#1e40af', // Blue
    rating4: '#fbbf24', // Yellow
    rating123: '#9ca3af' // Gray
  };

  const prepareStackedData = (kpi: KPIData) => {
    return [
      {
        name: 'Consolidado',
        rating5: kpi.consolidado.rating5,
        rating4: kpi.consolidado.rating4,
        rating123: kpi.consolidado.rating123,
        average: kpi.consolidado.average
      },
      {
        name: 'Personas',
        rating5: kpi.personas.rating5,
        rating4: kpi.personas.rating4,
        rating123: kpi.personas.rating123,
        average: kpi.personas.average
      },
      {
        name: 'Empresas',
        rating5: kpi.empresarial.rating5,
        rating4: kpi.empresarial.rating4,
        rating123: kpi.empresarial.rating123,
        average: kpi.empresarial.average
      }
    ];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-lg font-bold text-blue-600 mb-2">
            Promedio: {typeof data?.average === 'number' ? data.average.toFixed(2) : '0.00'}
          </p>
          <div className="space-y-1 text-sm">
            <p className="flex items-center">
              <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Calificación 5: {typeof data?.rating5 === 'number' ? data.rating5.toFixed(1) : '0.0'}%
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
              Calificación 4: {typeof data?.rating4 === 'number' ? data.rating4.toFixed(1) : '0.0'}%
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              Calificación 1-3: {typeof data?.rating123 === 'number' ? data.rating123.toFixed(1) : '0.0'}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, payload } = props;
    if (!payload || typeof payload.average !== 'number') return null;
    return (
      <text 
        x={x + width / 2} 
        y={y - 10} 
        textAnchor="middle" 
        fill="#374151"
        className="text-sm font-semibold"
      >
        {payload.average.toFixed(2)}
      </text>
    );
  };

  // Evolution chart data using actual data
  const evolutionData = [
    { year: '2023', total: 4.35, personas: 4.38, empresas: 4.28 },
    { 
      year: '2024', 
      total: kpiData.length > 0 ? kpiData[0].consolidado.average : 0, 
      personas: kpiData.length > 0 ? kpiData[0].personas.average : 0, 
      empresas: kpiData.length > 0 ? kpiData[0].empresarial.average : 0 
    }
  ];  if (isLoading) {
    console.log('⏳ GeneralDashboard: Still loading data...');
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  console.log('🎨 GeneralDashboard: Rendering component with:', {
    kpiDataLength: kpiData.length,
    isDataEmpty: !kpiData || kpiData.length === 0,
    totalRecords: satisfactionDataService.getData().length
  });
  // Add safety check for empty data
  if (!kpiData || kpiData.length === 0) {
    console.warn('⚠️ GeneralDashboard: No KPI data available for rendering');
    console.log('🔍 GeneralDashboard: Debug info:', {
      kpiData,
      totalRecords: satisfactionDataService.getData().length,
      rawData: satisfactionDataService.getData().slice(0, 3) // Show first 3 records
    });
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Indicadores Clave de Servicio 2024</h1>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <strong>Aviso:</strong> No se pudieron cargar los datos KPI. Verificando conexión de datos...
              <br />
              <small>Total de registros cargados: {satisfactionDataService.getData().length}</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Indicadores Clave de Servicio 2024</h1>
          <p className="text-gray-600">Vista consolidada de los KPIs más importantes basada en {satisfactionDataService.getData().length} encuestas</p>
        </div>

        {/* KPI Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{kpi.metric}</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Consolidado</p>
                  <p className="text-2xl font-bold text-blue-600">{typeof kpi.consolidado.average === 'number' ? kpi.consolidado.average.toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Personas</p>
                  <p className="text-2xl font-bold text-green-600">{typeof kpi.personas.average === 'number' ? kpi.personas.average.toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Empresas</p>
                  <p className="text-2xl font-bold text-purple-600">{typeof kpi.empresarial.average === 'number' ? kpi.empresarial.average.toFixed(2) : '0.00'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Charts */}
        <div className="grid lg:grid-cols-1 gap-8">
          {/* Stacked bar charts for each KPI */}
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">{kpi.metric} - Distribución por Calificación</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareStackedData(kpi)} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rating123" stackId="a" fill={colors.rating123} name="Calificación 1-3" />
                    <Bar dataKey="rating4" stackId="a" fill={colors.rating4} name="Calificación 4" />
                    <Bar 
                      dataKey="rating5" 
                      stackId="a" 
                      fill={colors.rating5} 
                      name="Calificación 5"
                      label={renderCustomizedLabel}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Muy Satisfecho/Muy Probable (5)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Satisfecho/Probable (4)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Neutral/Insatisfecho (1-3)</span>
                </div>
              </div>
            </div>
          ))}

          {/* Evolution Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Evolución del Indicador General de Servicio</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value.toFixed(2)}`,
                      name === 'total' ? 'Total Coltefinanciera' : name === 'personas' ? 'Personas' : 'Empresas'
                    ]}
                  />
                  <Bar dataKey="total" fill="#1e40af" name="total" />
                  <Bar dataKey="personas" fill="#059669" name="personas" />
                  <Bar dataKey="empresas" fill="#7c3aed" name="empresas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
