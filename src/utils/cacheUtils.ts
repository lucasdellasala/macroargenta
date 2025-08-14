"use client";

import { VariableConfig, CachedVariableData, GovernmentData, DataPoint, GovKey } from "@/types/bcra";
import { GOVS } from "@/constants/bcra";
import { calculateGrowth } from "./numberUtils";
import { getLastDayDate } from "@/utils/governmentUtils";
import { createChartData } from "./dataProcessing";

// Claves de cache
const CACHE_PREFIX = "bcra_cache_";

/**
 * Calcula la fecha de expiración para el primer día del mes siguiente
 */
export function calculateExpirationDate(expirationDays: number = 30): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.getTime();
}

/**
 * Verifica si el cache ha expirado
 */
export function isCacheExpired(cachedData: CachedVariableData): boolean {
  return Date.now() > cachedData.expiresAt;
}

/**
 * Guarda datos de una variable en el cache
 */
export function saveVariableToCache(
  variableConfig: VariableConfig, 
  rawData: DataPoint[], 
  governmentPeriods?: Array<{ key: string; from: Date; to: Date }>
): void {
  try {
    // Usar períodos dinámicos si están disponibles, sino usar los estáticos
    const periods = governmentPeriods || [
      { key: 'CFK2', from: GOVS[0].from, to: GOVS[0].to },
      { key: 'MACRI', from: GOVS[1].from, to: GOVS[1].to },
      { key: 'AF', from: GOVS[2].from, to: GOVS[2].to },
      { key: 'JM', from: GOVS[3].from, to: GOVS[3].to }
    ];

    // Agrupar datos por gobierno usando períodos dinámicos
    const dataByGovernment: CachedVariableData['dataByGovernment'] = {
      CFK2: createGovernmentDataWithPeriod(rawData, "CFK2", periods[0]),
      MACRI: createGovernmentDataWithPeriod(rawData, "MACRI", periods[1]),
      AF: createGovernmentDataWithPeriod(rawData, "AF", periods[2]),
      JM: createGovernmentDataWithPeriod(rawData, "JM", periods[3])
    };

    const cachedData: CachedVariableData = {
      timestamp: Date.now(),
      expiresAt: calculateExpirationDate(variableConfig.cacheExpirationDays),
      variableKey: variableConfig.key,
      variableConfig,
      allData: rawData, // Guardar todos los datos diarios
      dataByGovernment
    };

    localStorage.setItem(variableConfig.cacheKey, JSON.stringify(cachedData));
  } catch (error) {
    console.error(`❌ Error guardando cache para ${variableConfig.key}:`, error);
  }
}

/**
 * Recupera datos de una variable del cache
 */
export function getVariableFromCache(variableKey: string): CachedVariableData | null {
  try {
    const variableConfig = VARIABLES.find(v => v.key === variableKey);
    if (!variableConfig) return null;

    const cachedString = localStorage.getItem(variableConfig.cacheKey);
    if (!cachedString) return null;

    const cachedData: CachedVariableData = JSON.parse(cachedString);
    
    // Verificar que sea la variable correcta
    if (cachedData.variableKey !== variableKey) return null;
    
    // Verificar expiración
    if (isCacheExpired(cachedData)) {
      return null;
    }

    return cachedData;
  } catch (error) {
    console.error(`❌ Error recuperando cache para ${variableKey}:`, error);
    return null;
  }
}

/**
 * Crea datos estructurados para un gobierno específico usando períodos estáticos
 */
function createGovernmentData(rawData: DataPoint[], govKey: GovKey): GovernmentData {
  const gov = GOVS.find(g => g.key === govKey);
  if (!gov) {
    throw new Error(`Gobierno no encontrado: ${govKey}`);
  }

  return createGovernmentDataWithPeriod(rawData, govKey, gov);
}

/**
 * Crea datos estructurados para un gobierno específico usando períodos dinámicos
 */
