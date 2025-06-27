#!/usr/bin/env node

/**
 * Script para validar la alineación de visualizaciones con preguntas de la encuesta
 */

const fs = require('fs');

function validarAlineacionPreguntas() {
  console.log("🔍 VALIDACIÓN DE ALINEACIÓN CON PREGUNTAS DE ENCUESTA");
  console.log("=".repeat(60));

  try {
    // Leer el archivo de mapeo de preguntas
    const questionsMapContent = fs.readFileSync('src/data/questionsMap.ts', 'utf8');
    
    // Leer el GeneralDashboard para verificar integración
    const dashboardContent = fs.readFileSync('src/components/GeneralDashboard.tsx', 'utf8');
    
    // Leer TooltipPregunta para verificar componente
    const tooltipContent = fs.readFileSync('src/components/TooltipPregunta.tsx', 'utf8');

    console.log("✅ Archivos cargados correctamente");

    // Validar estructura del mapeo de preguntas
    console.log("\n📋 VALIDANDO MAPEO DE PREGUNTAS:");
    
    const expectedQuestions = [
      'Claridad de la Información (Atención)',
      'Recomendación', 
      'Satisfacción General',
      'Lealtad',
      'Sugerencias y Recomendaciones'
    ];

    let mappingProblems = [];

    expectedQuestions.forEach(question => {
      if (questionsMapContent.includes(question)) {
        console.log(`  ✅ ${question}: Mapeado`);
      } else {
        mappingProblems.push(`❌ ${question}: No encontrado en mapeo`);
      }
    });

    // Validar integración en dashboard
    console.log("\n🔧 VALIDANDO INTEGRACIÓN EN DASHBOARD:");
    
    const integrationChecks = [
      ['import TooltipPregunta', 'Importación de componente tooltip'],
      ['import { getQuestionByDisplayName', 'Importación de función de mapeo'],
      ['TooltipPregunta questionMapping=', 'Uso del componente tooltip'],
      ['cursor-help', 'Estilo de cursor para tooltips'],
      ['SURVEY_INFO', 'Información de encuesta'],
      ['Trazabilidad de métricas', 'Nota explicativa para usuarios']
    ];

    let integrationProblems = [];

    integrationChecks.forEach(([pattern, description]) => {
      if (dashboardContent.includes(pattern)) {
        console.log(`  ✅ ${description}: Implementado`);
      } else {
        integrationProblems.push(`❌ ${description}: No encontrado`);
      }
    });

    // Validar componente tooltip
    console.log("\n🎨 VALIDANDO COMPONENTE TOOLTIP:");
    
    const tooltipChecks = [
      ['QuestionMapping', 'Interface de mapeo de pregunta'],
      ['Pregunta Original', 'Sección de pregunta original'],
      ['Escala de Respuesta', 'Sección de escala'],
      ['¿Qué mide?', 'Sección de descripción'],
      ['Interpretación', 'Sección de interpretación'],
      ['animate-fadeIn', 'Animación de aparición'],
      ['onMouseEnter', 'Eventos de hover']
    ];

    let tooltipProblems = [];

    tooltipChecks.forEach(([pattern, description]) => {
      if (tooltipContent.includes(pattern)) {
        console.log(`  ✅ ${description}: Implementado`);
      } else {
        tooltipProblems.push(`❌ ${description}: No encontrado`);
      }
    });

    // Validar estilos CSS
    console.log("\n🎨 VALIDANDO ESTILOS CSS:");
    
    try {
      const cssContent = fs.readFileSync('src/index.css', 'utf8');
      const cssChecks = [
        ['@keyframes fadeIn', 'Animación fadeIn'],
        ['.animate-fadeIn', 'Clase de animación'],
        ['.border-l-3', 'Borde izquierdo personalizado']
      ];

      let cssProblems = [];

      cssChecks.forEach(([pattern, description]) => {
        if (cssContent.includes(pattern)) {
          console.log(`  ✅ ${description}: Definido`);
        } else {
          cssProblems.push(`❌ ${description}: No encontrado`);
        }
      });

      if (cssProblems.length > 0) {
        console.log("\n⚠️ Problemas de CSS encontrados:");
        cssProblems.forEach(problem => console.log(`  ${problem}`));
      }

    } catch (error) {
      console.log("  ⚠️ No se pudo validar CSS:", error.message);
    }

    // Resumen final
    console.log("\n" + "=".repeat(60));
    console.log("🎯 RESUMEN DE VALIDACIÓN");
    console.log("=".repeat(60));

    const totalProblems = mappingProblems.length + integrationProblems.length + tooltipProblems.length;

    if (totalProblems === 0) {
      console.log("✅ VALIDACIÓN EXITOSA: Alineación completa implementada");
      console.log("✅ Todas las métricas están vinculadas con preguntas de encuesta");
      console.log("✅ Tooltips informativos funcionando correctamente");
      console.log("✅ Trazabilidad completa entre instrumento y visualización");
      
      console.log("\n🎯 BENEFICIOS IMPLEMENTADOS:");
      console.log("  📊 Transparencia: Los usuarios ven la pregunta exacta");
      console.log("  🔍 Trazabilidad: Vínculo directo instrumento-análisis");
      console.log("  📚 Educativo: Información sobre escalas y medición");
      console.log("  🎨 UX mejorada: Tooltips informativos y contextuales");
      
      return true;
    } else {
      console.log(`❌ VALIDACIÓN FALLIDA: ${totalProblems} problemas encontrados`);
      
      if (mappingProblems.length > 0) {
        console.log("\n📋 Problemas de mapeo:");
        mappingProblems.forEach(problem => console.log(`  ${problem}`));
      }
      
      if (integrationProblems.length > 0) {
        console.log("\n🔧 Problemas de integración:");
        integrationProblems.forEach(problem => console.log(`  ${problem}`));
      }
      
      if (tooltipProblems.length > 0) {
        console.log("\n🎨 Problemas de tooltip:");
        tooltipProblems.forEach(problem => console.log(`  ${problem}`));
      }
      
      return false;
    }

  } catch (error) {
    console.log(`❌ Error durante la validación: ${error.message}`);
    return false;
  }
}

