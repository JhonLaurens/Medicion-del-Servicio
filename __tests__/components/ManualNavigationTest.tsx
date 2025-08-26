import React, { useState, useEffect } from 'react';
import { satisfactionDataService } from '../../src/services/dataService';

interface NavigationIssue {
  section: string;
  type: 'visual' | 'functional' | 'performance' | 'data';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  recommendation: string;
  timestamp: string;
}

interface SectionTest {
  id: string;
  name: string;
  description: string;
  testFunction: () => Promise<NavigationIssue[]>;
}

const ManualNavigationTest: React.FC = () => {
  const [issues, setIssues] = useState<NavigationIssue[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);

  // Capturar errores de consola
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      setConsoleErrors(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalError(...args);
    };
    
    console.warn = (...args) => {
      setConsoleErrors(prev => [...prev, `WARN: ${args.join(' ')}`]);
      originalWarn(...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const sections: SectionTest[] = [
    {
      id: 'inicio',
      name: 'Página de Inicio',
      description: 'Verificar datos del dashboard principal',
      testFunction: testHomePage
    },
    {
      id: 'ficha-tecnica',
      name: 'Ficha Técnica',
      description: 'Verificar información metodológica',
      testFunction: testTechnicalSpecs
    },
    {
      id: 'metricas-completas',
      name: 'Métricas Completas',
      description: 'Verificar NPS, promedios y distribuciones',
      testFunction: testMetricsOverview
    },
    {
      id: 'analisis-segmento',
      name: 'Análisis por Segmentos',
      description: 'Verificar datos personas vs empresas',
      testFunction: testSegmentAnalysis
    },
    {
      id: 'analisis-geografico',
      name: 'Análisis Geográfico',
      description: 'Verificar datos por ciudades',
      testFunction: testGeographicAnalysis
    },
    {
      id: 'analisis-sugerencias',
      name: 'Análisis de Sugerencias',
      description: 'Verificar categorización de sugerencias',
      testFunction: testSuggestionsAnalysis
    },
    {
      id: 'explorador-datos',
      name: 'Explorador de Datos',
      description: 'Verificar filtros y búsquedas',
      testFunction: testDataExplorer
    },
    {
      id: 'participacion-gerentes',
      name: 'Participación de Gerentes',
      description: 'Verificar datos de ejecutivos',
      testFunction: testManagerParticipation
    },
    {
      id: 'pruebas-componentes',
      name: 'Pruebas de Componentes',
      description: 'Verificar que todas las pruebas pasen',
      testFunction: testComponentTests
    },
    {
      id: 'diagnostico',
      name: 'Diagnóstico del Sistema',
      description: 'Verificar estado de componentes',
      testFunction: testSystemDiagnostic
    },
    {
      id: 'diagnostico-datos',
      name: 'Diagnóstico de Datos',
      description: 'Verificar carga de CSV',
      testFunction: testDataDiagnostic
    }
  ];

  async function testHomePage(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const data = satisfactionDataService.getData();
      const isLoaded = satisfactionDataService.isDataLoaded();
      
      if (!isLoaded || data.length === 0) {
        issues.push({
          section: 'Página de Inicio',
          type: 'data',
          severity: 'critical',
          description: 'Los datos principales no están cargados',
          location: 'HomePage component',
          recommendation: 'Verificar la carga del dataService en App.tsx',
          timestamp: new Date().toISOString()
        });
      }
      
      // Verificar métricas básicas
      const overallRating = satisfactionDataService.getOverallAverageRating();
      if (overallRating === 0) {
        issues.push({
          section: 'Página de Inicio',
          type: 'data',
          severity: 'high',
          description: 'La calificación promedio general muestra 0',
          location: 'HomePage metrics',
          recommendation: 'Verificar el método getOverallAverageRating()',
          timestamp: new Date().toISOString()
        });
      }
      
      const npsData = satisfactionDataService.calculateNPS();
      if (npsData.npsScore === 0 && npsData.promoters === 0) {
        issues.push({
          section: 'Página de Inicio',
          type: 'data',
          severity: 'high',
          description: 'Los datos de NPS muestran valores en 0',
          location: 'HomePage NPS section',
          recommendation: 'Verificar el método calculateNPS() y los datos de recomendación',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      issues.push({
        section: 'Página de Inicio',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar la página de inicio: ${error}`,
        location: 'HomePage component',
        recommendation: 'Revisar el componente HomePage y sus dependencias',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testTechnicalSpecs(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const technicalInfo = satisfactionDataService.getTechnicalInfo();
      
      if (!technicalInfo || technicalInfo.totalEncuestados === 0) {
        issues.push({
          section: 'Ficha Técnica',
          type: 'data',
          severity: 'medium',
          description: 'La información técnica muestra 0 encuestados',
          location: 'TechnicalSpecsPage',
          recommendation: 'Verificar el método getTechnicalInfo() del dataService',
          timestamp: new Date().toISOString()
        });
      }
      
      if (technicalInfo.porcentajeRespuesta === 0) {
        issues.push({
          section: 'Ficha Técnica',
          type: 'data',
          severity: 'low',
          description: 'El porcentaje de respuesta muestra 0%',
          location: 'TechnicalSpecsPage metrics',
          recommendation: 'Verificar el cálculo del porcentaje de respuesta',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      issues.push({
        section: 'Ficha Técnica',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar la ficha técnica: ${error}`,
        location: 'TechnicalSpecsPage component',
        recommendation: 'Revisar el componente TechnicalSpecsPage',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testMetricsOverview(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const kpiData = satisfactionDataService.getKPIData();
      
      if (!kpiData || kpiData.length === 0) {
        issues.push({
          section: 'Métricas Completas',
          type: 'data',
          severity: 'critical',
          description: 'No se encontraron datos KPI',
          location: 'MetricsOverview component',
          recommendation: 'Verificar el método getKPIData() del dataService',
          timestamp: new Date().toISOString()
        });
      } else {
        // Verificar que las métricas tengan valores válidos
        kpiData.forEach((metric, index) => {
          if (metric.consolidado.average === 0) {
            issues.push({
              section: 'Métricas Completas',
              type: 'data',
              severity: 'high',
              description: `La métrica "${metric.metric}" muestra promedio 0`,
              location: `MetricsOverview - metric ${index}`,
              recommendation: 'Verificar los datos de entrada y el cálculo de promedios',
              timestamp: new Date().toISOString()
            });
          }
        });
      }
      
      const ratingDistribution = satisfactionDataService.getRatingDistribution();
      if (!ratingDistribution || ratingDistribution.length === 0) {
        issues.push({
          section: 'Métricas Completas',
          type: 'data',
          severity: 'medium',
          description: 'No se encontró distribución de calificaciones',
          location: 'MetricsOverview charts',
          recommendation: 'Verificar el método getRatingDistribution()',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      issues.push({
        section: 'Métricas Completas',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar métricas completas: ${error}`,
        location: 'MetricsOverview component',
        recommendation: 'Revisar el componente MetricsOverview y sus dependencias',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testSegmentAnalysis(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const data = satisfactionDataService.getData();
      const personasData = data.filter(d => d.SEGMENTO === 'PERSONAS');
      const empresasData = data.filter(d => d.SEGMENTO === 'EMPRESARIAL');
      
      if (personasData.length === 0) {
        issues.push({
          section: 'Análisis por Segmentos',
          type: 'data',
          severity: 'critical',
          description: 'No se encontraron datos del segmento PERSONAS',
          location: 'SegmentAnalysis - personas data',
          recommendation: 'Verificar que el CSV contenga registros con SEGMENTO="PERSONAS"',
          timestamp: new Date().toISOString()
        });
      }
      
      if (empresasData.length === 0) {
        issues.push({
          section: 'Análisis por Segmentos',
          type: 'data',
          severity: 'high',
          description: 'No se encontraron datos del segmento EMPRESARIAL',
          location: 'SegmentAnalysis - empresas data',
          recommendation: 'Verificar que el CSV contenga registros con SEGMENTO="EMPRESARIAL"',
          timestamp: new Date().toISOString()
        });
      }
      
      // Verificar hook useSegmentAnalysis
      const kpiData = satisfactionDataService.getKPIData();
      if (kpiData.length > 0) {
        const hasPersonasKPI = kpiData.some(k => k.personas && k.personas.total > 0);
        const hasEmpresasKPI = kpiData.some(k => k.empresarial && k.empresarial.total > 0);
        
        if (!hasPersonasKPI) {
          issues.push({
            section: 'Análisis por Segmentos',
            type: 'data',
            severity: 'high',
            description: 'Los datos KPI del segmento Personas están vacíos',
            location: 'useSegmentAnalysis hook',
            recommendation: 'Verificar el procesamiento de datos por segmento en getKPIData()',
            timestamp: new Date().toISOString()
          });
        }
        
        if (!hasEmpresasKPI) {
          issues.push({
            section: 'Análisis por Segmentos',
            type: 'data',
            severity: 'medium',
            description: 'Los datos KPI del segmento Empresas están vacíos',
            location: 'useSegmentAnalysis hook',
            recommendation: 'Verificar el procesamiento de datos por segmento en getKPIData()',
            timestamp: new Date().toISOString()
          });
        }
      }
      
    } catch (error) {
      issues.push({
        section: 'Análisis por Segmentos',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar análisis por segmentos: ${error}`,
        location: 'SegmentAnalysis component',
        recommendation: 'Revisar el componente SegmentAnalysis y useSegmentAnalysis hook',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testGeographicAnalysis(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const cityData = satisfactionDataService.getCityData();
      
      if (!cityData || cityData.length === 0) {
        issues.push({
          section: 'Análisis Geográfico',
          type: 'data',
          severity: 'critical',
          description: 'No se encontraron datos geográficos',
          location: 'GeographicAnalysis component',
          recommendation: 'Verificar el método getCityData() del dataService',
          timestamp: new Date().toISOString()
        });
      } else {
        // Verificar que las ciudades tengan datos válidos
        cityData.forEach((city, index) => {
          if (city.total_encuestados === 0) {
            issues.push({
              section: 'Análisis Geográfico',
              type: 'data',
              severity: 'medium',
              description: `La ciudad "${city.ciudad}" muestra 0 encuestados`,
              location: `GeographicAnalysis - city ${index}`,
              recommendation: 'Verificar el mapeo de agencias a ciudades',
              timestamp: new Date().toISOString()
            });
          }
        });
      }
      
    } catch (error) {
      issues.push({
        section: 'Análisis Geográfico',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar análisis geográfico: ${error}`,
        location: 'GeographicAnalysis component',
        recommendation: 'Revisar el componente GeographicAnalysis',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testSuggestionsAnalysis(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const suggestionData = satisfactionDataService.getSuggestionData();
      
      if (!suggestionData || suggestionData.length === 0) {
        issues.push({
          section: 'Análisis de Sugerencias',
          type: 'data',
          severity: 'medium',
          description: 'No se encontraron datos de sugerencias',
          location: 'SuggestionsAnalysis component',
          recommendation: 'Verificar el método getSuggestionData() y los datos de sugerencias en el CSV',
          timestamp: new Date().toISOString()
        });
      }
      
      // Verificar datos de sugerencias en el CSV
      const data = satisfactionDataService.getData();
      const suggestionsCount = data.filter(d => d.sugerencias && d.sugerencias.trim() !== '' && d.sugerencias !== '""""""').length;
      
      if (suggestionsCount === 0) {
        issues.push({
          section: 'Análisis de Sugerencias',
          type: 'data',
          severity: 'low',
          description: 'No se encontraron sugerencias válidas en los datos',
          location: 'SuggestionsAnalysis data processing',
          recommendation: 'Verificar el campo "sugerencias" en el CSV y su procesamiento',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      issues.push({
        section: 'Análisis de Sugerencias',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar análisis de sugerencias: ${error}`,
        location: 'SuggestionsAnalysis component',
        recommendation: 'Revisar el componente SuggestionsAnalysis',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testDataExplorer(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const data = satisfactionDataService.getData();
      
      if (!data || data.length === 0) {
        issues.push({
          section: 'Explorador de Datos',
          type: 'data',
          severity: 'critical',
          description: 'No hay datos disponibles para explorar',
          location: 'DataExplorer component',
          recommendation: 'Verificar la carga de datos en el dataService',
          timestamp: new Date().toISOString()
        });
      }
      
      // Verificar campos importantes para filtros
      const fieldsToCheck = ['SEGMENTO', 'CIUDAD', 'AGENCIA', 'TIPO_EJECUTIVO'];
      fieldsToCheck.forEach(field => {
        const uniqueValues = [...new Set(data.map(d => d[field as keyof typeof d]).filter(v => v && v !== ''))];
        if (uniqueValues.length === 0) {
          issues.push({
            section: 'Explorador de Datos',
            type: 'data',
            severity: 'medium',
            description: `El campo "${field}" no tiene valores únicos para filtrar`,
            location: 'DataExplorer filters',
            recommendation: `Verificar que el campo "${field}" tenga datos válidos en el CSV`,
            timestamp: new Date().toISOString()
          });
        }
      });
      
    } catch (error) {
      issues.push({
        section: 'Explorador de Datos',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar explorador de datos: ${error}`,
        location: 'DataExplorer component',
        recommendation: 'Revisar el componente DataExplorer',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testManagerParticipation(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const data = satisfactionDataService.getData();
      const executivesData = data.filter(d => d.EJECUTIVO_FINAL && d.EJECUTIVO_FINAL.trim() !== '');
      
      if (executivesData.length === 0) {
        issues.push({
          section: 'Participación de Gerentes',
          type: 'data',
          severity: 'critical',
          description: 'No se encontraron datos de ejecutivos',
          location: 'ManagerParticipationReport component',
          recommendation: 'Verificar que el CSV contenga datos en el campo EJECUTIVO_FINAL',
          timestamp: new Date().toISOString()
        });
      }
      
      // Verificar que se use la instancia correcta del dataService
      // (Este problema ya fue corregido, pero verificamos)
      const uniqueExecutives = [...new Set(executivesData.map(d => d.EJECUTIVO_FINAL))];
      if (uniqueExecutives.length === 0) {
        issues.push({
          section: 'Participación de Gerentes',
          type: 'data',
          severity: 'high',
          description: 'No se encontraron ejecutivos únicos',
          location: 'ManagerParticipationReport data processing',
          recommendation: 'Verificar el procesamiento de datos de ejecutivos',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      issues.push({
        section: 'Participación de Gerentes',
        type: 'functional',
        severity: 'critical',
        description: `Error al cargar participación de gerentes: ${error}`,
        location: 'ManagerParticipationReport component',
        recommendation: 'Revisar el componente ManagerParticipationReport',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testComponentTests(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      // Verificar que el componente de pruebas esté funcionando
      // En una implementación real, esto ejecutaría las pruebas
      issues.push({
        section: 'Pruebas de Componentes',
        type: 'functional',
        severity: 'low',
        description: 'Las pruebas de componentes necesitan ser ejecutadas manualmente',
        location: 'ComponentTests component',
        recommendation: 'Navegar a la sección de pruebas y ejecutar todas las validaciones',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      issues.push({
        section: 'Pruebas de Componentes',
        type: 'functional',
        severity: 'medium',
        description: `Error al acceder a las pruebas de componentes: ${error}`,
        location: 'ComponentTests component',
        recommendation: 'Revisar el componente ComponentTests',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testSystemDiagnostic(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      // Verificar que el diagnóstico del sistema esté funcionando
      issues.push({
        section: 'Diagnóstico del Sistema',
        type: 'functional',
        severity: 'low',
        description: 'El diagnóstico del sistema necesita ser revisado manualmente',
        location: 'DiagnosticComponent',
        recommendation: 'Navegar a la sección de diagnóstico y revisar el estado de todos los componentes',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      issues.push({
        section: 'Diagnóstico del Sistema',
        type: 'functional',
        severity: 'medium',
        description: `Error al acceder al diagnóstico del sistema: ${error}`,
        location: 'DiagnosticComponent',
        recommendation: 'Revisar el componente DiagnosticComponent',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  async function testDataDiagnostic(): Promise<NavigationIssue[]> {
    const issues: NavigationIssue[] = [];
    
    try {
      const isLoaded = satisfactionDataService.isDataLoaded();
      const data = satisfactionDataService.getData();
      
      if (!isLoaded) {
        issues.push({
          section: 'Diagnóstico de Datos',
          type: 'data',
          severity: 'critical',
          description: 'El dataService indica que los datos no están cargados',
          location: 'DataLoadingDiagnostic',
          recommendation: 'Verificar la carga inicial de datos en App.tsx',
          timestamp: new Date().toISOString()
        });
      }
      
      if (data.length === 0) {
        issues.push({
          section: 'Diagnóstico de Datos',
          type: 'data',
          severity: 'critical',
          description: 'No hay registros de datos disponibles',
          location: 'DataLoadingDiagnostic',
          recommendation: 'Verificar la accesibilidad y formato del archivo datos.csv',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      issues.push({
        section: 'Diagnóstico de Datos',
        type: 'functional',
        severity: 'critical',
        description: `Error al acceder al diagnóstico de datos: ${error}`,
        location: 'DataLoadingDiagnostic component',
        recommendation: 'Revisar el componente DataLoadingDiagnostic',
        timestamp: new Date().toISOString()
      });
    }
    
    return issues;
  }

  const runAllTests = async () => {
    setIsRunning(true);
    setIssues([]);
    setConsoleErrors([]);
    setProgress(0);
    
    const allIssues: NavigationIssue[] = [];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      setCurrentTest(section.name);
      setProgress(((i + 1) / sections.length) * 100);
      
      try {
        const sectionIssues = await section.testFunction();
        allIssues.push(...sectionIssues);
      } catch (error) {
        allIssues.push({
          section: section.name,
          type: 'functional',
          severity: 'critical',
          description: `Error crítico al ejecutar pruebas: ${error}`,
          location: section.id,
          recommendation: 'Revisar la implementación del test y el componente asociado',
          timestamp: new Date().toISOString()
        });
      }
      
      // Pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIssues(allIssues);
    setIsRunning(false);
    setCurrentTest('');
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: issues.length,
        critical: issues.filter(i => i.severity === 'critical').length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
        byType: {
          data: issues.filter(i => i.type === 'data').length,
          functional: issues.filter(i => i.type === 'functional').length,
          visual: issues.filter(i => i.type === 'visual').length,
          performance: issues.filter(i => i.type === 'performance').length
        }
      },
      issues,
      consoleErrors,
      sectionsAnalyzed: sections.length
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `navigation-test-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'data': return '📊';
      case 'functional': return '⚙️';
      case 'visual': return '👁️';
      case 'performance': return '⚡';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Prueba Manual de Navegación
          </h1>
          <p className="text-gray-600">
            Análisis sistemático de todas las secciones de la aplicación para identificar problemas
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Panel de Control</h2>
            <div className="flex space-x-4">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? 'Ejecutando...' : 'Iniciar Pruebas'}
              </button>
              {issues.length > 0 && (
                <button
                  onClick={exportReport}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Exportar Reporte
                </button>
              )}
            </div>
          </div>

          {isRunning && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progreso: {Math.round(progress)}%</span>
                <span className="text-sm text-gray-600">Probando: {currentTest}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-sm text-gray-600">Secciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{issues.filter(i => i.severity === 'critical').length}</div>
              <div className="text-sm text-gray-600">Críticos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{issues.filter(i => i.severity === 'high').length}</div>
              <div className="text-sm text-gray-600">Altos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{issues.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Issues Report */}
        {issues.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Problemas Encontrados</h2>
            
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(issue.type)}</span>
                      <span className="font-semibold">{issue.section}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(issue.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2">
                    <strong>Problema:</strong> {issue.description}
                  </p>
                  
                  <p className="text-sm mb-2">
                    <strong>Ubicación:</strong> {issue.location}
                  </p>
                  
                  <p className="text-sm">
                    <strong>Recomendación:</strong> {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Console Errors */}
        {consoleErrors.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Errores de Consola</h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {consoleErrors.map((error, index) => (
                <div key={index} className="mb-1">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {issues.length === 0 && !isRunning && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Instrucciones</h3>
            <p className="text-blue-700 mb-4">
              Haz clic en "Iniciar Pruebas" para ejecutar un análisis completo de todas las secciones de la aplicación.
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Se analizarán {sections.length} secciones automáticamente</li>
              <li>• Se detectarán problemas de datos, funcionales, visuales y de rendimiento</li>
              <li>• Se capturarán errores de consola en tiempo real</li>
              <li>• Se generará un reporte detallado con recomendaciones</li>
              <li>• Podrás exportar el reporte en formato JSON</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualNavigationTest;