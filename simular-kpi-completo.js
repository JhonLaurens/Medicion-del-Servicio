import fs from 'fs';

// Simular exactamente la lógica del dataService
const csvContent = fs.readFileSync('public/datos.csv', 'utf8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(';');

console.log('🔍 SIMULACIÓN COMPLETA DEL DATA SERVICE');
console.log('=' * 50);

// Header mapping - exactly like dataService
const headerMap = {
  'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?': 'claridad_informacion',
  '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?': 'recomendacion',
  'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?': 'satisfaccion_general',
  'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?': 'lealtad'
};

const metricFields = [
  'claridad_informacion',
  'recomendacion', 
  'satisfaccion_general',
  'lealtad'
];

// Find column indices
const columnIndices = {};
const segmentoIndex = headers.indexOf('SEGMENTO');

headers.forEach((header, index) => {
  const cleanHeader = header.trim();
  if (headerMap[cleanHeader]) {
    columnIndices[headerMap[cleanHeader]] = index;
    console.log(`✅ Mapped: ${headerMap[cleanHeader]} -> index ${index}`);
  }
});

// Process all data
const processedData = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  const cells = lines[i].split(';');
  const record = {};
  
  // Map the metric fields
  let hasValidMetrics = false;
  Object.entries(columnIndices).forEach(([key, index]) => {
    const value = cells[index];
    const numValue = parseInt(value);
    record[key] = isNaN(numValue) ? null : numValue;
    if (!isNaN(numValue)) hasValidMetrics = true;
  });
  
  // Add segment
  record.SEGMENTO = cells[segmentoIndex];
  record.ID = cells[0];
  
  // Only include if has ID, segment, and at least one valid metric
  if (record.ID && record.ID.trim() !== '' && 
      record.SEGMENTO && record.SEGMENTO.trim() !== '' && 
      hasValidMetrics) {
    processedData.push(record);
  }
}

console.log(`\n📊 PROCESSED DATA: ${processedData.length} valid records`);

// Simulate getKPIData function
const metrics = [
  { key: 'claridad_informacion', name: 'Claridad de la Información (Atención)' },
  { key: 'satisfaccion_general', name: 'Satisfacción General' },
  { key: 'lealtad', name: 'Lealtad' },
  { key: 'recomendacion', name: 'Recomendación' }
];

const calculateStats = (data, metricKey) => {
  if (data.length === 0) return { average: 0, rating5: 0, rating4: 0, rating123: 0 };
  
  const values = data.map(d => d[metricKey]).filter(v => v !== null && v !== undefined);
  if (values.length === 0) return { average: 0, rating5: 0, rating4: 0, rating123: 0 };
  
  const average = parseFloat((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2));
  const rating5 = parseFloat(((values.filter(v => v === 5).length / values.length) * 100).toFixed(1));
  const rating4 = parseFloat(((values.filter(v => v === 4).length / values.length) * 100).toFixed(1));
  const rating123 = parseFloat(((values.filter(v => v <= 3).length / values.length) * 100).toFixed(1));
  
  return { average, rating5, rating4, rating123 };
};

console.log('\n🎯 GENERANDO KPI DATA:');

const kpiResults = metrics.map(metric => {
  const allData = processedData.filter(d => d[metric.key] !== null && d[metric.key] !== undefined);
  const personasData = allData.filter(d => d.SEGMENTO === 'PERSONAS');
  const empresarialData = allData.filter(d => d.SEGMENTO === 'EMPRESARIAL');
  
  console.log(`\n📈 ${metric.name}:`);
  console.log(`   Total válidos: ${allData.length}`);
  console.log(`   Personas: ${personasData.length}`);
  console.log(`   Empresarial: ${empresarialData.length}`);
  
  const consolidado = calculateStats(allData, metric.key);
  const personas = calculateStats(personasData, metric.key);
  const empresarial = calculateStats(empresarialData, metric.key);
  
  console.log(`   Promedio consolidado: ${consolidado.average}`);
  
  return {
    metric: metric.name,
    consolidado,
    personas,
    empresarial
  };
});

console.log('\n🎯 RESULTADO FINAL:');
console.log(`Total KPIs generados: ${kpiResults.length}`);
kpiResults.forEach((kpi, index) => {
  console.log(`${index + 1}. ${kpi.metric}: ${kpi.consolidado.average}`);
});

// Check if all 4 metrics have valid data
const validKpis = kpiResults.filter(kpi => kpi.consolidado.average > 0);
console.log(`\n✅ KPIs con datos válidos: ${validKpis.length}/4`);

if (validKpis.length === 4) {
  console.log('🎉 ¡TODAS LAS MÉTRICAS DEBERÍAN APARECER EN EL DASHBOARD!');
} else {
  console.log('⚠️ Algunas métricas pueden no aparecer debido a falta de datos');
}
