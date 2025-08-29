import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ComparisonData {
  metric: string;
  personas: number;
  empresas: number;
  difference: number;
  personasColor: string;
  empresasColor: string;
}

interface ComparisonChartProps {
  comparisonData: ComparisonData[];
  hasValidData: boolean;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ comparisonData, hasValidData }) => {
  // Validación robusta de datos
  const isValidComparisonData = hasValidData && 
    Array.isArray(comparisonData) && 
    comparisonData.length > 0 &&
    comparisonData.every(item => 
      item && 
      typeof item === 'object' && 
      typeof item.metric === 'string' &&
      typeof item.personas === 'number' &&
      typeof item.empresas === 'number' &&
      !isNaN(item.personas) &&
      !isNaN(item.empresas)
    );

  if (!isValidComparisonData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">⚖️ Comparación entre Segmentos</h2>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const personasData = payload.find((p: any) => p.dataKey === 'personas');
      const empresasData = payload.find((p: any) => p.dataKey === 'empresas');
      
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xl">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <p className="font-semibold text-slate-800 text-sm">{label}</p>
          </div>
          <div className="space-y-2">
            {personasData && (
              <div className="flex justify-between items-center">
                <span className="text-blue-600 text-sm flex items-center">
                  <span className="mr-1">👥</span> Personas:
                </span>
                <span className="font-bold text-slate-800">{personasData.value.toFixed(2)}</span>
              </div>
            )}
            {empresasData && (
              <div className="flex justify-between items-center">
                <span className="text-orange-600 text-sm flex items-center">
                  <span className="mr-1">🏢</span> Empresarial:
                </span>
                <span className="font-bold text-slate-800">{empresasData.value.toFixed(2)}</span>
              </div>
            )}
            {personasData && empresasData && (
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-600 text-sm">Diferencia:</span>
                <span className="font-bold text-slate-800">
                  {(personasData.value - empresasData.value).toFixed(2)} pts
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Encontrar las métricas con mayor diferencia (con validación adicional)
  const sortedByDifference = Array.isArray(comparisonData) && comparisonData.length > 0
    ? [...comparisonData].sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
    : [];
  const topDifferences = sortedByDifference.slice(0, 3);

  const getInsightIcon = (difference: number) => {
    if (Math.abs(difference) < 0.5) return '⚖️';
    if (difference > 0) return '📈';
    return '📉';
  };

  const getInsightText = (metric: string, difference: number, personas: number, empresas: number) => {
    const absDiff = Math.abs(difference);
    const higherSegment = difference > 0 ? 'Personas' : 'Empresarial';
    const lowerSegment = difference > 0 ? 'Empresarial' : 'Personas';
    const higherValue = difference > 0 ? personas : empresas;
    const lowerValue = difference > 0 ? empresas : personas;
    
    if (absDiff < 0.5) {
      return `${metric}: Ambos segmentos muestran valores similares (diferencia: ${absDiff.toFixed(2)} puntos)`;
    }
    
    return `${metric}: ${higherSegment} supera a ${lowerSegment} por ${absDiff.toFixed(2)} puntos (${higherValue.toFixed(2)} vs ${lowerValue.toFixed(2)})`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="mr-3">⚖️</span>
        Comparación entre Segmentos
      </h2>
      
      {/* Gráfico de barras comparativo */}
      <div className="mb-8 bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Métricas por Segmento
        </h3>
        <div style={{ height: 450 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 40, left: 30, bottom: 100 }}
              barCategoryGap="20%"
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.7} />
              <XAxis 
                dataKey="metric" 
                tick={{ 
                  fontSize: 11, 
                  fill: '#4A5568',
                  textAnchor: 'end'
                }}
                angle={-45}
                textAnchor="end"
                height={90}
                interval={0}
                axisLine={{ stroke: '#CBD5E0' }}
                tickLine={{ stroke: '#CBD5E0' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#4A5568' }}
                domain={[0, 10]}
                tickCount={6}
                axisLine={{ stroke: '#CBD5E0' }}
                tickLine={{ stroke: '#CBD5E0' }}
                label={{ 
                  value: 'Puntuación (0-10)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '12px', fill: '#4A5568' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar 
                dataKey="personas" 
                name="👥 Personas"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
              <Bar 
                dataKey="empresas" 
                name="🏢 Empresarial"
                fill="#F97316"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights principales */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Insights Clave
        </h3>
        <div className="p-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-blue-200">
          <div className="grid gap-3">
            {topDifferences.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-5 border-l-4 border-blue-400 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">{getInsightIcon(item.difference)}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {getInsightText(item.metric, item.difference, item.personas, item.empresas)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      Math.abs(item.difference) < 0.5 
                        ? 'text-gray-600' 
                        : item.difference > 0 
                          ? 'text-blue-600' 
                          : 'text-orange-600'
                    }`}>
                      {item.difference > 0 ? '+' : ''}{item.difference.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h4 className="font-semibold text-blue-800 text-sm">Promedio Personas</h4>
          <p className="text-xl font-bold text-blue-600">
            {Array.isArray(comparisonData) && comparisonData.length > 0
              ? (comparisonData.reduce((sum, item) => sum + (item?.personas || 0), 0) / comparisonData.length).toFixed(2)
              : '0.0'
            }
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <h4 className="font-semibold text-orange-800 text-sm">Promedio Empresas</h4>
          <p className="text-xl font-bold text-orange-600">
            {Array.isArray(comparisonData) && comparisonData.length > 0
              ? (comparisonData.reduce((sum, item) => sum + (item?.empresas || 0), 0) / comparisonData.length).toFixed(2)
              : '0.0'
            }
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <h4 className="font-semibold text-green-800 text-sm">Mayor Diferencia</h4>
          <p className="text-xl font-bold text-green-600">
            {Array.isArray(comparisonData) && comparisonData.length > 0
              ? Math.max(...comparisonData.map(item => Math.abs(item?.difference || 0))).toFixed(2)
              : '0.0'
            }
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <h4 className="font-semibold text-purple-800 text-sm">Diferencia Promedio</h4>
          <p className="text-xl font-bold text-purple-600">
            {Array.isArray(comparisonData) && comparisonData.length > 0
              ? (comparisonData.reduce((sum, item) => sum + Math.abs(item?.difference || 0), 0) / comparisonData.length).toFixed(2)
              : '0.0'
            }
          </p>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Tabla Detallada</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métrica
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  👥 Personas
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  🏢 Empresas
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diferencia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(comparisonData) && comparisonData.length > 0 ? comparisonData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {item?.metric || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-blue-600 font-semibold">
                    {(item?.personas || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-orange-600 font-semibold">
                    {(item?.empresas || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center font-semibold">
                    <span className={`${
                      Math.abs(item?.difference || 0) < 0.5 
                        ? 'text-gray-600' 
                        : (item?.difference || 0) > 0 
                          ? 'text-blue-600' 
                          : 'text-orange-600'
                    }`}>
                      {(item?.difference || 0) > 0 ? '+' : ''}{(item?.difference || 0).toFixed(2)}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No hay datos disponibles para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;