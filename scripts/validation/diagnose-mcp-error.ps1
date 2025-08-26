# Script de Diagnóstico Simple para MCP-Pandoc Error
# Identifica la fuente del error "name 'false' is not defined"

Write-Host "=== Diagnóstico MCP-Pandoc Error ===" -ForegroundColor Yellow
Write-Host "Analizando el error 'name false is not defined'..." -ForegroundColor White
Write-Host ""

# 1. Verificar Python y mcp-pandoc
Write-Host "1. Verificando instalaciones..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Python no encontrado" -ForegroundColor Red
}

try {
    $mcpPandoc = pip show mcp-pandoc 2>&1
    if ($mcpPandoc -match "Version: (.+)") {
        Write-Host "   mcp-pandoc: $($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "   ✗ mcp-pandoc no instalado" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error verificando mcp-pandoc" -ForegroundColor Red
}

# 2. Buscar archivos problemáticos
Write-Host "\n2. Buscando archivos con valores booleanos problemáticos..." -ForegroundColor Cyan

$searchPaths = @(".", "$env:APPDATA\Code", "$env:LOCALAPPDATA")
$foundIssues = $false

foreach ($path in $searchPaths) {
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -Include "*.json", "*.yaml", "*.yml" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Length -lt 100KB }
        
        foreach ($file in $files) {
            try {
                $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
                
                if ($content -match '"false"\s*[,}\]]' -or $content -match '"true"\s*[,}\]]') {
                    Write-Host "   ⚠️  Encontrado: $($file.FullName)" -ForegroundColor Yellow
                    $foundIssues = $true
                }
            } catch {
                # Ignorar errores de lectura
            }
        }
    }
}

if (-not $foundIssues) {
    Write-Host "   ✓ No se encontraron patrones problemáticos" -ForegroundColor Green
}

# 3. Verificar variables de entorno
Write-Host "\n3. Verificando variables de entorno..." -ForegroundColor Cyan

$envVars = @("PANDOC_STANDALONE", "PANDOC_SELF_CONTAINED", "MCP_PANDOC_CONFIG")
$envIssues = $false

foreach ($var in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if ($value) {
        Write-Host "   $var = $value" -ForegroundColor Gray
        if ($value -eq "false" -or $value -eq "true") {
            Write-Host "   ⚠️  Posible problema con $var" -ForegroundColor Yellow
            $envIssues = $true
        }
    }
}

if (-not $envIssues) {
    Write-Host "   ✓ Variables de entorno OK" -ForegroundColor Green
}

# 4. Probar Pandoc básico
Write-Host "\n4. Probando Pandoc básico..." -ForegroundColor Cyan

try {
    $testContent = "# Test\n\nThis is a test."
    $testContent | Out-File -FilePath "test-pandoc.md" -Encoding UTF8
    
    $result = pandoc "test-pandoc.md" -o "test-pandoc.html" 2>&1
    
    if (Test-Path "test-pandoc.html") {
        Write-Host "   ✓ Pandoc funciona correctamente" -ForegroundColor Green
        Remove-Item "test-pandoc.md", "test-pandoc.html" -ErrorAction SilentlyContinue
    } else {
        Write-Host "   ✗ Pandoc falló: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error probando Pandoc: $($_.Exception.Message)" -ForegroundColor Red
}

# Reporte final
Write-Host "\n=== RECOMENDACIONES ===" -ForegroundColor White

if ($foundIssues) {
    Write-Host "1. Ejecutar script de reparación: .\fix-mcp-pandoc-error.ps1" -ForegroundColor Yellow
}

if ($envIssues) {
    Write-Host "2. Limpiar variables de entorno problemáticas" -ForegroundColor Yellow
}

Write-Host "3. Si el error persiste, actualizar mcp-pandoc:" -ForegroundColor Yellow
Write-Host "   pip install --upgrade mcp-pandoc" -ForegroundColor Gray

Write-Host "\nDiagnóstico completado." -ForegroundColor Green
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host