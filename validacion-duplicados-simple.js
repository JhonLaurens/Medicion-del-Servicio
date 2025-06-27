const fs = require('fs');

console.log('🎯 VALIDACIÓN ELIMINACIÓN DE DUPLICADOS - DASHBOARD COLTEFINANCIERA');
console.log('================================================================\n');

// Verificar archivo principal
const dashboardPath = 'src/components/GeneralDashboard.tsx';

if (fs.existsSync(dashboardPath)) {
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  console.log('📄 Analizando GeneralDashboard.tsx...\n');
  
  // Contar gráficos
  const barChartCount = (content.match(/<BarChart/g) || []).length;
  const responsiveContainerCount = (content.match(/<ResponsiveContainer/g) || []).length;
  const kpiLoopCount = (content.match(/kpiData\.map\(\(kpi, index\)/g) || []).length;
  
  console.log(`📊 Estadísticas de componentes:`);
  console.log(`   - BarChart encontrados: ${barChartCount}`);
  console.log(`   - ResponsiveContainer encontrados: ${responsiveContainerCount}`);
  console.log(`   - Loops de KPI encontrados: ${kpiLoopCount}`);
  
  // Verificar comentarios de eliminación
  const hasRemovalComments = content.includes('Removed duplicate') || 
                             content.includes('eliminado') || 
                             content.includes('duplicad');
  
  console.log(`\n🔍 Verificaciones:`);
  console.log(`   - Comentarios de eliminación: ${hasRemovalComments ? '✅ Encontrados' : '❌ No encontrados'}`);
  
  // Análisis de duplicación
  if (kpiLoopCount <= 1) {
    console.log(`   - Duplicación de loops: ✅ Eliminada (${kpiLoopCount} loop encontrado)`);
  } else {
    console.log(`   - Duplicación de loops: ❌ Detectada (${kpiLoopCount} loops encontrados)`);
  }
  
  console.log('\n✅ VALIDACIÓN COMPLETADA');
  
} else {
  console.log('❌ Archivo GeneralDashboard.tsx no encontrado');
}
