// Script de debug para verificar la coincidencia de ejecutivos
// Ejecutar en la consola del navegador después de cargar la aplicación

console.log('🔍 DEBUGGING EXECUTIVE MATCHING');
console.log('================================');

// Variables para almacenar los datos
let dataExecutives = [];

// Simular la carga de datos
fetch('/Medicion-del-Servicio/datos.csv')
  .then(response => response.text())
  .then(csvText => {
    const dataLines = csvText.split('\n');
    console.log('📊 Total lines in datos.csv:', dataLines.length);
    console.log('📊 Total records (excluding header):', dataLines.length - 1);
    
    // Extraer ejecutivos únicos del archivo de datos
    dataExecutives = [];
    for (let i = 1; i < Math.min(dataLines.length, 20); i++) {
      const line = dataLines[i];
      if (line.trim()) {
        const columns = line.split(';');
        if (columns.length > 11) {
          const executive = columns[11]; // EJECUTIVO_FINAL está en la columna 11
          dataExecutives.push(executive);
        }
      }
    }
    
    console.log('🔍 Sample executives from datos.csv:');
    dataExecutives.forEach((exec, index) => {
      console.log(`  ${index + 1}: "${exec}"`);
    });
    
    return fetch('/Medicion-del-Servicio/ejecutivos%20para%20analizar.csv');
  })
  .then(response => response.text())
  .then(csvText => {
    const analysisLines = csvText.split('\n');
    console.log('📊 Total lines in ejecutivos para analizar.csv:', analysisLines.length);
    console.log('📊 Total executives to analyze (excluding header):', analysisLines.length - 1);
    
    // Extraer ejecutivos del archivo de análisis
    const analysisExecutives = [];
    for (let i = 1; i < Math.min(analysisLines.length, 10); i++) {
      const line = analysisLines[i];
      if (line.trim()) {
        const columns = line.split(';');
        if (columns.length > 0) {
          const executive = columns[0]; // EJECUTIVO_FINAL está en la primera columna
          analysisExecutives.push(executive);
        }
      }
    }
    
    console.log('🔍 Sample executives from ejecutivos para analizar.csv:');
    analysisExecutives.forEach((exec, index) => {
      console.log(`  ${index + 1}: "${exec}"`);
    });
    
    console.log('🔍 COMPARISON ANALYSIS:');
    console.log('======================');
    
    // Verificar si hay coincidencias exactas
    const matches = [];
    const dataExecsSample = dataExecutives.slice(0, 5);
    const analysisExecsSample = analysisExecutives.slice(0, 5);
    
    dataExecsSample.forEach(dataExec => {
      const found = analysisExecsSample.find(analysisExec => 
        analysisExec.toLowerCase().trim() === dataExec.toLowerCase().trim()
      );
      if (found) {
        matches.push({ data: dataExec, analysis: found });
      }
    });
    
    console.log('✅ Found matches:', matches.length);
    matches.forEach(match => {
      console.log(`  "${match.data}" === "${match.analysis}"`);
    });
    
    if (matches.length === 0) {
      console.log('❌ No exact matches found in sample. Checking for partial matches...');
      
      dataExecsSample.forEach(dataExec => {
        console.log(`\nChecking "${dataExec}":`);
        analysisExecsSample.forEach(analysisExec => {
          const similarity = dataExec.toLowerCase().includes(analysisExec.toLowerCase()) || 
                           analysisExec.toLowerCase().includes(dataExec.toLowerCase());
          if (similarity) {
            console.log(`  📝 Partial match with "${analysisExec}"`);
          }
        });
      });
    }
  })
  .catch(error => {
    console.error('❌ Error loading CSV files:', error);
  });