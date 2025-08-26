// Script de prueba para verificar el procesamiento de datos de gerentes
import fs from 'fs';
import Papa from 'papaparse';

// Leer el archivo CSV
const csvContent = fs.readFileSync('public/datos.csv', 'utf8');

// Parsear el CSV
const parsed = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header) => header.trim()
});

console.log('📊 Análisis de datos CSV:');
console.log('Total de registros:', parsed.data.length);

// Verificar las columnas disponibles
console.log('\n📋 Columnas disponibles:');
console.log(Object.keys(parsed.data[0] || {}));

// Filtrar registros de gerentes de cuenta
const managerRecords = parsed.data.filter(record => {
  const tipoEjecutivo = (record['TIPO EJECUTIVO'] || '').toString().toLowerCase();
  return tipoEjecutivo === 'gerente de cuenta';
});

console.log('\n👥 Registros de Gerentes de Cuenta:');
console.log('Total encontrados:', managerRecords.length);

// Mostrar algunos ejemplos
console.log('\n📝 Primeros 5 registros de gerentes:');
managerRecords.slice(0, 5).forEach((record, index) => {
  console.log(`${index + 1}. Gerente: ${record.EJECUTIVO}, Agencia: ${record.AGENCIA}, Segmento: ${record.SEGMENTO}`);
});

// Agrupar por gerente
const managerGroups = {};
managerRecords.forEach(record => {
  const managerName = record.EJECUTIVO || "Sin Asignar";
  if (!managerGroups[managerName]) {
    managerGroups[managerName] = {
      name: managerName,
      surveys: 0,
      agencias: new Set(),
      segmentos: new Set()
    };
  }
  managerGroups[managerName].surveys++;
  managerGroups[managerName].agencias.add(record.AGENCIA || "Sin Agencia");
  managerGroups[managerName].segmentos.add(record.SEGMENTO || "Sin Segmento");
});

console.log('\n📈 Resumen por gerente:');
Object.values(managerGroups).forEach(manager => {
  console.log(`- ${manager.name}: ${manager.surveys} encuestas, Agencias: ${Array.from(manager.agencias).join(', ')}, Segmentos: ${Array.from(manager.segmentos).join(', ')}`);
});

console.log('\n✅ Análisis completado');