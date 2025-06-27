# 📌 Validación de Consistencia: Fechas del Período de Campo
import pandas as pd
from datetime import datetime
import re

def validar_fechas_periodo_campo():
    """
    Valida la consistencia entre las fechas mostradas en la UI 
    y las fechas reales del dataset
    """
    print("📅 VALIDACIÓN DE FECHAS DEL PERÍODO DE CAMPO")
    print("=" * 60)
    
    # Fechas reportadas en la UI
    fecha_inicio_ui = "03 de enero de 2024"
    fecha_fin_ui = "17 de julio de 2024"
    
    print("📋 FECHAS REPORTADAS EN LA UI:")
    print(f"   • Fecha de inicio: {fecha_inicio_ui}")
    print(f"   • Fecha de fin: {fecha_fin_ui}")
    print()
    
    try:
        # Leer el archivo CSV
        print("📂 LEYENDO ARCHIVO DE DATOS...")
        df = pd.read_csv('public/datos.csv', delimiter=';', encoding='utf-8')
        print(f"   • Total de registros: {len(df):,}")
        print(f"   • Columnas encontradas: {list(df.columns)}")
        print()
        
        # Verificar que existe la columna DATE_MODIFIED
        if 'DATE_MODIFIED' not in df.columns:
            print("❌ ERROR: No se encontró la columna 'DATE_MODIFIED'")
            return
        
        # Convertir la columna DATE_MODIFIED a datetime
        print("🔄 PROCESANDO FECHAS...")
        
        # Mostrar algunos ejemplos de formato
        print("   📋 Ejemplos de fechas en el dataset:")
        for i in range(min(5, len(df))):
            print(f"      • {df['DATE_MODIFIED'].iloc[i]}")
        print()
        
        # Convertir a datetime
        df['DATE_MODIFIED'] = pd.to_datetime(df['DATE_MODIFIED'], format='%Y-%m-%d %H:%M:%S')
        
        # Obtener fechas mínima y máxima
        fecha_min = df['DATE_MODIFIED'].min()
        fecha_max = df['DATE_MODIFIED'].max()
        
        print("📊 ANÁLISIS DE FECHAS DEL DATASET:")
        print(f"   • Fecha más antigua: {fecha_min.strftime('%d de %B de %Y')} ({fecha_min.strftime('%Y-%m-%d %H:%M:%S')})")
        print(f"   • Fecha más reciente: {fecha_max.strftime('%d de %B de %Y')} ({fecha_max.strftime('%Y-%m-%d %H:%M:%S')})")
        print(f"   • Duración del período: {(fecha_max - fecha_min).days} días")
        print()
        
        # Convertir fechas de UI para comparación
        fecha_inicio_ui_dt = datetime(2024, 1, 3)
        fecha_fin_ui_dt = datetime(2024, 7, 17)
        
        print("⚖️  COMPARACIÓN CON FECHAS DE LA UI:")
        
        # Comparar fecha de inicio
        diferencia_inicio = abs((fecha_min.date() - fecha_inicio_ui_dt.date()).days)
        print(f"   • Fecha de inicio:")
        print(f"     - UI: {fecha_inicio_ui_dt.strftime('%d de %B de %Y')}")
        print(f"     - Dataset: {fecha_min.strftime('%d de %B de %Y')}")
        print(f"     - Diferencia: {diferencia_inicio} días")
        
        # Comparar fecha de fin
        diferencia_fin = abs((fecha_max.date() - fecha_fin_ui_dt.date()).days)
        print(f"   • Fecha de fin:")
        print(f"     - UI: {fecha_fin_ui_dt.strftime('%d de %B de %Y')}")
        print(f"     - Dataset: {fecha_max.strftime('%d de %B de %Y')}")
        print(f"     - Diferencia: {diferencia_fin} días")
        print()
        
        # Análisis de consistencia
        print("🎯 ANÁLISIS DE CONSISTENCIA:")
        
        if diferencia_inicio == 0 and diferencia_fin == 0:
            print("   ✅ PERFECTO: Las fechas de la UI coinciden exactamente con el dataset")
            status = "CORRECTO"
        elif diferencia_inicio <= 1 and diferencia_fin <= 1:
            print("   ✅ ACEPTABLE: Las fechas tienen diferencias mínimas (≤1 día)")
            status = "ACEPTABLE"
        elif diferencia_inicio <= 7 and diferencia_fin <= 7:
            print("   ⚠️  REVISAR: Las fechas tienen diferencias menores (≤7 días)")
            status = "REVISAR"
        else:
            print("   ❌ CRÍTICO: Las fechas tienen diferencias significativas (>7 días)")
            status = "CRÍTICO"
        
        print()
        
        # Distribución temporal
        print("📈 DISTRIBUCIÓN TEMPORAL DE RESPUESTAS:")
        df['fecha'] = df['DATE_MODIFIED'].dt.date
        distribucion = df.groupby('fecha').size().sort_index()
        
        print(f"   • Días con respuestas: {len(distribucion)}")
        print(f"   • Día con más respuestas: {distribucion.idxmax()} ({distribucion.max()} respuestas)")
        print(f"   • Día con menos respuestas: {distribucion.idxmin()} ({distribucion.min()} respuestas)")
        print(f"   • Promedio diario: {distribucion.mean():.1f} respuestas")
        print()
        
        # Mostrar primeros y últimos días
        print("📅 PRIMEROS 5 DÍAS CON RESPUESTAS:")
        for fecha, count in distribucion.head(5).items():
            print(f"   • {fecha.strftime('%d/%m/%Y')}: {count} respuestas")
        
        print("\n📅 ÚLTIMOS 5 DÍAS CON RESPUESTAS:")
        for fecha, count in distribucion.tail(5).items():
            print(f"   • {fecha.strftime('%d/%m/%Y')}: {count} respuestas")
        
        print()
        
        # Generar recomendaciones
        print("📝 RECOMENDACIONES:")
        if status == "CORRECTO":
            print("   ✅ No se requieren cambios en la ficha técnica")
        elif status in ["ACEPTABLE", "REVISAR"]:
            print("   📝 Considerar actualizar las fechas en la ficha técnica:")
            print(f"      - Fecha de inicio sugerida: {fecha_min.strftime('%d de %B de %Y')}")
            print(f"      - Fecha de fin sugerida: {fecha_max.strftime('%d de %B de %Y')}")
        else:
            print("   🚨 URGENTE: Actualizar las fechas en la ficha técnica:")
            print(f"      - Fecha de inicio correcta: {fecha_min.strftime('%d de %B de %Y')}")
            print(f"      - Fecha de fin correcta: {fecha_max.strftime('%d de %B de %Y')}")
        
        return {
            'status': status,
            'fecha_min_dataset': fecha_min,
            'fecha_max_dataset': fecha_max,
            'fecha_inicio_ui': fecha_inicio_ui_dt,
            'fecha_fin_ui': fecha_fin_ui_dt,
            'diferencia_inicio': diferencia_inicio,
            'diferencia_fin': diferencia_fin,
            'total_registros': len(df),
            'dias_con_respuestas': len(distribucion)
        }
        
    except Exception as e:
        print(f"❌ ERROR AL PROCESAR EL ARCHIVO: {str(e)}")
        return None

if __name__ == "__main__":
    resultado = validar_fechas_periodo_campo()
    
    print("\n" + "="*60)
    print("✅ VALIDACIÓN COMPLETADA")
    print("="*60)
