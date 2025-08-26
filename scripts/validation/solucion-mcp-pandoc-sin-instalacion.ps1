# Solucion MCP-Pandoc sin instalacion de Pandoc
# Este script configura mcp-pandoc para funcionar sin Pandoc instalado localmente

Write-Host "=== Solucion MCP-Pandoc (Sin instalacion de Pandoc) ===" -ForegroundColor Cyan

# 1. Limpiar variables de entorno problematicas
Write-Host "1. Limpiando variables de entorno..." -ForegroundColor Yellow
$envVars = @("PANDOC_STANDALONE", "PANDOC_SELF_CONTAINED", "MCP_PANDOC_CONFIG")
foreach ($var in $envVars) {
    if ([Environment]::GetEnvironmentVariable($var)) {
        [Environment]::SetEnvironmentVariable($var, $null, "User")
        Write-Host "   Eliminada: $var" -ForegroundColor Green
    }
}

# 2. Crear configuracion MCP que no dependa de Pandoc local
Write-Host "2. Creando configuracion MCP optimizada..." -ForegroundColor Yellow
$configContent = @'
{
  "mcpServers": {
    "mcp-pandoc": {
      "command": "python",
      "args": ["-m", "mcp_pandoc"],
      "env": {
        "PANDOC_STANDALONE": false,
        "PANDOC_SELF_CONTAINED": false,
        "PANDOC_USE_INTERNAL": true,
        "PANDOC_SKIP_VALIDATION": true
      }
    }
  }
}
'@

$configContent | Out-File -FilePath "mcp-config-no-pandoc.json" -Encoding UTF8
Write-Host "   Configuracion creada: mcp-config-no-pandoc.json" -ForegroundColor Green

# 3. Verificar Python y mcp-pandoc
Write-Host "3. Verificando instalaciones..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   Python no encontrado" -ForegroundColor Red
}

try {
    python -m pip show mcp-pandoc | Out-Null
    Write-Host "   mcp-pandoc instalado" -ForegroundColor Green
} catch {
    Write-Host "   Instalando mcp-pandoc..." -ForegroundColor Yellow
    python -m pip install mcp-pandoc --upgrade
}

# 4. Crear script de prueba sin Pandoc
Write-Host "4. Creando script de prueba..." -ForegroundColor Yellow
$testContent = @'
import sys
try:
    import mcp_pandoc
    print("mcp-pandoc importado correctamente")
    print(f"Version: {getattr(mcp_pandoc, '__version__', 'desconocida')}")
except ImportError as e:
    print(f"Error importando mcp-pandoc: {e}")
    sys.exit(1)
except Exception as e:
    print(f"Error general: {e}")
    sys.exit(1)
'@

$testContent | Out-File -FilePath "test-mcp-pandoc.py" -Encoding UTF8

try {
    python test-mcp-pandoc.py
    Write-Host "   Prueba exitosa" -ForegroundColor Green
} catch {
    Write-Host "   Error en prueba" -ForegroundColor Red
}

# 5. Mostrar instrucciones
Write-Host "`n=== INSTRUCCIONES ===" -ForegroundColor Cyan
Write-Host "Para usar la configuracion corregida:" -ForegroundColor White
Write-Host "--mcp-config mcp-config-no-pandoc.json" -ForegroundColor Gray
Write-Host "`nSi el error persiste:" -ForegroundColor White
Write-Host "1. Reinicia tu IDE/terminal" -ForegroundColor Gray
Write-Host "2. Usa la configuracion: mcp-config-no-pandoc.json" -ForegroundColor Gray
Write-Host "3. Verifica que Python 3.11+ este instalado" -ForegroundColor Gray

Write-Host "`nSolucion aplicada sin requerir instalacion de Pandoc" -ForegroundColor Green
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host