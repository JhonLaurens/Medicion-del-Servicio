
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-secondary text-slate-300 py-4 sm:py-6 text-center border-t border-brand-accent/20" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          {/* Copyright and company info */}
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base font-medium">
              &copy; {currentYear} Coltefinanciera S.A. Todos los derechos reservados.
            </p>
            <p className="text-xs sm:text-sm mt-1 text-slate-400">
              Plataforma de Análisis de Satisfacción del Cliente
            </p>
          </div>

          {/* System info and status */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
              <span className="text-slate-300">Sistema Operativo</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-500"></div>
            <div className="text-slate-400">
              Versión 2024.1
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-500"></div>
            <div className="text-slate-400">
              Gerencia del Talento Humano
            </div>
          </div>
        </div>

        {/* Additional info for larger screens */}
        <div className="hidden lg:block mt-4 pt-4 border-t border-slate-600/30">
          <div className="flex items-center justify-center space-x-6 text-xs text-slate-400">
            <span>📊 Dashboard Ejecutivo</span>
            <span>•</span>
            <span>🔒 Datos Seguros</span>
            <span>•</span>
            <span>⚡ Tiempo Real</span>
            <span>•</span>
            <span>📈 Analytics Avanzado</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
