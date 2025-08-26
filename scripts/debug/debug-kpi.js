import fs from 'fs';

// Simulación simple del proceso de carga de datos
const csvContent = fs.readFileSync('public/datos.csv', 'utf8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(';');

console.log('🔍 DEBUGGING KPI DATA PROCESSING');
console.log('=' * 50);

// Mapeo de headers similar al dataService
const headerMap = {
  'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?': 'claridad_informacion',
  '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?': 'recomendacion',
  'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?': 'satisfaccion_general',
  'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?': 'lealtad'
};

// Encontrar índices de las columnas
const columnIndices = {};
headers.forEach((header, index) => {
  const cleanHeader = header.trim();
  if (headerMap[cleanHeader]) {
    columnIndices[headerMap[cleanHeader]] = index;
    console.log(`✅ Found column: ${headerMap[cleanHeader]} at index ${index}`);
  }
});

console.log('\n📊 COLUMN INDICES:', columnIndices);

// Procesar algunas filas de ejemplo
const sampleData = [];
for (let i = 1; i <= Math.min(10, lines.length - 1); i++) {
  const cells = lines[i].split(';');
  const record = {};
  
  Object.entries(columnIndices).forEach(([key, index]) => {
    const value = cells[index];
    record[key] = isNaN(parseInt(value)) ? null : parseInt(value);
  });
  
  record.SEGMENTO = cells[headers.indexOf('SEGMENTO')];
  sampleData.push(record);
}

console.log('\n📄 SAMPLE PROCESSED DATA:');
sampleData.forEach((record, index) => {
  console.log(`Record ${index + 1}:`, record);
});

// Simular el cálculo de KPIs
const metrics = [
  { key: 'claridad_informacion', name: 'Claridad de la Información (Atención)' },
  { key: 'satisfaccion_general', name: 'Satisfacción General' },
  { key: 'lealtad', name: 'Lealtad' },
  { key: 'recomendacion', name: 'Recomendación' }
];

console.log('\n🎯 KPI CALCULATION SIMULATION:');
metrics.forEach(metric => {
  const validRecords = sampleData.filter(d => d[metric.key] !== null && d[metric.key] !== undefined);
  console.log(`\n📊 ${metric.name}:`);
  console.log(`   Valid records: ${validRecords.length}/${sampleData.length}`);
  
  if (validRecords.length > 0) {
    const values = validRecords.map(d => d[metric.key]);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    console.log(`   Values: [${values.join(', ')}]`);
    console.log(`   Average: ${average.toFixed(2)}`);
  }
});
