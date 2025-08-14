"use client";

import React from "react";

interface ComparisonModeToggleProps {
  compareFullMandate: boolean;
  setCompareFullMandate: (value: boolean) => void;
  currentMonth: number;
}

export function ComparisonModeToggle({
  compareFullMandate,
  setCompareFullMandate,
  currentMonth,
}: ComparisonModeToggleProps) {
  return (
    <div className="flex items-center space-x-3">
      <label className="flex items-center space-x-2 cursor-pointer flex-col gap-2">
        <span className="text-xs text-text-secondary font-medium">
          48 meses
        </span>
        <div className="relative items-center">
          <input
            type="checkbox"
            checked={compareFullMandate}
            onChange={(e) => setCompareFullMandate(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              compareFullMandate ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                compareFullMandate ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
      </label>
    </div>
  );
}
