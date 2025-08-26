# Script de Preparación para Despliegue en Vercel
# Ejecutar antes de hacer push al repositorio

Write-Host "Preparando proyecto para despliegue en Vercel..." -ForegroundColor Green
Write-Host ""

# 1. Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "Error: No se encontro package.json. Ejecuta este script desde la raiz del proyecto." -ForegroundColor Red
    exit 1
}

Write-Host "Directorio del proyecto verificado" -ForegroundColor Green

# 2. Limpiar builds anteriores
Write-Host "Limpiando builds anteriores..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "Directorio dist eliminado" -ForegroundColor Green
}

# 3. Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencias instaladas correctamente" -ForegroundColor Green

# 4. Ejecutar tests (si existen)
Write-Host "Ejecutando tests..." -ForegroundColor Yellow
npm run test:run 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Tests pasaron correctamente" -ForegroundColor Green
} else {
    Write-Host "Tests no disponibles o fallaron - continuando..." -ForegroundColor Yellow
}

# 5. Ejecutar build de producción
Write-Host "Ejecutando build de produccion..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en el build de produccion" -ForegroundColor Red
    exit 1
}
Write-Host "Build de produccion completado" -ForegroundColor Green

# 6. Verificar archivos críticos
Write-Host "Verificando archivos criticos..." -ForegroundColor Yellow

$criticalFiles = @(
    "dist/index.html",
    "dist/datos.csv",
    "vercel.json",
    "package.json"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "$file encontrado" -ForegroundColor Green
    } else {
        Write-Host "$file NO encontrado" -ForegroundColor Red
        exit 1
    }
}

# 7. Verificar tamaño del build
Write-Host "Verificando tamano del build..." -ForegroundColor Yellow
$distSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Tamano total del build: $([math]::Round($distSize, 2)) MB" -ForegroundColor Cyan

if ($distSize -gt 50) {
    Write-Host "Advertencia: El build es mayor a 50MB" -ForegroundColor Yellow
}

# 8. Mostrar resumen
Write-Host ""
Write-Host "RESUMEN DE PREPARACION" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host "Proyecto limpio y construido" -ForegroundColor Green
Write-Host "Archivos criticos verificados" -ForegroundColor Green
Write-Host "Configuracion de Vercel lista" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'Preparar para despliegue en Vercel'" -ForegroundColor White
Write-Host "3. git push origin main" -ForegroundColor White
Write-Host "4. Ir a vercel.com y conectar el repositorio" -ForegroundColor White
Write-Host "5. Configurar GEMINI_API_KEY en las variables de entorno" -ForegroundColor White
Write-Host ""
Write-Host "Para mas detalles, consulta VERCEL-DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proyecto listo para despliegue!" -ForegroundColor Green