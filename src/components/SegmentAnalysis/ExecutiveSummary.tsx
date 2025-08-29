import React from 'react';

interface ExecutiveSummaryProps {
  personasStats: {
    satisfaction: number;
    clarity: number;
    recommendation: number;
    loyalty: number;
    totalResponses: number;
  };
  empresasStats: {
    satisfaction: number;
    clarity: number;
    recommendation: number;
    loyalty: number;
    totalResponses: number;
  };
  hasValidData: boolean;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  personasStats,
  empresasStats,
  hasValidData
}) => {
  if (!hasValidData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Resumen Ejecutivo</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Calcular promedios generales
  const personasAverage = (personasStats.satisfaction + personasStats.clarity + personasStats.recommendation + personasStats.loyalty) / 4;
  const empresasAverage = (empresasStats.satisfaction + empresasStats.clarity + empresasStats.recommendation + empresasStats.loyalty) / 4;
  const overallAverage = (personasAverage + empresasAverage) / 2;
  
  // Determinar el segmento con mejor rendimiento
  const betterSegment = personasAverage > empresasAverage ? 'Personas' : 'Empresarial';
  const betterStats = personasAverage > empresasAverage ? personasStats : empresasStats;
  const worseStats = personasAverage > empresasAverage ? empresasStats : personasStats;
  const performanceDifference = Math.abs(personasAverage - empresasAverage);
  
  // Identificar fortalezas y oportunidades
  const getMetricName = (key: string) => {
    const names: { [key: string]: string } = {
      satisfaction: 'Satisfacción',
      clarity: 'Claridad',
      recommendation: 'Recomendación',
      loyalty: 'Lealtad'
    };
    return names[key] || key;
  };
  
  const personasMetrics = [
    { key: 'satisfaction', value: personasStats.satisfaction },
    { key: 'clarity', value: personasStats.clarity },
    { key: 'recommendation', value: personasStats.recommendation },
    { key: 'loyalty', value: personasStats.loyalty }
  ];
  
  const empresasMetrics = [
    { key: 'satisfaction', value: empresasStats.satisfaction },
    { key: 'clarity', value: empresasStats.clarity },
    { key: 'recommendation', value: empresasStats.recommendation },
    { key: 'loyalty', value: empresasStats.loyalty }
  ];
  
  const personasStrengths = personasMetrics.filter(m => m.value >= 8).sort((a, b) => b.value - a.value);
  const personasOpportunities = personasMetrics.filter(m => m.value < 7).sort((a, b) => a.value - b.value);
  
  const empresasStrengths = empresasMetrics.filter(m => m.value >= 8).sort((a, b) => b.value - a.value);
  const empresasOpportunities = empresasMetrics.filter(m => m.value < 7).sort((a, b) => a.value - b.value);
  
  // Generar recomendaciones
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (performanceDifference > 1) {
      recommendations.push(`Enfocar esfuerzos en mejorar la experiencia del segmento ${betterSegment === 'Personas' ? 'Empresarial' : 'Personas'}, que muestra ${performanceDifference.toFixed(2)} puntos de diferencia.`);
    }
    
    if (personasOpportunities.length > 0) {
      recommendations.push(`Para Personas: Priorizar mejoras en ${personasOpportunities.map(o => getMetricName(o.key)).join(' y ')}.`);
    }
    
    if (empresasOpportunities.length > 0) {
      recommendations.push(`Para Empresas: Priorizar mejoras en ${empresasOpportunities.map(o => getMetricName(o.key)).join(' y ')}.`);
    }
    
    if (overallAverage >= 8) {
      recommendations.push('Mantener los altos estándares actuales y buscar oportunidades de innovación.');
    } else if (overallAverage >= 7) {
      recommendations.push('Implementar mejoras incrementales para alcanzar la excelencia.');
    } else {
      recommendations.push('Desarrollar un plan de mejora integral para elevar la satisfacción general.');
    }
    
    return recommendations;
  };
  
  const recommendations = generateRecommendations();
  
  const getPerformanceLevel = (score: number) => {
    if (score >= 9) return { level: 'Excelente', color: 'text-green-600', bg: 'bg-green-50', icon: '🌟' };
    if (score >= 8) return { level: 'Muy Bueno', color: 'text-blue-600', bg: 'bg-blue-50', icon: '👍' };
    if (score >= 7) return { level: 'Bueno', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '👌' };
    if (score >= 6) return { level: 'Regular', color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚠️' };
    return { level: 'Necesita Mejora', color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' };
  };
  
  const personasPerformance = getPerformanceLevel(personasAverage);
  const empresasPerformance = getPerformanceLevel(empresasAverage);
  const overallPerformance = getPerformanceLevel(overallAverage);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Resumen Ejecutivo</h2>
      
      {/* Indicadores clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${personasPerformance.bg} rounded-lg p-4 text-center`}>
          <div className="text-2xl mb-2">{personasPerformance.icon}</div>
          <h3 className="font-semibold text-gray-800">👥 Segmento Personas</h3>
          <p className={`text-2xl font-bold ${personasPerformance.color}`}>
            {personasAverage.toFixed(2)}
          </p>
          <p className={`text-sm ${personasPerformance.color}`}>
            {personasPerformance.level}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {personasStats.totalResponses.toLocaleString()} respuestas
          </p>
        </div>
        
        <div className={`${empresasPerformance.bg} rounded-lg p-4 text-center`}>
          <div className="text-2xl mb-2">{empresasPerformance.icon}</div>
          <h3 className="font-semibold text-gray-800">🏢 Segmento Empresas</h3>
          <p className={`text-2xl font-bold ${empresasPerformance.color}`}>
            {empresasAverage.toFixed(2)}
          </p>
          <p className={`text-sm ${empresasPerformance.color}`}>
            {empresasPerformance.level}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {empresasStats.totalResponses.toLocaleString()} respuestas
          </p>
        </div>
        
        <div className={`${overallPerformance.bg} rounded-lg p-4 text-center`}>
          <div className="text-2xl mb-2">{overallPerformance.icon}</div>
          <h3 className="font-semibold text-gray-800">📊 Promedio General</h3>
          <p className={`text-2xl font-bold ${overallPerformance.color}`}>
            {overallAverage.toFixed(2)}
          </p>
          <p className={`text-sm ${overallPerformance.color}`}>
            {overallPerformance.level}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {(personasStats.totalResponses + empresasStats.totalResponses).toLocaleString()} respuestas totales
          </p>
        </div>
      </div>
      
      {/* Análisis comparativo */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Análisis Comparativo</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">👥 Fortalezas - Personas</h4>
              {personasStrengths.length > 0 ? (
                <ul className="space-y-1">
                  {personasStrengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      ✅ {getMetricName(strength.key)}: {strength.value.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No hay métricas con puntuación ≥ 8</p>
              )}
              
              {personasOpportunities.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-blue-700 mb-1">Oportunidades de Mejora:</h5>
                  <ul className="space-y-1">
                    {personasOpportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        🔄 {getMetricName(opportunity.key)}: {opportunity.value.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">🏢 Fortalezas - Empresas</h4>
              {empresasStrengths.length > 0 ? (
                <ul className="space-y-1">
                  {empresasStrengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      ✅ {getMetricName(strength.key)}: {strength.value.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No hay métricas con puntuación ≥ 8</p>
              )}
              
              {empresasOpportunities.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-orange-700 mb-1">Oportunidades de Mejora:</h5>
                  <ul className="space-y-1">
                    {empresasOpportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        🔄 {getMetricName(opportunity.key)}: {opportunity.value.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recomendaciones estratégicas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Recomendaciones Estratégicas</h3>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 bg-blue-50 rounded-lg p-3">
              <span className="text-blue-600 font-bold text-sm">{index + 1}.</span>
              <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Métricas detalladas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Métricas Detalladas</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métrica
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  👥 Personas
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  🏢 Empresas
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diferencia
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { key: 'satisfaction', name: 'Satisfacción', personas: personasStats.satisfaction, empresas: empresasStats.satisfaction },
                { key: 'clarity', name: 'Claridad', personas: personasStats.clarity, empresas: empresasStats.clarity },
                { key: 'recommendation', name: 'Recomendación', personas: personasStats.recommendation, empresas: empresasStats.recommendation },
                { key: 'loyalty', name: 'Lealtad', personas: personasStats.loyalty, empresas: empresasStats.loyalty }
              ].map((metric, index) => {
                const difference = metric.personas - metric.empresas;
                const status = Math.abs(difference) < 0.5 ? '⚖️ Equilibrado' : 
                              difference > 0 ? '📈 Personas mejor' : '📉 Empresas mejor';
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {metric.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-blue-600 font-semibold">
                      {metric.personas.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-orange-600 font-semibold">
                      {metric.empresas.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-semibold">
                      <span className={`${
                        Math.abs(difference) < 0.5 
                          ? 'text-gray-600' 
                          : difference > 0 
                            ? 'text-blue-600' 
                            : 'text-orange-600'
                      }`}>
                        {difference > 0 ? '+' : ''}{difference.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Conclusión */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">🎯 Conclusión Principal</h4>
          <p className="text-sm text-gray-700">
            {performanceDifference > 1 
              ? `Existe una diferencia significativa de ${performanceDifference.toFixed(2)} puntos entre segmentos. El segmento ${betterSegment} muestra mejor rendimiento general, sugiriendo la necesidad de estrategias diferenciadas.`
              : `Ambos segmentos muestran rendimiento similar (diferencia: ${performanceDifference.toFixed(2)} puntos), lo que indica consistencia en la experiencia del servicio.`
            }
            {overallAverage >= 8 
              ? ' El rendimiento general es sólido, enfocarse en mantener estándares y optimizar áreas específicas.'
              : ' Hay oportunidades claras de mejora que pueden impactar positivamente en ambos segmentos.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;