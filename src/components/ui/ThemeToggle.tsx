"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { isDark, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-background-card dark:bg-background-card-dark border border-secondary-light/20 dark:border-secondary-light/30 text-text-primary dark:text-text-primary-dark hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10 transition-colors"
      aria-label="Cambiar tema"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
