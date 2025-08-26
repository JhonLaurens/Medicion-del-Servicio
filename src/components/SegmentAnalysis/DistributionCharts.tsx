import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface DistributionChartsProps {
  personasData: Array<{ name: string; value: number; color: string }>;
  empresasData: Array<{ name: string; value: number; color: string }>;
  personasTotal: number;
  empresasTotal: number;
  hasValidData: boolean;
}

const DistributionCharts: React.FC<DistributionChartsProps> = ({
  personasData,
  empresasData,
  personasTotal,
  empresasTotal,
  hasValidData
}) => {
  if (!hasValidData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Distribución de Calificaciones</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="text-center">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="w-80 h-80 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-blue-600">
            Respuestas: <span className="font-bold">{data.value.toLocaleString()}</span>
          </p>
          <p className="text-gray-600">
            Porcentaje: <span className="font-bold">{((data.value / (data.payload.total || 1)) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any, total: number) => {
    const percentage = ((entry.value / total) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Distribución de Calificaciones</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico Personas */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            👥 Segmento Personas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Total de respuestas: <span className="font-bold">{personasTotal.toLocaleString()}</span>
          </p>
          
          <div className="flex justify-center mb-4">
            <div className="w-80 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={personasData.map(item => ({ ...item, total: personasTotal }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => renderCustomLabel(entry, personasTotal)}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {personasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Leyenda personalizada para Personas */}
          <div className="space-y-2">
            {personasData.map((entry, index) => {
              const percentage = ((entry.value / personasTotal) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-gray-700">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">{entry.value.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico Empresas */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-orange-800 mb-4">
            🏢 Segmento Empresas
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Total de respuestas: <span className="font-bold">{empresasTotal.toLocaleString()}</span>
          </p>
          
          <div className="flex justify-center mb-4">
            <div className="w-80 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={empresasData.map(item => ({ ...item, total: empresasTotal }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => renderCustomLabel(entry, empresasTotal)}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {empresasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Leyenda personalizada para Empresas */}
          <div className="space-y-2">
            {empresasData.map((entry, index) => {
              const percentage = ((entry.value / empresasTotal) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-gray-700">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">{entry.value.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Resumen comparativo */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📊 Resumen Comparativo</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h5 className="font-semibold text-blue-800">Total Personas</h5>
            <p className="text-2xl font-bold text-blue-600">{personasTotal.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <h5 className="font-semibold text-orange-800">Total Empresas</h5>
            <p className="text-2xl font-bold text-orange-600">{empresasTotal.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h5 className="font-semibold text-gray-800">Total General</h5>
            <p className="text-2xl font-bold text-gray-600">{(personasTotal + empresasTotal).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionCharts;