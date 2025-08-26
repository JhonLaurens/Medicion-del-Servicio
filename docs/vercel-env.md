# Configuración de Variables de Entorno para Vercel

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno en el dashboard de Vercel:

## Variables Requeridas:

### GEMINI_API_KEY
- **Descripción**: Clave API de Google Gemini para funcionalidades de IA
- **Valor**: Tu clave API de Gemini
- **Tipo**: Secret

### VERCEL
- **Descripción**: Variable para detectar el entorno de Vercel
- **Valor**: 1
- **Tipo**: Plain Text

## Pasos para configurar en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a Settings > Environment Variables
3. Agrega cada variable con su respectivo valor
4. Asegúrate de que estén disponibles para todos los entornos (Production, Preview, Development)

## Verificación:

Después de configurar las variables, realiza un nuevo deploy para que los cambios tomen efecto.

## Notas importantes:

- La variable VERCEL se usa para detectar automáticamente el entorno y configurar el base path correcto
- GEMINI_API_KEY es opcional si no usas las funcionalidades de IA
- Nunca commits archivos .env al repositorio por seguridad