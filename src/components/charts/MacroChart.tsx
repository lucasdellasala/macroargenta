"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint, VariableConfig } from "@/types/bcra";
import { useTheme } from "@/contexts/ThemeContext";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { formatLargeNumber } from "@/utils/numberUtils";

interface MacroChartProps {
  chartData: ChartDataPoint[];
  selectedGovs: Set<string>;
  getLineName: (govKey: string) => string;
  isPercentage?: boolean;
  variableConfig?: VariableConfig | null;
}

export function MacroChart({
  chartData,
  selectedGovs,
  getLineName,
  isPercentage = false,
  variableConfig
}: MacroChartProps) {
  const { isDark } = useTheme();
  const isMobile = useWindowWidth() < 640;

  // Colores para las líneas
  const lineColors = {
    CFK2: "#0000FF",    // Azul
    MACRI: "#FFDB00",   // Amarillo
    AF: "#29AB87",      // Verde selva
    JM: "#9400D3",      // Violeta
  };

  // Formatear valor para tooltip
  const formatValue = (value: number) => {
    if (isPercentage) {
      return `${value.toFixed(2)}%`;
    }
    return formatLargeNumber(value);
  };

  // Formatear etiqueta del eje Y
  const formatYAxisLabel = () => {
    if (variableConfig) {
      return variableConfig.yAxisLabel;
    }
    return isPercentage ? "Porcentaje (%)" : "Valor";
  };

  // Formatear etiqueta del eje X
  const formatXAxisLabel = () => {
    if (variableConfig) {
      return variableConfig.xAxisLabel;
    }
    return "Meses de Gobierno";
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: isMobile ? 40 : 60,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#374151" : "#E5E7EB"}
          />
          
          <XAxis
            dataKey="mes"
            interval={11}
            tick={{ fill: isDark ? "#FFFFFF" : "#000000" }}
            tickFormatter={(value) => {
              // Mostrar solo el número del mes (1, 2, 3... 48)
              return value.toString();
            }}
            style={{
              fontSize: isMobile ? "10px" : "12px",
            }}
            label={{
              value: formatXAxisLabel(),
              position: "bottom",
              style: {
                textAnchor: "middle",
                fill: isDark ? "#FFFFFF" : "#000000",
                fontSize: isMobile ? "12px" : "14px",
              },
            }}
          />
          
          <YAxis
            tick={{ fill: isDark ? "#FFFFFF" : "#000000" }}
            tickFormatter={(value) => {
              if (isPercentage) {
                return `${value}%`;
              }
              return formatLargeNumber(value);
            }}
            style={{
              fontSize: isMobile ? "10px" : "12px",
            }}
            label={{
              value: formatYAxisLabel(),
              angle: -90,
              position: "left",
              style: {
                textAnchor: "middle",
                fill: isDark ? "#FFFFFF" : "#000000",
                fontSize: isMobile ? "12px" : "14px",
              },
            }}
            width={isMobile ? 40 : 60}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
              borderRadius: "8px",
              color: isDark ? "#FFFFFF" : "#000000",
            }}
            formatter={(value: any, name: any, props: any) => {
              // props.payload contiene la información completa del punto
              const { payload } = props;
              if (!payload) {
                return [formatValue(value), getLineName(name)];
              }
              
              const currentMonth = payload.mes;
              const currentValue = value;
              
              // Solo mostrar porcentaje si no es el mes 1
              if (currentMonth === 1) {
                return [formatValue(value), getLineName(name)];
              }
              
              // Buscar el mes 1 para este gobierno
              const firstMonthData = chartData.find(item => item.mes === 1);
              if (!firstMonthData) {
                return [formatValue(value), getLineName(name)];
              }

              const FULL_NAME_TO_KEY = {
                "CFK 2°": "CFK2",
                "Mauricio Macri": "MACRI",
                "Alberto Fernández": "AF",
                "Javier Milei": "JM",
              }
              
              const initialValue = firstMonthData[FULL_NAME_TO_KEY[name]];
              const percentageChange = ((currentValue - initialValue) / initialValue) * 100;
              const sign = percentageChange >= 0 ? "+" : "";
              const percentageText = `(${sign}${percentageChange.toFixed(1)}%)`;
              
              return [
                `${formatValue(value)} ${percentageText}`,
                getLineName(name),
              ];
            }}
            labelFormatter={(label) => `Mes ${label}`}
          />
          
          <Legend
            verticalAlign="top"
            height={isMobile ? 60 : 80}
            wrapperStyle={{
              paddingBottom: "10px",
            }}
          />
          
          {selectedGovs.has("CFK2") && (
            <Line
              type="monotone"
              dataKey="CFK2"
              stroke={lineColors.CFK2}
              strokeWidth={2}
              dot={false}
              name={getLineName("CFK2")}
            />
          )}
          
          {selectedGovs.has("MACRI") && (
            <Line
              type="monotone"
              dataKey="MACRI"
              stroke={lineColors.MACRI}
              strokeWidth={2}
              dot={false}
              name={getLineName("MACRI")}
            />
          )}
          
          {selectedGovs.has("AF") && (
            <Line
              type="monotone"
              dataKey="AF"
              stroke={lineColors.AF}
              strokeWidth={2}
              dot={false}
              name={getLineName("AF")}
            />
          )}
          
          {selectedGovs.has("JM") && (
            <Line
              type="monotone"
              dataKey="JM"
              stroke={lineColors.JM}
              strokeWidth={2}
              dot={false}
              name={getLineName("JM")}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}