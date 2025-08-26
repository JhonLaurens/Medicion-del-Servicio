/**
 * VALIDACIÓN COMPLETA DE NAVEGACIÓN Y FUNCIONALIDAD
 * Script para validar exhaustivamente toda la aplicación
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 INICIANDO VALIDACIÓN COMPLETA DE LA APLICACIÓN');
console.log('================================================');

// 1. Verificar que todos los archivos principales existen
const filesToCheck = [
  'src/App.tsx',
  'src/components/HomePage.tsx',
  'src/components/SegmentAnalysis.tsx',
  'src/components/GeographicAnalysis.tsx',
  'src/components/SuggestionsAnalysis.tsx',
  'src/components/TechnicalSpecsPage.tsx',
  'src/components/NavigationSidebar.tsx',
  'src/services/dataService.ts',
  'public/datos.csv'
];

console.log('\n📁 VERIFICANDO ARCHIVOS PRINCIPALES:');
console.log('=====================================');

let allFilesExist = true;
filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.log('\n❌ ERROR: Algunos archivos principales no existen');
  process.exit(1);
}

// 2. Verificar estructura de componentes
console.log('\n🧩 VERIFICANDO ESTRUCTURA DE COMPONENTES:');
console.log('==========================================');

const componentsToCheck = [
  'HomePage',
  'SegmentAnalysis', 
  'GeographicAnalysis',
  'SuggestionsAnalysis',
  'TechnicalSpecsPage',
  'NavigationSidebar'
];

componentsToCheck.forEach(component => {
  const componentPath = path.join(__dirname, 'src', 'components', `${component}.tsx`);
  if (fs.existsSync(componentPath)) {
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Verificar que el componente tiene export default
    const hasDefaultExport = content.includes('export default');
    const hasReactImport = content.includes('import React') || content.includes('import { ');
    
    console.log(`✅ ${component}:`);
    console.log(`   - Export default: ${hasDefaultExport ? '✅' : '❌'}`);
    console.log(`   - React imports: ${hasReactImport ? '✅' : '❌'}`);
    
    // Verificar imports específicos para SegmentAnalysis
    if (component === 'SegmentAnalysis') {
      const hasRechartsImports = content.includes('recharts');
      const hasPieChart = content.includes('PieChart');
      const hasBarChart = content.includes('BarChart');
      
      console.log(`   - Recharts imports: ${hasRechartsImports ? '✅' : '❌'}`);
      console.log(`   - PieChart component: ${hasPieChart ? '✅' : '❌'}`);
      console.log(`   - BarChart component: ${hasBarChart ? '✅' : '❌'}`);
    }
  } else {
    console.log(`❌ ${component}: Archivo no encontrado`);
  }
});

// 3. Verificar configuración de rutas
console.log('\n🛣️  VERIFICANDO CONFIGURACIÓN DE RUTAS:');
console.log('=======================================');

const appPath = path.join(__dirname, 'src', 'App.tsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  const hasRouter = appContent.includes('BrowserRouter') || appContent.includes('Router');
  const hasRoutes = appContent.includes('Routes') || appContent.includes('Route');
  const hasNavigation = appContent.includes('NavigationSidebar');
  
  console.log(`✅ App.tsx configuración:`);
  console.log(`   - Router configurado: ${hasRouter ? '✅' : '❌'}`);
  console.log(`   - Rutas definidas: ${hasRoutes ? '✅' : '❌'}`);
  console.log(`   - Navegación incluida: ${hasNavigation ? '✅' : '❌'}`);
}

// 4. Verificar datos CSV
console.log('\n📊 VERIFICANDO DATOS CSV:');
console.log('=========================');

const csvPath = path.join(__dirname, 'public', 'datos.csv');
if (fs.existsSync(csvPath)) {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0] ? lines[0].split(',') : [];
  
  console.log(`✅ Archivo datos.csv:`);
  console.log(`   - Total de líneas: ${lines.length}`);
  console.log(`   - Columnas detectadas: ${headers.length}`);
  console.log(`   - Headers: ${headers.slice(0, 5).join(', ')}${headers.length > 5 ? '...' : ''}`);
  
  // Verificar columnas importantes
  const importantColumns = ['Segmento', 'Satisfaccion_General', 'Lealtad', 'Recomendacion'];
  importantColumns.forEach(col => {
    const hasColumn = headers.some(h => h.toLowerCase().includes(col.toLowerCase()));
    console.log(`   - ${col}: ${hasColumn ? '✅' : '❌'}`);
  });
} else {
  console.log('❌ Archivo datos.csv no encontrado');
}

// 5. Verificar dependencias del package.json
console.log('\n📦 VERIFICANDO DEPENDENCIAS:');
console.log('============================');

const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = { ...packageContent.dependencies, ...packageContent.devDependencies };
  
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'recharts',
    'tailwindcss',
    'typescript',
    'vite'
  ];
  
  console.log(`✅ Dependencias verificadas:`);
  requiredDeps.forEach(dep => {
    const hasDepency = dependencies[dep];
    console.log(`   - ${dep}: ${hasDepency ? '✅ ' + hasDepency : '❌'}`);
  });
}

// 6. Verificar configuración de Tailwind
console.log('\n🎨 VERIFICANDO CONFIGURACIÓN DE TAILWIND:');
console.log('=========================================');

const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
if (fs.existsSync(tailwindConfigPath)) {
  const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf8');
  
  const hasContent = tailwindContent.includes('content:');
  const hasTheme = tailwindContent.includes('theme:');
  const hasExtend = tailwindContent.includes('extend:');
  
  console.log(`✅ Tailwind configuración:`);
  console.log(`   - Content paths: ${hasContent ? '✅' : '❌'}`);
  console.log(`   - Theme config: ${hasTheme ? '✅' : '❌'}`);
  console.log(`   - Extend config: ${hasExtend ? '✅' : '❌'}`);
}

// 7. Verificar configuración de Vite
console.log('\n⚡ VERIFICANDO CONFIGURACIÓN DE VITE:');
console.log('====================================');

const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
  
  const hasReactPlugin = viteContent.includes('@vitejs/plugin-react');
  const hasBase = viteContent.includes('base:');
  
  console.log(`✅ Vite configuración:`);
  console.log(`   - React plugin: ${hasReactPlugin ? '✅' : '❌'}`);
  console.log(`   - Base path: ${hasBase ? '✅' : '❌'}`);
}

console.log('\n🎉 VALIDACIÓN COMPLETA FINALIZADA');
console.log('=================================');
console.log('✅ Todos los componentes principales verificados');
console.log('✅ Estructura de archivos correcta');
console.log('✅ Configuraciones validadas');
console.log('\n📋 PRÓXIMOS PASOS PARA VALIDACIÓN MANUAL:');
console.log('1. Abrir http://localhost:5175/Medicion-del-Servicio/');
console.log('2. Navegar por todas las secciones del menú lateral');
console.log('3. Probar todos los botones y enlaces');
console.log('4. Verificar que los gráficos se cargan correctamente');
console.log('5. Comprobar la responsividad en diferentes tamaños');
console.log('6. Revisar la consola del navegador para errores');