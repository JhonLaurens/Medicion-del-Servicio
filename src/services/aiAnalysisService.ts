// Servicio de Análisis de IA para Categorización Inteligente de Sugerencias
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

export class AIAnalysisService {
  private categories: AICategory[] = [
    {
      id: 'atencion_servicio',
      name: 'Atención y Servicio al Cliente',
      description: 'Comentarios sobre la calidad de atención, amabilidad del personal y experiencia de servicio',
      keywords: ['atención', 'servicio', 'amabilidad', 'personal', 'asesor', 'ejecutivo', 'trato', 'cordialidad', 'profesionalismo', 'capacitación', 'conocimiento'],
      sentiment: 'neutral',
      priority: 'high'
    },
    {
      id: 'tiempos_respuesta',
      name: 'Tiempos de Respuesta',
      description: 'Sugerencias relacionadas con velocidad de atención, tiempos de espera y eficiencia',
      keywords: ['tiempo', 'espera', 'rápido', 'lento', 'demora', 'agilidad', 'eficiencia', 'velocidad', 'pronto', 'tardanza'],
      sentiment: 'negative',
      priority: 'high'
    },
    {
      id: 'productos_financieros',
      name: 'Productos y Servicios Financieros',
      description: 'Comentarios sobre tasas, productos, tarifas y ofertas financieras',
      keywords: ['tasa', 'interés', 'producto', 'tarifa', 'costo', 'precio', 'cdt', 'crédito', 'cuenta', 'ahorro', 'inversión'],
      sentiment: 'neutral',
      priority: 'medium'
    },
    {
      id: 'tecnologia_digital',
      name: 'Tecnología y Canales Digitales',
      description: 'Sugerencias sobre plataformas digitales, aplicaciones y tecnología',
      keywords: ['página', 'web', 'app', 'aplicación', 'tecnología', 'sistema', 'digital', 'online', 'internet', 'móvil'],
      sentiment: 'neutral',
      priority: 'medium'
    },
    {
      id: 'horarios_disponibilidad',
      name: 'Horarios y Disponibilidad',
      description: 'Comentarios sobre horarios de atención y disponibilidad de servicios',
      keywords: ['horario', 'hora', 'disponibilidad', 'abierto', 'cerrado', 'fin de semana', 'festivo', 'madrugada', 'noche'],
      sentiment: 'neutral',
      priority: 'medium'
    },
    {
      id: 'infraestructura_fisica',
      name: 'Infraestructura y Espacios Físicos',
      description: 'Sugerencias sobre oficinas, agencias, espacios físicos y comodidades',
      keywords: ['oficina', 'agencia', 'espacio', 'lugar', 'cómodo', 'limpio', 'parqueadero', 'ubicación', 'acceso', 'instalaciones'],
      sentiment: 'neutral',
      priority: 'low'
    },
    {
      id: 'comunicacion_informacion',
      name: 'Comunicación e Información',
      description: 'Comentarios sobre claridad de información, comunicación y transparencia',
      keywords: ['información', 'comunicación', 'claro', 'explicar', 'entender', 'transparencia', 'detalle', 'confuso', 'dudas'],
      sentiment: 'neutral',
      priority: 'medium'
    },
    {
      id: 'procesos_tramites',
      name: 'Procesos y Trámites',
      description: 'Sugerencias sobre simplificación de procesos, documentación y trámites',
      keywords: ['proceso', 'trámite', 'documento', 'requisito', 'simple', 'complicado', 'fácil', 'difícil', 'papeles', 'gestión'],
      sentiment: 'neutral',
      priority: 'medium'
    },
    {
      id: 'satisfaccion_general',
      name: 'Satisfacción General',
      description: 'Comentarios generales de satisfacción, felicitaciones y reconocimientos',
      keywords: ['excelente', 'bueno', 'satisfecho', 'felicitaciones', 'gracias', 'recomiendo', 'contento', 'perfecto', 'ideal'],
      sentiment: 'positive',
      priority: 'low'
    },
    {
      id: 'quejas_problemas',
      name: 'Quejas y Problemas',
      description: 'Quejas específicas, problemas reportados y experiencias negativas',
      keywords: ['malo', 'problema', 'queja', 'error', 'falla', 'inconveniente', 'molesto', 'disgusto', 'insatisfecho'],
      sentiment: 'negative',
      priority: 'high'
    }
  ];

