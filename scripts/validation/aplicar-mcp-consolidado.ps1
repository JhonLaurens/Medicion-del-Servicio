# Script para aplicar configuracion MCP consolidada
Write-Host "=== CONSOLIDACION DE CONFIGURACIONES MCP ===" -ForegroundColor Cyan
Write-Host "Aplicando configuracion consolidada a Trae..." -ForegroundColor Yellow

$sourceConfig = "$PSScriptRoot\mcp-config-consolidado.json"
$traeDir = "C:\Users\jhonjara\AppData\Roaming\Trae"
$traeConfigPath = "$traeDir\mcp.json"

if (-not (Test-Path $sourceConfig)) {
    Write-Host "ERROR: No se encuentra el archivo de configuracion consolidada" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $traeDir)) {
    Write-Host "Creando directorio de Trae..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $traeDir -Force | Out-Null
}

if (Test-Path $traeConfigPath) {
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backupPath = "$traeDir\mcp-backup-$timestamp.json"
    Write-Host "Creando backup en: $backupPath" -ForegroundColor Yellow
    Copy-Item $traeConfigPath $backupPath
}

Write-Host "Aplicando nueva configuracion..." -ForegroundColor Yellow
Copy-Item $sourceConfig $traeConfigPath -Force

if (Test-Path $traeConfigPath) {
    Write-Host "Configuracion aplicada exitosamente" -ForegroundColor Green
    Write-Host "Configuraciones MCP consolidadas:" -ForegroundColor Cyan
    Write-Host "  - mcp-pandoc (optimizado sin Pandoc local)" -ForegroundColor Green
    Write-Host "  - MS365 Documents" -ForegroundColor Green
    Write-Host "  - PDF Reader" -ForegroundColor Green
    Write-Host "  - Google API" -ForegroundColor Green
    
    Write-Host "INSTRUCCIONES:" -ForegroundColor Yellow
    Write-Host "1. Reinicia Trae para aplicar los cambios" -ForegroundColor White
    Write-Host "2. Verifica que todos los MCP funcionen correctamente" -ForegroundColor White
    Write-Host "3. Si hay problemas, restaura desde el backup creado" -ForegroundColor White
    
    Write-Host "CONSOLIDACION COMPLETADA" -ForegroundColor Green
    Write-Host "Archivo aplicado en: $traeConfigPath" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se pudo aplicar la configuracion" -ForegroundColor Red
    exit 1
}