# 🚨 Solución para Página en Blanco - Coltefinanciera Analytics

## El Problema: "No se ve nada"

Si estás viendo una página en blanco cuando abres la aplicación, es porque **el servidor de desarrollo no está ejecutándose**. Esta aplicación necesita un servidor local para funcionar correctamente.

## ✅ Soluciones Rápidas

### Opción 1: Uso de Archivos de Inicio (MÁS FÁCIL)

1. **Doble clic en `debug-start.bat`** 
   - Este archivo mostrará mensajes detallados
   - Te dirá exactamente qué está pasando
   - Si funciona, verás una URL como `http://localhost:5173`
   - Copia esa URL y pégala en tu navegador

2. **Alternativamente: `launch-app.bat`**
   - Versión más simple del iniciador
   - Iniciará automáticamente el navegador

### Opción 2: Terminal Manual

```bash
# 1. Abrir PowerShell en la carpeta del proyecto
# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir la URL que aparezca (usualmente http://localhost:5173)
```

### Opción 3: Puerto Alternativo

Si el puerto 5173 está ocupado:

```bash
npx vite --port 3000
```

O:

```bash
npm run dev -- --port 8080
```

## 🔧 Herramientas de Diagnóstico

He creado varias herramientas para ayudarte a diagnosticar el problema:

1. **`public/server-status.html`** - Verifica si hay servidores activos
2. **`public/diagnostic.html`** - Diagnóstico completo del sistema
3. **`public/test.html`** - Prueba de carga de datos CSV
4. **`verify-setup.ps1`** - Script de verificación de PowerShell

Puedes abrir cualquiera de estos archivos directamente en tu navegador.

## 🎯 Pasos de Resolución

### Paso 1: Verificar Archivos
- Asegúrate de que estás en la carpeta correcta del proyecto
- Verifica que existe `package.json`, `index.html`, y `App.tsx`

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Iniciar Servidor
```bash
npm run dev
```

### Paso 4: Abrir en Navegador
- Busca una línea como: `Local: http://localhost:5173`
- Copia esa URL exacta
- Pégala en tu navegador

## ❓ Solución de Problemas Comunes

### Error: "comando no encontrado"
- Instala Node.js desde: https://nodejs.org
- Reinicia tu terminal después de instalar

### Error: "puerto ocupado"
- Usa un puerto diferente: `npm run dev -- --port 3000`
- O mata procesos Node: `taskkill /f /im node.exe`

### Error: "permisos"
- Ejecuta PowerShell como administrador
- O usa: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### La aplicación se carga pero está en blanco
- Abre las herramientas de desarrollador (F12)
- Revisa la consola por errores JavaScript
- Asegúrate de que el archivo `public/datos.csv` existe

## 🚀 ¿Todo Funcionando?

Una vez que el servidor esté corriendo y veas la aplicación:

1. **Página de Inicio** - Información general
2. **Dashboard General** - KPIs y métricas principales  
3. **Análisis por Segmento** - Personas vs Empresarial
4. **Análisis Geográfico** - Distribución por ciudades
5. **Análisis de Sugerencias** - Feedback de clientes
6. **Explorador de Datos** - Vista detallada de datos
7. **Ficha Técnica** - Metodología del estudio

## 📞 Soporte

Si ninguna de estas soluciones funciona:

1. Abre `public/diagnostic.html` en tu navegador
2. Copia toda la información que aparezca
3. Incluye cualquier mensaje de error que veas en la terminal

---

**💡 Tip:** Mantén la terminal abierta mientras usas la aplicación. Si cierras la terminal, el servidor se detiene y volverás a ver una página en blanco.
