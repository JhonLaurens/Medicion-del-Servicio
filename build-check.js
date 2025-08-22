import { existsSync } from 'fs';

console.log('🚀 Building Medición del Servicio for Vercel...');

// Verificar que los archivos críticos existen
const criticalFiles = [
  'public/datos.csv',
  'public/ejecutivos para analizar.csv',
  'src/main.tsx',
  'index.html'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} is missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ All critical files are present');
  console.log('🏗️  Ready for Vite build...');
} else {
  console.error('❌ Some critical files are missing');
  process.exit(1);
}n/env node

console.log("🚀 Building Medición del Servicio for Vercel...");

// Verificar que los archivos críticos existen
const fs = require("fs");
const path = require("path");

const criticalFiles = [
  "public/datos.csv",
  "public/ejecutivos para analizar.csv",
  "src/main.tsx",
  "index.html",
];

let allFilesExist = true;

criticalFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} is missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log("✅ All critical files are present");
  console.log("🏗️  Starting Vite build...");
} else {
  console.error("❌ Some critical files are missing");
  process.exit(1);
}
