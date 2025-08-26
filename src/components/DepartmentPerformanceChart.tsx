
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DepartmentPerformanceData } from '../types';

interface DepartmentPerformanceChartProps {
  data: DepartmentPerformanceData[];
}

const DepartmentPerformanceChart: React.FC<DepartmentPerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Department Performance (Avg. Rating)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" domain={[1, 5]} tick={{ fontSize: 11, fill: '#4A5568' }} />
            <YAxis dataKey="department" type="category" width={140} tick={{ fontSize: 9, fill: '#4A5568' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
              formatter={(value: number, name: string, props: any) => [`${value} (Responses: ${props.payload.totalResponses})`, name]}
            />
            <Legend />
            <Bar dataKey="averageRating" name="Avg. Rating" fill="#004F64" radius={[0, 4, 4, 0]} barSize={20}/>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500">No data available for department performance.</div>
      )}
    </div>
  );
};

export default DepartmentPerformanceChart;
