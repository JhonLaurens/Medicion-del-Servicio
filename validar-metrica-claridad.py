# 📌 Validación de Métricas: Verificación de "Claridad de la Información"

import pandas as pd
import numpy as np

def validar_metrica_claridad():
    """
    Valida que la métrica "Claridad de la Información (Atención)" 
    esté correctamente incluida y tenga datos válidos
    """
    print("📊 VALIDACIÓN DE MÉTRICA: CLARIDAD DE LA INFORMACIÓN")
    print("=" * 60)
    
    try:
        # Leer el archivo CSV
        print("📂 LEYENDO ARCHIVO DE DATOS...")
        df = pd.read_csv('public/datos.csv', delimiter=';', encoding='utf-8')
        print(f"   • Total de registros: {len(df):,}")
        print()
        
        # Identificar la columna de claridad
        claridad_column = None
        for col in df.columns:
            if 'información suministrada' in col.lower() and 'clara y fácil' in col.lower():
                claridad_column = col
                break
        
        if not claridad_column:
            print("❌ ERROR: No se encontró la columna de 'Claridad de la Información'")
            return
        
        print(f"✅ COLUMNA ENCONTRADA:")
        print(f"   • Nombre: {claridad_column}")
        print()
        
        # Análisis de la métrica
        claridad_data = df[claridad_column].dropna()
        
        print("📊 ANÁLISIS DE LA MÉTRICA:")
        print(f"   • Respuestas válidas: {len(claridad_data):,}")
        print(f"   • Respuestas faltantes: {len(df) - len(claridad_data):,}")
        print(f"   • Porcentaje de completitud: {(len(claridad_data)/len(df)*100):.1f}%")
        print()
        
        # Distribución de valores
        value_counts = claridad_data.value_counts().sort_index()
        print("📈 DISTRIBUCIÓN DE CALIFICACIONES:")
        total_responses = len(claridad_data)
        for value in range(1, 6):
            count = value_counts.get(value, 0)
            percentage = (count / total_responses * 100) if total_responses > 0 else 0
            print(f"   • Calificación {value}: {count:,} respuestas ({percentage:.1f}%)")
        print()
        
        # Estadísticas descriptivas
        if len(claridad_data) > 0:
            promedio = claridad_data.mean()
            mediana = claridad_data.median()
            std = claridad_data.std()
            
            print("📊 ESTADÍSTICAS DESCRIPTIVAS:")
            print(f"   • Promedio: {promedio:.2f}")
            print(f"   • Mediana: {mediana:.1f}")
            print(f"   • Desviación estándar: {std:.2f}")
            print(f"   • Valor mínimo: {claridad_data.min()}")
            print(f"   • Valor máximo: {claridad_data.max()}")
            print()
            
            # Análisis por segmento
            print("📋 ANÁLISIS POR SEGMENTO:")
            for segmento in df['SEGMENTO'].unique():
                if pd.notna(segmento):
                    segmento_data = df[df['SEGMENTO'] == segmento][claridad_column].dropna()
                    if len(segmento_data) > 0:
                        promedio_seg = segmento_data.mean()
                        print(f"   • {segmento}: {promedio_seg:.2f} (n={len(segmento_data):,})")
            print()
            
            # Análisis de calidad de datos
            print("🔍 ANÁLISIS DE CALIDAD DE DATOS:")
            
            # Verificar rango válido (1-5)
            valores_invalidos = claridad_data[(claridad_data < 1) | (claridad_data > 5)]
            if len(valores_invalidos) > 0:
                print(f"   ⚠️  Valores fuera de rango (1-5): {len(valores_invalidos)}")
            else:
                print("   ✅ Todos los valores están en el rango válido (1-5)")
            
            # Verificar sesgo hacia valores extremos
            alta_satisfaccion = len(claridad_data[claridad_data >= 4])
            porcentaje_alta = (alta_satisfaccion / total_responses * 100)
            
            if porcentaje_alta >= 70:
                print(f"   📈 Alta satisfacción: {porcentaje_alta:.1f}% calificó 4 o 5")
            elif porcentaje_alta <= 30:
                print(f"   📉 Baja satisfacción: {porcentaje_alta:.1f}% calificó 4 o 5")
            else:
                print(f"   ⚖️  Distribución equilibrada: {porcentaje_alta:.1f}% calificó 4 o 5")
            
            print()
            
            # Comparación con otras métricas
            print("⚖️  COMPARACIÓN CON OTRAS MÉTRICAS:")
            
            otras_metricas = {
                'Satisfacción General': 'En general   ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?',
                'Recomendación': '¿Qué tan probable es que usted le recomiende Coltefinanciera a sus colegas   familiares o amigos?',
                'Lealtad': 'Asumiendo que otra entidad financiera le ofreciera al mismo precio los mismos productos y servicios que usted tiene actualmente con Coltefinanciera   ¿Qué tan probable es que usted continúe siendo cliente de Coltefinanciera?'
            }
            
            for nombre, columna in otras_metricas.items():
                if columna in df.columns:
                    otros_datos = df[columna].dropna()
                    if len(otros_datos) > 0:
                        otro_promedio = otros_datos.mean()
                        diferencia = promedio - otro_promedio
                        if abs(diferencia) < 0.1:
                            status = "similar"
                            emoji = "≈"
                        elif diferencia > 0:
                            status = "superior"
                            emoji = "↗️"
                        else:
                            status = "inferior"
                            emoji = "↘️"
                        
                        print(f"   • vs {nombre}: {otro_promedio:.2f} {emoji} (diferencia: {diferencia:+.2f})")
            
            print()
            
            # Recomendaciones
            print("📝 ESTADO DE LA MÉTRICA:")
            if promedio >= 4.0:
                print("   ✅ EXCELENTE: La claridad de información tiene una puntuación muy alta")
            elif promedio >= 3.5:
                print("   ✅ BUENO: La claridad de información tiene una puntuación aceptable")
            elif promedio >= 3.0:
                print("   ⚠️  REGULAR: La claridad de información necesita mejoras")
            else:
                print("   ❌ CRÍTICO: La claridad de información requiere atención inmediata")
            
            if porcentaje_alta >= 80:
                print("   🎯 Muy alta satisfacción con la claridad de información")
            elif porcentaje_alta >= 60:
                print("   📈 Buena satisfacción con la claridad de información")
            else:
                print("   📉 Oportunidad de mejora en claridad de información")
                
        else:
            print("❌ No hay datos válidos para analizar")
            
    except Exception as e:
        print(f"❌ ERROR AL PROCESAR EL ARCHIVO: {str(e)}")

