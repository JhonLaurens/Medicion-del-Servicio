Write-Host "🚀 Iniciando aplicación Coltefinanciera..." -ForegroundColor Green
Write-Host ""

# Cambiar al directorio del script
Set-Location $PSScriptRoot

Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️ Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        exit 1
    }
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌐 Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "📍 La aplicación estará disponible en: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔄 Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Intentar abrir el navegador después de un momento
Start-Job -ScriptBlock {
    Start-Sleep 3
    Start-Process "http://localhost:5173"
} | Out-Null

npm run dev

Read-Host "Presiona Enter para continuar"
