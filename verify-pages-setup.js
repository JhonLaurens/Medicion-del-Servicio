#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para GitHub Pages...\n');

// Verificar archivos requeridos
const requiredFiles = [
  '.github/workflows/deploy.yml',
  'public/.nojekyll',
  'public/404.html',
  'public/CNAME',
  'vite.config.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} - Existe`);
  } else {
    console.log(`❌ ${file} - No encontrado`);
    allFilesExist = false;
  }
});

// Verificar package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('\n📦 Verificando package.json:');
  
  // Verificar scripts
  const requiredScripts = ['build', 'build:pages', 'deploy'];
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ Script "${script}" - Configurado`);
    } else {
      console.log(`❌ Script "${script}" - No encontrado`);
      allFilesExist = false;
    }
  });
  
  // Verificar dependencias
  if (pkg.devDependencies && pkg.devDependencies['gh-pages']) {
    console.log(`✅ Dependencia "gh-pages" - Instalada`);
  } else {
    console.log(`❌ Dependencia "gh-pages" - No instalada`);
    allFilesExist = false;
  }
}

// Verificar vite.config.ts
const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  console.log('\n⚙️ Verificando vite.config.ts:');
  
  if (viteConfig.includes('base:')) {
    console.log('✅ Base path configurado');
  } else {
    console.log('❌ Base path no configurado');
    allFilesExist = false;
  }
  
  if (viteConfig.includes('build:')) {
    console.log('✅ Configuración de build presente');
  } else {
    console.log('⚠️  Configuración de build básica');
  }
}

// Verificar workflow
const workflowPath = path.join(process.cwd(), '.github/workflows/deploy.yml');
if (fs.existsSync(workflowPath)) {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  console.log('\n🔄 Verificando GitHub Actions workflow:');
  
  if (workflow.includes('actions/deploy-pages@v4')) {
    console.log('✅ Action de deployment configurada');
  } else {
    console.log('❌ Action de deployment no encontrada');
    allFilesExist = false;
  }
  
  if (workflow.includes('npm run build')) {
    console.log('✅ Build step configurado');
  } else {
    console.log('❌ Build step no configurado');
    allFilesExist = false;
  }
}

// Resumen final
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 ¡Configuración completa para GitHub Pages!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. git add .');
  console.log('2. git commit -m "feat: Configure GitHub Pages"');
  console.log('3. git push origin main');
  console.log('\n🌐 Tu app estará disponible en:');
  console.log('https://jhonlaurens.github.io/coltefinanciera-customer-satisfaction-analytics/');
} else {
  console.log('⚠️  Configuración incompleta. Revisa los elementos faltantes.');
  process.exit(1);
}
