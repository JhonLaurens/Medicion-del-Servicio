// Script para verificar las métricas generadas
import { satisfactionDataService } from './src/services/dataService.ts';

async function debugMetrics() {
  try {
    console.log('🔍 Iniciando verificación de métricas...');
    
    // Cargar datos
    await satisfactionDataService.loadData();
    console.log('✅ Datos cargados exitosamente');
    
    // Obtener métricas KPI
    const kpiData = satisfactionDataService.getKPIData();
    
    console.log('\n📊 RESUMEN DE MÉTRICAS:');
    console.log('Total de métricas generadas:', kpiData.length);
    console.log('Métricas encontradas:');
    
    kpiData.forEach((metric, index) => {
      console.log(`${index + 1}. ${metric.metric}`);
      console.log(`   - Consolidado: ${metric.consolidado.average.toFixed(2)}`);
      console.log(`   - Personas: ${metric.personas.average.toFixed(2)} (${metric.personas.total} respuestas)`);
      console.log(`   - Empresarial: ${metric.empresarial.average.toFixed(2)} (${metric.empresarial.total} respuestas)`);
      console.log('');
    });
    
    // Verificar métricas específicas esperadas
    const expectedMetrics = [
      'Satisfacción General',
      'Lealtad', 
      'Recomendación (NPS)',
      'Claridad de Información'
    ];
    
    console.log('\n🎯 VERIFICACIÓN DE MÉTRICAS ESPERADAS:');
    expectedMetrics.forEach(expectedMetric => {
      const found = kpiData.find(kpi => kpi.metric === expectedMetric);
      if (found) {
        console.log(`✅ ${expectedMetric}: ENCONTRADA`);
      } else {
        console.log(`❌ ${expectedMetric}: NO ENCONTRADA`);
        // Buscar métricas similares
        const similar = kpiData.filter(kpi => 
          kpi.metric.toLowerCase().includes(expectedMetric.toLowerCase().split(' ')[0])
        );
        if (similar.length > 0) {
          console.log(`   Métricas similares: ${similar.map(s => s.metric).join(', ')}`);
        }
      }
    });
    
    console.log('\n🔍 TODAS LAS MÉTRICAS DISPONIBLES:');
    kpiData.forEach(metric => {
      console.log(`- "${metric.metric}"`);
    });
    
  } catch (error) {
    console.error('❌ Error al verificar métricas:', error);
  }
}

debugMetrics();