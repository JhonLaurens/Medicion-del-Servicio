const fs = require('fs');
const Papa = require('papaparse');

console.log('🧪 Testing filter functionality...\n');

// Leer datos principales
const mainDataPath = 'public/datos.csv';
const executivesDataPath = 'public/ejecutivos para analizar.csv';

if (!fs.existsSync(mainDataPath)) {
  console.error('❌ Main data file not found:', mainDataPath);
  process.exit(1);
}

if (!fs.existsSync(executivesDataPath)) {
  console.error('❌ Executives data file not found:', executivesDataPath);
  process.exit(1);
}

// Leer archivo principal
const mainCsvContent = fs.readFileSync(mainDataPath, 'utf-8');
const mainData = Papa.parse(mainCsvContent, {
  header: true,
  delimiter: ';',
  skipEmptyLines: true
}).data;

// Leer archivo de ejecutivos
const executivesCsvContent = fs.readFileSync(executivesDataPath, 'utf-8');
const executivesData = Papa.parse(executivesCsvContent, {
  header: true,
  delimiter: ';',
  skipEmptyLines: true,
  transformHeader: (header) => {
    const trimmedHeader = header.trim();
    if (trimmedHeader === 'TIPO EJECUTIVO') {
      return 'TIPO_EJECUTIVO';
    }
    return trimmedHeader;
  }
}).data;

console.log('📊 Data loaded:');
console.log(`   Main data: ${mainData.length} records`);
console.log(`   Executives: ${executivesData.length} records\n`);

// Filtrar datos por ejecutivos para analizar
const filteredRecords = mainData.filter((record) => {
  const ejecutivoName = record.EJECUTIVO_FINAL;
  return executivesData.some((executive) => {
    const normalizedExecutiveName = executive.EJECUTIVO_FINAL.toLowerCase().trim();
    const normalizedRecordName = ejecutivoName?.toLowerCase().trim() || "";
    return normalizedExecutiveName === normalizedRecordName;
  });
});

console.log(`📋 Filtered records for analysis: ${filteredRecords.length}`);

// Eliminar duplicados por ejecutivo
const uniqueExecutiveRecords = new Map();
filteredRecords.forEach((record) => {
  const ejecutivoName = record.EJECUTIVO_FINAL;
  if (!uniqueExecutiveRecords.has(ejecutivoName)) {
    uniqueExecutiveRecords.set(ejecutivoName, []);
  }
  uniqueExecutiveRecords.get(ejecutivoName).push(record);
});

console.log(`👥 Unique executives: ${uniqueExecutiveRecords.size}`);

// Crear datos de managers sin duplicados
const managersArray = Array.from(uniqueExecutiveRecords.entries()).map(([managerName, records]) => {
  const firstRecord = records[0];
  const totalSurveys = records.length;
  
  const executiveInfo = executivesData.find((executive) => {
    const normalizedExecutiveName = executive.EJECUTIVO_FINAL.toLowerCase().trim();
    const normalizedRecordName = managerName.toLowerCase().trim();
    return normalizedExecutiveName === normalizedRecordName;
  });

  let tipoEjecutivo = executiveInfo?.TIPO_EJECUTIVO || firstRecord["TIPO EJECUTIVO"] || "Sin Tipo";
  tipoEjecutivo = tipoEjecutivo.toUpperCase();

  const agencia = executiveInfo?.AGENCIA || firstRecord.AGENCIA || "Sin Agencia";
  const segmento = executiveInfo?.SEGMENTO || firstRecord.SEGMENTO || "Sin Segmento";
  const ciudad = executiveInfo?.CIUDAD || firstRecord.CIUDAD || "Sin Ciudad";

  return {
    name: managerName,
    surveys: totalSurveys,
    tipoEjecutivo: tipoEjecutivo,
    agencia: agencia,
    segmento: segmento,
    ciudad: ciudad,
  };
});

console.log(`\n🔍 Testing filters:\n`);

// Test filtros
const filterTypes = ['tipoEjecutivo', 'segmento', 'ciudad', 'agencia'];

filterTypes.forEach(filterType => {
  console.log(`📊 Filter: ${filterType}`);
  
  // Obtener valores únicos
  const uniqueValues = [...new Set(
    managersArray.map((manager) => {
      switch (filterType) {
        case "tipoEjecutivo":
          return manager.tipoEjecutivo;
        case "segmento":
          return manager.segmento;
        case "ciudad":
          return manager.ciudad;
        case "agencia":
          return manager.agencia;
        default:
          return "Sin Clasificar";
      }
    }).filter(Boolean)
  )];

  console.log(`   Unique values: ${uniqueValues.length}`);
  uniqueValues.forEach(value => {
    const filtered = managersArray.filter((manager) => {
      switch (filterType) {
        case "tipoEjecutivo":
          return manager.tipoEjecutivo === value;
        case "segmento":
          return manager.segmento === value;
        case "ciudad":
          return manager.ciudad === value;
        case "agencia":
          return manager.agencia === value;
        default:
          return true;
      }
    });
    
    console.log(`     ${value}: ${filtered.length} executives`);
  });
  console.log('');
});

console.log('✅ Filter test completed successfully!');