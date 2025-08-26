const fs = require('fs');
const Papa = require('papaparse');

async function debugFiltersIssue() {
  console.log('🔍 Debugging filters issue...');
  
  try {
    // Leer archivo de datos principal
    const dataPath = './public/datos.csv';
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    
    // Leer archivo de ejecutivos para analizar
    const executivesPath = './public/ejecutivos para analizar.csv';
    const executivesContent = fs.readFileSync(executivesPath, 'utf8');
    
    console.log('\n📊 Parsing main data file...');
    const dataResult = Papa.parse(dataContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    });
    
    console.log('\n📊 Parsing executives file...');
    const executivesResult = Papa.parse(executivesContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    });
    
    const data = dataResult.data;
    const executives = executivesResult.data;
    
    console.log('\n📈 Data Analysis:');
    console.log(`Total records in main data: ${data.length}`);
    console.log(`Total executives to analyze: ${executives.length}`);
    
    // Verificar headers
    console.log('\n🔍 Headers in main data:');
    console.log(Object.keys(data[0] || {}));
    
    console.log('\n🔍 Headers in executives file:');
    console.log(Object.keys(executives[0] || {}));
    
    // Analizar duplicados en datos principales
    console.log('\n🔍 Analyzing duplicates in main data...');
    const executiveNames = data.map(r => r.EJECUTIVO_FINAL).filter(Boolean);
    const uniqueExecutives = [...new Set(executiveNames)];
    console.log(`Unique executives in data: ${uniqueExecutives.length}`);
    console.log(`Total executive records: ${executiveNames.length}`);
    console.log(`Duplicates found: ${executiveNames.length - uniqueExecutives.length}`);
    
    // Encontrar ejecutivos con más registros
    const executiveCounts = {};
    executiveNames.forEach(name => {
      executiveCounts[name] = (executiveCounts[name] || 0) + 1;
    });
    
    const duplicatedExecutives = Object.entries(executiveCounts)
      .filter(([name, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    console.log('\n📊 Top 10 executives with most records:');
    duplicatedExecutives.forEach(([name, count]) => {
      console.log(`  ${name}: ${count} records`);
    });
    
    // Verificar coincidencias entre archivos
    console.log('\n🔍 Checking matches between files...');
    const executivesToAnalyzeNames = executives.map(e => e.EJECUTIVO_FINAL || e['EJECUTIVO_FINAL']).filter(Boolean);
    const dataExecutiveNames = [...new Set(data.map(r => r.EJECUTIVO_FINAL).filter(Boolean))];
    
    console.log(`Executives in analysis file: ${executivesToAnalyzeNames.length}`);
    console.log(`Unique executives in data file: ${dataExecutiveNames.length}`);
    
    // Encontrar coincidencias exactas
    const exactMatches = executivesToAnalyzeNames.filter(analysisName => 
      dataExecutiveNames.some(dataName => 
        dataName.toLowerCase().trim() === analysisName.toLowerCase().trim()
      )
    );
    
    console.log(`Exact matches: ${exactMatches.length}`);
    
    // Encontrar ejecutivos en análisis pero no en datos
    const notInData = executivesToAnalyzeNames.filter(analysisName => 
      !dataExecutiveNames.some(dataName => 
        dataName.toLowerCase().trim() === analysisName.toLowerCase().trim()
      )
    );
    
    console.log(`Executives in analysis but NOT in data: ${notInData.length}`);
    if (notInData.length > 0) {
      console.log('Sample executives not in data:');
      notInData.slice(0, 5).forEach(name => console.log(`  "${name}"`));
    }
    
    // Encontrar ejecutivos en datos pero no en análisis
    const notInAnalysis = dataExecutiveNames.filter(dataName => 
      !executivesToAnalyzeNames.some(analysisName => 
        analysisName.toLowerCase().trim() === dataName.toLowerCase().trim()
      )
    );
    
    console.log(`Executives in data but NOT in analysis: ${notInAnalysis.length}`);
    if (notInAnalysis.length > 0) {
      console.log('Sample executives not in analysis:');
      notInAnalysis.slice(0, 5).forEach(name => console.log(`  "${name}"`));
    }
    
    // Analizar tipos de ejecutivo
    console.log('\n🔍 Analyzing executive types...');
    const tipoEjecutivoField = 'TIPO EJECUTIVO';
    const tiposInData = [...new Set(data.map(r => r[tipoEjecutivoField]).filter(Boolean))];
    console.log('Tipos de ejecutivo in main data:');
    tiposInData.forEach(tipo => console.log(`  "${tipo}"`));
    
    const tiposInAnalysis = [...new Set(executives.map(e => e.TIPO_EJECUTIVO || e['TIPO EJECUTIVO']).filter(Boolean))];
    console.log('Tipos de ejecutivo in analysis file:');
    tiposInAnalysis.forEach(tipo => console.log(`  "${tipo}"`));
    
    // Verificar filtros
    console.log('\n🔍 Testing filter functionality...');
    const filterTypes = ['tipoEjecutivo', 'segmento', 'ciudad', 'agencia'];
    
    filterTypes.forEach(filterType => {
      console.log(`\n📊 Filter: ${filterType}`);
      let fieldName;
      switch (filterType) {
        case 'tipoEjecutivo':
          fieldName = 'TIPO EJECUTIVO';
          break;
        case 'segmento':
          fieldName = 'SEGMENTO';
          break;
        case 'ciudad':
          fieldName = 'CIUDAD';
          break;
        case 'agencia':
          fieldName = 'AGENCIA';
          break;
      }
      
      const uniqueValues = [...new Set(data.map(r => r[fieldName]).filter(Boolean))];
      console.log(`  Unique values: ${uniqueValues.length}`);
      console.log(`  Sample values: ${uniqueValues.slice(0, 3).join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugFiltersIssue();