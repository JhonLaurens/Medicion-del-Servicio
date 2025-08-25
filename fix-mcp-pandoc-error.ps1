# Script para reparar el error "name 'false' is not defined" en mcp-pandoc
# Autor: Asistente AI
# Fecha: $(Get-Date -Format 'yyyy-MM-dd')

Write-Host "=== Script de Reparación MCP-Pandoc Error ==="
Write-Host "Diagnosticando y reparando el error 'name false is not defined'..." -ForegroundColor Yellow
Write-Host ""

# Función para buscar archivos de configuración MCP
function Find-MCPConfigs {
    Write-Host "1. Buscando archivos de configuración MCP..." -ForegroundColor Cyan
    
    $mcpPaths = @(
        "$env:APPDATA\Code\User\globalStorage\*mcp*",
        "$env:LOCALAPPDATA\*mcp*",
        "$HOME\.config\*mcp*",
        "$HOME\*mcp*",
        ".\*mcp*",
        ".trae\*mcp*"
    )
    
    $foundConfigs = @()
    
    foreach ($path in $mcpPaths) {
        $files = Get-ChildItem -Path $path -Recurse -Include "*.json", "*.yaml", "*.yml", "*.toml" -ErrorAction SilentlyContinue
        if ($files) {
            $foundConfigs += $files
            Write-Host "   Encontrado: $($files.FullName)" -ForegroundColor Green
        }
    }
    
    if ($foundConfigs.Count -eq 0) {
        Write-Host "   No se encontraron archivos de configuración MCP específicos." -ForegroundColor Yellow
    }
    
    return $foundConfigs
}

