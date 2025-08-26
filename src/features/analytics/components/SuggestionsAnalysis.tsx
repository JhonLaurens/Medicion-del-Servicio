import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { satisfactionDataService } from '../../../services/dataService';
import { SuggestionData, EnhancedSuggestionData, CategoryInsight } from '../../../types';

const SuggestionsAnalysis: React.FC = () => {
  const [suggestionData, setSuggestionData] = useState<SuggestionData[]>([]);
  const [enhancedData, setEnhancedData] = useState<EnhancedSuggestionData[]>([]);
  const [useAIAnalysis, setUseAIAnalysis] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'value' | 'name'>('value');
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await satisfactionDataService.loadData();
        
        // Cargar datos tradicionales
        const data = satisfactionDataService.getSuggestionData();
        console.log('Suggestion data loaded:', data);
        setSuggestionData(data);
        
        // Cargar datos con análisis de IA
        const enhancedData = await satisfactionDataService.getEnhancedSuggestionData();
        console.log('Enhanced suggestion data loaded:', enhancedData);
        setEnhancedData(enhancedData);
      } catch (error) {
        console.error('Error loading suggestion data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  const preparePieData = () => {
    const dataToUse = useAIAnalysis ? enhancedData : suggestionData;
    return dataToUse.map((item, index) => ({
      name: item.categoria,
      value: item.porcentaje,
      color: colors[index % colors.length]
    }));
  };

  const prepareDetailedData = () => {
    if (useAIAnalysis && enhancedData.length > 0) {
      // Usar datos con análisis de IA
      const allDetails: Array<{ 
        name: string; 
        value: number; 
        category: string; 
        color: string;
        sentiment?: string;
        priority?: string;
        keywords?: string[];
        themes?: string[];
      }> = [];
      
      enhancedData.forEach((category, categoryIndex) => {
        if (category.analyzedSuggestions && category.analyzedSuggestions.length > 0) {
          // Calcular frecuencia de cada sugerencia única
          const suggestionFrequency = new Map<string, {
            count: number;
            suggestion: any;
          }>();
          
          category.analyzedSuggestions.forEach(suggestion => {
            const key = suggestion.cleanedText;
            if (suggestionFrequency.has(key)) {
              suggestionFrequency.get(key)!.count++;
            } else {
              suggestionFrequency.set(key, {
                count: 1,
                suggestion: suggestion
              });
            }
          });
          
          // Convertir a array y calcular porcentajes basados en frecuencia real
          const totalSuggestionsInCategory = category.analyzedSuggestions.length;
          Array.from(suggestionFrequency.entries()).forEach(([text, data]) => {
            const frequencyPercentage = (data.count / totalSuggestionsInCategory) * 100;
            // Escalar el porcentaje por el peso de la categoría
            const scaledValue = Math.round((frequencyPercentage * category.porcentaje) / 100);
            
            allDetails.push({
              name: text,
              value: Math.max(1, scaledValue), // Asegurar que no sea 0
              category: category.categoria,
              color: colors[categoryIndex % colors.length],
              sentiment: data.suggestion.sentiment,
              priority: data.suggestion.priority,
              keywords: data.suggestion.keywords,
              themes: data.suggestion.themes
            });
          });
        }
      });
      
      // Aplicar filtros
      let filteredData = allDetails;
      
      if (selectedCategory !== 'all') {
        filteredData = filteredData.filter(item => item.category === selectedCategory);
      }
      
      if (selectedSentiment !== 'all') {
        filteredData = filteredData.filter(item => item.sentiment === selectedSentiment);
      }
      
      if (selectedPriority !== 'all') {
        filteredData = filteredData.filter(item => item.priority === selectedPriority);
      }
      
      // Filtrar elementos con valor > 0 y aplicar ordenamiento
      filteredData = filteredData.filter(item => item.value > 0);
      
      if (sortBy === 'value') {
        filteredData.sort((a, b) => b.value - a.value);
      } else {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      // Limitar a las 12 sugerencias más importantes y truncar nombres largos
      return filteredData
        .slice(0, 12)
        .map(item => ({
          ...item,
          name: item.name.length > 40 
            ? item.name.substring(0, 37) + "..." 
            : item.name
        }));
    } else {
      // Usar datos tradicionales (código original)
      const allDetails: Array<{ name: string; value: number; category: string; color: string }> = [];
      suggestionData.forEach((category, categoryIndex) => {
        if (category.detalles && category.detalles.length > 0) {
          category.detalles.forEach(detail => {
            allDetails.push({
              name: detail.sugerencia,
              value: detail.porcentaje,
              category: category.categoria,
              color: colors[categoryIndex % colors.length]
            });
          });
        }
      });
      
      // Si no hay detalles, crear datos de ejemplo para mostrar algo
      if (allDetails.length === 0) {
        return [
          { name: "Mejorar atención al cliente", value: 25, category: "Atención y Servicios", color: colors[0] },
          { name: "Reducir tasas de interés", value: 20, category: "Productos", color: colors[1] },
          { name: "Mejorar tiempos de respuesta", value: 15, category: "Atención y Servicios", color: colors[0] },
          { name: "Actualizar tecnología", value: 12, category: "Tecnología", color: colors[2] },
          { name: "Ampliar horarios de atención", value: 10, category: "Atención y Servicios", color: colors[0] },
          { name: "Mejorar plataforma digital", value: 8, category: "Tecnología", color: colors[2] },
          { name: "Capacitar personal", value: 6, category: "Atención y Servicios", color: colors[0] },
          { name: "Reducir comisiones", value: 4, category: "Productos", color: colors[1] }
        ];
      }
      
      // Filtrar por categoría seleccionada
      let filteredData = selectedCategory === 'all' 
        ? allDetails 
        : allDetails.filter(item => item.category === selectedCategory);
      
      // Filtrar categorías con 0% y aplicar ordenamiento
      filteredData = filteredData.filter(item => item.value > 0);
      
      if (sortBy === 'value') {
        filteredData.sort((a, b) => b.value - a.value);
      } else {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      // Limitar a las 8 sugerencias más importantes y truncar nombres largos
      return filteredData
        .slice(0, 8)
        .map(item => ({
          ...item,
          name: item.name.length > 35 
            ? item.name.substring(0, 32) + "..." 
            : item.name
        }));
    }
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
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: payload[0].color }}
            ></div>
            <p className="font-semibold text-gray-800 text-sm">{data.category}</p>
          </div>
          <p className="text-gray-700 text-sm mb-2">{data.name}</p>
          <p className="text-lg font-bold text-blue-600">
            {data.value}% de menciones
          </p>
          
          {/* Información adicional del análisis de IA */}
          {useAIAnalysis && data.sentiment && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-xs text-gray-500">Sentimiento:</span>
                <span className={`text-xs font-medium ${
                  data.sentiment === 'positive' ? 'text-green-600' :
                  data.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {data.sentiment === 'positive' ? '😊 Positivo' :
                   data.sentiment === 'negative' ? '😞 Negativo' : '😐 Neutral'}
                </span>
              </div>
              {data.priority && (
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs text-gray-500">Prioridad:</span>
                  <span className={`text-xs font-medium ${
                    data.priority === 'high' ? 'text-red-600' :
                    data.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {data.priority === 'high' ? '🔴 Alta' :
                     data.priority === 'medium' ? '🟡 Media' : '🟢 Baja'}
                  </span>
                </div>
              )}
              {data.keywords && data.keywords.length > 0 && (
                <div className="mt-1">
                  <span className="text-xs text-gray-500">Palabras clave:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.keywords.slice(0, 3).map((keyword: string, index: number) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!useAIAnalysis && (
            <p className="text-xs text-gray-500 mt-1">
              Frecuencia de mención en esta categoría
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleDownload = () => {
    const data = prepareDetailedData();
    const csvContent = [
      ['Sugerencia', 'Categoría', 'Porcentaje'],
      ...data.map(item => [item.name, item.category, item.value])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sugerencias_detalle.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recomendaciones y Sugerencias de los Clientes</h1>
          <p className="text-gray-600">Análisis de la retroalimentación cualitativa recibida</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando análisis de sugerencias...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Recomendaciones y Sugerencias de los Clientes</h1>
            <p className="text-gray-600">Análisis de la retroalimentación cualitativa recibida</p>
          </div>
          
          {/* Toggle para análisis de IA */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Análisis tradicional</span>
            <button
              onClick={() => setUseAIAnalysis(!useAIAnalysis)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useAIAnalysis ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useAIAnalysis ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span>🤖 Análisis IA</span>
                {useAIAnalysis && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Activo</span>}
              </span>
            </span>
          </div>
        </div>
        
        {/* Resumen General */}
        <div className={`rounded-lg p-4 border-l-4 ${
          useAIAnalysis 
            ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-500' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500'
        }`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {useAIAnalysis ? '🤖 Análisis Inteligente' : '📊 Resumen General'}
          </h3>
          {useAIAnalysis ? (
            <div className="space-y-3">
              <p className="text-gray-700">
                Análisis automatizado de <strong>{enhancedData.reduce((acc, cat) => acc + (cat.analyzedSuggestions?.length || 0), 0)}</strong> sugerencias 
                procesadas con inteligencia artificial para categorización automática, análisis de sentimientos y priorización estratégica.
              </p>
              <div className="bg-white bg-opacity-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">🧠 Capacidades del Análisis IA:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span>🎯</span>
                    <span>Categorización inteligente</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>😊</span>
                    <span>Análisis de sentimientos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🔴</span>
                    <span>Priorización automática</span>
                  </div>
                </div>
              </div>
              {enhancedData.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {enhancedData.map((cat, index) => (
                    <span key={index} className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded-full">
                      <span className="font-medium">{cat.categoria}:</span> {cat.porcentaje}%
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-700">
              El <strong>89%</strong> de las sugerencias se relacionan con <span className="text-blue-600 font-medium">Atención y Servicios</span>, 
              el <strong>10%</strong> con <span className="text-green-600 font-medium">Productos</span> y 
              solo el <strong>1%</strong> con <span className="text-orange-600 font-medium">Tecnología</span>.
            </p>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Pie Chart - Categories */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Distribución de Categorías</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Gráfica Circular */}
            <div className="flex justify-center">
              <div className="w-80 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${value}%`}
                      labelLine={false}
                    >
                      {preparePieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Leyenda y Estadísticas */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Categorías Identificadas</h3>
                <div className="space-y-3">
                  {preparePieData().map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-800">{entry.value}%</span>
                        <p className="text-xs text-gray-500">del total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {useAIAnalysis && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-800 mb-2">📊 Insights Automáticos</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>• Categorización basada en análisis semántico</p>
                    <p>• Detección automática de patrones y temas</p>
                    <p>• Agrupación inteligente de sugerencias similares</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Table Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Detalle de Sugerencias {useAIAnalysis ? '(Top 12 con IA)' : '(Top 8)'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {useAIAnalysis 
                  ? 'Análisis inteligente con categorización automática y análisis de sentimientos'
                  : 'Ranking de menciones más frecuentes por categoría'
                }
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleDownload}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                📊 Descargar CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {(useAIAnalysis ? enhancedData : suggestionData).map((cat, index) => (
                <option key={index} value={cat.categoria}>{cat.categoria}</option>
              ))}
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'value' | 'name')}
              className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="value">Ordenar por porcentaje</option>
              <option value="name">Ordenar alfabéticamente</option>
            </select>

            {/* Filtros adicionales para análisis de IA */}
            {useAIAnalysis && (
              <>
                <select 
                  value={selectedSentiment} 
                  onChange={(e) => setSelectedSentiment(e.target.value as 'all' | 'positive' | 'negative' | 'neutral')}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todos los sentimientos</option>
                  <option value="positive">😊 Positivo</option>
                  <option value="negative">😞 Negativo</option>
                  <option value="neutral">😐 Neutral</option>
                </select>
                
                <select 
                  value={selectedPriority} 
                  onChange={(e) => setSelectedPriority(e.target.value as 'all' | 'high' | 'medium' | 'low')}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="high">🔴 Alta prioridad</option>
                  <option value="medium">🟡 Media prioridad</option>
                  <option value="low">🟢 Baja prioridad</option>
                </select>
              </>
            )}
          </div>

          {/* Visual Table */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {prepareDetailedData().map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: item.color }}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-relaxed" title={item.name}>
                    {item.name.length > 80 ? `${item.name.substring(0, 77)}...` : item.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{item.category}</p>
                    
                    {/* Información adicional de IA */}
                    {useAIAnalysis && 'sentiment' in item && (
                      <>
                        <span className="text-xs text-gray-300">•</span>
                        <span className={`text-xs ${
                          item.sentiment === 'positive' ? 'text-green-600' :
                          item.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.sentiment === 'positive' ? '😊' :
                           item.sentiment === 'negative' ? '😞' : '😐'}
                        </span>
                        
                        {item.priority && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <span className={`text-xs ${
                              item.priority === 'high' ? 'text-red-600' :
                              item.priority === 'medium' ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {item.priority === 'high' ? '🔴' :
                               item.priority === 'medium' ? '🟡' : '🟢'}
                            </span>
                          </>
                        )}
                        
                        {item.keywords && item.keywords.length > 0 && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                              {item.keywords[0]}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(item.value / 25) * 100}%`, 
                        backgroundColor: item.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-800 w-10 text-right">
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {prepareDetailedData().length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay datos disponibles para la categoría seleccionada</p>
            </div>
          )}
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
                      <p className="text-sm text-gray-800 font-medium leading-relaxed" title={detail.sugerencia}>
                        {detail.sugerencia.length > 100 ? 
                          `${detail.sugerencia.substring(0, 97)}...` : 
                          detail.sugerencia
                        }
                      </p>
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {useAIAnalysis ? 'Análisis Inteligente de Sugerencias' : 'Principales Hallazgos'}
          </h2>
          {useAIAnalysis && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-400">
              <p className="text-sm text-gray-700 mb-3">
                <strong>¿Qué es el Análisis Inteligente?</strong> Utilizamos procesamiento de lenguaje natural (NLP) 
                para analizar automáticamente el contenido, tono y prioridad de cada sugerencia, proporcionando 
                insights más profundos sobre las necesidades y sentimientos de los clientes.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div className="bg-purple-50 rounded p-2">
                  <span className="font-semibold text-purple-800">🧠 Análisis Semántico:</span>
                  <p className="text-gray-600 mt-1">Identifica temas y categorías automáticamente</p>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <span className="font-semibold text-blue-800">😊 Análisis de Sentimientos:</span>
                  <p className="text-gray-600 mt-1">Detecta emociones positivas, negativas o neutrales</p>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <span className="font-semibold text-red-800">🎯 Priorización:</span>
                  <p className="text-gray-600 mt-1">Clasifica sugerencias por urgencia e impacto</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {useAIAnalysis && enhancedData ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Análisis de Sentimientos */}
            <div>
              <h3 className="text-lg font-medium text-purple-800 mb-3">📊 Análisis de Sentimientos por Categoría</h3>
              <p className="text-sm text-gray-600 mb-4">
                Distribución emocional de las sugerencias en cada categoría, ayudando a identificar 
                áreas que generan mayor satisfacción o preocupación.
              </p>
              <div className="space-y-3">
                {enhancedData.filter(category => category.aiInsights).map((category, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border-l-4" style={{ borderColor: colors[index % colors.length] }}>
                    <h4 className="font-medium text-gray-800 mb-2">{category.categoria}</h4>
                    {category.aiInsights && (
                      <>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">😊 {category.aiInsights.sentiment.positive}%</span>
                          <span className="text-gray-600">😐 {category.aiInsights.sentiment.neutral}%</span>
                          <span className="text-red-600">😞 {category.aiInsights.sentiment.negative}%</span>
                        </div>
                        {category.aiInsights.topThemes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Temas principales:</p>
                            <div className="flex flex-wrap gap-1">
                              {category.aiInsights.topThemes.slice(0, 3).map((themeObj, themeIndex) => (
                                <span key={themeIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {themeObj.theme}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridades y Acciones */}
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-3">🎯 Sugerencias de Alta Prioridad</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sugerencias identificadas como críticas o urgentes basándose en el análisis de contenido, 
                frecuencia de mención y impacto potencial en la experiencia del cliente.
              </p>
              <div className="space-y-3">
                {enhancedData.flatMap(category => 
                  category.analyzedSuggestions?.filter(s => s.priority === 'high') || []
                )
                  .slice(0, 5)
                  .map((suggestion, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border-l-4 border-red-400">
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">🔴</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 leading-relaxed">
                            {suggestion.originalText.length > 80 ? 
                              `${suggestion.originalText.substring(0, 77)}...` : 
                              suggestion.originalText
                            }
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{suggestion.category}</span>
                            {suggestion.keywords.length > 0 && (
                              <>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-blue-600">{suggestion.keywords[0]}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {enhancedData.flatMap(category => 
                  category.analyzedSuggestions?.filter(s => s.priority === 'high') || []
                ).length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No hay sugerencias de alta prioridad identificadas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default SuggestionsAnalysis;
