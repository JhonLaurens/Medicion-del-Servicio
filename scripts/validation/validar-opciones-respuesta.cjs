#!/usr/bin/env node
/**
 * Script para validar que las opciones de respuesta específicas de la Encuesta de Satisfacción
 * están correctamente implementadas en el mapeo de preguntas
 */

const fs = require('fs');
const path = require('path');

function validarOpcionesRespuesta() {
    console.log("🎯 VALIDACIÓN DE OPCIONES DE RESPUESTA ESPECÍFICAS");
    console.log("=".repeat(60));
    
    try {
        // Leer el archivo de mapeo de preguntas
        const questionsMapPath = 'src/data/questionsMap.ts';
        const questionsMapContent = fs.readFileSync(questionsMapPath, 'utf8');
        
        console.log("✅ Archivo questionsMap.ts cargado correctamente");
        
        // Opciones de respuesta esperadas según la Encuesta 2024-2025
        const opcionesEsperadas = {
            'Claridad de la Información (Atención)': [
                { value: 5, label: 'Totalmente de acuerdo' },
                { value: 4, label: 'De acuerdo' },
                { value: 3, label: 'Ni en acuerdo / ni en desacuerdo' },
                { value: 2, label: 'En desacuerdo' },
                { value: 1, label: 'Totalmente en desacuerdo' }
            ],
            'Recomendación': [
                { value: 5, label: 'Totalmente probable' },
                { value: 4, label: 'Probable' },
                { value: 3, label: 'Ni probable ni no probable' },
                { value: 2, label: 'Poco probable' },
                { value: 1, label: 'Nada probable' }
            ],
            'Satisfacción General': [
                { value: 5, label: 'Totalmente satisfecho' },
                { value: 4, label: 'Satisfecho' },
                { value: 3, label: 'Ni satisfecho / ni insatisfecho' },
                { value: 2, label: 'Poco satisfecho' },
                { value: 1, label: 'Insatisfecho' }
            ],
            'Lealtad': [
                { value: 5, label: 'Totalmente probable' },
                { value: 4, label: 'Probable' },
                { value: 3, label: 'Ni probable / ni no probable' },
                { value: 2, label: 'Poco probable' },
                { value: 1, label: 'Nada probable' }
            ]
        };
        
        console.log("\n📋 VALIDANDO OPCIONES DE RESPUESTA:");
        
        let erroresEncontrados = [];
        
        // Verificar cada métrica
        Object.keys(opcionesEsperadas).forEach(metrica => {
            console.log(`\n🔍 Validando ${metrica}...`);
            
            const opciones = opcionesEsperadas[metrica];
            let metricaEncontrada = false;
            
            opciones.forEach(opcion => {
                const patron = `value: ${opcion.value}, label: '${opcion.label}'`;
                if (questionsMapContent.includes(patron)) {
                    console.log(`  ✅ Opción ${opcion.value}: "${opcion.label}" - Encontrada`);
                    metricaEncontrada = true;
                } else {
                    console.log(`  ❌ Opción ${opcion.value}: "${opcion.label}" - NO encontrada`);
                    erroresEncontrados.push(`${metrica} - Opción ${opcion.value}: "${opcion.label}"`);
                }
            });
        });
        
        // Verificar que la interfaz incluye responseOptions
        console.log("\n🔧 VALIDANDO INTERFACE:");
        if (questionsMapContent.includes('responseOptions: { value: number; label: string }[];')) {
            console.log("  ✅ Interface actualizada con responseOptions");
        } else {
            console.log("  ❌ Interface no incluye responseOptions");
            erroresEncontrados.push("Interface - responseOptions no definido");
        }
        
        // Verificar preguntas actualizadas
        console.log("\n📝 VALIDANDO PREGUNTAS ACTUALIZADAS:");
        const preguntasActualizadas = [
            'En general, ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?',
            'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera, ¿qué tan probable es que usted continúe siendo cliente de Coltefinanciera?'
        ];
        
        preguntasActualizadas.forEach(pregunta => {
            if (questionsMapContent.includes(pregunta)) {
                console.log(`  ✅ Pregunta actualizada encontrada: "${pregunta.substring(0, 50)}..."`);
            } else {
                console.log(`  ❌ Pregunta actualizada NO encontrada: "${pregunta.substring(0, 50)}..."`);
                erroresEncontrados.push(`Pregunta no actualizada: ${pregunta.substring(0, 30)}...`);
            }
        });
        
        console.log("\n" + "=".repeat(60));
        console.log("🎯 RESUMEN DE VALIDACIÓN");
        console.log("=".repeat(60));
        
        if (erroresEncontrados.length === 0) {
            console.log("✅ VALIDACIÓN EXITOSA: Todas las opciones de respuesta están correctamente implementadas");
            console.log("✅ Las preguntas incluyen el texto exacto de la Encuesta 2024-2025");
            console.log("✅ La interfaz está actualizada con responseOptions");
            console.log("\n🎉 BENEFICIOS IMPLEMENTADOS:");
            console.log("  📊 Opciones de respuesta específicas visibles en tooltips");
            console.log("  🎯 Colores diferenciados por valor de calificación");
            console.log("  📝 Texto exacto de la Encuesta Segmento Empresas 2024-2025");
            console.log("  🔍 Mayor precisión en la trazabilidad instrumento-análisis");
            return true;
        } else {
            console.log(`❌ VALIDACIÓN FALLIDA: Se encontraron ${erroresEncontrados.length} errores:`);
            erroresEncontrados.forEach(error => {
                console.log(`  ❌ ${error}`);
            });
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Error durante la validación: ${error.message}`);
        return false;
    }
}

function validarComponenteTooltip() {
    console.log("\n" + "=".repeat(60));
    console.log("🎨 VALIDANDO COMPONENTE TOOLTIP ACTUALIZADO");
    console.log("=".repeat(60));
    
    try {
        const tooltipPath = 'src/components/TooltipPregunta.tsx';
        const tooltipContent = fs.readFileSync(tooltipPath, 'utf8');
        
        const validacionesTooltip = [
            ('📊 Opciones de Respuesta', 'Sección de opciones actualizada'),
            ('questionMapping.responseOptions.length > 0', 'Validación de opciones disponibles'),
            ('questionMapping.responseOptions.map', 'Mapeo de opciones de respuesta'),
            ('bg-blue-600', 'Color azul para calificación 5'),
            ('bg-green-500', 'Color verde para calificación 4'),
            ('bg-red-500', 'Color rojo para calificaciones 1-3'),
            ('option.value', 'Mostrar valor numérico'),
            ('option.label', 'Mostrar etiqueta descriptiva')
        ];
        
        let errores = [];
        
        validacionesTooltip.forEach(([buscar, descripcion]) => {
            if (tooltipContent.includes(buscar)) {
                console.log(`  ✅ ${descripcion}: Implementado`);
            } else {
                console.log(`  ❌ ${descripcion}: NO encontrado`);
                errores.push(descripcion);
            }
        });
        
        if (errores.length === 0) {
            console.log("\n✅ Componente tooltip actualizado correctamente");
            return true;
        } else {
            console.log(`\n❌ Componente tooltip tiene ${errores.length} problemas`);
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Error validando tooltip: ${error.message}`);
        return false;
    }
}

function main() {
    const opcionesOk = validarOpcionesRespuesta();
    const tooltipOk = validarComponenteTooltip();
    
    console.log("\n" + "=".repeat(60));
    console.log("🏁 RESULTADO FINAL");
    console.log("=".repeat(60));
    
    if (opcionesOk && tooltipOk) {
        console.log("✅ VALIDACIÓN COMPLETA EXITOSA");
        console.log("🎯 Las opciones de respuesta específicas de la Encuesta 2024-2025 están implementadas");
        console.log("🎨 Los tooltips muestran las opciones exactas con colores diferenciados");
        console.log("📊 La información de 'Lealtad' ahora está completa y detallada");
        return 0;
    } else {
        console.log("❌ VALIDACIÓN FALLIDA: Requiere correcciones");
        return 1;
    }
}

if (require.main === module) {
    process.exit(main());
}
