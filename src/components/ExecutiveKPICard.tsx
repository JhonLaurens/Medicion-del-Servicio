import React from 'react';

interface ExecutiveKPICardProps {
  title: string;
  personasValue: number;
  empresasValue: number;
  metric: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  priority?: 'high' | 'medium' | 'low';
}

const ExecutiveKPICard: React.FC<ExecutiveKPICardProps> = ({
  title,
  personasValue,
  empresasValue,
  metric,
  icon = '📊',
  trend = 'stable',
  priority = 'medium'
}) => {
  const gap = Math.abs(personasValue - empresasValue);
  const leader = personasValue > empresasValue ? 'Personas' : empresasValue > personasValue ? 'Empresas' : 'Empate';
  
  const priorityColors = {
    high: 'border-red-200 bg-red-50/50',
    medium: 'border-yellow-200 bg-yellow-50/50', 
    low: 'border-green-200 bg-green-50/50'
  };

  const trendIcons = {
    up: '📈',
    down: '📉',
    stable: '➡️'
  };

  const gapColor = gap > 0.5 ? 'text-red-600' : gap > 0.2 ? 'text-yellow-600' : 'text-green-600';
  const gapBg = gap > 0.5 ? 'bg-red-100' : gap > 0.2 ? 'bg-yellow-100' : 'bg-green-100';

  return (
    <div className={`metric-card-executive group ${priorityColors[priority]} hover:shadow-corporate-lg transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <span className="text-xl">{icon}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm leading-tight">
              {title.length > 20 ? title.substring(0, 20) + '...' : title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">{trendIcons[trend]}</span>
              <span className="text-xs text-gray-500 font-medium">{metric}</span>
            </div>
          </div>
        </div>
        
        {/* Priority indicator */}
        <div className={`w-3 h-3 rounded-full ${
          priority === 'high' ? 'bg-red-500' : 
          priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
        }`}></div>
      </div>

      {/* Values comparison */}
      <div className="space-y-4 mb-4">
        {/* Personas */}
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Personas</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-brand-primary">{personasValue.toFixed(2)}</div>
            <div className="text-xs text-gray-500">n=1,432</div>
          </div>
        </div>

        {/* Empresas */}
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-brand-secondary rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Empresas</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-brand-secondary">{empresasValue.toFixed(2)}</div>
            <div className="text-xs text-gray-500">n=13</div>
          </div>
        </div>
      </div>

      {/* Gap analysis */}
      <div className={`p-3 rounded-lg ${gapBg} border-l-4 ${
        gap > 0.5 ? 'border-red-500' : gap > 0.2 ? 'border-yellow-500' : 'border-green-500'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs font-medium text-gray-600">Brecha de Segmento</div>
            <div className="text-xs text-gray-500 mt-1">Líder: {leader}</div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${gapColor}`}>{gap.toFixed(2)}</div>
            <div className="text-xs text-gray-500">
              {gap > 0.5 ? 'Crítica' : gap > 0.2 ? 'Moderada' : 'Baja'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar visualization */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Rango de Satisfacción</span>
          <span>1.0 - 5.0</span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Personas bar */}
          <div 
            className="absolute top-0 left-0 h-1 bg-brand-primary rounded-full transition-all duration-1000"
            style={{ width: `${(personasValue / 5) * 100}%` }}
          ></div>
          {/* Empresas bar */}
          <div 
            className="absolute bottom-0 left-0 h-1 bg-brand-secondary rounded-full transition-all duration-1000 delay-300"
            style={{ width: `${(empresasValue / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ExecutiveKPICard;
