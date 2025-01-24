"use client";

import React from "react";

interface MultiSelectProps {
  id?: string;
  value: string[];
  options: { value: string; label: string }[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  value,
  options,
  onChange,
  placeholder = "Select options...",
}) => {
  const toggleSelection = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-gray-600">
        {placeholder}
      </label>
      <div className="border border-gray-300 rounded-md p-2">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer px-3 py-1 rounded-md text-sm ${
                value.includes(option.value)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => toggleSelection(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
