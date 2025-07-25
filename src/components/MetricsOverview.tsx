import React, { useEffect, useState } from "react";
import { satisfactionDataService } from "../services/dataService";
import { KPIData } from "../types";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { HelpCircle, TrendingUp, Target, Award } from "lucide-react";
import Glossary from "./Glossary";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await satisfactionDataService.loadData();
        const data = satisfactionDataService.getKPIData();

        if (!data || data.length === 0) {
          throw new Error("No se pudieron cargar los datos de KPI");
        }

        setKpiData(data);
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
    // Filtrar solo las 4 métricas principales
    const mainMetrics = [
      "Claridad de Información",
      "Recomendación (NPS)",
      "Satisfacción General",
      "Lealtad",
    ];

    return kpiData
      .filter((kpi) => mainMetrics.includes(kpi.metric))
      .map((kpi) => {
        const personasAvg =
          typeof kpi.personas?.average === "number" ? kpi.personas.average : 0;
        const empresasAvg =
          typeof kpi.empresarial?.average === "number"
            ? kpi.empresarial.average
            : 0;
        const consolidadoAvg =
          typeof kpi.consolidado?.average === "number"
            ? kpi.consolidado.average
            : 0;
        const gap = Math.abs(personasAvg - empresasAvg);

        const priority: "high" | "medium" | "low" =
          gap > 0.5 ? "high" : gap > 0.2 ? "medium" : "low";

        return {
          metric: kpi.metric,
          consolidado: consolidadoAvg,
          personas: personasAvg,
          empresas: empresasAvg,
          gap,
          priority,
        };
      })
      .sort((a, b) => {
        // Ordenar según el orden específico deseado
        const order = [
          "Claridad de Información",
          "Recomendación (NPS)",
          "Satisfacción General",
          "Lealtad",
        ];
        return order.indexOf(a.metric) - order.indexOf(b.metric);
      });
  };

  // Función para obtener datos históricos de evolución
  const getHistoricalData = () => {
    // Usar la misma lógica que la metodología para calcular los promedios
    const metricsData = prepareMetricsData();
    
    // Calcular promedios usando la misma lógica que en la metodología
    const personasActual = metricsData.length > 0 
      ? metricsData.reduce((sum, m) => sum + m.personas, 0) / metricsData.length
      : 4.31;
    
    const empresasActual = metricsData.length > 0 
      ? metricsData.reduce((sum, m) => sum + m.empresas, 0) / metricsData.length
      : 3.85;

    // CORRECCIÓN: Usar la misma lógica que la metodología (m.consolidado)
    const consolidadoActual = metricsData.length > 0 
      ? metricsData.reduce((sum, m) => sum + m.consolidado, 0) / metricsData.length
      : 4.05;

    // Log para verificar datos (solo en desarrollo)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('📊 Datos históricos 2024-2025 (Corregido):', {
        consolidado: consolidadoActual.toFixed(2),
        personas: personasActual.toFixed(2),
        empresas: empresasActual.toFixed(2),
        source: metricsData.length > 0 ? 'Promedio de m.consolidado (igual que metodología)' : 'Valores por defecto',
        metricsCount: metricsData.length
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
    const metric = kpiData.find((kpi) => kpi.metric === metricName);
    if (!metric) return [];

    return [
      {
        segment: "Personas",
        value: metric.personas?.average || 0,
        color: "#059669",
      },
      {
        segment: "Empresas",
        value: metric.empresarial?.average || 0,
        color: "#dc2626",
      },
      {
        segment: "Coltefinanciera",
        value: metric.consolidado?.average || 0,
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
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent px-8 py-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Métricas Principales de Satisfacción
              </h1>
              <p className="text-brand-light text-lg">
                Vista detallada de las 4 métricas clave del servicio al cliente
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsGlossaryOpen(true)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
                title="Abrir glosario"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-brand-light">Métricas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {metricsData.length > 0
                ? (
                    metricsData.reduce((sum, m) => sum + m.consolidado, 0) /
                    metricsData.length
                  ).toFixed(2)
                : "0.00"}
            </div>
            <div className="text-sm text-gray-600">Promedio General</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {metricsData.filter((m) => m.consolidado >= 4.0).length}
            </div>
            <div className="text-sm text-gray-600">
              Métricas Excelentes (≥4.0)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {metricsData.filter((m) => m.priority === "high").length}
            </div>
            <div className="text-sm text-gray-600">
              Brechas Altas ({">"}0.5)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {metricsData.length > 0
                ? Math.max(...metricsData.map((m) => m.consolidado)).toFixed(2)
                : "0.00"}
            </div>
            <div className="text-sm text-gray-600">Mejor Métrica</div>
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
                  ? (metricsData.reduce((sum, m) => sum + m.personas, 0) / metricsData.length).toFixed(2)
                  : "0.00"}
              </div>
              <div className="text-sm text-gray-600 font-medium">Promedio Personas</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {metricsData.length > 0
                  ? (metricsData.reduce((sum, m) => sum + m.empresas, 0) / metricsData.length).toFixed(2)
                  : "0.00"}
              </div>
              <div className="text-sm text-gray-600 font-medium">Promedio Empresas</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {metricsData.length > 0
                  ? (metricsData.reduce((sum, m) => sum + m.consolidado, 0) / metricsData.length).toFixed(2)
                  : "0.00"}
              </div>
              <div className="text-sm text-gray-600 font-medium">Promedio General</div>
            </div>
          </div>

          {/* Explicación metodológica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <div className="font-semibold text-blue-600 mb-2">Personas:</div>
              <div className="text-gray-700">Promedio de respuestas del segmento "Personas Naturales"</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <div className="font-semibold text-purple-600 mb-2">Empresas:</div>
              <div className="text-gray-700">Promedio de respuestas del segmento "Empresas"</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <div className="font-semibold text-green-600 mb-2">Promedio General:</div>
              <div className="text-gray-700">Promedio de los promedios de cada métrica individual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Las 4 Métricas Principales - Layout Horizontal */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Las 4 Métricas Principales
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Prioridad:</span>
              <span className="text-xs">🔴 Alta</span>
              <span className="text-xs">🟡 Media</span>
              <span className="text-xs">🟢 Baja</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((metric: MetricCard, index: number) => (
            <div
              key={index}
              className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${getPriorityColor(
                metric.priority
              )}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800 leading-tight flex-1 pr-2">
                  {metric.metric}
                </h3>
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                  <span className="text-2xl">
                    {getPriorityIcon(metric.priority)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-brand-primary">
                    {metric.consolidado.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">Promedio General</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">
                      Personas
                    </span>
                    <span className="font-bold text-blue-600 text-lg">
                      {metric.personas.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">
                      Empresas
                    </span>
                    <span className="font-bold text-purple-600 text-lg">
                      {metric.empresas.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm text-gray-600 font-medium">
                      Brecha
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        metric.gap > 0.5
                          ? "text-red-600"
                          : metric.gap > 0.2
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {metric.gap.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfica de Evolución Histórica */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Evolución Histórica del Indicador General de Servicio (2020-2025)
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                domain={[3.5, 4.5]}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: any, name: string) => [
                  typeof value === "number" ? value.toFixed(2) : value,
                  name === "Consolidado"
                    ? "Promedio General"
                    : name === "Personas"
                    ? "Personas"
                    : name === "Empresas"
                    ? "Empresas"
                    : name,
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="consolidado"
                stroke="#2563eb"
                strokeWidth={3}
                name="Promedio General"
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="personas"
                stroke="#059669"
                strokeWidth={2}
                name="Personas"
                dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="empresas"
                stroke="#dc2626"
                strokeWidth={2}
                name="Empresas"
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
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
              El promedio general muestra una tendencia positiva desde
              2020, con un crecimiento sostenido hasta 2023.
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
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                  {metric.metric}
                </h3>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="segment"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: "#374151" }}
                      />
                      <YAxis
                        domain={[0, 5]}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: "#374151" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value: any) => [
                          value.toFixed(2),
                          "Calificación",
                        ]}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {chartData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-2">
                      <div className="text-sm font-medium text-gray-600">
                        {item.segment}
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: item.color }}
                      >
                        {item.value.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
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
            <h3 className="text-xl font-bold text-gray-800">Mejor Segmento</h3>
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
                  <div className="text-sm text-gray-600">Meta aspiracional</div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Actual</div>
                    <div className="text-lg font-bold text-gray-800">
                      {target2026.current}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Brecha a cerrar</div>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Análisis de Brechas por Segmento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-red-800 mb-4">
              🔴 Brechas Altas ({">"}0.5)
            </h3>
            <div className="space-y-2">
              {metricsData
                .filter((m: MetricCard) => m.priority === "high")
                .slice(0, 5)
                .map((metric: MetricCard, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-red-700">
                      {metric.metric}
                    </div>
                    <div className="text-red-600">
                      Brecha: {metric.gap.toFixed(2)}
                    </div>
                  </div>
                ))}
              {metricsData.filter((m: MetricCard) => m.priority === "high").length > 5 && (
                <div className="text-xs text-red-600">
                  +{metricsData.filter((m: MetricCard) => m.priority === "high").length - 5}{" "}
                  más...
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-bold text-yellow-800 mb-4">
              🟡 Brechas Medias (0.2-0.5)
            </h3>
            <div className="space-y-2">
              {metricsData
                .filter((m: MetricCard) => m.priority === "medium")
                .slice(0, 5)
                .map((metric: MetricCard, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-yellow-700">
                      {metric.metric}
                    </div>
                    <div className="text-yellow-600">
                      Brecha: {metric.gap.toFixed(2)}
                    </div>
                  </div>
                ))}
              {metricsData.filter((m: MetricCard) => m.priority === "medium").length >
                5 && (
                <div className="text-xs text-yellow-600">
                  +
                  {metricsData.filter((m: MetricCard) => m.priority === "medium").length -
                    5}{" "}
                  más...
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-800 mb-4">
              🟢 Brechas Bajas ({"<"}0.2)
            </h3>
            <div className="space-y-2">
              {metricsData
                .filter((m: MetricCard) => m.priority === "low")
                .slice(0, 5)
                .map((metric: MetricCard, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-green-700">
                      {metric.metric}
                    </div>
                    <div className="text-green-600">
                      Brecha: {metric.gap.toFixed(2)}
                    </div>
                  </div>
                ))}
              {metricsData.filter((m: MetricCard) => m.priority === "low").length > 5 && (
                <div className="text-xs text-green-600">
                  +{metricsData.filter((m: MetricCard) => m.priority === "low").length - 5}{" "}
                  más...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Glossary Modal */}
      {isGlossaryOpen && <Glossary isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />}
  </div>
);
}
export default MetricsOverview;
