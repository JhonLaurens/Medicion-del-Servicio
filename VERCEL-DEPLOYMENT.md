# Guía de Despliegue en Vercel

## Preparación del Proyecto

### ✅ Verificaciones Completadas

1. **Estructura del Proyecto**: ✓ Verificada
2. **Proceso de Build**: ✓ Funcional (npm run build)
3. **Configuración de Vercel**: ✓ Configurada (vercel.json)
4. **Build de Producción**: ✓ Probado localmente

### 📋 Archivos de Configuración

- `vercel.json`: Configurado para SPA con rewrites
- `vite.config.ts`: Optimizado para producción con chunks manuales
- `.vercelignore`: Configurado para excluir archivos innecesarios
- `package.json`: Scripts de build configurados

## Variables de Entorno

### Requeridas en Vercel Dashboard:

```
GEMINI_API_KEY=your_actual_api_key_here
```

## Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Asegurarse de que todos los cambios estén guardados
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### 2. Configurar en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Conectar con GitHub
3. Importar el repositorio `Medicion-del-Servicio`
4. Configurar las variables de entorno:
   - `GEMINI_API_KEY`: Tu clave API de Gemini

### 3. Configuración de Build

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Configuración de Dominio

- Vercel asignará automáticamente un dominio `.vercel.app`
- Opcionalmente, puedes configurar un dominio personalizado

## Características del Proyecto

### 🚀 Optimizaciones Implementadas

- **Code Splitting**: Chunks manuales para vendor, charts, utils
- **Lazy Loading**: Componentes cargados bajo demanda
- **Cache Headers**: Configurados para assets estáticos
- **SPA Routing**: Rewrites configurados para React Router

### 📊 Funcionalidades

- Dashboard de análisis de satisfacción del cliente
- Visualizaciones interactivas con Recharts
- Análisis de métricas por segmento
- Reportes ejecutivos
- Análisis geográfico
- Filtros avanzados

### 🔧 Tecnologías

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Processing**: PapaParse
- **Icons**: Lucide React

## Verificación Post-Despliegue

### ✅ Checklist

- [ ] La aplicación carga correctamente
- [ ] Los datos CSV se cargan desde `/datos.csv`
- [ ] Las gráficas se renderizan correctamente
- [ ] Los filtros funcionan
- [ ] La navegación entre páginas funciona
- [ ] Las imágenes se cargan correctamente
- [ ] No hay errores en la consola del navegador

### 🐛 Solución de Problemas Comunes

1. **Error 404 en rutas**: Verificar que los rewrites estén configurados en `vercel.json`
2. **Archivos CSV no cargan**: Verificar que `datos.csv` esté en la carpeta `public`
3. **Variables de entorno**: Verificar que `GEMINI_API_KEY` esté configurada en Vercel
4. **Errores de build**: Verificar que `npm run build` funcione localmente

## Monitoreo

- **Analytics**: Disponible en el dashboard de Vercel
- **Logs**: Accesibles desde la pestaña "Functions" en Vercel
- **Performance**: Métricas de Core Web Vitals en Vercel

---

**Nota**: Este proyecto está optimizado para despliegue en Vercel con configuración automática de CI/CD desde GitHub.