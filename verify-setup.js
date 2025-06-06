#!/usr/bin/env node

console.log('🚀 Iniciando verificación de la aplicación Coltefinanciera...\n');

const fs = require('fs');
const path = require('path');

// Verificar archivos principales
const requiredFiles = [
    'package.json',
    'index.html',
    'index.tsx',
    'App.tsx',
    'vite.config.ts',
    'public/datos.csv'
];

console.log('📁 Verificando archivos requeridos...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - FALTANTE`);
    }
});

// Verificar node_modules
console.log('\n📦 Verificando dependencias...');
if (fs.existsSync('node_modules')) {
    console.log('  ✅ node_modules existe');
    
    // Verificar dependencias críticas
    const criticalDeps = [
        'react',
        'react-dom',
        'vite',
        '@vitejs/plugin-react',
        'recharts',
        'papaparse'
    ];
    
    criticalDeps.forEach(dep => {
        if (fs.existsSync(path.join('node_modules', dep))) {
            console.log(`  ✅ ${dep}`);
        } else {
            console.log(`  ❌ ${dep} - FALTANTE`);
        }
    });
} else {
    console.log('  ❌ node_modules no existe - ejecutar npm install');
}

// Verificar TypeScript
console.log('\n🔧 Verificando configuración...');
try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    console.log('  ✅ tsconfig.json válido');
} catch (error) {
    console.log('  ❌ tsconfig.json inválido:', error.message);
}

// Verificar package.json
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('  ✅ package.json válido');
    
    if (pkg.scripts && pkg.scripts.dev) {
        console.log('  ✅ Script "dev" encontrado:', pkg.scripts.dev);
    } else {
        console.log('  ❌ Script "dev" no encontrado');
    }
} catch (error) {
    console.log('  ❌ package.json inválido:', error.message);
}

console.log('\n📊 Verificando datos...');
if (fs.existsSync('public/datos.csv')) {
    const csvSize = fs.statSync('public/datos.csv').size;
    console.log(`  ✅ datos.csv existe (${(csvSize / 1024).toFixed(1)} KB)`);
} else {
    console.log('  ❌ datos.csv no encontrado');
}

console.log('\n🌐 Para iniciar el servidor:');
console.log('  1. npm install (si es necesario)');
console.log('  2. npm run dev');
console.log('  3. Abrir http://localhost:5173 en el navegador');

console.log('\n✅ Verificación completada');
