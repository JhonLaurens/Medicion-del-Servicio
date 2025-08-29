const fs = require('fs');
const path = require('path');

/**
 * Script para validar cálculos matemáticos en datos.csv
 * Analiza la precisión de los promedios por métrica
 */

class CSVCalculationValidator {
  constructor() {
    this.data = [];
    this.errors = [];
    this.warnings = [];
    this.metrics = {
      claridad: { column: 13, name: 'Claridad de Información' },
      recomendacion: { column: 14, name: 'Recomendación (NPS)' },
      satisfaccion: { column: 15, name: 'Satisfacción General' },
      lealtad: { column: 16, name: 'Lealtad' }
    };
  }

  /**
   * Cargar y parsear el archivo CSV
   */
  loadCSV() {
    try {
      const csvPath = path.join(__dirname, '..', 'public', 'datos.csv');
      console.log('📂 Cargando archivo:', csvPath);
      
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      console.log(`📊 Total de líneas encontradas: ${lines.length}`);
      
      // Parsear header
      const header = lines[0].split(';');
      console.log(`📋 Columnas detectadas: ${header.length}`);
      console.log(`📋 Columnas de métricas:`);
      Object.entries(this.metrics).forEach(([key, config]) => {
        console.log(`   ${config.name}: Columna ${config.column} - "${header[config.column - 1]?.substring(0, 50)}..."`);
      });
      
      // Parsear datos
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(';');
        if (row.length >= 17) { // Asegurar que tiene suficientes columnas
          this.data.push({
            id: row[0],
            segmento: row[6],
            ciudad: row[7],
            agencia: row[8],
            claridad: this.parseNumericValue(row[12], i + 1, 'claridad'),
            recomendacion: this.parseNumericValue(row[13], i + 1, 'recomendacion'),
            satisfaccion: this.parseNumericValue(row[14], i + 1, 'satisfaccion'),
            lealtad: this.parseNumericValue(row[15], i + 1, 'lealtad')
          });
        } else {
          this.warnings.push(`Línea ${i + 1}: Número insuficiente de columnas (${row.length})`);
        }
      }
      
      console.log(`✅ Datos cargados: ${this.data.length} registros válidos`);
      
    } catch (error) {
      console.error('❌ Error cargando CSV:', error.message);
      throw error;
    }
  }

  /**
   * Parsear y validar valores numéricos
   */
  parseNumericValue(value, lineNumber, metric) {
    if (!value || value.trim() === '') {
      return null; // Valor vacío
    }
    
    const numValue = parseFloat(value.trim());
    
    if (isNaN(numValue)) {
      this.warnings.push(`Línea ${lineNumber}, ${metric}: Valor no numérico "${value}"`);
      return null;
    }
    
    if (numValue < 1 || numValue > 5) {
      this.errors.push(`Línea ${lineNumber}, ${metric}: Valor fuera de rango (${numValue}). Debe estar entre 1-5`);
      return null;
    }
    
    return numValue;
  }

  /**
   * Calcular estadísticas precisas para una métrica
   */
  calculateMetricStats(metricKey) {
    const values = this.data
      .map(row => row[metricKey])
      .filter(val => val !== null && val !== undefined);
    
    if (values.length === 0) {
      return {
        count: 0,
        sum: 0,
        average: 0,
        min: 0,
        max: 0,
        distribution: {}
      };
    }
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Distribución de valores
    const distribution = {};
    values.forEach(val => {
      distribution[val] = (distribution[val] || 0) + 1;
    });
    
    return {
      count: values.length,
      sum: Math.round(sum * 100) / 100, // Redondear a 2 decimales
      average: Math.round(average * 100) / 100,
      min,
      max,
      distribution
    };
  }

  /**
   * Calcular estadísticas por segmento
   */
  calculateSegmentStats(metricKey, segment) {
    const segmentData = this.data.filter(row => 
      row.segmento && row.segmento.toUpperCase() === segment.toUpperCase()
    );
    
    const values = segmentData
      .map(row => row[metricKey])
      .filter(val => val !== null && val !== undefined);
    
    if (values.length === 0) {
      return {
        count: 0,
        sum: 0,
        average: 0,
        totalRecords: segmentData.length
      };
    }
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    
    return {
      count: values.length,
      sum: Math.round(sum * 100) / 100,
      average: Math.round(average * 100) / 100,
      totalRecords: segmentData.length
    };
  }

  /**
   * Validar consistencia de cálculos
   */
  validateCalculations() {
    console.log('\n🔍 VALIDACIÓN DE CÁLCULOS MATEMÁTICOS\n');
    
    Object.entries(this.metrics).forEach(([key, config]) => {
      console.log(`\n📊 ${config.name.toUpperCase()}`);
      console.log('='.repeat(50));
      
      // Estadísticas generales
      const generalStats = this.calculateMetricStats(key);
      console.log(`📈 Estadísticas Generales:`);
      console.log(`   Registros válidos: ${generalStats.count}`);
      console.log(`   Suma total: ${generalStats.sum}`);
      console.log(`   Promedio: ${generalStats.average}`);
      console.log(`   Rango: ${generalStats.min} - ${generalStats.max}`);
      
      // Distribución de valores
      console.log(`   Distribución:`);
      Object.entries(generalStats.distribution).forEach(([value, count]) => {
        const percentage = ((count / generalStats.count) * 100).toFixed(1);
        console.log(`     Valor ${value}: ${count} registros (${percentage}%)`);
      });
      
      // Estadísticas por segmento
      console.log(`\n📊 Por Segmento:`);
      const personasStats = this.calculateSegmentStats(key, 'PERSONAS');
      const empresarialStats = this.calculateSegmentStats(key, 'EMPRESARIAL');
      
      console.log(`   PERSONAS:`);
      console.log(`     Total registros: ${personasStats.totalRecords}`);
      console.log(`     Registros válidos: ${personasStats.count}`);
      console.log(`     Suma: ${personasStats.sum}`);
      console.log(`     Promedio: ${personasStats.average}`);
      
      console.log(`   EMPRESARIAL:`);
      console.log(`     Total registros: ${empresarialStats.totalRecords}`);
      console.log(`     Registros válidos: ${empresarialStats.count}`);
      console.log(`     Suma: ${empresarialStats.sum}`);
      console.log(`     Promedio: ${empresarialStats.average}`);
      
      // Verificar consistencia
      const combinedCount = personasStats.count + empresarialStats.count;
      const combinedSum = personasStats.sum + empresarialStats.sum;
      const combinedAverage = combinedCount > 0 ? combinedSum / combinedCount : 0;
      
      console.log(`\n🔍 Verificación de Consistencia:`);
      console.log(`   Suma combinada: ${Math.round(combinedSum * 100) / 100}`);
      console.log(`   Promedio combinado: ${Math.round(combinedAverage * 100) / 100}`);
      
      if (Math.abs(generalStats.sum - combinedSum) > 0.01) {
        this.errors.push(`${config.name}: Inconsistencia en suma total (${generalStats.sum} vs ${combinedSum})`);
      }
      
      if (Math.abs(generalStats.average - combinedAverage) > 0.01) {
        this.errors.push(`${config.name}: Inconsistencia en promedio (${generalStats.average} vs ${combinedAverage})`);
      }
    });
  }

  /**
   * Generar reporte de errores y warnings
   */
  generateReport() {
    console.log('\n📋 REPORTE DE VALIDACIÓN\n');
    console.log('='.repeat(60));
    
    console.log(`\n📊 Resumen:`);
    console.log(`   Total registros procesados: ${this.data.length}`);
    console.log(`   Errores encontrados: ${this.errors.length}`);
    console.log(`   Advertencias: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log(`\n❌ ERRORES CRÍTICOS:`);
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (this.warnings.length > 0 && this.warnings.length <= 20) {
      console.log(`\n⚠️  ADVERTENCIAS:`);
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    } else if (this.warnings.length > 20) {
      console.log(`\n⚠️  ADVERTENCIAS (mostrando primeras 20 de ${this.warnings.length}):`);
      this.warnings.slice(0, 20).forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }
    
    if (this.errors.length === 0) {
      console.log(`\n✅ VALIDACIÓN EXITOSA: No se encontraron errores críticos en los cálculos.`);
    } else {
      console.log(`\n❌ VALIDACIÓN FALLIDA: Se encontraron ${this.errors.length} errores críticos.`);
    }
  }

  /**
   * Ejecutar validación completa
   */
  run() {
    try {
      console.log('🚀 Iniciando validación de cálculos CSV...');
      this.loadCSV();
      this.validateCalculations();
      this.generateReport();
    } catch (error) {
      console.error('❌ Error durante la validación:', error.message);
      process.exit(1);
    }
  }
}

// Ejecutar validación
if (require.main === module) {
  const validator = new CSVCalculationValidator();
  validator.run();
}

module.exports = CSVCalculationValidator;