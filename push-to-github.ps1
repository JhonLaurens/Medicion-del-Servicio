# Script de Push Rápido - PowerShell
# Autor: GitHub Copilot Assistant
# Descripción: Script para subir cambios rápidamente a GitHub

Write-Host "🚀 Subiendo cambios a GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Obtener la rama actual
$currentBranch = git branch --show-current
Write-Host "🌿 Rama actual: $currentBranch" -ForegroundColor Cyan

# Verificar estado de git
Write-Host "📊 Verificando estado de Git..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "📝 Cambios detectados:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    # Agregar todos los archivos
    Write-Host "📦 Agregando archivos al staging..." -ForegroundColor Yellow
    git add .
    
    # Pedir mensaje de commit o usar uno por defecto
    $commitMessage = Read-Host "💬 Mensaje del commit (Enter para usar mensaje automático)"
    if (-not $commitMessage) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $commitMessage = "feat: Update application - $timestamp"
    }
    
    # Hacer commit
    Write-Host "💾 Haciendo commit..." -ForegroundColor Yellow
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al hacer commit." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Commit realizado: '$commitMessage'" -ForegroundColor Green
} else {
    Write-Host "✅ No hay cambios pendientes." -ForegroundColor Green
}

# Push a GitHub
Write-Host "📤 Enviando cambios a GitHub..." -ForegroundColor Yellow
git push origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al enviar cambios. Intentando con --set-upstream..." -ForegroundColor Yellow
    git push --set-upstream origin $currentBranch
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al enviar cambios a GitHub." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 ¡Cambios subidos exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Información:" -ForegroundColor Cyan
Write-Host "   • Rama: $currentBranch" -ForegroundColor White
Write-Host "   • Repositorio: https://github.com/JhonLaurens/Medicion-del-Servicio" -ForegroundColor Blue
Write-Host ""

# Si es la rama v3, mostrar información específica
if ($currentBranch -eq "v3") {
    Write-Host "🔧 Esta es la rama v3 con configuración de GitHub Pages" -ForegroundColor Cyan
    Write-Host "   • Para activar GitHub Pages, ve a Settings > Pages en GitHub" -ForegroundColor White
    Write-Host "   • Selecciona 'GitHub Actions' como source" -ForegroundColor White
    Write-Host ""
}

Write-Host "🌐 Ver en GitHub:" -ForegroundColor Cyan
Write-Host "https://github.com/JhonLaurens/Medicion-del-Servicio/tree/$currentBranch" -ForegroundColor Blue

# Opcional: Abrir GitHub en el navegador
$openGitHub = Read-Host "🌐 ¿Abrir GitHub en el navegador? (y/N)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/JhonLaurens/Medicion-del-Servicio/tree/$currentBranch"
}

Write-Host ""
Write-Host "✨ ¡Push completado!" -ForegroundColor Green
