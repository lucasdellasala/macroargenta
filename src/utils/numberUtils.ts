"use client";

export function toLocale(n: number): string {
  return new Intl.NumberFormat("es-AR").format(n);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toFixed(1);
  }
}

export function calculateGrowth(initialValue: number, currentValue: number): number {
  if (initialValue === 0) return 0;
  return ((currentValue - initialValue) / initialValue) * 100;
}
