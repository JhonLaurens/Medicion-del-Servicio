Write-Host "🚀 Verificación de la aplicación Coltefinanciera" -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del script
Set-Location $PSScriptRoot

# Verificar archivos principales
Write-Host "📁 Verificando archivos requeridos..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "index.html", 
    "index.tsx",
    "App.tsx",
    "vite.config.ts",
    "public\datos.csv"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - FALTANTE" -ForegroundColor Red
    }
}

# Verificar node_modules
Write-Host ""
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✅ node_modules existe" -ForegroundColor Green
    
    # Verificar dependencias críticas
    $criticalDeps = @("react", "react-dom", "vite", "@vitejs", "recharts", "papaparse")
    foreach ($dep in $criticalDeps) {
        if (Test-Path "node_modules\$dep") {
            Write-Host "  ✅ $dep" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $dep - FALTANTE" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ❌ node_modules no existe - ejecutar npm install" -ForegroundColor Red
}

# Verificar datos CSV
Write-Host ""
Write-Host "📊 Verificando datos..." -ForegroundColor Yellow
if (Test-Path "public\datos.csv") {
    $csvSize = (Get-Item "public\datos.csv").Length
    $csvSizeKB = [math]::Round($csvSize / 1024, 1)
    Write-Host "  ✅ datos.csv existe ($csvSizeKB KB)" -ForegroundColor Green
} else {
    Write-Host "  ❌ datos.csv no encontrado" -ForegroundColor Red
}

# Verificar puertos activos
Write-Host ""
Write-Host "🌐 Verificando puertos..." -ForegroundColor Yellow
$ports = @(5173, 3000, 4173, 8080)
$activeServers = @()

foreach ($port in $ports) {
    $connection = netstat -an | Select-String ":$port "
    if ($connection) {
        Write-Host "  ✅ Puerto $port está activo" -ForegroundColor Green
        $activeServers += $port
    } else {
        Write-Host "  ❌ Puerto $port no está activo" -ForegroundColor Gray
    }
}

# Sugerencias
Write-Host ""
Write-Host "🎯 Recomendaciones:" -ForegroundColor Cyan

if ($activeServers.Count -eq 0) {
    Write-Host "  📌 No hay servidores activos. Para iniciar:" -ForegroundColor Yellow
    Write-Host "     1. npm install (si es necesario)" -ForegroundColor White
    Write-Host "     2. npm run dev" -ForegroundColor White
    Write-Host "     3. Abrir la URL que aparezca en la terminal" -ForegroundColor White
    Write-Host ""
    Write-Host "  📌 O usar el archivo de inicio:" -ForegroundColor Yellow
    Write-Host "     - Doble clic en launch-app.bat" -ForegroundColor White
} else {
    Write-Host "  📌 Servidores activos encontrados en puerto(s): $($activeServers -join ', ')" -ForegroundColor Green
    foreach ($port in $activeServers) {
        Write-Host "     - http://localhost:$port" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "✅ Verificación completada" -ForegroundColor Green
Write-Host ""
Read-Host "Presiona Enter para continuar"
