@echo off
echo Iniciando servidor de desarrollo...
echo Directorio actual: %cd%
echo.
echo Verificando archivos principales...
if exist "package.json" (
    echo ✓ package.json encontrado
) else (
    echo ✗ package.json NO encontrado
    pause
    exit /b 1
)

if exist "vite.config.ts" (
    echo ✓ vite.config.ts encontrado
) else (
    echo ✗ vite.config.ts NO encontrado
    pause
    exit /b 1
)

if exist "src\App.tsx" (
    echo ✓ src\App.tsx encontrado
) else (
    echo ✗ src\App.tsx NO encontrado
    pause
    exit /b 1
)

echo.
echo Verificando dependencias...
npm list --depth=0 2>nul
if %errorlevel% neq 0 (
    echo Instalando dependencias...
    npm install
)

echo.
echo Iniciando servidor Vite...
echo URL esperada: http://localhost:3000/Medicion-del-Servicio/
echo.
npx vite --port 3000 --host 0.0.0.0 --open
pause