import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { satisfactionDataService } from '../services/dataService';
import { GeographicData } from '../types';

const GeographicAnalysis: React.FC = () => {
  const [cityData, setCityData] = useState<GeographicData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      await satisfactionDataService.loadData();
      const data = satisfactionDataService.getCityData();
      setCityData(data);
      if (data.length > 0) {
        setSelectedCity(data[0].ciudad);
      }
    };

    loadData();
  }, []);

  const selectedCityData = cityData.find(city => city.ciudad === selectedCity);

  const prepareChartData = (cityData: GeographicData) => [
    { metric: 'Claridad Información', value: cityData.metricas.claridad_informacion, comparison: cityData.comparison.claridad_informacion },
    { metric: 'Satisfacción General', value: cityData.metricas.satisfaccion_general, comparison: cityData.comparison.satisfaccion_general },
    { metric: 'Recomendación', value: cityData.metricas.recomendacion, comparison: cityData.comparison.recomendacion },
    { metric: 'Lealtad', value: cityData.metricas.lealtad, comparison: cityData.comparison.lealtad }
  ];

  const getComparisonIcon = (comparison: 'higher' | 'equal' | 'lower') => {
    switch (comparison) {
      case 'higher':
        return <span className="text-green-500 text-lg">↗️</span>;
      case 'lower':
        return <span className="text-red-500 text-lg">↘️</span>;
      default:
        return <span className="text-yellow-500 text-lg">➡️</span>;
    }
  };

  const getComparisonColor = (comparison: 'higher' | 'equal' | 'lower') => {
    switch (comparison) {
      case 'higher':
        return '#10b981';
      case 'lower':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-lg font-bold text-blue-600 mb-2">
            Promedio: {typeof data.value === 'number' ? data.value.toFixed(2) : '0.00'}
          </p>
          <div className="flex items-center space-x-2">
            {getComparisonIcon(data.comparison)}
            <span className="text-sm text-gray-600">
              vs. Promedio Nacional
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Resultados por Ciudad</h1>
        <p className="text-gray-600">Análisis geográfico del desempeño por ubicación</p>
      </div>

      {/* City Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cityData.map((city, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-200 border-2 ${
              selectedCity === city.ciudad ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setSelectedCity(city.ciudad)}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{city.ciudad}</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">{city.total_encuestados}</p>
            <p className="text-sm text-gray-500">encuestados</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">Satisfacción Promedio</p>
              <p className="text-xl font-bold text-green-600">{typeof city.metricas.satisfaccion_general === 'number' ? city.metricas.satisfaccion_general.toFixed(2) : '0.00'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* City Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Seleccionar Ciudad para Análisis Detallado</h2>
        <div className="flex flex-wrap gap-3">
          {cityData.map((city, index) => (
            <button
              key={index}
              onClick={() => setSelectedCity(city.ciudad)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedCity === city.ciudad
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city.ciudad}
            </button>
          ))}
        </div>
      </div>

      {/* Selected City Analysis */}
      {selectedCityData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedCityData.ciudad}</h2>
              <p className="text-gray-600">{selectedCityData.total_encuestados} encuestados</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Satisfacción General</p>
              <p className="text-4xl font-bold text-blue-600">{typeof selectedCityData.metricas.satisfaccion_general === 'number' ? selectedCityData.metricas.satisfaccion_general.toFixed(2) : '0.00'}</p>
            </div>
          </div>

          {/* Metrics Chart */}
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareChartData(selectedCityData)}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis type="category" dataKey="metric" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                >
                  {prepareChartData(selectedCityData).map((entry, index) => (
                    <Bar key={`cell-${index}`} fill={getComparisonColor(entry.comparison)} dataKey="value" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-800">Claridad Información</h4>
                {getComparisonIcon(selectedCityData.comparison.claridad_informacion)}
              </div>
              <p className="text-2xl font-bold text-blue-600">{typeof selectedCityData.metricas.claridad_informacion === 'number' ? selectedCityData.metricas.claridad_informacion.toFixed(2) : '0.00'}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-green-800">Satisfacción General</h4>
                {getComparisonIcon(selectedCityData.comparison.satisfaccion_general)}
              </div>
              <p className="text-2xl font-bold text-green-600">{typeof selectedCityData.metricas.satisfaccion_general === 'number' ? selectedCityData.metricas.satisfaccion_general.toFixed(2) : '0.00'}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-purple-800">Recomendación</h4>
                {getComparisonIcon(selectedCityData.comparison.recomendacion)}
              </div>
              <p className="text-2xl font-bold text-purple-600">{typeof selectedCityData.metricas.recomendacion === 'number' ? selectedCityData.metricas.recomendacion.toFixed(2) : '0.00'}</p>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-amber-800">Lealtad</h4>
                {getComparisonIcon(selectedCityData.comparison.lealtad)}
              </div>
              <p className="text-2xl font-bold text-amber-600">{typeof selectedCityData.metricas.lealtad === 'number' ? selectedCityData.metricas.lealtad.toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparación vs. Promedio Nacional</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-xl">↗️</span>
            <div>
              <p className="font-medium text-gray-800">Superior</p>
              <p className="text-sm text-gray-600">Por encima del promedio nacional</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-yellow-500 text-xl">➡️</span>
            <div>
              <p className="font-medium text-gray-800">Similar</p>
              <p className="text-sm text-gray-600">Equivalente al promedio nacional</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-red-500 text-xl">↘️</span>
            <div>
              <p className="font-medium text-gray-800">Inferior</p>
              <p className="text-sm text-gray-600">Por debajo del promedio nacional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicAnalysis;
