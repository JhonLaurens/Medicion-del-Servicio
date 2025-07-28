# 📊 Reporte de Participación de Gerentes

## 🎯 Descripción

El **Reporte de Participación de Gerentes** es un nuevo componente analítico que proporciona una vista detallada de la participación de todos los gerentes en las encuestas de satisfacción al cliente de Coltefinanciera.

## 📋 Características Principales

### 🔍 **Análisis Multidimensional**
- **Participación por Categoría**: Gerentes de Agencia, Bogotá, Medellín y Otras Gerencias
- **Métricas de Cobertura**: Tasa de cobertura calculada como (Encuestados / Universo Depurado)
- **Indicadores de Efectividad**: Clasificación automática en Alta, Media o Baja efectividad

### 📊 **Visualizaciones Interactivas**
- **Gráfico Circular**: Distribución de encuestas por categoría de gerentes
- **Gráfico de Barras**: Top 10 gerentes por número de encuestas realizadas
- **Tabla Detallada**: Vista completa con filtros por categoría
- **Indicadores de Color**: Semáforos visuales para identificar rendimiento

### 🎛️ **Filtros Dinámicos**
- Filtro por categoría de gerente
- Contadores en tiempo real
- Navegación intuitiva entre diferentes vistas

## 📊 Datos Incluidos

### **Gerentes de Agencia (19 gerentes)**
- **Total de Encuestas**: 1,432 (100% del universo de agencias)
- **Cobertura General**: 6.37%
- **Universo Depurado**: 23,773

### **Gerentes de Cuenta Bogotá (4 gerentes)**
- **Total de Encuestas**: 2
- **Cobertura General**: 13.33%
- **Universo Depurado**: 24

### **Gerentes de Cuenta Medellín (3 gerentes)**
- **Total de Encuestas**: 3
- **Cobertura General**: 9.09%
- **Universo Depurado**: 36

### **Otras Gerencias (3 gerentes)**
- **Total de Encuestas**: 8
- **Universo Depurado**: 234

## 🎨 Características de Diseño

### **Interfaz Profesional**
- Diseño limpio y moderno con paleta de colores corporativa
- Tipografía legible y jerarquía visual clara
- Responsive design para diferentes tamaños de pantalla

### **Indicadores Visuales**
- 🟢 **Alta Efectividad**: >50 encuestas + >5% cobertura
- 🟡 **Media Efectividad**: >0 encuestas + >2% cobertura  
- 🔴 **Baja Efectividad**: 0 encuestas o <2% cobertura

### **Colores por Categoría**
- **Azul (#0088FE)**: Gerentes de Agencia
- **Verde (#00C49F)**: Gerentes Bogotá
- **Amarillo (#FFBB28)**: Gerentes Medellín
- **Naranja (#FF8042)**: Otras Gerencias

## 🔧 Funcionalidades Técnicas

### **Componente React**
```typescript
interface ManagerData {
  name: string;
  surveys: number;
  percentage: number;
  coverageRate: number;
  totalUniverse: number;
  category: string;
}
```

### **Gráficos con Recharts**
- Componentes ResponsiveContainer para adaptabilidad
- Tooltips informativos con datos contextuales
- Animaciones suaves para mejor experiencia de usuario

### **Estado y Filtros**
- useState para manejo de filtros activos
- Funciones de filtrado dinámico
- Cálculos en tiempo real de estadísticas

## 📈 Insights y Recomendaciones Automáticas

### **Hallazgos Principales**
- ✅ Identificación automática de mejores performers
- ⚠️ Alertas sobre baja participación
- ❌ Señalización de gerentes que requieren seguimiento

### **Recomendaciones Estratégicas**
- 📋 Plan de incentivos para mejora de participación
- 📊 Establecimiento de metas mínimas de cobertura
- 🎯 Programas de capacitación específicos
- 📈 Sistemas de seguimiento mensual

## 🚀 Integración en la Aplicación

### **Navegación**
- Accesible desde el menú lateral: "👨‍💼 Participación de Gerentes"
- Destacado como funcionalidad nueva en la página de inicio

### **Ubicación en el Sistema**
```
src/components/ManagerParticipationReport.tsx
```

### **Importación en App.tsx**
```typescript
import ManagerParticipationReport from './components/ManagerParticipationReport';
```

## 🎯 Objetivos del Componente

1. **Transparencia**: Visibilidad clara del desempeño de cada gerente
2. **Accountability**: Responsabilidad medible en la recolección de encuestas
3. **Mejora Continua**: Identificación de oportunidades de mejora
4. **Toma de Decisiones**: Datos para decisiones estratégicas informadas

## 📱 Experiencia de Usuario

### **Navegación Intuitiva**
- Filtros claramente etiquetados
- Contadores en tiempo real
- Transiciones suaves entre vistas

### **Información Contextual**
- Tooltips explicativos
- Códigos de color consistentes
- Texto descriptivo para cada sección

### **Accesibilidad**
- Contraste adecuado para legibilidad
- Textos descriptivos para lectores de pantalla
- Navegación por teclado disponible

---

**Desarrollado para Coltefinanciera - Gerencia del Talento Humano y Servicio al Cliente**  
*Última actualización: Junio 6, 2025*
