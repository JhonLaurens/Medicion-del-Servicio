import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { satisfactionDataService } from '../services/dataService';
import { SuggestionData } from '../types';

const SuggestionsAnalysis: React.FC = () => {
  const [suggestionData, setSuggestionData] = useState<SuggestionData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await satisfactionDataService.loadData();
      setSuggestionData(satisfactionDataService.getSuggestionData());
    };

    loadData();
  }, []);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const preparePieData = () => 
    suggestionData.map((item, index) => ({
      name: item.categoria,
      value: item.porcentaje,
      color: colors[index % colors.length]
    }));

  const prepareDetailedData = () => {
    const allDetails: Array<{ sugerencia: string; porcentaje: number }> = [];
    suggestionData.forEach(category => {
      if (category.detalles) {
        allDetails.push(...category.detalles);
      }
    });
    return allDetails.sort((a, b) => b.porcentaje - a.porcentaje);
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.payload.color }}>
            {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-lg font-bold text-blue-600">
            {payload[0].value}% de menciones
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Recomendaciones y Sugerencias de los Clientes</h1>
        <p className="text-gray-600">Análisis de la retroalimentación cualitativa recibida</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {suggestionData.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{category.categoria}</h3>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
            </div>
            <p className="text-3xl font-bold mb-2" style={{ color: colors[index % colors.length] }}>
              {category.porcentaje}%
            </p>
            <p className="text-sm text-gray-500">del total de sugerencias</p>
            {category.detalles && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Principales menciones:</p>
                <div className="space-y-1">
                  {category.detalles.slice(0, 2).map((detail, detailIndex) => (
                    <div key={detailIndex} className="text-xs text-gray-700">
                      • {detail.sugerencia} ({detail.porcentaje}%)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart - Categories */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Categorías de Sugerencias</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={preparePieData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedPieLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {preparePieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {preparePieData().map((entry, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-700">{entry.name}</span>
                <span className="text-sm font-semibold text-gray-800">({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - Detailed Suggestions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Detalle de Sugerencias</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareDetailedData()}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="sugerencia" 
                  width={200}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="porcentaje" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                >
                  {prepareDetailedData().map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid lg:grid-cols-3 gap-6">
        {suggestionData.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <h3 className="text-lg font-semibold text-gray-800">{category.categoria}</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-3xl font-bold mb-1" style={{ color: colors[index % colors.length] }}>
                {category.porcentaje}%
              </p>
              <p className="text-sm text-gray-500">del total de sugerencias</p>
            </div>

            {category.detalles && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Sugerencias específicas:</h4>
                <div className="space-y-3">
                  {category.detalles.map((detail, detailIndex) => (
                    <div key={detailIndex} className="border-l-4 border-gray-200 pl-3">
                      <p className="text-sm text-gray-800 font-medium">{detail.sugerencia}</p>
                      <p className="text-xs text-gray-500 mt-1">{detail.porcentaje}% de menciones</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Principales Hallazgos</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-blue-800 mb-3">Oportunidades de Mejora</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Atención al Cliente:</strong> Mejorar la amabilidad y reducir tiempos de respuesta en contact center</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Productos Financieros:</strong> Revisar tasas de interés y tarifas para ser más competitivos</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Tecnología:</strong> Invertir en mejoras tecnológicas para optimizar la experiencia digital</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-green-800 mb-3">Fortalezas Reconocidas</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Atención Personal:</strong> Reconocimiento por buena atención y amabilidad del personal</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Servicios:</strong> Satisfacción general con los servicios ofrecidos</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Confianza:</strong> Los clientes muestran lealtad hacia la marca</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsAnalysis;
