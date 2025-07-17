import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../types';

const NavigationSidebar: React.FC = () => {
  const navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'ficha-tecnica', label: 'Ficha Técnica', icon: '📋' },
    { id: 'dashboard-general', label: 'Dashboard General', icon: '📊' },
    { id: 'analisis-segmento', label: 'Análisis por Segmento', icon: '👥' },
    { id: 'analisis-geografico', label: 'Análisis Geográfico', icon: '🗺️' },
    { id: 'analisis-sugerencias', label: 'Análisis de Sugerencias', icon: '💡' },
    { id: 'participacion-gerentes', label: 'Participación de Gerentes', icon: '👨‍💼' },
    { id: 'explorador-datos', label: 'Explorador de Datos', icon: '🔍' },
    { id: 'test', label: '🧪 Prueba de Datos', icon: '🔧' },
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
      isActive
        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
    }`;

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
            C
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Coltefinanciera</h2>
            <p className="text-xs text-gray-500">Medición del Servicio</p>
          </div>
        </div>

        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink to={`/${item.id}`} className={getNavLinkClass}>
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationSidebar;
