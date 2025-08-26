export interface SatisfactionRecord {
  ID: string;
  DATE_MODIFIED: string;
  IP_ADDRESS: string;
  EMAIL: string;
  NOMBRE: string;
  CEDULA: string;
  SEGMENTO: 'PERSONAS' | 'EMPRESARIAL';
  CIUDAD: string;
  AGENCIA: string;
  TIPO_EJECUTIVO: string;
  EJECUTIVO: string;
  EJECUTIVO_FINAL: string;
  claridad_informacion: number; // "En general, ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?"
  recomendacion: number; // "¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas, familiares o amigos?"
  satisfaccion_general: number; // "En general, ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?"
  lealtad: number; // "Asumiendo que otra entidad financiera le ofreciera al mismo precio..."
  sugerencias: string; // "¿Tiene alguna recomendación o sugerencia acerca del servicio que le ofrecemos en Coltefinanciera?"
}

export interface KPIData {
  segment: string; // 'Personas' o 'Empresas'
  metric: string; // Nombre de la métrica
  averageRating: number; // Promedio de calificación
  totalResponses: number; // Total de respuestas
  ratingDistribution: { [key: number]: number }; // Distribución por rating (1-5)
}

export interface GeographicData {
  ciudad: string;
  total_encuestados: number;
  metricas: {
    claridad_informacion: number;
    satisfaccion_general: number;
    recomendacion: number;
    lealtad: number;
  };
  comparison: {
    claridad_informacion: 'higher' | 'equal' | 'lower';
    satisfaccion_general: 'higher' | 'equal' | 'lower';
    recomendacion: 'higher' | 'equal' | 'lower';
    lealtad: 'higher' | 'equal' | 'lower';
  };
}

export interface SuggestionData {
  categoria: string;
  porcentaje: number;
  detalles?: Array<{
    sugerencia: string;
    porcentaje: number;
  }>;
}

// Nuevos tipos para análisis de IA
export interface AICategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
}

export interface AnalyzedSuggestion {
  originalText: string;
  cleanedText: string;
  category: string;
  subcategory?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'high' | 'medium' | 'low';
  keywords: string[];
  confidence: number;
  themes: string[];
}

export interface CategoryInsight {
  category: string;
  count: number;
  percentage: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  priority: {
    high: number;
    medium: number;
    low: number;
  };
  topKeywords: Array<{ keyword: string; frequency: number }>;
  topThemes: Array<{ theme: string; count: number }>;
  examples: string[];
}

export interface EnhancedSuggestionData extends SuggestionData {
  aiInsights?: CategoryInsight;
  analyzedSuggestions?: AnalyzedSuggestion[];
}

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface TechnicalInfo {
  objetivoGeneral: string;
  universoTotal: number;
  totalEncuestados: number;
  porcentajeRespuesta: number;
  nivelConfianza: string;
  margenError: string;
  periodoCampo: string;
  metodoRecoleccion: string;
  metricasEvaluadas: string[];
  periodosMediacion?: string;
  notaMetodologica?: string;
}

// Additional types for Dashboard compatibility
export interface NPSData {
  promoters: number;
  passives: number;
  detractors: number;
  npsScore: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface MonthlyTrendData {
  month: string;
  satisfaction: number;
  loyalty: number;
  recommendation: number;
}

export interface DepartmentPerformanceData {
  department: string;
  averageRating: number;
  responseCount: number;
}

export enum Department {
  AGENCIA_PRESTIGE = 'AGENCIA_PRESTIGE',
  BOGOTA_EL_NOGAL = 'BOGOTA_EL_NOGAL',
  BOGOTA_PLAZA_IMPERIAL = 'BOGOTA_PLAZA_IMPERIAL',
  BOGOTA_PRINCIPAL = 'BOGOTA_PRINCIPAL',
  BOGOTA_SANTA_FE = 'BOGOTA_SANTA_FE',
  CALI_NORTE = 'CALI_NORTE',
  COLTEJER_PRINCIPAL = 'COLTEJER_PRINCIPAL',
  CUCUTA = 'CUCUTA',
  MANIZALES = 'MANIZALES',
  OVIEDO = 'OVIEDO',
  SAN_DIEGO = 'SAN_DIEGO',
  UNICENTRO = 'UNICENTRO',
  UNKNOWN = 'UNKNOWN'
}

export interface ColtefinancieraSurveyData {
  id: string;
  dateModified: string;
  ipAddress: string;
  email: string;
  nombre: string;
  cedula: string;
  segmento: string;
  agencia: Department;
  tipoEjecutivo: string;
  ejecutivo: string;
  ejecutivoFinal: string;
  claridadInformacion: number;
  recomendacion: number;
  satisfaccionGeneral: number;
  lealtad: number;
}

// Interfaces para el reporte de participación de ejecutivos optimizado
export interface ManagerData {
  name: string;
  surveys: number;
  percentage: number;
  coverageRate: number;
  totalUniverse: number;
  category: string;
  agencia?: string;
  segmento?: string;
  ciudad?: string;
  tipoEjecutivo?: string;
  executiveInfo?: any;
}

export interface FilterStats {
  filterValue: string;
  totalSurveys: number;
  averageRating: number;
  claridadPromedio: number;
  recomendacionPromedio: number;
  satisfaccionPromedio: number;
  lealtadPromedio: number;
}

export interface AgencyInfo {
  name: string;
  totalSurveys: number;
  totalManagers: number;
  activeManagers: number;
  city: string;
  segment: string;
}

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    tipoEjecutivo: string;
    segmento: string;
    ciudad: string;
    agencia: string;
    searchText: string;
  };
}

export interface ExportData {
  managers: ManagerData[];
  filterStats: FilterStats[];
  summary: {
    totalSurveys: number;
    totalManagers: number;
    activeManagers: number;
    averagePerActive: number;
  };
}
