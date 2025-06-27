import React from 'react';
import { KPIData } from '../types';

interface ImprovedComparisonTableProps {
  data: KPIData[];
  title: string;
}

const ImprovedComparisonTable: React.FC<ImprovedComparisonTableProps> = ({ 
  data, 
  title 
}) => {
  // Función para calcular la brecha y determinar su severidad
  const calculateGap = (personas: number, empresas: number) => {
    const gap = Math.abs(personas - empresas);
    const severity = gap > 0.5 ? 'significativa' : gap > 0.2 ? 'moderada' : 'mínima';
    const color = gap > 0.5 ? 'text-red-600' : gap > 0.2 ? 'text-yellow-600' : 'text-green-600';
    return { gap, severity, color };
  };

  // Función para crear barra de progreso visual
  const ProgressBar = ({ value, color }: { value: number; color: string }) => {
    const percentage = (value / 5) * 100;
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
          {value.toFixed(2)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-brand-light opacity-90">
          Comparativo detallado de satisfacción por segmento
        </p>
      </div>

      {/* Tabla responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Métrica
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Personas
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Empresas
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Brecha
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Liderazgo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => {
              const personasAvg = item.personas.average;
              const empresasAvg = item.empresarial.average;
              const gapData = calculateGap(personasAvg, empresasAvg);
              const leader = personasAvg > empresasAvg ? 'Personas' : 'Empresas';
              const leaderIcon = personasAvg > empresasAvg ? '👥' : '🏢';
              
              return (
                <tr 
                  key={item.metric} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Métrica */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {index === 0 ? '😊' : index === 1 ? '❤️' : index === 2 ? '👍' : '💡'}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.metric}
                        </p>
                        <p className="text-xs text-gray-500">
                          Escala 1-5 puntos
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Personas */}
                  <td className="px-6 py-4 text-center">
                    <ProgressBar 
                      value={personasAvg} 
                      color="bg-brand-primary" 
                    />
                  </td>

                  {/* Empresas */}
                  <td className="px-6 py-4 text-center">
                    <ProgressBar 
                      value={empresasAvg} 
                      color="bg-brand-secondary" 
                    />
                  </td>

                  {/* Brecha */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-lg font-bold ${gapData.color}`}>
                        {gapData.gap.toFixed(2)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        gapData.severity === 'significativa' ? 'bg-red-100 text-red-700' :
                        gapData.severity === 'moderada' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {gapData.severity}
                      </span>
                    </div>
                  </td>

                  {/* Liderazgo */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-1">{leaderIcon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {leader}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer con resumen */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Promedio General Personas</p>
            <p className="text-lg font-bold text-brand-primary">
              {(data.reduce((acc, item) => acc + item.personas.average, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Promedio General Empresas</p>
            <p className="text-lg font-bold text-brand-secondary">
              {(data.reduce((acc, item) => acc + item.empresarial.average, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Brecha Promedio</p>
            <p className="text-lg font-bold text-gray-700">
              {(data.reduce((acc, item) => acc + Math.abs(item.personas.average - item.empresarial.average), 0) / data.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedComparisonTable;