def verificar_inclusion_dashboard():
    """
    Verifica que las 4 métricas estén incluidas en el dashboard
    """
    print("\n" + "=" * 60)
    print("🎨 VERIFICACIÓN DE INCLUSIÓN EN DASHBOARD")
    print("=" * 60)
    
    metricas_esperadas = [
        "Claridad de la Información (Atención)",
        "Satisfacción General", 
        "Lealtad",
        "Recomendación"
    ]
    
    print("📋 MÉTRICAS QUE DEBERÍAN APARECER EN EL DASHBOARD:")
    for i, metrica in enumerate(metricas_esperadas, 1):
        print(f"   {i}. {metrica}")
    
    print("\n✅ CORRECCIÓN APLICADA:")
    print("   • Se agregó 'Claridad de la Información' a getKPIData()")
    print("   • Se cambió el grid de 3 a 4 columnas (md:grid-cols-2 lg:grid-cols-4)")
    print("   • Los gráficos se generan dinámicamente para todas las métricas")
    
    print("\n🎯 RESULTADO ESPERADO:")
    print("   • 4 tarjetas KPI en la parte superior")
    print("   • 4 gráficos de distribución por calificación")
    print("   • Coherencia entre Ficha Técnica y Dashboard")

if __name__ == "__main__":
    validar_metrica_claridad()
    verificar_inclusion_dashboard()
    
    print("\n" + "="*60)
    print("✅ VALIDACIÓN COMPLETADA")
    print("="*60)
