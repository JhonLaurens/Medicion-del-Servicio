# Script para diagnosticar y ejecutar el servidor de desarrollo
Write-Host "=== DIAGNÓSTICO DEL SERVIDOR DE DESARROLLO ===" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location "c:\repos\Medicion-del-Servicio"
Write-Host "📁 Directorio actual: $(Get-Location)" -ForegroundColor Green

# Verificar archivos necesarios
Write-Host ""
Write-Host "🔍 Verificando archivos necesarios:" -ForegroundColor Yellow
$files = @("package.json", "index.html", "vite.config.ts", "src\main.tsx", "src\App.tsx")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file FALTANTE" -ForegroundColor Red
    }
}

# Verificar Node.js y npm
Write-Host ""
Write-Host "🔧 Verificando herramientas:" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js no encontrado" -ForegroundColor Red
}

try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm no encontrado" -ForegroundColor Red
}

# Verificar puerto 5173
Write-Host ""
Write-Host "🌐 Verificando puerto 5173:" -ForegroundColor Yellow
$portCheck = netstat -ano | Select-String ":5173"
if ($portCheck) {
    Write-Host "  ⚠️  Puerto 5173 en uso:" -ForegroundColor Yellow
    Write-Host "  $portCheck" -ForegroundColor Gray
} else {
    Write-Host "  ✅ Puerto 5173 disponible" -ForegroundColor Green
}

# Intentar ejecutar el servidor
Write-Host ""
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host "   Comando: npm run dev" -ForegroundColor Gray
Write-Host ""

# Ejecutar npm run dev
npm run dev