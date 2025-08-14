"use client";

import { Government } from "@/types/bcra";

// Función para obtener el último día del mes anterior al actual
export function getLastMonthEndDate(): Date {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
  return new Date(now.getFullYear(), now.getMonth() - 1, lastMonth.getDate());
}

// Función para obtener los períodos de gobierno con fechas dinámicas
export function getGovernmentPeriods(): Array<{ key: string; from: Date; to: Date }> {
  const jmEndDate = getLastMonthEndDate();
  
  return [
    { key: 'CFK2', from: new Date(2011, 11, 1), to: new Date(2015, 10, 30) },
    { key: 'MACRI', from: new Date(2015, 11, 1), to: new Date(2019, 10, 30) },
    { key: 'AF', from: new Date(2019, 11, 1), to: new Date(2023, 10, 30) },
    { key: 'JM', from: new Date(2023, 11, 1), to: jmEndDate }
  ];
}

// Función para obtener el último día de un mes específico
export function getLastDayOfMonth(year: number, month: number): number {
  // month es 0-11 (enero-diciembre)
  return new Date(year, month + 1, 0).getDate();
}

// Función para generar fecha del último día del mes
export function getLastDayDate(year: number, month: number): string {
  const lastDay = getLastDayOfMonth(year, month);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}

// Función para validar si un año es bisiesto
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Función para obtener el nombre del mes en español
export function getMonthName(month: number): string {
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return monthNames[month];
}