function createGovernmentDataWithPeriod(
  rawData: DataPoint[], 
  govKey: GovKey, 
  period: { from: Date; to: Date }
): GovernmentData {
  // Filtrar datos del gobierno usando el período proporcionado
  const govData = rawData.filter(point => {
    const pointDate = new Date(point.fecha);
    return pointDate >= period.from && pointDate <= period.to;
  });

  // Ordenar por fecha
  govData.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  // Agrupar datos por mes y tomar solo el último día de cada mes
  const monthlyGroups = new Map<string, DataPoint[]>();
  
  govData.forEach(point => {
    const date = new Date(point.fecha);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyGroups.has(monthKey)) {
      monthlyGroups.set(monthKey, []);
    }
    monthlyGroups.get(monthKey)!.push(point);
  });

  // Crear monthlyData con solo los últimos días de cada mes
  const monthlyData = Array.from(monthlyGroups.entries()).map(([monthKey, points], index) => {
    // Ordenar puntos del mes por fecha y tomar el último
    points.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    const lastPointOfMonth = points[points.length - 1];
    
    const month = index + 1;
    const date = new Date(lastPointOfMonth.fecha);
    
    // Usar la fecha del último día del mes
    const lastDayDate = getLastDayDate(date.getFullYear(), date.getMonth());
    
    // Calcular cambio porcentual desde el primer mes
    let percentageChange: number | undefined;
    if (index > 0) {
      const firstMonthPoints = Array.from(monthlyGroups.values())[0];
      if (firstMonthPoints.length > 0) {
        const firstValue = firstMonthPoints[0].valor;
        percentageChange = calculateGrowth(firstValue, lastPointOfMonth.valor);
      }
    }

    return {
      month,
      value: lastPointOfMonth.valor,
      date: lastDayDate,
      percentageChange
    };
  });

  // Calcular resumen
  const startValue = monthlyData[0]?.value || 0;
  const endValue = monthlyData[monthlyData.length - 1]?.value || 0;
  const totalChange = endValue - startValue;
  const percentageChange = calculateGrowth(startValue, endValue);

  return {
    period: {
      from: period.from.toISOString(),
      to: period.to.toISOString()
    },
    monthlyData,
    summary: {
      startValue,
      endValue,
      totalChange,
      percentageChange
    }
  };
}

/**
 * Crea datos del gráfico desde el cache
 */
export function createChartDataFromCache(cachedData: CachedVariableData): any[] {
  // Usar allData para crear el gráfico, ya que contiene todos los datos diarios
  // Esto es más eficiente que procesar monthlyData
  return createChartData(cachedData.allData, new Set(["CFK2", "MACRI", "AF", "JM"]), GOVS);
}

/**
 * Limpia el cache de una variable específica
 */
export function clearVariableCache(variableKey: string): void {
  try {
    const variableConfig = VARIABLES.find(v => v.key === variableKey);
    if (variableConfig) {
      localStorage.removeItem(variableConfig.cacheKey);
    }
  } catch (error) {
    console.error(`❌ Error limpiando cache para ${variableKey}:`, error);
  }
}

/**
 * Limpia todo el cache
 */
export function clearAllCache(): void {
  try {
    const keysToRemove: string[] = [];
    
    // Buscar todas las claves de cache
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    // Remover todas las claves
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
  } catch (error) {
    console.error(`❌ Error limpiando todo el cache:`, error);
  }
}

/**
 * Obtiene estadísticas del cache
 */
export function getCacheStats(): {
  totalVariables: number;
  totalSize: number;
  oldestEntry: number;
  newestEntry: number;
} {
  try {
    let totalVariables = 0;
    let totalSize = 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        totalVariables++;
        
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
          
          try {
            const cachedData = JSON.parse(value);
            if (cachedData.timestamp) {
              oldestEntry = Math.min(oldestEntry, cachedData.timestamp);
              newestEntry = Math.max(newestEntry, cachedData.timestamp);
            }
          } catch (e) {
            // Ignorar entradas corruptas
          }
        }
      }
    }

    return {
      totalVariables,
      totalSize,
      oldestEntry,
      newestEntry
    };
  } catch (error) {
    console.error(`❌ Error obteniendo estadísticas del cache:`, error);
    return {
      totalVariables: 0,
      totalSize: 0,
      oldestEntry: 0,
      newestEntry: 0
    };
  }
}

/**
 * Limpia automáticamente el cache expirado
 */
export function cleanExpiredCache(): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const cachedData = JSON.parse(value);
            if (isCacheExpired(cachedData)) {
              keysToRemove.push(key);
            }
          } catch (e) {
            // Entrada corrupta, remover
            keysToRemove.push(key);
          }
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
    }
  } catch (error) {
    console.error(`❌ Error limpiando cache expirado:`, error);
  }
}

// Importar VARIABLES aquí para evitar dependencia circular
import { VARIABLES } from "@/constants/bcra";
