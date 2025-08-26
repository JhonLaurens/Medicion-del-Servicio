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
      
      // Usar información directamente del CSV
      let tipoEjecutivo = firstRecord["TIPO EJECUTIVO"] || "Sin Tipo";
      tipoEjecutivo = tipoEjecutivo.toUpperCase(); // Normalizar a mayúsculas

      const agencia = firstRecord.AGENCIA || "Sin Agencia";
      const segmento = firstRecord.SEGMENTO || "Sin Segmento";
      const ciudad = firstRecord.CIUDAD || "Sin Ciudad";

      // Determinar categoría
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
    )];

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
        // Usar los nombres exactos de las columnas del CSV
        const claridadCol = "En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?";
        const recomendacionCol = "¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?";
        const satisfaccionCol = "En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?";
        const lealtadCol = "Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?";

        // Calcular promedios de las métricas
        const claridadValues = filteredData.map((r) => parseFloat(r[claridadCol])).filter((v) => !isNaN(v) && v > 0);
        const recomendacionValues = filteredData.map((r) => parseFloat(r[recomendacionCol])).filter((v) => !isNaN(v) && v > 0);
        const satisfaccionValues = filteredData.map((r) => parseFloat(r[satisfaccionCol])).filter((v) => !isNaN(v) && v > 0);
        const lealtadValues = filteredData.map((r) => parseFloat(r[lealtadCol])).filter((v) => !isNaN(v) && v > 0);

        const claridadPromedio = claridadValues.length > 0 ? claridadValues.reduce((a, b) => a + b, 0) / claridadValues.length : 0;
        const recomendacionPromedio = recomendacionValues.length > 0 ? recomendacionValues.reduce((a, b) => a + b, 0) / recomendacionValues.length : 0;
        const satisfaccionPromedio = satisfaccionValues.length > 0 ? satisfaccionValues.reduce((a, b) => a + b, 0) / satisfaccionValues.length : 0;
        const lealtadPromedio = lealtadValues.length > 0 ? lealtadValues.reduce((a, b) => a + b, 0) / lealtadValues.length : 0;

        // Promedio general de todas las métricas válidas
        const allValues = [...claridadValues, ...recomendacionValues, ...satisfaccionValues, ...lealtadValues];
        const averageRating = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;

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

    if (selectedFilterValue === "all") {
      setFilteredManagers(allManagers);
      return;
    }

    const filtered = allManagers.filter((manager) => {
      switch (selectedFilterType) {
        case "tipoEjecutivo":
          return manager.tipoEjecutivo?.toUpperCase() === selectedFilterValue.toUpperCase();
        case "segmento":
          return manager.segmento === selectedFilterValue;
        case "ciudad":
          return manager.ciudad === selectedFilterValue;
        case "agencia":
          return manager.agencia === selectedFilterValue;
        default:
          return true;
      }
    });

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
  
  // Usar managers filtrados si hay filtros aplicados, sino usar todos
  const allManagers = filteredManagers.length > 0 ? filteredManagers : [
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
            <div className="text-sm text-gray-600">Ejecutivos Analizados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {activeManagers}
            </div>
            <div className="text-sm text-gray-600">Ejecutivos Activos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {activeManagers > 0
                ? Math.round(totalSurveys / activeManagers)
                : 0}
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
            aria-label="Seleccionar tipo de filtro"
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

            {/* Gráfico de barras para visualizar las métricas */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4">
                📈 Visualización de Métricas por{" "}
                {selectedFilterType === "tipoEjecutivo"
                  ? "Tipo Ejecutivo"
                  : selectedFilterType === "segmento"
                  ? "Segmento"
                  : selectedFilterType === "ciudad"
                  ? "Ciudad"
                  : "Agencia"}
              </h4>
              {filterStats.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-500 font-medium">No hay datos disponibles para mostrar</p>
                    <p className="text-gray-400 text-sm mt-1">Selecciona un filtro diferente o verifica los datos</p>
                  </div>
                </div>
              ) : (
                <div style={{ height: Math.max(400, filterStats.slice(0, 10).length * 40 + 150) }}>
                  <ChartErrorBoundary componentName="Gráfico de Estadísticas por Filtro">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filterStats.slice(0, 10)}
                        margin={{ top: 30, right: 40, left: 40, bottom: 100 }}
                        barCategoryGap="15%"
                        barGap={2}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.7} />
                        <XAxis
                          dataKey="filterValue"
                          angle={-45}
                          textAnchor="end"
                          height={90}
                          interval={0}
                          tick={{ fontSize: 12, fill: '#374151' }}
                          axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                          tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                          label={{ value: selectedFilterType === "tipoEjecutivo" ? "Tipo Ejecutivo" : selectedFilterType === "segmento" ? "Segmento" : selectedFilterType === "ciudad" ? "Ciudad" : "Agencia", position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold', fill: '#374151' } }}
                        />
                        <YAxis 
                          domain={[0, 5]} 
                          tick={{ fontSize: 12, fill: '#374151' }}
                          axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                          tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                          label={{ value: 'Puntuación (1-5)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold', fill: '#374151' } }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'
                          }}
                          labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}
                          formatter={(value, name) => [
                            typeof value === "number" ? value.toFixed(2) : value,
                            name === "averageRating"
                              ? "Promedio General"
                              : name === "claridadPromedio"
                              ? "Claridad"
                              : name === "recomendacionPromedio"
                              ? "Recomendación"
                              : name === "satisfaccionPromedio"
                              ? "Satisfacción"
                              : name === "lealtadPromedio"
                              ? "Lealtad"
                              : name,
                          ]}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="rect"
                        />
                        <Bar
                          dataKey="averageRating"
                          fill="#3B82F6"
                          name="Promedio General"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="claridadPromedio"
                          fill="#10B981"
                          name="Claridad"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="recomendacionPromedio"
                          fill="#F59E0B"
                          name="Recomendación"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="satisfaccionPromedio"
                          fill="#EF4444"
                          name="Satisfacción"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="lealtadPromedio"
                          fill="#8B5CF6"
                          name="Lealtad"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartErrorBoundary>
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

      {/* Tabla detallada */}
      <div className="bg-white rounded-lg shadow-lg p-6">
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
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                {allManagers.length} ejecutivos encontrados
              </div>
            </div>
          )}
        </div>

        {allManagers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No se encontraron datos de ejecutivos
            </p>
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
                        <span
                          className="truncate max-w-xs"
                          title={manager.name}
                        >
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
                        {manager.tipoEjecutivo || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {manager.segmento || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {manager.ciudad || "N/A"}
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
