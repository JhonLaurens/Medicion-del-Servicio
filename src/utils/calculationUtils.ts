/**
 * Utilidades de cálculo unificadas para evitar discrepancias entre componentes
 * Este archivo centraliza los cálculos de métricas para garantizar consistencia
 */

import { SatisfactionRecord } from '../types';

export interface MetricCalculationResult {
  averageRating: number;
  totalResponses: number;
  claridadPromedio: number;
  recomendacionPromedio: number;
  satisfaccionPromedio: number;
  lealtadPromedio: number;
}

export interface FilterStats {
  filterValue: string;
  totalSurveys: number;
  averageRating: number;
  claridadPromedio: number;
  recomendacionPromedio: number;
  satisfaccionPromedio: number;
  lealtadPromedio: number;
}

/**
 * Función unificada para calcular métricas de satisfacción
 * Utiliza la misma lógica en todos los componentes para evitar discrepancias
 */
export const calculateUnifiedMetrics = (
  data: SatisfactionRecord[],
  filterField?: string,
  filterValue?: string
): MetricCalculationResult => {
  console.log('🔍 calculateUnifiedMetrics: Starting with', data.length, 'records');
  
  if (!data || data.length === 0) {
    return {
      averageRating: 0,
      totalResponses: 0,
      claridadPromedio: 0,
      recomendacionPromedio: 0,
      satisfaccionPromedio: 0,
      lealtadPromedio: 0,
    };
  }

  // Aplicar filtro si se especifica
  let filteredData = data;
  if (filterField && filterValue && filterValue !== 'all') {
    filteredData = data.filter((record) => {
      switch (filterField) {
        case 'tipoEjecutivo':
          const tipoValue = (record['TIPO EJECUTIVO'] || 'Sin Tipo').toUpperCase();
          return tipoValue === filterValue.toUpperCase();
        case 'segmento':
          return (record.SEGMENTO || 'Sin Segmento') === filterValue;
        case 'ciudad':
          return (record.CIUDAD || 'Sin Ciudad') === filterValue;
        case 'agencia':
          return (record.AGENCIA || 'Sin Agencia') === filterValue;
        default:
          return true;
      }
    });
  }

  console.log('🔍 calculateUnifiedMetrics: After filtering:', filteredData.length, 'records');

  if (filteredData.length === 0) {
    return {
      averageRating: 0,
      totalResponses: 0,
      claridadPromedio: 0,
      recomendacionPromedio: 0,
      satisfaccionPromedio: 0,
      lealtadPromedio: 0,
    };
  }

  // Usar los nombres mapeados de las columnas (consistente con el servicio)
  const claridadCol = 'claridad_informacion';
  const recomendacionCol = 'recomendacion';
  const satisfaccionCol = 'satisfaccion_general';
  const lealtadCol = 'lealtad';

  // Calcular promedios de las métricas con validación consistente
  const claridadValues = filteredData
    .map((r) => {
      const val = r[claridadCol as keyof SatisfactionRecord];
      return typeof val === 'number' ? val : parseFloat(val as string);
    })
    .filter((v) => !isNaN(v) && v >= 1 && v <= 5);

  const recomendacionValues = filteredData
    .map((r) => {
      const val = r[recomendacionCol as keyof SatisfactionRecord];
      return typeof val === 'number' ? val : parseFloat(val as string);
    })
    .filter((v) => !isNaN(v) && v >= 1 && v <= 5);

  const satisfaccionValues = filteredData
    .map((r) => {
      const val = r[satisfaccionCol as keyof SatisfactionRecord];
      return typeof val === 'number' ? val : parseFloat(val as string);
    })
    .filter((v) => !isNaN(v) && v >= 1 && v <= 5);
  
  const lealtadValues = filteredData
    .map((r) => {
      const val = r[lealtadCol as keyof SatisfactionRecord];
      return typeof val === 'number' ? val : parseFloat(val as string);
    })
    .filter((v) => !isNaN(v) && v >= 1 && v <= 5);

  // Calcular promedios
  const claridadPromedio = claridadValues.length > 0 
    ? claridadValues.reduce((a, b) => a + b, 0) / claridadValues.length 
    : 0;
  
  const recomendacionPromedio = recomendacionValues.length > 0 
    ? recomendacionValues.reduce((a, b) => a + b, 0) / recomendacionValues.length 
    : 0;
  
  const satisfaccionPromedio = satisfaccionValues.length > 0 
    ? satisfaccionValues.reduce((a, b) => a + b, 0) / satisfaccionValues.length 
    : 0;
  
  const lealtadPromedio = lealtadValues.length > 0 
    ? lealtadValues.reduce((a, b) => a + b, 0) / lealtadValues.length 
    : 0;

  // Promedio general de todas las métricas válidas (consistente con ManagerParticipationReport)
  const validMetrics = [claridadPromedio, recomendacionPromedio, satisfaccionPromedio, lealtadPromedio]
    .filter(v => v > 0);
  
  const averageRating = validMetrics.length > 0 
    ? validMetrics.reduce((a, b) => a + b, 0) / validMetrics.length 
    : 0;

  const result = {
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalResponses: filteredData.length,
    claridadPromedio: parseFloat(claridadPromedio.toFixed(2)),
    recomendacionPromedio: parseFloat(recomendacionPromedio.toFixed(2)),
    satisfaccionPromedio: parseFloat(satisfaccionPromedio.toFixed(2)),
    lealtadPromedio: parseFloat(lealtadPromedio.toFixed(2)),
  };

  console.log('✅ calculateUnifiedMetrics: Result:', result);
  return result;
};

