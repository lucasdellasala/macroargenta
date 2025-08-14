# 🏛️ Macro Argenta - Comparador Macroeconómico

**Comparador de variables macroeconómicas del BCRA entre diferentes gobiernos argentinos con agrupación mensual por último dato del mes.**

## 🌟 Características Principales

### 📊 **Comparación Gubernamental**
- **CFK 2°** (2011-2015): Línea azul
- **Mauricio Macri** (2015-2019): Línea amarilla  
- **Alberto Fernández** (2019-2023): Línea verde selva
- **Javier Milei** (2023-actual): Línea violeta

### 📈 **Funcionalidades del Gráfico**
- **Comparación temporal**: Alineación de 48 meses por gobierno
- **Tooltip inteligente**: Muestra valor + porcentaje de cambio desde mes 1
- **Datos mensuales**: Último día de cada mes (considerando años bisiestos)
- **Responsive design**: Adaptable a móvil y desktop
- **Tema oscuro/claro**: Soporte para ambos modos

### 🔧 **Sistema de Cache**
- **Almacenamiento local**: Reduce llamadas a la API
- **Requests paralelos**: Datos de gobiernos obtenidos concurrentemente
- **Expiración automática**: Cache se renueva periódicamente
- **Performance optimizada**: Carga rápida de datos ya consultados

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Gráficos**: Recharts (LineChart)
- **Estilos**: Tailwind CSS con tema personalizado
- **API**: BCRA API v3 (Banco Central de la República Argentina)
- **Estado**: React Hooks (useState, useEffect, useMemo)
- **Deploy**: Vercel (optimizado para producción)

## 📋 Variables Macroeconómicas Disponibles

### **Reservas Internacionales**
- **ID BCRA**: 17
- **Descripción**: Reservas internacionales brutas del BCRA
- **Unidad**: Millones de USD
- **Tipo**: Valor absoluto

### **Base Monetaria**
- **ID BCRA**: 15
- **Descripción**: Base monetaria total
- **Unidad**: Millones de pesos
- **Tipo**: Valor absoluto

### **M2 Privado**
- **ID BCRA**: 16
- **Descripción**: M2 privado, variación interanual
- **Unidad**: Porcentaje
- **Tipo**: Variación porcentual

## 🎯 Metodología

### **Agrupación de Datos**
- **Frecuencia**: Mensual (último día de cada mes)
- **Período**: 48 meses por gobierno (4 años)
- **Alineación**: Mes 1 de cada gobierno se alinea para comparación
- **Fuente**: API oficial del BCRA

### **Cálculo de Porcentajes**
- **Referencia**: Mes 1 de cada gobierno = 0%
- **Fórmula**: `((valor_actual - valor_inicial) / valor_inicial) * 100`
- **Formato**: Tooltip muestra valor + (porcentaje)

### **Manejo de Fechas**
- **JM (Milei)**: Fecha final dinámica (último día del mes anterior)
- **Otros gobiernos**: Períodos fijos históricos
- **Años bisiestos**: Considerados automáticamente

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   ├── MacroBcraComparatorV2.tsx    # Componente principal
│   ├── charts/
│   │   └── MacroChart.tsx            # Gráfico con Recharts
│   └── ui/
│       ├── GovernmentFilter.tsx      # Filtro de gobiernos
│       └── Spinner.tsx               # Indicador de carga
├── services/
│   └── bcraApi.ts                    # Integración con API BCRA
├── utils/
│   ├── dataProcessing.ts             # Procesamiento de datos
│   ├── cacheUtils.ts                 # Sistema de cache
│   ├── governmentUtils.ts            # Utilidades de gobiernos
│   ├── dateUtils.ts                  # Utilidades de fechas
│   └── numberUtils.ts                # Formateo de números
├── types/
│   └── bcra.ts                       # Tipos TypeScript
├── constants/
│   └── bcra.ts                       # Constantes del sistema
└── contexts/
    └── ThemeContext.tsx              # Contexto de tema
