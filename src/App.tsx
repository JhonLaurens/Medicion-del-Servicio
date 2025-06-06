import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigationSidebar from './components/NavigationSidebar';
import HomePage from './components/HomePage';
import TechnicalSpecsPage from './components/TechnicalSpecsPage';
import GeneralDashboard from './components/GeneralDashboard';
import SegmentAnalysis from './components/SegmentAnalysis';
import GeographicAnalysis from './components/GeographicAnalysis';
import SuggestionsAnalysis from './components/SuggestionsAnalysis';
import DataExplorer from './components/DataExplorer';
import TestComponent from './components/TestComponent';
import ManagerParticipationReport from './components/ManagerParticipationReport';
import { satisfactionDataService } from './services/dataService';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await satisfactionDataService.loadData();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'inicio':
        return <HomePage />;
      case 'ficha-tecnica':
        return <TechnicalSpecsPage />;
      case 'dashboard-general':
        return <GeneralDashboard />;
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
      case 'test':
        return <TestComponent />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex flex-1">
          <NavigationSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
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
