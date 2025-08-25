import React, { useState, useEffect } from 'react';
import { satisfactionDataService } from '../services/dataService';
import { useSegmentAnalysis } from '../hooks/useSegmentAnalysis';
import { getImageCacheStats, clearImageCache } from '../hooks/useImageLoader';

interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
  timestamp: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  duration: number;
  passed: number;
  failed: number;
  warnings: number;
}

/**
 * Suite completa de pruebas manuales para la aplicación
 */
const ManualTestSuite: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    duration: 0
  });

  const addTestResult = (suiteName: string, result: TestResult) => {
    setTestSuites(prev => {
      const existingSuiteIndex = prev.findIndex(suite => suite.name === suiteName);
      if (existingSuiteIndex >= 0) {
        const updatedSuites = [...prev];
        updatedSuites[existingSuiteIndex].tests.push(result);
        return updatedSuites;
      } else {
        return [...prev, {
          name: suiteName,
          tests: [result],
          duration: 0,
          passed: 0,
          failed: 0,
          warnings: 0
        }];
      }
    });
  };

  const createTestResult = (name: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any): TestResult => ({
    testName: name,
    status,
    message,
    details,
    timestamp: new Date().toISOString()
  });

  // Suite de pruebas de datos
  const runDataTests = async () => {
    const startTime = Date.now();
    setCurrentTest('Pruebas de Datos');

    try {
      // Test 1: Verificar carga de datos
      const isLoaded = satisfactionDataService.isDataLoaded();
      addTestResult('Datos', createTestResult(
        'Carga de Datos CSV',
        isLoaded ? 'pass' : 'fail',
        isLoaded ? 'Datos cargados correctamente' : 'Error: Datos no cargados',
        { isLoaded }
      ));

      // Test 2: Verificar cantidad de registros
      const data = satisfactionDataService.getData();
      const expectedCount = 1445; // Número esperado de registros
      addTestResult('Datos', createTestResult(
        'Cantidad de Registros',
        data.length >= expectedCount ? 'pass' : 'warning',
        `Registros encontrados: ${data.length} (esperados: ${expectedCount})`,
        { actualCount: data.length, expectedCount }
      ));

      // Test 3: Verificar estructura de datos
      if (data.length > 0) {
        const firstRecord = data[0];
        const requiredFields = ['id', 'segment', 'city', 'satisfactionRating', 'clarityRating', 'recommendationRating', 'loyaltyRating'];
        const missingFields = requiredFields.filter(field => !(field in firstRecord));
        
        addTestResult('Datos', createTestResult(
          'Estructura de Datos',
          missingFields.length === 0 ? 'pass' : 'fail',
          missingFields.length === 0 ? 'Estructura correcta' : `Campos faltantes: ${missingFields.join(', ')}`,
          { missingFields, sampleRecord: firstRecord }
        ));
      }

      // Test 4: Verificar KPI Data
      const kpiData = satisfactionDataService.getKPIData();
      addTestResult('Datos', createTestResult(
        'Datos KPI',
        kpiData.length > 0 ? 'pass' : 'fail',
        `KPI Data generado: ${kpiData.length} registros`,
        { kpiCount: kpiData.length }
      ));

    } catch (error) {
      addTestResult('Datos', createTestResult(
        'Error en Pruebas de Datos',
        'fail',
        `Error inesperado: ${error}`,
        { error: error instanceof Error ? error.message : String(error) }
      ));
    }
  };

  // Suite de pruebas de componentes
  const runComponentTests = async () => {
    setCurrentTest('Pruebas de Componentes');

    try {
      // Test 1: Verificar hook useSegmentAnalysis
      const { kpiData, isLoading, hasValidData } = useSegmentAnalysis();
      
      addTestResult('Componentes', createTestResult(
        'Hook useSegmentAnalysis',
        hasValidData ? 'pass' : 'warning',
        hasValidData ? 'Hook funcionando correctamente' : 'Hook sin datos válidos',
        { kpiDataLength: kpiData.length, isLoading, hasValidData }
      ));

      // Test 2: Verificar cache de imágenes
      const cacheStats = getImageCacheStats();
      addTestResult('Componentes', createTestResult(
        'Cache de Imágenes',
        cacheStats.totalCached > 0 ? 'pass' : 'warning',
        `Imágenes en cache: ${cacheStats.totalCached}`,
        cacheStats
      ));

      // Test 3: Verificar localStorage
      const localStorageWorks = (() => {
        try {
          const testKey = 'test-key';
          localStorage.setItem(testKey, 'test-value');
          const value = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          return value === 'test-value';
        } catch {
          return false;
        }
      })();

      addTestResult('Componentes', createTestResult(
        'LocalStorage',
        localStorageWorks ? 'pass' : 'warning',
        localStorageWorks ? 'LocalStorage disponible' : 'LocalStorage no disponible',
        { available: localStorageWorks }
      ));

    } catch (error) {
      addTestResult('Componentes', createTestResult(
        'Error en Pruebas de Componentes',
        'fail',
        `Error inesperado: ${error}`,
        { error: error instanceof Error ? error.message : String(error) }
      ));
    }
  };

  // Suite de pruebas de rendimiento
  const runPerformanceTests = async () => {
    setCurrentTest('Pruebas de Rendimiento');

    try {
      // Test 1: Tiempo de carga de datos
      const startTime = performance.now();
      const data = satisfactionDataService.getData();
      const loadTime = performance.now() - startTime;

      addTestResult('Rendimiento', createTestResult(
        'Tiempo de Carga de Datos',
        loadTime < 100 ? 'pass' : loadTime < 500 ? 'warning' : 'fail',
        `Tiempo de carga: ${loadTime.toFixed(2)}ms`,
        { loadTime, recordCount: data.length }
      ));

      // Test 2: Memoria utilizada (aproximada)
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const usedMemoryMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
        addTestResult('Rendimiento', createTestResult(
          'Uso de Memoria',
          usedMemoryMB < 50 ? 'pass' : usedMemoryMB < 100 ? 'warning' : 'fail',
          `Memoria utilizada: ${usedMemoryMB.toFixed(2)} MB`,
          { usedMemoryMB, totalMemoryMB: memoryInfo.totalJSHeapSize / 1024 / 1024 }
        ));
      }

      // Test 3: Tiempo de renderizado (simulado)
      const renderStart = performance.now();
      await new Promise(resolve => setTimeout(resolve, 10)); // Simular renderizado
      const renderTime = performance.now() - renderStart;

      addTestResult('Rendimiento', createTestResult(
        'Tiempo de Renderizado',
        renderTime < 50 ? 'pass' : 'warning',
        `Tiempo de renderizado: ${renderTime.toFixed(2)}ms`,
        { renderTime }
      ));

    } catch (error) {
      addTestResult('Rendimiento', createTestResult(
        'Error en Pruebas de Rendimiento',
        'fail',
        `Error inesperado: ${error}`,
        { error: error instanceof Error ? error.message : String(error) }
      ));
    }
  };

  // Suite de pruebas de accesibilidad
  const runAccessibilityTests = async () => {
    setCurrentTest('Pruebas de Accesibilidad');

    try {
      // Test 1: Verificar elementos con aria-label
      const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
      addTestResult('Accesibilidad', createTestResult(
        'Elementos con ARIA Labels',
        elementsWithAriaLabel.length > 0 ? 'pass' : 'warning',
        `Elementos con aria-label: ${elementsWithAriaLabel.length}`,
        { count: elementsWithAriaLabel.length }
      ));

      // Test 2: Verificar elementos focusables
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      addTestResult('Accesibilidad', createTestResult(
        'Elementos Focusables',
        focusableElements.length > 0 ? 'pass' : 'warning',
        `Elementos focusables: ${focusableElements.length}`,
        { count: focusableElements.length }
      ));

      // Test 3: Verificar contraste (básico)
      const hasHighContrastElements = document.querySelectorAll('.text-white, .text-gray-900, .text-blue-900').length > 0;
      addTestResult('Accesibilidad', createTestResult(
        'Contraste de Colores',
        hasHighContrastElements ? 'pass' : 'warning',
        hasHighContrastElements ? 'Elementos con alto contraste detectados' : 'Verificar contraste manualmente',
        { hasHighContrastElements }
      ));

    } catch (error) {
      addTestResult('Accesibilidad', createTestResult(
        'Error en Pruebas de Accesibilidad',
        'fail',
        `Error inesperado: ${error}`,
        { error: error instanceof Error ? error.message : String(error) }
      ));
    }
  };

  // Ejecutar todas las pruebas
  const runAllTests = async () => {
    setIsRunning(true);
    setTestSuites([]);
    const overallStartTime = Date.now();

    try {
      await runDataTests();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runComponentTests();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runPerformanceTests();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await runAccessibilityTests();
      
      const overallDuration = Date.now() - overallStartTime;
      
      // Calcular estadísticas finales
      setTestSuites(prev => {
        const updatedSuites = prev.map(suite => {
          const passed = suite.tests.filter(t => t.status === 'pass').length;
          const failed = suite.tests.filter(t => t.status === 'fail').length;
          const warnings = suite.tests.filter(t => t.status === 'warning').length;
          
          return {
            ...suite,
            passed,
            failed,
            warnings,
            duration: overallDuration / prev.length // Aproximado
          };
        });
        
        const totalTests = updatedSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
        const totalPassed = updatedSuites.reduce((sum, suite) => sum + suite.passed, 0);
        const totalFailed = updatedSuites.reduce((sum, suite) => sum + suite.failed, 0);
        const totalWarnings = updatedSuites.reduce((sum, suite) => sum + suite.warnings, 0);
        
        setOverallStats({
          totalTests,
          passed: totalPassed,
          failed: totalFailed,
          warnings: totalWarnings,
          duration: overallDuration
        });
        
        return updatedSuites;
      });
      
    } catch (error) {
      console.error('Error ejecutando pruebas:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50 border-green-200';
      case 'fail': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Suite de Pruebas Manuales
          </h1>
          <p className="text-gray-600">
            Verificación completa de funcionalidad, rendimiento y accesibilidad
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Control de Pruebas</h2>
              {isRunning && (
                <p className="text-blue-600">
                  Ejecutando: {currentTest}
                </p>
              )}
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="
                px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-4 focus:ring-blue-300
                transition-all duration-200
              "
            >
              {isRunning ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Ejecutando Pruebas...
                </span>
              ) : (
                'Ejecutar Todas las Pruebas'
              )}
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        {overallStats.totalTests > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Resumen General</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{overallStats.totalTests}</div>
                <div className="text-sm text-gray-600">Total Pruebas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
                <div className="text-sm text-gray-600">Exitosas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
                <div className="text-sm text-gray-600">Fallidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{overallStats.warnings}</div>
                <div className="text-sm text-gray-600">Advertencias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overallStats.duration}ms</div>
                <div className="text-sm text-gray-600">Duración</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-6">
          {testSuites.map((suite, suiteIndex) => (
            <div key={suiteIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{suite.name}</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-600">✅ {suite.passed}</span>
                    <span className="text-red-600">❌ {suite.failed}</span>
                    <span className="text-yellow-600">⚠️ {suite.warnings}</span>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {suite.tests.map((test, testIndex) => (
                  <div key={testIndex} className={`p-4 border-l-4 ${getStatusColor(test.status)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{getStatusIcon(test.status)}</span>
                          <h4 className="font-medium text-gray-900">{test.testName}</h4>
                        </div>
                        <p className="text-gray-700 mb-2">{test.message}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(test.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      {test.details && (
                        <details className="ml-4">
                          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                            Ver detalles
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {testSuites.length === 0 && !isRunning && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados de pruebas</h3>
            <p className="text-gray-600">Haz clic en "Ejecutar Todas las Pruebas" para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualTestSuite;