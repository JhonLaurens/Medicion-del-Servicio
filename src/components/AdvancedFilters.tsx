import React, { useState, useEffect } from 'react';
import { Filter, X, Calendar, Building, Users, BarChart3 } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  options: FilterOption[];
  type: 'select' | 'multiselect' | 'daterange';
}

interface AdvancedFiltersProps {
  filters: FilterConfig[];
  onFiltersChange: (filters: Record<string, any>) => void;
  className?: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    const hasFilters = Object.values(activeFilters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    });
    setHasActiveFilters(hasFilters);
    onFiltersChange(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
  };

  const renderFilterControl = (filter: FilterConfig) => {
    const currentValue = activeFilters[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.key} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                {filter.icon}
                {filter.label}
              </div>
            </label>
            <div className="relative">
              <select
                value={currentValue || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="filter-select w-full appearance-none pr-10"
                aria-label={`Filtro de ${filter.label}`}
              >
                <option value="">Todos</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                    {option.count !== undefined && ` (${option.count})`}
                  </option>
                ))}
              </select>
              {currentValue && (
                <button
                  onClick={() => clearFilter(filter.key)}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={`Limpiar filtro de ${filter.label}`}
                  title={`Limpiar filtro de ${filter.label}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );

      case 'multiselect':
        return (
          <div key={filter.key} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                {filter.icon}
                {filter.label}
              </div>
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {filter.options.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentValue?.includes(option.value) || false}
                    onChange={(e) => {
                      const newValue = currentValue || [];
                      if (e.target.checked) {
                        handleFilterChange(filter.key, [...newValue, option.value]);
                      } else {
                        handleFilterChange(filter.key, newValue.filter((v: string) => v !== option.value));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {option.label}
                    {option.count !== undefined && (
                      <span className="text-gray-500 ml-1">({option.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'daterange':
        return (
          <div key={filter.key} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                {filter.icon}
                {filter.label}
              </div>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={currentValue?.start || ''}
                onChange={(e) => handleFilterChange(filter.key, {
                  ...currentValue,
                  start: e.target.value
                })}
                className="filter-select"
                placeholder="Fecha inicio"
                aria-label={`${filter.label} - Fecha de inicio`}
              />
              <input
                type="date"
                value={currentValue?.end || ''}
                onChange={(e) => handleFilterChange(filter.key, {
                  ...currentValue,
                  end: e.target.value
                })}
                className="filter-select"
                placeholder="Fecha fin"
                aria-label={`${filter.label} - Fecha de fin`}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`filter-container ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          aria-label={isExpanded ? "Contraer filtros" : "Expandir filtros"}
          title={isExpanded ? "Contraer filtros" : "Expandir filtros"}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
            aria-label="Limpiar todos los filtros"
            title="Limpiar todos los filtros"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && !isExpanded && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = filters.find(f => f.key === key);
              if (!filter) return null;

              let displayValue = '';
              if (Array.isArray(value)) {
                displayValue = `${value.length} seleccionado${value.length > 1 ? 's' : ''}`;
              } else if (typeof value === 'object' && value.start && value.end) {
                displayValue = `${value.start} - ${value.end}`;
              } else {
                const option = filter.options.find(opt => opt.value === value);
                displayValue = option?.label || value;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {filter.label}: {displayValue}
                  <button
                    onClick={() => clearFilter(key)}
                    className="ml-1 hover:text-blue-600"
                    aria-label={`Remover filtro de ${filter.label}`}
                    title={`Remover filtro de ${filter.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map(renderFilterControl)}
        </div>
      )}
    </div>
  );
};

// Configuración predeterminada de filtros
export const defaultFilters: FilterConfig[] = [
  {
    key: 'year',
    label: 'Año',
    icon: <Calendar className="w-4 h-4" />,
    type: 'select',
    options: [
      { value: '2025', label: '2025', count: 156 },
      { value: '2024', label: '2024', count: 1248 },
      { value: '2023', label: '2023', count: 1156 },
      { value: '2022', label: '2022', count: 1089 },
      { value: '2021', label: '2021', count: 987 },
      { value: '2020', label: '2020', count: 856 }
    ]
  },
  {
    key: 'segment',
    label: 'Segmento',
    icon: <Users className="w-4 h-4" />,
    type: 'select',
    options: [
      { value: 'personas', label: 'Personas', count: 2456 },
      { value: 'empresarial-bogota', label: 'Empresarial Bogotá', count: 1234 },
      { value: 'empresarial-medellin', label: 'Empresarial Medellín', count: 987 },
      { value: 'empresarial-other', label: 'Empresarial Otras Ciudades', count: 654 }
    ]
  },
  {
    key: 'metrics',
    label: 'Métricas',
    icon: <BarChart3 className="w-4 h-4" />,
    type: 'multiselect',
    options: [
      { value: 'nps', label: 'NPS' },
      { value: 'satisfaction', label: 'Satisfacción General' },
      { value: 'loyalty', label: 'Lealtad' },
      { value: 'ease_of_use', label: 'Facilidad de Uso' },
      { value: 'service_quality', label: 'Calidad del Servicio' }
    ]
  },
  {
    key: 'dateRange',
    label: 'Rango de Fechas',
    icon: <Calendar className="w-4 h-4" />,
    type: 'daterange',
    options: []
  }
];

export default AdvancedFilters;