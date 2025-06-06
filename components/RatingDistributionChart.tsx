
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface RatingDistributionChartProps {
  data: ChartDataPoint[];
}

const CHART_COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884D8']; // Example colors for ratings 1-5

const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({ data }) => {
  const chartData = data.map((item, index) => ({ ...item, fill: CHART_COLORS[index % CHART_COLORS.length] }));
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Rating Distribution</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={50} interval={0} tick={{ fontSize: 12, fill: '#4A5568' }} />
            <YAxis tick={{ fontSize: 12, fill: '#4A5568' }} allowDecimals={false}/>
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
              formatter={(value: number, name: string, props: any) => [`${value} responses`, props.payload.name]}
            />
            <Legend wrapperStyle={{paddingTop: '20px'}} />
            <Bar dataKey="value" name="Responses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500">No data available for distribution.</div>
      )}
    </div>
  );
};

export default RatingDistributionChart;
