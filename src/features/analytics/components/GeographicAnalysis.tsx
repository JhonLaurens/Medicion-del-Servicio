import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { satisfactionDataService } from '../../../services/dataService';
import { GeographicData } from '../../../types';

const GeographicAnalysis: React.FC = () => {
  const [cityData, setCityData] = useState<GeographicData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await satisfactionDataService.loadData();
        const data = satisfactionDataService.getCityData();
        setCityData(data);
        // Establecer la primera ciudad como seleccionada por defecto
        if (data.length > 0 && !selectedCity) {
          setSelectedCity(data[0].ciudad);
        }
      } catch (error) {
        console.error('Error loading geographic data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedCityData = cityData.find(city => city.ciudad === selectedCity);

  // Calcular promedio nacional
  const nationalAverage = cityData.length > 0 
    ? cityData.reduce((sum, city) => sum + city.metricas.satisfaccion_general, 0) / cityData.length 
    : 0;

  const prepareChartData = (cityData: GeographicData) => [
    { metric: 'Claridad Información', value: cityData.metricas.claridad_informacion, comparison: cityData.comparison.claridad_informacion },
    { metric: 'Satisfacción General', value: cityData.metricas.satisfaccion_general, comparison: cityData.comparison.satisfaccion_general },
    { metric: 'Recomendación', value: cityData.metricas.recomendacion, comparison: cityData.comparison.recomendacion },
    { metric: 'Lealtad', value: cityData.metricas.lealtad, comparison: cityData.comparison.lealtad }
  ];

  // Preparar datos para tabla comparativa mejorada
  const prepareTableData = () => {
    return cityData
      .sort((a, b) => b.metricas.satisfaccion_general - a.metricas.satisfaccion_general)
      .map((city, index) => ({
        ...city,
        brecha: city.metricas.satisfaccion_general - nationalAverage,
        rank: index + 1
      }));
  };

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
        <div className="bg-white p-4 border-2 border-gray-200 rounded-xl shadow-2xl max-w-sm">
          <p className="font-bold text-gray-800 mb-3 text-center border-b pb-2 text-lg">{label}</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ciudad ({selectedCityData.ciudad}):</span>
              <span className="text-xl font-bold text-blue-600">
                {typeof data.value === 'number' ? data.value.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Promedio Nacional:</span>
              <span className="text-lg font-semibold text-gray-700">
                {nationalAverage.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Diferencia:</span>
              <span className={`text-lg font-bold ${
                data.value > nationalAverage ? 'text-green-600' : 
                data.value < nationalAverage ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {data.value > nationalAverage ? '+' : ''}{(data.value - nationalAverage).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Comparación:</span>
              <div className="flex items-center space-x-2">
                {getComparisonIcon(data.comparison)}
                <span className={`text-sm font-semibold ${
                  data.comparison === 'higher' ? 'text-green-600' : 
                  data.comparison === 'lower' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {data.comparison === 'higher' ? 'Superior' : 
                   data.comparison === 'lower' ? 'Inferior' : 'Similar'}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Análisis Geográfico</h1>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <strong>Cargando...</strong> Preparando análisis geográfico por ciudades...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cityData.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Análisis Geográfico</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Sin datos:</strong> No se encontraron datos geográficos para realizar el análisis.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tableData = prepareTableData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        
        {/* Header Profesional Mejorado */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-4xl font-bold mb-2">Análisis Geográfico por Ciudad</h1>
                <p className="text-brand-light text-lg font-medium">
                  Análisis comparativo de satisfacción por ubicación geográfica
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{cityData.length}</div>
                    <div className="text-sm text-brand-light">Ciudades Analizadas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Comparación Mejorada */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Ranking Nacional por Ciudad</h2>
                <p className="text-gray-300">Comparación detallada de resultados y posicionamiento</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ciudad</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Encuestados</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Satisfacción Promedio</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Brecha vs. Nacional</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Posición</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((city, index) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                        selectedCity === city.ciudad ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedCity(city.ciudad)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="font-semibold text-gray-900">{city.ciudad}</div>
                          {city.ciudad === selectedCity && (
                            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Seleccionada
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-900 font-medium">{city.total_encuestados}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-lg font-bold text-blue-600">
                            {city.metricas.satisfaccion_general.toFixed(2)}
                          </span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.round(city.metricas.satisfaccion_general) ? 'text-yellow-400' : 'text-gray-300'}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`font-bold ${
                            city.brecha > 0.2 ? 'text-green-600' :
                            city.brecha < -0.2 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {city.brecha > 0 ? '+' : ''}{city.brecha.toFixed(2)}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            city.brecha > 0.2 ? 'bg-green-500' :
                            city.brecha < -0.2 ? 'bg-red-500' : 
                            'bg-gray-400'
                          }`}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                          index < 2 ? 'bg-green-100 text-green-800' :
                          index >= tableData.length - 2 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          #{index + 1}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Comparación vs. Promedio Nacional */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Comparación vs. Promedio Nacional</h2>
                <p className="text-blue-100">Posicionamiento de cada ciudad respecto al benchmark nacional</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-800">Superior</h3>
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-2">
                  {tableData.filter(c => c.brecha > 0.1).length}
                </p>
                <p className="text-green-600 text-sm">Por encima del promedio nacional</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-800">Similar</h3>
                  <span className="text-2xl">⚖️</span>
                </div>
                <p className="text-3xl font-bold text-blue-700 mb-2">
                  {tableData.filter(c => Math.abs(c.brecha) <= 0.1).length}
                </p>
                <p className="text-blue-600 text-sm">Alineado al promedio nacional</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-orange-800">Inferior</h3>
                  <span className="text-2xl">📉</span>
                </div>
                <p className="text-3xl font-bold text-orange-700 mb-2">
                  {tableData.filter(c => c.brecha < -0.1).length}
                </p>
                <p className="text-orange-600 text-sm">Por debajo del promedio nacional</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-800">📈 Promedio Nacional</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-700">{nationalAverage.toFixed(2)}</span>
                  <p className="text-blue-600 text-sm">Satisfacción promedio</p>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className={`bg-blue-600 h-2 rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(100, Math.max(0, (nationalAverage / 5) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Análisis Detallado por Ciudad Seleccionada */}
        {selectedCityData && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Análisis Detallado: {selectedCityData.ciudad}</h2>
                  <p className="text-purple-100">Desglose de métricas y comparación vs. promedio nacional</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {/* KPI Header de la Ciudad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-center">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Satisfacción General</h3>
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    {selectedCityData.metricas.satisfaccion_general.toFixed(2)}
                  </p>
                  <div className="flex justify-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(selectedCityData.metricas.satisfaccion_general) ? 'text-yellow-400' : 'text-gray-300'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Total Encuestados</h3>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {selectedCityData.total_encuestados}
                  </p>
                  <p className="text-green-600 text-sm">Muestra representativa</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 text-center">
                  <h3 className="text-lg font-bold text-purple-800 mb-2">Ranking Nacional</h3>
                  <p className="text-4xl font-bold text-purple-600 mb-2">
                    #{tableData.findIndex(c => c.ciudad === selectedCityData.ciudad) + 1}
                  </p>
                  <p className="text-purple-600 text-sm">de {cityData.length} ciudades</p>
                </div>
              </div>

              {/* Gráfico de Métricas */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Desglose por Métrica vs. Promedio Nacional</h3>
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <div className="h-96 sm:h-[28rem]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareChartData(selectedCityData)}
                        margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
                        <XAxis 
                          dataKey="metric" 
                          tick={{ fontSize: 11, fill: '#374151' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis 
                          domain={[0, 5]} 
                          tick={{ fontSize: 12, fill: '#374151' }}
                          label={{ value: 'Puntuación (1-5)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          radius={[4, 4, 0, 0]}
                          stroke="#ffffff"
                          strokeWidth={2}
                        >
                          {prepareChartData(selectedCityData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getComparisonColor(entry.comparison)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Leyenda de colores */}
                  <div className="mt-4 flex justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-gray-600">Superior al promedio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-gray-600">Similar al promedio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-gray-600">Inferior al promedio</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas Detalladas */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-blue-800">Claridad Información</h4>
                    {getComparisonIcon(selectedCityData.comparison.claridad_informacion)}
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {selectedCityData.metricas.claridad_informacion.toFixed(2)}
                  </p>
                  <p className="text-blue-600 text-xs">
                    {selectedCityData.comparison.claridad_informacion === 'higher' ? 'Superior al promedio' :
                     selectedCityData.comparison.claridad_informacion === 'lower' ? 'Por debajo del promedio' :
                     'Similar al promedio'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-green-800">Satisfacción General</h4>
                    {getComparisonIcon(selectedCityData.comparison.satisfaccion_general)}
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    {selectedCityData.metricas.satisfaccion_general.toFixed(2)}
                  </p>
                  <p className="text-green-600 text-xs">
                    {selectedCityData.comparison.satisfaccion_general === 'higher' ? 'Superior al promedio' :
                     selectedCityData.comparison.satisfaccion_general === 'lower' ? 'Por debajo del promedio' :
                     'Similar al promedio'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-purple-800">Recomendación</h4>
                    {getComparisonIcon(selectedCityData.comparison.recomendacion)}
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mb-2">
                    {selectedCityData.metricas.recomendacion.toFixed(2)}
                  </p>
                  <p className="text-purple-600 text-xs">
                    {selectedCityData.comparison.recomendacion === 'higher' ? 'Superior al promedio' :
                     selectedCityData.comparison.recomendacion === 'lower' ? 'Por debajo del promedio' :
                     'Similar al promedio'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-amber-800">Lealtad</h4>
                    {getComparisonIcon(selectedCityData.comparison.lealtad)}
                  </div>
                  <p className="text-2xl font-bold text-amber-600 mb-2">
                    {selectedCityData.metricas.lealtad.toFixed(2)}
                  </p>
                  <p className="text-amber-600 text-xs">
                    {selectedCityData.comparison.lealtad === 'higher' ? 'Superior al promedio' :
                     selectedCityData.comparison.lealtad === 'lower' ? 'Por debajo del promedio' :
                     'Similar al promedio'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leyenda e Información */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">Interpretación de Resultados</h2>
                <p className="text-gray-300">Guía para entender las comparaciones y tendencias geográficas</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-2xl">📖</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start space-x-4">
                <span className="text-green-500 text-2xl">↗️</span>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Superior</h4>
                  <p className="text-sm text-gray-600">Por encima del promedio nacional</p>
                  <p className="text-xs text-gray-500 mt-1">Indica excelencia en la métrica analizada</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-yellow-500 text-2xl">➡️</span>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Similar</h4>
                  <p className="text-sm text-gray-600">Equivalente al promedio nacional</p>
                  <p className="text-xs text-gray-500 mt-1">Performance alineada al estándar</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-red-500 text-2xl">↘️</span>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Inferior</h4>
                  <p className="text-sm text-gray-600">Por debajo del promedio nacional</p>
                  <p className="text-xs text-gray-500 mt-1">Oportunidad de mejora identificada</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">📊 Información del Estudio</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Escala:</strong> 1-5 (1=Muy Insatisfecho, 5=Muy Satisfecho)</p>
                  <p><strong>Cobertura:</strong> {cityData.length} ciudades principales</p>
                </div>
                <div>
                  <p><strong>Total Encuestados:</strong> {cityData.reduce((sum, city) => sum + city.total_encuestados, 0).toLocaleString()}</p>
                  <p><strong>Promedio Nacional:</strong> {nationalAverage.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicAnalysis;
