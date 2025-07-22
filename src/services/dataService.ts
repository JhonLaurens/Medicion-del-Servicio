import Papa from 'papaparse';
import { SatisfactionRecord, KPIData, GeographicData, SuggestionData, TechnicalInfo, NPSData, ChartDataPoint, MonthlyTrendData, DepartmentPerformanceData } from '../types';

// Asegurar que TypeScript reconozca import.meta.env
interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.MODE === 'development';

export class SatisfactionDataService {
  private data: SatisfactionRecord[] = [];

  async loadData(): Promise<SatisfactionRecord[]> {
    if (this.data.length > 0) {
      if (isDev) {
        console.log('📊 DataService: Data already loaded,', this.data.length, 'records');
      }
      return this.data;
    }
    if (isDev) {
      console.log('🚀 DataService: Starting data load process...');
    }
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${baseUrl}datos.csv`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const csvText = await response.text();
      if (isDev) {
        console.log('✅ DataService: CSV file fetched. Length:', csvText.length);
      }      // Header mapping - matching exact CSV headers
      const headerMap: Record<string, string> = {
        'En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?': 'claridad_informacion',
        '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?': 'recomendacion',
        'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?': 'satisfaccion_general',
        'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?': 'lealtad',
        'TIPO EJECUTIVO': 'TIPO_EJECUTIVO',
        'CIUDAD': 'CIUDAD',
        'AGENCIA': 'AGENCIA',
        'EJECUTIVO': 'EJECUTIVO',
        'EJECUTIVO_FINAL': 'EJECUTIVO_FINAL'
      };
      const metricFields = [
        'claridad_informacion',
        'recomendacion',
        'satisfaccion_general',
        'lealtad'
      ];      const parsed = Papa.parse(csvText, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          const trimmedHeader = header.trim();
          const mappedHeader = headerMap[trimmedHeader] || trimmedHeader;
          if (isDev && headerMap[trimmedHeader]) {
            console.log('🔄 Header mapped:', trimmedHeader, '->', mappedHeader);
          }
          return mappedHeader;
        },
        transform: (value: string, header: string) => {
          if (metricFields.includes(header)) {
            const num = parseInt(value);
            return isNaN(num) ? null : num;
          }
          return value?.trim();
        }
      });

      if (isDev) {
        console.log('📋 DataService: Parsed headers:', Object.keys(parsed.data[0] || {}));
        console.log('📊 DataService: Total parsed rows:', parsed.data.length);
      }      // Filtrar registros válidos
      const filteredData = (parsed.data as any[]).filter(row => {
        const hasId = row.ID && row.ID.trim() !== '';
        const hasSegmento = row.SEGMENTO && row.SEGMENTO.trim() !== '';
        const hasMetrics = metricFields.some(f => {
          const value = row[f];
          return value !== null && value !== undefined && value !== '' && !isNaN(Number(value));
        });
        return hasId && hasSegmento && hasMetrics;
      }) as SatisfactionRecord[];

      this.data = filteredData;
      
      if (isDev) {
        console.log('✅ DataService: Loaded', this.data.length, 'valid records from', parsed.data.length, 'total rows');
        if (this.data.length > 0) {
          console.log('📄 DataService: First record example:', this.data[0]);
          console.log('📊 DataService: Available fields:', Object.keys(this.data[0]));
        } else {
          console.log('⚠️ DataService: No valid records found. Sample row:', parsed.data[0]);
        }
      }
      return this.data;
    } catch (error) {
      if (isDev) {
        console.error('❌ DataService: Error loading CSV data:', error);
      }
      return [];
    }
  }

  getTechnicalInfo(): TechnicalInfo {
    return {
      objetivoGeneral: "Conocer la satisfacción de los clientes de los segmentos Personas y Empresas con el servicio de Coltefinanciera",
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
      ]
    };
  }

  getKPIData(): KPIData[] {
    const metrics = [
      { key: 'claridad_informacion', name: 'Claridad de la Información (Atención)' },
      { key: 'satisfaccion_general', name: 'Satisfacción General' },
      { key: 'lealtad', name: 'Lealtad' },
      { key: 'recomendacion', name: 'Recomendación' }
    ];
    
    if (isDev) {
      console.log('📊 getKPIData: Processing metrics:', metrics.map(m => m.name));
      console.log('📊 getKPIData: Total data records:', this.data.length);
    }
    
    const result = metrics.map(metric => {
      const allData = this.data.filter(d => d[metric.key as keyof SatisfactionRecord] !== null && d[metric.key as keyof SatisfactionRecord] !== undefined);
      const personasData = allData.filter(d => d.SEGMENTO === 'PERSONAS');
      const empresarialData = allData.filter(d => d.SEGMENTO === 'EMPRESARIAL');
      
      if (isDev) {
        console.log(`📊 getKPIData: Processing ${metric.name}:`, {
          total: allData.length,
          personas: personasData.length,
          empresarial: empresarialData.length
        });
      }
      const calculateStats = (data: SatisfactionRecord[], metricKey: string) => {
        if (data.length === 0) return { average: 0, rating5: 0, rating4: 0, rating123: 0 };
        const values = data.map(d => d[metricKey as keyof SatisfactionRecord] as number).filter(v => v !== null && v !== undefined);
        
        if (values.length === 0) return { average: 0, rating5: 0, rating4: 0, rating123: 0 };
        
        const average = parseFloat((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2));
        
        // Para muestras pequeñas, usar más decimales para evitar redondeo a 0
        const precision = values.length < 50 ? 2 : 1;
        const rating5 = parseFloat(((values.filter(v => v === 5).length / values.length) * 100).toFixed(precision));
        const rating4 = parseFloat(((values.filter(v => v === 4).length / values.length) * 100).toFixed(precision));
        const rating123 = parseFloat(((values.filter(v => v <= 3).length / values.length) * 100).toFixed(precision));
        
        if (isDev && values.length < 50) {
          console.log(`📊 calculateStats for small sample (${values.length} records):`, {
            values,
            rating5Count: values.filter(v => v === 5).length,
            rating4Count: values.filter(v => v === 4).length,
            rating123Count: values.filter(v => v <= 3).length,
            calculated: { average, rating5, rating4, rating123 }
          });
        }
        
        return { average, rating5, rating4, rating123 };
      };
      return {
        metric: metric.name,
        consolidado: calculateStats(allData, metric.key),
        personas: calculateStats(personasData, metric.key),
        empresarial: calculateStats(empresarialData, metric.key)
      };
    });
    
    if (isDev) {
      console.log('📊 getKPIData: Generated KPI results:', result.map(r => r.metric));
    }
    
    return result;
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
