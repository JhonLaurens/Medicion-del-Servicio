import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface PerformanceConfig {
  enableLazyLoading?: boolean;
  debounceMs?: number;
  throttleMs?: number;
  enableVirtualization?: boolean;
  chunkSize?: number;
}

/**
 * Hook para optimizar el rendimiento de componentes pesados
 */
export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    enableLazyLoading = true,
    debounceMs = 300,
    throttleMs = 100,
    enableVirtualization = false,
    chunkSize = 50
  } = config;

  const [isVisible, setIsVisible] = useState(!enableLazyLoading);
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!enableLazyLoading || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [enableLazyLoading, isVisible]);

  // Función de debounce
  const debounce = useCallback(
    <T extends (...args: any[]) => any>(func: T, delay: number = debounceMs) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
    [debounceMs]
  );

  // Función de throttle
  const throttle = useCallback(
    <T extends (...args: any[]) => any>(func: T, delay: number = throttleMs) => {
      let lastCall = 0;
      return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          func(...args);
        }
      };
    },
    [throttleMs]
  );

  // Función para chunking de datos grandes
  const chunkData = useCallback(
    <T>(data: T[], size: number = chunkSize): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < data.length; i += size) {
        chunks.push(data.slice(i, i + size));
      }
      return chunks;
    },
    [chunkSize]
  );

  // Hook para virtualización de listas grandes
  const useVirtualization = useCallback(
    <T>(items: T[], itemHeight: number, containerHeight: number) => {
      const [scrollTop, setScrollTop] = useState(0);
      
      const visibleStart = Math.floor(scrollTop / itemHeight);
      const visibleEnd = Math.min(
        visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );
      
      const visibleItems = items.slice(visibleStart, visibleEnd);
      const totalHeight = items.length * itemHeight;
      const offsetY = visibleStart * itemHeight;
      
      return {
        visibleItems,
        totalHeight,
        offsetY,
        onScroll: (e: React.UIEvent<HTMLElement>) => {
          setScrollTop(e.currentTarget.scrollTop);
        }
      };
    },
    []
  );

  return {
    isVisible,
    isLoading,
    setIsLoading,
    elementRef,
    debounce,
    throttle,
    chunkData,
    useVirtualization
  };
};

/**
 * Hook para memoización inteligente de cálculos pesados
 */
export const useSmartMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  options: { enableProfiling?: boolean } = {}
) => {
  const { enableProfiling = false } = options;
  const startTimeRef = useRef<number>(0);
  const lastComputeTimeRef = useRef<number>(0);

  return useMemo(() => {
    if (enableProfiling) {
      startTimeRef.current = performance.now();
    }

    const result = factory();

    if (enableProfiling) {
      const computeTime = performance.now() - startTimeRef.current;
      lastComputeTimeRef.current = computeTime;
      
      if (computeTime > 16) { // Más de un frame (16ms)
        console.warn(
          `⚠️ useSmartMemo: Cálculo pesado detectado (${computeTime.toFixed(2)}ms)`,
          { deps, computeTime }
        );
      }
    }

    return result;
  }, deps);
};

/**
 * Hook para optimizar re-renders de componentes
 */
export const useRenderOptimization = () => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());
  const propsHistoryRef = useRef<any[]>([]);

  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    // Detectar re-renders frecuentes
    if (timeSinceLastRender < 16 && renderCountRef.current > 5) {
      console.warn(
        `⚠️ useRenderOptimization: Re-renders frecuentes detectados`,
        {
          renderCount: renderCountRef.current,
          timeSinceLastRender,
          propsHistory: propsHistoryRef.current.slice(-3)
        }
      );
    }
  });

  const trackProps = useCallback((props: any) => {
    propsHistoryRef.current.push({
      timestamp: Date.now(),
      props: JSON.stringify(props)
    });
    
    // Mantener solo los últimos 10 registros
    if (propsHistoryRef.current.length > 10) {
      propsHistoryRef.current = propsHistoryRef.current.slice(-10);
    }
  }, []);

  return {
    renderCount: renderCountRef.current,
    trackProps,
    getRenderStats: () => ({
      totalRenders: renderCountRef.current,
      lastRenderTime: lastRenderTimeRef.current,
      propsHistory: propsHistoryRef.current
    })
  };
};

/**
 * Hook para gestión inteligente de estado
 */
export const useOptimizedState = <T>(
  initialState: T,
  options: {
    enableBatching?: boolean;
    batchDelay?: number;
    enableHistory?: boolean;
    maxHistorySize?: number;
  } = {}
) => {
  const {
    enableBatching = false,
    batchDelay = 50,
    enableHistory = false,
    maxHistorySize = 10
  } = options;

  const [state, setState] = useState<T>(initialState);
  const [history, setHistory] = useState<T[]>([initialState]);
  const batchedUpdatesRef = useRef<Partial<T>[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateState = useCallback(
    (update: Partial<T> | ((prev: T) => T)) => {
      if (enableBatching && typeof update === 'object') {
        batchedUpdatesRef.current.push(update);
        
        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }
        
        batchTimeoutRef.current = setTimeout(() => {
          const mergedUpdate = batchedUpdatesRef.current.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {} as Partial<T>
          );
          
          setState(prev => {
            const newState = { ...prev, ...mergedUpdate };
            
            if (enableHistory) {
              setHistory(prevHistory => {
                const newHistory = [...prevHistory, newState];
                return newHistory.length > maxHistorySize
                  ? newHistory.slice(-maxHistorySize)
                  : newHistory;
              });
            }
            
            return newState;
          });
          
          batchedUpdatesRef.current = [];
        }, batchDelay);
      } else {
        setState(prev => {
          const newState = typeof update === 'function' ? update(prev) : { ...prev, ...update };
          
          if (enableHistory) {
            setHistory(prevHistory => {
              const newHistory = [...prevHistory, newState];
              return newHistory.length > maxHistorySize
                ? newHistory.slice(-maxHistorySize)
                : newHistory;
            });
          }
          
          return newState;
        });
      }
    },
    [enableBatching, batchDelay, enableHistory, maxHistorySize]
  );

  const undo = useCallback(() => {
    if (enableHistory && history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1];
      setState(previousState);
      setHistory(newHistory);
    }
  }, [enableHistory, history]);

  return {
    state,
    updateState,
    history: enableHistory ? history : [],
    undo: enableHistory ? undo : undefined,
    canUndo: enableHistory && history.length > 1
  };
};