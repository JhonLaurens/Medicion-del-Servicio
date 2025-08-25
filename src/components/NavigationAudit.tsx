import React, { useState, useEffect } from 'react';
import { satisfactionDataService } from '../services/dataService';

interface AuditResult {
  section: string;
  status: 'success' | 'warning' | 'error';
  issues: Issue[];
  loadTime: number;
  dataLoaded: boolean;
  consoleErrors: string[];
}

interface Issue {
  type: 'visual' | 'functional' | 'performance' | 'data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  recommendation: string;
}

const NavigationAudit: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const sections = [
    { id: 'inicio', name: 'Página de Inicio', path: '/' },
    { id: 'ficha-tecnica', name: 'Ficha Técnica', path: '/ficha-tecnica' },
    { id: 'metricas-completas', name: 'Métricas Completas', path: '/metricas-completas' },
    { id: 'analisis-segmento', name: 'Análisis por Segmentos', path: '/analisis-segmento' },
    { id: 'analisis-geografico', name: 'Análisis Geográfico', path: '/analisis-geografico' },
    { id: 'analisis-sugerencias', name: 'Análisis de Sugerencias', path: '/analisis-sugerencias' },
    { id: 'explorador-datos', name: 'Explorador de Datos', path: '/explorador-datos' },
    { id: 'participacion-gerentes', name: 'Participación de Gerentes', path: '/participacion-gerentes' },
    { id: 'pruebas-componentes', name: 'Pruebas de Componentes', path: '/pruebas-componentes' },
    { id: 'diagnostico', name: 'Diagnóstico del Sistema', path: '/diagnostico' },
    { id: 'diagnostico-datos', name: 'Diagnóstico de Datos', path: '/diagnostico-datos' }
  ];

  const runAudit = async () => {
    setIsRunning(true);
    setAuditResults([]);
    setProgress(0);

    const results: AuditResult[] = [];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      setCurrentSection(section.name);
      setProgress(((i + 1) / sections.length) * 100);

      const startTime = performance.now();
      const result = await auditSection(section);
      const endTime = performance.now();
      
      result.loadTime = endTime - startTime;
      results.push(result);
      
      // Pequeña pausa entre secciones
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setAuditResults(results);
    setIsRunning(false);
    setCurrentSection('');
  };

  const auditSection = async (section: { id: string; name: string; path: string }): Promise<AuditResult> => {
    const issues: Issue[] = [];
    const consoleErrors: string[] = [];

    // Capturar errores de consola
    const originalError = console.error;
    console.error = (...args) => {
      consoleErrors.push(args.join(' '));
      originalError(...args);
    };

    try {
      // Simular navegación (en una implementación real, esto cambiaría la ruta)
      // Por ahora, verificamos el estado de los datos y componentes
      
      // Verificar carga de datos
      const dataLoaded = satisfactionDataService.isDataLoaded();
      const data = satisfactionDataService.getData();
      
      if (!dataLoaded || data.length === 0) {
        issues.push({
          type: 'data',
          severity: 'critical',
          description: 'Los datos del CSV no están cargados correctamente',
          location: section.name,
          recommendation: 'Verificar la carga del archivo datos.csv y el dataService'
        });
      }

      // Verificar problemas específicos por sección
      switch (section.id) {
        case 'analisis-segmento':
          await auditSegmentAnalysis(issues, section.name);
          break;
        case 'participacion-gerentes':
          await auditManagerParticipation(issues, section.name);
          break;
        case 'analisis-geografico':
          await auditGeographicAnalysis(issues, section.name);
          break;
        case 'analisis-sugerencias':
          await auditSuggestionsAnalysis(issues, section.name);
          break;
        case 'metricas-completas':
          await auditMetricsOverview(issues, section.name);
          break;
      }

      // Verificar rendimiento
      if (performance.now() > 3000) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          description: 'Tiempo de carga superior a 3 segundos',
          location: section.name,
          recommendation: 'Optimizar la carga de componentes y datos'
        });
      }

    } catch (error) {
      issues.push({
        type: 'functional',
        severity: 'critical',
        description: `Error durante la auditoría: ${error}`,
        location: section.name,
        recommendation: 'Revisar el código del componente y corregir errores'
      });
    } finally {
      console.error = originalError;
    }

    const status = issues.some(i => i.severity === 'critical') ? 'error' : 
                  issues.some(i => i.severity === 'high' || i.severity === 'medium') ? 'warning' : 'success';

    return {
      section: section.name,
      status,
      issues,
      loadTime: 0, // Se establecerá después
      dataLoaded: satisfactionDataService.isDataLoaded(),
      consoleErrors
    };
  };

  const auditSegmentAnalysis = async (issues: Issue[], sectionName: string) => {
    try {
      const kpiData = satisfactionDataService.getKPIData();
      if (!kpiData || kpiData.length === 0) {
        issues.push({
          type: 'data',
          severity: 'high',
          description: 'No se encontraron datos KPI para el análisis de segmentos',
          location: sectionName,
          recommendation: 'Verificar el método getKPIData() del dataService'
        });
      }
    } catch (error) {
      issues.push({
        type: 'functional',
        severity: 'critical',
        description: `Error en análisis de segmentos: ${error}`,
        location: sectionName,
        recommendation: 'Revisar el componente SegmentAnalysis y sus dependencias'
      });
    }
  };

  const auditManagerParticipation = async (issues: Issue[], sectionName: string) => {
    try {
      const data = satisfactionDataService.getData();
      const executivesWithData = data.filter(record => record.EJECUTIVO_FINAL && record.EJECUTIVO_FINAL.trim() !== '');
      
      if (executivesWithData.length === 0) {
        issues.push({
          type: 'data',
          severity: 'high',
          description: 'No se encontraron datos de ejecutivos',
          location: sectionName,
          recommendation: 'Verificar que el CSV contenga datos de EJECUTIVO_FINAL'
        });
      }
    } catch (error) {
      issues.push({
        type: 'functional',
        severity: 'critical',
        description: `Error en participación de gerentes: ${error}`,
        location: sectionName,
        recommendation: 'Revisar el componente ManagerParticipationReport'
      });
    }
  };

  const auditGeographicAnalysis = async (issues: Issue[], sectionName: string) => {
    try {
      const cityData = satisfactionDataService.getCityData();
      if (!cityData || cityData.length === 0) {
        issues.push({
          type: 'data',
          severity: 'medium',
          description: 'No se encontraron datos geográficos',
          location: sectionName,
          recommendation: 'Verificar el método getCityData() del dataService'
        });
      }
    } catch (error) {
      issues.push({
        type: 'functional',
        severity: 'high',
        description: `Error en análisis geográfico: ${error}`,
        location: sectionName,
        recommendation: 'Revisar el componente GeographicAnalysis'
      });
    }
  };

  const auditSuggestionsAnalysis = async (issues: Issue[], sectionName: string) => {
    try {
      const suggestions = satisfactionDataService.getSuggestionData();
      if (!suggestions || suggestions.length === 0) {
        issues.push({
          type: 'data',
          severity: 'medium',
          description: 'No se encontraron datos de sugerencias',
          location: sectionName,
          recommendation: 'Verificar el método getSuggestionData() del dataService'
        });
      }
    } catch (error) {
      issues.push({
        type: 'functional',
        severity: 'high',
        description: `Error en análisis de sugerencias: ${error}`,
        location: sectionName,
        recommendation: 'Revisar el componente SuggestionsAnalysis'
      });
    }
  };

  const auditMetricsOverview = async (issues: Issue[], sectionName: string) => {
    try {
      const overallRating = satisfactionDataService.getOverallAverageRating();
      const npsData = satisfactionDataService.calculateNPS();
      
      if (overallRating === 0) {
        issues.push({
          type: 'data',
          severity: 'high',
          description: 'La calificación promedio general es 0',
          location: sectionName,
          recommendation: 'Verificar que los datos de satisfacción se estén procesando correctamente'
        });
      }
      
      if (npsData.npsScore === 0 && npsData.promoters === 0) {
        issues.push({
          type: 'data',
          severity: 'medium',
          description: 'Los datos de NPS muestran valores en 0',
          location: sectionName,
          recommendation: 'Verificar el cálculo de NPS en el dataService'
        });
      }
    } catch (error) {
      issues.push({
        type: 'functional',
        severity: 'high',
        description: `Error en métricas generales: ${error}`,
        location: sectionName,
        recommendation: 'Revisar el componente MetricsOverview'
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSections: auditResults.length,
        successfulSections: auditResults.filter(r => r.status === 'success').length,
        sectionsWithWarnings: auditResults.filter(r => r.status === 'warning').length,
        sectionsWithErrors: auditResults.filter(r => r.status === 'error').length,
        totalIssues: auditResults.reduce((sum, r) => sum + r.issues.length, 0),
        criticalIssues: auditResults.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0)
      },
      results: auditResults
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Auditoría de Navegación
          </h1>
          <p className="text-gray-600">
            Herramienta para detectar errores automáticamente en todas las secciones de la aplicación
          </p>
        </div>

        {/* Panel de Control */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Control de Auditoría</h2>
            <div className="flex space-x-4">
              <button
                onClick={runAudit}
                disabled={isRunning}
                className={`px-6 py-2 rounded-lg font-medium ${
                  isRunning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRunning ? 'Ejecutando...' : 'Iniciar Auditoría'}
              </button>
              {auditResults.length > 0 && (
                <button
                  onClick={exportReport}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Exportar Reporte
                </button>
              )}
            </div>
          </div>

          {isRunning && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Auditando: {currentSection}</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Resumen de Resultados */}
        {auditResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Resumen de Auditoría</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {auditResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600">Secciones OK</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {auditResults.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-600">Con Advertencias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {auditResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Con Errores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {auditResults.reduce((sum, r) => sum + r.issues.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Problemas</div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados Detallados */}
        {auditResults.length > 0 && (
          <div className="space-y-6">
            {auditResults.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{result.section}</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                      {result.status === 'success' ? '✅ OK' : result.status === 'warning' ? '⚠️ Advertencias' : '❌ Errores'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {result.loadTime.toFixed(0)}ms
                    </span>
                  </div>
                </div>

                {result.issues.length > 0 && (
                  <div className="space-y-3">
                    {result.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                                {issue.severity.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">{issue.type}</span>
                            </div>
                            <p className="text-sm text-gray-800 mb-1">{issue.description}</p>
                            <p className="text-xs text-gray-600">💡 {issue.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {result.consoleErrors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Errores de Consola:</h4>
                    <div className="space-y-1">
                      {result.consoleErrors.map((error, errorIndex) => (
                        <p key={errorIndex} className="text-xs text-red-700 font-mono">{error}</p>
                      ))}
                    </div>
                  </div>
                )}

                {result.issues.length === 0 && result.consoleErrors.length === 0 && (
                  <p className="text-green-600 text-sm">✅ No se encontraron problemas en esta sección</p>
                )}
              </div>
            ))}
          </div>
        )}

        {auditResults.length === 0 && !isRunning && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Listo para Auditar</h3>
            <p className="text-gray-600 mb-6">
              Haz clic en "Iniciar Auditoría" para comenzar la verificación automática de todas las secciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationAudit;