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
      const total = data.name.includes('Personas') ? personasTotal : empresasTotal;
      const percentage = ((data.value / total) * 100).toFixed(2);
      
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xl">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <p className="font-semibold text-slate-800 text-sm">{data.name}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm">Respuestas:</span>
              <span className="font-bold text-slate-800">{data.value.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm">Porcentaje:</span>
              <span className="font-bold text-blue-600">{percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any, total: number) => {
    const percentage = ((entry.value / total) * 100).toFixed(2);
    return `${percentage}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="mr-3">📈</span>
        Distribución de Calificaciones
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribución Personas */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Distribución - Personas
          </h3>
        {personasData.length > 0 ? (
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 30, right: 30, bottom: 50, left: 30 }}>
                <Pie
                  data={personasData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={(entry) => renderCustomLabel(entry, personasTotal)}
                  outerRadius="60%"
                  innerRadius="25%"
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {personasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-lg font-medium mb-1">Sin datos disponibles</div>
              <div className="text-sm text-gray-400">No hay información para personas</div>
            </div>
          </div>
        )}
      </div>

        {/* Distribución Empresarial */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
            <span className="mr-2">🏢</span>
            Distribución - Empresarial
          </h3>
        {empresasData.length > 0 ? (
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 30, right: 30, bottom: 50, left: 30 }}>
                <Pie
                  data={empresasData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={(entry) => renderCustomLabel(entry, empresasTotal)}
                  outerRadius="60%"
                  innerRadius="25%"
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {empresasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">🏢</div>
              <div className="text-lg font-medium mb-1">Sin datos disponibles</div>
              <div className="text-sm text-gray-400">No hay información para empresarial</div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default DistributionCharts;