# Temporary Files Directory

Esta carpeta contiene archivos temporales y de desarrollo que no forman parte del código principal de la aplicación.

## 📁 Contenido

### Archivos de desarrollo temporal:
- `index.html`, `index.css`, `index.tsx` - Archivos de prueba temporal
- `TestComponent.tsx` - Componente de prueba
- `types.ts` - Definiciones de tipos temporales
- `metadata.json` - Metadatos temporales

## ⚠️ Importante

Los archivos en esta carpeta son:
- **Temporales**: Pueden ser eliminados sin afectar la funcionalidad principal
- **De desarrollo**: Usados para pruebas y experimentos
- **No críticos**: No forman parte del build de producción

## 🧹 Limpieza

Esta carpeta puede ser limpiada periódicamente para mantener el proyecto organizado.

```bash
# Para limpiar archivos temporales (opcional)
rm -rf temp/*
```