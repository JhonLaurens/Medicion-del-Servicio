
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface RatingDistributionChartProps {
  data: ChartDataPoint[];
}

const CHART_COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884D8']; // Example colors for ratings 1-5

const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ data }) => {
  const chartData = data.map((item, index) => ({ ...item, fill: CHART_COLORS[index % CHART_COLORS.length] }));
  
  // Calcular altura dinámica basada en el contenido
  const chartHeight = Math.max(350, data.length * 40 + 100);
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg" style={{ minHeight: `${chartHeight + 100}px` }}>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4">Distribución de Calificaciones</h3>
      {data.length > 0 ? (
        <div className="w-full" style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ 
                top: 20, 
                right: 30, 
                left: 40, 
                bottom: 90 
              }}
              barCategoryGap="15%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.7} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                interval={0} 
                tick={{ 
                  fontSize: 10, 
                  fill: '#4A5568',
                  textAnchor: 'end'
                }} 
                axisLine={{ stroke: '#CBD5E0' }}
                tickLine={{ stroke: '#CBD5E0' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#4A5568' }} 
                allowDecimals={false}
                axisLine={{ stroke: '#CBD5E0' }}
                tickLine={{ stroke: '#CBD5E0' }}
                label={{ 
                  value: 'Número de Respuestas', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '12px', fill: '#4A5568' }
                }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#2D3748', marginBottom: '4px' }}
                formatter={(value: number, _name: string, props: any) => [
                  `${value.toLocaleString()} respuestas`, 
                  props.payload.name
                ]}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '15px' }}
                iconType="rect"
              />
              <Bar 
                dataKey="value" 
                name="Respuestas" 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
                fill="url(#colorGradient)"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-slate-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-lg font-medium mb-1">Sin datos disponibles</div>
            <div className="text-sm text-gray-400">No hay información para mostrar la distribución</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingDistributionChart;
