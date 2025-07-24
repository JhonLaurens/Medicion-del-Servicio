/**
 * Mapeo de métricas del dashboard con las preguntas exactas de la Encuesta de Satisfacción 2024-2025
 * Proporciona trazabilidad completa entre el instrumento de medición y las visualizaciones
 */

export interface QuestionMapping {
  metricKey: string;
  displayName: string;
  originalQuestion: string;
  questionNumber: number;
  responseScale: string;
  responseOptions: { value: number; label: string }[];
  description: string;
}

export const SURVEY_QUESTIONS: QuestionMapping[] = [
  {
    metricKey: 'claridad_informacion',
    displayName: 'Claridad de la Información (Atención)',
    originalQuestion: 'En general, ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?',
    questionNumber: 1,
    responseScale: 'Escala 1-5 (Acuerdo)',
    responseOptions: [
      { value: 5, label: 'Totalmente de acuerdo' },
      { value: 4, label: 'De acuerdo' },
      { value: 3, label: 'Ni en acuerdo / ni en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 1, label: 'Totalmente en desacuerdo' }
    ],
    description: 'Evalúa qué tan clara y comprensible es la información proporcionada por los canales de atención de Coltefinanciera.'
  },
  {
    metricKey: 'recomendacion',
    displayName: 'Recomendación',
    originalQuestion: '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas, familiares o amigos?',
    questionNumber: 2,
    responseScale: 'Escala 1-5 (Probabilidad)',
    responseOptions: [
      { value: 5, label: 'Totalmente probable' },
      { value: 4, label: 'Probable' },
      { value: 3, label: 'Ni probable ni no probable' },
      { value: 2, label: 'Poco probable' },
      { value: 1, label: 'Nada probable' }
    ],
    description: 'Mide la disposición del cliente a recomendar Coltefinanciera a otras personas (indicador NPS).'
  },
  {
    metricKey: 'satisfaccion_general',
    displayName: 'Satisfacción General',
    originalQuestion: 'En general, ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?',
    questionNumber: 3,
    responseScale: 'Escala 1-5 (Satisfacción)',
    responseOptions: [
      { value: 5, label: 'Totalmente satisfecho' },
      { value: 4, label: 'Satisfecho' },
      { value: 3, label: 'Ni satisfecho / ni insatisfecho' },
      { value: 2, label: 'Poco satisfecho' },
      { value: 1, label: 'Insatisfecho' }
    ],
    description: 'Evalúa el nivel general de satisfacción del cliente con todos los servicios de Coltefinanciera.'
  },
  {
    metricKey: 'lealtad',
    displayName: 'Lealtad',
    originalQuestion: 'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera, ¿qué tan probable es que usted continúe siendo cliente de Coltefinanciera?',
    questionNumber: 4,
    responseScale: 'Escala 1-5 (Probabilidad)',
    responseOptions: [
      { value: 5, label: 'Totalmente probable' },
      { value: 4, label: 'Probable' },
      { value: 3, label: 'Ni probable / ni no probable' },
      { value: 2, label: 'Poco probable' },
      { value: 1, label: 'Nada probable' }
    ],
    description: 'Mide la lealtad del cliente y su intención de permanencia con Coltefinanciera frente a la competencia.'
  },
  {
    metricKey: 'sugerencias',
    displayName: 'Sugerencias y Recomendaciones',
    originalQuestion: '¿Tiene alguna recomendación o sugerencia acerca del servicio que le ofrecemos en Coltefinanciera?',
    questionNumber: 5,
    responseScale: 'Respuesta abierta (texto libre)',
    responseOptions: [],
    description: 'Recopila comentarios, sugerencias y recomendaciones específicas de los clientes para mejorar el servicio.'
  }
];

/**
 * Obtiene el mapeo de pregunta por clave de métrica
 */
export const getQuestionByMetric = (metricKey: string): QuestionMapping | undefined => {
  return SURVEY_QUESTIONS.find(q => q.metricKey === metricKey);
};

/**
 * Obtiene el mapeo de pregunta por nombre de visualización
 */
export const getQuestionByDisplayName = (displayName: string): QuestionMapping | undefined => {
  return SURVEY_QUESTIONS.find(q => q.displayName === displayName);
};

/**
 * Obtiene todas las preguntas con escala numérica (1-5)
 */
export const getNumericQuestions = (): QuestionMapping[] => {
  return SURVEY_QUESTIONS.filter(q => q.responseScale.includes('1-5'));
};

/**
 * Obtiene preguntas de texto abierto
 */
export const getOpenTextQuestions = (): QuestionMapping[] => {
  return SURVEY_QUESTIONS.filter(q => q.responseScale.includes('texto libre'));
};

/**
 * Información técnica sobre la encuesta
 */
export const SURVEY_INFO = {
  title: 'Encuesta de Satisfacción del Cliente 2024-2 y 2025-1',
  period: '15 de abril al 01 de junio de 2025',
  methodology: 'Web, mediante SurveyMonkey',
  sampleSize: 1445,
  universeTotal: 24067,
  confidenceLevel: '95%',
  marginOfError: '±2,50%',
  responseRate: '6%',
  segments: ['Personas Naturales', 'Empresas'],
  channels: ['Presencial (Agencias)', 'Digital', 'Telefónico'],
  measurementPeriods: '2024-2 y 2025-1',
  note: 'La encuesta se realizó en 2025-1 pero representa la medición de los períodos 2024-2 y 2025-1'
};

export default SURVEY_QUESTIONS;
