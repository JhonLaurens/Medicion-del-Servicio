# 📊 Dashboard Coltefinanciera - Análisis de Satisfacción del Cliente

[![Deploy to GitHub Pages](https://github.com/JhonLaurens/Medicion-del-Servicio/actions/workflows/deploy.yml/badge.svg)](https://github.com/JhonLaurens/Medicion-del-Servicio/actions/workflows/deploy.yml)

## 🚀 Ver Dashboard en Vivo

**🌐 [Dashboard Coltefinanciera - GitHub Pages](https://jhonlaurens.github.io/Medicion-del-Servicio/)**

---

📋 **Descripción**

Dashboard ejecutivo de análisis de satisfacción del cliente para **Coltefinanciera**, desarrollado con **React 18**, **TypeScript**, **Tailwind CSS** y **Recharts**. Presenta análisis comparativo por segmentos (Personas vs Empresas) con visualizaciones profesionales y métricas KPI ejecutivas.

---

🚀 **Características**

- **Análisis Automatizado:** Procesamiento inteligente de datos de encuestas
- **Visualizaciones Interactivas:** Gráficos y dashboards dinámicos
- **Reportes Automáticos:** Generación de informes detallados
- **Interfaz Intuitiva:** Dashboard fácil de usar para análisis de datos

---

🛠️ **Tecnologías Utilizadas**

- **Frontend:** React.js + Vite
- **Backend:** Node.js (solo para desarrollo, no requiere backend propio en producción)
- **Visualización:** Recharts
- **Estilos:** CSS3 / Tailwind CSS

---

📦 **Instalación**

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

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
3. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```
4. **Acceder a la aplicación**
   - Abrir [http://localhost:5173](http://localhost:5173) en tu navegador

---

🔧 **Configuración**

| Variable     | Descripción             | Requerida |
| ------------ | ----------------------- | --------- |
| DATABASE_URL | URL de la base de datos | No        |
| PORT         | Puerto del servidor     | No        |

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

#### Errores Comunes

1. **Error al cargar datos**

   - Verifica que el archivo CSV tenga el formato correcto
   - Asegúrate de que todas las columnas requeridas estén presentes

2. **Error de conexión**
   - Verifica tu conexión a internet
   - Asegúrate de que el servidor local esté en ejecución

- **Problemas de Instalación**
  - `npm ERR! peer dep missing`
  - Solución: Ejecuta `npm install --legacy-peer-deps`

---

📱 **Capturas de Pantalla**

> Nota: Agregar capturas de pantalla del dashboard, análisis y reportes

---

🔮 **Roadmap**

- Integración con más APIs
- Análisis avanzado
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
- Email: jhonjara@coltefinanciera.com.co

---

🙏 **Agradecimientos**

- A todo el equipo de desarrollo
- A los contribuidores del proyecto
- La comunidad de desarrolladores por las librerías utilizadas

---

📞 **Soporte**

Para soporte técnico o consultas:

- Crear un Issue
- Contactar al desarrollador directamente

---

¿Te gusta este proyecto? ¡Dale una ⭐ en GitHub!