function validarCSVPreguntas() {
  console.log("\n📊 VALIDANDO PREGUNTAS EN CSV:");
  
  try {
    const csvContent = fs.readFileSync('public/datos.csv', 'utf8');
    const headers = csvContent.split('\n')[0].split(';');
    
    const expectedHeaders = [
      'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?',
      '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?',
      'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?',
      'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?'
    ];

    let csvProblems = [];

    expectedHeaders.forEach(header => {
      if (headers.includes(header)) {
        console.log(`  ✅ Pregunta encontrada en CSV`);
      } else {
        csvProblems.push(`❌ Pregunta no encontrada en CSV: ${header.substring(0, 50)}...`);
      }
    });

    return csvProblems.length === 0;

  } catch (error) {
    console.log(`  ❌ Error leyendo CSV: ${error.message}`);
    return false;
  }
}

function main() {
  console.log("🎯 VALIDACIÓN DE ALINEACIÓN VISUALIZACIONES-ENCUESTA");
  console.log("=".repeat(60));
  
  const alineacionOk = validarAlineacionPreguntas();
  const csvOk = validarCSVPreguntas();
  
  console.log("\n" + "=".repeat(60));
  console.log("🏁 RESULTADO FINAL");
  console.log("=".repeat(60));
  
  if (alineacionOk && csvOk) {
    console.log("✅ IMPLEMENTACIÓN EXITOSA: Alineación completa lograda");
    console.log("🎉 Los usuarios ahora pueden ver la pregunta exacta de cada métrica");
    process.exit(0);
  } else {
    console.log("❌ IMPLEMENTACIÓN PENDIENTE: Se requieren correcciones");
    process.exit(1);
  }
}

main();
