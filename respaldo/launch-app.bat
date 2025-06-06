@echo off
echo 🚀 Iniciando aplicación Coltefinanciera...
echo.

cd /d "%~dp0"

echo 📦 Verificando dependencias...
if not exist "node_modules" (
    echo ⚠️ Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🌐 Iniciando servidor de desarrollo...
echo 📍 La aplicación estará disponible en: http://localhost:5173
echo 🔄 Presiona Ctrl+C para detener el servidor
echo.

npm run dev

pause
