const fs = require('fs');
const Papa = require('papaparse');

console.log('🔍 DEBUG: Analizando el problema del reporte de participación de ejecutivos...\n');

// Función para leer CSV con punto y coma como delimitador
function readCSV(filePath) {
  try {
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const result = Papa.parse(csvContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });
    
    if (result.errors.length > 0) {
      console.log(`⚠️ Errores al parsear ${filePath}:`, result.errors);
    }
    
    return result.data;
  } catch (error) {
    console.error(`❌ Error leyendo ${filePath}:`, error.message);
    return [];
  }
}

// Leer ambos archivos
console.log('📂 Leyendo archivos CSV...');
const datosPath = './public/datos.csv';
const ejecutivosPath = './public/ejecutivos para analizar.csv';

const datos = readCSV(datosPath);
const ejecutivos = readCSV(ejecutivosPath);

console.log(`📊 Datos principales: ${datos.length} registros`);
console.log(`👥 Ejecutivos para analizar: ${ejecutivos.length} registros\n`);

// Verificar estructura de datos
if (datos.length > 0) {
  console.log('🔍 Estructura de datos.csv:');
  console.log('Columnas:', Object.keys(datos[0]));
  console.log('Primer registro:', datos[0]);
  console.log('');
}

if (ejecutivos.length > 0) {
  console.log('🔍 Estructura de ejecutivos para analizar.csv:');
  console.log('Columnas:', Object.keys(ejecutivos[0]));
  console.log('Primer registro:', ejecutivos[0]);
  console.log('');
}

// Verificar campo EJECUTIVO_FINAL en ambos archivos
console.log('🔍 Verificando campo EJECUTIVO_FINAL...');

const datosConEjecutivo = datos.filter(record => record.EJECUTIVO_FINAL && record.EJECUTIVO_FINAL.trim() !== '');
console.log(`📊 Registros en datos.csv con EJECUTIVO_FINAL: ${datosConEjecutivo.length} de ${datos.length}`);

const ejecutivosConNombre = ejecutivos.filter(record => record.EJECUTIVO_FINAL && record.EJECUTIVO_FINAL.trim() !== '');
console.log(`👥 Ejecutivos con EJECUTIVO_FINAL: ${ejecutivosConNombre.length} de ${ejecutivos.length}\n`);

// Mostrar algunos ejemplos de ejecutivos
console.log('📋 Primeros 10 ejecutivos para analizar:');
ejecutivosConNombre.slice(0, 10).forEach((exec, index) => {
  console.log(`${index + 1}. ${exec.EJECUTIVO_FINAL} (${exec.SEGMENTO || 'Sin segmento'}, ${exec.CIUDAD || 'Sin ciudad'})`);
});
console.log('');

// Verificar coincidencias
console.log('🔍 Verificando coincidencias entre archivos...');
const ejecutivosNombres = new Set(ejecutivosConNombre.map(e => e.EJECUTIVO_FINAL.toLowerCase().trim()));
const datosEjecutivos = new Set(datosConEjecutivo.map(d => d.EJECUTIVO_FINAL.toLowerCase().trim()));

console.log(`📊 Ejecutivos únicos en datos.csv: ${datosEjecutivos.size}`);
console.log(`👥 Ejecutivos únicos en ejecutivos para analizar.csv: ${ejecutivosNombres.size}`);

// Encontrar coincidencias
const coincidencias = [...ejecutivosNombres].filter(nombre => datosEjecutivos.has(nombre));
console.log(`✅ Coincidencias encontradas: ${coincidencias.length}`);

if (coincidencias.length > 0) {
  console.log('\n📋 Ejecutivos que coinciden:');
  coincidencias.slice(0, 10).forEach((nombre, index) => {
    const ejecutivoInfo = ejecutivosConNombre.find(e => e.EJECUTIVO_FINAL.toLowerCase().trim() === nombre);
    const cantidadEncuestas = datosConEjecutivo.filter(d => d.EJECUTIVO_FINAL.toLowerCase().trim() === nombre).length;
    console.log(`${index + 1}. ${ejecutivoInfo.EJECUTIVO_FINAL} - ${cantidadEncuestas} encuestas (${ejecutivoInfo.SEGMENTO}, ${ejecutivoInfo.CIUDAD})`);
  });
}

// Filtrar datos para ejecutivos especificados
const datosFiltrados = datosConEjecutivo.filter(record => {
  const nombreEjecutivo = record.EJECUTIVO_FINAL.toLowerCase().trim();
  return ejecutivosNombres.has(nombreEjecutivo);
});

console.log(`\n📊 Registros filtrados para ejecutivos especificados: ${datosFiltrados.length} de ${datos.length} (${((datosFiltrados.length / datos.length) * 100).toFixed(1)}%)`);

// Agrupar por ejecutivo
const agrupacionEjecutivos = {};
datosFiltrados.forEach(record => {
  const nombre = record.EJECUTIVO_FINAL;
  if (!agrupacionEjecutivos[nombre]) {
    agrupacionEjecutivos[nombre] = {
      nombre: nombre,
      encuestas: 0,
      agencias: new Set(),
      segmentos: new Set()
    };
  }
  agrupacionEjecutivos[nombre].encuestas++;
  if (record.AGENCIA) agrupacionEjecutivos[nombre].agencias.add(record.AGENCIA);
  if (record.SEGMENTO) agrupacionEjecutivos[nombre].segmentos.add(record.SEGMENTO);
});

const resumenEjecutivos = Object.values(agrupacionEjecutivos).map(exec => ({
  ...exec,
  agencias: Array.from(exec.agencias),
  segmentos: Array.from(exec.segmentos)
}));

console.log('\n📈 Resumen por ejecutivo (Top 10 por encuestas):');
resumenEjecutivos
  .sort((a, b) => b.encuestas - a.encuestas)
  .slice(0, 10)
  .forEach((exec, index) => {
    console.log(`${index + 1}. ${exec.nombre}: ${exec.encuestas} encuestas`);
    console.log(`   Agencias: ${exec.agencias.join(', ')}`);
    console.log(`   Segmentos: ${exec.segmentos.join(', ')}`);
    console.log('');
  });

// Verificar si hay datos para mostrar
const totalEncuestas = resumenEjecutivos.reduce((sum, exec) => sum + exec.encuestas, 0);
const ejecutivosActivos = resumenEjecutivos.filter(exec => exec.encuestas > 0).length;

console.log('📊 RESUMEN FINAL:');
console.log(`- Total de encuestas analizadas: ${totalEncuestas}`);
console.log(`- Ejecutivos monitoreados: ${resumenEjecutivos.length}`);
console.log(`- Ejecutivos activos (con encuestas): ${ejecutivosActivos}`);
console.log(`- Promedio de encuestas por ejecutivo activo: ${ejecutivosActivos > 0 ? Math.round(totalEncuestas / ejecutivosActivos) : 0}`);

if (totalEncuestas === 0) {
  console.log('\n❌ PROBLEMA IDENTIFICADO: No se encontraron encuestas para los ejecutivos especificados');
  console.log('Posibles causas:');
  console.log('1. Los nombres en ambos archivos no coinciden exactamente');
  console.log('2. El campo EJECUTIVO_FINAL está vacío o mal formateado');
  console.log('3. Los delimitadores CSV no son correctos');
  console.log('4. Los archivos no se están cargando correctamente en la aplicación');
} else {
  console.log('\n✅ Los datos están disponibles. El problema puede estar en la interfaz de usuario.');
}