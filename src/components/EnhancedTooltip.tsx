import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TooltipData {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  additionalInfo?: string[];
  target?: string | number;
  gap?: number;
}

interface EnhancedTooltipProps {
  data: TooltipData;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({ 
  data, 
  children, 
  position = 'top',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          y = triggerRect.bottom + 8;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          break;
        case 'right':
          x = triggerRect.right + 8;
          y = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          break;
      }

      // Ajustar si se sale del viewport
      if (x < 8) x = 8;
      if (x + tooltipRect.width > viewportWidth - 8) {
        x = viewportWidth - tooltipRect.width - 8;
      }
      if (y < 8) y = 8;
      if (y + tooltipRect.height > viewportHeight - 8) {
        y = viewportHeight - tooltipRect.height - 8;
      }

      setTooltipPosition({ x, y });
    }
  }, [isVisible, position]);

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getTrendClass = () => {
    switch (data.trend) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      case 'stable':
        return 'trend-stable';
      default:
        return '';
    }
  };

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      return value.toLocaleString('es-ES', { 
        minimumFractionDigits: 1, 
        maximumFractionDigits: 1 
      });
    }
    return value;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
        tabIndex={0}
      >
        {children}
      </div>

      {isVisible && (
        <>
          {/* Overlay para cerrar en móvil */}
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsVisible(false)}
          />
          
          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className="tooltip-enhanced fixed z-50"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                {data.title}
              </h4>
              <HelpCircle className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
            </div>

            {/* Valor principal */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatValue(data.value)}
                </span>
                {data.trend && (
                  <div className={`flex items-center gap-1 ${getTrendClass()}`}>
                    {getTrendIcon()}
                    {data.trendValue && (
                      <span className="text-sm font-medium">
                        {data.trendValue}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            {data.description && (
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {data.description}
              </p>
            )}

            {/* Meta y brecha */}
            {(data.target || data.gap !== undefined) && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                {data.target && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Meta:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatValue(data.target)}
                    </span>
                  </div>
                )}
                {data.gap !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Brecha:</span>
                    <span className={`text-sm font-medium ${
                      data.gap > 0 ? 'text-red-600' : data.gap < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {data.gap > 0 ? '+' : ''}{data.gap.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Información adicional */}
            {data.additionalInfo && data.additionalInfo.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <ul className="space-y-1">
                  {data.additionalInfo.map((info, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Flecha del tooltip */}
            <div 
              className={`absolute w-2 h-2 bg-white border transform rotate-45 ${
                position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' :
                position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' :
                position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-b' :
                'left-[-5px] top-1/2 -translate-y-1/2 border-l border-t'
              }`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedTooltip;