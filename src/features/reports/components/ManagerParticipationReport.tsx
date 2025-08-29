import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { satisfactionDataService } from '../../../services/dataService';
import ChartErrorBoundary from '../../../components/ChartErrorBoundary';
import ChartDebugger from '../../../components/ChartDebugger';

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
  csvInfo?: any;
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAgency, setSelectedAgency] = useState<string>("all");

  // Nuevos estados para los filtros
  const [selectedFilterType, setSelectedFilterType] =
    useState<string>("tipoEjecutivo");
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>("all");
  const [filterStats, setFilterStats] = useState<FilterStats[]>([]);
  
  // Estado para los managers filtrados en la tabla
  const [filteredManagers, setFilteredManagers] = useState<ManagerData[]>([]);
  
  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [managerData, setManagerData] = useState<{
    personasManagers: ManagerData[];
    bogotaManagers: ManagerData[];
    medellinManagers: ManagerData[];
    otherEmpresarialManagers: ManagerData[];
  }>({
    personasManagers: [],
    bogotaManagers: [],
    medellinManagers: [],
    otherEmpresarialManagers: [],
  });
  const [agencyData, setAgencyData] = useState<AgencyInfo[]>([]);
  // Estado para almacenar todos los ejecutivos únicos del CSV
  const [allExecutives, setAllExecutives] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🚀 ManagerParticipationReport: Loading data...");

        // Cargar solo el archivo datos.csv
        await satisfactionDataService.loadData();

        console.log(
          "✅ ManagerParticipationReport: Data loaded successfully"
        );

        // Obtener todos los ejecutivos únicos del CSV
        const data = satisfactionDataService.getData();
        const uniqueExecutives = [...new Set(data.map(record => record.EJECUTIVO_FINAL).filter(Boolean))];
        setAllExecutives(uniqueExecutives);

        console.log(
          "📋 Unique executives found:",
          uniqueExecutives.length,
          "executives"
        );
        console.log("📋 Sample executives:", uniqueExecutives.slice(0, 3));

        // Process manager data
        processManagerData();
      } catch (error) {
        console.error(
          "❌ ManagerParticipationReport: Error loading data:",
          error
        );
      }
    };

    loadData();
  }, []);

  // Monitor state changes
  useEffect(() => {
    console.log("📊 managerData state changed:", managerData);
    console.log(
      "📊 Current allManagers length:",
      [
        ...managerData.personasManagers,
        ...managerData.bogotaManagers,
        ...managerData.medellinManagers,
        ...managerData.otherEmpresarialManagers,
      ].length
    );
  }, [managerData]);

  useEffect(() => {
    console.log(
      "👥 allExecutives state changed:",
      allExecutives.length,
      "executives"
    );
  }, [allExecutives]);

  // Process data when service is loaded
  useEffect(() => {
    console.log("🔄 Checking if data processing should run...");
    console.log("🔍 satisfactionDataService.isDataLoaded():", satisfactionDataService.isDataLoaded());

    if (satisfactionDataService.isDataLoaded()) {
      console.log("✅ Data service loaded, calling processManagerData...");
      processManagerData();
    } else {
      console.log("⏳ Waiting for data to load...");
    }
  }, [allExecutives]); // Trigger when executives are loaded

  // Recalcular filterStats cuando cambie el tipo de filtro
  useEffect(() => {
    if (satisfactionDataService.isDataLoaded()) {
      console.log("🔄 Recalculating filterStats for selectedFilterType:", selectedFilterType);
      const allData = satisfactionDataService.getData();
      if (allData && allData.length > 0) {
        calculateFilterStats(allData);
      }
      // Reset selectedFilterValue cuando cambie el tipo de filtro
      setSelectedFilterValue("all");
    }
  }, [selectedFilterType]);

  // Aplicar filtros a la tabla cuando cambien los filtros
  useEffect(() => {
    if (satisfactionDataService.isDataLoaded()) {
      console.log("🔄 Applying filters to table:", { selectedFilterType, selectedFilterValue });
      applyFiltersToTable();
    }
  }, [selectedFilterType, selectedFilterValue, managerData]);

  // ... existing code ...

  const processManagerData = () => {
    console.log("🔄 processManagerData: Starting data processing...");

    const data = satisfactionDataService.getData();
    console.log("🔍 DEBUG: Total data records:", data?.length || 0);

    if (!data || data.length === 0) {
      console.log("❌ ManagerParticipationReport: No data available");
      return;
    }

    console.log("✅ Data service loaded, proceeding with processing...");

    // Usar todos los registros del CSV (no filtrar por archivo externo)
    const filteredRecords = data.filter((record) => {
      return record.EJECUTIVO_FINAL && record.EJECUTIVO_FINAL.trim() !== "";
    });

    console.log("📊 Records with valid executives:", filteredRecords.length);

    // ELIMINAR DUPLICADOS: Agrupar por EJECUTIVO_FINAL y tomar solo un registro por ejecutivo
    const uniqueExecutiveRecords = new Map();
    
    filteredRecords.forEach((record) => {
      const ejecutivoName = record.EJECUTIVO_FINAL;
      if (!uniqueExecutiveRecords.has(ejecutivoName)) {
        uniqueExecutiveRecords.set(ejecutivoName, []);
      }
      uniqueExecutiveRecords.get(ejecutivoName).push(record);
    });

    console.log("🔍 Unique executives found:", uniqueExecutiveRecords.size);

    // Crear datos de managers sin duplicados
    const managersArray = Array.from(uniqueExecutiveRecords.entries()).map(([managerName, records]) => {
      const firstRecord = records[0]; // Usar el primer registro como referencia
      const totalSurveys = records.length; // Contar todas las encuestas de este ejecutivo
      
      // Usar información directamente del CSV con validación mejorada
      let tipoEjecutivo = firstRecord["TIPO EJECUTIVO"] || "Sin Tipo";
      tipoEjecutivo = tipoEjecutivo.toUpperCase(); // Normalizar a mayúsculas

      const agencia = firstRecord.AGENCIA || "Sin Agencia";
      const segmento = firstRecord.SEGMENTO || "Sin Segmento";
      const ciudad = firstRecord.CIUDAD || "Sin Ciudad";

      // Determinar categoría con validación mejorada
      let category = "general";
      if (segmento.toLowerCase().includes("personas")) {
        category = "personas";
      } else if (segmento.toLowerCase().includes("empresarial")) {
        if (ciudad.toLowerCase().includes("bogotá") || ciudad.toLowerCase().includes("bogota")) {
          category = "empresarial-bogota";
        } else if (ciudad.toLowerCase().includes("medellín") || ciudad.toLowerCase().includes("medellin")) {
          category = "empresarial-medellin";
        } else {
          category = "empresarial-other";
        }
      }

      const totalRecords = filteredRecords.length;
      const percentage = totalRecords > 0 ? (totalSurveys / totalRecords) * 100 : 0;

      return {
        name: managerName,
        surveys: totalSurveys,
        percentage: parseFloat(percentage.toFixed(2)),
        coverageRate: 0,
        totalUniverse: totalSurveys,
        category: category,
        agencia: agencia,
        segmento: segmento,
        ciudad: ciudad,
        tipoEjecutivo: tipoEjecutivo,
        csvInfo: firstRecord,
      } as ManagerData;
    });

    console.log("📊 Processed managers (without duplicates):", managersArray.length);

    // Separar por categorías
    const personasManagers = managersArray.filter((m) => m.category === "personas");
    const bogotaManagers = managersArray.filter((m) => m.category === "empresarial-bogota");
    const medellinManagers = managersArray.filter((m) => m.category === "empresarial-medellin");
    const otherEmpresarialManagers = managersArray.filter((m) => m.category === "empresarial-other");

    // Crear información de agencias
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

    console.log("📊 ManagerParticipationReport: Processed data (duplicates removed):", {
      totalUniqueExecutives: managersArray.length,
      personas: personasManagers.length,
      bogota: bogotaManagers.length,
      medellin: medellinManagers.length,
      other: otherEmpresarialManagers.length,
      agencies: agencies.length,
    });

    // Calcular estadísticas por filtros usando TODOS los datos del CSV
    const allData = satisfactionDataService.getData();
    if (allData && allData.length > 0) {
      calculateFilterStats(allData);
    }
  };

  // Función mejorada para calcular estadísticas por filtros
  const calculateFilterStats = (data: any[]) => {
    console.log("🔍 calculateFilterStats: Starting calculation with", data.length, "records");

    if (!data || data.length === 0) {
      console.log("❌ calculateFilterStats: No data available");
      setFilterStats([]);
      return;
    }

    const stats: FilterStats[] = [];

    // Obtener valores únicos para el tipo de filtro seleccionado
    const uniqueValues = [...new Set(
      data.map((record) => {
        let value;
        switch (selectedFilterType) {
          case "tipoEjecutivo":
            value = record["TIPO EJECUTIVO"] || "Sin Tipo";
            // Normalizar a mayúsculas para consistencia
            return value.toUpperCase();
          case "segmento":
            return record.SEGMENTO || "Sin Segmento";
          case "ciudad":
            return record.CIUDAD || "Sin Ciudad";
          case "agencia":
            return record.AGENCIA || "Sin Agencia";
          default:
            return "Sin Clasificar";
        }
      }).filter(Boolean)
    )].filter(value => value && value.trim() !== "");

    console.log("🔍 calculateFilterStats: Unique values for", selectedFilterType, ":", uniqueValues);

    uniqueValues.forEach((value) => {
      // Filtrar datos para este valor específico
      const filteredData = data.filter((record) => {
        switch (selectedFilterType) {
          case "tipoEjecutivo":
            const tipoValue = (record["TIPO EJECUTIVO"] || "Sin Tipo").toUpperCase();
            return tipoValue === value;
          case "segmento":
            return (record.SEGMENTO || "Sin Segmento") === value;
          case "ciudad":
            return (record.CIUDAD || "Sin Ciudad") === value;
          case "agencia":
            return (record.AGENCIA || "Sin Agencia") === value;
          default:
            return false;
        }
      });

      if (filteredData.length > 0) {
        // Usar los nombres mapeados de las columnas (después del procesamiento del servicio)
        const claridadCol = "claridad_informacion";
        const recomendacionCol = "recomendacion";
        const satisfaccionCol = "satisfaccion_general";
        const lealtadCol = "lealtad";

        // Calcular promedios de las métricas con validación mejorada
        const claridadValues = filteredData.map((r) => parseFloat(r[claridadCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);
        const recomendacionValues = filteredData.map((r) => parseFloat(r[recomendacionCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);
        const satisfaccionValues = filteredData.map((r) => parseFloat(r[satisfaccionCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);
        const lealtadValues = filteredData.map((r) => parseFloat(r[lealtadCol])).filter((v) => !isNaN(v) && v >= 1 && v <= 5);

        const claridadPromedio = claridadValues.length > 0 ? claridadValues.reduce((a, b) => a + b, 0) / claridadValues.length : 0;
        const recomendacionPromedio = recomendacionValues.length > 0 ? recomendacionValues.reduce((a, b) => a + b, 0) / recomendacionValues.length : 0;
        const satisfaccionPromedio = satisfaccionValues.length > 0 ? satisfaccionValues.reduce((a, b) => a + b, 0) / satisfaccionValues.length : 0;
        const lealtadPromedio = lealtadValues.length > 0 ? lealtadValues.reduce((a, b) => a + b, 0) / lealtadValues.length : 0;

        // Promedio general de todas las métricas válidas
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

    // Ordenar por número de encuestas descendente
    const sortedStats = stats.sort((a, b) => b.totalSurveys - a.totalSurveys);
    console.log("✅ calculateFilterStats: Final calculated stats:", sortedStats);
    setFilterStats(sortedStats);
  };

  // Función para aplicar filtros a la tabla de participación
  const applyFiltersToTable = () => {
    const allManagers = [
      ...managerData.personasManagers,
      ...managerData.bogotaManagers,
      ...managerData.medellinManagers,
      ...managerData.otherEmpresarialManagers,
    ];

    console.log("🔍 applyFiltersToTable: Starting filter with", {
      selectedFilterType,
      selectedFilterValue,
      totalManagers: allManagers.length
    });

    if (selectedFilterValue === "all" || selectedFilterValue.trim() === "") {
      const sortedManagers = allManagers.sort((a, b) => {
        if (b.surveys !== a.surveys) {
          return b.surveys - a.surveys;
        }
        return a.name.localeCompare(b.name);
      });
      console.log("✅ applyFiltersToTable: No filter applied, returning all", sortedManagers.length, "managers");
      setFilteredManagers(sortedManagers);
      return;
    }

    const filtered = allManagers.filter((manager) => {
      let matches = false;
      
      switch (selectedFilterType) {
        case "tipoEjecutivo":
          // Normalizar ambos valores para comparación exacta
          const managerTipo = manager.tipoEjecutivo?.toUpperCase().trim() || "";
          const filterTipo = selectedFilterValue.toUpperCase().trim();
          matches = managerTipo === filterTipo;
          break;
        case "segmento":
          const managerSegmento = manager.segmento?.trim() || "";
          const filterSegmento = selectedFilterValue.trim();
          matches = managerSegmento === filterSegmento;
          break;
        case "ciudad":
          const managerCiudad = manager.ciudad?.trim() || "";
          const filterCiudad = selectedFilterValue.trim();
          matches = managerCiudad === filterCiudad;
          break;
        case "agencia":
          const managerAgencia = manager.agencia?.trim() || "";
          const filterAgencia = selectedFilterValue.trim();
          matches = managerAgencia === filterAgencia;
          break;
        default:
          matches = true;
      }
      
      return matches;
    }).sort((a, b) => {
      if (b.surveys !== a.surveys) {
        return b.surveys - a.surveys;
      }
      return a.name.localeCompare(b.name);
    });

    console.log("✅ applyFiltersToTable: Filter applied, found", filtered.length, "matching managers");
    setFilteredManagers(filtered);
  };

  // Efecto para aplicar filtros cuando cambian los valores
  useEffect(() => {
    applyFiltersToTable();
  }, [selectedFilterType, selectedFilterValue, managerData]);

  // Use real data from CSV processing
  const {
    personasManagers,
    bogotaManagers,
    medellinManagers,
    otherEmpresarialManagers,
  } = managerData;
  
  // Usar siempre los managers filtrados (que incluyen todos cuando no hay filtro)
  const allManagers = filteredManagers.length > 0 ? filteredManagers : [
    ...personasManagers,
    ...bogotaManagers,
    ...medellinManagers,
    ...otherEmpresarialManagers,
  ];

  // Aplicar búsqueda adicional si hay término de búsqueda
  const searchFilteredManagers = searchTerm.trim() === "" 
    ? allManagers 
    : allManagers.filter(manager => 
        manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.agencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.segmento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.tipoEjecutivo?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Aplicar paginación
  const totalItems = searchFilteredManagers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedManagers = searchFilteredManagers.slice(startIndex, endIndex);

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
  const activeManagers = allManagers.filter((m) => m.surveys > 0).length;

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
  console.log("🎨 RENDER DEBUG:", {
    "managerData state": managerData,
    "allManagers length": allManagers.length,
    "allManagers sample": allManagers.slice(0, 2),
    totalSurveys: totalSurveys,
    totalManagers: totalManagers,
    activeManagers: activeManagers,
  });

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📊 Reporte de Participación de Ejecutivos
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Este reporte presenta un análisis detallado de la participación de todos los
          ejecutivos registrados en el archivo "datos.csv" en las encuestas de satisfacción
          al cliente. Los datos incluyen el número de encuestas realizadas, porcentaje de
          participación y tasas de cobertura por cada ejecutivo, organizados por
          TIPO_EJECUTIVO, SEGMENTO, CIUDAD y AGENCIA. Se incluyen todos los ejecutivos
          que tienen al menos una encuesta registrada.
          <br />
          <br />
          <strong>Total de encuestas analizadas:</strong> {totalSurveys.toLocaleString()} |{" "}
          <strong>Ejecutivos encontrados:</strong> {totalManagers} |{" "}
          <strong>Ejecutivos activos:</strong> {activeManagers}
        </p>
      </div>

      {/* Layout Principal: Organización Vertical */}
      <div className="space-y-12">
        {/* Sección KPIs */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              📈 KPIs Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {totalSurveys.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Encuestas</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {totalManagers}
                </div>
                <div className="text-sm text-gray-600 font-medium">Ejecutivos Analizados</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {activeManagers}
                </div>
                <div className="text-sm text-gray-600 font-medium">Ejecutivos Activos</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {activeManagers > 0
                    ? Math.round(totalSurveys / activeManagers)
                    : 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Promedio por Activo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Gráficos */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              📊 Análisis Visual y Filtros
            </h2>

            {/* Selector de tipo de filtro */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar tipo de análisis:
              </label>
              <select
                aria-label="Seleccionar tipo de filtro"
                value={selectedFilterType}
                onChange={(e) => setSelectedFilterType(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out hover:border-blue-400 hover:shadow-md transform hover:scale-[1.02]"
              >
                <option value="tipoEjecutivo">Tipo Ejecutivo</option>
                <option value="segmento">Segmento</option>
                <option value="ciudad">Ciudad</option>
                <option value="agencia">Agencia</option>
              </select>
            </div>

        {/* Debug log para verificar filterStats antes del renderizado */}
        {console.log("🎨 RENDER: filterStats state:", {
          length: filterStats.length,
          selectedFilterType: selectedFilterType,
          data: filterStats.slice(0, 2)
        })}

        {/* Estadísticas por filtro */}
        {filterStats.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Estadísticas por{" "}
              {selectedFilterType === "tipoEjecutivo"
                ? "Tipo Ejecutivo"
                : selectedFilterType === "segmento"
                ? "Segmento"
                : selectedFilterType === "ciudad"
                ? "Ciudad"
                : "Agencia"}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold border-r border-green-500">
                      {selectedFilterType === "tipoEjecutivo"
                        ? "Tipo Ejecutivo"
                        : selectedFilterType === "segmento"
                        ? "Segmento"
                        : selectedFilterType === "ciudad"
                        ? "Ciudad"
                        : "Agencia"}
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
                          <span
                            className="truncate max-w-xs"
                            title={stat.filterValue}
                          >
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

            {/* Sección de Gráficos Mejorada */}
            <div className="mt-8 space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  📊 Análisis Visual de Métricas
                </h3>
                <p className="text-gray-600">
                  Visualización interactiva de datos por {selectedFilterType === "tipoEjecutivo" ? "Tipo Ejecutivo" : selectedFilterType === "segmento" ? "Segmento" : selectedFilterType === "ciudad" ? "Ciudad" : "Agencia"}
                </p>
              </div>

              {filterStats.length === 0 ? (
                <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">📊</div>
                    <p className="text-gray-500 font-medium text-lg">No hay datos disponibles para mostrar</p>
                    <p className="text-gray-400 text-sm mt-2">Selecciona un filtro diferente o verifica los datos</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Gráfico de Barras Principal - Ancho completo */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      📈 <span className="ml-2">Métricas de Satisfacción</span>
                    </h4>
                    <div style={{ height: 450 }}>
                      <ChartErrorBoundary componentName="Gráfico de Estadísticas por Filtro">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={filterStats.slice(0, 8)}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                            barCategoryGap="20%"
                            barGap={4}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                            <XAxis
                              dataKey="filterValue"
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              interval={0}
                              tick={{ fontSize: 11, fill: '#374151' }}
                              axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                              tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                            />
                            <YAxis 
                              domain={[0, 5]} 
                              tick={{ fontSize: 11, fill: '#374151' }}
                              axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                              tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                              label={{ value: 'Puntuación (1-5)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold', fill: '#374151' } }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                fontSize: '13px'
                              }}
                              labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}
                              formatter={(value, name) => [
                                typeof value === "number" ? value.toFixed(2) : value,
                                name === "averageRating" ? "🎯 Promedio General" :
                                name === "claridadPromedio" ? "💡 Claridad" :
                                name === "recomendacionPromedio" ? "👍 Recomendación" :
                                name === "satisfaccionPromedio" ? "😊 Satisfacción" :
                                name === "lealtadPromedio" ? "❤️ Lealtad" : name,
                              ]}
                            />
                            <Legend 
                              wrapperStyle={{ paddingTop: '15px' }}
                              iconType="rect"
                            />
                            <Bar
                              dataKey="claridadPromedio"
                              fill="#059669"
                              name="💡 Claridad"
                              radius={[3, 3, 0, 0]}
                            />
                            <Bar
                              dataKey="recomendacionPromedio"
                              fill="#DC2626"
                              name="👍 Recomendación"
                              radius={[3, 3, 0, 0]}
                            />
                            <Bar
                              dataKey="satisfaccionPromedio"
                              fill="#7C3AED"
                              name="😊 Satisfacción"
                              radius={[3, 3, 0, 0]}
                            />
                            <Bar
                              dataKey="lealtadPromedio"
                              fill="#EA580C"
                              name="❤️ Lealtad"
                              radius={[3, 3, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  {/* Gráfico Circular de Distribución - Ancho completo */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      🥧 <span className="ml-2">Distribución de Encuestas</span>
                    </h4>
                    <div style={{ height: 450 }}>
                      <ChartErrorBoundary componentName="Gráfico Circular de Distribución">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={filterStats.slice(0, 6).map((stat, index) => ({
                                name: stat.filterValue,
                                value: stat.totalSurveys,
                                fill: [
                                  '#3B82F6', '#10B981', '#F59E0B', 
                                  '#EF4444', '#8B5CF6', '#06B6D4'
                                ][index % 6]
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                            >
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                              }}
                              formatter={(value) => [`${value} encuestas`, 'Total']}
                            />
                            <Legend 
                              wrapperStyle={{ paddingTop: '20px' }}
                              iconType="circle"
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartErrorBoundary>
                    </div>
                  </div>

                  {/* Gráfico de Comparación de Rendimiento - Ancho completo */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      🎯 <span className="ml-2">Comparación de Rendimiento General</span>
                    </h4>
                    <div style={{ height: 450 }}>
                      <ChartErrorBoundary componentName="Gráfico de Comparación">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={filterStats.slice(0, 10)}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            barCategoryGap="15%"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                            <XAxis
                              dataKey="filterValue"
                              angle={-30}
                              textAnchor="end"
                              height={60}
                              interval={0}
                              tick={{ fontSize: 11, fill: '#374151' }}
                            />
                            <YAxis 
                              domain={[0, 5]} 
                              tick={{ fontSize: 11, fill: '#374151' }}
                              label={{ value: 'Puntuación Promedio', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold', fill: '#374151' } }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                              }}
                              formatter={(value) => [typeof value === "number" ? value.toFixed(2) : value, "🎯 Promedio General"]}
                            />
                            <Bar
                              dataKey="averageRating"
                              fill="url(#colorGradient)"
                              radius={[4, 4, 0, 0]}
                            />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.7}/>
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartErrorBoundary>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              🔍 Depuración: No hay estadísticas disponibles
            </h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p><strong>Tipo de filtro seleccionado:</strong> {selectedFilterType}</p>
              <p><strong>Datos cargados:</strong> {satisfactionDataService.isDataLoaded() ? 'Sí' : 'No'}</p>
              <p><strong>Longitud de filterStats:</strong> {filterStats.length}</p>
              <p><strong>Estado de carga:</strong> {satisfactionDataService.isDataLoaded() ? 'Datos CSV cargados correctamente' : 'Esperando carga de datos'}</p>
            </div>
          </div>
        )}
          </div>
        </div>

        {/* Sección de Tabla de Ejecutivos */}
        <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          📋 Detalle de Participación
        </h2>

        {/* Filtros para la tabla */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Filtrar por:
            </label>
            <select
              value={selectedFilterType}
              onChange={(e) => setSelectedFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:border-blue-400 hover:shadow-md transform hover:scale-[1.02]"
            >
              <option value="tipoEjecutivo">Tipo Ejecutivo</option>
              <option value="segmento">Segmento</option>
              <option value="ciudad">Ciudad</option>
              <option value="agencia">Agencia</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Valor:
            </label>
            <select
              value={selectedFilterValue}
              onChange={(e) => setSelectedFilterValue(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:border-blue-400 hover:shadow-md transform hover:scale-[1.02]"
            >
              <option value="all">Todos</option>
              {filterStats.map((stat) => (
                <option key={stat.filterValue} value={stat.filterValue}>
                  {stat.filterValue} ({stat.totalSurveys} encuestas)
                </option>
              ))}
            </select>
          </div>
          
          {selectedFilterValue !== "all" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Resultados:
              </label>
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 transition-all duration-300 ease-in-out hover:bg-blue-100 hover:border-blue-300 animate-pulse">
                {allManagers.length} ejecutivos encontrados
              </div>
            </div>
          )}
        </div>

        {/* Barra de búsqueda y controles */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar ejecutivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 rounded-full p-1"
                >
                  ✕
                </button>
              )}
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:border-blue-400 hover:shadow-md transform hover:scale-[1.02]"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
            📊 Total: {searchFilteredManagers.length} ejecutivos
            {searchTerm && (
              <span className="ml-2 text-blue-600">
                (filtrados de {allManagers.length})
              </span>
            )}
          </div>
        </div>

        {searchFilteredManagers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              {searchTerm ? "No se encontraron ejecutivos que coincidan con la búsqueda" : "No se encontraron datos de ejecutivos"}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Verifica los filtros aplicados o la carga de datos"}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-3 py-3 text-left font-semibold text-sm border-r border-blue-500">
                        👤 Ejecutivo
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-sm border-r border-blue-500">
                        📊 Encuestas
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-sm border-r border-blue-500">
                        📈 % Total
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-sm border-r border-blue-500">
                        🏷️ Tipo
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-sm border-r border-blue-500">
                        🎯 Segmento
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-sm border-r border-blue-500">
                        🌍 Ciudad
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-sm">
                        🏢 Agencia
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedManagers.map((manager, index) => {
                      const globalIndex = startIndex + index;
                      return (
                          <tr
                            key={globalIndex}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-blue-50 transition-all duration-300 border-b border-gray-100 group transform hover:scale-[1.01] hover:shadow-sm animate-fade-in-up`}
                            style={{
                              animationDelay: `${index * 50}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <td className="px-3 py-2 font-medium text-gray-800 border-r border-gray-100">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1">
                                    <div
                                      className={`w-3 h-3 rounded-full border-2 ${
                                        manager.surveys > 50
                                          ? "bg-green-600 border-green-700"
                                          : manager.surveys > 20
                                          ? "bg-amber-500 border-amber-600"
                                          : manager.surveys > 0
                                          ? "bg-orange-600 border-orange-700"
                                          : "bg-red-600 border-red-700"
                                      }`}
                                    ></div>
                                    <span className="text-sm font-medium">
                                      {manager.surveys > 50 ? "⭐" : manager.surveys > 20 ? "⚡" : manager.surveys > 0 ? "⚠️" : "❌"}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className="truncate max-w-xs text-sm group-hover:text-blue-700 transition-colors"
                                  title={manager.name}
                                >
                                  {manager.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center border-r border-gray-100">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                  manager.surveys > 50
                                    ? "bg-green-50 text-green-900 border-2 border-green-300 ring-1 ring-green-200"
                                    : manager.surveys > 20
                                    ? "bg-amber-50 text-amber-900 border-2 border-amber-300 ring-1 ring-amber-200"
                                    : manager.surveys > 0
                                    ? "bg-orange-50 text-orange-900 border-2 border-orange-300 ring-1 ring-orange-200"
                                    : "bg-red-50 text-red-900 border-2 border-red-300 ring-1 ring-red-200"
                                }`}
                              >
                                <span className="mr-1">
                                  {manager.surveys > 50 ? "📈" : manager.surveys > 20 ? "📊" : manager.surveys > 0 ? "📉" : "📋"}
                                </span>
                                {manager.surveys}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center font-semibold text-sm border-r border-gray-100 text-gray-700">
                              {manager.percentage.toFixed(1)}%
                            </td>
                            <td className="px-3 py-2 text-center border-r border-gray-100">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-900 border-2 border-purple-300 ring-1 ring-purple-200 shadow-sm">
                                <span className="mr-1.5">👔</span>
                                {manager.tipoEjecutivo || "N/A"}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center border-r border-gray-100">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border-2 border-emerald-300 ring-1 ring-emerald-200 shadow-sm">
                                <span className="mr-1.5">🎯</span>
                                {manager.segmento || "N/A"}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center border-r border-gray-100">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-900 border-2 border-blue-300 ring-1 ring-blue-200 shadow-sm">
                                <span className="mr-1.5">🌍</span>
                                {manager.ciudad || "N/A"}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-900 border-2 border-indigo-300 ring-1 ring-indigo-200 shadow-sm">
                                <span className="mr-1.5">🏢</span>
                                {manager.agencia || "N/A"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredManagers.length)} de {filteredManagers.length} ejecutivos
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      ← Anterior
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
      
      {/* Temporary Debug Component */}
      <ChartDebugger />
    </div>
  );
};

export default ManagerParticipationReport;
