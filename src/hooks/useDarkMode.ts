"use client";

import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar preferencia guardada
    const storedPreference = localStorage.getItem("darkMode");
    
    if (storedPreference !== null) {
      const value = storedPreference === "true";
      setIsDark(value);
    } else {
      // Verificar preferencia del sistema
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    // Aplicar clase al documento
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Guardar preferencia
    localStorage.setItem("darkMode", isDark.toString());
  }, [isDark]);

  const toggleDarkMode = () => {
    const newValue = !isDark;
    setIsDark(newValue);
  };

  return { isDark, toggleDarkMode };
}
