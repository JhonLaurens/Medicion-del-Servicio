import { useState, useEffect, useMemo } from 'react';
import { satisfactionDataService } from '../services/dataService';
import { KPIData } from '../types';

interface OverallStats {
  totalResponses: number;
  personasResponses: number;
  empresasResponses: number;
  personasAverage: number;
  empresasAverage: number;
  difference: number;
}

interface DistributionData {
  personasData: Array<{ name: string; value: number; color: string }>;
  empresasData: Array<{ name: string; value: number; color: string }>;
  personasTotal: number;
  empresasTotal: number;
}

interface ChartDataPoint {
  metric: string;
  personas: number;
  empresas: number;
}

export const useSegmentAnalysis = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await satisfactionDataService.loadData();
        const data = satisfactionDataService.getKPIData();
        setKpiData(data);
      } catch (error) {
        console.error('Error loading segment analysis data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const hasValidData = useMemo(() => {
    return kpiData.length > 0;
  }, [kpiData]);

  const overallStats = useMemo((): OverallStats => {
    if (!hasValidData) {
      return {
        totalResponses: 0,
        personasResponses: 0,
        empresasResponses: 0,
        personasAverage: 0,
        empresasAverage: 0,
        difference: 0
      };
    }

    const personasData = kpiData.filter(item => item.segment === 'Personas');
    const empresasData = kpiData.filter(item => item.segment === 'Empresas');

    const personasAvg = personasData.length > 0 
      ? personasData.reduce((sum, item) => sum + item.averageRating, 0) / personasData.length 
      : 0;
    
    const empresasAvg = empresasData.length > 0 
      ? empresasData.reduce((sum, item) => sum + item.averageRating, 0) / empresasData.length 
      : 0;

    return {
      totalResponses: kpiData.reduce((sum, item) => sum + item.totalResponses, 0),
      personasResponses: personasData.reduce((sum, item) => sum + item.totalResponses, 0),
      empresasResponses: empresasData.reduce((sum, item) => sum + item.totalResponses, 0),
      personasAverage: Number(personasAvg.toFixed(2)),
      empresasAverage: Number(empresasAvg.toFixed(2)),
      difference: Number((personasAvg - empresasAvg).toFixed(2))
    };
  }, [kpiData, hasValidData]);

  const distributionData = useMemo((): DistributionData => {
    if (!hasValidData) {
      return {
        personasData: [],
        empresasData: [],
        personasTotal: 0,
        empresasTotal: 0
      };
    }

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    const ratingLabels = ['1 - Muy Insatisfecho', '2 - Insatisfecho', '3 - Neutral', '4 - Satisfecho', '5 - Muy Satisfecho'];

    const personasData = kpiData.filter(item => item.segment === 'Personas');
    const empresasData = kpiData.filter(item => item.segment === 'Empresas');

    const personasDistribution = ratingLabels.map((label, index) => {
      const rating = index + 1;
      const count = personasData.reduce((sum, item) => {
        return sum + (item.ratingDistribution?.[rating] || 0);
      }, 0);
      return {
        name: label,
        value: count,
        color: colors[index]
      };
    });

    const empresasDistribution = ratingLabels.map((label, index) => {
      const rating = index + 1;
      const count = empresasData.reduce((sum, item) => {
        return sum + (item.ratingDistribution?.[rating] || 0);
      }, 0);
      return {
        name: label,
        value: count,
        color: colors[index]
      };
    });

    return {
      personasData: personasDistribution,
      empresasData: empresasDistribution,
      personasTotal: personasDistribution.reduce((sum, item) => sum + item.value, 0),
      empresasTotal: empresasDistribution.reduce((sum, item) => sum + item.value, 0)
    };
  }, [kpiData, hasValidData]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!hasValidData) return [];

    const metrics = ['Satisfacción General', 'Claridad', 'Recomendación', 'Lealtad'];
    
    return metrics.map(metric => {
      const personasItems = kpiData.filter(item => item.segment === 'Personas' && item.metric === metric);
      const empresasItems = kpiData.filter(item => item.segment === 'Empresas' && item.metric === metric);
      
      const personasAvg = personasItems.length > 0 
        ? personasItems.reduce((sum, item) => sum + item.averageRating, 0) / personasItems.length 
        : 0;
      
      const empresasAvg = empresasItems.length > 0 
        ? empresasItems.reduce((sum, item) => sum + item.averageRating, 0) / empresasItems.length 
        : 0;

      return {
        metric,
        personas: Number(personasAvg.toFixed(2)),
        empresas: Number(empresasAvg.toFixed(2))
      };
    });
  }, [kpiData, hasValidData]);

  return {
    kpiData,
    isLoading,
    hasValidData,
    overallStats,
    distributionData,
    chartData
  };
};