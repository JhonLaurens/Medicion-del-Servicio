const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISIS DE DATOS DE EJECUTIVOS PARA PARTICIPACIÓN DE GERENCIAS');
console.log('================================================================');

// Leer archivo de ejecutivos para analizar
const executivesFile = path.join(__dirname, 'public', 'ejecutivos para analizar.csv');
const dataFile = path.join(__dirname, 'public', 'datos.csv');

function parseCSV(content, delimiter = ';') {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(delimiter).map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ? values[index].trim() : '';
    });
    data.push(record);
  }
  
  return { headers, data };
}

try {
  // Analizar archivo de ejecutivos para analizar
  console.log('\n📋 ANÁLISIS DEL ARCHIVO: ejecutivos para analizar.csv');
  console.log('---------------------------------------------------');
  
  const executivesContent = fs.readFileSync(executivesFile, 'utf8');
  const executivesData = parseCSV(executivesContent);
  
  console.log('📊 Headers encontrados:', executivesData.headers);
  console.log('📊 Total de registros:', executivesData.data.length);
  
  // Analizar tipos de ejecutivos
  const tiposEjecutivo = {};
  const segmentos = {};
  const ciudades = {};
  const agencias = {};
  
  executivesData.data.forEach(record => {
    const tipo = record['TIPO EJECUTIVO'];
    const segmento = record['SEGMENTO'];
    const ciudad = record['CIUDAD'];
    const agencia = record['AGENCIA'];
    
    tiposEjecutivo[tipo] = (tiposEjecutivo[tipo] || 0) + 1;
    segmentos[segmento] = (segmentos[segmento] || 0) + 1;
    ciudades[ciudad] = (ciudades[ciudad] || 0) + 1;
    agencias[agencia] = (agencias[agencia] || 0) + 1;
  });
  
  console.log('\n📈 DISTRIBUCIÓN POR TIPO EJECUTIVO:');
  Object.entries(tiposEjecutivo).forEach(([tipo, count]) => {
    console.log(`  ${tipo}: ${count} ejecutivos`);
  });
  
  console.log('\n📈 DISTRIBUCIÓN POR SEGMENTO:');
  Object.entries(segmentos).forEach(([segmento, count]) => {
    console.log(`  ${segmento}: ${count} ejecutivos`);
  });
  
  console.log('\n📈 DISTRIBUCIÓN POR CIUDAD:');
  Object.entries(ciudades).forEach(([ciudad, count]) => {
    console.log(`  ${ciudad}: ${count} ejecutivos`);
  });
  
  // Filtrar solo gerentes de cuenta
  const gerentesCuenta = executivesData.data.filter(record => 
    record['TIPO EJECUTIVO'].toUpperCase().includes('GERENTE DE CUENTA')
  );
  
  console.log('\n🎯 GERENTES DE CUENTA IDENTIFICADOS:');
  console.log(`📊 Total: ${gerentesCuenta.length} gerentes de cuenta`);
  
  gerentesCuenta.forEach((gerente, index) => {
    console.log(`  ${index + 1}. ${gerente.EJECUTIVO_FINAL} - ${gerente.AGENCIA} (${gerente.SEGMENTO}, ${gerente.CIUDAD})`);
  });
  
  // Analizar archivo de datos principal
  console.log('\n📋 ANÁLISIS DEL ARCHIVO: datos.csv');
  console.log('----------------------------------');
  
  const dataContent = fs.readFileSync(dataFile, 'utf8');
  const mainData = parseCSV(dataContent);
  
  console.log('📊 Headers encontrados:', mainData.headers);
  console.log('📊 Total de registros:', mainData.data.length);
  
  // Verificar mapeo de columnas
  const tipoEjecutivoColumn = mainData.headers.find(h => 
    h.includes('TIPO') && h.includes('EJECUTIVO')
  );
  
  console.log('\n🔍 COLUMNA DE TIPO EJECUTIVO ENCONTRADA:', tipoEjecutivoColumn);
  
  // Contar registros de gerentes de cuenta en datos principales
  const gerentesEnDatos = mainData.data.filter(record => {
    const tipoEjecutivo = record[tipoEjecutivoColumn];
    return tipoEjecutivo && tipoEjecutivo.toUpperCase().includes('GERENTE DE CUENTA');
  });
  
  console.log(`📊 Registros de GERENTE DE CUENTA en datos.csv: ${gerentesEnDatos.length}`);
  
  // Mostrar algunos ejemplos
  console.log('\n📋 EJEMPLOS DE REGISTROS DE GERENTES DE CUENTA:');
  gerentesEnDatos.slice(0, 5).forEach((record, index) => {
    console.log(`  ${index + 1}. ${record.EJECUTIVO} - ${record.AGENCIA} (${record.SEGMENTO})`);
  });
  
  // Verificar coincidencias entre archivos
  console.log('\n🔗 VERIFICACIÓN DE COINCIDENCIAS:');
  const ejecutivosEnDatos = new Set(gerentesEnDatos.map(r => r.EJECUTIVO));
  const ejecutivosParaAnalizar = new Set(gerentesCuenta.map(r => r.EJECUTIVO_FINAL));
  
  console.log(`📊 Ejecutivos únicos en datos.csv: ${ejecutivosEnDatos.size}`);
  console.log(`📊 Ejecutivos únicos en ejecutivos para analizar.csv: ${ejecutivosParaAnalizar.size}`);
  
  const coincidencias = [...ejecutivosEnDatos].filter(x => ejecutivosParaAnalizar.has(x));
  console.log(`📊 Coincidencias encontradas: ${coincidencias.length}`);
  
  if (coincidencias.length > 0) {
    console.log('\n✅ EJECUTIVOS QUE COINCIDEN:');
    coincidencias.forEach((ejecutivo, index) => {
      console.log(`  ${index + 1}. ${ejecutivo}`);
    });
  }
  
  // Verificar ejecutivos que no coinciden
  const noCoinciden = [...ejecutivosParaAnalizar].filter(x => !ejecutivosEnDatos.has(x));
  if (noCoinciden.length > 0) {
    console.log('\n⚠️ EJECUTIVOS EN "PARA ANALIZAR" QUE NO ESTÁN EN DATOS:');
    noCoinciden.forEach((ejecutivo, index) => {
      console.log(`  ${index + 1}. ${ejecutivo}`);
    });
  }
  
  console.log('\n✅ ANÁLISIS COMPLETADO');
  
} catch (error) {
  console.error('❌ Error durante el análisis:', error.message);
}