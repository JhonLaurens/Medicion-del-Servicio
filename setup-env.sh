# Script para configurar variables de entorno en Vercel
# Este archivo no debe ser committeado

echo "Configurando variables de entorno en Vercel..."

# Configurar la API key de Gemini
vercel env add GEMINI_API_KEY AIzaSyBaC3H781g4sdSHzbMkwdl_3n6upPbojK0 production
vercel env add VITE_GEMINI_API_KEY AIzaSyBaC3H781g4sdSHzbMkwdl_3n6upPbojK0 production

echo "Variables de entorno configuradas exitosamente!"
