@echo off
echo =====================================
echo COLTEFINANCIERA CUSTOMER SATISFACTION ANALYTICS
echo Iniciando aplicacion corregida...
echo =====================================
echo.

:: Verificar si Node.js esta instalado
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ ERROR: Node.js no esta instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

:: Verificar si npm esta disponible
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ ERROR: npm no esta disponible
    pause
    exit /b 1
)

echo ✅ Node.js y npm detectados correctamente
echo.

:: Instalar dependencias si es necesario
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo ❌ ERROR: Fallo la instalacion de dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas correctamente
) else (
    echo 📦 Dependencias ya instaladas
)

echo.
echo 🚀 Iniciando servidor de desarrollo...
echo.
echo La aplicacion se abrira automaticamente en tu navegador
echo Si no se abre, visita: http://localhost:5173
echo.
echo Para detener el servidor presiona Ctrl+C
echo.

:: Iniciar el servidor de desarrollo
call npm run dev

pause
