"use client";

export type VarListItem = { 
  idVariable: number; 
  descripcion: string 
};

export type VarListResp = {
  status: number;
  metadata: {
    resultset: {
      count: number;
      offset: number;
      limit: number;
    };
  };
  results: VarListItem[];
};

export type DataPoint = { 
  idVariable: number; 
  fecha: string; 
  valor: number 
};

export type DataResp = {
  status: number;
  metadata: {
    resultset: {
      count: number;
      offset: number;
      limit: number;
    };
  };
  results: DataPoint[];
};

export type VariableConfig = {
  // Identificación
  key: string;
  label: string;
  
  // Metadatos de la API
  pattern: RegExp;
  apiEndpoint?: string;
  
  // Configuración de visualización
  units: string;
  yAxisLabel: string;
  xAxisLabel: string;
  
  // Configuración de formato
  isPercentage: boolean;
  numberFormat: "currency" | "number" | "percentage";
  decimalPlaces: number;
  
  // Configuración de cache
  cacheKey: string;
  cacheExpirationDays: number;
};

export type GovKey = "CFK2" | "MACRI" | "AF" | "JM";

export type Government = {
  key: GovKey;
  label: string;
  from: Date;
  to: Date;
};

export type ChartDataPoint = {
  mes: number;
  CFK2?: number;
  MACRI?: number;
  AF?: number;
  JM?: number;
};

export type GovernmentData = {
  period: { from: string, to: string };
  monthlyData: Array<{
    month: number;
    value: number;
    date: string;
    percentageChange?: number;
  }>;
  summary: {
    startValue: number;
    endValue: number;
    totalChange: number;
    percentageChange: number;
  };
};

export type CachedVariableData = {
  // Metadatos del cache
  timestamp: number;
  expiresAt: number;
  variableKey: string;
  variableConfig: VariableConfig;
  
  // Todos los datos diarios (para el gráfico)
  allData: DataPoint[];
  
  // Datos agrupados por gobierno (para el summary)
  dataByGovernment: {
    CFK2: GovernmentData;
    MACRI: GovernmentData;
    AF: GovernmentData;
    JM: GovernmentData;
  };
};
