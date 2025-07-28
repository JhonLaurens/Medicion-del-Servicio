@echo off
echo 🚀 Iniciando servidor y abriendo página de prueba...
echo.

REM Matar procesos existentes
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo 📁 Verificando archivos:
if exist "index.html" (echo   ✅ index.html) else (echo   ❌ index.html)
if exist "public\datos.csv" (echo   ✅ datos.csv) else (echo   ❌ datos.csv)

echo.
echo 🌐 Iniciando servidor en segundo plano...
start /min cmd /c "npm run dev"

echo ⏳ Esperando que el servidor inicie...
timeout /t 5 /nobreak >nul

echo 🔍 Abriendo página de prueba...
start http://localhost:5173/test-server.html

echo.
echo 💡 Si la página de prueba funciona, intenta:
echo    http://localhost:5173
echo.
echo Presiona cualquier tecla para continuar...
pause >nul