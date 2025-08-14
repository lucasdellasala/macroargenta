"use client";

import React from "react";
import { Government } from "@/types/bcra";
import { toggleGovSelection } from "@/utils/dataProcessing";

interface GovernmentFilterProps {
  governments: Government[];
  selectedGovs: Set<string>;
  setSelectedGovs: (govs: Set<string>) => void;
}

export function GovernmentFilter({ 
  governments, 
  selectedGovs, 
  setSelectedGovs 
}: GovernmentFilterProps) {
  return (
    <div className="col-span-3">
      <label className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2 block">
        Gobiernos a visualizar:
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {governments.map((gov) => (
          <label
            key={gov.key}
            className="flex items-center gap-2 cursor-pointer hover:bg-background-light/50 dark:hover:bg-background-dark/50 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedGovs.has(gov.key)}
              onChange={() => toggleGovSelection(gov.key, selectedGovs, setSelectedGovs)}
              className="w-4 h-4 text-primary bg-background-card dark:bg-background-card-dark border-secondary-light/20 dark:border-secondary-light/30 rounded focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-card dark:focus:ring-offset-background-card-dark"
            />
            <span className="text-sm text-text-primary dark:text-text-primary-dark">{gov.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
