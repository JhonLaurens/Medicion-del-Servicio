import { SatisfactionRecord, KPIData, GeographicData, SuggestionData, TechnicalInfo, NPSData, ChartDataPoint, MonthlyTrendData } from '../types';
import Papa from 'papaparse';

interface DepartmentPerformanceData {
  department: string;
  averageRating: number;
  responseCount: number;
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
      const response = await fetch('/datos.csv');
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const csvText = await response.text();
      
      if (isDev) {
        console.log('✅ DataService: CSV file fetched. Length:', csvText.length);
      }

      // Header mapping - matching exact CSV headers
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
      ];

      const parsed = Papa.parse(csvText, {
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
      }

      // Filtrar registros válidos
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
    // Calcular fechas reales desde el CSV
    const dates = this.data
      .map(record => new Date(record.DATE_MODIFIED))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const startDate = dates.length > 0 ? dates[0] : new Date();
    const endDate = dates.length > 0 ? dates[dates.length - 1] : new Date();
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    };
    
    const universoTotal = 24067;
    const totalEncuestados = this.data.length;
    const porcentajeRespuesta = parseFloat(((totalEncuestados / universoTotal) * 100).toFixed(2));
    
    // Calcular margen de error con fórmula estadística
    // ME = Z * √(p(1-p)/n) donde Z=1.96 para 95% confianza, p=0.5 para máxima varianza
    const z = 1.96; // 95% confianza
    const p = 0.5; // proporción estimada (0.5 para máxima varianza)
    const n = totalEncuestados;
    const margenError = z * Math.sqrt((p * (1 - p)) / n);
    const margenErrorPorcentaje = (margenError * 100).toFixed(2);
    
    return {
      objetivoGeneral: "Conocer la satisfacción de los clientes de los segmentos Personas y Empresas con el servicio de Coltefinanciera",
      universoTotal,
      totalEncuestados,
      porcentajeRespuesta,
      nivelConfianza: "95%",
      margenError: `${margenErrorPorcentaje}%`,
      periodoCampo: `${formatDate(startDate)} al ${formatDate(endDate)}`,
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
      { key: 'recomendacion', name: 'Nivel de Recomendación' },
      { key: 'lealtad', name: 'Lealtad del Cliente' }
    ];
    
    return metrics.map(metric => {
      const allData = this.data.filter(d => d[metric.key as keyof SatisfactionRecord] !== null && d[metric.key as keyof SatisfactionRecord] !== undefined);
      const personasData = allData.filter(d => d.SEGMENTO === 'PERSONAS');
      const empresarialData = allData.filter(d => d.SEGMENTO === 'EMPRESARIAL');
      
      const calculateStats = (data: SatisfactionRecord[], metricKey: string) => {
        if (data.length === 0) return { average: 0, rating5: 0, rating4: 0, rating123: 0 };
        const values = data.map(d => d[metricKey as keyof SatisfactionRecord] as number).filter(v => v !== null && v !== undefined);
        const average = parseFloat((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2));
        const rating5 = parseFloat(((values.filter(v => v === 5).length / values.length) * 100).toFixed(1));
        const rating4 = parseFloat(((values.filter(v => v === 4).length / values.length) * 100).toFixed(1));
        const rating123 = parseFloat(((values.filter(v => v <= 3).length / values.length) * 100).toFixed(1));
        return { average, rating5, rating4, rating123 };
      };
      
      return {
        metric: metric.name,
        consolidado: calculateStats(allData, metric.key),
        personas: calculateStats(personasData, metric.key),
        empresarial: calculateStats(empresarialData, metric.key)
      };
    });
  }

  getCityData(): GeographicData[] {
    // Obtener todas las ciudades únicas del CSV
    const ciudadesUnicas = [...new Set(this.data.map(record => record.CIUDAD))].filter(ciudad => ciudad && ciudad.trim());
    
    const nationalAverages = {
      claridad_informacion: this.calculateAverage('claridad_informacion'),
      satisfaccion_general: this.calculateAverage('satisfaccion_general'),
      recomendacion: this.calculateAverage('recomendacion'),
      lealtad: this.calculateAverage('lealtad')
    };
    
    return ciudadesUnicas.map(ciudad => {
      const cityData = this.data.filter(record => record.CIUDAD === ciudad);
      const cityStats = {
        claridad_informacion: this.calculateAverageForRecords(cityData, 'claridad_informacion'),
        satisfaccion_general: this.calculateAverageForRecords(cityData, 'satisfaccion_general'),
        recomendacion: this.calculateAverageForRecords(cityData, 'recomendacion'),
        lealtad: this.calculateAverageForRecords(cityData, 'lealtad')
      };
      
      return {
        ciudad: ciudad,
        total_encuestados: cityData.length,
        metricas: {
          claridad_informacion: cityStats.claridad_informacion,
          satisfaccion_general: cityStats.satisfaccion_general,
          recomendacion: cityStats.recomendacion,
          lealtad: cityStats.lealtad
        },
        comparison: {
          claridad_informacion: this.compareToNational(cityStats.claridad_informacion, nationalAverages.claridad_informacion),
          satisfaccion_general: this.compareToNational(cityStats.satisfaccion_general, nationalAverages.satisfaccion_general),
          recomendacion: this.compareToNational(cityStats.recomendacion, nationalAverages.recomendacion),
          lealtad: this.compareToNational(cityStats.lealtad, nationalAverages.lealtad)
        }
      };
    }).sort((a, b) => b.total_encuestados - a.total_encuestados);
  }

  getAgencyData(): GeographicData[] {
    // Obtener todas las agencias únicas del CSV
    const agenciasUnicas = [...new Set(this.data.map(record => record.AGENCIA))].filter(agencia => agencia && agencia.trim());
    
    const nationalAverages = {
      claridad_informacion: this.calculateAverage('claridad_informacion'),
      satisfaccion_general: this.calculateAverage('satisfaccion_general'),
      recomendacion: this.calculateAverage('recomendacion'),
      lealtad: this.calculateAverage('lealtad')
    };
    
    return agenciasUnicas.map(agencia => {
      const agencyData = this.data.filter(record => record.AGENCIA === agencia);
      const agencyStats = {
        claridad_informacion: this.calculateAverageForRecords(agencyData, 'claridad_informacion'),
        satisfaccion_general: this.calculateAverageForRecords(agencyData, 'satisfaccion_general'),
        recomendacion: this.calculateAverageForRecords(agencyData, 'recomendacion'),
        lealtad: this.calculateAverageForRecords(agencyData, 'lealtad')
      };
      
      return {
        ciudad: agencia, // Usamos ciudad como campo genérico para mostrar el nombre de la agencia
        total_encuestados: agencyData.length,
        metricas: {
          claridad_informacion: agencyStats.claridad_informacion,
          satisfaccion_general: agencyStats.satisfaccion_general,
          recomendacion: agencyStats.recomendacion,
          lealtad: agencyStats.lealtad
        },
        comparison: {
          claridad_informacion: this.compareToNational(agencyStats.claridad_informacion, nationalAverages.claridad_informacion),
          satisfaccion_general: this.compareToNational(agencyStats.satisfaccion_general, nationalAverages.satisfaccion_general),
          recomendacion: this.compareToNational(agencyStats.recomendacion, nationalAverages.recomendacion),
          lealtad: this.compareToNational(agencyStats.lealtad, nationalAverages.lealtad)
        }
      };
    }).sort((a, b) => b.total_encuestados - a.total_encuestados);
  }

  getSuggestionData(): SuggestionData[] {
    // Obtener todas las sugerencias del CSV
    const sugerenciasField = '¿Tiene alguna recomendación o sugerencia acerca del servicio que le ofrecemos en Coltefinanciera?';
    const sugerencias = this.data
      .map(record => (record as any)[sugerenciasField])
      .filter(sugerencia => sugerencia && sugerencia.trim() && sugerencia.trim() !== '""""""' && sugerencia.trim() !== 'No')
      .map((sugerencia: string) => sugerencia.replace(/"/g, '').trim())
      .filter(sugerencia => sugerencia.length > 3);

    // Categorizar sugerencias por palabras clave
    const categorias = {
      atencion: ['atención', 'atencion', 'servicio', 'amabilidad', 'trato', 'personal', 'asesor', 'contact center', 'llamada'],
      productos: ['tasa', 'interés', 'interes', 'tarifa', 'costo', 'precio', 'producto', 'cdt', 'crédito', 'credito'],
      tecnologia: ['app', 'aplicación', 'aplicacion', 'página', 'pagina', 'web', 'digital', 'online', 'virtual'],
      tiempo: ['tiempo', 'rápido', 'rapido', 'pronto', 'agilidad', 'demora', 'lento', 'respuesta'],
      horarios: ['horario', 'hora', 'disponibilidad', 'acceso', 'abierto']
    };

    const totalSugerencias = sugerencias.length;
    
    const categorizadas = {
      'Mejoras en Atención y Servicios': sugerencias.filter((s: string) => 
        categorias.atencion.some(palabra => s.toLowerCase().includes(palabra))
      ),
      'Mejoras en Productos y Tarifas': sugerencias.filter((s: string) => 
        categorias.productos.some(palabra => s.toLowerCase().includes(palabra))
      ),
      'Mejoras Tecnológicas': sugerencias.filter((s: string) => 
        categorias.tecnologia.some(palabra => s.toLowerCase().includes(palabra))
      ),
      'Mejoras en Tiempos de Respuesta': sugerencias.filter((s: string) => 
        categorias.tiempo.some(palabra => s.toLowerCase().includes(palabra))
      ),
      'Mejoras en Horarios': sugerencias.filter((s: string) => 
        categorias.horarios.some(palabra => s.toLowerCase().includes(palabra))
      )
    };

    return Object.entries(categorizadas)
      .map(([categoria, items]) => {
        const porcentaje = totalSugerencias > 0 ? Math.round((items.length / totalSugerencias) * 100) : 0;
        
        // Obtener las 3 sugerencias más comunes de esta categoría
        const sugerenciasUnicas = [...new Set(items)];
        const detalles = sugerenciasUnicas.slice(0, 3).map(sugerencia => ({
          sugerencia: sugerencia.substring(0, 80) + (sugerencia.length > 80 ? '...' : ''),
          porcentaje: Math.round((1 / totalSugerencias) * 100)
        }));

        return {
          categoria,
          porcentaje,
          count: items.length,
          detalles
        };
      })
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }


  // Helper methods for calculations
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
