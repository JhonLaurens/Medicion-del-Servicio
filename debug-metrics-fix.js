// ... existing code ...

  // Función para obtener datos históricos de evolución
  const getHistoricalData = () => {
    // Calcular datos actuales de 2024-2025 desde el CSV
    const currentData = kpiData.filter(
      (item) =>
        item.metric === "Satisfacción General" ||
        item.metric ===
          "En general, ¿Qué tan satisfecho se encuentra con los servicios que le ofrece Coltefinanciera?"
    );

    const consolidadoActual =
      currentData.length > 0
        ? currentData[0].consolidado?.average || 4.30
        : 4.30;
    const personasActual =
      currentData.length > 0 ? currentData[0].personas?.average || 4.31 : 4.31;
    const empresasActual =
      currentData.length > 0
        ? currentData[0].empresarial?.average || 3.85
        : 3.85;

    // Datos históricos basados en la presentación (2020-2023) y datos reales del CSV (2024-2025)
    const historicalData = [
      {
        year: "2020",
        consolidado: 4.33,
        personas: 4.33,
        empresas: 4.22,
        escala100: 86.64,
        trend: "Regular Alto",
      },
      {
        year: "2021",
        consolidado: 4.31,
        personas: 4.34,
        empresas: 3.95,
        escala100: 86.11,
        trend: "Regular Alto",
      },
      {
        year: "2022",
        consolidado: 4.37,
        personas: 4.38,
        empresas: 4.09,
        escala100: 87.44,
        trend: "Regular Alto",
      },
      {
        year: "2023",
        consolidado: 4.41,
        personas: 4.43,
        empresas: 3.86,
        escala100: 88.18,
        trend: "Regular Alto",
      },
      {
        year: "2024-2025",
        consolidado: consolidadoActual,
        personas: personasActual,
        empresas: empresasActual,
        escala100: consolidadoActual * 20,
        trend: "Regular Alto",
      },
    ];

    // Log para depuración
    console.log('📊 Datos históricos calculados:', {
      consolidadoActual,
      personasActual,
      empresasActual,
      historicalData: historicalData[historicalData.length - 1]
    });

    return historicalData;
  };

// ... existing code ...