"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function useChartColors() {
  const { isDark } = useTheme();

  const getLineColor = (govKey: string): string => {
    if (isDark) {
      switch (govKey) {
        case "CFK2": return "#E53935"; // Rojo más claro
        case "MACRI": return "#FFB74D"; // Blanco
        case "AF": return "#4DD0E1"; // Teal más claro
        case "JM": return "#9C27B0"; // Naranja más claro
        default: return "#FFFFFF";
      }
    } else {
      switch (govKey) {
        case "CFK2": return "#B71C1C"; // Rojo granate original
        case "MACRI": return "#FF9800"; // Naranja original
        case "AF": return "#009688"; // Teal original
        case "JM": return "#9C27B0"; // Violeta original
        default: return "#000000";
      }
    }
  };
  return { getLineColor, isDark };
}
