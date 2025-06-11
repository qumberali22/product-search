"use client";

import { Filter, X } from "lucide-react";
import type { SearchFilters } from "@/types/product";

interface FiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  vendors: string[];
  productTypes: string[];
}

export function Filters({
  filters,
  onFiltersChange,
  vendors,
  productTypes,
}: FiltersProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      vendor: "",
      productType: "",
      priceRange: { min: 0, max: 1000 },
      inStock: false,
    });
  };

  const hasActiveFilters =
    filters.vendor ||
    filters.productType ||
    filters.inStock ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <Filter className="h-4 w-4" />
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">
            Vendor
          </label>
          <select
            value={filters.vendor}
            onChange={(e) => updateFilter("vendor", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">
            Product Type
          </label>
          <select
            value={filters.productType}
            onChange={(e) => updateFilter("productType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All types</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-4 block text-gray-700">
            Price Range: ${filters.priceRange.min} - ${filters.priceRange.max}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={filters.priceRange.min}
              onChange={(e) =>
                updateFilter("priceRange", {
                  min: Number.parseInt(e.target.value),
                  max: filters.priceRange.max,
                })
              }
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={filters.priceRange.max}
              onChange={(e) =>
                updateFilter("priceRange", {
                  min: filters.priceRange.min,
                  max: Number.parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="inStock"
            checked={filters.inStock}
            onChange={(e) => updateFilter("inStock", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium text-gray-700"
          >
            In stock only
          </label>
        </div>
      </div>
    </div>
  );
}
