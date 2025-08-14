/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',  
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base brand colors
        primary: {
          DEFAULT: '#B71C1C', // rojo granate principal
          dark: '#7F0000',    // para hover o estados activos
          light: '#E53935',   // para resaltar sin saturar
        },
        secondary: {
          DEFAULT: '#000000', // negro puro
          dark: '#121212',    // gris casi negro para fondos
          light: '#333333',   // gris oscuro para bordes o textos secundarios
        },

        // Apoyos y acentos
        accent: {
          gold: '#FFC107',    // para destacar KPIs positivos o datos clave
          teal: '#009688',    // acento fresco para contraste en gráficos o links
          orange: '#FF9800',  // para alertas o variaciones importantes
        },

        // Fondo y superficies
        background: {
          light: '#FAFAFA',   // fondo principal claro
          card: '#FFFFFF',    // fondo de tarjetas
        },

        // Texto
        text: {
          primary: '#000000', // texto principal
          secondary: '#4A4A4A', // texto gris medio
        },

        // Estados
        success: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        warning: {
          DEFAULT: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        error: {
          DEFAULT: '#D32F2F',
          light: '#E57373',
          dark: '#B71C1C',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
