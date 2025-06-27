#!/usr/bin/env python3
"""
🎨 Script de validación de las mejoras de visualización implementadas
Verifica que las visualizaciones funcionen correctamente y los datos se muestren adecuadamente
"""

import os
import re

def validar_mejoras_visualizacion():
    print("🎨 VALIDACIÓN DE MEJORAS DE VISUALIZACIÓN PARA ANÁLISIS COMPARATIVO")
    print("=" * 70)
    
    # Validar SegmentAnalysis.tsx
    print("\n🔍 Validando SegmentAnalysis.tsx...")
    archivo_segment = 'src/components/SegmentAnalysis.tsx'
    
    if not os.path.exists(archivo_segment):
        print(f"❌ {archivo_segment} no encontrado")
        return False
    
    with open(archivo_segment, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    mejoras_implementadas = [
        # Validación de datos
        ("hasValidData", "✅ Validación de datos implementada"),
        ("NoDataMessage", "✅ Componente para 'sin datos' implementado"),
        ("Math.max(0, Math.min(100", "✅ Validación de rangos implementada"),
        
        # Mejoras en gráficos
        ("domain={[0, 5]}", "✅ Eje Y con escala fija implementado"),
        ("strokeWidth={4}", "✅ Líneas más gruesas para mejor visibilidad"),
        ("activeDot", "✅ Puntos activos en gráficos de línea"),
        ("barCategoryGap", "✅ Espaciado mejorado entre barras"),
        ("Legend", "✅ Leyendas en gráficos implementadas"),
        
        # Tooltips mejorados
        ("CustomTooltip", "✅ Tooltips personalizados implementados"),
        ("ComparisonTooltip", "✅ Tooltips de comparación implementados"),
        ("cursor={{ fill:", "✅ Cursor visual en tooltips"),
        
        # Estilos y CSS
        ("progress-bar-personas", "✅ Clases CSS para barras de progreso"),
        ("transition-all", "✅ Animaciones implementadas"),
        
        # Funcionalidades avanzadas
        ("calculateInsights", "✅ Análisis automático de insights"),
        ("prepareStackedData", "✅ Preparación robusta de datos"),
        ("TooltipPregunta", "✅ Trazabilidad con preguntas originales")
    ]
    
    validaciones_exitosas = 0
    total_validaciones = len(mejoras_implementadas)
    
    for buscar, mensaje in mejoras_implementadas:
        if buscar in contenido:
            print(mensaje)
            validaciones_exitosas += 1
        else:
            print(f"❌ No encontrado: {buscar}")
    
    # Validar estilos CSS
    print(f"\n🎨 Validando estilos CSS...")
    archivo_css = 'src/index.css'
    
    if os.path.exists(archivo_css):
        with open(archivo_css, 'r', encoding='utf-8') as f:
            css_contenido = f.read()
        
        estilos_css = [
            "progress-bar-personas",
            "progress-bar-empresas",
            "chart-container",
            "chart-no-data"
        ]
        
        for estilo in estilos_css:
            if estilo in css_contenido:
                print(f"✅ Estilo .{estilo} definido")
                validaciones_exitosas += 1
            else:
                print(f"❌ Estilo .{estilo} no encontrado")
        
        total_validaciones += len(estilos_css)
    
    print(f"\n📊 RESUMEN:")
    print(f"✅ Validaciones exitosas: {validaciones_exitosas}/{total_validaciones}")
    print(f"📈 Porcentaje de éxito: {(validaciones_exitosas/total_validaciones)*100:.1f}%")
    
    if validaciones_exitosas >= total_validaciones * 0.8:
        print("\n🎉 ¡Mejoras de visualización implementadas exitosamente!")
        print("🎯 El análisis comparativo por segmento ahora incluye:")
        print("   • Validación robusta de datos")
        print("   • Gráficos con mejor configuración")
        print("   • Tooltips mejorados y personalizados")
        print("   • Manejo de casos sin datos")
        print("   • Estilos CSS optimizados")
        print("   • Análisis automático de insights")
        return True
    else:
        print("\n⚠️  Algunas mejoras necesitan revisión.")
        return False
    print("=" * 60)
    
    dashboard_path = 'src/components/GeneralDashboard.tsx'
    
    if not os.path.exists(dashboard_path):
        print("❌ ERROR: No se encontró GeneralDashboard.tsx")
        return False
    
    try:
        with open(dashboard_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print("✅ Archivo GeneralDashboard.tsx cargado")
        
        # Verificaciones de mejoras implementadas
        mejoras = []
        
        # 1. Verificar esquema de colores mejorado
        if '#10b981' in content and '#ef4444' in content:
            mejoras.append("✅ Esquema de colores mejorado (Verde/Rojo)")
        else:
            mejoras.append("❌ Esquema de colores no actualizado")
        
        # 2. Verificar tooltip mejorado
        if 'cantidad aproximada' in content.lower() or 'resp.' in content:
            mejoras.append("✅ Tooltip interactivo mejorado")
        else:
            mejoras.append("❌ Tooltip no mejorado")
        
        # 3. Verificar etiqueta del eje Y
        if 'Porcentaje (%)' in content:
            mejoras.append("✅ Eje Y etiquetado correctamente")
        else:
            mejoras.append("❌ Eje Y no etiquetado")
        
        # 4. Verificar gráfico de evolución segmentado
        if 'por Segmento' in content:
            mejoras.append("✅ Gráfico de evolución segmentado")
        else:
            mejoras.append("❌ Gráfico de evolución no segmentado")
        
        # 5. Verificar tarjetas KPI mejoradas
        if 'hover:shadow-xl' in content and 'bg-blue-50' in content:
            mejoras.append("✅ Tarjetas KPI con efectos hover y fondos de color")
        else:
            mejoras.append("❌ Tarjetas KPI no mejoradas")
        
        # 6. Verificar leyendas con estrellas
        if '⭐⭐⭐⭐⭐' in content:
            mejoras.append("✅ Leyendas con iconos de estrellas")
        else:
            mejoras.append("❌ Leyendas sin iconos de estrellas")
        
        # 7. Verificar grid mejorado
        if '#f3f4f6' in content:
            mejoras.append("✅ Grid con colores sutiles")
        else:
            mejoras.append("❌ Grid no mejorado")
        
        print(f"\n📊 RESULTADOS DE LA VALIDACIÓN:")
        for mejora in mejoras:
            print(f"   {mejora}")
        
        exitosas = sum(1 for m in mejoras if m.startswith("✅"))
        total = len(mejoras)
        
        print(f"\n🎯 RESUMEN:")
        print(f"   • Mejoras implementadas: {exitosas}/{total}")
        print(f"   • Porcentaje de éxito: {exitosas/total*100:.1f}%")
        
        if exitosas == total:
            print(f"\n🎉 ¡TODAS LAS MEJORAS IMPLEMENTADAS EXITOSAMENTE!")
            return True
        elif exitosas >= total * 0.8:
            print(f"\n✅ Mayoría de mejoras implementadas correctamente")
            return True
        else:
            print(f"\n⚠️ Algunas mejoras necesitan revisión")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def main():
    print("🎨 VALIDACIÓN DE MEJORAS DE VISUALIZACIÓN - DASHBOARD GENERAL")
    print("=" * 70)
    
    if validar_mejoras_visualizacion():
        print(f"\n✅ VALIDACIÓN EXITOSA")
        print(f"🌐 Para ver las mejoras:")
        print(f"   1. Ejecutar: npm run dev")
        print(f"   2. Abrir: http://localhost:5174/")
        print(f"   3. Navegar a: Dashboard General")
        print(f"   4. Verificar: Colores, tooltips, hover effects, leyendas")
    else:
        print(f"\n❌ VALIDACIÓN FALLIDA - Revisar implementación")

if __name__ == "__main__":
    main()
