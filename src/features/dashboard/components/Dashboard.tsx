import React, { useState, useEffect } from 'react';
import ScoreCard from '../../../components/ui/ScoreCard';
import RatingDistributionChart from '../../../components/RatingDistributionChart';
import SatisfactionTrendChart from '../../../components/SatisfactionTrendChart';
import DepartmentPerformanceChart from '../../../components/DepartmentPerformanceChart';
import { StarIcon, TrendUpIcon, UsersIcon, BuildingOfficeIcon } from '../../../components/icons';
import { satisfactionDataService } from '../../../services/dataService';
import { calculateUnifiedMetrics, calculateSegmentMetrics } from '../../../utils/calculationUtils';
import { ChartDataPoint, MonthlyTrendData, DepartmentPerformanceData, NPSData, SatisfactionRecord } from '../../../types';

const Dashboard: React.FC = () => {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [npsData, setNpsData] = useState<NPSData | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<ChartDataPoint[]>([]);
  const [satisfactionTrend, setSatisfactionTrend] = useState<MonthlyTrendData[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformanceData[]>([]);
  const [totalResponses, setTotalResponses] = useState<number>(0);
  const [rawData, setRawData] = useState<SatisfactionRecord[]>([]);

  useEffect(() => {
    const init = async () => {
      await satisfactionDataService.loadData();
      
      // Obtener datos raw para usar funciones unificadas
      const data = satisfactionDataService.getRawData();
      setRawData(data);
      
      // Usar funciones unificadas de cálculo para consistencia
      const unifiedMetrics = calculateUnifiedMetrics(data);
      
      // Calcular métricas por segmento
      const personasMetrics = calculateSegmentMetrics(data, 'PERSONAS');
      const empresasMetrics = calculateSegmentMetrics(data, 'EMPRESARIAL');
      
      // Usar métodos del servicio para datos que no requieren cálculos unificados
      const distribution = satisfactionDataService.getRatingDistribution();
      const trend = satisfactionDataService.getMonthlyTrend();
      const performance = satisfactionDataService.getDepartmentPerformance();
      const nps = satisfactionDataService.calculateNPS();
      
      setOverallRating(unifiedMetrics.averageRating);
      setNpsData(nps);
      setRatingDistribution(distribution);
      setSatisfactionTrend(trend);
      setDepartmentPerformance(performance);
      setTotalResponses(unifiedMetrics.totalResponses);
      
      console.log('✅ Dashboard: Using unified calculations', {
        overall: unifiedMetrics.averageRating,
        nps: nps?.npsScore,
        totalResponses: unifiedMetrics.totalResponses,
        personas: personasMetrics.averageRating,
        empresas: empresasMetrics.averageRating
      });
    };
    init();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreCard 
          title="Overall Satisfaction" 
          value={`${overallRating}/5`} 
          icon={<StarIcon className="text-brand-accent" />} 
          footerText={`Based on ${totalResponses} responses`}
          valueClassName="text-brand-primary"
        />
        <ScoreCard 
          title="Net Promoter Score (NPS)" 
          value={npsData ? npsData.npsScore.toString() : 'N/A'} 
          icon={<TrendUpIcon className="text-emerald-500" />}
          footerText={npsData ? `P: ${npsData.promoters}, N: ${npsData.passives}, D: ${npsData.detractors}` : ''}
          valueClassName={npsData && npsData.npsScore > 0 ? 'text-emerald-600' : npsData && npsData.npsScore < 0 ? 'text-red-600' : 'text-slate-700'}
        />
         <ScoreCard 
          title="Total Responses" 
          value={totalResponses.toString()}
          icon={<UsersIcon className="text-sky-500" />}
          footerText="Across all surveys"
          valueClassName="text-sky-600"
        />
         <ScoreCard 
          title="Key Focus Area" 
          value={departmentPerformance.length > 0 ? departmentPerformance[departmentPerformance.length - 1].department : 'N/A'}
          icon={<BuildingOfficeIcon className="text-amber-500" />}
          footerText={departmentPerformance.length > 0 ? `Avg. Rating: ${departmentPerformance[departmentPerformance.length - 1].averageRating}` : 'Lowest performing department'}
          valueClassName="text-amber-600 text-xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingDistributionChart data={ratingDistribution} />
        <SatisfactionTrendChart data={satisfactionTrend} />
      </div>
      
      <div>
        <DepartmentPerformanceChart data={departmentPerformance} />
      </div>
    </div>
  );
};

export default Dashboard;
