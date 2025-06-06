@echo off
echo "🚀 Iniciando servidor de desarrollo..."
cd /d "c:\Users\jhonjara\Downloads\coltefinanciera-customer-satisfaction-analytics"
echo "📂 Directorio actual: %CD%"
echo "📦 Instalando dependencias..."
call npm install
echo "🌐 Iniciando servidor..."
call npm run dev
pause
