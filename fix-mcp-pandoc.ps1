# Script simple para reparar MCP-Pandoc error
Write-Host "=== Reparador MCP-Pandoc ===" -ForegroundColor Green
Write-Host "Corrigiendo error 'name false is not defined'..." -ForegroundColor White
Write-Host ""

# 1. Limpiar variables de entorno problemáticas
Write-Host "1. Limpiando variables de entorno..." -ForegroundColor Cyan
$envVars = @("PANDOC_STANDALONE", "PANDOC_SELF_CONTAINED", "MCP_PANDOC_CONFIG")
$cleaned = 0

foreach ($var in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ($value -eq "false" -or $value -eq "true") {
        [Environment]::SetEnvironmentVariable($var, $null)
        Write-Host "   Limpiada: $var" -ForegroundColor Green
        $cleaned++
    }
}

if ($cleaned -eq 0) {
    Write-Host "   No hay variables problemáticas" -ForegroundColor Green
}

# 2. Crear configuración MCP corregida
Write-Host "\n2. Creando configuración MCP corregida..." -ForegroundColor Cyan

$config = @'
{
  "mcpServers": {
    "mcp-pandoc": {
      "command": "python",
      "args": ["-m", "mcp_pandoc"],
      "env": {
        "PANDOC_STANDALONE": false,
        "PANDOC_SELF_CONTAINED": false
      }
    }
  }
}
'@

$config | Out-File -FilePath "mcp-config-fixed.json" -Encoding UTF8
Write-Host "   Configuración creada: mcp-config-fixed.json" -ForegroundColor Green

# 3. Actualizar mcp-pandoc
Write-Host "\n3. Actualizando mcp-pandoc..." -ForegroundColor Cyan

try {
    $updateResult = pip install --upgrade mcp-pandoc 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   mcp-pandoc actualizado" -ForegroundColor Green
    } else {
        Write-Host "   Error actualizando: $updateResult" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "   No se pudo actualizar mcp-pandoc" -ForegroundColor Yellow
}

# 4. Probar Pandoc básico
Write-Host "\n4. Probando Pandoc..." -ForegroundColor Cyan

try {
    "# Test\n\nDocumento de prueba." | Out-File -FilePath "test.md" -Encoding UTF8
    $pandocResult = pandoc "test.md" -o "test.html" 2>&1
    
    if (Test-Path "test.html") {
        Write-Host "   Pandoc funciona correctamente" -ForegroundColor Green
        Remove-Item "test.md", "test.html" -ErrorAction SilentlyContinue
        $success = $true
    } else {
        Write-Host "   Error en Pandoc: $pandocResult" -ForegroundColor Red
        $success = $false
    }
}
catch {
    Write-Host "   Error probando Pandoc" -ForegroundColor Red
    $success = $false
}

# Resultado final
Write-Host "\n=== RESULTADO ===" -ForegroundColor White

if ($success) {
    Write-Host "ÉXITO: Error corregido" -ForegroundColor Green
    Write-Host "\nUsar configuración con:" -ForegroundColor Cyan
    Write-Host "--mcp-config mcp-config-fixed.json" -ForegroundColor Gray
} else {
    Write-Host "PARCIAL: Correcciones aplicadas" -ForegroundColor Yellow
    Write-Host "\nPasos adicionales:" -ForegroundColor Cyan
    Write-Host "1. Reiniciar terminal/IDE" -ForegroundColor Gray
    Write-Host "2. Verificar Python 3.11+" -ForegroundColor Gray
    Write-Host "3. Reinstalar: pip uninstall mcp-pandoc && pip install mcp-pandoc" -ForegroundColor Gray
}

Write-Host "\nReparación completada." -ForegroundColor Green
Write-Host "Presiona Enter para continuar..."
Read-Host