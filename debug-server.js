const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estado del servidor...');

// Verificar archivos críticos
const criticalFiles = [
  'index.html',
  'package.json',
  'vite.config.ts',
  'src/main.tsx',
  'public/datos.csv'
];

console.log('\n📁 Verificando archivos críticos:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
  }
});

// Verificar si el puerto 5173 está en uso
console.log('\n🌐 Verificando servidor en puerto 5173...');

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`✅ Servidor respondiendo - Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('Analytics Platform')) {
      console.log('✅ Página principal cargada correctamente');
    } else if (data.includes('Error')) {
      console.log('⚠️ Página cargada pero con errores');
    } else {
      console.log('⚠️ Respuesta inesperada del servidor');
    }
    
    // Verificar datos CSV
    console.log('\n📊 Verificando acceso a datos CSV...');
    const csvReq = http.request({
      ...options,
      path: '/datos.csv'
    }, (csvRes) => {
      console.log(`📊 CSV Status: ${csvRes.statusCode}`);
      if (csvRes.statusCode === 200) {
        console.log('✅ Archivo CSV accesible');
      } else {
        console.log('❌ Archivo CSV no accesible');
      }
    });
    
    csvReq.on('error', (err) => {
      console.log('❌ Error accediendo al CSV:', err.message);
    });
    
    csvReq.end();
  });
});

req.on('error', (err) => {
  console.log('❌ Servidor no responde:', err.message);
  console.log('\n💡 Sugerencias:');
  console.log('   1. Ejecutar: npm run dev');
  console.log('   2. Verificar que el puerto 5173 esté libre');
  console.log('   3. Revisar la configuración de Vite');
});

req.on('timeout', () => {
  console.log('⏰ Timeout - El servidor no responde');
  req.destroy();
});

req.end();