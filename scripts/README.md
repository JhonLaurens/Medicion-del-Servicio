# Scripts Directory

Esta carpeta contiene todos los scripts organizados por categoría:

## 📁 Estructura de Carpetas

### `/debug`
Scripts para depuración y resolución de problemas:
- Scripts de debug para métricas, gráficas y KPIs
- Archivos de simulación y pruebas
- Scripts de resolución de problemas específicos
- Reportes de correcciones

### `/launch`
Scripts para iniciar y ejecutar la aplicación:
- Scripts de inicio (.bat, .ps1)
- Scripts de lanzamiento de servidor
- Scripts de prueba de servidor

### `/validation`
Scripts para validación y verificación:
- Scripts de validación de datos
- Scripts de verificación de funcionalidades
- Scripts de validación de correcciones
- Scripts de verificación de configuración

## 🚀 Uso

Para ejecutar cualquier script, navega a la subcarpeta correspondiente y ejecuta el archivo deseado.

Ejemplo:
```bash
# Para iniciar la aplicación
cd scripts/launch
./start.bat

# Para validar datos
cd scripts/validation
node validacion-final-dashboard.js

# Para debug
cd scripts/debug
node debug-metrics.js
```