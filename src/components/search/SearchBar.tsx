"use client";

import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSortChange: (
    sort: "relevance" | "price-asc" | "price-desc" | "name" | "date"
  ) => void;
  sortBy: string;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSortChange,
  sortBy,
  placeholder,
}: SearchBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "name", label: "Name A-Z" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "date", label: "Newest First" },
  ];

  const currentSort = sortOptions.find((option) => option.value === sortBy);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 h-12 px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-12 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center gap-2"
        >
          <span className="text-sm text-black">
            Sort by: {currentSort?.label}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value as any);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  sortBy === option.value
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
