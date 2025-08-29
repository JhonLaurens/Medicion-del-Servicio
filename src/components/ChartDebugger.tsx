import React, { useEffect, useState } from 'react';
import { satisfactionDataService } from '../services/dataService';

interface FilterStats {
  filterValue: string;
  totalSurveys: number;
  averageRating: number;
  claridadPromedio: number;
  recomendacionPromedio: number;
  satisfaccionPromedio: number;
  lealtadPromedio: number;
}

const ChartDebugger: React.FC = () => {
  const [filterStats, setFilterStats] = useState<FilterStats[]>([]);
  const [selectedFilterType, setSelectedFilterType] = useState<string>('tipoEjecutivo');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [rawDataCount, setRawDataCount] = useState(0);

  useEffect(() => {
    const loadAndProcessData = async () => {
      try {
        console.log('🔍 ChartDebugger: Loading data...');
        await satisfactionDataService.loadData();
        
        const data = satisfactionDataService.getData();
        console.log('📊 ChartDebugger: Raw data loaded:', data?.length || 0, 'records');
        setRawDataCount(data?.length || 0);
        setDataLoaded(true);
        
        if (data && data.length > 0) {
          calculateFilterStats(data);
        }
      } catch (error) {
        console.error('❌ ChartDebugger: Error loading data:', error);
      }
    };

    loadAndProcessData();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      const data = satisfactionDataService.getData();
      if (data && data.length > 0) {
        calculateFilterStats(data);
      }
    }
  }, [selectedFilterType, dataLoaded]);

  const calculateFilterStats = (data: any[]) => {
    console.log('🔍 ChartDebugger calculateFilterStats: Starting with', data.length, 'records');
    console.log('🔍 ChartDebugger: Sample record:', data[0]);
    
    if (!data || data.length === 0) {
      console.log('❌ ChartDebugger: No data available');
      setFilterStats([]);
      return;
    }

    const stats: FilterStats[] = [];

    // Obtener valores únicos para el tipo de filtro seleccionado
    const uniqueValues = [...new Set(
      data.map((record) => {
        let value;
        switch (selectedFilterType) {
          case 'tipoEjecutivo':
            value = record['TIPO EJECUTIVO'] || 'Sin Tipo';
            return value.toUpperCase();
          case 'segmento':
            return record.SEGMENTO || 'Sin Segmento';
          case 'ciudad':
            return record.CIUDAD || 'Sin Ciudad';
          case 'agencia':
            return record.AGENCIA || 'Sin Agencia';
          default:
            return 'Sin Clasificar';
        }
      }).filter(Boolean)
    )].filter(value => value && value.trim() !== '');

    console.log('🔍 ChartDebugger: Unique values for', selectedFilterType, ':', uniqueValues);

    uniqueValues.forEach((value) => {
      const filteredData = data.filter((record) => {
        switch (selectedFilterType) {
          case 'tipoEjecutivo':
            const tipoValue = (record['TIPO EJECUTIVO'] || 'Sin Tipo').toUpperCase();
            return tipoValue === value;
          case 'segmento':
            return (record.SEGMENTO || 'Sin Segmento') === value;
          case 'ciudad':
            return (record.CIUDAD || 'Sin Ciudad') === value;
          case 'agencia':
            return (record.AGENCIA || 'Sin Agencia') === value;
          default:
            return false;
        }
      });

      if (filteredData.length > 0) {
        const claridadCol = 'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?';
        const recomendacionCol = '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?';
        const satisfaccionCol = 'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?';
        const lealtadCol = 'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?';

        const claridadValues = filteredData.map((r) => parseFloat(r[claridadCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);
        const recomendacionValues = filteredData.map((r) => parseFloat(r[recomendacionCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);
        const satisfaccionValues = filteredData.map((r) => parseFloat(r[satisfaccionCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);
        const lealtadValues = filteredData.map((r) => parseFloat(r[lealtadCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);

        const claridadPromedio = claridadValues.length > 0 ? claridadValues.reduce((a, b) => a + b, 0) / claridadValues.length : 0;
        const recomendacionPromedio = recomendacionValues.length > 0 ? recomendacionValues.reduce((a, b) => a + b, 0) / recomendacionValues.length : 0;
        const satisfaccionPromedio = satisfaccionValues.length > 0 ? satisfaccionValues.reduce((a, b) => a + b, 0) / satisfaccionValues.length : 0;
        const lealtadPromedio = lealtadValues.length > 0 ? lealtadValues.reduce((a, b) => a + b, 0) / lealtadValues.length : 0;

        const validMetrics = [claridadPromedio, recomendacionPromedio, satisfaccionPromedio, lealtadPromedio].filter(v => v > 0);
        const averageRating = validMetrics.length > 0 ? validMetrics.reduce((a, b) => a + b, 0) / validMetrics.length : 0;

        stats.push({
          filterValue: value,
          totalSurveys: filteredData.length,
          averageRating: parseFloat(averageRating.toFixed(2)),
          claridadPromedio: parseFloat(claridadPromedio.toFixed(2)),
          recomendacionPromedio: parseFloat(recomendacionPromedio.toFixed(2)),
          satisfaccionPromedio: parseFloat(satisfaccionPromedio.toFixed(2)),
          lealtadPromedio: parseFloat(lealtadPromedio.toFixed(2)),
        });
      }
    });

    const sortedStats = stats.sort((a, b) => b.totalSurveys - a.totalSurveys);
    console.log('✅ ChartDebugger: Final calculated stats:', sortedStats);
    setFilterStats(sortedStats);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Chart Data Debugger</h2>
      
      <div className="mb-4">
        <p><strong>Data Loaded:</strong> {dataLoaded ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Raw Data Count:</strong> {rawDataCount}</p>
        <p><strong>Filter Stats Count:</strong> {filterStats.length}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Filter Type:</label>
        <select 
          value={selectedFilterType} 
          onChange={(e) => setSelectedFilterType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="tipoEjecutivo">Tipo Ejecutivo</option>
          <option value="segmento">Segmento</option>
          <option value="ciudad">Ciudad</option>
          <option value="agencia">Agencia</option>
        </select>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Filter Stats Data:</h3>
        {filterStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Filter Value</th>
                  <th className="border px-4 py-2">Total Surveys</th>
                  <th className="border px-4 py-2">Avg Rating</th>
                  <th className="border px-4 py-2">Claridad</th>
                  <th className="border px-4 py-2">Recomendación</th>
                  <th className="border px-4 py-2">Satisfacción</th>
                  <th className="border px-4 py-2">Lealtad</th>
                </tr>
              </thead>
              <tbody>
                {filterStats.slice(0, 10).map((stat, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{stat.filterValue}</td>
                    <td className="border px-4 py-2">{stat.totalSurveys}</td>
                    <td className="border px-4 py-2">{stat.averageRating}</td>
                    <td className="border px-4 py-2">{stat.claridadPromedio}</td>
                    <td className="border px-4 py-2">{stat.recomendacionPromedio}</td>
                    <td className="border px-4 py-2">{stat.satisfaccionPromedio}</td>
                    <td className="border px-4 py-2">{stat.lealtadPromedio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-red-500">❌ No filter stats data available</p>
        )}
      </div>

      <div className="text-sm text-gray-600">
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
};

export default ChartDebugger;