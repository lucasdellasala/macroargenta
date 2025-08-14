"use client";

import { DataPoint, GovKey, Government, ChartDataPoint } from "@/types/bcra";
import { monthKey, fmtDate } from "@/utils/dateUtils";

export function groupMonthlyLast(points: DataPoint[]): DataPoint[] {
  const byMonth = new Map<string, DataPoint>();
  for (const p of points) {
    const k = monthKey(p.fecha);
    const prev = byMonth.get(k);
    if (!prev || p.fecha > prev.fecha) byMonth.set(k, p);
  }
  return Array.from(byMonth.values()).sort((a, b) =>
    a.fecha < b.fecha ? -1 : 1
  );
}

export function within(points: DataPoint[], from: Date, to: Date): DataPoint[] {
  const a = fmtDate(from);
  const b = fmtDate(to);
  return points.filter((p) => p.fecha >= a && p.fecha <= b);
}

export function toggleGovSelection(
  govKey: string,
  selected: Set<string>,
  setSelected: (govs: Set<string>) => void
): void {
  const newSelected = new Set(selected);
  if (newSelected.has(govKey)) {
    newSelected.delete(govKey);
  } else {
    newSelected.add(govKey);
  }
  setSelected(newSelected);
}

export function createChartData(
  dailyData: DataPoint[],
  selectedGovs: Set<string>,
  governments: Government[]
): ChartDataPoint[] {
  const normalizedData: ChartDataPoint[] = [];

  // Crear datos para 48 meses (período de gobierno) con comparación simultánea
  for (let mes = 1; mes <= 48; mes++) {
    const row: ChartDataPoint = { mes };

    governments.forEach((gov) => {
      if (selectedGovs.has(gov.key)) {
        // Filtrar datos dentro del período del gobierno
        const govData = within(dailyData, gov.from, gov.to);
        
        // Agrupar por mes y tomar el último valor de cada mes
        const monthlyData = groupMonthlyLast(govData);
        
        // Encontrar el dato correspondiente al mes actual
        if (monthlyData.length > 0) {
          const dataPoint = monthlyData[mes - 1];
          if (dataPoint) {
            row[gov.key] = dataPoint.valor;
          }
        }
      }
    });

    normalizedData.push(row);
  }

  return normalizedData;
}

// Nueva función para crear datos del gráfico con períodos dinámicos
export function createChartDataWithDynamicPeriods(
  dailyData: DataPoint[],
  selectedGovs: Set<string>,
  governmentPeriods: Array<{ key: string; from: Date; to: Date }>,
  maxMonths: number = 48
): ChartDataPoint[] {
  const normalizedData: ChartDataPoint[] = [];

  // Crear datos para el número de meses especificado
  for (let mes = 1; mes <= maxMonths; mes++) {
    const row: ChartDataPoint = { mes };

    governmentPeriods.forEach((gov) => {
      if (selectedGovs.has(gov.key)) {
        // Filtrar datos dentro del período del gobierno
        const govData = within(dailyData, gov.from, gov.to);
        
        // Agrupar por mes y tomar el último valor de cada mes
        const monthlyData = groupMonthlyLast(govData);
        
        // Encontrar el dato correspondiente al mes actual
        if (monthlyData.length > 0) {
          const dataPoint = monthlyData[mes - 1];
          if (dataPoint) {
            row[gov.key as keyof ChartDataPoint] = dataPoint.valor;
          }
        }
      }
    });

    normalizedData.push(row);
  }

  return normalizedData;
}
