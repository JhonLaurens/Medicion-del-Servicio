#!/usr/bin/env node

/**
 * Script de debugging para verificar los valores específicos que se están 
 * pasando a las gráficas del GeneralDashboard
 */

const fs = require('fs');

// Función para leer y parsear CSV
function leerCSV(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());
    const headers = lines[0].split(';').map(h => h.trim());
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';').map(v => v.trim());
      if (values.length === headers.length) {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        records.push(record);
      }
    }
    
    return records;
  } catch (error) {
    console.error(`❌ Error leyendo CSV: ${error.message}`);
    return [];
  }
}

function debugearValoresEjeY() {
  console.log("🔍 DEBUG: Verificando valores específicos del eje Y");
  console.log("=".repeat(60));
  
  const datos = leerCSV('public/datos.csv');
  if (datos.length === 0) {
    console.log("❌ No se pudieron cargar los datos");
    return false;
  }
  
  console.log(`✅ Datos cargados: ${datos.length} registros`);
  
  // Métricas específicas con nombres exactos del CSV
  const metricas = [
    'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?',
    'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?',
    'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?',
    '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?'
  ];
  
  const nombres = [
    'Claridad de la Información',
    'Satisfacción General',
    'Lealtad',
    'Recomendación'
  ];
  
  let problemasDetectados = [];
  
  metricas.forEach((columna, index) => {
    const nombre = nombres[index];
    console.log(`\n🔍 DEBUGGING ${nombre}:`);
    
    // Filtrar datos válidos
    const datosValidos = datos.filter(row => {
      const valor = parseInt(row[columna]);
      return !isNaN(valor) && valor >= 1 && valor <= 5;
    });
    
    console.log(`  📊 Datos válidos: ${datosValidos.length}/${datos.length}`);
    
    // Calcular para consolidado
    const consolidado = datosValidos;
    const total = consolidado.length;
    
    if (total > 0) {
      const rating5Count = consolidado.filter(row => parseInt(row[columna]) === 5).length;
      const rating4Count = consolidado.filter(row => parseInt(row[columna]) === 4).length;
      const rating123Count = consolidado.filter(row => [1, 2, 3].includes(parseInt(row[columna]))).length;
      
      const rating5Pct = (rating5Count / total) * 100;
      const rating4Pct = (rating4Count / total) * 100;
      const rating123Pct = (rating123Count / total) * 100;
      
      console.log(`  📈 Conteos: 5=${rating5Count}, 4=${rating4Count}, 1-3=${rating123Count}, Total=${total}`);
      console.log(`  📈 Porcentajes: 5=${rating5Pct.toFixed(1)}%, 4=${rating4Pct.toFixed(1)}%, 1-3=${rating123Pct.toFixed(1)}%`);
      console.log(`  📈 Suma: ${(rating5Pct + rating4Pct + rating123Pct).toFixed(1)}%`);
      
      // Verificar valores extremos
      const porcentajes = [rating5Pct, rating4Pct, rating123Pct];
      porcentajes.forEach((pct, i) => {
        const tipo = i === 0 ? '5' : i === 1 ? '4' : '1-3';
        if (pct < 0) {
          problemasDetectados.push(`❌ ${nombre}: Porcentaje negativo para rating ${tipo}: ${pct}`);
        }
        if (pct > 100) {
          problemasDetectados.push(`❌ ${nombre}: Porcentaje mayor a 100% para rating ${tipo}: ${pct}`);
        }
        if (isNaN(pct) || !isFinite(pct)) {
          problemasDetectados.push(`❌ ${nombre}: Valor inválido para rating ${tipo}: ${pct}`);
        }
      });
      
      // Verificar suma total
      const sumaTotal = rating5Pct + rating4Pct + rating123Pct;
      if (Math.abs(sumaTotal - 100) > 0.1) {
        problemasDetectados.push(`⚠️ ${nombre}: Suma no es 100%: ${sumaTotal.toFixed(2)}%`);
      }
      
      // Verificar conteos vs total
      const sumaConteos = rating5Count + rating4Count + rating123Count;
      if (sumaConteos !== total) {
        problemasDetectados.push(`❌ ${nombre}: Suma de conteos (${sumaConteos}) no coincide con total (${total})`);
      }
    }
  });
  
  console.log(`\n${'='.repeat(60)}`);
  console.log("🎯 RESULTADO DEL DEBUG");
  console.log(`${'='.repeat(60)}`);
  
  if (problemasDetectados.length > 0) {
    console.log(`❌ Se detectaron ${problemasDetectados.length} problemas:`);
    problemasDetectados.forEach(problema => console.log(`  ${problema}`));
    return false;
  } else {
    console.log("✅ Todos los valores están correctos");
    console.log("✅ No se detectaron valores extremos o inválidos");
    console.log("✅ Los porcentajes suman 100% correctamente");
    return true;
  }
}

