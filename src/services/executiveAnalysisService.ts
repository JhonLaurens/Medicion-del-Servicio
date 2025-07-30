import Papa from 'papaparse';

export interface ExecutiveToAnalyze {
  EJECUTIVO_FINAL: string;
  AGENCIA: string;
  TIPO_EJECUTIVO: string;
  SEGMENTO: string;
  CIUDAD: string;
}

export class ExecutiveAnalysisService {
  private executivesToAnalyze: ExecutiveToAnalyze[] = [];
  private isLoaded = false;

  async loadExecutivesToAnalyze(): Promise<void> {
    try {
      console.log('🔍 ExecutiveAnalysisService: Loading executives to analyze...');
      
      const response = await fetch('/Medicion-del-Servicio/ejecutivos%20para%20analizar.csv');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          delimiter: ';',
          skipEmptyLines: true,
          transformHeader: (header: string) => {
            // Limpiar y normalizar headers
            const trimmedHeader = header.trim();
            // Mapear "TIPO EJECUTIVO" a "TIPO_EJECUTIVO" para consistencia
            if (trimmedHeader === 'TIPO EJECUTIVO') {
              return 'TIPO_EJECUTIVO';
            }
            return trimmedHeader;
          },
          complete: (results) => {
            console.log('📊 ExecutiveAnalysisService: Parse results:', results);
            
            if (results.errors.length > 0) {
              console.warn('⚠️ ExecutiveAnalysisService: Parse warnings:', results.errors);
            }
            
            this.executivesToAnalyze = results.data as ExecutiveToAnalyze[];
            this.isLoaded = true;
            
            console.log('✅ ExecutiveAnalysisService: Loaded executives:', {
              total: this.executivesToAnalyze.length,
              sample: this.executivesToAnalyze.slice(0, 3),
              headers: results.meta.fields
            });
            
            resolve();
          },
          error: (error) => {
            console.error('❌ ExecutiveAnalysisService: Parse error:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('❌ ExecutiveAnalysisService: Load error:', error);
      throw error;
    }
  }

  getExecutivesToAnalyze(): ExecutiveToAnalyze[] {
    return this.executivesToAnalyze;
  }

  isDataLoaded(): boolean {
    return this.isLoaded;
  }

  // Método para verificar si un ejecutivo debe ser incluido en el análisis
  shouldIncludeExecutive(executiveName: string): boolean {
    if (!this.isLoaded) {
      console.warn('⚠️ ExecutiveAnalysisService: Data not loaded yet');
      return false;
    }

    // Normalizar nombre para comparación (quitar espacios extra, convertir a minúsculas)
    const normalizedInputName = executiveName.toLowerCase().trim();
    
    return this.executivesToAnalyze.some(executive => {
      const normalizedExecutiveName = executive.EJECUTIVO_FINAL.toLowerCase().trim();
      return normalizedExecutiveName === normalizedInputName;
    });
  }

  // Obtener información adicional de un ejecutivo
  getExecutiveInfo(executiveName: string): ExecutiveToAnalyze | null {
    if (!this.isLoaded) {
      return null;
    }

    const normalizedInputName = executiveName.toLowerCase().trim();
    
    return this.executivesToAnalyze.find(executive => {
      const normalizedExecutiveName = executive.EJECUTIVO_FINAL.toLowerCase().trim();
      return normalizedExecutiveName === normalizedInputName;
    }) || null;
  }

  // Obtener estadísticas de los ejecutivos para analizar
  getExecutiveStats() {
    if (!this.isLoaded) {
      return null;
    }

    const stats = {
      total: this.executivesToAnalyze.length,
      byTipo: {} as Record<string, number>,
      bySegmento: {} as Record<string, number>,
      byCiudad: {} as Record<string, number>,
      byAgencia: {} as Record<string, number>
    };

    this.executivesToAnalyze.forEach(executive => {
      // Contar por tipo
      const tipo = executive.TIPO_EJECUTIVO || 'Sin Tipo';
      stats.byTipo[tipo] = (stats.byTipo[tipo] || 0) + 1;

      // Contar por segmento
      const segmento = executive.SEGMENTO || 'Sin Segmento';
      stats.bySegmento[segmento] = (stats.bySegmento[segmento] || 0) + 1;

      // Contar por ciudad
      const ciudad = executive.CIUDAD || 'Sin Ciudad';
      stats.byCiudad[ciudad] = (stats.byCiudad[ciudad] || 0) + 1;

      // Contar por agencia
      const agencia = executive.AGENCIA || 'Sin Agencia';
      stats.byAgencia[agencia] = (stats.byAgencia[agencia] || 0) + 1;
    });

    return stats;
  }
}