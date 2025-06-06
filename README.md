# Medición del Servicio - Coltefinanciera

[![Deploy to GitHub Pages](https://github.com/JhonLaurens/Medicion-del-Servicio/actions/workflows/deploy.yml/badge.svg)](https://github.com/JhonLaurens/Medicion-del-Servicio/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success?logo=github)](https://jhonlaurens.github.io/Medicion-del-Servicio/)

📋 **Descripción**

Sistema de análisis de encuestas desarrollado para Coltefinanciera que permite procesar, analizar y visualizar datos de satisfacción del cliente y medición de servicios. El proyecto utiliza inteligencia artificial para generar insights automáticos a partir de los datos recopilados.

---

🌐 **Acceso en Vivo**

- **GitHub Pages:** [https://jhonlaurens.github.io/Medicion-del-Servicio/](https://jhonlaurens.github.io/Medicion-del-Servicio/)
- **Dominio personalizado:** [https://medicion.coltefinanciera.com](https://medicion.coltefinanciera.com) *(requiere configuración DNS)*

---

🚀 **Características**

- **Análisis Automatizado:** Procesamiento inteligente de datos de encuestas
- **Visualizaciones Interactivas:** Gráficos y dashboards dinámicos
- **Reportes Automáticos:** Generación de informes con IA
- **Interfaz Intuitiva:** Dashboard fácil de usar para análisis de datos
- **Integración con IA:** (Opcional) Utiliza Google Gemini para análisis avanzado
- **Deployment Automático:** Configurado para GitHub Pages con GitHub Actions

---

🛠️ **Tecnologías Utilizadas**

- **Frontend:** React.js + Vite
- **Backend:** Node.js (solo para desarrollo, no requiere backend propio en producción)
- **IA:** (Opcional) Google Gemini API
- **Visualización:** Recharts
- **Estilos:** CSS3 / Tailwind CSS
- **Deployment:** GitHub Pages + GitHub Actions

---

📦 **Instalación**

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- (Opcional) Clave API de Google Gemini

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JhonLaurens/Medicion-del-Servicio.git
   cd Medicion-del-Servicio
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**
   - Crear un archivo `.env.local` en la raíz del proyecto:
     ```env
     GEMINI_API_KEY=tu_clave_api_de_gemini_aqui
     ```
4. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```
5. **Acceder a la aplicación**
   - Abrir [http://localhost:5173](http://localhost:5173) en tu navegador

---

🔧 **Configuración**

| Variable         | Descripción                        | Requerida |
|------------------|------------------------------------|-----------|
| GEMINI_API_KEY   | Clave API de Google Gemini         | Opcional  |
| DATABASE_URL     | URL de la base de datos            | No        |
| PORT             | Puerto del servidor                | No        |

**Obtener API Key de Gemini:**
- Visita [Google AI Studio](https://aistudio.google.com/app/apikey)
- Crea una nueva API key
- Copia la clave y agrégala a tu archivo `.env.local`

---

🚀 **Deployment a GitHub Pages**

Este proyecto está configurado para deployment automático a GitHub Pages usando GitHub Actions.

### Deployment Automático

1. **Hacer commit de los cambios:**
```bash
git add .
git commit -m "feat: Update application"
git push origin main
```

2. **GitHub Actions se ejecutará automáticamente y desplegará a:**
   - https://jhonlaurens.github.io/Medicion-del-Servicio/

### Scripts de Deployment Disponibles

```bash
# Build para GitHub Pages
npm run build:pages

# Deploy manual (alternativo)
npm run deploy
```

### Configuración de Dominio Personalizado

Para usar `medicion.coltefinanciera.com`:

1. **Configurar DNS:**
   ```
   CNAME: medicion.coltefinanciera.com → jhonlaurens.github.io
   ```

2. **Verificar en GitHub:**
   - Ve a Settings → Pages
   - Verifica que el dominio esté configurado correctamente

---

📊 **Uso**

### Cargar Datos de Encuestas
- Accede al dashboard principal
- Utiliza la sección "Cargar Datos" para subir archivos CSV
- El sistema procesará automáticamente los datos

### Generar Análisis
- Selecciona el conjunto de datos a analizar
- Configura los parámetros de análisis
- Haz clic en "Generar Informe"
- Revisa los insights generados por IA

### Exportar Resultados
- **PDF:** Informes ejecutivos completos
- **Excel:** Datos procesados y análisis
- **PNG/JPG:** Gráficos y visualizaciones

---

📈 **Funcionalidades Principales**

- Medición de NPS (Net Promoter Score)
- Análisis de sentimientos en comentarios
- Identificación de patrones de comportamiento
- Gráficos de barras y líneas interactivos
- Mapas de calor de satisfacción
- Dashboards personalizables
- Resúmenes ejecutivos automáticos
- Recomendaciones basadas en IA
- Tendencias y predicciones

---

🏗️ **Estructura del Proyecto**

```
Medicion-del-Servicio/
├── public/
│   ├── datos.csv
│   ├── diagnostic.html
│   └── ...
├── components/
│   ├── Dashboard.tsx
│   ├── DataExplorer.tsx
│   ├── ...
├── services/
│   └── dataService.ts
├── index.html
├── index.tsx
├── tailwind.config.js
├── package.json
└── README.md
```

---

🤝 **Contribución**

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

📋 **Scripts Disponibles**

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint

# Tests
npm test
```

---

🐛 **Solución de Problemas**

- **Error de API Key**
  - Error: `GEMINI_API_KEY not found`
  - Solución: Verifica que la variable GEMINI_API_KEY esté correctamente configurada en `.env.local`
- **Problemas de Instalación**
  - `npm ERR! peer dep missing`
  - Solución: Ejecuta `npm install --legacy-peer-deps`

---

📱 **Capturas de Pantalla**

> Nota: Agregar capturas de pantalla del dashboard, análisis y reportes

---

🔮 **Roadmap**

- Integración con más APIs de IA
- Análisis predictivo avanzado
- Dashboard móvil responsivo
- Integración con sistemas CRM
- Alertas automáticas por email

---

📄 **Licencia**

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

👨‍💻 **Autor**

- Jhon Laurens
- GitHub: [@JhonLaurens](https://github.com/JhonLaurens)
- LinkedIn: [Tu perfil de LinkedIn]
- Email: tu.email@ejemplo.com

---

🙏 **Agradecimientos**

- Coltefinanciera por confiar en este proyecto
- Google AI por la API de Gemini
- La comunidad de desarrolladores por las librerías utilizadas

---

📞 **Soporte**

Para soporte técnico o consultas:
- Crear un Issue
- Contactar al desarrollador directamente

---

¿Te gusta este proyecto? ¡Dale una ⭐ en GitHub!
