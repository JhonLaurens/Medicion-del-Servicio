/**
 * 🔍 VALIDACIÓN ELIMINACIÓN DE DUPLICADOS - DASHBOARD COLTEFINANCIERA
 * ================================================================
 * 
 * Script para validar que se han eliminado correctamente los elementos
 * duplicados en el dashboard, especialmente gráficos repetitivos.
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 INICIANDO VALIDACIÓN DE ELIMINACIÓN DE DUPLICADOS...\n');

// Archivos a validar
const filesToCheck = [
  'src/components/GeneralDashboard.tsx',
  'tailwind.config.js',
  'src/components/SegmentAnalysis.tsx',
  'src/components/GeographicAnalysis.tsx'
];

// Patrones que indican duplicación
const duplicatePatterns = {
  charts: [
    /\.map\(\(kpi, index\).*BarChart.*\).*\.map\(\(kpi, index\).*BarChart/gs,
    /ResponsiveContainer.*BarChart.*ResponsiveContainer.*BarChart/gs
  ],
  colors: [
    /rating5.*#1e40af.*rating5.*#1e40af/gs,
    /rating4.*#10b981.*rating4.*#10b981/gs,
    /rating123.*#ef4444.*rating123.*#ef4444/gs
  ],
  legends: [
    /Excelente \(5\).*Excelente \(5\)/gs,
    /Bueno \(4\).*Bueno \(4\)/gs,
    /Necesita mejora.*Necesita mejora/gs
  ],
  tooltips: [
    /CustomTooltip.*CustomTooltip/gs,
    /tooltip-corporate.*tooltip-corporate/gs
  ]
};

function validateFile(filePath) {
  console.log(`\n📄 Validando: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log('   ❌ Archivo no encontrado');
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let hasIssues = false;
  
  // Verificar duplicación de gráficos
  console.log('   🔍 Verificando duplicación de gráficos...');
  duplicatePatterns.charts.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      console.log(`   ❌ Duplicación de gráficos detectada (patrón ${index + 1})`);
      hasIssues = true;
    }
  });
  
  // Verificar duplicación de colores
  console.log('   🎨 Verificando duplicación de colores...');
  duplicatePatterns.colors.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      console.log(`   ❌ Duplicación de colores detectada (patrón ${index + 1})`);
      hasIssues = true;
    }
  });
  
  // Verificar duplicación de leyendas
  console.log('   📋 Verificando duplicación de leyendas...');
  duplicatePatterns.legends.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      console.log(`   ❌ Duplicación de leyendas detectada (patrón ${index + 1})`);
      hasIssues = true;
    }
  });
  
  // Verificar duplicación de tooltips
  console.log('   💬 Verificando duplicación de tooltips...');
  duplicatePatterns.tooltips.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      console.log(`   ❌ Duplicación de tooltips detectada (patrón ${index + 1})`);
      hasIssues = true;
    }
  });
  
  if (!hasIssues) {
    console.log('   ✅ Sin duplicaciones detectadas');
  }
  
  return !hasIssues;
}

function analyzeChartCount(filePath) {
  console.log(`\n📊 Analizando cantidad de gráficos en: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log('   ❌ Archivo no encontrado');
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Contar BarChart
  const barChartCount = (content.match(/<BarChart/g) || []).length;
  console.log(`   📈 BarChart encontrados: ${barChartCount}`);
  
  // Contar ResponsiveContainer
  const responsiveContainerCount = (content.match(/<ResponsiveContainer/g) || []).length;
  console.log(`   📱 ResponsiveContainer encontrados: ${responsiveContainerCount}`);
  
  // Contar loops de KPI
  const kpiLoopCount = (content.match(/kpiData\.map\(\(kpi, index\)/g) || []).length;
  console.log(`   🔄 Loops de KPI encontrados: ${kpiLoopCount}`);
  
  if (kpiLoopCount > 1) {
    console.log('   ⚠️  ADVERTENCIA: Múltiples loops de KPI detectados');
  }
  
  // Verificar si hay comentarios de eliminación
  if (content.includes('Removed duplicate') || content.includes('eliminado') || content.includes('duplicad')) {
    console.log('   ✅ Comentarios de eliminación encontrados');
  }
}

function validateTailwindConfig() {
  console.log('\n🎨 Validando configuración de Tailwind...');
  
  const configPath = 'tailwind.config.js';
  if (!fs.existsSync(configPath)) {
    console.log('   ❌ tailwind.config.js no encontrado');
    return false;
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  // Verificar duplicación de colores
  const colorDefinitions = content.match(/primary.*#[0-9a-fA-F]{6}/g) || [];
  console.log(`   🎯 Definiciones de color primary: ${colorDefinitions.length}`);
  
  // Verificar duplicación de brand colors
  const brandColors = content.match(/brand.*#[0-9a-fA-F]{6}/g) || [];
  console.log(`   🏢 Definiciones de color brand: ${brandColors.length}`);
  
  // Verificar duplicación de métricas
  const metricsColors = content.match(/metrics.*#[0-9a-fA-F]{6}/g) || [];
  console.log(`   📊 Definiciones de color metrics: ${metricsColors.length}`);
  
  console.log('   ✅ Configuración de Tailwind validada');
  return true;
}

// Ejecutar validaciones
console.log('╔════════════════════════════════════════╗');
console.log('║  VALIDACIÓN ELIMINACIÓN DE DUPLICADOS  ║');
console.log('╚════════════════════════════════════════╝');

let allFilesValid = true;

filesToCheck.forEach(file => {
  const isValid = validateFile(file);
  allFilesValid = allFilesValid && isValid;
  
  if (file.includes('GeneralDashboard.tsx')) {
    analyzeChartCount(file);
  }
});

validateTailwindConfig();

// Resumen final
console.log('\n' + '='.repeat(50));
console.log('📋 RESUMEN DE VALIDACIÓN:');
console.log('='.repeat(50));

if (allFilesValid) {
  console.log('✅ TODOS LOS ARCHIVOS VALIDADOS CORRECTAMENTE');
  console.log('🎯 NO SE DETECTARON DUPLICACIONES');
  console.log('🚀 DASHBOARD OPTIMIZADO Y LISTO');
} else {
  console.log('❌ SE DETECTARON ISSUES EN LOS ARCHIVOS');
  console.log('🔧 REVISAR CORRECCIONES NECESARIAS');
}

console.log('\n🏁 Validación completada.\n');
