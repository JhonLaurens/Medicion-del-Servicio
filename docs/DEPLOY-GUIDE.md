# Guía de Despliegue en Vercel

# ================================

## Proyecto: Medición del Servicio - Coltefinanciera

## API Key configurada: AIzaSyBaC3H781g4sdSHzbMkwdl_3n6upPbojK0

## 🚀 OPCIÓN 1: Despliegue Automático (Dashboard Vercel)

### Paso 1: Acceder a Vercel

1. Ve a: https://vercel.com
2. Inicia sesión con tu cuenta de GitHub

### Paso 2: Importar Proyecto

1. Clic en "New Project"
2. Busca el repositorio: "Medicion-del-Servicio"
3. Clic en "Import"

### Paso 3: Configurar Variables de Entorno

En la sección "Environment Variables" agrega:

- Name: GEMINI_API_KEY
- Value: AIzaSyBaC3H781g4sdSHzbMkwdl_3n6upPbojK0
- Environment: Production, Preview, Development

- Name: VITE_GEMINI_API_KEY
- Value: AIzaSyBaC3H781g4sdSHzbMkwdl_3n6upPbojK0
- Environment: Production, Preview, Development

### Paso 4: Configuración de Build

- Framework Preset: Vite
- Root Directory: ./
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install

### Paso 5: Desplegar

- Clic en "Deploy"
- Esperar a que termine el build (2-3 minutos)

## 🔧 OPCIÓN 2: Despliegue por CLI (Requiere autenticación)

### Prerrequisitos:

```bash
npm install -g vercel
vercel login
```

### Comando de despliegue:

```bash
cd c:\repos\Medicion-del-Servicio
vercel --prod
```

## ✅ Verificaciones Post-Despliegue

1. La URL será algo como: https://medicion-del-servicio-[hash].vercel.app
2. Verificar que los datos CSV se cargan correctamente
3. Comprobar que las gráficas se renderizan
4. Probar la funcionalidad de la API de Gemini (si está siendo usada)

## 📋 Archivos Configurados

- ✅ vercel.json - Configuración de Vercel
- ✅ vite.config.ts - Base path dinámico y variables de entorno
- ✅ .env - Variables locales (NO se suben a Git)
- ✅ .gitignore - Actualizado para ignorar archivos sensibles
- ✅ Build optimizado para producción

## 🌐 Estado del Proyecto

- ✅ Repositorio actualizado
- ✅ API Key configurada
- ✅ Build exitoso
- ✅ Listo para despliegue

Recomendación: Usar OPCIÓN 1 (Dashboard) para mayor simplicidad.
