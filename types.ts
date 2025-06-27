// Types definition for Coltefinanciera Customer Satisfaction Analytics

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export interface KPIData {
  metric: string;
  personas?: {
    average: number;
    rating5: number;
    rating4: number;
    rating123: number;
    totalResponses: number;
  };
  empresarial?: {
    average: number;
    rating5: number;
    rating4: number;
    rating123: number;
    totalResponses: number;
  };
}

export interface SegmentData {
  segmento: string;
  satisfaccion: number;
  lealtad: number;
  recomendacion: number;
  claridad: number;
  count: number;
}

export interface GeographicData {
  region: string;
  ciudad: string;
  satisfaccion: number;
  count: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface ComparisonData {
  metric: string;
  personas: number;
  empresas: number;
  gap: number;
  leader: 'Personas' | 'Empresas' | 'Empate';
}

export interface TooltipData {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export interface ResponseData {
  [key: string]: any;
  segmento?: string;
  region?: string;
  ciudad?: string;
  canal?: string;
  satisfaccion_general?: number;
  lealtad?: number;
  recomendacion?: number;
  claridad_informacion?: number;
}