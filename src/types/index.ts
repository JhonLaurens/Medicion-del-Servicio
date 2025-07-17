export type Segmento = 'PERSONAS' | 'EMPRESARIAL' | 'OTRO';
export type Calificacion = 1 | 2 | 3 | 4 | 5;
export type Comparacion = 'higher' | 'equal' | 'lower';

export interface SatisfactionRecord {
  ID: string;
  DATE_MODIFIED: string;
  IP_ADDRESS: string;
  EMAIL: string;
  NOMBRE: string;
  CEDULA: string;
  SEGMENTO: Segmento;
  CIUDAD: string;
  AGENCIA: string;
  TIPO_EJECUTIVO: string;
  EJECUTIVO: string;
  EJECUTIVO_FINAL: string;
  claridad_informacion: Calificacion | null;
  recomendacion: Calificacion | null;
  satisfaccion_general: Calificacion | null;
  lealtad: Calificacion | null;
  [key: string]: any; // Para otras columnas no definidas estrictamente
}

export interface Stats {
  average: number;
  rating5: number;
  rating4: number;
  rating123: number;
}

export interface KPIData {
  metric: string;
  consolidado: Stats;
  personas: Stats;
  empresarial: Stats;
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
    claridad_informacion: Comparacion;
    satisfaccion_general: Comparacion;
    recomendacion: Comparacion;
    lealtad: Comparacion;
  };
}

export interface SuggestionData {
  categoria: string;
  porcentaje: number;
  count?: number;
  detalles?: Array<{
    sugerencia: string;
    porcentaje: number;
  }>;
}

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
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
}

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
  metric: string;
  consolidado: {
    average: number;
    rating5: number;
    rating4: number;
    rating123: number;
  };
  personas: {
    average: number;
    rating5: number;
    rating4: number;
    rating123: number;
  };
  empresarial: {
    average: number;
    rating5: number;
    rating4: number;
    rating123: number;
  };
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
  count?: number;
  detalles?: Array<{
    sugerencia: string;
    porcentaje: number;
  }>;
}

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
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
