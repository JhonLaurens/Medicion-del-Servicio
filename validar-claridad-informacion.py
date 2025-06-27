#!/usr/bin/env python3
"""
Validación específica de la métrica "Claridad de la Información" en el dashboard
"""

import pandas as pd
import json

def validar_metrica_claridad():
    print("🔍 VALIDACIÓN ESPECÍFICA: CLARIDAD DE LA INFORMACIÓN")
    print("=" * 60)
    
    # Leer CSV
    try:
        df = pd.read_csv('public/datos.csv', sep=';', encoding='utf-8')
        print(f"✅ CSV cargado: {len(df)} registros")
    except Exception as e:
        print(f"❌ Error cargando CSV: {e}")
        return
    
    # Buscar columna de claridad
    claridad_col = None
    for col in df.columns:
        if 'información suministrada' in col:
            claridad_col = col
            break
    
    if not claridad_col:
        print("❌ No se encontró la columna de claridad")
        return
    
    print(f"✅ Columna encontrada: {claridad_col[:50]}...")
    
    # Analizar datos
    claridad_data = pd.to_numeric(df[claridad_col], errors='coerce')
    valid_data = claridad_data.dropna()
    
    print(f"\n📊 ANÁLISIS DE DATOS:")
    print(f"   • Total registros: {len(df)}")
    print(f"   • Valores válidos: {len(valid_data)} ({len(valid_data)/len(df)*100:.1f}%)")
    
    if len(valid_data) > 0:
        print(f"   • Promedio: {valid_data.mean():.2f}")
        print(f"   • Rango: {valid_data.min()} - {valid_data.max()}")
        
        # Distribución por calificación
        print(f"\n📈 DISTRIBUCIÓN:")
        for rating in sorted(valid_data.unique()):
            count = (valid_data == rating).sum()
            pct = count / len(valid_data) * 100
            print(f"   • Calificación {int(rating)}: {count} ({pct:.1f}%)")
        
        # Por segmento
        if 'SEGMENTO' in df.columns:
            print(f"\n🏢 POR SEGMENTO:")
            for segmento in df['SEGMENTO'].dropna().unique():
                seg_data = pd.to_numeric(df[df['SEGMENTO'] == segmento][claridad_col], errors='coerce').dropna()
                if len(seg_data) > 0:
                    print(f"   • {segmento}: {seg_data.mean():.2f} (n={len(seg_data)})")
        
        print(f"\n✅ RESULTADO: La métrica tiene datos válidos y debería aparecer en el dashboard")
        
        # Generar datos de ejemplo en formato KPI
        consolidado_avg = valid_data.mean()
        rating5_pct = (valid_data == 5).sum() / len(valid_data) * 100
        rating4_pct = (valid_data == 4).sum() / len(valid_data) * 100
        rating123_pct = (valid_data <= 3).sum() / len(valid_data) * 100
        
        kpi_example = {
            "metric": "Claridad de la Información (Atención)",
            "consolidado": {
                "average": round(consolidado_avg, 2),
                "rating5": round(rating5_pct, 1),
                "rating4": round(rating4_pct, 1),
                "rating123": round(rating123_pct, 1)
            }
        }
        
        print(f"\n📋 DATOS KPI ESPERADOS:")
        print(json.dumps(kpi_example, indent=2, ensure_ascii=False))
        
    else:
        print(f"❌ No hay datos válidos para Claridad de la Información")

if __name__ == "__main__":
    validar_metrica_claridad()
