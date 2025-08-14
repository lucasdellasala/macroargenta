"use client";

import { VariableConfig, Government } from "@/types/bcra";

export const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export const VARIABLES: VariableConfig[] = [
  {
    key: "base_monetaria",
    label: "Base monetaria (M$)",
    pattern: /base\s+monetaria/i,
    units: "M$",
    yAxisLabel: "Base Monetaria (Millones de Pesos)",
    xAxisLabel: "Meses de Gobierno",
    isPercentage: false,
    numberFormat: "currency",
    decimalPlaces: 0,
    cacheKey: "bcra_cache_base_monetaria",
    cacheExpirationDays: 30
  },
  {
    key: "m2_privado",
    label: "M2 privado, variación interanual (%)",
    pattern: /m2\s+privado.*variación\s+interanual/i,
    units: "%",
    yAxisLabel: "Variación Interanual (%)",
    xAxisLabel: "Meses de Gobierno",
    isPercentage: true,
    numberFormat: "percentage",
    decimalPlaces: 2,
    cacheKey: "bcra_cache_m2_privado",
    cacheExpirationDays: 30
  },
  {
    key: "reservas_brutas",
    label: "Reservas internacionales brutas (MM US$)",
    pattern: /reservas\s+internacionales.*millones\s+de\s+dólares/i,
    units: "MM US$",
    yAxisLabel: "Reservas brutas (Millones de Dólares)",
    xAxisLabel: "Meses de Gobierno",
    isPercentage: false,
    numberFormat: "currency",
    decimalPlaces: 0,
    cacheKey: "bcra_cache_reservas_brutas",
    cacheExpirationDays: 30
  }
];

// Mantener SERIES para compatibilidad temporal
export const SERIES = VARIABLES;

export const GOVS: Government[] = [
  { 
    key: "CFK2", 
    label: "CFK 2°", 
    from: new Date(2011, 11, 1), 
    to: new Date(2015, 10, 30) 
  },
  {
    key: "MACRI",
    label: "Mauricio Macri",
    from: new Date(2015, 11, 1),
    to: new Date(2019, 10, 30),
  },
  {
    key: "AF",
    label: "Alberto Fernández",
    from: new Date(2019, 11, 1),
    to: new Date(2023, 10, 30),
  },
  {
    key: "JM",
    label: "Javier Milei",
    from: new Date(2023, 11, 1),
    to: new Date(), // Se calculará dinámicamente en el componente
  },
];

export const API_BASE = "https://api.bcra.gob.ar/estadisticas/v3.0";
export const API_LIMIT = 3000;