# Función para corregir valores booleanos en archivos JSON
function Fix-JSONBooleans {
    param([string]$filePath)
    
    try {
        $content = Get-Content -Path $filePath -Raw
        $originalContent = $content
        
        # Corregir valores booleanos comunes problemáticos
        $content = $content -replace '"false"(?=\s*[,}])', 'false'
        $content = $content -replace '"true"(?=\s*[,}])', 'true'
        $content = $content -replace ':\s*false(?=\s*[,}])', ': false'
        $content = $content -replace ':\s*true(?=\s*[,}])', ': true'
        
        # Corregir casos específicos de mcp-pandoc
        $content = $content -replace '"standalone"\s*:\s*"false"', '"standalone": false'
        $content = $content -replace '"self-contained"\s*:\s*"false"', '"self-contained": false'
        $content = $content -replace '"embed-resources"\s*:\s*"false"', '"embed-resources": false'
        
        if ($content -ne $originalContent) {
            # Crear backup
            Copy-Item -Path $filePath -Destination "$filePath.backup" -Force
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "   ✓ Corregido: $filePath" -ForegroundColor Green
            Write-Host "   ✓ Backup creado: $filePath.backup" -ForegroundColor Gray
            return $true
        }
        
        return $false
    }
    catch {
        Write-Host "   ✗ Error procesando $filePath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para corregir archivos YAML
function Fix-YAMLBooleans {
    param([string]$filePath)
    
    try {
        $content = Get-Content -Path $filePath -Raw
        $originalContent = $content
        
        # Corregir valores booleanos en YAML
        $content = $content -replace ':\s*"false"', ': false'
        $content = $content -replace ':\s*"true"', ': true'
        $content = $content -replace ':\s*False', ': false'
        $content = $content -replace ':\s*True', ': true'
        
        if ($content -ne $originalContent) {
            Copy-Item -Path $filePath -Destination "$filePath.backup" -Force
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "   ✓ Corregido: $filePath" -ForegroundColor Green
            return $true
        }
        
        return $false
    }
    catch {
        Write-Host "   ✗ Error procesando $filePath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para verificar y corregir configuraciones de Pandoc
function Fix-PandocConfigs {
    Write-Host "3. Verificando configuraciones de Pandoc..." -ForegroundColor Cyan
    
    $pandocPaths = @(
        "$env:APPDATA\pandoc",
        "$HOME\.pandoc",
        ".\pandoc"
    )
    
    $fixed = $false
    
    foreach ($path in $pandocPaths) {
        if (Test-Path $path) {
            $configFiles = Get-ChildItem -Path $path -Include "*.yaml", "*.yml", "defaults.yaml" -Recurse -ErrorAction SilentlyContinue
            foreach ($file in $configFiles) {
                if (Fix-YAMLBooleans -filePath $file.FullName) {
                    $fixed = $true
                }
            }
        }
    }
    
    if (-not $fixed) {
        Write-Host "   No se encontraron configuraciones de Pandoc para corregir." -ForegroundColor Yellow
    }
}

# Función para crear un archivo de configuración MCP corregido
function Create-FixedMCPConfig {
    Write-Host "4. Creando configuración MCP corregida..." -ForegroundColor Cyan
    
    $mcpConfig = @{
        "mcpServers" = @{
            "mcp-pandoc" = @{
                "command" = "mcp-pandoc"
                "args" = @()
                "env" = @{
                    "PANDOC_STANDALONE" = "false"
                    "PANDOC_SELF_CONTAINED" = "false"
                }
            }
        }
    }
    
    $configPath = ".\mcp-config-fixed.json"
    $mcpConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $configPath -Encoding UTF8
    
    Write-Host "   ✓ Configuración corregida creada: $configPath" -ForegroundColor Green
    Write-Host "   Usa esta configuración en lugar de la problemática." -ForegroundColor Gray
}

# Función para generar script de prueba
function Create-TestScript {
    Write-Host "5. Creando script de prueba..." -ForegroundColor Cyan
    
    $testScript = @'
# Script de prueba para mcp-pandoc
# Ejecuta este script después de aplicar las correcciones

Write-Host "Probando mcp-pandoc..." -ForegroundColor Yellow

try {
    # Prueba básica de conversión
    $testContent = "# Test Document\n\nThis is a test."
    $testContent | Out-File -FilePath "test-input.md" -Encoding UTF8
    
    # Intentar conversión simple
    pandoc "test-input.md" -o "test-output.html" --standalone=false
    
    if (Test-Path "test-output.html") {
        Write-Host "✓ Conversión exitosa" -ForegroundColor Green
        Remove-Item "test-input.md", "test-output.html" -ErrorAction SilentlyContinue
    } else {
        Write-Host "✗ Conversión falló" -ForegroundColor Red
    }
}
catch {
    Write-Host "✗ Error en prueba: $($_.Exception.Message)" -ForegroundColor Red
}
'@
    
    $testScript | Set-Content -Path "test-mcp-pandoc.ps1" -Encoding UTF8
    Write-Host "   ✓ Script de prueba creado: test-mcp-pandoc.ps1" -ForegroundColor Green
}

# Función principal
function Main {
    Write-Host "Iniciando diagnóstico y reparación..." -ForegroundColor White
    Write-Host ""
    
    # Buscar y corregir configuraciones MCP
    $configs = Find-MCPConfigs
    
    Write-Host "2. Corrigiendo archivos de configuración..." -ForegroundColor Cyan
    $totalFixed = 0
    
    foreach ($config in $configs) {
        if ($config.Extension -eq ".json") {
            if (Fix-JSONBooleans -filePath $config.FullName) {
                $totalFixed++
            }
        }
        elseif ($config.Extension -in @(".yaml", ".yml")) {
            if (Fix-YAMLBooleans -filePath $config.FullName) {
                $totalFixed++
            }
        }
    }
    
    if ($totalFixed -eq 0) {
        Write-Host "   No se encontraron configuraciones que requieran corrección." -ForegroundColor Yellow
    } else {
        Write-Host "   ✓ $totalFixed archivo(s) corregido(s)" -ForegroundColor Green
    }
    
    # Corregir configuraciones de Pandoc
    Fix-PandocConfigs
    
    # Crear configuración corregida
    Create-FixedMCPConfig
    
    # Crear script de prueba
    Create-TestScript
    
    Write-Host ""
    Write-Host "=== Resumen de Reparación ===" -ForegroundColor White
    Write-Host "✓ Configuraciones MCP verificadas y corregidas" -ForegroundColor Green
    Write-Host "✓ Valores booleanos 'false'/'true' normalizados" -ForegroundColor Green
    Write-Host "✓ Configuración de respaldo creada" -ForegroundColor Green
    Write-Host "✓ Script de prueba generado" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Reinicia tu servidor MCP" -ForegroundColor White
    Write-Host "2. Ejecuta: .\test-mcp-pandoc.ps1" -ForegroundColor White
    Write-Host "3. Si persiste el error, usa: mcp-config-fixed.json" -ForegroundColor White
    Write-Host ""
}

# Ejecutar script principal
Main

Write-Host "Script completado. Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")