  // Análisis de sentimiento básico
  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['excelente', 'bueno', 'bien', 'satisfecho', 'contento', 'feliz', 'gracias', 'perfecto', 'ideal', 'recomiendo', 'agradezco'];
    const negativeWords = ['malo', 'pésimo', 'terrible', 'problema', 'queja', 'molesto', 'disgusto', 'insatisfecho', 'lento', 'demora', 'error'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Extracción de palabras clave
  private extractKeywords(text: string): string[] {
    const stopWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'más', 'muy', 'pero', 'sus', 'me', 'ya', 'todo', 'esta', 'fue', 'han', 'ser', 'está', 'tiene', 'puede', 'hacer', 'desde', 'hasta', 'sobre', 'entre'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
    
    // Contar frecuencia y devolver las más comunes
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  // Extracción de temas principales
  private extractThemes(text: string): string[] {
    const themes = [
      { name: 'Atención Personal', keywords: ['atención', 'personal', 'asesor', 'ejecutivo', 'amabilidad'] },
      { name: 'Velocidad de Servicio', keywords: ['tiempo', 'rápido', 'lento', 'espera', 'demora'] },
      { name: 'Costos y Tarifas', keywords: ['costo', 'precio', 'tarifa', 'caro', 'barato'] },
      { name: 'Tecnología', keywords: ['app', 'página', 'web', 'sistema', 'tecnología'] },
      { name: 'Productos Financieros', keywords: ['tasa', 'interés', 'crédito', 'cuenta', 'producto'] },
      { name: 'Accesibilidad', keywords: ['horario', 'ubicación', 'acceso', 'disponibilidad'] },
      { name: 'Información y Comunicación', keywords: ['información', 'explicar', 'claro', 'comunicación'] }
    ];
    
    const lowerText = text.toLowerCase();
    return themes
      .filter(theme => theme.keywords.some(keyword => lowerText.includes(keyword)))
      .map(theme => theme.name);
  }

  // Categorización inteligente
  private categorizeText(text: string): { category: string; confidence: number; subcategory?: string } {
    const lowerText = text.toLowerCase();
    let bestMatch = { category: 'satisfaccion_general', confidence: 0.1 };
    
    for (const category of this.categories) {
      let score = 0;
      let matchedKeywords = 0;
      
      for (const keyword of category.keywords) {
        if (lowerText.includes(keyword)) {
          score += 1;
          matchedKeywords++;
        }
      }
      
      // Calcular confianza basada en coincidencias de palabras clave
      const confidence = Math.min(0.95, (score / category.keywords.length) + (matchedKeywords * 0.1));
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { category: category.id, confidence };
      }
    }
    
    return bestMatch;
  }

  // Determinar prioridad basada en contenido
  private determinePriority(text: string, sentiment: string): 'high' | 'medium' | 'low' {
    const urgentWords = ['urgente', 'inmediato', 'problema', 'error', 'falla', 'queja', 'malo', 'pésimo'];
    const lowerText = text.toLowerCase();
    
    if (sentiment === 'negative' || urgentWords.some(word => lowerText.includes(word))) {
      return 'high';
    }
    
    if (sentiment === 'neutral' && text.length > 50) {
      return 'medium';
    }
    
    return 'low';
  }

  // Análisis principal de una sugerencia
  public analyzeSuggestion(text: string): AnalyzedSuggestion {
    // Limpiar texto
    const cleanedText = text
      .replace(/^"|"$/g, '')
      .replace(/"{2,}/g, '')
      .trim();
    
    if (!cleanedText || cleanedText.length < 3) {
      return {
        originalText: text,
        cleanedText,
        category: 'satisfaccion_general',
        sentiment: 'neutral',
        priority: 'low',
        keywords: [],
        confidence: 0.1,
        themes: []
      };
    }
    
    const sentiment = this.analyzeSentiment(cleanedText);
    const keywords = this.extractKeywords(cleanedText);
    const themes = this.extractThemes(cleanedText);
    const categorization = this.categorizeText(cleanedText);
    const priority = this.determinePriority(cleanedText, sentiment);
    
    return {
      originalText: text,
      cleanedText,
      category: categorization.category,
      sentiment,
      priority,
      keywords,
      confidence: categorization.confidence,
      themes
    };
  }

  // Análisis masivo de sugerencias
  public analyzeAllSuggestions(suggestions: string[]): AnalyzedSuggestion[] {
    return suggestions
      .filter(suggestion => suggestion && suggestion.trim() !== '')
      .map(suggestion => this.analyzeSuggestion(suggestion));
  }

  // Generar insights por categoría
  public generateCategoryInsights(analyzedSuggestions: AnalyzedSuggestion[]): CategoryInsight[] {
    const categoryGroups = new Map<string, AnalyzedSuggestion[]>();
    
    // Agrupar por categoría
    analyzedSuggestions.forEach(suggestion => {
      const category = suggestion.category;
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, []);
      }
      categoryGroups.get(category)!.push(suggestion);
    });
    
    const totalSuggestions = analyzedSuggestions.length;
    const insights: CategoryInsight[] = [];
    
    categoryGroups.forEach((suggestions, categoryId) => {
      const categoryInfo = this.categories.find(c => c.id === categoryId);
      const categoryName = categoryInfo?.name || categoryId;
      
      // Calcular métricas de sentimiento
      const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
      suggestions.forEach(s => sentimentCounts[s.sentiment]++);
      
      // Calcular métricas de prioridad
      const priorityCounts = { high: 0, medium: 0, low: 0 };
      suggestions.forEach(s => priorityCounts[s.priority]++);
      
      // Extraer palabras clave más frecuentes
      const allKeywords = suggestions.flatMap(s => s.keywords);
      const keywordFreq = new Map<string, number>();
      allKeywords.forEach(keyword => {
        keywordFreq.set(keyword, (keywordFreq.get(keyword) || 0) + 1);
      });
      
      const topKeywords = Array.from(keywordFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword, frequency]) => ({ keyword, frequency }));
      
      // Extraer temas más frecuentes
      const allThemes = suggestions.flatMap(s => s.themes);
      const themeFreq = new Map<string, number>();
      allThemes.forEach(theme => {
        themeFreq.set(theme, (themeFreq.get(theme) || 0) + 1);
      });
      
      const topThemes = Array.from(themeFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([theme, count]) => ({ theme, count }));
      
      // Ejemplos representativos
      const examples = suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map(s => s.cleanedText);
      
      insights.push({
        category: categoryName,
        count: suggestions.length,
        percentage: Math.round((suggestions.length / totalSuggestions) * 100),
        sentiment: {
          positive: Math.round((sentimentCounts.positive / suggestions.length) * 100),
          negative: Math.round((sentimentCounts.negative / suggestions.length) * 100),
          neutral: Math.round((sentimentCounts.neutral / suggestions.length) * 100)
        },
        priority: {
          high: Math.round((priorityCounts.high / suggestions.length) * 100),
          medium: Math.round((priorityCounts.medium / suggestions.length) * 100),
          low: Math.round((priorityCounts.low / suggestions.length) * 100)
        },
        topKeywords,
        topThemes,
        examples
      });
    });
    
    return insights.sort((a, b) => b.count - a.count);
  }

  // Obtener información de categoría
  public getCategoryInfo(categoryId: string): AICategory | undefined {
    return this.categories.find(c => c.id === categoryId);
  }

  // Obtener todas las categorías
  public getAllCategories(): AICategory[] {
    return this.categories;
  }
}

export const aiAnalysisService = new AIAnalysisService();