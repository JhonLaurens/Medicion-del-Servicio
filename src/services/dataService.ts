import Papa from 'papaparse';
import { SatisfactionRecord, KPIData, GeographicData, SuggestionData, TechnicalInfo, NPSData, ChartDataPoint, MonthlyTrendData, DepartmentPerformanceData } from '../types';

export class SatisfactionDataService {
  private data: SatisfactionRecord[] = [];
  private isDataLoaded = false;

  // Configuración de logging basada en el entorno
  private isDev = this.detectDevelopmentMode();

  private detectDevelopmentMode(): boolean {
    // Múltiples formas de detectar el modo de desarrollo
    try {
      // Método 1: import.meta.env
      if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env.MODE === 'development' || (import.meta as any).env.DEV === true;
      }
      
      // Método 2: hostname
      if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      }
      
      // Método 3: puerto de desarrollo
      if (typeof window !== 'undefined') {
        return window.location.port === '5173' || window.location.port === '3000';
      }
      
      return false;
    } catch (error) {
      console.warn('Error detecting development mode:', error);
      return false;
    }
  }

  private log(message: string, ...args: any[]) {
    if (this.isDev) {
      console.log(message, ...args);
    }
  }

  private logError(message: string, error: any) {
    console.error(message, error);
  }

  async loadData(): Promise<void> {
    if (this.isDataLoaded && this.data.length > 0) {
      this.log('📊 DataService: Data already loaded,', this.data.length, 'records');
      return;
    }

    try {
      this.log('🚀 DataService: Starting data load process...');
      this.log('🔍 DataService: Development mode:', this.isDev);
      
      // Intentar múltiples rutas para el CSV
      const csvPaths = [
        '/datos.csv',                           // Ruta de desarrollo
        '/Medicion-del-Servicio/datos.csv',    // Ruta de producción
        './datos.csv',                         // Ruta relativa
        '/public/datos.csv'                    // Ruta alternativa
      ];
      
      let csvText = '';
      let successfulPath = '';
      
      for (const csvPath of csvPaths) {
        try {
          this.log('📁 DataService: Trying CSV path:', csvPath);
          const response = await fetch(csvPath);
          
          if (response.ok) {
            csvText = await response.text();
            successfulPath = csvPath;
            this.log('✅ DataService: CSV loaded successfully from:', csvPath);
            break;
          } else {
            this.log('❌ DataService: Failed to load from', csvPath, '- Status:', response.status);
          }
        } catch (pathError) {
          this.log('❌ DataService: Error trying path', csvPath, ':', pathError);
        }
      }
      
      if (!csvText) {
        throw new Error('No se pudo cargar el archivo CSV desde ninguna ruta disponible');
      }
      
      this.log('✅ DataService: CSV file fetched from', successfulPath, '. Length:', csvText.length);

      // Mapeo de headers del CSV a propiedades del objeto
      const headerMapping: Record<string, string> = {
        'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?': 'claridad_informacion',
        '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?': 'recomendacion',
        'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?': 'satisfaccion_general',
        'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?': 'lealtad',
      };

      const parsed = Papa.parse(csvText, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          const trimmedHeader = header.trim();
          const mappedHeader = headerMapping[trimmedHeader] || trimmedHeader;
          
          if (this.isDev && headerMapping[trimmedHeader]) {
            this.log('🔄 Header mapped:', trimmedHeader, '->', mappedHeader);
          }
          
          return mappedHeader;
        },
        transform: (value: string, field: string) => {
          if (['claridad_informacion', 'recomendacion', 'satisfaccion_general', 'lealtad'].includes(field)) {
            const num = parseFloat(value);
            return isNaN(num) ? null : num;
          }
          return value;
        }
      });

      if (parsed.errors.length > 0) {
        this.logError('❌ DataService: CSV parsing errors:', parsed.errors);
      }

      this.log('📋 DataService: Parsed headers:', Object.keys(parsed.data[0] || {}));
      this.log('📊 DataService: Total parsed rows:', parsed.data.length);

      // Filtrar registros válidos con mejor validación
      this.data = (parsed.data as any[])
        .filter(row => this.isValidRecord(row))
        .map(row => this.sanitizeRecord(row));

      if (this.data.length > 0) {
        this.log('✅ DataService: Loaded', this.data.length, 'valid records from', parsed.data.length, 'total rows');
        this.log('📄 DataService: First record example:', this.data[0]);
        this.log('📊 DataService: Available fields:', Object.keys(this.data[0]));
        this.isDataLoaded = true;
      } else {
        this.logError('⚠️ DataService: No valid records found. Sample row:', parsed.data[0]);
        throw new Error('No valid data records found in CSV file');
      }

    } catch (error) {
      this.isDataLoaded = false;
      this.logError('❌ DataService: Error loading CSV data:', error);
      throw error;
    }
  }

  private isValidRecord(row: any): boolean {
    if (!row || typeof row !== 'object') return false;
    
    // Verificar campos obligatorios
    const requiredFields = ['ID', 'SEGMENTO'];
    for (const field of requiredFields) {
      if (!row[field] || row[field].toString().trim() === '') {
        return false;
      }
    }

    // Verificar que al menos una métrica tenga valor válido
    const metrics = ['claridad_informacion', 'recomendacion', 'satisfaccion_general', 'lealtad'];
    return metrics.some(metric => {
      const value = row[metric];
      return value !== null && value !== undefined && value !== '' && !isNaN(Number(value));
    });
  }

  private sanitizeRecord(row: any): SatisfactionRecord {
    return {
      ID: String(row.ID || '').trim(),
      DATE_MODIFIED: String(row.DATE_MODIFIED || '').trim(),
      IP_ADDRESS: String(row.IP_ADDRESS || '').trim(),
      EMAIL: String(row.EMAIL || '').trim(),
      NOMBRE: String(row.NOMBRE || '').trim(),
      CEDULA: String(row.CEDULA || '').trim(),
      SEGMENTO: (row.SEGMENTO === 'EMPRESARIAL' ? 'EMPRESARIAL' : 'PERSONAS') as 'PERSONAS' | 'EMPRESARIAL',
      CIUDAD: String(row.CIUDAD || '').trim(),
      AGENCIA: String(row.AGENCIA || '').trim(),
      TIPO_EJECUTIVO: String(row.TIPO_EJECUTIVO || '').trim(),
      EJECUTIVO: String(row.EJECUTIVO || '').trim(),
      EJECUTIVO_FINAL: String(row.EJECUTIVO_FINAL || '').trim(),
      claridad_informacion: this.sanitizeNumericValue(row.claridad_informacion),
      recomendacion: this.sanitizeNumericValue(row.recomendacion),
      satisfaccion_general: this.sanitizeNumericValue(row.satisfaccion_general),
      lealtad: this.sanitizeNumericValue(row.lealtad),
    };
  }

  private sanitizeNumericValue(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    if (isNaN(num) || !isFinite(num)) return 0;
    return Math.max(1, Math.min(5, Math.round(num))); // Asegurar rango 1-5
  }

  getTechnicalInfo(): TechnicalInfo {
    return {
      objetivoGeneral: "Evaluar de manera integral la satisfacción de los clientes de Coltefinanciera en los segmentos Personas y Empresarial durante los períodos 2024-2 y 2025-1, mediante la medición de indicadores clave como claridad de la información en atención, satisfacción general del servicio, nivel de recomendación (NPS) y lealtad del cliente. Este estudio busca identificar fortalezas y oportunidades de mejora en la experiencia del cliente, proporcionando insights estratégicos para la toma de decisiones orientadas al fortalecimiento de la relación comercial y la optimización de los procesos de atención al cliente en todas las agencias a nivel nacional.",
      universoTotal: 24067,
      totalEncuestados: this.data.length,
      porcentajeRespuesta: parseFloat(((this.data.length / 24067) * 100).toFixed(2)),
      nivelConfianza: "95%",
      margenError: "2,50%",
      periodoCampo: "15 de abril al 01 de junio de 2025",
      metodoRecoleccion: "Web, mediante SurveyMonkey",
      metricasEvaluadas: [
        "Claridad de la Información (Atención)",
        "Satisfacción General",
        "Nivel de Recomendación",
        "Lealtad del Cliente"
      ],
      periodosMediacion: "2024-2 y 2025-1",
      notaMetodologica: "La encuesta se realizó en 2025-1 pero representa la medición de los períodos 2024-2 y 2025-1"
    };
  }

  getKPIData(): KPIData[] {
    console.log('🚀 getKPIData: MÉTODO INICIADO');
    
    if (!this.isDataLoaded || this.data.length === 0) {
      console.error('⚠️ DataService: No data loaded for KPI calculation');
      this.logError('⚠️ DataService: No data loaded for KPI calculation', new Error('No data available'));
      return [];
    }

    const metrics = [
      { key: 'claridad_informacion', name: 'Claridad de Información' },
      { key: 'recomendacion', name: 'Recomendación (NPS)' },
      { key: 'satisfaccion_general', name: 'Satisfacción General' },
      { key: 'lealtad', name: 'Lealtad' }
    ];

    console.log('📊 getKPIData: Processing metrics:', metrics.map(m => m.name));
    console.log('📊 getKPIData: Total data records:', this.data.length);
    this.log('📊 getKPIData: Processing metrics:', metrics.map(m => m.name));
    this.log('📊 getKPIData: Total data records:', this.data.length);

    const result = metrics.map(metric => {
      try {
        // Incluir todos los registros, convirtiendo valores vacíos/nulos a 0
        const allData = this.data.map(d => {
          const value = d[metric.key as keyof SatisfactionRecord];
          // Si el valor está vacío, es null, undefined o NaN, usar 0
          if (value === '' || value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
            return { ...d, [metric.key]: 0 };
          }
          return d;
        });

        this.log(`📊 getKPIData: Processing ${metric.name}:`, {
          totalRecords: allData.length,
          metric: metric.key
        });

        const consolidado = this.calculateStats(allData, metric.key);
        const personas = this.calculateStats(
          allData.filter(d => d.SEGMENTO === 'PERSONAS'), 
          metric.key
        );
        const empresarial = this.calculateStats(
          allData.filter(d => d.SEGMENTO === 'EMPRESARIAL'), 
          metric.key
        );

        return {
          metric: metric.name,
          consolidado,
          personas,
          empresarial
        };
      } catch (error) {
        this.logError(`❌ Error processing metric ${metric.name}:`, error);
        return {
          metric: metric.name,
          consolidado: { average: 0, rating5: 0, rating4: 0, rating123: 0, total: 0 },
          personas: { average: 0, rating5: 0, rating4: 0, rating123: 0, total: 0 },
          empresarial: { average: 0, rating5: 0, rating4: 0, rating123: 0, total: 0 }
        };
      }
    });

    console.log('📊 getKPIData: Generated KPI results:', result.map(r => r.metric));
    console.log('📊 getKPIData: RESULTADO FINAL:', result.length, 'métricas generadas');
    console.log('📊 getKPIData: MÉTRICAS DETALLADAS:', result.map(r => ({
      metric: r.metric,
      consolidado: r.consolidado.average,
      personas: r.personas.average,
      empresarial: r.empresarial.average
    })));
    
    this.log('📊 getKPIData: Generated KPI results:', result.map(r => r.metric));
    return result;
  }

  private calculateStats(data: SatisfactionRecord[], metricKey: string) {
    if (!data || data.length === 0) {
      return { average: 0, rating5: 0, rating4: 0, rating123: 0, total: 0 };
    }

    try {
      const values = data
        .map(d => d[metricKey as keyof SatisfactionRecord] as number)
        .filter(v => v !== null && v !== undefined && !isNaN(v)); // Removido && v > 0

      if (values.length === 0) {
        return { average: 0, rating5: 0, rating4: 0, rating123: 0, total: 0 };
      }

      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const total = values.length;
      
      const rating5Count = values.filter(v => v === 5).length;
      const rating4Count = values.filter(v => v === 4).length;
      const rating123Count = values.filter(v => v >= 1 && v <= 3).length;

      // Manejar casos de muestra pequeña
      if (total < 10) {
        this.log(`📊 calculateStats for small sample (${values.length} records):`, {
          average: Number(average.toFixed(2)),
          rating5: Number(((rating5Count / total) * 100).toFixed(1)),
          rating4: Number(((rating4Count / total) * 100).toFixed(1)),
          rating123: Number(((rating123Count / total) * 100).toFixed(1)),
          total
        });
      }

      return {
        average: Number(average.toFixed(2)),
        rating5: Number(((rating5Count / total) * 100).toFixed(1)),
        rating4: Number(((rating4Count / total) * 100).toFixed(1)),
        rating123: Number(((rating123Count / total) * 100).toFixed(1)),
        total
      };
    } catch (error) {
      this.logError(`❌ Error calculating stats for ${metricKey}:`, error);
      return { average: 0, rating5: 0, rating4: 0, rating123: 0, total: 0 };
    }
  }

  getCityData(): GeographicData[] {
    const cityMap: { [key: string]: string } = {
      'BOGOTA PRINCIPAL': 'Bogotá',
      'BOGOTA EL NOGAL': 'Bogotá',
      'BOGOTA SANTA FE': 'Bogotá',
      'BOGOTA PLAZA IMPERIAL': 'Bogotá',
      'COLTEJER PRINCIPAL': 'Medellín',
      'OVIEDO': 'Medellín',
      'SAN DIEGO': 'Medellín',
      'UNICENTRO': 'Medellín',
      'CALI NORTE': 'Cali',
      'CUCUTA': 'Cúcuta',
      'MANIZALES': 'Manizales',
      'AGENCIA PRESTIGE': 'Barranquilla'
    };
    const cityGroups = this.data.reduce((acc, record) => {
      const city = cityMap[record.AGENCIA] || 'Otras';
      if (!acc[city]) acc[city] = [];
      acc[city].push(record);
      return acc;
    }, {} as { [key: string]: SatisfactionRecord[] });
    const nationalAverages = {
      claridad_informacion: this.calculateAverage('claridad_informacion'),
      satisfaccion_general: this.calculateAverage('satisfaccion_general'),
      recomendacion: this.calculateAverage('recomendacion'),
      lealtad: this.calculateAverage('lealtad')
    };
    return Object.entries(cityGroups).map(([ciudad, records]) => {
      const metricas = {
        claridad_informacion: this.calculateAverageForRecords(records, 'claridad_informacion'),
        satisfaccion_general: this.calculateAverageForRecords(records, 'satisfaccion_general'),
        recomendacion: this.calculateAverageForRecords(records, 'recomendacion'),
        lealtad: this.calculateAverageForRecords(records, 'lealtad')
      };
      const comparison = {
        claridad_informacion: this.compareToNational(metricas.claridad_informacion, nationalAverages.claridad_informacion),
        satisfaccion_general: this.compareToNational(metricas.satisfaccion_general, nationalAverages.satisfaccion_general),
        recomendacion: this.compareToNational(metricas.recomendacion, nationalAverages.recomendacion),
        lealtad: this.compareToNational(metricas.lealtad, nationalAverages.lealtad)
      };
      return {
        ciudad,
        total_encuestados: records.length,
        metricas,
        comparison
      };
    });
  }

  getSuggestionData(): SuggestionData[] {
    // Data de ejemplo basada en el PDF
    return [
      {
        categoria: "Mejoras en Atención y Servicios",
        porcentaje: 53,
        detalles: [
          { sugerencia: "Buenas atención y amabilidad", porcentaje: 11 },
          { sugerencia: "Mala atención por audiorespuesta/contact center", porcentaje: 8 },
          { sugerencia: "Disminuir tiempo de respuesta (PQR y Correos)", porcentaje: 7 }
        ]
      },
      {
        categoria: "Mejoras en Productos",
        porcentaje: 32,
        detalles: [
          { sugerencia: "Bajas tasas de interés / Mejorar las tasas", porcentaje: 17 },
          { sugerencia: "Alto costo en las tarifas", porcentaje: 9 }
        ]
      },
      {
        categoria: "Mejoras Tecnológicas",
        porcentaje: 15
      }
    ];
  }

  private calculateAverage(metric: keyof SatisfactionRecord): number {
    const values = this.data
      .map(d => d[metric] as number)
      .filter(v => v !== null && !isNaN(v) && v !== undefined);
    return values.length > 0 ? parseFloat((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2)) : 0;
  }

  private calculateAverageForRecords(records: SatisfactionRecord[], metric: keyof SatisfactionRecord): number {
    const values = records
      .map(d => d[metric] as number)
      .filter(v => v !== null && !isNaN(v) && v !== undefined);
    return values.length > 0 ? parseFloat((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2)) : 0;
  }

  private compareToNational(cityAvg: number, nationalAvg: number): 'higher' | 'equal' | 'lower' {
    const diff = Math.abs(cityAvg - nationalAvg);
    if (diff < 0.1) return 'equal';
    return cityAvg > nationalAvg ? 'higher' : 'lower';
  }

  getData(): SatisfactionRecord[] {
    return this.data;
  }

  getOverallAverageRating(): number {
    if (this.data.length === 0) return 0;
    const totalRating = this.data.reduce((sum, item) => sum + (item.satisfaccion_general || 0), 0);
    return parseFloat((totalRating / this.data.length).toFixed(2));
  }

  calculateNPS(): NPSData {
    if (this.data.length === 0) return { promoters: 0, passives: 0, detractors: 0, npsScore: 0 };
    let promoters = 0, passives = 0, detractors = 0;
    this.data.forEach(item => {
      if (item.recomendacion === 5) promoters++;
      else if (item.recomendacion === 4) passives++;
      else if (item.recomendacion <= 3) detractors++;
    });
    const totalResponses = this.data.length;
    if (totalResponses === 0) return { promoters: 0, passives: 0, detractors: 0, npsScore: 0 };
    const promoterPercentage = (promoters / totalResponses) * 100;
    const detractorPercentage = (detractors / totalResponses) * 100;
    const npsScore = Math.round(promoterPercentage - detractorPercentage);
    return { promoters, passives, detractors, npsScore };
  }

  getRatingDistribution(): ChartDataPoint[] {
    if (this.data.length === 0) return [];
    const distribution = [1, 2, 3, 4, 5].map(rating => {
      const count = this.data.filter(item => item.satisfaccion_general === rating).length;
      return {
        name: `Rating ${rating}`,
        value: count
      };
    });
    return distribution;
  }

  getMonthlyTrend(): MonthlyTrendData[] {
    // Simulación de tendencia mensual
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      satisfaction: this.getOverallAverageRating() + (Math.random() - 0.5) * 0.5,
      loyalty: this.data.length > 0 ? this.data.reduce((sum, item) => sum + (item.lealtad || 0), 0) / this.data.length + (Math.random() - 0.5) * 0.3 : 0,
      recommendation: this.data.length > 0 ? this.data.reduce((sum, item) => sum + (item.recomendacion || 0), 0) / this.data.length + (Math.random() - 0.5) * 0.3 : 0
    }));
  }

  getDepartmentPerformance(): DepartmentPerformanceData[] {
    if (this.data.length === 0) return [];
    const agencyPerformance = new Map<string, { total: number; count: number }>();
    this.data.forEach(item => {
      const agency = item.AGENCIA;
      if (!agencyPerformance.has(agency)) {
        agencyPerformance.set(agency, { total: 0, count: 0 });
      }
      const current = agencyPerformance.get(agency)!;
      current.total += item.satisfaccion_general || 0;
      current.count += 1;
    });
    return Array.from(agencyPerformance.entries())
      .map(([agency, data]) => ({
        department: agency,
        averageRating: parseFloat((data.total / data.count).toFixed(2)),
        responseCount: data.count
      }))
      .sort((a, b) => a.averageRating - b.averageRating);
  }

  getTotalResponses(): number {
    return this.data.length;
  }
}

