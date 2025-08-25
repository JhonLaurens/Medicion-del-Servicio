import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigationSidebar from './components/NavigationSidebar';
import HomePage from './components/HomePage';
import TechnicalSpecsPage from './components/TechnicalSpecsPage';
import SegmentAnalysis from './components/SegmentAnalysis';
import GeographicAnalysis from './components/GeographicAnalysis';
import SuggestionsAnalysis from './components/SuggestionsAnalysis';
import DataExplorer from './components/DataExplorer';
// import TestComponent from './components/TestComponent'; // Removido para producción
import ManagerParticipationReport from './components/ManagerParticipationReport';
import MetricsOverview from './components/MetricsOverview';
import ComponentTests from './test/ComponentTests';
import DiagnosticComponent from './components/DiagnosticComponent';
import DataLoadingDiagnostic from './components/DataLoadingDiagnostic';
import NavigationAudit from './components/NavigationAudit';
import ManualNavigationTest from './test/ManualNavigationTest';
import ManualTestSuite from './test/ManualTestSuite';
import EnvironmentCompatibilityTest from './test/EnvironmentCompatibilityTest';
import { satisfactionDataService } from './services/dataService';
import ErrorBoundary from './components/ErrorBoundary';

type PageType = 'inicio' | 'ficha-tecnica' | 'dashboard-general' | 'analisis-segmento' | 
                'analisis-geografico' | 'analisis-sugerencias' | 'explorador-datos' | 
                'participacion-gerentes' | 'metricas-completas' | 'pruebas-componentes' | 'diagnostico' | 'diagnostico-datos' | 'auditoria-navegacion'
  | 'prueba-navegacion-manual'
  | 'suite-pruebas-manual'
  | 'prueba-compatibilidad-entornos';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('inicio');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await satisfactionDataService.loadData();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los datos';
        setError(errorMessage);
        console.error('❌ App: Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePageChange = useCallback((page: string) => {
    if (isValidPage(page)) {
      setCurrentPage(page as PageType);
    } else {
      console.warn(`⚠️ App: Invalid page requested: ${page}`);
      setCurrentPage('inicio');
    }
  }, []);

  const isValidPage = (page: string): page is PageType => {
    const validPages: PageType[] = [
      'inicio', 'ficha-tecnica', 'dashboard-general', 'analisis-segmento',
      'analisis-geografico', 'analisis-sugerencias', 'explorador-datos',
      'participacion-gerentes', 'metricas-completas', 'pruebas-componentes', 'diagnostico', 'diagnostico-datos', 'auditoria-navegacion', 'prueba-navegacion-manual', 'suite-pruebas-manual', 'prueba-compatibilidad-entornos'
    ];
    return validPages.includes(page as PageType);
  };

  const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando datos del sistema...</p>
        <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos momentos</p>
      </div>
    </div>
  );

  const ErrorScreen = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar la aplicación</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-x-4">
          <button 
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
          <button 
            onClick={() => setCurrentPage('inicio')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    if (isLoading) {
      return <LoadingScreen />;
    }

    if (error) {
      return (
        <ErrorScreen 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      );
    }

    try {
      switch (currentPage) {
        case 'inicio':
          return <HomePage onNavigate={handlePageChange} />;
        case 'ficha-tecnica':
          return <TechnicalSpecsPage technicalInfo={satisfactionDataService.getTechnicalInfo()} />;
        case 'dashboard-general':
          // Redirigir dashboard-general a métricas completas
          return <MetricsOverview />;
        case 'analisis-segmento':
          return <SegmentAnalysis />;
        case 'analisis-geografico':
          return <GeographicAnalysis />;
        case 'analisis-sugerencias':
          return <SuggestionsAnalysis />;
        case 'explorador-datos':
          return <DataExplorer />;
        case 'participacion-gerentes':
          return <ManagerParticipationReport />;
        case 'metricas-completas':
          return <MetricsOverview />;
        case 'pruebas-componentes':
          return <ComponentTests />;
        case 'diagnostico':
          return <DiagnosticComponent />;
        case 'diagnostico-datos':
          return <DataLoadingDiagnostic />;
        case 'auditoria-navegacion':
          return <NavigationAudit />;
        case 'prueba-navegacion-manual':
          return <ManualNavigationTest />;
        case 'suite-pruebas-manual':
          return <ManualTestSuite />;
        case 'prueba-compatibilidad-entornos':
          return <EnvironmentCompatibilityTest />;
        // case 'test':
        //   return <TestComponent />; // Removido para producción
        default:
          return <HomePage onNavigate={handlePageChange} />;
      }
    } catch (pageError) {
      console.error(`❌ App: Error rendering page ${currentPage}:`, pageError);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error en la página</h2>
          <p className="text-red-700 mb-4">
            Ocurrió un error al cargar la página "{currentPage}".
          </p>
          <button 
            onClick={() => setCurrentPage('inicio')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header 
          currentPage={currentPage} 
          onNavigateHome={() => handlePageChange('home')} 
        />
        <div className="flex flex-1">
          <NavigationSidebar 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />
          <main className="flex-1 p-6 overflow-auto">
            {renderCurrentPage()}
          </main>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;