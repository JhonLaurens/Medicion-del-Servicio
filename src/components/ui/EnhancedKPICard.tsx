import React from 'react';
import { KPIData } from '../types';

interface EnhancedKPICardProps {
  data: KPIData;
  icon: string;
  index: number;
}

const EnhancedKPICard: React.FC<EnhancedKPICardProps> = ({ 
  data, 
  icon, 
  index 
}) => {
  // Calcular diferencia y determinar tendencia usando propiedades correctas
  const personasAvg = data.personas.average;
  const empresasAvg = data.empresarial.average;
  const gap = Math.abs(personasAvg - empresasAvg);
  const leader = personasAvg > empresasAvg ? 'personas' : 'empresas';
  const leaderValue = personasAvg > empresasAvg ? personasAvg : empresasAvg;
  
  // Determinar color de la brecha
  const gapColor = gap > 0.5 ? 'text-red-600' : gap > 0.2 ? 'text-yellow-600' : 'text-green-600';
  const gapBg = gap > 0.5 ? 'bg-red-50' : gap > 0.2 ? 'bg-yellow-50' : 'bg-green-50';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header con icono y métrica */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-3xl mr-3">{icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-800 leading-tight">
              {data.metric}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Promedio de satisfacción
            </p>
          </div>
        </div>
        
        {/* Badge de ranking */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
          index === 0 ? 'bg-yellow-500' : 
          index === 1 ? 'bg-gray-400' : 
          index === 2 ? 'bg-amber-600' : 'bg-blue-500'
        }`}>
          #{index + 1}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Personas */}
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
            Personas
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {personasAvg.toFixed(2)}
          </p>
          <div className="mt-2">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(personasAvg / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Empresas */}
        <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide mb-1">
            Empresas
          </p>
          <p className="text-2xl font-bold text-teal-700">
            {empresasAvg.toFixed(2)}
          </p>
          <div className="mt-2">
            <div className="w-full bg-teal-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(empresasAvg / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de brecha */}
      <div className={`p-3 rounded-lg ${gapBg} border border-opacity-30`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">Brecha entre segmentos</p>
            <p className={`text-lg font-bold ${gapColor}`}>
              {gap.toFixed(2)} puntos
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Mejor rendimiento</p>
            <p className="text-sm font-semibold text-gray-700 capitalize flex items-center">
              {leader === 'personas' ? '👥' : '🏢'} {leader}
              <span className="ml-2 text-lg font-bold text-gray-800">
                {leaderValue.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        
        {/* Indicador de severidad */}
        <div className="mt-2 flex items-center justify-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            gap > 0.5 ? 'bg-red-100 text-red-700' :
            gap > 0.2 ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {gap > 0.5 ? '🔴 Brecha Significativa' :
             gap > 0.2 ? '🟡 Brecha Moderada' :
             '🟢 Brecha Mínima'}
          </span>
        </div>
      </div>

      {/* Footer con acción */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
          Ver análisis detallado →
        </button>
      </div>
    </div>
  );
};

export default EnhancedKPICard;
