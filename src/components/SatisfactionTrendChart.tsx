
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyTrendData } from '../types';

interface SatisfactionTrendChartProps {
  data: MonthlyTrendData[];
}

const SatisfactionTrendChart: React.FC<SatisfactionTrendChartProps> = ({ data }) => {
  // Calcular altura dinámica basada en el contenido
  const chartHeight = Math.max(350, data.length * 20 + 200);
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg" style={{ minHeight: `${chartHeight + 100}px` }}>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4 flex items-center">
        <span className="mr-2">📈</span>
        Tendencia de Satisfacción (Promedio Mensual)
      </h3>
      {data.length > 0 ? (
        <div className="w-full" style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ 
                top: 20, 
                right: 30, 
                left: 40, 
                bottom: 80 
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e0e0e0" 
                opacity={0.7}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                tick={{ 
                  fontSize: 10, 
                  fill: '#4A5568'
                }}
                axisLine={{ stroke: '#CBD5E0' }}
                tickLine={{ stroke: '#CBD5E0' }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                domain={[0, 5]} 
                tick={{ fontSize: 11, fill: '#4A5568' }} 
                allowDecimals={true}
                axisLine={{ stroke: '#CBD5E0' }}
                tickLine={{ stroke: '#CBD5E0' }}
                label={{ 
                  value: 'Calificación Promedio', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '12px', fill: '#4A5568' }
                }}
                tickCount={6}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#2D3748', marginBottom: '4px' }}
                formatter={(value: number) => [
                  `${value.toFixed(2)} puntos`,
                  'Calificación Promedio'
                ]}
                cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '15px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="averageRating" 
                name="Calificación Promedio" 
                stroke="#3B82F6" 
                strokeWidth={3}
                activeDot={{ 
                  r: 6, 
                  fill: '#3B82F6',
                  stroke: '#fff',
                  strokeWidth: 2
                }} 
                dot={{ 
                  r: 4, 
                  fill: '#3B82F6',
                  stroke: '#fff',
                  strokeWidth: 1
                }}
                connectNulls={false}
              />
              {/* Línea de referencia para el promedio ideal */}
              <Line 
                type="monotone" 
                dataKey={() => 4.0} 
                name="Meta (4.0)" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-slate-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-lg font-medium mb-1">Sin datos disponibles</div>
            <div className="text-sm text-gray-400">No hay información para el análisis de tendencias</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatisfactionTrendChart;
