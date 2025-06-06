import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { satisfactionDataService } from '../services/dataService';
import { KPIData } from '../types';

const SegmentAnalysis: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await satisfactionDataService.loadData();
      setKpiData(satisfactionDataService.getKPIData());
    };

    loadData();
  }, []);

  const colors = ['#1e40af', '#fbbf24', '#9ca3af'];

  const preparePieData = (segmentData: any) => {
    if (!segmentData || typeof segmentData !== 'object') {
      return [
        { name: 'Calificación 5', value: 0, color: '#1e40af' },
        { name: 'Calificación 4', value: 0, color: '#fbbf24' },
        { name: 'Calificación 1-3', value: 0, color: '#9ca3af' }
      ];
    }
    return [
      { name: 'Calificación 5', value: typeof segmentData.rating5 === 'number' ? segmentData.rating5 : 0, color: '#1e40af' },
      { name: 'Calificación 4', value: typeof segmentData.rating4 === 'number' ? segmentData.rating4 : 0, color: '#fbbf24' },
      { name: 'Calificación 1-3', value: typeof segmentData.rating123 === 'number' ? segmentData.rating123 : 0, color: '#9ca3af' }
    ];
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.payload.color }}>
            {typeof data.value === 'number' ? data.value.toFixed(1) : '0.0'}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show label for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const SegmentCard: React.FC<{ title: string; segment: 'personas' | 'empresarial' }> = ({ title, segment }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                {kpi.metric === 'Satisfacción General' ? 'Satisfacción' : 
                 kpi.metric === 'Nivel de Recomendación' ? 'Recomendación' :
                 kpi.metric}
              </h4>
              <p className="text-3xl font-bold text-blue-600">
                {typeof kpi[segment]?.average === 'number' ? kpi[segment].average.toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-gray-500">Promedio</p>
            </div>
          ))}
        </div>
        {/* Pie Charts */}
        <div className="grid grid-cols-2 gap-6">
          {kpiData.map((kpi, index) => {
            const pieData = preparePieData(kpi[segment]);
            const allZero = pieData.every(d => d.value === 0);
            return (
              <div key={index} className="text-center">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  {kpi.metric === 'Satisfacción General' ? 'Satisfacción' : 
                   kpi.metric === 'Nivel de Recomendación' ? 'Recomendación' :
                   kpi.metric}
                </h4>
                <div className="h-64">
                  {allZero ? (
                    <div className="flex items-center justify-center h-full text-gray-400">No hay datos para mostrar</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%" minHeight={256} minWidth={256}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, entryIndex) => (
                            <Cell key={`cell-${entryIndex}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Análisis Comparativo por Segmento</h1>
        <p className="text-gray-600">Comparación detallada entre los segmentos Personas y Empresas</p>
      </div>

      {/* Comparison Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumen Comparativo</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Métrica</th>
                <th className="text-center py-3 px-4 font-semibold text-blue-600">Personas</th>
                <th className="text-center py-3 px-4 font-semibold text-purple-600">Empresas</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {kpiData.map((kpi, index) => {
                const personasAvg = typeof kpi.personas?.average === 'number' ? kpi.personas.average : 0;
                const empresarialAvg = typeof kpi.empresarial?.average === 'number' ? kpi.empresarial.average : 0;
                const diff = personasAvg - empresarialAvg;
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-800">{kpi.metric}</td>
                    <td className="text-center py-3 px-4 text-blue-600 font-bold">
                      {personasAvg.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-4 text-purple-600 font-bold">
                      {empresarialAvg.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-semibold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                        {diff > 0 && <span className="ml-1">↗</span>}
                        {diff < 0 && <span className="ml-1">↘</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Analysis by Segment */}
      <div className="grid lg:grid-cols-2 gap-8">
        <SegmentCard title="Segmento Personas" segment="personas" />
        <SegmentCard title="Segmento Empresas" segment="empresarial" />
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Interpretación de Calificaciones</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <div>
              <p className="font-medium text-gray-800">Calificación 5</p>
              <p className="text-sm text-gray-600">Muy Satisfecho / Muy Probable</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <div>
              <p className="font-medium text-gray-800">Calificación 4</p>
              <p className="text-sm text-gray-600">Satisfecho / Probable</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <div>
              <p className="font-medium text-gray-800">Calificación 1-3</p>
              <p className="text-sm text-gray-600">Neutral / Insatisfecho</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentAnalysis;
