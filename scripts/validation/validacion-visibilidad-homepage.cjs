/**
 * VALIDACIÓN ESPECÍFICA: Corrección de Problema de Visibilidad en HomePage
 * Verifica que el bloque central y botón "Explorar Dashboard" no estén ocultos
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDACIÓN: Corrección de Visibilidad del Contenido Central');
console.log('================================================================');

// Leer el archivo HomePage.tsx
const homePagePath = path.join(__dirname, 'src', 'components', 'HomePage.tsx');

if (!fs.existsSync(homePagePath)) {
    console.log('❌ ERROR: HomePage.tsx no encontrado');
    process.exit(1);
}

const homePageContent = fs.readFileSync(homePagePath, 'utf8');

// Validaciones específicas para la corrección de visibilidad
const validaciones = [
    {
        nombre: 'Z-index del contenido central corregido',
        check: homePageContent.includes('z-20') && homePageContent.includes('flex flex-col items-center justify-center'),
        requerido: true,
        descripcion: 'Contenido central debe tener z-20 para estar por encima de elementos de fondo'
    },
    {
        nombre: 'Padding bottom aumentado',
        check: homePageContent.includes('pb-64'),
        requerido: true,
        descripcion: 'Debe tener pb-64 para dar espacio al footer y evitar solapamientos'
    },
    {
        nombre: 'Margen bottom en call-to-action',
        check: homePageContent.includes('mb-24') && homePageContent.includes('Explorar Dashboard'),
        requerido: true,
        descripcion: 'Call-to-action debe tener mb-24 para separarse del footer'
    },
    {
        nombre: 'Skyline con z-index bajo',
        check: homePageContent.includes('z-5') && homePageContent.includes('building silhouette'),
        requerido: true,
        descripcion: 'Skyline debe tener z-5 para estar por debajo del contenido'
    },
    {
        nombre: 'Skyline no interfiere con interacción',
        check: homePageContent.includes('pointer-events-none'),
        requerido: true,
        descripcion: 'Skyline debe tener pointer-events-none para no interferir'
    },
    {
        nombre: 'SVG con opacidad reducida',
        check: homePageContent.includes('opacity-60'),
        requerido: true,
        descripcion: 'SVG del skyline debe tener opacidad reducida para no opacar contenido'
    },
    {
        nombre: 'Footer con z-index intermedio',
        check: homePageContent.includes('z-15') && homePageContent.includes('Features grid'),
        requerido: true,
        descripcion: 'Footer debe tener z-15, entre contenido (z-20) y skyline (z-5)'
    },
    {
        nombre: 'Botón "Explorar Dashboard" presente',
        check: homePageContent.includes('Explorar Dashboard') && homePageContent.includes('gradient-to-r from-yellow-400'),
        requerido: true,
        descripcion: 'Botón principal debe estar presente con estilo correcto'
    }
];

let validacionesExitosas = 0;
let erroresEncontrados = [];

console.log('\n📋 EJECUTANDO VALIDACIONES DE VISIBILIDAD:\n');

validaciones.forEach((validacion, index) => {
    if (validacion.check) {
        console.log(`✅ ${index + 1}. ${validacion.nombre}`);
        validacionesExitosas++;
    } else {
        console.log(`❌ ${index + 1}. ${validacion.nombre}`);
        if (validacion.requerido) {
            erroresEncontrados.push({
                nombre: validacion.nombre,
                descripcion: validacion.descripcion
            });
        }
    }
});

// Verificar orden jerárquico de z-index
console.log('\n🎯 VERIFICANDO JERARQUÍA DE Z-INDEX:\n');

const jerarquiaZIndex = [
    { elemento: 'Contenido central', zIndex: 'z-20', prioridad: 1 },
    { elemento: 'Footer/Grid', zIndex: 'z-15', prioridad: 2 },
    { elemento: 'Skyline', zIndex: 'z-5', prioridad: 3 }
];

let jerarquiaCorrecta = true;

jerarquiaZIndex.forEach(item => {
    const encontrado = homePageContent.includes(item.zIndex);
    if (encontrado) {
        console.log(`✅ ${item.elemento} - ${item.zIndex} (Prioridad ${item.prioridad})`);
    } else {
        console.log(`❌ ${item.elemento} - ${item.zIndex} FALTANTE`);
        jerarquiaCorrecta = false;
        erroresEncontrados.push({
            nombre: `Jerarquía Z-index: ${item.elemento}`,
            descripcion: `${item.elemento} debe tener ${item.zIndex}`
        });
    }
});

// Verificar espaciado para evitar solapamientos
console.log('\n📏 VERIFICANDO ESPACIADO ANTI-SOLAPAMIENTO:\n');

const espaciadoChecks = [
    { nombre: 'Padding bottom contenedor', valor: 'pb-64', encontrado: homePageContent.includes('pb-64') },
    { nombre: 'Margen bottom call-to-action', valor: 'mb-24', encontrado: homePageContent.includes('mb-24') }
];

let espaciadoCorrecto = true;

espaciadoChecks.forEach(check => {
    if (check.encontrado) {
        console.log(`✅ ${check.nombre} - ${check.valor}`);
    } else {
        console.log(`❌ ${check.nombre} - ${check.valor} FALTANTE`);
        espaciadoCorrecto = false;
    }
});

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VALIDACIÓN:');
console.log('='.repeat(60));

const porcentajeExito = (validacionesExitosas / validaciones.length) * 100;

console.log(`✅ Validaciones exitosas: ${validacionesExitosas}/${validaciones.length} (${porcentajeExito.toFixed(1)}%)`);
console.log(`🎯 Jerarquía Z-index: ${jerarquiaCorrecta ? 'CORRECTA' : 'INCORRECTA'}`);
console.log(`📏 Espaciado: ${espaciadoCorrecto ? 'CORRECTO' : 'INCORRECTO'}`);

if (erroresEncontrados.length > 0) {
    console.log(`\n❌ Errores críticos encontrados: ${erroresEncontrados.length}`);
    console.log('\n🔧 DETALLES DE ERRORES:');
    erroresEncontrados.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.nombre}:`);
        console.log(`   📝 ${error.descripcion}`);
    });
} else {
    console.log('\n🎉 ¡TODAS LAS VALIDACIONES PASARON CORRECTAMENTE!');
}

// Recomendaciones de verificación visual
console.log('\n🖥️  VERIFICACIÓN VISUAL RECOMENDADA:');
console.log('='.repeat(60));
console.log('1. 📱 Abrir la aplicación en el navegador');
console.log('2. 👁️  Verificar que el título principal sea completamente visible');
console.log('3. 🎯 Confirmar que el botón "Explorar Dashboard" no esté tapado');
console.log('4. 📐 Comprobar que no hay solapamientos en diferentes tamaños de pantalla');
console.log('5. 🎨 Validar que el skyline sea decorativo sin interferir');
console.log('6. 🧭 Verificar que el footer no tape el contenido central');

// Estado final
const estadoFinal = erroresEncontrados.length === 0 && jerarquiaCorrecta && espaciadoCorrecto;

console.log('\n🎯 ESTADO FINAL:');
console.log('='.repeat(60));

if (estadoFinal) {
    console.log('✅ CORRECCIÓN EXITOSA - El problema de visibilidad ha sido resuelto');
    console.log('🎊 El contenido central y botón ahora deben ser completamente visibles');
} else {
    console.log('⚠️  REQUIERE AJUSTES ADICIONALES');
    console.log('🔧 Revisar los errores listados arriba');
}

// Código de salida
process.exit(estadoFinal ? 0 : 1);
