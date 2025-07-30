// Script para verificar el estado del reporte de participación de ejecutivos
// Ejecutar en la consola del navegador cuando esté en la página del reporte

console.log('🔍 DIAGNÓSTICO DEL REPORTE DE PARTICIPACIÓN DE EJECUTIVOS');
console.log('='.repeat(60));

// Verificar si React está disponible
if (typeof React !== 'undefined') {
    console.log('✅ React está disponible');
} else {
    console.log('❌ React no está disponible');
}

// Verificar acceso a archivos CSV
async function testCSVFiles() {
    console.log('\n📂 VERIFICANDO ACCESO A ARCHIVOS CSV:');
    
    try {
        // Test datos.csv
        const response1 = await fetch('/Medicion-del-Servicio/datos.csv');
        console.log(`📊 datos.csv: ${response1.status} ${response1.statusText}`);
        if (response1.ok) {
            const text1 = await response1.text();
            console.log(`   Tamaño: ${text1.length} caracteres`);
            const lines = text1.split('\n');
            console.log(`   Líneas: ${lines.length}`);
            console.log(`   Primera línea: ${lines[0]?.substring(0, 100)}...`);
        }
    } catch (error) {
        console.error('❌ Error cargando datos.csv:', error);
    }

    try {
        // Test ejecutivos para analizar.csv
        const response2 = await fetch('/Medicion-del-Servicio/ejecutivos para analizar.csv');
        console.log(`👥 ejecutivos para analizar.csv: ${response2.status} ${response2.statusText}`);
        if (response2.ok) {
            const text2 = await response2.text();
            console.log(`   Tamaño: ${text2.length} caracteres`);
            const lines = text2.split('\n');
            console.log(`   Líneas: ${lines.length}`);
            console.log(`   Primera línea: ${lines[0]?.substring(0, 100)}...`);
        }
    } catch (error) {
        console.error('❌ Error cargando ejecutivos para analizar.csv:', error);
    }
}

// Verificar servicios de datos
function testDataServices() {
    console.log('\n🔧 VERIFICANDO SERVICIOS DE DATOS:');
    
    // Intentar crear instancias de los servicios
    try {
        // Esto solo funcionará si los módulos están disponibles globalmente
        console.log('Intentando verificar servicios...');
        console.log('Nota: Esto requiere acceso a los módulos internos de React');
    } catch (error) {
        console.log('⚠️ No se pueden verificar los servicios desde la consola');
    }
}

// Verificar elementos DOM
function checkDOMElements() {
    console.log('\n🎯 VERIFICANDO ELEMENTOS DOM:');
    
    // Buscar el contenedor del reporte
    const reportContainer = document.querySelector('[class*="space-y-8"]');
    console.log('📋 Contenedor del reporte:', reportContainer ? '✅ Encontrado' : '❌ No encontrado');
    
    // Buscar tablas
    const tables = document.querySelectorAll('table');
    console.log(`📊 Tablas encontradas: ${tables.length}`);
    
    // Buscar mensajes de "no datos"
    const noDataMessages = document.querySelectorAll('*');
    let foundNoDataMessage = false;
    noDataMessages.forEach(el => {
        if (el.textContent && el.textContent.includes('No se encontraron datos')) {
            console.log('⚠️ Mensaje "No se encontraron datos" encontrado:', el.textContent);
            foundNoDataMessage = true;
        }
    });
    
    if (!foundNoDataMessage) {
        console.log('✅ No se encontró mensaje de "No datos"');
    }
    
    // Verificar si hay datos en las tablas
    tables.forEach((table, index) => {
        const rows = table.querySelectorAll('tbody tr');
        console.log(`   Tabla ${index + 1}: ${rows.length} filas de datos`);
    });
}

// Ejecutar todas las verificaciones
async function runDiagnostics() {
    await testCSVFiles();
    testDataServices();
    checkDOMElements();
    
    console.log('\n🎯 INSTRUCCIONES:');
    console.log('1. Copia y pega este script en la consola del navegador');
    console.log('2. Navega al reporte de participación de ejecutivos');
    console.log('3. Ejecuta: runDiagnostics()');
    console.log('4. Revisa los resultados para identificar el problema');
}

// Auto-ejecutar si estamos en la página correcta
if (window.location.pathname.includes('Medicion-del-Servicio')) {
    console.log('🚀 Ejecutando diagnósticos automáticamente...');
    runDiagnostics();
} else {
    console.log('⚠️ Navega al reporte de participación de ejecutivos y ejecuta: runDiagnostics()');
}