
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyTrendData } from '../types';

interface SatisfactionTrendChartProps {
  data: MonthlyTrendData[];
}

const SatisfactionTrendChart: React.FC<SatisfactionTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Satisfaction Trend (Monthly Avg.)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4A5568' }} />
            <YAxis domain={[1, 5]} tick={{ fontSize: 12, fill: '#4A5568' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
            />
            <Legend />
            <Line type="monotone" dataKey="averageRating" name="Avg. Rating" stroke="#007A7A" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4, fill: '#007A7A' }}/>
          </LineChart>
        </ResponsiveContainer>
      ) : (
         <div className="flex items-center justify-center h-full text-slate-500">No data available for trend analysis.</div>
      )}
    </div>
  );
};

export default SatisfactionTrendChart;
