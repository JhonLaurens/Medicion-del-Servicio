// Debug script para verificar datos de gerentes
import { SatisfactionDataService } from './src/services/dataService.js';

const dataService = new SatisfactionDataService();

async function debugManagerData() {
  try {
    console.log('🚀 Loading data...');
    await dataService.loadData();
    
    const data = dataService.getData();
    console.log('📊 Total records:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('🔍 Available columns:', Object.keys(data[0]));
      
      // Buscar registros de gerentes de cuenta
      const managerRecords = data.filter(record => 
        record['TIPO EJECUTIVO']?.toUpperCase() === 'GERENTE DE CUENTA'
      );
      
      console.log('👥 Manager records found:', managerRecords.length);
      
      if (managerRecords.length > 0) {
        console.log('📋 Sample manager records:');
        managerRecords.slice(0, 5).forEach((record, index) => {
          console.log(`${index + 1}:`, {
            ejecutivo: record.EJECUTIVO,
            agencia: record.AGENCIA,
            segmento: record.SEGMENTO,
            tipoEjecutivo: record['TIPO EJECUTIVO']
          });
        });
        
        // Agrupar por ejecutivo
        const managerGroups = {};
        managerRecords.forEach(record => {
          const name = record.EJECUTIVO || 'Sin Asignar';
          if (!managerGroups[name]) {
            managerGroups[name] = 0;
          }
          managerGroups[name]++;
        });
        
        console.log('📈 Manager survey counts:');
        Object.entries(managerGroups).forEach(([name, count]) => {
          console.log(`  ${name}: ${count} encuestas`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugManagerData();