# Documento de Diseño de Software
## Dashboard Coltefinanciera - Análisis de Satisfacción del Cliente

---

## 1. Diagnóstico Actual del Proyecto

### 1.1 Análisis de la Estructura Actual

El proyecto presenta varios problemas de organización que afectan su mantenibilidad y escalabilidad:

**Problemas Identificados:**

1. **Archivos sueltos en la raíz del proyecto:**
   - Más de 80 archivos de documentación (.md) en la raíz
   - Múltiples scripts de debug y validación (debug-*.js, validacion-*.js)
   - Archivos de configuración dispersos
   - Componentes fuera de la estructura src/ (components/ en raíz)

2. **Duplicación de componentes:**
   - `SegmentAnalysis.tsx` y `SegmentAnalysis_fixed.tsx`
   - `MetricsOverview.tsx` y `MetricsOverview-fix.tsx`
   - `TooltipPregunta.tsx` y `TooltipPregunta_fixed.tsx`
   - Múltiples versiones de componentes de dashboard

3. **Falta de organización modular:**
   - Todos los componentes en una sola carpeta plana
   - No hay separación por funcionalidad o dominio
   - Mezcla de componentes de UI, páginas y utilidades

4. **Archivos de testing y debug mezclados:**
   - Archivos de prueba en producción
   - Scripts de debug sin organización
   - Múltiples archivos de validación redundantes

### 1.2 Evaluación de la Arquitectura Actual

**Fortalezas:**
- Uso de TypeScript para tipado fuerte
- Implementación de React 18 con hooks modernos
- Configuración adecuada de Vite
- Uso de Tailwind CSS para estilos
- Implementación de Recharts para visualizaciones

**Debilidades:**
- Falta de separación clara de responsabilidades
- No hay patrón de arquitectura definido
- Ausencia de estructura modular
- Código de testing mezclado con producción

---

## 2. Visión General del Sistema

### 2.1 Propósito del Sistema

Dashboard ejecutivo de análisis de satisfacción del cliente para **Coltefinanciera**, que permite:

- Análisis comparativo por segmentos (Personas vs Empresas)
- Visualizaciones interactivas de métricas KPI
- Reportes automáticos de satisfacción del cliente
- Análisis geográfico y por ejecutivos
- Procesamiento inteligente de sugerencias de clientes

### 2.2 Usuarios Objetivo

- **Ejecutivos de Coltefinanciera:** Análisis estratégico y toma de decisiones
- **Gerentes de Agencia:** Monitoreo de performance por ubicación
- **Analistas de Datos:** Exploración detallada de información
- **Equipos de Atención al Cliente:** Identificación de áreas de mejora

### 2.3 Funcionalidades Principales

1. **Análisis de Segmentos:** Comparación Personas vs Empresas
2. **Análisis Geográfico:** Performance por ciudades y agencias
3. **Análisis de Sugerencias:** Categorización automática con IA
4. **Reportes de Participación:** Seguimiento de ejecutivos
5. **Explorador de Datos:** Herramientas de análisis avanzado
6. **Métricas KPI:** Dashboards ejecutivos con indicadores clave

### 2.4 Stack Tecnológico

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS
- **Gráficos:** Recharts
- **Procesamiento de Datos:** PapaParse
- **Iconografía:** Lucide React
- **Testing:** Vitest + Testing Library

---

## 3. Arquitectura Propuesta

### 3.1 Nueva Estructura de Carpetas

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes básicos de UI
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Tooltip/
│   ├── charts/          # Componentes de gráficos
│   │   ├── BarChart/
│   │   ├── LineChart/
│   │   ├── PieChart/
│   │   └── TrendChart/
│   ├── layout/          # Componentes de layout
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── Navigation/
│   └── common/          # Componentes comunes
│       ├── ErrorBoundary/
│       ├── LoadingSpinner/
│       └── DataStatus/
├── pages/               # Páginas principales
│   ├── HomePage/
│   ├── DashboardPage/
│   ├── SegmentAnalysisPage/
│   ├── GeographicAnalysisPage/
│   ├── SuggestionsAnalysisPage/
│   ├── DataExplorerPage/
│   └── TechnicalSpecsPage/
├── features/            # Módulos por funcionalidad
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── analytics/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── reports/
│       ├── components/
│       ├── hooks/
│       └── services/
├── hooks/               # Custom hooks globales
│   ├── useData/
│   ├── useFilters/
│   └── useAnalytics/
├── services/            # Servicios y APIs
│   ├── dataService.ts
│   ├── analyticsService.ts
│   └── exportService.ts
├── utils/               # Utilidades y helpers
│   ├── formatters/
│   ├── validators/
│   └── constants/
├── types/               # Definiciones de tipos
│   ├── api.ts
│   ├── components.ts
│   └── data.ts
├── assets/              # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
└── __tests__/           # Tests organizados
    ├── components/
    ├── pages/
    ├── hooks/
    └── utils/
```

### 3.2 Organización por Funcionalidad

**Principio de Separación de Responsabilidades:**

1. **Componentes UI:** Elementos reutilizables sin lógica de negocio
2. **Páginas:** Contenedores principales que orquestan componentes
3. **Features:** Módulos autocontenidos por funcionalidad
4. **Servicios:** Lógica de acceso a datos y APIs
5. **Hooks:** Lógica reutilizable de estado y efectos
6. **Utils:** Funciones puras y utilidades

### 3.3 Patrones de Arquitectura

**1. Feature-Based Architecture:**
- Organización por funcionalidades de negocio
- Módulos autocontenidos y reutilizables
- Fácil escalabilidad y mantenimiento

**2. Component Composition:**
- Componentes pequeños y enfocados
- Composición sobre herencia
- Props drilling minimizado

**3. Custom Hooks Pattern:**
- Lógica de estado extraída a hooks
- Reutilización de lógica entre componentes
- Separación de UI y lógica de negocio

---

## 4. Diseño de Componentes

### 4.1 Jerarquía de Componentes

```
App
├── Layout
│   ├── Header
│   ├── NavigationSidebar
│   └── Footer
└── Router
    ├── HomePage
    ├── DashboardPage
    │   ├── MetricsOverview
    │   ├── KPICards
    │   └── TrendCharts
    ├── SegmentAnalysisPage
    │   ├── SegmentComparison
    │   ├── DistributionCharts
    │   └── ExecutiveSummary
    ├── GeographicAnalysisPage
    │   ├── GeographicMap
    │   ├── CityPerformance
    │   └── RegionalTrends
    └── SuggestionsAnalysisPage
        ├── CategoryBreakdown
        ├── SentimentAnalysis
        └── AIInsights
```

### 4.2 Categorización de Componentes

**1. Componentes de Layout:**
- `Header`: Navegación principal y branding
- `NavigationSidebar`: Menú lateral de navegación
- `Footer`: Información corporativa

**2. Componentes de Página:**
- `HomePage`: Página de inicio con resumen ejecutivo
- `DashboardPage`: Dashboard principal con métricas
- `SegmentAnalysisPage`: Análisis comparativo por segmentos
- `GeographicAnalysisPage`: Análisis por ubicación geográfica

**3. Componentes de Visualización:**
- `KPICard`: Tarjetas de indicadores clave
- `TrendChart`: Gráficos de tendencias temporales
- `DistributionChart`: Gráficos de distribución
- `ComparisonChart`: Gráficos comparativos

**4. Componentes de UI:**
- `Button`: Botones reutilizables
- `Modal`: Ventanas modales
- `Tooltip`: Información contextual
- `LoadingSpinner`: Indicadores de carga

### 4.3 Responsabilidades por Componente

| Componente | Responsabilidad | Dependencias |
|------------|-----------------|-------------|
| `App` | Orquestación general, routing | React Router, Error Boundary |
| `Header` | Navegación, branding | Navigation hooks |
| `DashboardPage` | Coordinación de métricas | Data services, Analytics hooks |
| `KPICard` | Visualización de KPI individual | Formatting utils |
| `SegmentAnalysis` | Análisis comparativo | Data filtering, Chart components |
| `DataService` | Acceso y procesamiento de datos | PapaParse, Data validation |

---

## 5. Plan de Reorganización

### 5.1 Estrategia de Migración

**Fase 1: Limpieza y Consolidación (1-2 días)**
1. Eliminar archivos duplicados y obsoletos
2. Consolidar scripts de debug en carpeta `scripts/`
3. Mover documentación a `docs/`
4. Identificar componentes activos vs deprecados

**Fase 2: Restructuración de Componentes (2-3 días)**
1. Crear nueva estructura de carpetas
2. Migrar componentes a su ubicación correcta
3. Actualizar imports y referencias
4. Consolidar componentes duplicados

**Fase 3: Modularización por Features (3-4 días)**
1. Agrupar componentes por funcionalidad
2. Extraer lógica a custom hooks
3. Crear servicios especializados
4. Implementar barrel exports

**Fase 4: Testing y Documentación (2-3 días)**
1. Reorganizar tests por módulo
2. Actualizar documentación
3. Crear guías de desarrollo
4. Validar funcionalidad completa

### 5.2 Archivos a Eliminar

**Scripts de Debug Obsoletos:**
- `debug-*.js` (consolidar en `scripts/debug/`)
- `validacion-*.js` (consolidar en `scripts/validation/`)
- `test-*.js` (mover a `__tests__/`)

**Componentes Duplicados:**
- `SegmentAnalysis_fixed.tsx` (consolidar con principal)
- `MetricsOverview-fix.tsx` (consolidar con principal)
- `TooltipPregunta_fixed.tsx` (consolidar con principal)
- `GeneralDashboard_new.tsx` (evaluar y consolidar)

**Documentación Dispersa:**
- Mover archivos `.md` a `docs/`
- Consolidar reportes en `docs/reports/`
- Organizar guías en `docs/guides/`

### 5.3 Consolidación de Funcionalidades

**1. Componentes de Dashboard:**
```typescript
// Antes: Múltiples componentes dispersos
Dashboard.tsx
GeneralDashboard.tsx
GeneralDashboard_new.tsx
MetricsOverview.tsx
MetricsOverview-fix.tsx

// Después: Estructura consolidada
src/features/dashboard/
├── components/
│   ├── DashboardLayout.tsx
│   ├── MetricsOverview.tsx
│   └── KPISection.tsx
├── hooks/
│   └── useDashboardData.ts
└── services/
    └── dashboardService.ts
```

**2. Análisis de Segmentos:**
```typescript
// Consolidar en módulo cohesivo
src/features/segment-analysis/
├── components/
│   ├── SegmentComparison.tsx
│   ├── DistributionCharts.tsx
│   └── ExecutiveSummary.tsx
├── hooks/
│   └── useSegmentAnalysis.ts
└── utils/
    └── segmentCalculations.ts
```

---

## 6. Recomendaciones de Mejora

### 6.1 Calidad del Código

**1. Implementar Linting y Formatting:**
```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

**2. Configurar Pre-commit Hooks:**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

**3. Implementar Code Review Guidelines:**
- Revisión obligatoria de PRs
- Checklist de calidad de código
- Estándares de nomenclatura
- Documentación de componentes

### 6.2 Mantenibilidad

**1. Implementar Barrel Exports:**
```typescript
// src/components/index.ts
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';
export { default as KPICard } from './ui/KPICard';
export { default as TrendChart } from './charts/TrendChart';
```

**2. Crear Interfaces Consistentes:**
```typescript
// src/types/components.ts
export interface BaseComponentProps {
  className?: string;
  testId?: string;
}

export interface ChartProps extends BaseComponentProps {
  data: ChartDataPoint[];
  title: string;
  loading?: boolean;
}
```

**3. Implementar Error Boundaries:**
```typescript
// src/components/common/ErrorBoundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  // Implementación con logging y fallback UI
}
```

### 6.3 Escalabilidad

**1. Implementar Lazy Loading:**
```typescript
// src/pages/index.ts
export const HomePage = lazy(() => import('./HomePage'));
export const DashboardPage = lazy(() => import('./DashboardPage'));
export const SegmentAnalysisPage = lazy(() => import('./SegmentAnalysisPage'));
```

**2. Optimizar Bundle Splitting:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          utils: ['papaparse', 'lucide-react'],
          features: [
            './src/features/dashboard',
            './src/features/analytics'
          ]
        }
      }
    }
  }
});
```

**3. Implementar State Management:**
```typescript
// Para aplicaciones más complejas, considerar:
// - Zustand para estado global ligero
// - React Query para estado del servidor
// - Context API para estado de UI
```

### 6.4 Documentación

**1. Documentación de Componentes:**
```typescript
/**
 * KPICard - Componente para mostrar indicadores clave de performance
 * 
 * @param title - Título del KPI
 * @param value - Valor numérico del indicador
 * @param trend - Tendencia (up, down, stable)
 * @param format - Formato de visualización (number, percentage, currency)
 * 
 * @example
 * <KPICard 
 *   title="Satisfacción General" 
 *   value={4.2} 
 *   trend="up" 
 *   format="number" 
 * />
 */
export const KPICard: React.FC<KPICardProps> = ({ ... }) => {
  // Implementación
};
```

**2. Guías de Desarrollo:**
```markdown
# docs/development-guide.md

## Estructura del Proyecto
## Convenciones de Nomenclatura
## Patrones de Componentes
## Testing Guidelines
## Deployment Process
```

**3. API Documentation:**
```typescript
// src/services/README.md
# Servicios de Datos

## dataService.ts
- `loadData()`: Carga datos desde CSV
- `getKPIData()`: Calcula métricas KPI
- `getSegmentAnalysis()`: Análisis por segmentos
```

### 6.5 Testing

**1. Estructura de Testing:**
```
__tests__/
├── components/
│   ├── ui/
│   ├── charts/
│   └── layout/
├── pages/
├── hooks/
├── services/
└── utils/
```

**2. Testing Guidelines:**
```typescript
// Ejemplo de test de componente
describe('KPICard', () => {
  it('should render title and value correctly', () => {
    render(<KPICard title="Test KPI" value={42} />);
    expect(screen.getByText('Test KPI')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should show trend indicator when provided', () => {
    render(<KPICard title="Test" value={42} trend="up" />);
    expect(screen.getByTestId('trend-up')).toBeInTheDocument();
  });
});
```

**3. Coverage Goals:**
- Componentes UI: 90%+
- Servicios: 95%+
- Hooks: 85%+
- Utils: 95%+

---

## 7. Implementación y Próximos Pasos

### 7.1 Roadmap de Implementación

**Sprint 1 (1-2 semanas): Limpieza y Reorganización**
- [ ] Eliminar archivos duplicados y obsoletos
- [ ] Crear nueva estructura de carpetas
- [ ] Migrar componentes principales
- [ ] Actualizar imports y referencias

**Sprint 2 (2-3 semanas): Modularización**
- [ ] Implementar feature-based architecture
- [ ] Extraer custom hooks
- [ ] Crear servicios especializados
- [ ] Implementar barrel exports

**Sprint 3 (1-2 semanas): Optimización**
- [ ] Configurar linting y formatting
- [ ] Implementar lazy loading
- [ ] Optimizar bundle splitting
- [ ] Mejorar performance

**Sprint 4 (1-2 semanas): Testing y Documentación**
- [ ] Reorganizar y ampliar tests
- [ ] Crear documentación técnica
- [ ] Implementar CI/CD mejorado
- [ ] Validación final

### 7.2 Métricas de Éxito

**Calidad del Código:**
- Reducción de duplicación de código: >80%
- Cobertura de tests: >85%
- Tiempo de build: <30 segundos
- Bundle size: <2MB

**Mantenibilidad:**
- Tiempo para agregar nueva feature: <2 días
- Tiempo para fix de bugs: <4 horas
- Onboarding de nuevos desarrolladores: <1 día

**Performance:**
- First Contentful Paint: <2 segundos
- Time to Interactive: <3 segundos
- Lighthouse Score: >90

### 7.3 Consideraciones de Riesgo

**Riesgos Técnicos:**
- Ruptura de funcionalidad durante migración
- Conflictos de merge durante reorganización
- Performance degradation temporal

**Mitigación:**
- Migración incremental por módulos
- Testing exhaustivo en cada fase
- Rollback plan preparado
- Feature flags para nuevas implementaciones

---

## 8. Conclusiones

Este documento presenta una estrategia completa para transformar el proyecto de un estado desorganizado a una arquitectura moderna, escalable y mantenible. La implementación de estas recomendaciones resultará en:

1. **Mejor Organización:** Estructura clara y predecible
2. **Mayor Mantenibilidad:** Código modular y bien documentado
3. **Escalabilidad Mejorada:** Arquitectura preparada para crecimiento
4. **Calidad Superior:** Standards de código y testing robustos
5. **Experiencia de Desarrollo Mejorada:** Herramientas y procesos optimizados

La inversión en esta reorganización pagará dividendos a largo plazo en términos de velocidad de desarrollo, calidad del producto y satisfacción del equipo de desarrollo.

---

**Documento creado por:** Consultor de Arquitectura de Software  
**Fecha:** Enero 2025  
**Versión:** 1.0  
**Proyecto:** Dashboard Coltefinanciera - Análisis de Satisfacción del Cliente