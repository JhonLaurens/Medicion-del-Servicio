import React, { useState, useEffect } from 'react';
import { satisfactionDataService } from '../services/dataService';
import { SatisfactionRecord } from '../types';

interface DiagnosticInfo {
  isDataLoaded: boolean;
  dataLength: number;
  csvAccessible: boolean;
  sampleData: SatisfactionRecord[];
  loadingError: string | null;
  csvContent: string;
  serviceInstance: string;
}

const DataLoadingDiagnostic: React.FC = () => {
  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo>({
    isDataLoaded: false,
    dataLength: 0,
    csvAccessible: false,
    sampleData: [],
    loadingError: null,
    csvContent: '',
    serviceInstance: 'unknown'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const runDiagnostic = async () => {
    setIsLoading(true);
    console.log('🔍 DataLoadingDiagnostic: Iniciando diagnóstico completo...');
    
    try {
      // 1. Verificar acceso al CSV
      let csvAccessible = false;
      let csvContent = '';
      try {
        const csvPath = '/datos.csv';
        const response = await fetch(csvPath);
        csvAccessible = response.ok;
        if (csvAccessible) {
          csvContent = await response.text();
          console.log('✅ CSV accesible, tamaño:', csvContent.length);
        } else {
          console.error('❌ CSV no accesible, status:', response.status);
        }
      } catch (error) {
        console.error('❌ Error accediendo CSV:', error);
        csvAccessible = false;
      }

      // 2. Verificar estado del dataService
      const isDataLoaded = satisfactionDataService.isDataLoaded();
      const data = satisfactionDataService.getData();
      const dataLength = data.length;
      const sampleData = data.slice(0, 5);
      
      console.log('📊 Estado del dataService:');
      console.log('  - isDataLoaded:', isDataLoaded);
      console.log('  - dataLength:', dataLength);
      console.log('  - sampleData:', sampleData);
      console.log('  - serviceInstance:', satisfactionDataService.constructor.name);

      // 3. Intentar cargar datos si no están cargados
      let loadingError = null;
      if (!isDataLoaded) {
        try {
          console.log('🔄 Intentando cargar datos...');
          await satisfactionDataService.loadData();
          console.log('✅ Datos cargados exitosamente');
        } catch (error) {
          loadingError = error instanceof Error ? error.message : 'Error desconocido';
          console.error('❌ Error cargando datos:', error);
        }
      }

      // 4. Actualizar estado después de intentar cargar
      const finalData = satisfactionDataService.getData();
      const finalIsLoaded = satisfactionDataService.isDataLoaded();
      
      setDiagnosticInfo({
        isDataLoaded: finalIsLoaded,
        dataLength: finalData.length,
        csvAccessible,
        sampleData: finalData.slice(0, 5),
        loadingError,
        csvContent: csvContent.substring(0, 500) + (csvContent.length > 500 ? '...' : ''),
        serviceInstance: satisfactionDataService.constructor.name
      });

    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      setDiagnosticInfo(prev => ({
        ...prev,
        loadingError: error instanceof Error ? error.message : 'Error en diagnóstico'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleForceReload = async () => {
    try {
      // Forzar recarga completa
      await satisfactionDataService.loadData();
      runDiagnostic();
    } catch (error) {
      console.error('Error en recarga forzada:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Ejecutando diagnóstico de carga de datos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🔍 Diagnóstico de Carga de Datos
              </h1>
              <p className="text-gray-600">
                Análisis detallado del estado de carga de datos del archivo CSV principal
              </p>
            </div>
            <div className="space-x-4">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Actualizar
              </button>
              <button
                onClick={handleForceReload}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🚀 Forzar Recarga
              </button>
            </div>
          </div>
        </div>

        {/* Estado General */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`bg-white rounded-lg shadow-lg p-6 text-center ${
            diagnosticInfo.isDataLoaded ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            <div className={`text-3xl font-bold ${
              diagnosticInfo.isDataLoaded ? 'text-green-600' : 'text-red-600'
            }`}>
              {diagnosticInfo.isDataLoaded ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600 mt-2">Datos Cargados</div>
            <div className="text-xs text-gray-500 mt-1">
              {diagnosticInfo.isDataLoaded ? 'Activo' : 'Inactivo'}
            </div>
          </div>

          <div className={`bg-white rounded-lg shadow-lg p-6 text-center ${
            diagnosticInfo.csvAccessible ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            <div className={`text-3xl font-bold ${
              diagnosticInfo.csvAccessible ? 'text-green-600' : 'text-red-600'
            }`}>
              {diagnosticInfo.csvAccessible ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-600 mt-2">CSV Accesible</div>
            <div className="text-xs text-gray-500 mt-1">
              {diagnosticInfo.csvAccessible ? 'Disponible' : 'No disponible'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">
              {diagnosticInfo.dataLength.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-2">Registros</div>
            <div className="text-xs text-gray-500 mt-1">En memoria</div>
          </div>

          <div className={`bg-white rounded-lg shadow-lg p-6 text-center ${
            diagnosticInfo.loadingError ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
          }`}>
            <div className={`text-3xl font-bold ${
              diagnosticInfo.loadingError ? 'text-red-600' : 'text-green-600'
            }`}>
              {diagnosticInfo.loadingError ? '⚠️' : '✅'}
            </div>
            <div className="text-sm text-gray-600 mt-2">Estado</div>
            <div className="text-xs text-gray-500 mt-1">
              {diagnosticInfo.loadingError ? 'Con errores' : 'Sin errores'}
            </div>
          </div>
        </div>

        {/* Error Details */}
        {diagnosticInfo.loadingError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error de Carga</h3>
            <p className="text-red-700 font-mono text-sm">{diagnosticInfo.loadingError}</p>
          </div>
        )}

        {/* Información del DataService */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Información del DataService</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Estado Actual</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Instancia:</strong> {diagnosticInfo.serviceInstance}</p>
                <p><strong>Datos cargados:</strong> {diagnosticInfo.isDataLoaded ? 'Sí' : 'No'}</p>
                <p><strong>Total registros:</strong> {diagnosticInfo.dataLength.toLocaleString()}</p>
                <p><strong>CSV accesible:</strong> {diagnosticInfo.csvAccessible ? 'Sí' : 'No'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Métodos Disponibles</h3>
              <div className="space-y-1 text-sm">
                <p>✅ isDataLoaded()</p>
                <p>✅ getData()</p>
                <p>✅ loadData()</p>
                <p>✅ getKPIData()</p>
                <p>✅ getCityData()</p>
              </div>
            </div>
          </div>
        </div>

        {/* Muestra de Datos */}
        {diagnosticInfo.sampleData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Muestra de Datos (Primeros 5 registros)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Segmento</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ciudad</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Satisfacción</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Claridad</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosticInfo.sampleData.map((record, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 text-sm">{record.ID}</td>
                      <td className="px-4 py-2 text-sm">{record.NOMBRE}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          record.SEGMENTO === 'PERSONAS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {record.SEGMENTO}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{record.CIUDAD}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          record.satisfaccion_general >= 4 ? 'bg-green-100 text-green-800' : 
                          record.satisfaccion_general >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.satisfaccion_general}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          record.claridad_informacion >= 4 ? 'bg-green-100 text-green-800' : 
                          record.claridad_informacion >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.claridad_informacion}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenido del CSV */}
        {diagnosticInfo.csvContent && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📄 Contenido del CSV (Primeros 500 caracteres)</h2>
            <div className="bg-gray-100 rounded p-4 font-mono text-sm overflow-x-auto">
              <pre>{diagnosticInfo.csvContent}</pre>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">💡 Recomendaciones</h2>
          <div className="space-y-2 text-blue-700">
            {!diagnosticInfo.csvAccessible && (
              <p>• Verificar que el archivo datos.csv esté en la carpeta public/</p>
            )}
            {!diagnosticInfo.isDataLoaded && diagnosticInfo.csvAccessible && (
              <p>• El CSV es accesible pero los datos no se han cargado. Verificar el proceso de parsing.</p>
            )}
            {diagnosticInfo.dataLength === 0 && diagnosticInfo.isDataLoaded && (
              <p>• Los datos se marcaron como cargados pero no hay registros. Verificar validación de datos.</p>
            )}
            {diagnosticInfo.loadingError && (
              <p>• Resolver el error de carga antes de continuar.</p>
            )}
            {diagnosticInfo.isDataLoaded && diagnosticInfo.dataLength > 0 && (
              <p>• ✅ Todo parece estar funcionando correctamente. Los datos están cargados y disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLoadingDiagnostic;