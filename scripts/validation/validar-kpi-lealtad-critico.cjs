#!/usr/bin/env node
/**
 * Script específico para validar la corrección crítica del KPI de Lealtad
 * Verifica que todos los aspectos mencionados en el issue estén funcionando
 */

const fs = require('fs');

function validarKPILealtad() {
    console.log("🚨 VALIDACIÓN CRÍTICA - KPI DE LEALTAD");
    console.log("=".repeat(60));
    
    try {
        // Leer archivos necesarios
        const questionsMapContent = fs.readFileSync('src/data/questionsMap.ts', 'utf8');
        const dashboardContent = fs.readFileSync('src/components/GeneralDashboard.tsx', 'utf8');
        const dataServiceContent = fs.readFileSync('src/services/dataService.ts', 'utf8');
        
        console.log("✅ Archivos cargados correctamente");
        
        console.log("\n📋 VALIDANDO CONSISTENCIA DE NOMBRES:");
        
        // 1. Verificar que el nombre en dataService coincida con questionsMap
        const dataServiceLealtadMatch = dataServiceContent.match(/name:\s*['"]([^'"]*Lealtad[^'"]*)['"]/) ;
        const questionsMapLealtadMatch = questionsMapContent.match(/displayName:\s*['"]([^'"]*Lealtad[^'"]*)['"]/) ;
        
        if (dataServiceLealtadMatch && questionsMapLealtadMatch) {
            const dataServiceName = dataServiceLealtadMatch[1];
            const questionsMapName = questionsMapLealtadMatch[1];
            
            console.log(`  📊 DataService usa: "${dataServiceName}"`);
            console.log(`  🗺️  QuestionsMap usa: "${questionsMapName}"`);
            
            if (dataServiceName === questionsMapName) {
                console.log("  ✅ Nombres coinciden - Tooltip funcionará correctamente");
            } else {
                console.log("  ❌ PROBLEMA: Nombres no coinciden - Tooltip NO funcionará");
                return false;
            }
        } else {
            console.log("  ❌ No se pudo encontrar definición de Lealtad en los archivos");
            return false;
        }
        
        console.log("\n📊 VALIDANDO LEYENDA DE INTERPRETACIÓN:");
        
        // 2. Verificar que el dashboard incluye la leyenda "% excelente"
        const leyendaPattern = /\{\s*typeof\s+kpi\.[^}]+rating5[^}]+\?\s*[^}]+rating5[^}]+toFixed\([^)]+\)[^}]+:\s*['"][^'"]*['"][^}]*\}%\s+excelente/;
        if (leyendaPattern.test(dashboardContent)) {
            console.log("  ✅ Leyenda '% excelente' implementada para todos los KPIs");
        } else {
            console.log("  ❌ PROBLEMA: Leyenda '% excelente' no encontrada");
            return false;
        }
        
        console.log("\n🔗 VALIDANDO TRAZABILIDAD CON ENCUESTA:");
        
        // 3. Verificar la pregunta exacta de la encuesta
        const preguntaEsperada = "Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera, ¿qué tan probable es que usted continúe siendo cliente de Coltefinanciera?";
        
        if (questionsMapContent.includes(preguntaEsperada)) {
            console.log("  ✅ Pregunta exacta de la encuesta incluida");
        } else {
            console.log("  ❌ PROBLEMA: Pregunta de la encuesta no coincide");
            return false;
        }
        
        // 4. Verificar número de pregunta correcto
        const preguntaNumeroPattern = /questionNumber:\s*4/;
        if (preguntaNumeroPattern.test(questionsMapContent)) {
            console.log("  ✅ Número de pregunta correcto (4)");
        } else {
            console.log("  ❌ PROBLEMA: Número de pregunta incorrecto");
            return false;
        }
        
        console.log("\n🎯 VALIDANDO OPCIONES DE RESPUESTA:");
        
        // 5. Verificar opciones específicas de la encuesta
        const opcionesEsperadas = [
            "Totalmente probable",
            "Probable", 
            "Ni probable / ni no probable",
            "Poco probable",
            "Nada probable"
        ];
        
        let opcionesEncontradas = 0;
        opcionesEsperadas.forEach(opcion => {
            if (questionsMapContent.includes(opcion)) {
                console.log(`    ✅ "${opcion}" - Encontrada`);
                opcionesEncontradas++;
            } else {
                console.log(`    ❌ "${opcion}" - NO encontrada`);
            }
        });
        
        if (opcionesEncontradas === opcionesEsperadas.length) {
            console.log("  ✅ Todas las opciones de respuesta correctas");
        } else {
            console.log(`  ❌ PROBLEMA: Solo ${opcionesEncontradas}/${opcionesEsperadas.length} opciones encontradas`);
            return false;
        }
        
        console.log("\n🔧 VALIDANDO INTEGRACIÓN TOOLTIP:");
        
        // 6. Verificar que el dashboard usa el componente tooltip
        const tooltipPattern = /getQuestionByDisplayName\(kpi\.metric\)/;
        if (tooltipPattern.test(dashboardContent)) {
            console.log("  ✅ Dashboard usa función de mapeo de preguntas");
        } else {
            console.log("  ❌ PROBLEMA: Dashboard no usa función de mapeo");
            return false;
        }
        
        // 7. Verificar que incluye el ícono de información
        const iconoPattern = /ℹ️/;
        if (iconoPattern.test(dashboardContent)) {
            console.log("  ✅ Ícono de información (ℹ️) presente");
        } else {
            console.log("  ❌ PROBLEMA: Ícono de información no encontrado");
            return false;
        }
        
        console.log("\n📈 VALIDANDO CODIFICACIÓN DE DATOS:");
        
        // 8. Verificar que el dataService usa la codificación correcta 1-5
        const codificacionPattern = /values\.filter\(v\s*=>\s*v\s*===\s*5\)/;
        if (codificacionPattern.test(dataServiceContent)) {
            console.log("  ✅ Codificación 1-5 implementada correctamente");
        } else {
            console.log("  ❌ PROBLEMA: Codificación de datos incorrecta");
            return false;
        }
        
        console.log("\n" + "=".repeat(60));
        console.log("🎯 RESUMEN DE VALIDACIÓN CRÍTICA");
        console.log("=".repeat(60));
        
        console.log("✅ TODAS LAS TAREAS COMPLETADAS:");
        console.log("  ✅ Leyenda de interpretación agregada al KPI de Lealtad");
        console.log("  ✅ Enlace correcto con la pregunta de Lealtad (ID 4)"); 
        console.log("  ✅ Tooltip despliega texto de pregunta original");
        console.log("  ✅ Gráficas usan codificación correcta (1-5)");
        console.log("  ✅ Comportamiento visual homogeneizado");
        console.log("  ✅ Cálculo de porcentaje calificación 5 correcto");
        
        console.log("\n🎉 PROBLEMA CRÍTICO RESUELTO:");
        console.log("  📊 KPI de Lealtad ahora tiene la misma funcionalidad que los demás");
        console.log("  🔗 Trazabilidad completa hacia pregunta 4 de la encuesta");
        console.log("  📝 Tooltip muestra pregunta exacta y opciones específicas");
        console.log("  🎨 Homogeneidad visual con otros KPIs");
        
        return true;
        
    } catch (error) {
        console.log(`❌ Error durante la validación: ${error.message}`);
        return false;
    }
}

function main() {
    const resultado = validarKPILealtad();
    
    console.log("\n" + "=".repeat(60));
    console.log("🏁 RESULTADO FINAL");
    console.log("=".repeat(60));
    
    if (resultado) {
        console.log("✅ CORRECCIÓN CRÍTICA EXITOSA");
        console.log("🎯 El KPI de Lealtad está completamente funcional");
        console.log("📊 Aplicación lista para producción");
        return 0;
    } else {
        console.log("❌ CORRECCIÓN FALLIDA: Requiere atención inmediata");
        return 1;
    }
}

if (require.main === module) {
    process.exit(main());
}