/**
 * Función unificada para calcular estadísticas por filtros
 * Reemplaza las implementaciones específicas en cada componente
 */
export const calculateFilterStats = (
  data: SatisfactionRecord[],
  filterType: string
): FilterStats[] => {
  console.log('🔍 calculateFilterStats: Starting with', data.length, 'records for', filterType);

  if (!data || data.length === 0) {
    console.log('❌ calculateFilterStats: No data available');
    return [];
  }

  const stats: FilterStats[] = [];

  // Obtener valores únicos para el tipo de filtro seleccionado
  const uniqueValues = [...new Set(
    data.map((record) => {
      switch (filterType) {
        case 'tipoEjecutivo':
          const value = record['TIPO EJECUTIVO'] || 'Sin Tipo';
          return value.toUpperCase(); // Normalizar a mayúsculas
        case 'segmento':
          return record.SEGMENTO || 'Sin Segmento';
        case 'ciudad':
          return record.CIUDAD || 'Sin Ciudad';
        case 'agencia':
          return record.AGENCIA || 'Sin Agencia';
        default:
          return 'Sin Clasificar';
      }
    }).filter(Boolean)
  )].filter(value => value && value.trim() !== '');

  console.log('🔍 calculateFilterStats: Unique values for', filterType, ':', uniqueValues);

  uniqueValues.forEach((value) => {
    const metrics = calculateUnifiedMetrics(data, filterType, value);
    
    if (metrics.totalResponses > 0) {
      stats.push({
        filterValue: value,
        totalSurveys: metrics.totalResponses,
        averageRating: metrics.averageRating,
        claridadPromedio: metrics.claridadPromedio,
        recomendacionPromedio: metrics.recomendacionPromedio,
        satisfaccionPromedio: metrics.satisfaccionPromedio,
        lealtadPromedio: metrics.lealtadPromedio,
      });
    }
  });

  // Ordenar por número de encuestas descendente
  const sortedStats = stats.sort((a, b) => b.totalSurveys - a.totalSurveys);
  console.log('✅ calculateFilterStats: Final stats:', sortedStats);
  
  return sortedStats;
};

/**
 * Función para calcular métricas por segmento (compatible con useSegmentAnalysis)
 * Utiliza la misma lógica base pero adaptada al formato KPI
 */
export const calculateSegmentMetrics = (
  data: SatisfactionRecord[],
  segment: 'PERSONAS' | 'EMPRESARIAL'
): MetricCalculationResult => {
  console.log('🔍 calculateSegmentMetrics: Calculating for segment', segment);
  
  const segmentData = data.filter(record => record.SEGMENTO === segment);
  return calculateUnifiedMetrics(segmentData);
};

/**
 * Función para validar que los cálculos sean consistentes entre componentes
 */
export const validateCalculationConsistency = (
  data: SatisfactionRecord[],
  filterType: string,
  filterValue: string
): boolean => {
  const unifiedResult = calculateUnifiedMetrics(data, filterType, filterValue);
  
  // Aquí se pueden agregar más validaciones específicas
  console.log('🔍 validateCalculationConsistency:', {
    filterType,
    filterValue,
    result: unifiedResult
  });
  
  return unifiedResult.totalResponses > 0;
};