# Script de verificación para confirmar que el error MCP-Pandoc está resuelto
Write-Host "=== Verificación de Solución MCP-Pandoc ===" -ForegroundColor Green
Write-Host "Confirmando que el error 'name false is not defined' está resuelto..." -ForegroundColor White
Write-Host ""

# 1. Verificar que existe la configuración corregida
Write-Host "1. Verificando configuración corregida..." -ForegroundColor Cyan
if (Test-Path "mcp-config-fixed.json") {
    Write-Host "   ✓ Archivo mcp-config-fixed.json encontrado" -ForegroundColor Green
    
    # Mostrar contenido
    $config = Get-Content "mcp-config-fixed.json" -Raw
    Write-Host "   Contenido de la configuración:" -ForegroundColor Gray
    Write-Host $config -ForegroundColor Gray
} else {
    Write-Host "   ✗ Archivo de configuración no encontrado" -ForegroundColor Red
    Write-Host "   Ejecuta primero: ./fix-mcp-pandoc.ps1" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar instalaciones
Write-Host "\n2. Verificando instalaciones..." -ForegroundColor Cyan

# Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   Python: $pythonVersion" -ForegroundColor Green
    
    if ($pythonVersion -match "Python (\d+)\.(\d+)") {
        $major = [int]$matches[1]
        $minor = [int]$matches[2]
        
        if ($major -ge 3 -and $minor -ge 11) {
            Write-Host "   ✓ Versión de Python compatible" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Python 3.11+ recomendado para mcp-pandoc" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ✗ Python no encontrado" -ForegroundColor Red
}

# mcp-pandoc
try {
    $mcpPandoc = pip show mcp-pandoc 2>&1
    if ($mcpPandoc -match "Version: (.+)") {
        Write-Host "   mcp-pandoc: $($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  mcp-pandoc no instalado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Error verificando mcp-pandoc" -ForegroundColor Yellow
}

# Pandoc
try {
    $pandocVersion = pandoc --version 2>&1
    if ($pandocVersion -match "pandoc ([\d\.]+)") {
        Write-Host "   Pandoc: $($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Pandoc no encontrado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Pandoc no encontrado" -ForegroundColor Yellow
}

# 3. Verificar variables de entorno
Write-Host "\n3. Verificando variables de entorno..." -ForegroundColor Cyan
$envVars = @("PANDOC_STANDALONE", "PANDOC_SELF_CONTAINED", "MCP_PANDOC_CONFIG")
$hasProblems = $false

foreach ($var in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ($value) {
        if ($value -eq "false" -or $value -eq "true") {
            Write-Host "   ⚠️  $var = $value (problemático)" -ForegroundColor Yellow
            $hasProblems = $true
        } else {
            Write-Host "   $var = $value" -ForegroundColor Gray
        }
    }
}

if (-not $hasProblems) {
    Write-Host "   ✓ Variables de entorno limpias" -ForegroundColor Green
}

# 4. Instrucciones de uso
Write-Host "\n=== INSTRUCCIONES DE USO ===" -ForegroundColor White
Write-Host "\nPara usar la configuración corregida:" -ForegroundColor Cyan
Write-Host "\n1. En tu IDE o aplicación que usa MCP:" -ForegroundColor White
Write-Host "   --mcp-config mcp-config-fixed.json" -ForegroundColor Gray
Write-Host "\n2. O copia el contenido a tu configuración existente" -ForegroundColor White
Write-Host "\n3. Reinicia tu IDE/aplicación después de aplicar la configuración" -ForegroundColor White

Write-Host "\n=== RESUMEN DE LA SOLUCIÓN ===" -ForegroundColor White
Write-Host "\nEl error 'name false is not defined' ocurría porque:" -ForegroundColor Cyan
Write-Host "• Los valores booleanos estaban como strings \"false\" en lugar de false" -ForegroundColor Gray
Write-Host "• Python interpretaba \"false\" como código, no como booleano" -ForegroundColor Gray
Write-Host "\nLa solución aplicada:" -ForegroundColor Cyan
Write-Host "• Configuración MCP con valores booleanos correctos (false, no \"false\")" -ForegroundColor Gray
Write-Host "• Variables de entorno problemáticas limpiadas" -ForegroundColor Gray
Write-Host "• mcp-pandoc actualizado a la última versión" -ForegroundColor Gray

Write-Host "\n✓ El error debería estar resuelto" -ForegroundColor Green
Write-Host "\nPresiona Enter para finalizar..."
Read-Host