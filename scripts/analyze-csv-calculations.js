/**
 * Script para analizar minuciosamente los cálculos de promedios en datos.csv
 * Identifica errores matemáticos y valida la precisión de los cálculos
 */

const fs = require('fs');
const path = require('path');

// Función para leer y parsear el archivo CSV
function parseCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('El archivo CSV está vacío');
    }
    
    const headers = lines[0].split(';');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';');
      if (values.length >= headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          record[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(record);
      }
    }
    
    return { headers, data };
  } catch (error) {
    console.error('Error al leer el archivo CSV:', error.message);
    return null;
  }
}

// Función para validar y convertir valores numéricos
function parseNumericValue(value) {
  if (!value || value === '' || value === '""""""') {
    return null;
  }
  
  // Limpiar comillas y espacios
  const cleanValue = value.replace(/"/g, '').trim();
  const numValue = parseFloat(cleanValue);
  
  // Validar que esté en el rango 1-5
  if (isNaN(numValue) || numValue < 1 || numValue > 5) {
    return null;
  }
  
  return numValue;
}

// Función para calcular estadísticas precisas
function calculatePreciseStats(values) {
  const validValues = values.filter(v => v !== null);
  
  if (validValues.length === 0) {
    return {
      count: 0,
      sum: 0,
      average: 0,
      min: 0,
      max: 0,
      validResponses: 0,
      invalidResponses: values.length
    };
  }
  
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const average = sum / validValues.length;
  
  return {
    count: validValues.length,
    sum: sum,
    average: parseFloat(average.toFixed(4)), // Precisión de 4 decimales
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    validResponses: validValues.length,
    invalidResponses: values.length - validValues.length
  };
}

// Función principal de análisis
function analyzeCSVCalculations() {
  console.log('🔍 ANÁLISIS MINUCIOSO DE CÁLCULOS EN DATOS.CSV');
  console.log('=' .repeat(60));
  
  const csvPath = path.join(__dirname, '..', 'public', 'datos.csv');
  const csvData = parseCSV(csvPath);
  
  if (!csvData) {
    console.error('❌ No se pudo cargar el archivo CSV');
    return;
  }
  
  const { headers, data } = csvData;
  
  console.log(`📊 Total de registros encontrados: ${data.length}`);
  console.log(`📋 Columnas disponibles: ${headers.length}`);
  console.log('');
  
  // Identificar las columnas de métricas
  const metricColumns = {
    claridad: 'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?',
    recomendacion: '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?',
    satisfaccion: 'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?',
    lealtad: 'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?'
  };
  
  console.log('📈 ANÁLISIS POR MÉTRICA:');
  console.log('-'.repeat(40));
  
  const results = {};
  
  // Analizar cada métrica
  Object.entries(metricColumns).forEach(([metricName, columnName]) => {
    console.log(`\n🎯 Métrica: ${metricName.toUpperCase()}`);
    
    const values = data.map(record => parseNumericValue(record[columnName]));
    const stats = calculatePreciseStats(values);
    
    results[metricName] = stats;
    
    console.log(`   ✅ Respuestas válidas: ${stats.validResponses}`);
    console.log(`   ❌ Respuestas inválidas: ${stats.invalidResponses}`);
    console.log(`   📊 Suma total: ${stats.sum}`);
    console.log(`   📈 Promedio: ${stats.average}`);
    console.log(`   📉 Mínimo: ${stats.min}`);
    console.log(`   📊 Máximo: ${stats.max}`);
    
    // Verificar distribución de valores
    const distribution = {};
    values.filter(v => v !== null).forEach(val => {
      distribution[val] = (distribution[val] || 0) + 1;
    });
    
    console.log(`   📋 Distribución:`);
    for (let i = 1; i <= 5; i++) {
      const count = distribution[i] || 0;
      const percentage = stats.validResponses > 0 ? ((count / stats.validResponses) * 100).toFixed(1) : '0.0';
      console.log(`      ${i}: ${count} respuestas (${percentage}%)`);
    }
  });
  
  // Calcular promedio general
  console.log('\n🎯 PROMEDIO GENERAL:');
  console.log('-'.repeat(40));
  
  const validAverages = Object.values(results)
    .map(r => r.average)
    .filter(avg => avg > 0);
  
  if (validAverages.length > 0) {
    const generalAverage = validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length;
    console.log(`📊 Promedio de promedios: ${generalAverage.toFixed(4)}`);
    console.log(`📈 Métricas válidas: ${validAverages.length}`);
  }
  
  // Análisis por segmento
  console.log('\n🏢 ANÁLISIS POR SEGMENTO:');
  console.log('-'.repeat(40));
  
  const segments = {};
  data.forEach(record => {
    const segment = record.SEGMENTO || 'Sin Segmento';
    if (!segments[segment]) {
      segments[segment] = [];
    }
    segments[segment].push(record);
  });
  
  Object.entries(segments).forEach(([segmentName, segmentData]) => {
    console.log(`\n📋 Segmento: ${segmentName}`);
    console.log(`   📊 Total registros: ${segmentData.length}`);
    
    Object.entries(metricColumns).forEach(([metricName, columnName]) => {
      const values = segmentData.map(record => parseNumericValue(record[columnName]));
      const stats = calculatePreciseStats(values);
      
      console.log(`   ${metricName}: ${stats.average} (${stats.validResponses} respuestas)`);
    });
  });
  
  // Detectar posibles errores
  console.log('\n🚨 DETECCIÓN DE ERRORES:');
  console.log('-'.repeat(40));
  
  let errorsFound = false;
  
  // Verificar registros con valores fuera de rango o inconsistentes
  data.forEach((record, index) => {
    const recordErrors = [];
    
    Object.entries(metricColumns).forEach(([metricName, columnName]) => {
      const rawValue = record[columnName];
      const numValue = parseNumericValue(rawValue);
      
      if (rawValue && rawValue !== '' && rawValue !== '""""""' && numValue === null) {
        recordErrors.push(`${metricName}: "${rawValue}" (valor inválido)`);
      }
    });
    
    if (recordErrors.length > 0) {
      console.log(`❌ Registro ${index + 1} (ID: ${record.ID}):`);
      recordErrors.forEach(error => console.log(`   - ${error}`));
      errorsFound = true;
    }
  });
  
  if (!errorsFound) {
    console.log('✅ No se encontraron errores evidentes en los datos');
  }
  
  // Resumen final
  console.log('\n📋 RESUMEN FINAL:');
  console.log('='.repeat(60));
  console.log(`📊 Total de registros analizados: ${data.length}`);
  console.log(`📈 Métricas analizadas: ${Object.keys(metricColumns).length}`);
  console.log(`🏢 Segmentos encontrados: ${Object.keys(segments).length}`);
  
  Object.entries(results).forEach(([metricName, stats]) => {
    console.log(`📊 ${metricName}: ${stats.average} (${stats.validResponses}/${data.length} respuestas válidas)`);
  });
  
  return results;
}

// Ejecutar el análisis
if (require.main === module) {
  analyzeCSVCalculations();
}

module.exports = { analyzeCSVCalculations, parseCSV, calculatePreciseStats };