#!/usr/bin/env node

/**
 * Script para validar que el eje Y de las gráficas de distribución no tenga desbordamientos
 * y que todos los valores estén en el rango correcto de 0-100%.
 */

const fs = require('fs');
const path = require('path');

// Función para leer y parsear CSV
function leerCSV(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        records.push(record);
      }
    }
    
    return records;
  } catch (error) {
    console.error(`❌ Error leyendo CSV: ${error.message}`);
    return [];
  }
}

function validarDatosPorcentajes() {
  console.log("📊 Cargando datos CSV...");
  
  const datos = leerCSV('public/datos.csv');
  if (datos.length === 0) {
    console.log("❌ No se pudieron cargar los datos");
    return false;
  }
  
  console.log(`✅ Datos cargados: ${datos.length} registros`);
  
  // Métricas a validar
  const metricas = [
    ['satisfaccion_general', 'Satisfacción General'],
    ['lealtad', 'Lealtad'],
    ['claridad_informacion', 'Claridad de la Información (Atención)'],
    ['personal_servicio', 'Personal de Servicio'],
    ['tiempo_respuesta', 'Tiempo de Respuesta'],
    ['facilidad_proceso', 'Facilidad del Proceso'],
    ['solucion_necesidades', 'Solución de Necesidades']
  ];
  
  const problemasEncontrados = [];
  
  for (const [columna, nombre] of metricas) {
    // Verificar si la columna existe
    if (!datos[0] || !(columna in datos[0])) {
      problemasEncontrados.push(`❌ Columna '${columna}' no encontrada`);
      continue;
    }
    
    console.log(`\n🔍 Validando ${nombre} (${columna})...`);
    
    // Filtrar datos válidos (1-5)
    const datosValidos = datos.filter(row => {
      const valor = parseInt(row[columna]);
      return !isNaN(valor) && valor >= 1 && valor <= 5;
    });
    
    if (datosValidos.length === 0) {
      problemasEncontrados.push(`❌ ${nombre}: No hay datos válidos`);
      continue;
    }
    
    // Calcular distribución por segmento
    const segmentos = [
      ['Consolidado', datosValidos],
      ['Personas', datosValidos.filter(row => row.tipo_cliente === 'personas')],
      ['Empresas', datosValidos.filter(row => row.tipo_cliente === 'empresas')]
    ];
    
    for (const [segNombre, segData] of segmentos) {
      if (segData.length === 0) continue;
      
      // Calcular porcentajes
      const total = segData.length;
      const rating5 = (segData.filter(row => parseInt(row[columna]) === 5).length / total) * 100;
      const rating4 = (segData.filter(row => parseInt(row[columna]) === 4).length / total) * 100;
      const rating123 = (segData.filter(row => [1, 2, 3].includes(parseInt(row[columna]))).length / total) * 100;
      
      const porcentajes = [rating5, rating4, rating123];
      const sumaTotal = porcentajes.reduce((a, b) => a + b, 0);
      
      console.log(`  📈 ${segNombre}: 5=${rating5.toFixed(1)}%, 4=${rating4.toFixed(1)}%, 1-3=${rating123.toFixed(1)}% (Total: ${sumaTotal.toFixed(1)}%)`);
      
      // Verificar que ningún porcentaje esté fuera del rango
      porcentajes.forEach((pct, i) => {
        if (pct < 0 || pct > 100) {
          problemasEncontrados.push(`❌ ${nombre} - ${segNombre}: Porcentaje fuera de rango: ${pct.toFixed(2)}%`);
        }
      });
      
      // Verificar que la suma sea aproximadamente 100%
      if (Math.abs(sumaTotal - 100) > 0.1) {
        problemasEncontrados.push(`⚠️ ${nombre} - ${segNombre}: Suma de porcentajes no es 100%: ${sumaTotal.toFixed(2)}%`);
      }
    }
  }
  
  // Resumen
  console.log(`\n${'='.repeat(60)}`);
  console.log("📋 RESUMEN DE VALIDACIÓN");
  console.log(`${'='.repeat(60)}`);
  
  if (problemasEncontrados.length > 0) {
    console.log(`❌ Se encontraron ${problemasEncontrados.length} problemas:`);
    problemasEncontrados.forEach(problema => console.log(`  ${problema}`));
    return false;
  } else {
    console.log("✅ Todos los porcentajes están en el rango válido 0-100%");
    console.log("✅ No se detectaron problemas de desbordamiento en el eje Y");
    return true;
  }
}

function validarConfiguracionGraficas() {
  console.log(`\n${'='.repeat(60)}`);
  console.log("🔧 VALIDANDO CONFIGURACIÓN DE GRÁFICAS");
  console.log(`${'='.repeat(60)}`);
  
  try {
    const codigo = fs.readFileSync('src/components/GeneralDashboard.tsx', 'utf8');
    
    // Verificar configuraciones críticas
    const configuracionesEsperadas = [
      ['domain={[0, 100]}', 'Dominio del eje Y configurado'],
      ['tickFormatter={(value) => `${value}%`}', 'Formato de porcentaje en ticks'],
      ['Porcentaje (%)', 'Etiqueta del eje Y'],
      ['colors.rating5', 'Uso de colores definidos'],
      ['colors.rating4', 'Uso de colores definidos'],
      ['colors.rating123', 'Uso de colores definidos']
    ];
    
    const problemasConfig = [];
    
    for (const [config, descripcion] of configuracionesEsperadas) {
      if (codigo.includes(config)) {
        console.log(`✅ ${descripcion}: Encontrado`);
      } else {
        problemasConfig.push(`❌ ${descripcion}: No encontrado - '${config}'`);
      }
    }
    
    // Verificar que no haya configuraciones problemáticas
    const configuracionesProblematicas = [
      ['domain={[0, \'dataMax\']}', 'Dominio automático que puede causar desbordamiento'],
      ['domain={[\'dataMin\', \'dataMax\']}', 'Dominio automático que puede causar desbordamiento'],
      ['domain={[0, 120]}', 'Dominio mayor a 100%']
    ];
    
    for (const [config, descripcion] of configuracionesProblematicas) {
      if (codigo.includes(config)) {
        problemasConfig.push(`⚠️ ${descripcion}: Encontrado - '${config}'`);
      }
    }
    
    if (problemasConfig.length > 0) {
      console.log(`\n❌ Problemas de configuración encontrados:`);
      problemasConfig.forEach(problema => console.log(`  ${problema}`));
      return false;
    } else {
      console.log(`\n✅ Configuración del eje Y es correcta`);
      return true;
    }
    
  } catch (error) {
    console.log(`❌ Error validando configuración: ${error.message}`);
    return false;
  }
}

function main() {
  console.log("🔍 VALIDACIÓN DE EJE Y EN GRÁFICAS DE DISTRIBUCIÓN");
  console.log("=".repeat(60));
  
  // Validar datos
  const datosOk = validarDatosPorcentajes();
  
  // Validar configuración
  const configOk = validarConfiguracionGraficas();
  
  // Resultado final
  console.log(`\n${'='.repeat(60)}`);
  console.log("🎯 RESULTADO FINAL");
  console.log(`${'='.repeat(60)}`);
  
  if (datosOk && configOk) {
    console.log("✅ VALIDACIÓN EXITOSA: No hay problemas de desbordamiento en el eje Y");
    console.log("✅ Las gráficas de distribución están correctamente configuradas");
    process.exit(0);
  } else {
    console.log("❌ VALIDACIÓN FALLIDA: Se encontraron problemas que requieren corrección");
    process.exit(1);
  }
}

main();
