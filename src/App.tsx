import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import TechnicalSpecsPage from './components/TechnicalSpecsPage';
import GeneralDashboard from './components/GeneralDashboard';
import SegmentAnalysis from './components/SegmentAnalysis';
import GeographicAnalysis from './components/GeographicAnalysis';
import SuggestionsAnalysis from './components/SuggestionsAnalysis';
import DataExplorer from './components/DataExplorer';
import TestComponent from './components/TestComponent';
import ManagerParticipationReport from './components/ManagerParticipationReport';
import ErrorBoundary from './components/ErrorBoundary';
import { fetchData } from './store/dataSlice';
import { AppDispatch, RootState } from './store';

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos de la aplicación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <Router basename="/Medicion-del-Servicio">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/inicio" replace />} />
            <Route path="inicio" element={<HomePage />} />
            <Route path="ficha-tecnica" element={<TechnicalSpecsPage />} />
            <Route path="dashboard-general" element={<GeneralDashboard />} />
            <Route path="analisis-segmento" element={<SegmentAnalysis />} />
            <Route path="analisis-geografico" element={<GeographicAnalysis />} />
            <Route path="analisis-sugerencias" element={<SuggestionsAnalysis />} />
            <Route path="explorador-datos" element={<DataExplorer />} />
            <Route path="participacion-gerentes" element={<ManagerParticipationReport />} />
            <Route path="test" element={<TestComponent />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
