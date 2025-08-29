import React, { useState } from "react";
import { NavItem } from "../types";

interface NavigationSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentPage,
  onPageChange,
}) => {
  const [isTechnicalMenuOpen, setIsTechnicalMenuOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    {
      id: "inicio",
      label: "Inicio",
      icon: "🏠",
      description: "Panel principal y resumen ejecutivo",
    },
    {
      id: "ficha-tecnica",
      label: "Ficha Técnica",
      icon: "📋",
      description: "Metodología y especificaciones",
    },
    {
      id: "metricas-completas",
      label: "Métricas Completas",
      icon: "📈",
      description: "Vista detallada de las 4 métricas principales",
    },
    {
      id: "analisis-segmento",
      label: "Análisis por Segmento",
      icon: "👥",
      description: "Comparativo Personas vs Empresas",
    },
    {
      id: "analisis-geografico",
      label: "Análisis Geográfico",
      icon: "🗺️",
      description: "Distribución territorial y regional",
    },
    {
      id: "analisis-sugerencias",
      label: "Análisis de Sugerencias",
      icon: "💡",
      description: "Insights cualitativos y tendencias",
    },
    {
      id: "participacion-gerentes",
      label: "Participación de Gerentes",
      icon: "👨‍💼",
      description: "Reporte ejecutivo de cobertura",
    },
    {
      id: "explorador-datos",
      label: "Explorador de Datos",
      icon: "🔍",
      description: "Análisis exploratorio interactivo",
    },
  ];

  const technicalNavItems: NavItem[] = [
    {
      id: "pruebas-componentes",
      label: "Pruebas de Componentes",
      icon: "🧪",
      description: "Validación exhaustiva de todos los componentes",
    },
    {
      id: "diagnostico",
      label: "Diagnóstico del Sistema",
      icon: "🔍",
      description: "Debugging y estado de la aplicación",
    },
    {
      id: "diagnostico-datos",
      label: "Diagnóstico de Datos",
      icon: "🔍",
      description: "Análisis y validación de datos",
    },
    {
      id: "auditoria-navegacion",
      label: "Auditoría de Navegación",
      icon: "🔍",
      description: "Detección automática de errores en todas las secciones",
    },
    {
      id: "prueba-navegacion-manual",
      label: "Prueba Manual de Navegación",
      icon: "🧪",
      description: "Análisis sistemático manual de todas las secciones",
    },
    {
      id: "suite-pruebas-manual",
      label: "Suite de Pruebas Completa",
      icon: "🔬",
      description: "Verificación completa de funcionalidad, rendimiento y accesibilidad",
    },
    {
      id: "prueba-compatibilidad-entornos",
      label: "Compatibilidad Multi-Entorno",
      icon: "🌐",
      description: "Verificación automática de Vercel y GitHub Pages",
    },
  ];

  const allNavItems = [...mainNavItems, ...technicalNavItems];
  const isTechnicalItemActive = technicalNavItems.some(item => item.id === currentPage);

  return (
    <nav className="w-80 bg-gradient-to-b from-gray-50 via-white to-gray-50 shadow-2xl border-r border-gray-200 min-h-screen relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="pattern-dots h-full w-full"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
            {/* Header background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <span className="text-lg">🧭</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Navegación</h3>
                  <p className="text-brand-light text-sm opacity-90">
                    Sistema de Analytics
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                  <div className="text-sm font-bold">{allNavItems.length}</div>
                  <div className="text-xs text-brand-light">Módulos</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="text-xs text-brand-light">Activo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced navigation items */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-3">
            Módulos del Sistema
          </div>

          {/* Main navigation items */}
          {mainNavItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-xl transform scale-102 border-2 border-brand-accent/30"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-lg hover:scale-101 border-2 border-transparent"
                }`}
              >
                {/* Background overlay for active state */}
                {currentPage === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-xl"></div>
                )}

                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-start space-x-4">
                  {/* Icon with enhanced styling */}
                  <div
                    className={`text-2xl flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 ${
                      currentPage === item.id ? "filter drop-shadow-sm" : ""
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold text-sm block truncate ${
                          currentPage === item.id
                            ? "text-white"
                            : "text-gray-800 group-hover:text-brand-primary"
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Active indicator */}
                      {currentPage === item.id && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-xs block truncate mt-1 leading-relaxed ${
                        currentPage === item.id
                          ? "text-brand-light"
                          : "text-gray-500 group-hover:text-gray-600"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </div>

                {/* Border accent for active item */}
                {currentPage === item.id && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-brand-accent rounded-r-full"></div>
                )}
              </button>
            </div>
          ))}

          {/* Technical modules dropdown */}
          <div className="mt-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 px-3">
              Módulos Técnicos
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsTechnicalMenuOpen(!isTechnicalMenuOpen)}
                className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isTechnicalItemActive
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl transform scale-102 border-2 border-orange-300/30"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:shadow-lg hover:scale-101 border-2 border-transparent"
                }`}
              >
                {/* Background overlay for active state */}
                {isTechnicalItemActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl"></div>
                )}

                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-start space-x-4">
                  {/* Icon with enhanced styling */}
                  <div
                    className={`text-2xl flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 ${
                      isTechnicalItemActive ? "filter drop-shadow-sm" : ""
                    }`}
                  >
                    ⚙️
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold text-sm block truncate ${
                          isTechnicalItemActive
                            ? "text-white"
                            : "text-gray-800 group-hover:text-orange-600"
                        }`}
                      >
                        Herramientas Técnicas
                      </span>

                      {/* Dropdown arrow */}
                      <div className={`flex-shrink-0 ml-2 transition-transform duration-300 ${
                        isTechnicalMenuOpen ? "rotate-180" : ""
                      }`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>

                      {/* Active indicator */}
                      {isTechnicalItemActive && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-xs block truncate mt-1 leading-relaxed ${
                        isTechnicalItemActive
                          ? "text-orange-100"
                          : "text-gray-500 group-hover:text-gray-600"
                      }`}
                    >
                      Diagnósticos, pruebas y validaciones internas
                    </span>
                  </div>
                </div>

                {/* Border accent for active item */}
                {isTechnicalItemActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-orange-300 rounded-r-full"></div>
                )}
              </button>

              {/* Technical submenu */}
              {isTechnicalMenuOpen && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  {technicalNavItems.map((item) => (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => onPageChange(item.id)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                          currentPage === item.id
                            ? "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg transform scale-102"
                            : "text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:shadow-md hover:scale-101"
                        }`}
                      >
                        <div className="relative flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`text-lg flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110`}>
                            {item.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span
                              className={`font-medium text-xs block truncate ${
                                currentPage === item.id
                                  ? "text-white"
                                  : "text-gray-700 group-hover:text-orange-600"
                              }`}
                            >
                              {item.label}
                            </span>

                            <span
                              className={`text-xs block truncate mt-0.5 leading-relaxed ${
                                currentPage === item.id
                                  ? "text-orange-100"
                                  : "text-gray-500 group-hover:text-gray-600"
                              }`}
                            >
                              {item.description}
                            </span>
                          </div>
                        </div>

                        {/* Border accent for active item */}
                        {currentPage === item.id && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-orange-200 rounded-r-full"></div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Simplified footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-inner border border-gray-200">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs font-semibold text-gray-700">
                  Sistema Activo
                </p>
              </div>

              <div className="text-xs text-gray-500">
                Analytics Platform v2.0 • © 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationSidebar;