```

## 🔌 API BCRA

### **Endpoints Utilizados**
- **Lista de Variables**: `/api/estadistica/variables`
- **Datos de Variable**: `/api/estadistica/{idVariable}`

### **Parámetros de Consulta**
- **Rango de fechas**: Desde inicio hasta fin de cada gobierno
- **Filtros**: Solo gobiernos seleccionados por el usuario
- **Cache**: Datos almacenados localmente para mejor performance

## 🎨 Personalización

### **Colores de Líneas**
```typescript
const lineColors = {
  CFK2: "#0000FF",    // Azul
  MACRI: "#FFDB00",   // Amarillo
  AF: "#29AB87",      // Verde selva
  JM: "#9400D3",      // Violeta
};
```

### **Tema Responsive**
- **Desktop**: Altura 400px, márgenes optimizados
- **Móvil**: Altura 300px, etiquetas adaptadas
- **Breakpoint**: 640px para cambio de layout

## 🚀 Instalación y Desarrollo

### **Requisitos**
- Node.js 18+ 
- npm o yarn
- Git

### **Pasos de Instalación**
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/macro-argenta.git
cd macro-argenta

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

### **Variables de Entorno**
```env
# .env.local
NEXT_PUBLIC_BCRA_API_URL=https://api.bcra.gob.ar
NEXT_PUBLIC_BCRA_API_KEY=tu-api-key
```

## 📱 Uso de la Aplicación

### **1. Selección de Variable**
- Elegir variable macroeconómica del dropdown
- Las opciones incluyen: Reservas, Base Monetaria, M2 Privado

### **2. Filtro de Gobiernos**
- Seleccionar/deseleccionar gobiernos a comparar
- Mínimo 1 gobierno debe estar seleccionado

### **3. Visualización**
- **Gráfico**: Líneas comparativas por gobierno
- **Tooltip**: Hover para ver valores y porcentajes
- **Leyenda**: Identificación de colores y gobiernos

### **4. Análisis de Datos**
- **Comparación temporal**: Mes 1 alineado entre gobiernos
- **Tendencias**: Visualización de evolución macroeconómica
- **Porcentajes**: Cambio relativo desde inicio de cada gobierno

## 🔧 Configuración Avanzada

### **Modificar Períodos de Gobierno**
```typescript
// src/utils/governmentUtils.ts
export function getGovernmentPeriods() {
  return [
    { key: 'CFK2', from: new Date(2011, 11, 1), to: new Date(2015, 10, 30) },
    { key: 'MACRI', from: new Date(2015, 11, 1), to: new Date(2019, 10, 30) },
    { key: 'AF', from: new Date(2019, 11, 1), to: new Date(2023, 10, 30) },
    { key: 'JM', from: new Date(2023, 11, 1), to: getLastMonthEndDate() }
  ];
}
```

### **Agregar Nuevas Variables**
```typescript
// src/constants/bcra.ts
export const VARIABLES: VariableConfig[] = [
  {
    key: "nueva_variable",
    label: "Nueva Variable",
    pattern: /nueva_variable/i,
    units: "unidad",
    yAxisLabel: "Etiqueta Eje Y",
    xAxisLabel: "Etiqueta Eje X",
    isPercentage: false,
    numberFormat: "number",
    decimalPlaces: 2,
    cacheKey: "nueva_variable_cache",
    cacheExpirationDays: 7
  }
];
```

## 🚀 Deploy en Vercel

### **Configuración Automática**
1. **Conectar repositorio** en Vercel
2. **Framework**: Next.js (detectado automáticamente)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### **Variables de Entorno en Vercel**
- Configurar `NEXT_PUBLIC_BCRA_API_KEY` en dashboard
- Deploy automático en cada push a main

## 📊 Performance y Optimización

### **Estrategias Implementadas**
- **Cache local**: Reduce llamadas a API
- **Requests paralelos**: Datos obtenidos concurrentemente
- **Lazy loading**: Componentes cargados bajo demanda
- **Memoización**: Cálculos optimizados con useMemo

### **Métricas de Performance**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle size**: < 500KB (gzipped)

## 🤝 Contribución

### **Guidelines**
1. **Fork** el repositorio
2. **Crear branch** para feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Add nueva funcionalidad'`
4. **Push** al branch: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### **Estándares de Código**
- **TypeScript**: Tipado estricto
- **ESLint**: Linting automático
- **Prettier**: Formateo de código
- **Commits**: Convención convencional

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **BCRA**: Por proporcionar la API oficial de datos macroeconómicos
- **Recharts**: Por la excelente librería de gráficos
- **Next.js**: Por el framework robusto y optimizado
- **Comunidad**: Por el feedback y contribuciones

## 📞 Contacto

- **Proyecto**: [GitHub Issues](https://github.com/tu-usuario/macro-argenta/issues)
- **Desarrollador**: [Tu Nombre](mailto:tu-email@ejemplo.com)
- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/macro-argenta/wiki)

---

**Macro Argenta** - Comparando la evolución macroeconómica de Argentina, gobierno a gobierno 📈🇦🇷
