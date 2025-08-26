// Script de depuración para verificar datos históricos
import Papa from 'papaparse';
import fs from 'fs';

// Leer el archivo CSV
const csvContent = fs.readFileSync('./public/datos.csv', 'utf-8');

// Parsear el CSV
const parsed = Papa.parse(csvContent, {
  header: true,
  delimiter: ';',
  skipEmptyLines: true,
  transformHeader: (header) => {
    const headerMapping = {
      'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?': 'claridad_informacion',
      '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?': 'recomendacion',
      'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?': 'satisfaccion_general',
      'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?': 'lealtad',
    };
    return headerMapping[header.trim()] || header.trim();
  },
  transform: (value, field) => {
    if (['claridad_informacion', 'recomendacion', 'satisfaccion_general', 'lealtad'].includes(field)) {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
    return value;
  }
});

// Filtrar datos válidos
const validData = parsed.data.filter(row => {
  return row && 
         typeof row === 'object' && 
         row.SEGMENTO && 
         (row.SEGMENTO === 'PERSONAS' || row.SEGMENTO === 'EMPRESARIAL') &&
         row.satisfaccion_general !== null && 
         row.satisfaccion_general !== undefined && 
         !isNaN(row.satisfaccion_general);
});

console.log('=== ANÁLISIS DE DATOS HISTÓRICOS ===');
console.log(`Total registros válidos: ${validData.length}`);

// Análisis por segmento
const personasData = validData.filter(d => d.SEGMENTO === 'PERSONAS');
const empresarialData = validData.filter(d => d.SEGMENTO === 'EMPRESARIAL');

console.log(`\n=== DISTRIBUCIÓN POR SEGMENTO ===`);
console.log(`Personas: ${personasData.length} registros`);
console.log(`Empresarial: ${empresarialData.length} registros`);

// Calcular estadísticas para Satisfacción General
function calculateStats(data, metricKey) {
  if (!data || data.length === 0) {
    return { average: 0, total: 0 };
  }

  const values = data
    .map(d => d[metricKey])
    .filter(v => v !== null && v !== undefined && !isNaN(v));

  if (values.length === 0) {
    return { average: 0, total: 0 };
  }

  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  return {
    average: Number(average.toFixed(2)),
    total: values.length
  };
}

const consolidadoStats = calculateStats(validData, 'satisfaccion_general');
const personasStats = calculateStats(personasData, 'satisfaccion_general');
const empresarialStats = calculateStats(empresarialData, 'satisfaccion_general');

console.log(`\n=== SATISFACCIÓN GENERAL (2024-2025) ===`);
console.log(`Consolidado: ${consolidadoStats.average} (${consolidadoStats.total} respuestas)`);
console.log(`Personas: ${personasStats.average} (${personasStats.total} respuestas)`);
console.log(`Empresarial: ${empresarialStats.average} (${empresarialStats.total} respuestas)`);

// Verificar datos históricos hardcodeados
const historicalData = [
  {
    year: "2020",
    consolidado: 4.33,
    personas: 4.33,
    empresas: 4.22,
  },
  {
    year: "2021",
    consolidado: 4.31,
    personas: 4.34,
    empresas: 3.95,
  },
  {
    year: "2022",
    consolidado: 4.37,
    personas: 4.38,
    empresas: 4.09,
  },
  {
    year: "2023",
    consolidado: 4.41,
    personas: 4.43,
    empresas: 3.86,
  },
  {
    year: "2024-2025",
    consolidado: consolidadoStats.average,
    personas: personasStats.average,
    empresas: empresarialStats.average,
  },
];

console.log(`\n=== DATOS HISTÓRICOS COMPLETOS ===`);
historicalData.forEach(year => {
  console.log(`${year.year}: Consolidado=${year.consolidado}, Personas=${year.personas}, Empresas=${year.empresas}`);
});

// Verificar si hay problemas con los datos
console.log(`\n=== VERIFICACIÓN DE PROBLEMAS ===`);
if (empresarialStats.total < 20) {
  console.log(`⚠️  ADVERTENCIA: Muestra empresarial muy pequeña (${empresarialStats.total} registros)`);
}

if (Math.abs(consolidadoStats.average - personasStats.average) > 0.1) {
  console.log(`⚠️  ADVERTENCIA: Gran diferencia entre consolidado y personas`);
}

// Verificar fechas en los datos
const sampleDates = validData.slice(0, 10).map(d => d.DATE_MODIFIED);
console.log(`\n=== MUESTRA DE FECHAS ===`);
sampleDates.forEach(date => console.log(date));