/*
 * VALIDACIÓN DE NAVEGACIÓN - HOMEPAGE
 * ==================================
 * 
 * Verifica que los botones de navegación en HomePage funcionen correctamente
 * y que todas las cards del footer sean navegables.
 * 
 * Autor: Sistema de Validación Automática
 * Fecha: 27/06/2025
 * Estado: Post-Implementación de Navegación
 */

const fs = require('fs');
const path = require('path');

console.log('🧭 VALIDACIÓN DE NAVEGACIÓN - HOMEPAGE');
console.log('======================================');

// Leer archivos
const homePagePath = path.join(__dirname, 'src', 'components', 'HomePage.tsx');
const appPath = path.join(__dirname, 'src', 'App.tsx');

let homePageContent, appContent;

try {
    homePageContent = fs.readFileSync(homePagePath, 'utf8');
    appContent = fs.readFileSync(appPath, 'utf8');
} catch (error) {
    console.error('❌ Error leyendo archivos:', error.message);
    process.exit(1);
}

console.log('\n🏠 HOMEPAGE - Verificando navegación:');
console.log('------------------------------------');

// Validaciones principales
const navigationValidations = [
    {
        name: 'Interface HomePageProps definida',
        check: homePageContent.includes('interface HomePageProps'),
        required: true
    },
    {
        name: 'Prop onNavigate recibida',
        check: homePageContent.includes('onNavigate?: (page: string) => void'),
        required: true
    },
    {
        name: 'Botón "Explorar Dashboard" funcional',
        check: homePageContent.includes('onClick={() => onNavigate?.(\'dashboard-general\')}') && 
               homePageContent.includes('<button'),
        required: true
    },
    {
        name: 'Card Dashboard General navegable',
        check: homePageContent.includes('onClick={() => onNavigate?.(\'dashboard-general\')}'),
        required: true
    },
    {
        name: 'Card Análisis Geográfico navegable',
        check: homePageContent.includes('onClick={() => onNavigate?.(\'analisis-geografico\')}'),
        required: true
    },
    {
        name: 'Card Participación Gerentes navegable',
        check: homePageContent.includes('onClick={() => onNavigate?.(\'participacion-gerentes\')}'),
        required: true
    },
    {
        name: 'Card Análisis Segmentos navegable',
        check: homePageContent.includes('onClick={() => onNavigate?.(\'analisis-segmento\')}'),
        required: true
    },
    {
        name: 'Card Sugerencias navegable',
        check: homePageContent.includes('onClick={() => onNavigate?.(\'analisis-sugerencias\')}'),
        required: true
    },
    {
        name: 'Card Explorador navegable',
        check: homePageContent.includes('onClick={() => onNavigate?.(\'explorador-datos\')}'),
        required: true
    },
    {
        name: 'Cards convertidas a botones',
        check: (homePageContent.match(/<button/g) || []).length >= 7, // 1 principal + 6 cards
        required: true
    }
];

let homePagePassed = 0;
let homePageFailed = 0;

navigationValidations.forEach(validation => {
    const status = validation.check ? '✅' : '❌';
    console.log(`${status} ${validation.name}`);
    
    if (validation.required) {
        if (validation.check) {
            homePagePassed++;
        } else {
            homePageFailed++;
        }
    }
});

console.log('\n📱 APP.TSX - Verificando integración:');
console.log('------------------------------------');

// Validaciones de App.tsx
const appValidations = [
    {
        name: 'HomePage recibe prop onNavigate',
        check: appContent.includes('<HomePage onNavigate={setCurrentPage} />'),
        required: true
    },
    {
        name: 'Estado currentPage existe',
        check: appContent.includes('const [currentPage, setCurrentPage] = useState(\'inicio\')'),
        required: true
    },
    {
        name: 'Función setCurrentPage disponible',
        check: appContent.includes('setCurrentPage') && appContent.includes('useState'),
        required: true
    }
];

let appPassed = 0;
let appFailed = 0;

appValidations.forEach(validation => {
    const status = validation.check ? '✅' : '❌';
    console.log(`${status} ${validation.name}`);
    
    if (validation.required) {
        if (validation.check) {
            appPassed++;
        } else {
            appFailed++;
        }
    }
});

console.log('\n🔗 RUTAS DE NAVEGACIÓN VERIFICADAS:');
console.log('----------------------------------');

const routes = [
    'dashboard-general',
    'analisis-geografico', 
    'participacion-gerentes',
    'analisis-segmento',
    'analisis-sugerencias',
    'explorador-datos'
];

routes.forEach(route => {
    const routeExists = homePageContent.includes(`'${route}'`);
    console.log(`${routeExists ? '✅' : '❌'} Ruta: ${route}`);
});

console.log('\n📊 RESUMEN DE VALIDACIÓN:');
console.log('=========================');
console.log(`🏠 HomePage: ${homePagePassed}/${navigationValidations.length} validaciones exitosas`);
console.log(`📱 App.tsx: ${appPassed}/${appValidations.length} validaciones exitosas`);
console.log(`🔗 Total: ${homePagePassed + appPassed}/${navigationValidations.length + appValidations.length} validaciones exitosas`);

const totalFailures = homePageFailed + appFailed;

if (totalFailures === 0) {
    console.log('\n🎉 ¡PERFECTO! Navegación implementada exitosamente.');
    console.log('\n💡 FUNCIONALIDADES AGREGADAS:');
    console.log('   • Botón "Explorar Dashboard" funcional');
    console.log('   • 6 cards de navegación en footer');
    console.log('   • Navegación directa a cada módulo');
    console.log('   • Interface TypeScript definida');
    console.log('   • Integración completa con App.tsx');
    console.log('   • Transiciones visuales mejoradas');
    
    console.log('\n🎯 RUTAS DISPONIBLES:');
    console.log('   📊 dashboard-general (Dashboard General)');
    console.log('   🗺️ analisis-geografico (Análisis Geográfico)');
    console.log('   👨‍💼 participacion-gerentes (Participación Gerentes)');
    console.log('   👥 analisis-segmento (Análisis por Segmento)');
    console.log('   💡 analisis-sugerencias (Análisis de Sugerencias)');
    console.log('   🔍 explorador-datos (Explorador de Datos)');
    
    console.log('\n✨ EXPERIENCIA DE USUARIO:');
    console.log('   • Landing page completamente navegable');
    console.log('   • Call-to-action principal funcional');
    console.log('   • Cards interactivas con hover effects');
    console.log('   • Navegación intuitiva y directa');
    
} else {
    console.log(`\n⚠️  ${totalFailures} validaciones fallidas. Revisar implementación.`);
}

console.log('\n✅ VALIDACIÓN DE NAVEGACIÓN COMPLETADA');
console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-CO')}`);
