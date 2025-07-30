import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SatisfactionDataService } from '../services/dataService';
import { ExecutiveAnalysisService, ExecutiveToAnalyze } from '../services/executiveAnalysisService';

interface ManagerData {
  name: string;
  surveys: number;
  percentage: number;
  coverageRate: number;
  totalUniverse: number;
  category: string;
  agencia?: string;
  segmento?: string;
  ciudad?: string;
  tipoEjecutivo?: string;
  executiveInfo?: ExecutiveToAnalyze;
}

interface FilterStats {
  filterValue: string;
  totalSurveys: number;
  averageRating: number;
  claridadPromedio: number;
  recomendacionPromedio: number;
  satisfaccionPromedio: number;
  lealtadPromedio: number;
}

interface AgencyInfo {
  name: string;
  totalSurveys: number;
  totalManagers: number;
  activeManagers: number;
  city: string;
  segment: string;
}

const ManagerParticipationReport: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  
  // Nuevos estados para los filtros
  const [selectedFilterType, setSelectedFilterType] = useState<string>('tipoEjecutivo');
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>('all');
  const [filterStats, setFilterStats] = useState<FilterStats[]>([]);
  
  const [managerData, setManagerData] = useState<{
    personasManagers: ManagerData[];
    bogotaManagers: ManagerData[];
    medellinManagers: ManagerData[];
    otherEmpresarialManagers: ManagerData[];
  }>({
    personasManagers: [],
    bogotaManagers: [],
    medellinManagers: [],
    otherEmpresarialManagers: []
  });
  const [agencyData, setAgencyData] = useState<AgencyInfo[]>([]);
  const [executivesToAnalyze, setExecutivesToAnalyze] = useState<ExecutiveToAnalyze[]>([]);

  const dataService = new SatisfactionDataService();
  const executiveService = new ExecutiveAnalysisService();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 ManagerParticipationReport: Loading data...');
        
        // Cargar ambos archivos en paralelo
        await Promise.all([
          dataService.loadData(),
          executiveService.loadExecutivesToAnalyze()
        ]);
        
        console.log('✅ ManagerParticipationReport: Both data sources loaded successfully');
        
        // Obtener la lista de ejecutivos para analizar
        const executives = executiveService.getExecutivesToAnalyze();
        setExecutivesToAnalyze(executives);
        
        console.log('📋 Executives to analyze:', executives.length, 'executives');
        console.log('📋 Sample executives:', executives.slice(0, 3));
        
        // Process manager data with filtered executives
        processManagerData();
      } catch (error) {
        console.error('❌ ManagerParticipationReport: Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Monitor state changes
  useEffect(() => {
    console.log('📊 managerData state changed:', managerData);
    console.log('📊 Current allManagers length:', [
      ...managerData.personasManagers,
      ...managerData.bogotaManagers,
      ...managerData.medellinManagers,
      ...managerData.otherEmpresarialManagers,
    ].length);
  }, [managerData]);

  useEffect(() => {
    console.log('👥 executivesToAnalyze state changed:', executivesToAnalyze.length, 'executives');
  }, [executivesToAnalyze]);

  // Process data when both services are loaded
  useEffect(() => {
    console.log('🔄 Checking if data processing should run...');
    console.log('🔍 dataService.isDataLoaded():', dataService.isDataLoaded());
    console.log('🔍 executiveService.isDataLoaded():', executiveService.isDataLoaded());
    
    if (dataService.isDataLoaded() && executiveService.isDataLoaded()) {
      console.log('✅ Both services loaded, calling processManagerData...');
      processManagerData();
    } else {
      console.log('⏳ Waiting for data to load...');
    }
  }, [executivesToAnalyze]); // Trigger when executives are loaded
  
  const processManagerData = () => {
    console.log('🔄 processManagerData: Starting data processing...');
    
    const data = dataService.getData();
    console.log('🔍 DEBUG: Total data records:', data?.length || 0);
    
    if (!data || data.length === 0) {
      console.log('❌ ManagerParticipationReport: No data available');
      console.log('🔍 DEBUG: dataService.isDataLoaded():', dataService.isDataLoaded());
      return;
    }

    if (!executiveService.isDataLoaded()) {
      console.log('❌ ManagerParticipationReport: Executive analysis data not loaded yet');
      console.log('🔍 DEBUG: executiveService.isDataLoaded():', executiveService.isDataLoaded());
      return;
    }
    
    console.log('✅ Both data sources are loaded, proceeding with processing...');

    // Debug: Verificar las columnas disponibles
    if (data.length > 0) {
      console.log('🔍 DEBUG: Available columns:', Object.keys(data[0]));
      console.log('🔍 DEBUG: Sample record:', data[0]);
    }

    // Obtener la lista de ejecutivos para analizar
    const executivesToAnalyze = executiveService.getExecutivesToAnalyze();
    console.log('📋 Executives to analyze:', executivesToAnalyze.map(e => e.EJECUTIVO_FINAL));

    // Debug: Mostrar algunos nombres de ejecutivos de ambos archivos para comparación
    console.log('🔍 DEBUG: Sample executives from analysis file:', 
      executivesToAnalyze.slice(0, 5).map(e => `"${e.EJECUTIVO_FINAL}"`));
    
    console.log('🔍 DEBUG: Sample executives from data file:', 
      data.slice(0, 10).map(r => `"${r.EJECUTIVO_FINAL}"`));

    // Análisis de ejecutivos únicos
    const uniqueExecutivesInData = [...new Set(data.map(r => r.EJECUTIVO_FINAL))];
    const uniqueExecutivesInAnalysis = [...new Set(executivesToAnalyze.map(e => e.EJECUTIVO_FINAL))];
    
    console.log('📊 DEBUG: Unique executives in data file:', uniqueExecutivesInData.length);
    console.log('📊 DEBUG: Unique executives in analysis file:', uniqueExecutivesInAnalysis.length);
    
    // Encontrar ejecutivos que están en data pero no en analysis
    const executivesNotInAnalysis = uniqueExecutivesInData.filter(dataExec => 
      !uniqueExecutivesInAnalysis.some(analysisExec => 
        analysisExec.toLowerCase().trim() === dataExec?.toLowerCase().trim()
      )
    );
    
    console.log('❌ DEBUG: Executives in data but NOT in analysis file:', executivesNotInAnalysis.length);
    if (executivesNotInAnalysis.length > 0) {
      console.log('❌ DEBUG: Sample executives not in analysis:', executivesNotInAnalysis.slice(0, 5));
    }

    // Filtrar registros que correspondan a los ejecutivos especificados
    const filteredRecords = data.filter((record, index) => {
      // Usar EJECUTIVO_FINAL en lugar de EJECUTIVO para hacer coincidir con el archivo de análisis
      const ejecutivoName = record.EJECUTIVO_FINAL;
      
      // Verificar si este ejecutivo está en la lista para analizar
      const shouldInclude = executivesToAnalyze.some(executive => {
        const normalizedExecutiveName = executive.EJECUTIVO_FINAL.toLowerCase().trim();
        const normalizedRecordName = ejecutivoName?.toLowerCase().trim() || '';
        const matches = normalizedExecutiveName === normalizedRecordName;
        
        // Debug detallado para los primeros registros
        if (index < 10) {
          console.log(`🔍 DEBUG Record ${index}: "${normalizedRecordName}" vs "${normalizedExecutiveName}" = ${matches}`);
        }
        
        return matches;
      });

      if (shouldInclude) {
        console.log('✅ Including executive:', ejecutivoName);
      } else if (index < 10) {
        console.log('❌ Excluding executive:', ejecutivoName);
      }

      return shouldInclude;
    });

    console.log('📊 Filtered records for specified executives:', filteredRecords.length);
    console.log('📊 Sample filtered records:', filteredRecords.slice(0, 3));

    // Agrupar por EJECUTIVO_FINAL y obtener información adicional del archivo de análisis
    const managerGroups = filteredRecords.reduce((acc, record) => {
      const managerName = record.EJECUTIVO_FINAL || "Sin Asignar";
      const agencia = record.AGENCIA || "MÚLTIPLES";
      const segmento = record.SEGMENTO || "Sin Segmento";

      // Obtener información adicional del archivo de ejecutivos para analizar
      const executiveInfo = executivesToAnalyze.find(executive => {
        const normalizedExecutiveName = executive.EJECUTIVO_FINAL.toLowerCase().trim();
        const normalizedRecordName = managerName.toLowerCase().trim();
        return normalizedExecutiveName === normalizedRecordName;
      });

      const key = `${managerName}-${agencia}`;

      if (!acc[key]) {
        acc[key] = {
          name: managerName,
          agencia: agencia,
          segmento: segmento,
          surveys: 0,
          records: [],
          executiveInfo: executiveInfo,
          // Usar información del archivo de análisis si está disponible
          ciudad: executiveInfo?.CIUDAD || "Sin Ciudad",
          tipoEjecutivo: executiveInfo?.TIPO_EJECUTIVO || "Sin Tipo"
        };
      }

      acc[key].surveys++;
      acc[key].records.push(record);

      return acc;
    }, {} as Record<string, any>);

    // Convertir a array y calcular estadísticas
    const managersArray = Object.values(managerGroups).map((group: any) => {
      const totalSurveys = group.surveys;
      const totalRecords = filteredRecords.length;
      const percentage = totalRecords > 0 ? (totalSurveys / totalRecords) * 100 : 0;

      // Determinar categoría basada en la información del archivo de análisis
      let category = "general";
      const executiveInfo = group.executiveInfo;
      
      if (executiveInfo) {
        const segmento = executiveInfo.SEGMENTO?.toLowerCase() || '';
        const ciudad = executiveInfo.CIUDAD?.toLowerCase() || '';
        
        if (segmento.includes("personas")) {
          category = "personas";
        } else if (segmento.includes("empresarial")) {
          if (ciudad.includes("bogotá") || ciudad.includes("bogota")) {
            category = "empresarial-bogota";
          } else if (ciudad.includes("medellín") || ciudad.includes("medellin")) {
            category = "empresarial-medellin";
          } else {
            category = "empresarial-other";
          }
        }
      } else {
        // Fallback a la lógica anterior si no hay información del archivo de análisis
        if (group.segmento.toLowerCase().includes("personas")) {
          category = "personas";
        } else if (group.segmento.toLowerCase().includes("empresarial")) {
          if (group.agencia.toLowerCase().includes("bogotá")) {
            category = "empresarial-bogota";
          } else if (
            group.agencia.toLowerCase().includes("medellín") ||
            group.agencia.toLowerCase().includes("medellin")
          ) {
            category = "empresarial-medellin";
          } else {
            category = "empresarial-other";
          }
        }
      }

      return {
        name: group.name,
        surveys: totalSurveys,
        percentage: parseFloat(percentage.toFixed(2)),
        coverageRate: 0,
        totalUniverse: totalSurveys,
        category: category,
        agencia: group.agencia,
        segmento: group.segmento,
        ciudad: group.ciudad,
        tipoEjecutivo: group.tipoEjecutivo,
        executiveInfo: group.executiveInfo
      } as ManagerData;
    });

    // Separar por categorías
    const personasManagers = managersArray.filter(m => m.category === "personas");
    const bogotaManagers = managersArray.filter(m => m.category === "empresarial-bogota");
    const medellinManagers = managersArray.filter(m => m.category === "empresarial-medellin");
    const otherEmpresarialManagers = managersArray.filter(m => m.category === "empresarial-other");

    // Crear información de agencias basada en los ejecutivos filtrados
    const agencyGroups = managersArray.reduce((acc, manager) => {
      const agencyName = manager.agencia || "Sin Agencia";

      if (!acc[agencyName]) {
        acc[agencyName] = {
          name: agencyName,
          totalSurveys: 0,
          totalManagers: 0,
          activeManagers: 0,
          city: manager.ciudad || "Sin Definir",
          segment: manager.segmento || "Sin Definir",
        };
      }

      acc[agencyName].totalSurveys += manager.surveys;
      acc[agencyName].totalManagers++;
      if (manager.surveys > 0) {
        acc[agencyName].activeManagers++;
      }

      return acc;
    }, {} as Record<string, AgencyInfo>);

    const agencies = Object.values(agencyGroups);

    setManagerData({
      personasManagers,
      bogotaManagers,
      medellinManagers,
      otherEmpresarialManagers,
    });

    setAgencyData(agencies);

    console.log("📊 ManagerParticipationReport: Processed filtered data:", {
      totalFilteredRecords: filteredRecords.length,
      totalExecutivesToAnalyze: executivesToAnalyze.length,
      personas: personasManagers.length,
      bogota: bogotaManagers.length,
      medellin: medellinManagers.length,
      other: otherEmpresarialManagers.length,
      agencies: agencies.length,
      allManagersLength: managersArray.length,
      sampleManagers: managersArray.slice(0, 3),
    });
    
    console.log("✅ ManagerParticipationReport: State has been updated!");
    console.log("🔍 DEBUG: Setting managerData with:", {
      personasManagers: personasManagers.length,
      bogotaManagers: bogotaManagers.length,
      medellinManagers: medellinManagers.length,
      otherEmpresarialManagers: otherEmpresarialManagers.length,
    });
    
    // Calcular estadísticas por filtros
    calculateFilterStats(filteredRecords);
  };

  // Nueva función para calcular estadísticas por filtros
  const calculateFilterStats = (data: any[]) => {
    const filterTypes = ['tipoEjecutivo', 'segmento', 'ciudad', 'agencia'];
    
    filterTypes.forEach(filterType => {
      const stats: FilterStats[] = [];
      
      // Obtener valores únicos para el tipo de filtro
      const uniqueValues = [...new Set(data.map(record => {
        switch(filterType) {
          case 'tipoEjecutivo':
            return record['TIPO EJECUTIVO'] || 'Sin Tipo';
          case 'segmento':
            return record.SEGMENTO || 'Sin Segmento';
          case 'ciudad':
            return record.CIUDAD || 'Sin Ciudad';
          case 'agencia':
            return record.AGENCIA || 'Sin Agencia';
          default:
            return 'Sin Definir';
        }
      }))];

      uniqueValues.forEach(value => {
        const filteredData = data.filter(record => {
          const recordValue = (() => {
            switch(filterType) {
              case 'tipoEjecutivo':
                return record['TIPO EJECUTIVO'] || 'Sin Tipo';
              case 'segmento':
                return record.SEGMENTO || 'Sin Segmento';
              case 'ciudad':
                return record.CIUDAD || 'Sin Ciudad';
              case 'agencia':
                return record.AGENCIA || 'Sin Agencia';
              default:
                return 'Sin Definir';
            }
          })();
          return recordValue === value;
        });

        if (filteredData.length > 0) {
          // Calcular promedios de las métricas
          const claridadValues = filteredData
            .map(r => parseFloat(r['En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?']))
            .filter(v => !isNaN(v));
          
          const recomendacionValues = filteredData
            .map(r => parseFloat(r['¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?']))
            .filter(v => !isNaN(v));
          
          const satisfaccionValues = filteredData
            .map(r => parseFloat(r['En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?']))
            .filter(v => !isNaN(v));
          
          const lealtadValues = filteredData
            .map(r => parseFloat(r['Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?']))
            .filter(v => !isNaN(v));

          const claridadPromedio = claridadValues.length > 0 ? 
            claridadValues.reduce((a, b) => a + b, 0) / claridadValues.length : 0;
          
          const recomendacionPromedio = recomendacionValues.length > 0 ? 
            recomendacionValues.reduce((a, b) => a + b, 0) / recomendacionValues.length : 0;
          
          const satisfaccionPromedio = satisfaccionValues.length > 0 ? 
            satisfaccionValues.reduce((a, b) => a + b, 0) / satisfaccionValues.length : 0;
          
          const lealtadPromedio = lealtadValues.length > 0 ? 
            lealtadValues.reduce((a, b) => a + b, 0) / lealtadValues.length : 0;

          // Promedio general de todas las métricas
          const allValues = [...claridadValues, ...recomendacionValues, ...satisfaccionValues, ...lealtadValues];
          const averageRating = allValues.length > 0 ? 
            allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;

          stats.push({
            filterValue: value,
            totalSurveys: filteredData.length,
            averageRating: parseFloat(averageRating.toFixed(2)),
            claridadPromedio: parseFloat(claridadPromedio.toFixed(2)),
            recomendacionPromedio: parseFloat(recomendacionPromedio.toFixed(2)),
            satisfaccionPromedio: parseFloat(satisfaccionPromedio.toFixed(2)),
            lealtadPromedio: parseFloat(lealtadPromedio.toFixed(2))
          });
        }
      });

      // Guardar las estadísticas para el tipo de filtro actual
      if (filterType === selectedFilterType) {
        setFilterStats(stats.sort((a, b) => b.totalSurveys - a.totalSurveys));
      }
    });
  };

  // Efecto para recalcular estadísticas cuando cambia el tipo de filtro
  useEffect(() => {
    if (dataService.isDataLoaded()) {
      const data = dataService.getData();
      if (data && data.length > 0) {
        calculateFilterStats(data);
      }
    }
  }, [selectedFilterType]);

  // Use real data from CSV processing
  const {
    personasManagers,
    bogotaManagers,
    medellinManagers,
    otherEmpresarialManagers,
  } = managerData;
  const allManagers = [
    ...personasManagers,
    ...bogotaManagers,
    ...medellinManagers,
    ...otherEmpresarialManagers,
  ];

  const getFilteredData = () => {
    switch (selectedCategory) {
      case "personas":
        return personasManagers;
      case "bogota":
        return bogotaManagers;
      case "medellin":
        return medellinManagers;
      case "other":
        return otherEmpresarialManagers;
      default:
        return allManagers;
    }
  };

  // Calcular estadísticas dinámicamente basadas en datos reales
  const totalSurveys = allManagers.reduce(
    (sum, manager) => sum + manager.surveys,
    0
  );
  const totalManagers = allManagers.length;
  const activeManagers = allManagers.filter(
    (manager) => manager.surveys > 0
  ).length;

  // Top 10 gerentes por número de encuestas (con datos reales)
  const topManagers = allManagers
    .filter((manager) => manager.surveys > 0)
    .sort((a, b) => b.surveys - a.surveys)
    .slice(0, 10);

  // Preparar datos para visualización por segmentos (calculados dinámicamente)
  const categoryData = [
    {
      name: "PERSONAS",
      surveys: personasManagers.reduce((sum, m) => sum + m.surveys, 0),
      managers: personasManagers.length,
      activeManagers: personasManagers.filter((m) => m.surveys > 0).length,
      averageSurveys:
        personasManagers.length > 0
          ? Math.round(
              personasManagers.reduce((sum, m) => sum + m.surveys, 0) /
                personasManagers.filter((m) => m.surveys > 0).length
            )
          : 0,
    },
    {
      name: "EMPRESARIAL - Bogotá",
      surveys: bogotaManagers.reduce((sum, m) => sum + m.surveys, 0),
      managers: bogotaManagers.length,
      activeManagers: bogotaManagers.filter((m) => m.surveys > 0).length,
      averageSurveys:
        bogotaManagers.filter((m) => m.surveys > 0).length > 0
          ? Math.round(
              bogotaManagers.reduce((sum, m) => sum + m.surveys, 0) /
                bogotaManagers.filter((m) => m.surveys > 0).length
            )
          : 0,
    },
    {
      name: "EMPRESARIAL - Medellín",
      surveys: medellinManagers.reduce((sum, m) => sum + m.surveys, 0),
      managers: medellinManagers.length,
      activeManagers: medellinManagers.filter((m) => m.surveys > 0).length,
      averageSurveys:
        medellinManagers.filter((m) => m.surveys > 0).length > 0
          ? Math.round(
              medellinManagers.reduce((sum, m) => sum + m.surveys, 0) /
                medellinManagers.filter((m) => m.surveys > 0).length
            )
          : 0,
    },
    {
      name: "EMPRESARIAL - Otras",
      surveys: otherEmpresarialManagers.reduce((sum, m) => sum + m.surveys, 0),
      managers: otherEmpresarialManagers.length,
      activeManagers: otherEmpresarialManagers.filter((m) => m.surveys > 0)
        .length,
      averageSurveys:
        otherEmpresarialManagers.filter((m) => m.surveys > 0).length > 0
          ? Math.round(
              otherEmpresarialManagers.reduce((sum, m) => sum + m.surveys, 0) /
                otherEmpresarialManagers.filter((m) => m.surveys > 0).length
            )
          : 0,
    },
  ];

  // Debug logging before render
  console.log('🎨 RENDER DEBUG:', {
    'managerData state': managerData,
    'allManagers length': allManagers.length,
    'allManagers sample': allManagers.slice(0, 2),
    'totalSurveys': totalSurveys,
    'totalManagers': totalManagers,
    'activeManagers': activeManagers
  });

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📊 Reporte de Participación de Ejecutivos
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Este reporte presenta un análisis detallado de la participación de los
          ejecutivos especificados en el archivo "ejecutivos para analizar.csv" 
          en las encuestas de satisfacción al cliente. Los datos incluyen el número 
          de encuestas realizadas, porcentaje de participación y tasas de cobertura 
          por cada ejecutivo, organizados por TIPO_EJECUTIVO, SEGMENTO, CIUDAD y AGENCIA.
          Solo se incluyen los ejecutivos que están listados en el archivo de análisis.
          <br />
          <br />
          <strong>Total de encuestas analizadas:</strong> {totalSurveys} |{" "}
          <strong>Ejecutivos monitoreados:</strong> {totalManagers} |{" "}
          <strong>Ejecutivos activos:</strong> {activeManagers}
        </p>
      </div>

      {/* Resumen ejecutivo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          📈 Resumen Ejecutivo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {totalSurveys.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Encuestas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {totalManagers}
            </div>
            <div className="text-sm text-gray-600">Ejecutivos Monitoreados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {activeManagers}
            </div>
            <div className="text-sm text-gray-600">Ejecutivos Activos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {activeManagers > 0 ? Math.round(totalSurveys / activeManagers) : 0}
            </div>
            <div className="text-sm text-gray-600">Promedio por Activo</div>
          </div>
        </div>
      </div>

      {/* Sección de Filtros y Análisis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          🔍 Análisis por Filtros
        </h2>
        
        {/* Selector de tipo de filtro */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar tipo de análisis:
          </label>
          <select
            value={selectedFilterType}
            onChange={(e) => setSelectedFilterType(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="tipoEjecutivo">Tipo Ejecutivo</option>
            <option value="segmento">Segmento</option>
            <option value="ciudad">Ciudad</option>
            <option value="agencia">Agencia</option>
          </select>
        </div>

        {/* Estadísticas por filtro */}
        {filterStats.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Estadísticas por {selectedFilterType === 'tipoEjecutivo' ? 'Tipo Ejecutivo' : 
                                   selectedFilterType === 'segmento' ? 'Segmento' :
                                   selectedFilterType === 'ciudad' ? 'Ciudad' : 'Agencia'}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold border-r border-green-500">
                      {selectedFilterType === 'tipoEjecutivo' ? 'Tipo Ejecutivo' : 
                       selectedFilterType === 'segmento' ? 'Segmento' :
                       selectedFilterType === 'ciudad' ? 'Ciudad' : 'Agencia'}
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-green-500">
                      Encuestas
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-green-500">
                      Promedio General
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-green-500">
                      Claridad
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-green-500">
                      Recomendación (NPS)
                    </th>
                    <th className="px-4 py-3 text-center font-semibold border-r border-green-500">
                      Satisfacción
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Lealtad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterStats.map((stat, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-green-50 transition-colors duration-200 border-b border-gray-200`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-800 border-r border-gray-200">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              stat.averageRating >= 4.5
                                ? "bg-green-500"
                                : stat.averageRating >= 3.5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="truncate max-w-xs" title={stat.filterValue}>
                            {stat.filterValue}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {stat.totalSurveys}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold border-r border-gray-200">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                            stat.averageRating >= 4.5
                              ? "bg-green-100 text-green-800"
                              : stat.averageRating >= 3.5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stat.averageRating}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {stat.claridadPromedio}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {stat.recomendacionPromedio}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {stat.satisfaccionPromedio}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-gray-700">
                          {stat.lealtadPromedio}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gráfico de barras para visualizar las métricas */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4">
                📈 Visualización de Métricas por {selectedFilterType === 'tipoEjecutivo' ? 'Tipo Ejecutivo' : 
                                                   selectedFilterType === 'segmento' ? 'Segmento' :
                                                   selectedFilterType === 'ciudad' ? 'Ciudad' : 'Agencia'}
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filterStats.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="filterValue" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis domain={[0, 5]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        typeof value === 'number' ? value.toFixed(2) : value,
                        name === 'averageRating' ? 'Promedio General' :
                        name === 'claridadPromedio' ? 'Claridad' :
                        name === 'recomendacionPromedio' ? 'Recomendación' :
                        name === 'satisfaccionPromedio' ? 'Satisfacción' :
                        name === 'lealtadPromedio' ? 'Lealtad' : name
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="averageRating" fill="#3B82F6" name="Promedio General" />
                    <Bar dataKey="claridadPromedio" fill="#10B981" name="Claridad" />
                    <Bar dataKey="recomendacionPromedio" fill="#F59E0B" name="Recomendación" />
                    <Bar dataKey="satisfaccionPromedio" fill="#EF4444" name="Satisfacción" />
                    <Bar dataKey="lealtadPromedio" fill="#8B5CF6" name="Lealtad" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          📋 Detalle de Participación
        </h2>
        
        {allManagers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No se encontraron datos de ejecutivos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="px-4 py-4 text-left font-semibold border-r border-blue-500">
                    Ejecutivo
                  </th>
                  <th className="px-4 py-4 text-center font-semibold border-r border-blue-500">
                    Encuestas
                  </th>
                  <th className="px-4 py-4 text-center font-semibold border-r border-blue-500">
                    % del Total
                  </th>
                  <th className="px-4 py-4 text-center font-semibold border-r border-blue-500">
                    Tipo Ejecutivo
                  </th>
                  <th className="px-4 py-4 text-center font-semibold border-r border-blue-500">
                    Segmento
                  </th>
                  <th className="px-4 py-4 text-center font-semibold border-r border-blue-500">
                    Ciudad
                  </th>
                  <th className="px-4 py-4 text-center font-semibold">
                    Agencia
                  </th>
                </tr>
              </thead>
              <tbody>
                {allManagers.map((manager, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200`}
                  >
                    <td className="px-4 py-4 font-medium text-gray-800 border-r border-gray-200">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 ${
                            manager.surveys > 50
                              ? "bg-green-500"
                              : manager.surveys > 0
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="truncate max-w-xs" title={manager.name}>
                          {manager.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          manager.surveys > 50
                            ? "bg-green-100 text-green-800"
                            : manager.surveys > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {manager.surveys}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-medium border-r border-gray-200">
                      {manager.percentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {manager.tipoEjecutivo || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {manager.segmento || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {manager.ciudad || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {manager.agencia}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerParticipationReport;