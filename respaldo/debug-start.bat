@echo off
cls
echo.
echo ========================================
echo    Iniciando Coltefinanciera App
echo ========================================
echo.

cd /d "%~dp0"

echo Directorio actual: %CD%
echo.

echo Verificando archivos principales...
if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json FALTANTE)
if exist "index.html" (echo ✅ index.html) else (echo ❌ index.html FALTANTE)
if exist "App.tsx" (echo ✅ App.tsx) else (echo ❌ App.tsx FALTANTE)
if exist "public\datos.csv" (echo ✅ datos.csv) else (echo ❌ datos.csv FALTANTE)
if exist "node_modules" (echo ✅ node_modules) else (echo ❌ node_modules FALTANTE)

echo.
echo Iniciando servidor de desarrollo...
echo.
echo ⚠️ Si ves errores, revisa los mensajes a continuación
echo ⚠️ Si funciona, veras "Local: http://localhost:XXXX"
echo ⚠️ Copia esa URL y pégala en tu navegador
echo.
echo ========================================
echo.

npm run dev

echo.
echo ========================================
echo.
echo Si llegaste aquí, el servidor se detuvo
echo Presiona cualquier tecla para cerrar...
pause > nul
