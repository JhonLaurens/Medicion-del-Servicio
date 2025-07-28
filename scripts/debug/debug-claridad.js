import fs from 'fs';

// Leer el archivo CSV
const csvContent = fs.readFileSync('public/datos.csv', 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(';');

console.log('📋 HEADERS DEL CSV:');
headers.forEach((header, index) => {
  console.log(`${index + 1}. "${header}"`);
});

// Buscar la columna de claridad
const claridadIndex = headers.findIndex(h => h.includes('información suministrada'));
console.log(`\n🔍 Índice de columna claridad: ${claridadIndex}`);

if (claridadIndex >= 0) {
  console.log(`✅ Columna encontrada: "${headers[claridadIndex]}"`);
  
  // Analizar los primeros 10 registros
  console.log('\n📊 PRIMEROS 10 VALORES:');
  for (let i = 1; i <= Math.min(10, lines.length - 1); i++) {
    const cells = lines[i].split(';');
    const claridadValue = cells[claridadIndex];
    console.log(`Registro ${i}: ${claridadValue}`);
  }
} else {
  console.log('❌ Columna de claridad no encontrada');
}
