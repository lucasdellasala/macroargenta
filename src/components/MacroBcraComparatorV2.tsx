"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MacroChart } from "@/components/charts/MacroChart";
import { GovernmentFilter } from "@/components/ui/GovernmentFilter";
import { Spinner } from "@/components/ui/Spinner";
import { VARIABLES, GOVS, MONTH_NAMES } from "@/constants/bcra";
import { fetchVariableList, fetchVariableData } from "@/services/bcraApi";
import { createChartDataWithDynamicPeriods } from "@/utils/dataProcessing";
import { getGovernmentPeriods } from "@/utils/governmentUtils";

import {
  saveVariableToCache,
  getVariableFromCache,
  createChartDataFromCache,
  cleanExpiredCache,
} from "@/utils/cacheUtils";
import { VariableConfig, ChartDataPoint } from "@/types/bcra";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export default function MacroBcraComparatorV2() {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedGovs, setSelectedGovs] = useState<Set<string>>(
    new Set(["CFK2", "MACRI", "AF", "JM"])
  );
  const [variables, setVariables] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const [isPercentage, setIsPercentage] = useState(false);
  const [currentVariableConfig, setCurrentVariableConfig] =
    useState<VariableConfig | null>(null);
  const windowWidth = useWindowWidth();

  // Limpiar cache expirado al montar el componente
  useEffect(() => {
    cleanExpiredCache();
  }, []);

  // Cargar variables del BCRA al montar el componente
  useEffect(() => {
    const loadVariables = async () => {
      try {
        const vars = await fetchVariableList();
        setVariables(vars);
      } catch (e) {
        console.error("Error cargando variables:", e);
      }
    };
    loadVariables();
  }, []);

  // Mapeo hardcodeado de variables del BCRA (ya que la API no está funcionando)
  const VARIABLE_IDS: Record<string, number> = {
    base_monetaria: 15, // Base monetaria
    m2_privado: 16, // M2 privado, variación interanual
    reservas_brutas: 17, // Reservas internacionales brutas
  };

  // Mapear variables del BCRA a nuestras series configuradas
  const idFor = useMemo(() => {
    if (variables.length > 0) {
      // Si tenemos variables de la API, usarlas
      const mapping: Record<string, number> = {};
      VARIABLES.forEach((series) => {
        const match = variables.find((v) => series.pattern.test(v.descripcion));
        if (match) {
          mapping[series.key] = match.idVariable;
        }
      });
      return mapping;
    } else {
      // Si no hay variables de la API, usar mapeo hardcodeado
      return VARIABLE_IDS;
    }
  }, [variables]);

  // Cargar datos de una variable específica
  const loadSelected = async (variableKey: string) => {
    const variableConfig = VARIABLES.find((v) => v.key === variableKey);
    if (!variableConfig) return;

    setCurrentVariableConfig(variableConfig);
    setLoading(true);

    try {
      // 1. Intentar obtener del cache
      const cached = getVariableFromCache(variableKey);
      if (cached) {
        setChartData(createChartDataFromCache(cached));
        // setCurrentUnits(variableConfig.units);
        setIsPercentage(variableConfig.isPercentage);
        setLoading(false);
        return;
      }

      // 2. Si no hay cache, llamar a la API
      const id = idFor[variableKey];
      if (!id) {
        console.error(`No se encontró ID para la variable ${variableKey}`);
        setLoading(false);
        return;
      }

      // Obtener períodos de gobierno con fechas dinámicas
      const governmentPeriods = getGovernmentPeriods();

      // Hacer requests paralelos solo para gobiernos seleccionados
      const requests = governmentPeriods
        .filter((gov) => selectedGovs.has(gov.key))
        .map(async (gov) => {
          try {
            const data = await fetchVariableData(id, gov.from, gov.to);
            return { govKey: gov.key, data };
          } catch (error) {
            console.error(`❌ Error obteniendo datos para ${gov.key}:`, error);
            return { govKey: gov.key, data: [] };
          }
        });

      const results = await Promise.all(requests);

      // Combinar todos los datos
      const allData = results.flatMap((result) => result.data);

      // 3. Guardar en cache con períodos dinámicos
      saveVariableToCache(variableConfig, allData, governmentPeriods);

      // 4. Usar datos frescos con períodos dinámicos
      // setCurrentUnits(variableConfig.units);
      setIsPercentage(variableConfig.isPercentage);
      setChartData(
        createChartDataWithDynamicPeriods(
          allData,
          selectedGovs,
          governmentPeriods
        )
      );
    } catch (e: any) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  };

  // Handle variable selection
  const handleVariableChange = (value: string) => {
    setSelectedKey(value);
    if (value) {
      loadSelected(value);
    }
  };

  // Get line name based on screen width
  const getLineName = (govKey: string) => {
    const gov = GOVS.find((g) => g.key === govKey);
    if (!gov) return govKey;

    if (windowWidth < 640) {
      // if Milei put Milei instead of Javier, if Mauricio put Macri instead of Mauricio
      if (govKey === "JM") {
        return "Milei";
      }
      if (govKey === "MACRI") {
        return "Macri";
      }
      return gov.label.split(" ")[0]; // Tomar solo la primera palabra para móvil
    }
    return gov.label; // Nombre completo para desktop
  };

  // Obtener datos mensuales del cache para el summary
  const monthlyDataForSummary = useMemo(() => {
    if (!selectedKey) return null;

    const cached = getVariableFromCache(selectedKey);
    if (!cached) {
      return null;
    }

    // Retornar solo los gobiernos seleccionados
    const selectedData: Record<string, any> = {};

    Object.entries(cached.dataByGovernment).forEach(([govKey, govData]) => {
      if (selectedGovs.has(govKey)) {
        selectedData[govKey] = govData;
      }
    });

    return selectedData;
  }, [selectedKey, selectedGovs]);

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.svg"
              alt="Macro Argenta Logo"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Macro <span className="text-[#B71C1C]">Argenta</span>
          </h1>
          <p className="text-sm text-text-secondary max-w-3xl mx-auto mb-4">
            Comparador de variables macroeconómicas del BCRA entre diferentes
            gobiernos argentinos. Agrupación mensual por último dato del mes.
            Milei truncado en {MONTH_NAMES[new Date().getMonth() - 1]}{" "}
            {new Date().getFullYear()}.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
                          <CardTitle className="text-text-primary">
              Seleccionar Variable
            </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Dropdown temporal para debug */}
              <select
                value={selectedKey}
                onChange={(e) => handleVariableChange(e.target.value)}
                className="w-full p-2 border rounded bg-background-card text-text-primary"
              >
                <option value="">Elegir variable</option>
                {VARIABLES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
                          <CardTitle className="text-text-primary">
              Filtro de Gobiernos
            </CardTitle>
            </CardHeader>
            <CardContent>
              <GovernmentFilter
                governments={GOVS}
                selectedGovs={selectedGovs}
                setSelectedGovs={setSelectedGovs}
              />
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="col-span-3 flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {!loading && selectedKey && (
          <>
            {chartData.length > 0 && (
              <Card className="my-6">
                <CardHeader>
                                  <CardTitle className="text-text-primary">
                  Gráfico Comparativo
                </CardTitle>
                </CardHeader>
                <CardContent>
                  <MacroChart
                    chartData={chartData}
                    selectedGovs={selectedGovs}
                    getLineName={getLineName}
                    isPercentage={isPercentage}
                    variableConfig={currentVariableConfig}
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Footer con explicación metodológica */}
        <footer className="mt-12 py-8 border-t border-secondary-light/20">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Metodología
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-text-secondary">
                              <div>
                  <h4 className="font-medium text-text-primary mb-2">
                    📊 Valores Mensuales
                  </h4>
                <p>
                  Para cada variable macroeconómica, se toma el valor del último
                  día de cada mes (30, 31, 28 o 29 según corresponda,
                  considerando años bisiestos).
                </p>
              </div>
                              <div>
                  <h4 className="font-medium text-text-primary mb-2">
                    ⏱️ Comparación por Meses de Gobierno
                  </h4>
                <p>
                  Se comparan los primeros 48 meses de cada gobierno, alineando
                  el mes 1 de cada período para facilitar la comparación
                  temporal.
                </p>
              </div>
                              <div>
                  <h4 className="font-medium text-text-primary mb-2">
                    🌐 Fuente de Datos
                  </h4>
                <p>
                  Todos los datos provienen de la API oficial del Banco Central
                  de la República Argentina (BCRA), garantizando la precisión y
                  oficialidad de la información.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
