import React, { useEffect, useState } from 'react';
import { satisfactionDataService } from './services/dataService';

const TestComponent: React.FC = () => {
  const [status, setStatus] = useState<string>('Iniciando...');
  const [data, setData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const testDataLoading = async () => {
      try {
        console.log('🧪 Test: Iniciando prueba de carga de datos...');
        setStatus('Cargando datos...');
        
        await satisfactionDataService.loadData();
        const loadedData = satisfactionDataService.getData();
        
        console.log('🧪 Test: Datos cargados:', loadedData.length);
        setData(loadedData.slice(0, 5)); // Solo los primeros 5 para prueba
        
        if (loadedData.length > 0) {
          console.log('🧪 Test: Generando KPIs...');
          const kpis = satisfactionDataService.getKPIData();
          console.log('🧪 Test: KPIs generados:', kpis);
          setStatus(`✅ Datos cargados correctamente: ${loadedData.length} registros`);
        } else {
          setStatus('⚠️ No se encontraron datos');
        }
      } catch (error) {
        console.error('🧪 Test: Error:', error);
        setStatus('❌ Error al cargar datos');
        setErrors([error instanceof Error ? error.message : String(error)]);
      }
    };

    testDataLoading();
  }, []);

  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold mb-4">🧪 Prueba de Carga de Datos</h1>
      
      <div className="bg-gray-100 p-3 mb-5 rounded">
        <strong>Estado:</strong> {status}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-100 p-3 mb-5 rounded border border-red-300">
          <strong>Errores:</strong>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">📊 Muestra de datos (primeros 5 registros):</h3>
          <pre className="bg-gray-50 p-3 overflow-auto text-sm rounded border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-5">
        <h3 className="text-lg font-semibold mb-3">🔍 Instrucciones para debugging:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Abre las herramientas de desarrollador (F12)</li>
          <li>Ve a la pestaña Console</li>
          <li>Busca los mensajes que empiecen con 🧪 Test</li>
          <li>También busca mensajes de DataService</li>
        </ol>
      </div>
    </div>
  );
};

export default TestComponent;
