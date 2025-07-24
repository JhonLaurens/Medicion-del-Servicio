import React, { useState } from 'react';
import { HelpCircle, X, BookOpen } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "NPS (Net Promoter Score)",
    definition: "Métrica que mide la lealtad del cliente basada en la probabilidad de recomendar el servicio. Se calcula restando el porcentaje de detractores del porcentaje de promotores.",
    category: "Métricas de Satisfacción"
  },
  {
    term: "Lealtad",
    definition: "Indicador que mide la disposición del cliente a continuar utilizando el servicio y su resistencia a cambiar a la competencia.",
    category: "Métricas de Satisfacción"
  },
  {
    term: "Satisfacción General",
    definition: "Evaluación global del cliente sobre su experiencia con el servicio, considerando todos los puntos de contacto.",
    category: "Métricas de Satisfacción"
  },
  {
    term: "Facilidad de Uso",
    definition: "Medida de qué tan fácil es para los clientes utilizar el servicio o producto sin dificultades o confusión.",
    category: "Métricas de Experiencia"
  },
  {
    term: "Calidad del Servicio",
    definition: "Evaluación de la excelencia del servicio prestado, incluyendo aspectos como rapidez, precisión y profesionalismo.",
    category: "Métricas de Experiencia"
  },
  {
    term: "Segmento Personas",
    definition: "Clientes individuales que utilizan los servicios para uso personal o familiar.",
    category: "Segmentación"
  },
  {
    term: "Segmento Empresarial",
    definition: "Clientes corporativos que utilizan los servicios para sus operaciones comerciales, divididos por ubicación geográfica.",
    category: "Segmentación"
  },
  {
    term: "Brecha (Gap)",
    definition: "Diferencia entre el valor actual de una métrica y su objetivo o meta establecida. Se expresa como porcentaje de desviación.",
    category: "Análisis de Rendimiento"
  },
  {
    term: "Tendencia",
    definition: "Dirección general del cambio de una métrica a lo largo del tiempo, puede ser ascendente, descendente o estable.",
    category: "Análisis de Rendimiento"
  },
  {
    term: "Percentil",
    definition: "Valor que indica el porcentaje de datos que se encuentran por debajo de un punto específico en una distribución.",
    category: "Estadísticas"
  }
];

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const Glossary: React.FC<GlossaryProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...Array.from(new Set(glossaryTerms.map(term => term.category)))];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Glosario de Términos</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Cerrar glosario"
              title="Cerrar glosario"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-2 text-blue-100">
            Definiciones de métricas y términos utilizados en el dashboard
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar término
              </label>
              <input
                id="search"
                type="text"
                placeholder="Buscar en el glosario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="sm:w-64">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron términos
              </h3>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTerms.map((term, index) => (
                <div key={index} className="glossary-term">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {term.term}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {term.category}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredTerms.length} de {glossaryTerms.length} términos
            </span>
            <span>
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Glossary;