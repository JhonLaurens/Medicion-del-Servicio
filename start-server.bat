@echo off
echo 🚀 Iniciando servidor de desarrollo...
echo.

echo 📁 Verificando archivos críticos:
if exist "index.html" (echo   ✅ index.html) else (echo   ❌ index.html FALTANTE)
if exist "package.json" (echo   ✅ package.json) else (echo   ❌ package.json FALTANTE)
if exist "vite.config.ts" (echo   ✅ vite.config.ts) else (echo   ❌ vite.config.ts FALTANTE)
if exist "src\main.tsx" (echo   ✅ src\main.tsx) else (echo   ❌ src\main.tsx FALTANTE)
if exist "public\datos.csv" (echo   ✅ public\datos.csv) else (echo   ❌ public\datos.csv FALTANTE)

echo.
echo 🌐 Iniciando servidor Vite...
echo   URL: http://localhost:5173
echo   Presiona Ctrl+C para detener
echo.

npm run dev