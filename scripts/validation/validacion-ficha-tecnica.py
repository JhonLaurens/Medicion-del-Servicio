# 📊 Validación de Ficha Técnica - Proyecto de Satisfacción del Cliente
import math

def calcular_margen_error(N, n, nivel_confianza=0.95, p=0.5):
    """
    Calcula el margen de error para un estudio de satisfacción
    
    Parámetros:
    - N: Universo total (población)
    - n: Muestra efectiva
    - nivel_confianza: Nivel de confianza (default 95%)
    - p: Proporción esperada (default 0.5 - más conservador)
    
    Retorna:
    - Diccionario con resultados del cálculo
    """
    
    # Valores Z para diferentes niveles de confianza
    z_values = {
        0.90: 1.645,
        0.95: 1.96,
        0.99: 2.576
    }
    
    Z = z_values.get(nivel_confianza, 1.96)
    
    # Cálculo sin corrección por población finita
    me_sin_correccion = Z * math.sqrt((p * (1 - p)) / n)
    
    # Cálculo con corrección por población finita
    factor_correccion = math.sqrt((N - n) / (N - 1))
    me_con_correccion = me_sin_correccion * factor_correccion
    
    # Tasa de respuesta
    tasa_respuesta = (n / N) * 100
    
    return {
        'N': N,
        'n': n,
        'nivel_confianza': nivel_confianza * 100,
        'Z': Z,
        'p': p,
        'me_sin_correccion_decimal': me_sin_correccion,
        'me_sin_correccion_porcentaje': me_sin_correccion * 100,
        'me_con_correccion_decimal': me_con_correccion,
        'me_con_correccion_porcentaje': me_con_correccion * 100,
        'factor_correccion': factor_correccion,
        'tasa_respuesta': tasa_respuesta
    }

def validar_ficha_tecnica():
    """
    Validación específica para el proyecto de Coltefinanciera
    """
    print("📊 VALIDACIÓN DE FICHA TÉCNICA - COLTEFINANCIERA")
    print("=" * 60)
    
    # Datos reportados en el estudio
    N = 24067  # Universo total
    n = 1445   # Muestra efectiva
    me_reportado = 0.48  # Margen de error reportado (%)
    nivel_confianza = 0.95  # 95%
    
    print("📋 DATOS DEL ESTUDIO:")
    print(f"   • Universo total (N): {N:,}")
    print(f"   • Muestra efectiva (n): {n:,}")
    print(f"   • Nivel de confianza: {nivel_confianza * 100}%")
    print(f"   • Margen de error reportado: {me_reportado}%")
    print(f"   • Método: Web (SurveyMonkey)")
    print()
    
    # Calcular margen de error
    resultado = calcular_margen_error(N, n, nivel_confianza)
    
    print("🔍 CÁLCULOS REALIZADOS:")
    print(f"   • Valor Z (95% confianza): {resultado['Z']}")
    print(f"   • Proporción utilizada (p): {resultado['p']}")
    print(f"   • Tasa de respuesta: {resultado['tasa_respuesta']:.2f}%")
    print()
    
    print("📐 RESULTADOS DEL MARGEN DE ERROR:")
    print(f"   • Sin corrección por población finita: {resultado['me_sin_correccion_porcentaje']:.2f}%")
    print(f"   • Con corrección por población finita: {resultado['me_con_correccion_porcentaje']:.2f}%")
    print(f"   • Factor de corrección: {resultado['factor_correccion']:.4f}")
    print()
    
    # Comparación con el valor reportado
    diferencia_sin = abs(resultado['me_sin_correccion_porcentaje'] - me_reportado)
    diferencia_con = abs(resultado['me_con_correccion_porcentaje'] - me_reportado)
    
    print("⚖️  COMPARACIÓN CON VALOR REPORTADO:")
    print(f"   • Reportado: {me_reportado}%")
    print(f"   • Calculado (sin corrección): {resultado['me_sin_correccion_porcentaje']:.2f}%")
    print(f"   • Diferencia: {diferencia_sin:.2f} puntos porcentuales")
    print()
    print(f"   • Calculado (con corrección): {resultado['me_con_correccion_porcentaje']:.2f}%")
    print(f"   • Diferencia: {diferencia_con:.2f} puntos porcentuales")
    print()
    
    # Análisis de la discrepancia
    print("🎯 ANÁLISIS:")
    if diferencia_con < 0.1:
        print("   ✅ El margen de error reportado es CORRECTO")
        print("   ✅ La diferencia está dentro del rango aceptable")
    elif diferencia_con < 0.5:
        print("   ⚠️  El margen de error reportado tiene una LIGERA DIFERENCIA")
        print("   ⚠️  Podría deberse a redondeo o método de cálculo diferente")
    else:
        print("   ❌ El margen de error reportado presenta una DISCREPANCIA SIGNIFICATIVA")
        print("   ❌ Se recomienda revisar los cálculos originales")
    
    print()
    print("📝 RECOMENDACIONES:")
    print("   • El cálculo con corrección por población finita es más preciso")
    print("   • Para estudios de satisfacción, p=0.5 es la opción más conservadora")
    print("   • Verificar que el universo de 24,067 sea correcto")
    print("   • Confirmar que la muestra efectiva sea de 1,445 respuestas válidas")

def simulacion_parametros():
    """
    Permite simular diferentes escenarios cambiando parámetros
    """
    print("\n" + "="*60)
    print("🔬 SIMULACIÓN CON DIFERENTES PARÁMETROS")
    print("="*60)
    
    N = 24067
    n = 1445
    
    # Diferentes niveles de confianza
    print("\n📊 Margen de error por nivel de confianza:")
    for confianza in [0.90, 0.95, 0.99]:
        resultado = calcular_margen_error(N, n, confianza)
        print(f"   • {confianza*100}% confianza: {resultado['me_con_correccion_porcentaje']:.2f}%")
    
    # Diferentes valores de p
    print("\n📊 Margen de error por proporción esperada (p):")
    for p in [0.1, 0.3, 0.5, 0.7, 0.9]:
        resultado = calcular_margen_error(N, n, 0.95, p)
        print(f"   • p = {p}: {resultado['me_con_correccion_porcentaje']:.2f}%")
    
    # Diferentes tamaños de muestra
    print("\n📊 Margen de error por tamaño de muestra:")
    for muestra in [500, 1000, 1445, 2000, 3000]:
        if muestra <= N:
            resultado = calcular_margen_error(N, muestra, 0.95)
            print(f"   • n = {muestra}: {resultado['me_con_correccion_porcentaje']:.2f}%")

if __name__ == "__main__":
    validar_ficha_tecnica()
    simulacion_parametros()
    
    print("\n" + "="*60)
    print("✅ VALIDACIÓN COMPLETADA")
    print("="*60)
