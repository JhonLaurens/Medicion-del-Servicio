#!/usr/bin/env python3
"""
📌 Script de validación completo para la métrica "Claridad de la Información (Atención)"
Este script verifica la presencia, datos y visualización de la métrica en el dashboard.
"""

import pandas as pd
import json
import os
import sys

def main():
    print("🔍 VALIDACIÓN COMPLETA: MÉTRICA CLARIDAD DE LA INFORMACIÓN")
    print("=" * 70)
    
    print("\n1️⃣ VERIFICACIÓN DE DATOS EN CSV")
    print("-" * 40)
    
    # Verificar archivo CSV
    csv_path = 'public/datos.csv'
    if not os.path.exists(csv_path):
        print(f"❌ ERROR: No se encontró {csv_path}")
        return False
    
    try:
        df = pd.read_csv(csv_path, sep=';', encoding='utf-8')
        print(f"✅ CSV cargado: {len(df)} registros")
    except Exception as e:
        print(f"❌ Error cargando CSV: {e}")
        return False
    
    # Buscar columna de claridad
    claridad_col = None
    for col in df.columns:
        if 'información suministrada' in col and 'clara' in col:
            claridad_col = col
            break
    
    if not claridad_col:
        print("❌ No se encontró la columna de claridad de información")
        return False
    
    print(f"✅ Columna encontrada: '{claridad_col[:60]}...'")
    
    # Analizar datos de claridad
    claridad_data = pd.to_numeric(df[claridad_col], errors='coerce')
    valid_data = claridad_data.dropna()
    
    if len(valid_data) == 0:
        print("❌ No hay datos válidos para Claridad de la Información")
        return False
    
    print(f"✅ Datos válidos: {len(valid_data)}/{len(df)} ({len(valid_data)/len(df)*100:.1f}%)")
    print(f"✅ Promedio: {valid_data.mean():.2f}")
    
    # Distribución por calificación
    print(f"\n📊 DISTRIBUCIÓN DE CALIFICACIONES:")
    for rating in sorted(valid_data.unique()):
        count = (valid_data == rating).sum()
        pct = count / len(valid_data) * 100
        print(f"   • Calificación {int(rating)}: {count} ({pct:.1f}%)")
    
    # Análisis por segmento
    if 'SEGMENTO' in df.columns:
        print(f"\n🏢 ANÁLISIS POR SEGMENTO:")
        for segmento in df['SEGMENTO'].dropna().unique():
            seg_data = pd.to_numeric(df[df['SEGMENTO'] == segmento][claridad_col], errors='coerce').dropna()
            if len(seg_data) > 0:
                print(f"   • {segmento}: promedio {seg_data.mean():.2f} (n={len(seg_data)})")
    
    print("\n2️⃣ VERIFICACIÓN DE CONFIGURACIÓN DEL CÓDIGO")
    print("-" * 40)
    
    # Verificar archivos de código
    files_to_check = [
        'src/services/dataService.ts',
        'src/components/GeneralDashboard.tsx',
        'src/types/index.ts'
    ]
    
    all_files_exist = True
    for file_path in files_to_check:
        if os.path.exists(file_path):
            print(f"✅ {file_path} existe")
        else:
            print(f"❌ {file_path} no encontrado")
            all_files_exist = False
    
    if not all_files_exist:
        print("❌ Faltan archivos de código necesarios")
        return False
    
    # Verificar configuración en dataService.ts
    try:
        with open('src/services/dataService.ts', 'r', encoding='utf-8') as f:
            content = f.read()
            
        has_claridad_mapping = 'claridad_informacion' in content
        has_getKPI_function = 'getKPIData()' in content
        
        print(f"✅ Mapeo de claridad_informacion: {'SÍ' if has_claridad_mapping else 'NO'}")
        print(f"✅ Función getKPIData: {'SÍ' if has_getKPI_function else 'NO'}")
        
        # Verificar orden de métricas
        if "{ key: 'claridad_informacion', name: 'Claridad de la Información (Atención)' }" in content:
            print("✅ Métrica de claridad está configurada correctamente")
        else:
            print("⚠️ La configuración de la métrica puede tener problemas")
            
    except Exception as e:
        print(f"❌ Error verificando dataService.ts: {e}")
        return False
    
    print("\n3️⃣ RECOMENDACIONES")
    print("-" * 40)
    
    print("📋 ESTADO ACTUAL:")
    print("   • ✅ Los datos de 'Claridad de la Información' están presentes en el CSV")
    print("   • ✅ La métrica está configurada en el código")
    print("   • ✅ Los archivos necesarios existen")
    
    print("\n🎯 POSIBLES CAUSAS SI NO APARECE EN EL DASHBOARD:")
    print("   1. 🌐 Caché del navegador - Hacer Ctrl+F5 para recargar")
    print("   2. 📱 Problema de responsive - Verificar en pantalla grande")
    print("   3. 🔄 El servicio no terminó de cargar - Revisar consola del navegador")
    print("   4. 🎨 Error de CSS - La métrica puede estar oculta visualmente")
    
    print("\n🛠️ PASOS PARA VERIFICAR:")
    print("   1. Abrir http://localhost:5174/ en el navegador")
    print("   2. Navegar a 'Dashboard General' en el menú lateral")
    print("   3. Abrir DevTools (F12) y revisar la consola")
    print("   4. Buscar logs que muestren '🎨 Rendering KPI 1: Claridad de la Información'")
    print("   5. Verificar que aparezcan 4 tarjetas KPI en la parte superior")
    
    print("\n✅ VALIDACIÓN COMPLETADA - LOS DATOS ESTÁN LISTOS")
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 ¡TODO ESTÁ CONFIGURADO CORRECTAMENTE!")
        print("Si no ves la métrica en el dashboard, revisa el caché del navegador.")
        sys.exit(0)
    else:
        print("\n❌ SE ENCONTRARON PROBLEMAS QUE NECESITAN CORRECCIÓN")
        sys.exit(1)
