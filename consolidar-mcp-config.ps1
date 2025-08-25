# Script para consolidar todas las configuraciones MCP en el archivo principal de Trae
Write-Host "=== CONSOLIDACION DE CONFIGURACIONES MCP ===" -ForegroundColor Cyan
Write-Host "Consolidando todas las configuraciones MCP en Trae..." -ForegroundColor Yellow

# Ruta del archivo MCP principal de Trae
$traeConfigPath = "$env:APPDATA\Trae\mcp.json"
Write-Host "Ruta objetivo: $traeConfigPath" -ForegroundColor Gray

# Verificar si existe el directorio de Trae
$traeDir = Split-Path $traeConfigPath -Parent
if (-not (Test-Path $traeDir)) {
    Write-Host "Creando directorio de Trae: $traeDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $traeDir -Force | Out-Null
}

# Configuración consolidada con todos los MCP disponibles
$consolidatedConfig = @{
    mcpServers = @{
        "mcp-pandoc" = @{
            command = "python"
            args = @("-m", "mcp_pandoc")
            env = @{
                PANDOC_STANDALONE = $false
                PANDOC_SELF_CONTAINED = $false
                PANDOC_USE_INTERNAL = $true
                PANDOC_SKIP_VALIDATION = $true
            }
        }
        "mcp.config.usrlocalmcp.MS365 Documents" = @{
            command = "node"
            args = @("C:\Users\jhonjara\.config\usrlocalmcp\MS365 Documents\dist\index.js")
            env = @{}
        }
        "mcp.config.usrlocalmcp.PDF Reader" = @{
            command = "node"
            args = @("C:\Users\jhonjara\.config\usrlocalmcp\PDF Reader\dist\index.js")
            env = @{}
        }
        "mcp.config.usrlocalmcp.Google API" = @{
            command = "node"
            args = @("C:\Users\jhonjara\.config\usrlocalmcp\Google API\dist\index.js")
            env = @{}
        }
    }
}

# Leer configuración existente si existe
if (Test-Path $traeConfigPath) {
    Write-Host "Leyendo configuración existente..." -ForegroundColor Yellow
    $existingContent = Get-Content $traeConfigPath -Raw
    $existingConfig = $existingContent | ConvertFrom-Json
    
    Write-Host "Configuración actual encontrada:" -ForegroundColor Green
    if ($existingConfig.mcpServers) {
        foreach ($server in $existingConfig.mcpServers.PSObject.Properties) {
            Write-Host "  - $($server.Name)" -ForegroundColor Gray
        }
    }
    
    # Crear backup
    $backupPath = "$traeConfigPath.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $traeConfigPath $backupPath
    Write-Host "Backup creado: $backupPath" -ForegroundColor Green
}

# Escribir la configuración consolidada
Write-Host "Escribiendo configuración consolidada..." -ForegroundColor Cyan
$jsonContent = $consolidatedConfig | ConvertTo-Json -Depth 10
Set-Content -Path $traeConfigPath -Value $jsonContent -Encoding UTF8

Write-Host "✓ Configuración MCP consolidada exitosamente" -ForegroundColor Green
Write-Host "Archivo actualizado: $traeConfigPath" -ForegroundColor Gray

# Mostrar configuración final
Write-Host "\nConfiguraciones MCP consolidadas:" -ForegroundColor Cyan
foreach ($server in $consolidatedConfig.mcpServers.Keys) {
    Write-Host "  ✓ $server" -ForegroundColor Green
}

Write-Host "\n=== INSTRUCCIONES ===" -ForegroundColor Yellow
Write-Host "1. Reinicia Trae para aplicar los cambios" -ForegroundColor White
Write-Host "2. Verifica que todos los MCP funcionen correctamente" -ForegroundColor White
Write-Host "3. Si hay problemas, restaura desde el backup creado" -ForegroundColor White

Write-Host "\n=== CONSOLIDACION COMPLETADA ===" -ForegroundColor Green
Write-Host "Todas las configuraciones MCP han sido consolidadas en Trae" -ForegroundColor Green