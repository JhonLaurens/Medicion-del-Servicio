# Deploy to GitHub Pages - PowerShell Script
# Autor: GitHub Copilot Assistant
# Descripción: Script para deployment rápido a GitHub Pages

Write-Host "🚀 Iniciando deployment a GitHub Pages..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar estado de git
Write-Host "📊 Verificando estado de Git..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Cambios detectados. Haciendo commit..." -ForegroundColor Yellow
    
    # Mostrar cambios
    Write-Host "📋 Archivos modificados:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    # Agregar todos los archivos
    git add .
    
    # Pedir mensaje de commit
    $commitMessage = Read-Host "💬 Ingresa el mensaje del commit (o presiona Enter para usar mensaje por defecto)"
    if (-not $commitMessage) {
        $commitMessage = "feat: Update application for GitHub Pages deployment"
    }
    
    # Hacer commit
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al hacer commit." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Commit realizado exitosamente." -ForegroundColor Green
} else {
    Write-Host "✅ No hay cambios pendientes." -ForegroundColor Green
}

# Verificar la rama actual
$currentBranch = git branch --show-current
Write-Host "🌿 Rama actual: $currentBranch" -ForegroundColor Cyan

# Push a GitHub
Write-Host "📤 Enviando cambios a GitHub..." -ForegroundColor Yellow
git push origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al enviar cambios a GitHub." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Cambios enviados exitosamente a GitHub." -ForegroundColor Green
Write-Host ""

# Información de deployment
Write-Host "🎉 ¡Deployment iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Información del deployment:" -ForegroundColor Cyan
Write-Host "   • GitHub Actions ejecutará el workflow automáticamente"
Write-Host "   • El proceso puede tomar 2-5 minutos"
Write-Host "   • Puedes monitorear el progreso en:"
Write-Host "     https://github.com/jhonlaurens/coltefinanciera-customer-satisfaction-analytics/actions" -ForegroundColor Blue
Write-Host ""
Write-Host "🌐 Una vez completado, tu aplicación estará disponible en:" -ForegroundColor Cyan
Write-Host "   https://jhonlaurens.github.io/coltefinanciera-customer-satisfaction-analytics/" -ForegroundColor Blue
Write-Host ""

# Opcional: Abrir el navegador
$openBrowser = Read-Host "🌐 ¿Quieres abrir GitHub Actions en el navegador? (y/N)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y" -or $openBrowser -eq "yes") {
    Start-Process "https://github.com/jhonlaurens/coltefinanciera-customer-satisfaction-analytics/actions"
}

Write-Host "✨ ¡Deployment completado!" -ForegroundColor Green
