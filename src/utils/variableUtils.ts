"use client";

/**
 * Extrae las unidades de la descripción de una variable del BCRA
 * @param description Descripción de la variable (ej: "Base monetaria (M$)")
 * @returns Las unidades extraídas o null si no se encuentran
 */
export function extractUnits(description: string): string | null {
  // Buscar unidades entre paréntesis al final de la descripción
  const unitsMatch = description.match(/\(([^)]+)\)\s*$/);

  if (unitsMatch) {
    return unitsMatch[1];
  }

  return null;
}

/**
 * Mapea las unidades comunes a abreviaciones más legibles
 * @param units Unidades extraídas de la descripción
 * @returns Unidades mapeadas o las originales si no hay mapeo
 */
export function mapUnits(units: string): string {
  const unitsMap: Record<string, string> = {
    "M$": "M$",
    "MM$": "MM$",
    "MM US$": "MM US$",
    "millones de dólares": "MM US$",
    "millones de pesos": "M$",
    "porcentaje": "%",
    "% n.a.": "%",
    "por ciento": "%",
    "en millones de dólares - cifras provisorias sujetas a cambio de valuación": "M USD",
  };

  return unitsMap[units] || units;
}

/**
 * Detecta si una variable es porcentual basándose en su descripción
 * @param description Descripción de la variable
 * @returns true si es porcentual, false en caso contrario
 */
export function isPercentageVariable(description: string): boolean {
  const lowerDesc = description.toLowerCase();
  return lowerDesc.includes("variación interanual") || 
         lowerDesc.includes("porcentaje") || 
         lowerDesc.includes("%") ||
         lowerDesc.includes("por ciento");
}
