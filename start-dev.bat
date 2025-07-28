@echo off
echo Iniciando servidor de desarrollo...
cd /d "c:\repos\Medicion-del-Servicio"
echo Directorio actual: %CD%
echo.
echo Verificando archivos necesarios:
if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json FALTANTE)
if exist "index.html" (echo ✅ index.html) else (echo ❌ index.html FALTANTE)
if exist "vite.config.ts" (echo ✅ vite.config.ts) else (echo ❌ vite.config.ts FALTANTE)
if exist "src\main.tsx" (echo ✅ src\main.tsx) else (echo ❌ src\main.tsx FALTANTE)
echo.
echo Ejecutando npm run dev...
npm run dev
pause