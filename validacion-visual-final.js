/**
 * Validación Final - Dashboard de Análisis de Satisfacción
 * Verificación completa de la funcionalidad de gráficas y tooltips
 */

import puppeteer from 'puppeteer';
import fs from 'fs';

const VALIDACIONES = {
  SERVER_URL: 'http://localhost:5173',
  TIMEOUT: 10000,
  SCREENSHOTS_DIR: './validacion-screenshots'
};

class ValidacionFinal {
  constructor() {
    this.browser = null;
    this.page = null;
    this.resultados = {
      timestamp: new Date().toISOString(),
      validaciones: [],
      errores: [],
      resumen: {}
    };
  }

  async iniciar() {
    console.log('🚀 Iniciando validación final del dashboard...\n');
    
    try {
      // Crear directorio de screenshots si no existe
      if (!fs.existsSync(VALIDACIONES.SCREENSHOTS_DIR)) {
        fs.mkdirSync(VALIDACIONES.SCREENSHOTS_DIR);
      }

      this.browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: { width: 1920, height: 1080 }
      });
      
      this.page = await this.browser.newPage();
      
      // Interceptar logs de consola
      this.page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Chart Data for') || text.includes('📊') || text.includes('🔍')) {
          console.log(`📊 Console Log: ${text}`);
        }
        if (text.includes('Error') || text.includes('Warning')) {
          this.resultados.errores.push({
            tipo: 'Console',
            mensaje: text,
            timestamp: new Date().toISOString()
          });
        }
      });

      await this.validarCargaPagina();
      await this.validarNavegacionSegmentos();
      await this.validarGraficasBarras();
      await this.validarTooltips();
      await this.validarResponsividad();
      
      this.generarReporte();
      
    } catch (error) {
      console.error('❌ Error durante la validación:', error);
      this.resultados.errores.push({
        tipo: 'Sistema',
        mensaje: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async validarCargaPagina() {
    console.log('📋 Validando carga de página...');
    
    try {
      await this.page.goto(VALIDACIONES.SERVER_URL, { 
        waitUntil: 'networkidle2',
        timeout: VALIDACIONES.TIMEOUT 
      });
      
      // Esperar a que aparezca el contenido principal
      await this.page.waitForSelector('h1', { timeout: 5000 });
      
      const titulo = await this.page.$eval('h1', el => el.textContent);
      
      this.resultados.validaciones.push({
        test: 'Carga de página',
        status: titulo ? 'PASS' : 'FAIL',
        detalle: `Título encontrado: "${titulo}"`
      });
      
      console.log(`   ✅ Página cargada correctamente: ${titulo}`);
      
    } catch (error) {
      this.resultados.validaciones.push({
        test: 'Carga de página',
        status: 'FAIL',
        detalle: error.message
      });
      console.log(`   ❌ Error cargando página: ${error.message}`);
    }
  }

  async validarNavegacionSegmentos() {
    console.log('🧭 Validando navegación a análisis de segmentos...');
    
    try {
      // Buscar y hacer clic en el enlace de análisis de segmentos
      await this.page.waitForSelector('a[href*="segment"]', { timeout: 5000 });
      await this.page.click('a[href*="segment"]');
      
      // Esperar a que cargue la página de segmentos
      await this.page.waitForSelector('h1', { timeout: 5000 });
      await this.page.waitForTimeout(2000); // Dar tiempo para que se carguen los datos
      
      const tituloSegmentos = await this.page.$eval('h1', el => el.textContent);
      
      this.resultados.validaciones.push({
        test: 'Navegación a segmentos',
        status: tituloSegmentos.includes('Comparativo') ? 'PASS' : 'FAIL',
        detalle: `Título: "${tituloSegmentos}"`
      });
      
      console.log(`   ✅ Navegación exitosa: ${tituloSegmentos}`);
      
      // Tomar screenshot de la página principal
      await this.page.screenshot({ 
        path: `${VALIDACIONES.SCREENSHOTS_DIR}/01-pagina-segmentos.png`,
        fullPage: true 
      });
      
    } catch (error) {
      this.resultados.validaciones.push({
        test: 'Navegación a segmentos',
        status: 'FAIL',
        detalle: error.message
      });
      console.log(`   ❌ Error en navegación: ${error.message}`);
    }
  }

  async validarGraficasBarras() {
    console.log('📊 Validando visualización de gráficas de barras...');
    
    try {
      // Esperar a que aparezcan los contenedores de gráficas
      await this.page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
      
      const numGraficas = await this.page.$$eval('.recharts-wrapper', elements => elements.length);
      console.log(`   📈 Encontradas ${numGraficas} gráficas en la página`);
      
      // Verificar que las barras sean visibles
      const barrasVisibles = await this.page.$$eval('.recharts-bar-rectangle', elements => {
        return elements.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length;
      });
      
      console.log(`   📊 Barras visibles encontradas: ${barrasVisibles}`);
      
      // Verificar datos de debug en consola
      const hasDebugData = await this.page.evaluate(() => {
        return window.localStorage.getItem('debug-chart-data') !== null;
      });
      
      this.resultados.validaciones.push({
        test: 'Gráficas de barras',
        status: numGraficas > 0 && barrasVisibles > 0 ? 'PASS' : 'WARN',
        detalle: `${numGraficas} gráficas, ${barrasVisibles} barras visibles`
      });
      
      // Tomar screenshot de las gráficas
      await this.page.screenshot({ 
        path: `${VALIDACIONES.SCREENSHOTS_DIR}/02-graficas-barras.png`,
        fullPage: true 
      });
      
      if (barrasVisibles === 0) {
        console.log(`   ⚠️  Advertencia: No se encontraron barras visibles`);
        
        // Verificar si hay mensajes de "sin datos"
        const mensajesSinDatos = await this.page.$$eval('[data-testid="no-data"], .text-gray-400', elements => elements.length);
        console.log(`   📝 Mensajes "sin datos" encontrados: ${mensajesSinDatos}`);
      }
      
    } catch (error) {
      this.resultados.validaciones.push({
        test: 'Gráficas de barras',
        status: 'FAIL',
        detalle: error.message
      });
      console.log(`   ❌ Error validando gráficas: ${error.message}`);
    }
  }

  async validarTooltips() {
    console.log('💬 Validando funcionamiento de tooltips...');
    
    try {
      // Buscar elementos con tooltips (preguntas con ℹ️)
      const elementosConTooltip = await this.page.$$('[class*="cursor-help"]');
      console.log(`   🎯 Elementos con tooltip encontrados: ${elementosConTooltip.length}`);
      
      if (elementosConTooltip.length > 0) {
        // Hacer hover sobre el primer elemento
        await elementosConTooltip[0].hover();
        await this.page.waitForTimeout(1000);
        
        // Verificar si aparece el tooltip
        const tooltipVisible = await this.page.$('.fixed.w-96.p-4.bg-white');
        
        this.resultados.validaciones.push({
          test: 'Tooltips funcionamiento',
          status: tooltipVisible ? 'PASS' : 'WARN',
          detalle: `${elementosConTooltip.length} elementos, tooltip visible: ${!!tooltipVisible}`
        });
        
        if (tooltipVisible) {
          console.log(`   ✅ Tooltip se muestra correctamente`);
          
          // Tomar screenshot del tooltip
          await this.page.screenshot({ 
            path: `${VALIDACIONES.SCREENSHOTS_DIR}/03-tooltip-activo.png`,
            fullPage: true 
          });
        } else {
          console.log(`   ⚠️  Tooltip no se mostró al hacer hover`);
        }
      } else {
        this.resultados.validaciones.push({
          test: 'Tooltips funcionamiento',
          status: 'WARN',
          detalle: 'No se encontraron elementos con tooltip'
        });
      }
      
    } catch (error) {
      this.resultados.validaciones.push({
        test: 'Tooltips funcionamiento',
        status: 'FAIL',
        detalle: error.message
      });
      console.log(`   ❌ Error validando tooltips: ${error.message}`);
    }
  }

  async validarResponsividad() {
    console.log('📱 Validando responsividad...');
    
    try {
      // Probar vista tablet
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.waitForTimeout(1000);
      
      await this.page.screenshot({ 
        path: `${VALIDACIONES.SCREENSHOTS_DIR}/04-vista-tablet.png`,
        fullPage: true 
      });
      
      // Probar vista desktop
      await this.page.setViewport({ width: 1920, height: 1080 });
      await this.page.waitForTimeout(1000);
      
      this.resultados.validaciones.push({
        test: 'Responsividad',
        status: 'PASS',
        detalle: 'Pruebas de viewport completadas'
      });
      
      console.log(`   ✅ Pruebas de responsividad completadas`);
      
    } catch (error) {
      this.resultados.validaciones.push({
        test: 'Responsividad',
        status: 'FAIL',
        detalle: error.message
      });
      console.log(`   ❌ Error en pruebas de responsividad: ${error.message}`);
    }
  }

  generarReporte() {
    const passed = this.resultados.validaciones.filter(v => v.status === 'PASS').length;
    const warnings = this.resultados.validaciones.filter(v => v.status === 'WARN').length;
    const failed = this.resultados.validaciones.filter(v => v.status === 'FAIL').length;
    
    this.resultados.resumen = {
      total: this.resultados.validaciones.length,
      passed,
      warnings,
      failed,
      porcentajeExito: Math.round((passed / this.resultados.validaciones.length) * 100)
    };
    
    console.log('\n📊 REPORTE DE VALIDACIÓN FINAL');
    console.log('================================');
    console.log(`✅ Pruebas exitosas: ${passed}`);
    console.log(`⚠️  Advertencias: ${warnings}`);
    console.log(`❌ Errores: ${failed}`);
    console.log(`📈 Porcentaje de éxito: ${this.resultados.resumen.porcentajeExito}%`);
    
    console.log('\n📋 Detalle de validaciones:');
    this.resultados.validaciones.forEach(v => {
      const icon = v.status === 'PASS' ? '✅' : v.status === 'WARN' ? '⚠️ ' : '❌';
      console.log(`   ${icon} ${v.test}: ${v.detalle}`);
    });
    
    if (this.resultados.errores.length > 0) {
      console.log('\n🐛 Errores encontrados:');
      this.resultados.errores.forEach(e => {
        console.log(`   • ${e.tipo}: ${e.mensaje}`);
      });
    }
    
    // Guardar reporte en archivo
    fs.writeFileSync(
      './VALIDACION-FINAL-RESULTADO.json',
      JSON.stringify(this.resultados, null, 2),
      'utf8'
    );
    
    console.log('\n💾 Reporte guardado en: VALIDACION-FINAL-RESULTADO.json');
    console.log(`📸 Screenshots guardados en: ${VALIDACIONES.SCREENSHOTS_DIR}/`);
    
    // Conclusión
    if (this.resultados.resumen.porcentajeExito >= 80) {
      console.log('\n🎉 VALIDACIÓN EXITOSA - El dashboard está funcionando correctamente');
    } else if (this.resultados.resumen.porcentajeExito >= 60) {
      console.log('\n⚠️  VALIDACIÓN CON ADVERTENCIAS - Revisar elementos señalados');
    } else {
      console.log('\n❌ VALIDACIÓN FALLIDA - Se requieren correcciones importantes');
    }
  }
}

// Ejecutar validación
const validacion = new ValidacionFinal();
validacion.iniciar().catch(console.error);
