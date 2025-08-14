"use client";

import { API_BASE, API_LIMIT } from "@/constants/bcra";

// Función para obtener la lista de variables del BCRA (API v3)
export async function fetchVariableList(): Promise<any[]> {
  try {
    // La API v3 tiene diferentes endpoints para diferentes tipos de variables
    const endpoints = ['/Monetarias', '/Reservas', '/Precios'];
    let allVariables: any[] = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // La respuesta tiene estructura: {status, metadata, results}
          if (data.status === 200 && data.results && Array.isArray(data.results)) {
            allVariables = allVariables.concat(data.results);
          }
        } else {
        }
      } catch (endpointError) {
      }
    }
    return allVariables;
  } catch (error) {
    console.error("Error fetching variable list:", error);
    throw error;
  }
}

// Función para obtener datos de una variable específica (API v3)
export async function fetchVariableData(
  idVariable: number,
  fromDate: Date,
  toDate: Date
): Promise<any[]> {
  try {
    const desde = fromDate.toISOString().split('T')[0];
    const hasta = toDate.toISOString().split('T')[0];
    
    // La API v3 usa /Monetarias/{idVariable} con parámetros desde/hasta
    const url = `${API_BASE}/Monetarias/${idVariable}?limit=${API_LIMIT}&desde=${desde}&hasta=${hasta}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // La respuesta tiene estructura: {status, metadata, results}
    if (data.status === 200 && data.results && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.warn('⚠️ Respuesta de API no tiene el formato esperado:', data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching variable data:", error);
    throw error;
  }
}

// Mantener funciones antiguas para compatibilidad
export const fetchVariables = fetchVariableList;
export const fetchSeriesById = fetchVariableData;