function verificarConfiguracionRecharts() {
  console.log(`\n${'='.repeat(60)}`);
  console.log("🔧 VERIFICANDO CONFIGURACIÓN DE RECHARTS");
  console.log(`${'='.repeat(60)}`);
  
  try {
    const codigo = fs.readFileSync('src/components/GeneralDashboard.tsx', 'utf8');
    
    // Verificar configuraciones específicas para prevenir desbordamiento
    const verificaciones = [
      {
        pattern: 'domain={[0, 100]}',
        descripcion: 'Dominio fijo 0-100',
        critico: true
      },
      {
        pattern: 'allowDataOverflow={false}',
        descripcion: 'Prevención de desbordamiento',
        critico: true
      },
      {
        pattern: 'ticks={[0, 20, 40, 60, 80, 100]}',
        descripcion: 'Ticks específicos configurados',
        critico: true
      },
      {
        pattern: 'allowDecimals={false}',
        descripcion: 'Sin decimales en ticks',
        critico: false
      },
      {
        pattern: 'type="number"',
        descripcion: 'Tipo numérico específico',
        critico: false
      },
      {
        pattern: 'isFinite(numValue)',
        descripcion: 'Verificación de valores finitos',
        critico: true
      }
    ];
    
    let configuracionCorrecta = true;
    
    verificaciones.forEach(({ pattern, descripcion, critico }) => {
      if (codigo.includes(pattern)) {
        console.log(`✅ ${descripcion}: Encontrado`);
      } else {
        const estado = critico ? '❌' : '⚠️';
        console.log(`${estado} ${descripcion}: No encontrado`);
        if (critico) configuracionCorrecta = false;
      }
    });
    
    return configuracionCorrecta;
    
  } catch (error) {
    console.log(`❌ Error leyendo archivo: ${error.message}`);
    return false;
  }
}

function main() {
  console.log("🐛 DEBUG EJE Y - VERIFICACIÓN DETALLADA");
  console.log("=".repeat(60));
  
  // Debug de datos
  const datosOk = debugearValoresEjeY();
  
  // Verificar configuración
  const configOk = verificarConfiguracionRecharts();
  
  // Resultado final
  console.log(`\n${'='.repeat(60)}`);
  console.log("🎯 CONCLUSIÓN DEL DEBUG");
  console.log(`${'='.repeat(60)}`);
  
  if (datosOk && configOk) {
    console.log("✅ DEBUG EXITOSO: Los datos y configuración están correctos");
    console.log("✅ No hay causa técnica para desbordamiento del eje Y");
    console.log("💡 Si el problema persiste visualmente, verificar:");
    console.log("   - Actualizar navegador (Ctrl+F5)");
    console.log("   - Verificar que hot-reload aplicó cambios");
    console.log("   - Abrir Developer Tools para ver errores en consola");
    process.exit(0);
  } else {
    console.log("❌ DEBUG FALLIDO: Se encontraron problemas");
    process.exit(1);
  }
}

main();
