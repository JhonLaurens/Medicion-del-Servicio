import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { RootState } from '../store';
import { KPIData, Stats } from '../types';

type StackedData = { name: string } & Stats;

const GeneralDashboard: React.FC = () => {
  const { kpiData, records } = useSelector((state: RootState) => state.data);

  const colors = {
    rating5: '#1e40af', // Blue
    rating4: '#fbbf24', // Yellow
    rating123: '#9ca3af', // Gray
  };

  const prepareStackedData = React.useCallback((kpi: KPIData): StackedData[] => {
    return [
      { name: 'Consolidado', ...kpi.consolidado },
      { name: 'Personas', ...kpi.personas },
      { name: 'Empresas', ...kpi.empresarial },
    ];
  }, []);

  const CustomTooltip = React.memo(({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as StackedData;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <p className="text-lg font-bold text-blue-600 mb-2">
            Promedio: {data.average.toFixed(2)}
          </p>
          <div className="space-y-1 text-sm">
            <p className="flex items-center">
              <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Calificación 5: {data.rating5.toFixed(1)}%
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
              Calificación 4: {data.rating4.toFixed(1)}%
            </p>
            <p className="flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              Calificación 1-3: {data.rating123.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  });

  const renderCustomizedLabel = (props: any): React.ReactElement | null => {
    const { x, y, width, payload } = props;
    if (!payload || typeof payload.average !== 'number') return null;
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        textAnchor="middle"
        fill="#374151"
        className="text-sm font-semibold"
      >
        {payload.average.toFixed(2)}
      </text>
    );
  };

  const evolutionData = React.useMemo(() => [
    { year: '2023', total: 4.35, personas: 4.38, empresas: 4.28 },
    {
      year: '2024',
      total: kpiData.length > 0 ? kpiData[0].consolidado.average : 0,
      personas: kpiData.length > 0 ? kpiData[0].personas.average : 0,
      empresas: kpiData.length > 0 ? kpiData[0].empresarial.average : 0,
    },
  ], [kpiData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Indicadores Clave de Servicio 2024</h1>
          <p className="text-gray-600">Vista consolidada de los KPIs más importantes basada en {records.length} encuestas</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} title={kpi.metric} className="transition-transform transform hover:-translate-y-1 hover:shadow-xl">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Consolidado</p>
                  <p className="text-2xl font-bold text-blue-600">{kpi.consolidado.average.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Personas</p>
                  <p className="text-2xl font-bold text-green-600">{kpi.personas.average.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Empresas</p>
                  <p className="text-2xl font-bold text-purple-600">{kpi.empresarial.average.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-1 gap-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">{kpi.metric} - Distribución por Calificación</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareStackedData(kpi)} margin={{ top: 40, right: 30, left: 20, bottom: 5 }} aria-label={`Gráfico de ${kpi.metric}`}>
                    <title>Gráfico de {kpi.metric}</title>
                    <desc>Gráfico de barras que muestra la distribución de calificaciones para {kpi.metric}.</desc>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rating123" stackId="a" fill={colors.rating123} name="Calificación 1-3" aria-label="Calificación de 1 a 3" />
                    <Bar dataKey="rating4" stackId="a" fill={colors.rating4} name="Calificación 4" aria-label="Calificación de 4" />
                    <Bar
                      dataKey="rating5"
                      stackId="a"
                      fill={colors.rating5}
                      name="Calificación 5"
                      label={renderCustomizedLabel}
                      aria-label="Calificación de 5"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Muy Satisfecho/Muy Probable (5)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Satisfecho/Probable (4)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Neutral/Insatisfecho (1-3)</span>
                </div>
              </div>
            </div>
          ))}

          <Card title="Evolución del Indicador General de Servicio">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value.toFixed(2),
                      name === 'total' ? 'Total Coltefinanciera' : name === 'personas' ? 'Personas' : 'Empresas',
                    ]}
                  />
                  <Bar dataKey="total" fill="#1e40af" name="total" />
                  <Bar dataKey="personas" fill="#059669" name="personas" />
                  <Bar dataKey="empresas" fill="#7c3aed" name="empresas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
