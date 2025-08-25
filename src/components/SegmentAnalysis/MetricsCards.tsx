import React, { useMemo } from 'react';
import { KPIData } from '../../types';

interface MetricsCardsProps {
  kpiData: KPIData[];
  hasValidData: boolean;
}

const MetricsCards: React.FC<MetricsCardsProps> = React.memo(({ kpiData, hasValidData }) => {
  if (!hasValidData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Memoizar cálculos pesados
  const { personasMetrics, empresasMetrics } = useMemo(() => {
    const calculateMetricsBySegment = (segment: string) => {
      const segmentData = kpiData.filter(item => item.segment === segment);
      
      if (segmentData.length === 0) {
        return {
          satisfaccion: 0,
          claridad: 0,
          recomendacion: 0,
          lealtad: 0,
          totalResponses: 0
        };
      }

      const satisfaccionItems = segmentData.filter(item => item.metric === 'Satisfacción General');
      const claridadItems = segmentData.filter(item => item.metric === 'Claridad');
      const recomendacionItems = segmentData.filter(item => item.metric === 'Recomendación');
      const lealtadItems = segmentData.filter(item => item.metric === 'Lealtad');

      return {
        satisfaccion: satisfaccionItems.length > 0 
          ? Number((satisfaccionItems.reduce((sum, item) => sum + item.averageRating, 0) / satisfaccionItems.length).toFixed(2))
          : 0,
        claridad: claridadItems.length > 0 
          ? Number((claridadItems.reduce((sum, item) => sum + item.averageRating, 0) / claridadItems.length).toFixed(2))
          : 0,
        recomendacion: recomendacionItems.length > 0 
          ? Number((recomendacionItems.reduce((sum, item) => sum + item.averageRating, 0) / recomendacionItems.length).toFixed(2))
          : 0,
        lealtad: lealtadItems.length > 0 
          ? Number((lealtadItems.reduce((sum, item) => sum + item.averageRating, 0) / lealtadItems.length).toFixed(2))
          : 0,
        totalResponses: segmentData.reduce((sum, item) => sum + item.totalResponses, 0)
      };
    };

    return {
      personasMetrics: calculateMetricsBySegment('Personas'),
      empresasMetrics: calculateMetricsBySegment('Empresas')
    };
  }, [kpiData]);

  const metrics = [
    {
      title: 'Satisfacción General',
      personas: personasMetrics.satisfaccion,
      empresas: empresasMetrics.satisfaccion,
      icon: '😊',
      color: 'blue'
    },
    {
      title: 'Claridad',
      personas: personasMetrics.claridad,
      empresas: empresasMetrics.claridad,
      icon: '💡',
      color: 'green'
    },
    {
      title: 'Recomendación',
      personas: personasMetrics.recomendacion,
      empresas: empresasMetrics.recomendacion,
      icon: '👍',
      color: 'purple'
    },
    {
      title: 'Lealtad',
      personas: personasMetrics.lealtad,
      empresas: empresasMetrics.lealtad,
      icon: '❤️',
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50',
      red: 'border-red-200 bg-red-50'
    };
    return colorMap[color] || 'border-gray-200 bg-gray-50';
  };

  const getTextColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'text-blue-800',
      green: 'text-green-800',
      purple: 'text-purple-800',
      red: 'text-red-800'
    };
    return colorMap[color] || 'text-gray-800';
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Métricas por Segmento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${getColorClasses(metric.color)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${getTextColorClasses(metric.color)}`}>
                {metric.icon} {metric.title}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Personas:</span>
                <span className="text-xl font-bold text-blue-600">{metric.personas}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Empresas:</span>
                <span className="text-xl font-bold text-orange-600">{metric.empresas}</span>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Diferencia:</span>
                  <span className={`text-sm font-semibold ${
                    metric.personas > metric.empresas 
                      ? 'text-green-600' 
                      : metric.personas < metric.empresas 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                  }`}>
                    {metric.personas > metric.empresas ? '+' : ''}
                    {(metric.personas - metric.empresas).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">👥 Segmento Personas</h4>
          <p className="text-sm text-blue-700">
            Total de respuestas: <span className="font-bold">{personasMetrics.totalResponses.toLocaleString()}</span>
          </p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2">🏢 Segmento Empresas</h4>
          <p className="text-sm text-orange-700">
            Total de respuestas: <span className="font-bold">{empresasMetrics.totalResponses.toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

MetricsCards.displayName = 'MetricsCards';

export default MetricsCards;