import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent shadow-2xl border-b-4 border-brand-accent relative overflow-hidden">
      {/* Pattern overlay for premium feel */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-10 pattern-dots">
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left section - Logo and Company */}
          <div className="flex items-center space-x-6">
            <div className="bg-white p-3 rounded-xl shadow-lg ring-2 ring-white/20 backdrop-blur-sm">
              <img 
                src="/images/Coltefinanciera.png" 
                alt="Logo Coltefinanciera" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">Coltefinanciera</h1>
              <p className="text-brand-light text-sm font-medium tracking-wide">
                Sistema de Análisis de Satisfacción del Cliente
              </p>
              <div className="flex items-center space-x-2 text-xs text-brand-light/80">
                <span>📊</span>
                <span>Dashboard Ejecutivo</span>
                <span>•</span>
                <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full font-semibold">
                  En Tiempo Real
                </span>
              </div>
            </div>
          </div>
          
          {/* Right section - Analytics badge and status */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Analytics badge */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20 shadow-lg">
              <div className="text-center">
                <h2 className="text-lg font-bold text-white mb-1">Customer Analytics</h2>
                <div className="flex items-center justify-center space-x-4 text-brand-light text-xs">
                  <div className="text-center">
                    <div className="font-bold text-white">1,445</div>
                    <div>Respuestas</div>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <div className="font-bold text-white">95%</div>
                    <div>Confianza</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Sistema Activo</span>
              </div>
              <div className="text-xs text-brand-light">
                Última actualización: Hoy
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
