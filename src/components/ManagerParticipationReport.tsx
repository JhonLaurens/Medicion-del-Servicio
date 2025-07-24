import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SatisfactionDataService } from '../services/dataService';

interface ManagerData {
  name: string;
  surveys: number;
  percentage: number;
  coverageRate: number;
  totalUniverse: number;
  category: string;
}

const ManagerParticipationReport: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const dataService = new SatisfactionDataService();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 ManagerParticipationReport: Loading data...');
        await dataService.loadData();
        console.log('✅ ManagerParticipationReport: Data loaded successfully');
        
        // Process manager data with exact table values
        processManagerData();
      } catch (error) {
        console.error('❌ ManagerParticipationReport: Error loading data:', error);
      }
    };

    loadData();
  }, []);
  
  const processManagerData = () => {
    // Create exact data as per the provided tables
    
    // SEGMENTO PERSONAS - Gerentes de Agencia (1,432 encuestas)
    const personasManagers: ManagerData[] = [
      { name: "Ejecutivos - Freelancer", surveys: 390, percentage: 27.23, coverageRate: 5.85, totalUniverse: 6670, category: "personas" },
      { name: "Gloria Ester Borre Garcia", surveys: 117, percentage: 8.17, coverageRate: 5.00, totalUniverse: 2341, category: "personas" },
      { name: "Sonia Marleny Gomez Cadavid", surveys: 106, percentage: 7.40, coverageRate: 5.26, totalUniverse: 2014, category: "personas" },
      { name: "Ivonne Andrea Echavarria Mora", surveys: 98, percentage: 6.84, coverageRate: 7.45, totalUniverse: 1315, category: "personas" },
      { name: "Leidy Paola Bello", surveys: 92, percentage: 6.42, coverageRate: 7.47, totalUniverse: 1232, category: "personas" },
      { name: "Jose Francisco Guzman Valderrama", surveys: 70, percentage: 4.89, coverageRate: 8.13, totalUniverse: 861, category: "personas" },
      { name: "Lizeth Vanesa Giraldo Giraldo", surveys: 69, percentage: 4.82, coverageRate: 7.22, totalUniverse: 956, category: "personas" },
      { name: "Yeimy Paola Suarez Cortez", surveys: 66, percentage: 4.61, coverageRate: 8.52, totalUniverse: 775, category: "personas" },
      { name: "Sandra Luz Lopez Ospina", surveys: 65, percentage: 4.54, coverageRate: 8.13, totalUniverse: 800, category: "personas" },
      { name: "Gladys Yanira Aguilar Munoz", surveys: 61, percentage: 4.26, coverageRate: 4.09, totalUniverse: 1491, category: "personas" },
      { name: "Rosa Elena Soto Gomez", surveys: 58, percentage: 4.05, coverageRate: 5.12, totalUniverse: 1133, category: "personas" },
      { name: "Marta Janeth Rueda Jimenez", surveys: 44, percentage: 3.07, coverageRate: 4.36, totalUniverse: 1009, category: "personas" },
      { name: "Elizabeth Saavedra Salazar", surveys: 37, percentage: 2.58, coverageRate: 6.43, totalUniverse: 575, category: "personas" },
      { name: "Luz Adriana Giraldo Giraldo", surveys: 29, percentage: 2.03, coverageRate: 8.58, totalUniverse: 338, category: "personas" },
      { name: "Viviana Arcila Mateus", surveys: 28, percentage: 1.96, coverageRate: 6.98, totalUniverse: 401, category: "personas" },
      { name: "Isabel Cristina Bayter Cañarete", surveys: 28, percentage: 1.96, coverageRate: 4.54, totalUniverse: 617, category: "personas" },
      { name: "Maria Patricia De Vivero Vergara", surveys: 26, percentage: 1.82, coverageRate: 6.15, totalUniverse: 423, category: "personas" },
      { name: "Laura Lopez Restrepo", surveys: 25, percentage: 1.75, coverageRate: 5.69, totalUniverse: 439, category: "personas" },
      { name: "Fabiola Del Carmen Rhenals Castillo", surveys: 23, percentage: 1.61, coverageRate: 6.01, totalUniverse: 383, category: "personas" }
    ];

    // SEGMENTO EMPRESARIAL - Gerentes de cuenta Bogotá (2 encuestas)
    const bogotaManagers: ManagerData[] = [
      { name: "Lady Dayana Zarate Lopez", surveys: 1, percentage: 50.0, coverageRate: 20.00, totalUniverse: 5, category: "empresarial-bogota" },
      { name: "Monica Chaves Arturo", surveys: 1, percentage: 50.0, coverageRate: 33.33, totalUniverse: 3, category: "empresarial-bogota" },
      { name: "Nury Marcela Muete Camacho", surveys: 0, percentage: 0.0, coverageRate: 0.00, totalUniverse: 2, category: "empresarial-bogota" },
      { name: "Nathalia Andrea Prieto Rincon", surveys: 0, percentage: 0.0, coverageRate: 0.00, totalUniverse: 14, category: "empresarial-bogota" }
    ];

    // SEGMENTO EMPRESARIAL - Gerentes de cuenta Medellín (3 encuestas)
    const medellinManagers: ManagerData[] = [
      { name: "Maria Isabel Moreno Sanchez", surveys: 3, percentage: 100.0, coverageRate: 27.27, totalUniverse: 11, category: "empresarial-medellin" },
      { name: "Katherine Parra Barrientos", surveys: 0, percentage: 0.0, coverageRate: 0.00, totalUniverse: 6, category: "empresarial-medellin" },
      { name: "Cristina Velez Cardona", surveys: 0, percentage: 0.0, coverageRate: 0.00, totalUniverse: 19, category: "empresarial-medellin" }
    ];

    // SEGMENTO EMPRESARIAL - Otras Gerencias (8 encuestas)
    const otherEmpresarialManagers: ManagerData[] = [
      { name: "Ejecutivos - Freelancer", surveys: 4, percentage: 50.0, coverageRate: 6.90, totalUniverse: 58, category: "empresarial-other" },
      { name: "Gerente De Cuenta Bucaramanga", surveys: 4, percentage: 50.0, coverageRate: 2.31, totalUniverse: 173, category: "empresarial-other" },
      { name: "Beatriz Eugenia Robles Garcia", surveys: 0, percentage: 0.0, coverageRate: 0.00, totalUniverse: 3, category: "empresarial-other" }
    ];

    setManagerData({
      personasManagers,
      bogotaManagers,
      medellinManagers,
      otherEmpresarialManagers
    });

    console.log('📊 ManagerParticipationReport: Updated with exact table data:', {
      personas: personasManagers.length,
      bogota: bogotaManagers.length,
      medellin: medellinManagers.length,
      other: otherEmpresarialManagers.length
    });
  };

  // Use real data from CSV processing
  const { personasManagers, bogotaManagers, medellinManagers, otherEmpresarialManagers } = managerData;
  const allManagers = [...personasManagers, ...bogotaManagers, ...medellinManagers, ...otherEmpresarialManagers];

  const getFilteredData = () => {
    switch (selectedCategory) {
      case 'personas': return personasManagers;
      case 'bogota': return bogotaManagers;
      case 'medellin': return medellinManagers;
      case 'other': return otherEmpresarialManagers;
      default: return allManagers;
    }
  };

  const totalSurveys = 1445; // Total real validado (1,432 PERSONAS + 13 EMPRESARIAL)
  const totalManagers = 29; // Total de gerentes/categorías únicas validadas
  const activeManagers = 24; // Gerentes que tienen al menos 1 encuesta

  // Top 10 gerentes por número de encuestas (con datos reales)
  const topManagers = allManagers
    .filter(manager => manager.surveys > 0)
    .sort((a, b) => b.surveys - a.surveys)
    .slice(0, 10);

  // Preparar datos para visualización por segmentos
  const categoryData = [
    { 
      name: 'PERSONAS', 
      surveys: 1432,
      managers: 19,
      activeManagers: 19,
      averageSurveys: Math.round(1432 / 19)
    },
    { 
      name: 'EMPRESARIAL - Bogotá', 
      surveys: 2,
      managers: 4,
      activeManagers: 2,
      averageSurveys: Math.round(2 / 2)
    },
    { 
      name: 'EMPRESARIAL - Medellín', 
      surveys: 3,
      managers: 3,
      activeManagers: 1,
      averageSurveys: Math.round(3 / 1)
    },
    { 
      name: 'EMPRESARIAL - Otras', 
      surveys: 8,
      managers: 3,
      activeManagers: 2,
      averageSurveys: Math.round(8 / 2)
    }
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📊 Reporte de Participación de Gerentes
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Este reporte presenta un análisis detallado de la participación de los gerentes en las encuestas de satisfacción al cliente. 
          Los datos incluyen el número de encuestas realizadas, porcentaje de participación y tasas de cobertura por cada gerente, 
          organizados por segmentos: PERSONAS (1,432 encuestas) y EMPRESARIAL (13 encuestas distribuidas en Bogotá, Medellín y otras gerencias).
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtrar por Segmento</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'all', label: 'Todos los Gerentes', count: allManagers.length },
            { key: 'personas', label: 'PERSONAS (1,432)', count: personasManagers.length },
            { key: 'bogota', label: 'EMPRESARIAL - Bogotá (2)', count: bogotaManagers.length },
            { key: 'medellin', label: 'EMPRESARIAL - Medellín (3)', count: medellinManagers.length },
            { key: 'other', label: 'EMPRESARIAL - Otras (8)', count: otherEmpresarialManagers.length }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">📈 Resumen Ejecutivo</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalSurveys.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Encuestas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{totalManagers}</div>
            <div className="text-sm text-gray-600">Gerentes Monitoreados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{activeManagers}</div>
            <div className="text-sm text-gray-600">Gerentes Activos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{Math.round(totalSurveys / activeManagers)}</div>
            <div className="text-sm text-gray-600">Promedio por Activo</div>
          </div>
        </div>
      </div>

      {/* Análisis por categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Análisis por Segmento</h2>
          <div className="space-y-4">
            {categoryData.map((category) => {
              const percentage = (category.surveys / totalSurveys) * 100;
              const participationRate = (category.activeManagers / category.managers) * 100;
              
              return (
                <div key={category.name} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <span className="text-2xl font-bold text-blue-600">
                      {category.surveys}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <div className="font-medium">{percentage.toFixed(1)}%</div>
                      <div className="text-xs">del total</div>
                    </div>
                    <div>
                      <div className="font-medium">{category.activeManagers}/{category.managers}</div>
                      <div className="text-xs">activos</div>
                    </div>
                    <div>
                      <div className="font-medium">{participationRate.toFixed(0)}%</div>
                      <div className="text-xs">participación</div>
                    </div>
                  </div>                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500 bg-blue-600"
                      style={{ width: `${Math.max(percentage, 1)}%` } as React.CSSProperties}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>⚠️ Crisis EMPRESARIAL:</strong> El segmento EMPRESARIAL concentra apenas 0.9% de las encuestas (13 de 1,445), 
              mientras que PERSONAS domina con 99.1% (1,432 encuestas). Ejecutivos - Freelancer muestra el mayor contraste: 
              390 PERSONAS vs 4 EMPRESARIAL (98.98% de concentración en PERSONAS).
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top 10 Gerentes por Encuestas</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topManagers} layout="horizontal" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value: any) => [value, 'Encuestas']}
                labelFormatter={(label: string) => `Gerente: ${label}`}
              />
              <Bar dataKey="surveys" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Detalle de Participación - {selectedCategory === 'all' ? 'Todos los Gerentes' : 
            selectedCategory === 'personas' ? 'Segmento PERSONAS' :
            selectedCategory === 'bogota' ? 'EMPRESARIAL - Bogotá' :
            selectedCategory === 'medellin' ? 'EMPRESARIAL - Medellín' : 
            'EMPRESARIAL - Otras Gerencias'}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-3 text-left">Gerente</th>
                <th className="px-4 py-3 text-center">Encuestas</th>
                <th className="px-4 py-3 text-center">% del Total</th>
                <th className="px-4 py-3 text-center">Tasa de Cobertura</th>
                <th className="px-4 py-3 text-center">Universo Depurado</th>
                <th className="px-4 py-3 text-center">Efectividad</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredData().map((manager, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{manager.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded ${manager.surveys > 50 ? 'bg-green-100 text-green-800' : 
                      manager.surveys > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {manager.surveys}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{manager.percentage.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded ${manager.coverageRate > 70 ? 'bg-green-100 text-green-800' : 
                      manager.coverageRate > 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {manager.coverageRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{manager.totalUniverse.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    {manager.surveys > 50 && manager.coverageRate > 60 ? '🟢 Alta' :
                     manager.surveys > 10 && manager.coverageRate > 25 ? '🟡 Media' : '🔴 Baja'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights y recomendaciones */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Insights y Recomendaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Hallazgos Principales</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Segmento PERSONAS domina con 1,432 encuestas (99.1% del total)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Gloria Ester Borre Garcia lidera individualmente (117 encuestas, 8.17%)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">ℹ</span>
                Ejecutivos - Freelancer: 390 PERSONAS vs 4 EMPRESARIAL (98.98% concentración)
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">🚨</span>
                Segmento EMPRESARIAL crítico: solo 13 encuestas totales (0.9%)
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                82.8% de gerentes activos (24 de 29 tienen encuestas)
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">Recomendaciones Urgentes</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">🚨</span>
                <strong>CRÍTICO:</strong> Diseñar estrategia específica para segmento EMPRESARIAL (solo 13 encuestas)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📋</span>
                Activar gerentes inactivos: 5 gerentes sin encuestas en EMPRESARIAL
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📊</span>
                Mantener momentum en PERSONAS (75.37 encuestas promedio por gerente activo)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">🎯</span>
                Meta mínima EMPRESARIAL: incrementar de 13 a 65 encuestas (500% aumento)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">📈</span>
                Implementar incentivos diferenciados para gerentes EMPRESARIAL
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerParticipationReport;
