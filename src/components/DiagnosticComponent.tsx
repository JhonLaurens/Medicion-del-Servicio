import React, { useState, useEffect } from 'react';
import { satisfactionDataService } from '../services/dataService';
import { useSegmentAnalysis } from '../hooks/useSegmentAnalysis';
import { KPIData, SatisfactionRecord } from '../types';

interface DiagnosticInfo {
  dataServiceStatus: {
    isLoaded: boolean;
    dataCount: number;
    error: string | null;
  };
  csvAccessStatus: {
    canAccess: boolean;
    responseStatus: number | null;
    contentType: string | null;
    error: string | null;
  };
  segmentAnalysisStatus: {
    isLoading: boolean;
    hasValidData: boolean;
    kpiDataCount: number;
    overallStatsValid: boolean;
    error: string | null;
  };
  componentHealth: {
    [key: string]: {
      status: 'healthy' | 'warning' | 'error';
      message: string;
      details?: any;
    };
  };
}

const DiagnosticComponent: React.FC = () => {
  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Hook para análisis de segmentos
  const {
    kpiData,
    isLoading: segmentLoading,
    hasValidData: segmentHasValidData,
    overallStats
  } = useSegmentAnalysis();

  const runDiagnostic = async () => {
    setIsRunning(true);
    
    try {
      const diagnostic: DiagnosticInfo = {
        dataServiceStatus: {
          isLoaded: false,
          dataCount: 0,
          error: null
        },
        csvAccessStatus: {
          canAccess: false,
          responseStatus: null,
          contentType: null,
          error: null
        },
        segmentAnalysisStatus: {
          isLoading: segmentLoading,
          hasValidData: segmentHasValidData,
          kpiDataCount: kpiData.length,
          overallStatsValid: false,
          error: null
        },
        componentHealth: {}
      };

      // 1. Verificar acceso al CSV
      try {
        const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
        const isDevelopment = import.meta.env.DEV;
        const csvPath = isVercel || isDevelopment ? '/datos.csv' : '/Medicion-del-Servicio/datos.csv';
        
        const response = await fetch(csvPath, { method: 'HEAD' });
        diagnostic.csvAccessStatus = {
          canAccess: response.ok,
          responseStatus: response.status,
          contentType: response.headers.get('content-type'),
          error: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`
        };
      } catch (error: any) {
        diagnostic.csvAccessStatus = {
          canAccess: false,
          responseStatus: null,
          contentType: null,
          error: error.message
        };
      }

      // 2. Verificar DataService
      try {
        await satisfactionDataService.loadData();
        const kpiData = satisfactionDataService.getKPIData();
        const techInfo = satisfactionDataService.getTechnicalInfo();
        
        diagnostic.dataServiceStatus = {
          isLoaded: true,
          dataCount: kpiData.length > 0 ? techInfo.totalEncuestados : 0,
          error: null
        };
      } catch (error: any) {
        diagnostic.dataServiceStatus = {
          isLoaded: false,
          dataCount: 0,
          error: error.message
        };
      }

      // 3. Verificar análisis de segmentos
      try {
        diagnostic.segmentAnalysisStatus = {
          isLoading: segmentLoading,
          hasValidData: segmentHasValidData,
          kpiDataCount: kpiData.length,
          overallStatsValid: overallStats && 
                           typeof overallStats.personasStats === 'object' &&
                           typeof overallStats.empresasStats === 'object' &&
                           'satisfaction' in overallStats.personasStats &&
                           'satisfaction' in overallStats.empresasStats,
          error: null
        };
      } catch (error: any) {
        diagnostic.segmentAnalysisStatus = {
          isLoading: false,
          hasValidData: false,
          kpiDataCount: 0,
          overallStatsValid: false,
          error: error.message
        };
      }

      // 4. Evaluar salud de componentes
      diagnostic.componentHealth = {
        'CSV Access': {
          status: diagnostic.csvAccessStatus.canAccess ? 'healthy' : 'error',
          message: diagnostic.csvAccessStatus.canAccess 
            ? 'CSV accesible correctamente'
            : `Error accediendo CSV: ${diagnostic.csvAccessStatus.error}`,
          details: diagnostic.csvAccessStatus
        },
        'Data Service': {
          status: diagnostic.dataServiceStatus.isLoaded ? 'healthy' : 'error',
          message: diagnostic.dataServiceStatus.isLoaded 
            ? `Datos cargados: ${diagnostic.dataServiceStatus.dataCount} registros`
            : `Error cargando datos: ${diagnostic.dataServiceStatus.error}`,
          details: diagnostic.dataServiceStatus
        },
        'Segment Analysis': {
          status: diagnostic.segmentAnalysisStatus.hasValidData && diagnostic.segmentAnalysisStatus.overallStatsValid ? 'healthy' : 'warning',
          message: diagnostic.segmentAnalysisStatus.hasValidData 
            ? `Análisis válido con ${diagnostic.segmentAnalysisStatus.kpiDataCount} métricas`
            : 'Análisis de segmentos sin datos válidos',
          details: diagnostic.segmentAnalysisStatus
        },
        'Executive Summary Props': {
          status: diagnostic.segmentAnalysisStatus.overallStatsValid ? 'healthy' : 'error',
          message: diagnostic.segmentAnalysisStatus.overallStatsValid 
            ? 'Props de ExecutiveSummary correctas'
            : 'Props de ExecutiveSummary inválidas - falta estructura satisfaction',
          details: overallStats
        }
      };

      setDiagnosticInfo(diagnostic);
      setLastUpdate(new Date());
      
    } catch (error: any) {
      console.error('Error en diagnóstico:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Ejecutar diagnóstico automáticamente al cargar
    runDiagnostic();
  }, []);

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔍 Diagnóstico del Sistema
          </h1>
          <p className="text-gray-600 mb-4">
            Herramienta de debugging para verificar el estado de todos los componentes y servicios.
          </p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={runDiagnostic}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isRunning
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? '🔄 Ejecutando...' : '🔍 Ejecutar Diagnóstico'}
            </button>
            
            {lastUpdate && (
              <div className="text-sm text-gray-500">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Resumen de Estado */}
        {diagnosticInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Resumen de Estado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-800">CSV Access</div>
                <div className={`text-2xl ${diagnosticInfo.csvAccessStatus.canAccess ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnosticInfo.csvAccessStatus.canAccess ? '✅' : '❌'}
                </div>
                <div className="text-sm text-blue-600">
                  Status: {diagnosticInfo.csvAccessStatus.responseStatus || 'N/A'}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-green-800">Data Service</div>
                <div className={`text-2xl ${diagnosticInfo.dataServiceStatus.isLoaded ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnosticInfo.dataServiceStatus.isLoaded ? '✅' : '❌'}
                </div>
                <div className="text-sm text-green-600">
                  Registros: {diagnosticInfo.dataServiceStatus.dataCount}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-purple-800">Segment Analysis</div>
                <div className={`text-2xl ${diagnosticInfo.segmentAnalysisStatus.hasValidData ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnosticInfo.segmentAnalysisStatus.hasValidData ? '✅' : '❌'}
                </div>
                <div className="text-sm text-purple-600">
                  KPIs: {diagnosticInfo.segmentAnalysisStatus.kpiDataCount}
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-orange-800">Executive Summary</div>
                <div className={`text-2xl ${diagnosticInfo.segmentAnalysisStatus.overallStatsValid ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnosticInfo.segmentAnalysisStatus.overallStatsValid ? '✅' : '❌'}
                </div>
                <div className="text-sm text-orange-600">
                  Props válidas
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detalles de Componentes */}
        {diagnosticInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Estado de Componentes</h2>
            <div className="space-y-4">
              {Object.entries(diagnosticInfo.componentHealth).map(([component, health]) => (
                <div
                  key={component}
                  className={`p-4 rounded-lg border-l-4 ${getStatusColor(health.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(health.status)}</span>
                      <div>
                        <div className="font-semibold text-lg">{component}</div>
                        <div className="text-sm">{health.message}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      health.status === 'healthy' ? 'bg-green-100 text-green-800' :
                      health.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {health.status.toUpperCase()}
                    </div>
                  </div>
                  
                  {health.details && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        Ver detalles técnicos
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                        {JSON.stringify(health.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información del Entorno */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🌐 Información del Entorno</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Configuración</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Modo:</strong> {import.meta.env.MODE}</div>
                <div><strong>Desarrollo:</strong> {import.meta.env.DEV ? 'Sí' : 'No'}</div>
                <div><strong>Producción:</strong> {import.meta.env.PROD ? 'Sí' : 'No'}</div>
                <div><strong>Base URL:</strong> {import.meta.env.BASE_URL}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Navegador</h3>
              <div className="space-y-2 text-sm">
                <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</div>
                <div><strong>Hostname:</strong> {window.location.hostname}</div>
                <div><strong>Protocol:</strong> {window.location.protocol}</div>
                <div><strong>Port:</strong> {window.location.port || 'default'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticComponent;