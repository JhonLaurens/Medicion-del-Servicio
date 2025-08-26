import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DistributionData {
  rating: string;
  label: string;
  personas: number;
  empresas: number;
  personas_percent: number;
  empresas_percent: number;
}

interface ImprovedDistributionChartProps {
  data: DistributionData[];
  title: string;
}

const ImprovedDistributionChart: React.FC<ImprovedDistributionChartProps> = ({ 
  data, 
  title
}) => {
  // Colores mejorados basados en la marca
  const colors = {
    personas: '#1a5f7a',    // Azul corporativo Coltefinanciera
    empresas: '#2c8aa6',    // Azul claro corporativo
    background: '#f8fafc'
  };

  // Tooltip personalizado con mejor legibilidad
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-xl max-w-xs">
          <p className="font-bold text-gray-800 mb-3 text-center border-b pb-2">
            {label}
          </p>
          
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <span 
                    className={`w-3 h-3 rounded-full mr-2 ${entry.dataKey === 'personas_percent' ? 'bg-brand-primary' : 'bg-brand-secondary'}`}
                  ></span>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {entry.dataKey.replace('_percent', '')}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${entry.dataKey === 'personas_percent' ? 'text-brand-primary' : 'text-brand-secondary'}`}>
                    {entry.value}%
                  </span>
                  <div className="text-xs text-gray-500">
                    ({Math.round(entry.payload[`${entry.dataKey}_count`] || 0)} respuestas)
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Análisis de brecha */}
          <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 text-center border border-blue-200">
            <p className="text-xs text-gray-600">Diferencia: {Math.abs(payload[0].value - payload[1].value).toFixed(1)}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header mejorado */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">Distribución de calificaciones por segmento</p>
      </div>

      {/* Gráfico de barras agrupadas */}
      <div className="h-80 sm:h-96 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="label" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
              stroke="#64748b"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              fontSize={12}
              stroke="#64748b"
              label={{ 
                value: 'Porcentaje (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Barras para segmento Personas */}
            <Bar 
              dataKey="personas_percent" 
              name="personas"
              fill={colors.personas}
              radius={[2, 2, 0, 0]}
              stroke="#ffffff"
              strokeWidth={1}
            />
            
            {/* Barras para segmento Empresas */}
            <Bar 
              dataKey="empresas_percent" 
              name="empresas"
              fill={colors.empresas}
              radius={[2, 2, 0, 0]}
              stroke="#ffffff"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda mejorada */}
      <div className="flex justify-center space-x-6 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <span className="w-4 h-4 rounded mr-2 bg-brand-primary"></span>
          <span className="text-sm font-medium text-gray-700">Segmento Personas</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded mr-2 bg-brand-secondary"></span>
          <span className="text-sm font-medium text-gray-700">Segmento Empresas</span>
        </div>
      </div>
    </div>
  );
};

export default ImprovedDistributionChart;
