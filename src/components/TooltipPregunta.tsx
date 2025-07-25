import React, { useState, useRef, useEffect, useCallback } from 'react';
import { QuestionMapping } from '../data/questionsMap';

interface TooltipPreguntaProps {
  questionMapping: QuestionMapping;
  children: React.ReactNode;
}

const TooltipPregunta: React.FC<TooltipPreguntaProps> = ({ questionMapping, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSticky, setIsSticky] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Posición preferida: centro de la pantalla, pero adaptable
      let x = Math.min(rect.left + rect.width / 2, viewportWidth - 200);
      let y = Math.min(rect.bottom + 10, viewportHeight - 300);
      
      // Si no cabe abajo, ponerlo arriba
      if (y + 300 > viewportHeight) {
        y = Math.max(rect.top - 310, 20);
      }
      
      // Si no cabe a la derecha, moverlo a la izquierda
      if (x + 384 > viewportWidth) { // 384px = w-96
        x = Math.max(viewportWidth - 400, 20);
      }
      
      setPosition({ x, y });
    }
    setIsVisible(true);
  }, []);

  const hideTooltip = useCallback(() => {
    if (!isSticky) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsSticky(false);
      }, 300); // Mayor delay para mejor UX
    }
  }, [isSticky]);

  const handleTooltipEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSticky(true);
  }, []);

  const handleTooltipLeave = useCallback(() => {
    setIsSticky(false);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  // Cerrar tooltip al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isVisible && !isSticky) {
        setIsVisible(false);
      }
    };

    const handleResize = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible, isSticky]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div 
        ref={triggerRef}
        className="cursor-help"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          className="fixed w-96 p-4 bg-white border-2 border-gray-300 rounded-xl shadow-2xl animate-fadeIn pointer-events-auto"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 9999,
            maxHeight: '400px',
            overflowY: 'auto'
          }}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                Pregunta {questionMapping.questionNumber}
              </span>
              <span className="text-xs text-gray-500">Encuesta 2024-2025</span>
            </div>
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>

          {/* Pregunta Original */}
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">📝 Pregunta Original</h4>
            <p className="text-sm text-gray-700 leading-relaxed italic border-l-3 border-blue-300 pl-3">
              "{questionMapping.originalQuestion}"
            </p>
          </div>

          {/* Escala de Respuesta */}
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">📊 Opciones de Respuesta</h4>
            {questionMapping.responseOptions.length > 0 ? (
              <div className="space-y-1">
                {questionMapping.responseOptions.map((option) => (
                  <div key={option.value} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        option.value === 5 ? 'bg-blue-600' :
                        option.value === 4 ? 'bg-green-500' :
                        'bg-red-500'
                      }`}>
                        {option.value}
                      </span>
                      <span className="text-gray-700">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">{questionMapping.responseScale}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">💡 ¿Qué mide?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{questionMapping.description}</p>
          </div>

          {/* Interpretación de Calificaciones (solo para preguntas numéricas) */}
          {questionMapping.responseScale.includes('1-5') && (
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">🎯 Interpretación</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-gray-600">1-3</span>
                  <br />
                  <span className="text-gray-500">Necesita mejora</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-gray-600">4</span>
                  <br />
                  <span className="text-gray-500">Bueno</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto mb-1"></div>
                  <span className="text-gray-600">5</span>
                  <br />
                  <span className="text-gray-500">Excelente</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 pt-2 mt-3">
            <p className="text-xs text-gray-400 text-center">
              💡 Hover sobre el título para ver esta información
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TooltipPregunta;
