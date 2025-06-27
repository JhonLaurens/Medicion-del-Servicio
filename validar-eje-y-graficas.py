#!/usr/bin/env python3
"""
Script para validar que el eje Y de las gráficas de distribución no tenga desbordamientos
y que todos los valores estén en el rango correcto de 0-100%.
"""

import pandas as pd
import json
import sys

def validar_datos_porcentajes():
    """Valida que todos los porcentajes calculados estén en el rango 0-100%"""
    try:
        # Cargar datos
        print("📊 Cargando datos CSV...")
        df = pd.read_csv('public/datos.csv', sep=';')
        print(f"✅ Datos cargados: {len(df)} registros")
        
        # Métricas a validar con nombres reales de columnas del CSV
        metricas = [
            ('En general   ¿La información suministrada en nuestros canales de atención fue clara y fácil de comprender?', 'Claridad de la Información (Atención)'),
            ('En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?', 'Satisfacción General'),
            ('Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?', 'Lealtad'),
            ('¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?', 'Recomendación')
        ]
        
        problemas_encontrados = []
        
        for columna, nombre in metricas:
            if columna not in df.columns:
                problemas_encontrados.append(f"❌ Columna '{columna}' no encontrada")
                continue
                
            print(f"\n🔍 Validando {nombre}...")
            
            # Filtrar datos válidos (1-5)
            datos_validos = df[df[columna].between(1, 5, inclusive='both')]
            
            if len(datos_validos) == 0:
                problemas_encontrados.append(f"❌ {nombre}: No hay datos válidos")
                continue
                
            # Calcular distribución por segmento
            segmentos = [
                ('Consolidado', datos_validos),
                ('Personas', datos_validos[datos_validos['SEGMENTO'] == 'PERSONAS']),
                ('Empresas', datos_validos[datos_validos['SEGMENTO'] == 'EMPRESAS'])
            ]
            
            for seg_nombre, seg_data in segmentos:
                if len(seg_data) == 0:
                    continue
                    
                # Calcular porcentajes
                total = len(seg_data)
                rating5 = len(seg_data[seg_data[columna] == 5]) / total * 100
                rating4 = len(seg_data[seg_data[columna] == 4]) / total * 100
                rating123 = len(seg_data[seg_data[columna].isin([1, 2, 3])]) / total * 100
                
                # Validar rango
                porcentajes = [rating5, rating4, rating123]
                suma_total = sum(porcentajes)
                
                print(f"  📈 {seg_nombre}: 5={rating5:.1f}%, 4={rating4:.1f}%, 1-3={rating123:.1f}% (Total: {suma_total:.1f}%)")
                
                # Verificar que ningún porcentaje esté fuera del rango
                for i, pct in enumerate(porcentajes):
                    if pct < 0 or pct > 100:
                        problemas_encontrados.append(f"❌ {nombre} - {seg_nombre}: Porcentaje fuera de rango: {pct:.2f}%")
                
                # Verificar que la suma sea aproximadamente 100%
                if abs(suma_total - 100) > 0.1:
                    problemas_encontrados.append(f"⚠️ {nombre} - {seg_nombre}: Suma de porcentajes no es 100%: {suma_total:.2f}%")
        
        # Resumen
        print(f"\n{'='*60}")
        print("📋 RESUMEN DE VALIDACIÓN")
        print(f"{'='*60}")
        
        if problemas_encontrados:
            print(f"❌ Se encontraron {len(problemas_encontrados)} problemas:")
            for problema in problemas_encontrados:
                print(f"  {problema}")
            return False
        else:
            print("✅ Todos los porcentajes están en el rango válido 0-100%")
            print("✅ No se detectaron problemas de desbordamiento en el eje Y")
            return True
            
    except Exception as e:
        print(f"❌ Error durante la validación: {e}")
        return False

def validar_configuracion_graficas():
    """Valida la configuración del eje Y en el código del dashboard"""
    try:
        print(f"\n{'='*60}")
        print("🔧 VALIDANDO CONFIGURACIÓN DE GRÁFICAS")
        print(f"{'='*60}")
        
        # Leer el archivo del dashboard
        with open('src/components/GeneralDashboard.tsx', 'r', encoding='utf-8') as f:
            codigo = f.read()
        
        # Verificar configuraciones críticas
        configuraciones_esperadas = [
            ('domain={[0, 100]}', 'Dominio del eje Y configurado'),
            ('tickFormatter={(value) =>', 'Formato de porcentaje en ticks mejorado'),
            ('Porcentaje (%)', 'Etiqueta del eje Y'),
            ('colors.rating5', 'Uso de colores definidos'),
            ('colors.rating4', 'Uso de colores definidos'),
            ('colors.rating123', 'Uso de colores definidos'),
            ('allowDataOverflow={false}', 'Prevención de desbordamiento configurada'),
            ('ticks={[0, 20, 40, 60, 80, 100]}', 'Ticks específicos configurados')
        ]
        
        problemas_config = []
        
        for config, descripcion in configuraciones_esperadas:
            if config in codigo:
                print(f"✅ {descripcion}: Encontrado")
            else:
                problemas_config.append(f"❌ {descripcion}: No encontrado - '{config}'")
        
        # Verificar que no haya configuraciones problemáticas
        configuraciones_problematicas = [
            ('domain={[0, \'dataMax\']}', 'Dominio automático que puede causar desbordamiento'),
            ('domain={[\'dataMin\', \'dataMax\']}', 'Dominio automático que puede causar desbordamiento'),
            ('domain={[0, 120]}', 'Dominio mayor a 100%')
        ]
        
        for config, descripcion in configuraciones_problematicas:
            if config in codigo:
                problemas_config.append(f"⚠️ {descripcion}: Encontrado - '{config}'")
        
        if problemas_config:
            print(f"\n❌ Problemas de configuración encontrados:")
            for problema in problemas_config:
                print(f"  {problema}")
            return False
        else:
            print(f"\n✅ Configuración del eje Y es correcta")
            return True
            
    except Exception as e:
        print(f"❌ Error validando configuración: {e}")
        return False

def main():
    """Función principal"""
    print("🔍 VALIDACIÓN DE EJE Y EN GRÁFICAS DE DISTRIBUCIÓN")
    print("=" * 60)
    
    # Validar datos
    datos_ok = validar_datos_porcentajes()
    
    # Validar configuración
    config_ok = validar_configuracion_graficas()
    
    # Resultado final
    print(f"\n{'='*60}")
    print("🎯 RESULTADO FINAL")
    print(f"{'='*60}")
    
    if datos_ok and config_ok:
        print("✅ VALIDACIÓN EXITOSA: No hay problemas de desbordamiento en el eje Y")
        print("✅ Las gráficas de distribución están correctamente configuradas")
        return 0
    else:
        print("❌ VALIDACIÓN FALLIDA: Se encontraron problemas que requieren corrección")
        return 1

if __name__ == "__main__":
    exit(main())
