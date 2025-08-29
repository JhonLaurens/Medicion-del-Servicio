import {
  Award,
  Calendar,
  ChevronRight,
  Filter,
  HelpCircle,
  Home,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Glossary from "../../../components/Glossary";
import { satisfactionDataService } from "../../../services/dataService";
import { calculateUnifiedMetrics, calculateSegmentMetrics } from "../../../utils/calculationUtils";
import { KPIData, SatisfactionRecord } from "../../../types";

interface MetricCard {
  metric: string;
  consolidado: number;
  personas: number;
  empresas: number;
  gap: number;
  priority: "high" | "medium" | "low";
}

const MetricsOverview: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [rawData, setRawData] = useState<SatisfactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Hook para manejar el redimensionamiento de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await satisfactionDataService.loadData();
        const kpiDataFromService = satisfactionDataService.getKPIData();
        const rawDataFromService = satisfactionDataService.getRawData();

        if (!kpiDataFromService || kpiDataFromService.length === 0) {
          throw new Error("No se pudieron cargar los datos de KPI");
        }

        setKpiData(kpiDataFromService);
        setRawData(rawDataFromService);
        
        console.log('✅ MetricsOverview: Data loaded', {
          kpiRecords: kpiDataFromService.length,
          rawRecords: rawDataFromService.length
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar los datos";
        setError(errorMessage);
        console.error("❌ MetricsOverview: Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const prepareMetricsData = (): MetricCard[] => {
    // Usar funciones unificadas para calcular métricas por segmento
    const personasMetrics = calculateSegmentMetrics(rawData, 'PERSONAS');
    const empresasMetrics = calculateSegmentMetrics(rawData, 'EMPRESARIAL');
    const overallMetrics = calculateUnifiedMetrics(rawData);

    // Definir las 4 métricas principales con sus valores unificados
    const mainMetrics = [
      {
        metric: "Claridad de Información",
        consolidado: overallMetrics.claridadPromedio,
        personas: personasMetrics.claridadPromedio,
        empresas: empresasMetrics.claridadPromedio,
      },
      {
        metric: "Recomendación (NPS)",
        consolidado: overallMetrics.recomendacionPromedio,
        personas: personasMetrics.recomendacionPromedio,
        empresas: empresasMetrics.recomendacionPromedio,
      },
      {
        metric: "Satisfacción General",
        consolidado: overallMetrics.satisfaccionPromedio,
        personas: personasMetrics.satisfaccionPromedio,
        empresas: empresasMetrics.satisfaccionPromedio,
      },
      {
        metric: "Lealtad",
        consolidado: overallMetrics.lealtadPromedio,
        personas: personasMetrics.lealtadPromedio,
        empresas: empresasMetrics.lealtadPromedio,
      },
    ];

    return mainMetrics.map((metricData) => {
      const gap = Math.abs(metricData.personas - metricData.empresas);
      const priority: "high" | "medium" | "low" =
        gap > 0.5 ? "high" : gap > 0.2 ? "medium" : "low";

      return {
        metric: metricData.metric,
        consolidado: Number(metricData.consolidado.toFixed(2)),
        personas: Number(metricData.personas.toFixed(2)),
        empresas: Number(metricData.empresas.toFixed(2)),
        gap: Number(gap.toFixed(2)),
        priority,
      };
    });
  };

  // Función para obtener datos históricos de evolución
  const getHistoricalData = () => {
    // Usar la misma lógica que la metodología para calcular los promedios
    const metricsData = prepareMetricsData();

    // Calcular promedios usando la misma lógica que en la metodología
    const personasActual =
      metricsData.length > 0
        ? metricsData.reduce((sum, m) => sum + m.personas, 0) /
          metricsData.length
        : 4.31;

    const empresasActual =
      metricsData.length > 0
        ? metricsData.reduce((sum, m) => sum + m.empresas, 0) /
          metricsData.length
        : 3.85;

    // CORRECCIÓN: Usar la misma lógica que la metodología (m.consolidado)
    const consolidadoActual =
      metricsData.length > 0
        ? metricsData.reduce((sum, m) => sum + m.consolidado, 0) /
          metricsData.length
        : 4.05;

    // Log para verificar datos (solo en desarrollo)
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      console.log("📊 Datos históricos 2024-2025 (Corregido):", {
        consolidado: consolidadoActual.toFixed(2),
        personas: personasActual.toFixed(2),
        empresas: empresasActual.toFixed(2),
        source:
          metricsData.length > 0
            ? "Promedio de m.consolidado (igual que metodología)"
            : "Valores por defecto",
        metricsCount: metricsData.length,
      });
    }

    // Datos históricos basados en la presentación (2020-2023) y datos reales del CSV (2024-2025)
    return [
      {
        year: "2020",
        consolidado: 4.33,
        personas: 4.33,
        empresas: 4.22,
        escala100: 86.64,
        trend: "Regular Alto",
      },
      {
        year: "2021",
        consolidado: 4.31,
        personas: 4.34,
        empresas: 3.95,
        escala100: 86.11,
        trend: "Regular Alto",
      },
      {
        year: "2022",
        consolidado: 4.37,
        personas: 4.38,
        empresas: 4.09,
        escala100: 87.44,
        trend: "Regular Alto",
      },
      {
        year: "2023",
        consolidado: 4.41,
        personas: 4.43,
        empresas: 3.86,
        escala100: 88.18,
        trend: "Regular Alto",
      },
      {
        year: "2024-2025",
        consolidado: consolidadoActual,
        personas: personasActual,
        empresas: empresasActual,
        escala100: consolidadoActual * 20,
        trend: "Regular Alto",
      },
    ];
  };

  // Función para preparar datos de gráficas individuales por métrica
  const prepareIndividualMetricData = (metricName: string) => {
    // Filtrar datos por métrica específica
    const metricData = kpiData.filter((kpi) => kpi.metric === metricName);
    if (metricData.length === 0) return [];

    // Extraer datos por segmento
    const personasData = metricData.find((kpi) => kpi.segment === "Personas");
    const empresasData = metricData.find(
      (kpi) => kpi.segment === "Empresarial"
    );

    // Calcular promedio consolidado
    const validData = metricData.filter((kpi) => kpi.averageRating > 0);
    const consolidadoAverage =
      validData.length > 0
        ? validData.reduce((sum, kpi) => sum + kpi.averageRating, 0) /
          validData.length
        : 0;

    return [
      {
        segment: "Personas",
        value: personasData?.averageRating || 0,
        color: "#059669",
      },
      {
        segment: "Empresas",
        value: empresasData?.averageRating || 0,
        color: "#dc2626",
      },
      {
        segment: "Coltefinanciera",
        value: consolidadoAverage,
        color: "#2563eb",
      },
    ];
  };

  // Función para obtener tendencia general
  const getGeneralTrend = () => {
    const historicalData = getHistoricalData();
    const currentYear = historicalData[historicalData.length - 1];
    const previousYear = historicalData[historicalData.length - 2];

    const trend = currentYear.consolidado - previousYear.consolidado;
    const trendPercentage = ((trend / previousYear.consolidado) * 100).toFixed(
      1
    );

    return {
      direction: trend > 0 ? "positiva" : trend < 0 ? "negativa" : "estable",
      value: Math.abs(trend).toFixed(2),
      percentage: trendPercentage,
      icon: trend > 0 ? "📈" : trend < 0 ? "📉" : "➡️",
    };
  };

  // Función para obtener el mejor segmento
  const getBestSegment = () => {
    const metricsData = prepareMetricsData();
    if (metricsData.length === 0)
      return { segment: "N/A", average: 0, metrics: [] };

    const personasAvg =
      metricsData.reduce((sum, m) => sum + m.personas, 0) / metricsData.length;
    const empresasAvg =
      metricsData.reduce((sum, m) => sum + m.empresas, 0) / metricsData.length;

    const bestSegment = personasAvg > empresasAvg ? "Personas" : "Empresas";
    const bestAverage = Math.max(personasAvg, empresasAvg);

    const bestMetrics = metricsData
      .filter((m) =>
        bestSegment === "Personas" ? m.personas >= 4.0 : m.empresas >= 4.0
      )
      .map((m) => m.metric);

    return {
      segment: bestSegment,
      average: bestAverage,
      metrics: bestMetrics,
    };
  };

  // Función para obtener objetivo 2026
  const get2026Target = () => {
    const currentAverage =
      prepareMetricsData().reduce((sum, m) => sum + m.consolidado, 0) /
      prepareMetricsData().length;
    const target = 4.5; // Objetivo aspiracional
    const gap = target - currentAverage;
    const improvementNeeded = ((gap / currentAverage) * 100).toFixed(1);

    return {
      current: currentAverage.toFixed(2),
      target: target.toFixed(1),
      gap: gap.toFixed(2),
      improvementNeeded,
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
                <div className="loading-skeleton w-48 h-6 rounded mx-auto mb-2"></div>
                <div className="loading-skeleton w-32 h-4 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Error al Cargar Datos
              </h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metricsData = prepareMetricsData();
  const historicalData = getHistoricalData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8 p-3 sm:p-6">
        {/* Header con Breadcrumbs y Navegación Mejorada */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Breadcrumbs */}
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Home className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500">Inicio</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">Panel Principal</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-brand-primary font-semibold">
                Métricas de Satisfacción
              </span>
            </nav>
          </div>

          {/* Header Principal */}
          <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-white space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    Métricas Principales de Satisfacción
                  </h1>
                </div>
                <p className="text-brand-light text-lg leading-relaxed">
                  Vista detallada de las 4 métricas clave del servicio al
                  cliente • Período 2024-2025
                </p>
              </div>

              {/* Controles y Acciones */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Selector de Período */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 hover:bg-white/20 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <select className="bg-transparent text-white text-sm font-medium focus:outline-none">
                      <option value="2024-2025" className="text-gray-800">
                        2024-2025
                      </option>
                      <option value="2023" className="text-gray-800">
                        2023
                      </option>
                      <option value="2022" className="text-gray-800">
                        2022
                      </option>
                      <option value="ytd" className="text-gray-800">
                        YTD
                      </option>
                    </select>
                  </div>
                </div>

                {/* Filtros */}
                <button
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-colors"
                  title="Filtros"
                >
                  <Filter className="w-5 h-5" />
                </button>

                {/* Glosario */}
                <button
                  onClick={() => setIsGlossaryOpen(true)}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-colors"
                  title="Abrir glosario"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                {/* Contador de Métricas */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-center">
                    <div className="text-xl font-bold">4</div>
                    <div className="text-xs text-brand-light">Métricas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
              {metricsData.length > 0
                ? (
                    metricsData.reduce((sum, m) => sum + m.consolidado, 0) /
                    metricsData.length
                  ).toFixed(2)
                : "0.00"}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Promedio General</div>
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
              {metricsData.filter((m) => m.consolidado >= 4.0).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Métricas Excelentes
            </div>
            <div className="text-xs text-gray-500">(≥4.0)</div>
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">
              {metricsData.filter((m) => m.priority === "high").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Brechas Críticas
            </div>
            <div className="text-xs text-gray-500">(&gt;0.5)</div>
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
              {metricsData.length > 0
                ? Math.max(...metricsData.map((m) => m.consolidado)).toFixed(2)
                : "0.00"}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Mejor Métrica</div>
          </div>
        </div>
        </div>

        {/* Tarjeta explicativa del cálculo - Separada y mejorada para PC */}
        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 border border-indigo-200">
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-700 mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Metodología de Cálculo</span>
            </div>

            {/* Promedios actuales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {metricsData.length > 0
                    ? (
                        metricsData.reduce((sum, m) => sum + m.personas, 0) /
                        metricsData.length
                      ).toFixed(2)
                    : "0.00"}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Promedio Personas
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {metricsData.length > 0
                    ? (
                        metricsData.reduce((sum, m) => sum + m.empresas, 0) /
                        metricsData.length
                      ).toFixed(2)
                    : "0.00"}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Promedio Empresas
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {metricsData.length > 0
                    ? (
                        metricsData.reduce((sum, m) => sum + m.consolidado, 0) /
                        metricsData.length
                      ).toFixed(2)
                    : "0.00"}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Promedio General
                </div>
              </div>
            </div>

            {/* Explicación metodológica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="font-semibold text-blue-600 mb-2">
                  Personas:
                </div>
                <div className="text-gray-700">
                  Promedio de respuestas del segmento "Personas Naturales"
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="font-semibold text-purple-600 mb-2">
                  Empresas:
                </div>
                <div className="text-gray-700">
                  Promedio de respuestas del segmento "Empresas"
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <div className="font-semibold text-green-600 mb-2">
                  Promedio General:
                </div>
                <div className="text-gray-700">
                  Promedio de los promedios de cada métrica individual
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Las 4 Métricas Principales - Mobile Optimized */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Las 4 Métricas Principales
            </h2>
            <p className="text-sm text-gray-600">Indicadores clave de satisfacción del cliente</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">Prioridad:</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">🔴 Crítica</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">🟡 Media</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">🟢 Baja</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {metricsData.map((metric: MetricCard, index: number) => {
              // Calcular tendencia (simulada basada en el valor actual)
              const getTrendIndicator = (value: number) => {
                if (value >= 4.2)
                  return {
                    icon: "📈",
                    color: "text-green-600",
                    text: "Excelente",
                  };
                if (value >= 4.0)
                  return { icon: "📊", color: "text-blue-600", text: "Bueno" };
                if (value >= 3.8)
                  return {
                    icon: "📉",
                    color: "text-yellow-600",
                    text: "Regular",
                  };
                return { icon: "⚠️", color: "text-red-600", text: "Crítico" };
              };

              const trend = getTrendIndicator(metric.consolidado);

              return (
                <div
                  key={index}
                  className={`group border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer ${getPriorityColor(
                    metric.priority
                  )} relative overflow-hidden`}
                >
                  {/* Indicador de tendencia flotante */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className={`flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-lg ${trend.color}`}
                    >
                      <span className="text-sm">{trend.icon}</span>
                      <span className="text-xs font-medium">{trend.text}</span>
                    </div>
                  </div>

                  {/* Header con mejor jerarquía */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 leading-tight mb-2 group-hover:text-brand-primary transition-colors">
                        {metric.metric}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {getPriorityIcon(metric.priority)}
                        </span>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {metric.priority === "high"
                            ? "Alta Prioridad"
                            : metric.priority === "medium"
                            ? "Media Prioridad"
                            : "Baja Prioridad"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Valor principal con mejor contraste */}
                  <div className="text-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-5xl font-black text-brand-primary mb-2 drop-shadow-sm">
                      {metric.consolidado.toFixed(2)}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Promedio General
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mt-2 rounded-full"></div>
                  </div>

                  {/* Segmentos con indicadores mejorados */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">👥</span>
                        <span className="text-sm text-gray-700 font-semibold">
                          Personas
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-blue-700 text-lg">
                          {metric.personas.toFixed(2)}
                        </span>
                        {metric.personas >= 4.0 && (
                          <span className="text-green-500">↗️</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-600">🏢</span>
                        <span className="text-sm text-gray-700 font-semibold">
                          Empresas
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-purple-700 text-lg">
                          {metric.empresas.toFixed(2)}
                        </span>
                        {metric.empresas < 4.0 && (
                          <span className="text-red-500">↘️</span>
                        )}
                      </div>
                    </div>

                    {/* Brecha con semáforo visual */}
                    <div
                      className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all ${
                        metric.gap > 0.5
                          ? "bg-gradient-to-r from-red-50 to-red-100 border-red-300 shadow-red-100"
                          : metric.gap > 0.2
                          ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-100"
                          : "bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-green-100"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={
                            metric.gap > 0.5
                              ? "text-red-600"
                              : metric.gap > 0.2
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {metric.gap > 0.5
                            ? "🚨"
                            : metric.gap > 0.2
                            ? "⚠️"
                            : "✅"}
                        </span>
                        <span className="text-sm text-gray-700 font-semibold">
                          Brecha
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-bold text-lg ${
                            metric.gap > 0.5
                              ? "text-red-700"
                              : metric.gap > 0.2
                              ? "text-yellow-700"
                              : "text-green-700"
                          }`}
                        >
                          {metric.gap.toFixed(2)}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {metric.gap > 0.5
                            ? "CRÍTICA"
                            : metric.gap > 0.2
                            ? "MEDIA"
                            : "BAJA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso visual */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso hacia meta 4.5</span>
                      <span>
                        {((metric.consolidado / 4.5) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(
                            (metric.consolidado / 4.5) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfica de Evolución Histórica con Controles Interactivos */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Evolución Histórica del Indicador General de Servicio
            </h2>
            <p className="text-sm text-gray-600">Tendencias de satisfacción por segmento (2020-2025)</p>
          </div>
          
          {/* Controles de Período Interactivos */}
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 text-xs font-medium bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors">
              Todo
            </button>
            <button className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              5 años
            </button>
            <button className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              3 años
            </button>
            <button className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              YTD
            </button>
          </div>
        </div>

          <div className="h-96 sm:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ 
                  top: 20, 
                  right: windowWidth < 640 ? 15 : 30, 
                  left: windowWidth < 640 ? 20 : 40, 
                  bottom: windowWidth < 640 ? 60 : 80 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: windowWidth < 640 ? 9 : 11 }}
                  axisLine={{ stroke: "#374151" }}
                  angle={windowWidth < 640 ? -45 : -45}
                  textAnchor="end"
                  height={windowWidth < 640 ? 50 : 60}
                  interval={windowWidth < 640 ? 1 : 0}
                />
                <YAxis
                  domain={[3.5, 4.5]}
                  tick={{ fontSize: windowWidth < 640 ? 9 : 11 }}
                  axisLine={{ stroke: "#374151" }}
                />
                <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "1px solid #e5e7eb",
                  borderRadius: windowWidth < 640 ? "12px" : "16px",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
                  fontSize: windowWidth < 640 ? "12px" : "14px",
                  padding: windowWidth < 640 ? "12px 16px" : "16px 20px",
                  backdropFilter: "blur(12px)",
                  zIndex: 1000,
                  maxWidth: windowWidth < 640 ? "250px" : "300px"
                }}
                wrapperStyle={{ zIndex: 1000 }}
                allowEscapeViewBox={{ x: false, y: false }}
                  formatter={(value: any, name: string) => {
                    const formattedValue =
                      typeof value === "number" ? value.toFixed(2) : value;
                    const displayName =
                      name === "consolidado"
                        ? "Promedio General"
                        : name === "personas"
                        ? "Personas"
                        : name === "empresas"
                        ? "Empresas"
                        : name;
                    const emoji =
                      name === "consolidado"
                        ? "🏦"
                        : name === "personas"
                        ? "👥"
                        : name === "empresas"
                        ? "🏢"
                        : "📊";
                    const color =
                      name === "consolidado"
                        ? "#2563eb"
                        : name === "personas"
                        ? "#059669"
                        : name === "empresas"
                        ? "#dc2626"
                        : "#6b7280";
                    return [
                      <span style={{ color, fontWeight: "bold" }}>
                        {formattedValue} / 5.0
                      </span>,
                      <span style={{ color: "#6b7280" }}>
                        {emoji} {displayName}
                      </span>,
                    ];
                  }}
                  labelFormatter={(label) => (
                    <span style={{ color: "#374151", fontWeight: "bold" }}>
                      📅 Período: {label}
                    </span>
                  )}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="consolidado"
                  stroke="#2563eb"
                  strokeWidth={3}
                  name="Promedio General"
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 6 }}
                  activeDot={{
                    r: 8,
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Line
                  type="monotone"
                  dataKey="personas"
                  stroke="#059669"
                  strokeWidth={2}
                  name="Personas"
                  dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#059669",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                  animationDuration={1500}
                  animationBegin={300}
                />
                <Line
                  type="monotone"
                  dataKey="empresas"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Empresas"
                  dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "#dc2626",
                    strokeWidth: 2,
                    fill: "#ffffff",
                  }}
                  animationDuration={1500}
                  animationBegin={600}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-2">
                📈 Tendencia General
              </h4>
              <p className="text-sm text-blue-700">
                El promedio general muestra una tendencia positiva desde 2020,
                con un crecimiento sostenido hasta 2023.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">
                👥 Segmento Personas
              </h4>
              <p className="text-sm text-green-700">
                Mantiene consistentemente calificaciones superiores a 4.3,
                mostrando alta satisfacción del cliente.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">
                🏢 Segmento Empresas
              </h4>
              <p className="text-sm text-red-700">
                Presenta mayor variabilidad, con oportunidades de mejora
                identificadas en 2021 y 2023.
              </p>
            </div>
          </div>
        </div>

        {/* Gráficas Individuales por Métrica */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Análisis Detallado por Métrica
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {metricsData.map((metric, index) => {
              const chartData = prepareIndividualMetricData(metric.metric);
              const hasData = chartData.some((item) => item.value > 0);

              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-6 text-center border-b border-gray-200 pb-3">
                    {metric.metric}
                  </h3>

                  {hasData ? (
                    <>
                      <div className="h-80 sm:h-96 lg:h-[450px] mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{
                              top: 20,
                              right: windowWidth < 640 ? 15 : 30,
                              left: windowWidth < 640 ? 20 : 40,
                              bottom: windowWidth < 640 ? 40 : 60,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="segment"
                              tick={{ fontSize: windowWidth < 640 ? 10 : 12, fill: "#374151" }}
                              axisLine={{ stroke: "#374151" }}
                              tickLine={{ stroke: "#374151" }}
                            />
                            <YAxis
                              domain={[0, 5]}
                              tick={{ fontSize: windowWidth < 640 ? 10 : 12, fill: "#374151" }}
                              axisLine={{ stroke: "#374151" }}
                              tickLine={{ stroke: "#374151" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.98)",
                                border: "1px solid #e5e7eb",
                                borderRadius: windowWidth < 640 ? "8px" : "12px",
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                                fontSize: windowWidth < 640 ? "12px" : "14px",
                                padding: windowWidth < 640 ? "8px 12px" : "12px 16px",
                                backdropFilter: "blur(8px)",
                                zIndex: 1000,
                              }}
                              wrapperStyle={{ zIndex: 1000 }}
                              allowEscapeViewBox={{ x: false, y: false }}
                              formatter={(
                                value: any,
                                name: string,
                                props: any
                              ) => {
                                const segmentName = props.payload.segment;
                                const emoji =
                                  segmentName === "Personas"
                                    ? "👥"
                                    : segmentName === "Empresarial"
                                    ? "🏢"
                                    : "🏦";
                                return [
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: props.payload.color,
                                    }}
                                  >
                                    {value.toFixed(2)} / 5.0
                                  </span>,
                                  <span style={{ color: "#6b7280" }}>
                                    {emoji} {segmentName}
                                  </span>,
                                ];
                              }}
                              labelFormatter={(label) => (
                                <span
                                  style={{
                                    color: "#374151",
                                    fontWeight: "bold",
                                  }}
                                >
                                  📊 {label}
                                </span>
                              )}
                            />
                            <Bar
                              dataKey="value"
                              radius={[6, 6, 0, 0]}
                              stroke="#ffffff"
                              strokeWidth={2}
                              animationDuration={1200}
                              animationBegin={0}
                            >
                              {chartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {chartData.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                              {item.segment}
                            </div>
                            <div
                              className="text-xl font-bold flex items-center justify-center"
                              style={{ color: item.color }}
                            >
                              {item.value.toFixed(2)}
                              <span className="text-xs text-gray-400 ml-1">
                                /5.0
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                              <div
                                className="h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  backgroundColor: item.color,
                                  width: `${(item.value / 5) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <div className="text-4xl text-gray-400 mb-3">📊</div>
                        <div className="text-lg font-medium text-gray-500 mb-2">
                          Sin datos disponibles
                        </div>
                        <div className="text-sm text-gray-400">
                          No hay información suficiente para mostrar esta
                          métrica
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Secciones de Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tendencia General */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Tendencia General
              </h3>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>

            {(() => {
              const trend = getGeneralTrend();
              return (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{trend.icon}</div>
                    <div className="text-2xl font-bold text-gray-800">
                      Tendencia {trend.direction}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">
                      Variación vs año anterior
                    </div>
                    <div
                      className={`text-xl font-bold ${
                        trend.direction === "positiva"
                          ? "text-green-600"
                          : trend.direction === "negativa"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {trend.direction === "positiva"
                        ? "+"
                        : trend.direction === "negativa"
                        ? "-"
                        : ""}
                      {trend.value} puntos ({trend.percentage}%)
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {trend.direction === "positiva" &&
                      "La satisfacción general muestra una evolución favorable, indicando mejoras en la percepción del servicio."}
                    {trend.direction === "negativa" &&
                      "Se observa una disminución en la satisfacción que requiere atención y acciones correctivas."}
                    {trend.direction === "estable" &&
                      "La satisfacción se mantiene estable, sugiriendo consistencia en la calidad del servicio."}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Mejor Segmento */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Mejor Segmento
              </h3>
              <Award className="w-6 h-6 text-green-600" />
            </div>

            {(() => {
              const bestSegment = getBestSegment();
              return (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {bestSegment.segment === "Personas" ? "👥" : "🏢"}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {bestSegment.segment}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">
                      Promedio general
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {bestSegment.average.toFixed(2)} / 5.0
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Métricas destacadas:
                    </div>
                    <div className="text-xs text-gray-600">
                      {bestSegment.metrics.length > 0
                        ? bestSegment.metrics.slice(0, 2).join(", ") +
                          (bestSegment.metrics.length > 2 ? "..." : "")
                        : "Todas las métricas en desarrollo"}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Objetivo 2026 */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Objetivo 2026</h3>
              <Target className="w-6 h-6 text-purple-600" />
            </div>

            {(() => {
              const target2026 = get2026Target();
              return (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {target2026.target}
                    </div>
                    <div className="text-sm text-gray-600">
                      Meta aspiracional
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Actual</div>
                      <div className="text-lg font-bold text-gray-800">
                        {target2026.current}
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">
                        Brecha a cerrar
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        {target2026.gap} puntos
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    Se requiere una mejora del {target2026.improvementNeeded}%
                    para alcanzar la meta establecida.
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Análisis de Brechas */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Análisis de Brechas por Segmento
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Identificación de oportunidades de mejora basada en las
              diferencias entre segmentos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-red-800 text-lg">
                  🔴 Brechas Altas
                </h3>
                <div className="bg-red-200 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                  &gt;0.5
                </div>
              </div>
              <div className="space-y-3">
                {metricsData
                  .filter((m: MetricCard) => m.priority === "high")
                  .slice(0, 5)
                  .map((metric: MetricCard, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-red-200 shadow-sm"
                    >
                      <div className="font-semibold text-red-800 text-sm mb-1">
                        {metric.metric}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-bold">
                          Brecha: {metric.gap.toFixed(2)}
                        </span>
                        <div className="w-12 bg-red-200 rounded-full h-1.5">
                          <div
                            className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                (metric.gap / 1) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                {metricsData.filter((m: MetricCard) => m.priority === "high")
                  .length === 0 && (
                  <div className="text-center py-6">
                    <div className="text-3xl text-red-300 mb-2">🎉</div>
                    <div className="text-red-600 font-medium">¡Excelente!</div>
                    <div className="text-red-500 text-sm">
                      No hay brechas críticas
                    </div>
                  </div>
                )}
                {metricsData.filter((m: MetricCard) => m.priority === "high")
                  .length > 5 && (
                  <div className="text-center text-xs text-red-600 bg-red-100 rounded-lg p-2">
                    +
                    {metricsData.filter(
                      (m: MetricCard) => m.priority === "high"
                    ).length - 5}{" "}
                    métricas adicionales
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-yellow-800 text-lg">
                  🟡 Brechas Medias
                </h3>
                <div className="bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                  0.2-0.5
                </div>
              </div>
              <div className="space-y-3">
                {metricsData
                  .filter((m: MetricCard) => m.priority === "medium")
                  .slice(0, 5)
                  .map((metric: MetricCard, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-yellow-200 shadow-sm"
                    >
                      <div className="font-semibold text-yellow-800 text-sm mb-1">
                        {metric.metric}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-600 font-bold">
                          Brecha: {metric.gap.toFixed(2)}
                        </span>
                        <div className="w-12 bg-yellow-200 rounded-full h-1.5">
                          <div
                            className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                (metric.gap / 0.5) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                {metricsData.filter((m: MetricCard) => m.priority === "medium")
                  .length === 0 && (
                  <div className="text-center py-6">
                    <div className="text-3xl text-yellow-300 mb-2">👍</div>
                    <div className="text-yellow-600 font-medium">Muy bien</div>
                    <div className="text-yellow-500 text-sm">
                      Sin brechas moderadas
                    </div>
                  </div>
                )}
                {metricsData.filter((m: MetricCard) => m.priority === "medium")
                  .length > 5 && (
                  <div className="text-center text-xs text-yellow-600 bg-yellow-100 rounded-lg p-2">
                    +
                    {metricsData.filter(
                      (m: MetricCard) => m.priority === "medium"
                    ).length - 5}{" "}
                    métricas adicionales
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-green-800 text-lg">
                  🟢 Brechas Bajas
                </h3>
                <div className="bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  &lt;0.2
                </div>
              </div>
              <div className="space-y-3">
                {metricsData
                  .filter((m: MetricCard) => m.priority === "low")
                  .slice(0, 5)
                  .map((metric: MetricCard, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-green-200 shadow-sm"
                    >
                      <div className="font-semibold text-green-800 text-sm mb-1">
                        {metric.metric}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-bold">
                          Brecha: {metric.gap.toFixed(2)}
                        </span>
                        <div className="w-12 bg-green-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                (metric.gap / 0.2) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                {metricsData.filter((m: MetricCard) => m.priority === "low")
                  .length === 0 && (
                  <div className="text-center py-6">
                    <div className="text-3xl text-green-300 mb-2">📊</div>
                    <div className="text-green-600 font-medium">Sin datos</div>
                    <div className="text-green-500 text-sm">
                      No hay brechas menores
                    </div>
                  </div>
                )}
                {metricsData.filter((m: MetricCard) => m.priority === "low")
                  .length > 5 && (
                  <div className="text-center text-xs text-green-600 bg-green-100 rounded-lg p-2">
                    +
                    {metricsData.filter((m: MetricCard) => m.priority === "low")
                      .length - 5}{" "}
                    métricas adicionales
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Brechas */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              📊 Resumen de Brechas
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {
                    metricsData.filter((m: MetricCard) => m.priority === "high")
                      .length
                  }
                </div>
                <div className="text-sm text-red-600">Críticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    metricsData.filter(
                      (m: MetricCard) => m.priority === "medium"
                    ).length
                  }
                </div>
                <div className="text-sm text-yellow-600">Moderadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    metricsData.filter((m: MetricCard) => m.priority === "low")
                      .length
                  }
                </div>
                <div className="text-sm text-green-600">Menores</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            📊 Resumen Ejecutivo
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Análisis integral de las métricas de satisfacción del cliente con
            hallazgos clave y recomendaciones estratégicas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hallazgos Principales */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Hallazgos Principales
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Satisfacción General
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Promedio consolidado de{" "}
                      <strong>
                        {metricsData.length > 0
                          ? (
                              metricsData.reduce(
                                (sum, m) => sum + m.consolidado,
                                0
                              ) / metricsData.length
                            ).toFixed(2)
                          : "4.05"}
                      </strong>{" "}
                      sobre 5.0, indicando un nivel de satisfacción{" "}
                      <strong>Regular Alto</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚖️</div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Diferencias por Segmento
                    </h4>
                    <p className="text-blue-700 text-sm">
                      {(() => {
                        const personasAvg =
                          metricsData.length > 0
                            ? metricsData.reduce(
                                (sum, m) => sum + m.personas,
                                0
                              ) / metricsData.length
                            : 0;
                        const empresasAvg =
                          metricsData.length > 0
                            ? metricsData.reduce(
                                (sum, m) => sum + m.empresas,
                                0
                              ) / metricsData.length
                            : 0;
                        const bestSegment =
                          personasAvg > empresasAvg ? "Personas" : "Empresas";
                        const gap = Math.abs(personasAvg - empresasAvg);
                        return `Segmento <strong>${bestSegment}</strong> lidera con ${Math.max(
                          personasAvg,
                          empresasAvg
                        ).toFixed(2)}, brecha promedio de ${gap.toFixed(
                          2
                        )} puntos`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">📈</div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Tendencia Histórica
                    </h4>
                    <p className="text-blue-700 text-sm">
                      {(() => {
                        const trend = getGeneralTrend();
                        return `Evolución ${trend.direction} con variación de ${trend.value} puntos (${trend.percentage}%) respecto al período anterior`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recomendaciones Estratégicas */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Recomendaciones Estratégicas
            </h3>
            <div className="space-y-4">
              {(() => {
                const highPriorityMetrics = metricsData.filter(
                  (m) => m.priority === "high"
                );
                const mediumPriorityMetrics = metricsData.filter(
                  (m) => m.priority === "medium"
                );
                const target2026 = get2026Target();

                return (
                  <>
                    {highPriorityMetrics.length > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">🚨</div>
                          <div>
                            <h4 className="font-semibold text-green-800 mb-1">
                              Prioridad Crítica
                            </h4>
                            <p className="text-green-700 text-sm">
                              Atender inmediatamente{" "}
                              <strong>
                                {highPriorityMetrics.length} métrica(s)
                              </strong>{" "}
                              con brechas &gt;0.5:
                              {highPriorityMetrics
                                .map((m) => m.metric)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🎯</div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">
                            Meta 2026
                          </h4>
                          <p className="text-green-700 text-sm">
                            Alcanzar <strong>{target2026.target}</strong>{" "}
                            requiere mejora del{" "}
                            <strong>{target2026.improvementNeeded}%</strong>(
                            {target2026.gap} puntos adicionales)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🔄</div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">
                            Enfoque Segmentado
                          </h4>
                          <p className="text-green-700 text-sm">
                            {(() => {
                              const personasAvg =
                                metricsData.length > 0
                                  ? metricsData.reduce(
                                      (sum, m) => sum + m.personas,
                                      0
                                    ) / metricsData.length
                                  : 0;
                              const empresasAvg =
                                metricsData.length > 0
                                  ? metricsData.reduce(
                                      (sum, m) => sum + m.empresas,
                                      0
                                    ) / metricsData.length
                                  : 0;
                              const weakerSegment =
                                personasAvg < empresasAvg
                                  ? "Personas"
                                  : "Empresas";
                              return `Implementar estrategias específicas para el segmento <strong>${weakerSegment}</strong> y mantener fortalezas del segmento líder`;
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Indicadores Clave de Rendimiento */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <Award className="w-6 h-6 mr-2" />
            Indicadores Clave de Rendimiento (KPI)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {metricsData.length > 0
                    ? (
                        metricsData.reduce((sum, m) => sum + m.consolidado, 0) /
                        metricsData.length
                      ).toFixed(2)
                    : "4.05"}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Promedio General
                </div>
                <div className="text-xs text-gray-500 mt-1">Escala 1-5</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {metricsData.filter((m) => m.priority === "high").length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Brechas Críticas
                </div>
                <div className="text-xs text-gray-500 mt-1">&gt;0.5 puntos</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(() => {
                    const target2026 = get2026Target();
                    return target2026.improvementNeeded;
                  })()}
                  %
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Mejora Requerida
                </div>
                <div className="text-xs text-gray-500 mt-1">Meta 2026</div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {(() => {
                    const trend = getGeneralTrend();
                    return trend.direction === "positiva"
                      ? "📈"
                      : trend.direction === "negativa"
                      ? "📉"
                      : "➡️";
                  })()}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Tendencia
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {(() => {
                    const trend = getGeneralTrend();
                    return `${trend.percentage}%`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusiones y Próximos Pasos */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 text-center">
            🎯 Conclusiones y Próximos Pasos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-indigo-800 mb-3">
                ✅ Fortalezas Identificadas
              </h4>
              <ul className="space-y-2 text-indigo-700 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>
                    Nivel de satisfacción general en rango "Regular Alto"
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>
                    {(() => {
                      const bestSegment = getBestSegment();
                      return `Segmento ${bestSegment.segment} muestra consistencia superior`;
                    })()}
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>
                    Base sólida para alcanzar objetivos estratégicos 2026
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-indigo-800 mb-3">
                🔧 Áreas de Mejora
              </h4>
              <ul className="space-y-2 text-indigo-700 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>
                    Reducir brechas entre segmentos Personas y Empresas
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>
                    Implementar planes de acción específicos por métrica
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span>Establecer monitoreo continuo y alertas tempranas</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
            <p className="text-indigo-800 text-center font-medium">
              💡 <strong>Recomendación Principal:</strong> Priorizar acciones en
              métricas con brechas críticas y desarrollar estrategias
              diferenciadas por segmento para maximizar el impacto en la
              satisfacción general.
            </p>
          </div>
        </div>
      </div>

      {/* Glossary Modal */}
      {isGlossaryOpen && (
        <Glossary
          isOpen={isGlossaryOpen}
          onClose={() => setIsGlossaryOpen(false)}
        />
      )}
    </div>
  );
};

export default MetricsOverview;