// Mapeo de agencia a ciudad
const AGENCIA_CIUDAD_MAP: Record<string, string> = {
  "SAN DIEGO": "MEDELLIN",
  "MANIZALES": "MANIZALES",
  "BOGOTA PLAZA IMPERIAL": "BOGOTA D.C.",
  "BARRANQUILLA": "BARRANQUILLA",
  "BOGOTA PRINCIPAL": "BOGOTA D.C.",
  "BOGOTA GRAN ESTACION": "BOGOTA D.C.",
  "COLTEJER PRINCIPAL": "MEDELLIN",
  "BOGOTA SANTA FE": "BOGOTA D.C.",
  "BUCARAMANGA": "BUCARAMANGA",
  "UNICENTRO": "MEDELLIN",
  "PEREIRA": "PEREIRA",
  "BOGOTA EL NOGAL": "BOGOTA D.C.",
  "BOGOTA CENTRO MAYOR": "BOGOTA D.C.",
  "BOGOTA CENTRO INTERNACIONAL": "BOGOTA D.C.",
  "CALI NORTE": "CALI",
  "AGENCIA PRESTIGE": "MEDELLIN",
  "OVIEDO": "MEDELLIN",
  "CUCUTA": "CUCUTA"
};

export function getCiudadAgencia(agencia: string): string {
  return AGENCIA_CIUDAD_MAP[agencia?.trim().toUpperCase()] || agencia;
}

export const satisfactionDataService = new SatisfactionDataService();
