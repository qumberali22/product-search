"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, X, Search, ChevronDown, ChevronUp } from "lucide-react";
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
  const [vendorSearch, setVendorSearch] = useState("");
  const [productTypeSearch, setProductTypeSearch] = useState("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);

  const vendorDropdownRef = useRef<HTMLDivElement>(null);
  const productTypeDropdownRef = useRef<HTMLDivElement>(null);

  const updateFilter = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      vendor: "",
      productType: "",
      priceRange: { min: 0, max: 1000 },
      inStock: false,
    });
    setVendorSearch("");
    setProductTypeSearch("");
  };

  const hasActiveFilters =
    filters.vendor ||
    filters.productType ||
    filters.inStock ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000;

  const filteredVendors = vendors.filter((vendor) =>
    vendor.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const filteredProductTypes = productTypes.filter((type) =>
    type.toLowerCase().includes(productTypeSearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        vendorDropdownRef.current &&
        !vendorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowVendorDropdown(false);
      }
      if (
        productTypeDropdownRef.current &&
        !productTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProductTypeDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        {/* Vendor Filter with Search */}
        <div ref={vendorDropdownRef} className="relative">
          <label className="text-sm font-medium mb-2 block text-gray-700">
            Vendor
          </label>
          <button
            onClick={() => setShowVendorDropdown(!showVendorDropdown)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
          >
            <span className="text-sm truncate text-gray-900">
              {filters.vendor || "All vendors"}
            </span>
            {showVendorDropdown ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showVendorDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search vendors..."
                    className="w-full pl-8 pr-2 py-1.5 text-black text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    updateFilter("vendor", "");
                    setShowVendorDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    !filters.vendor
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-900"
                  }`}
                >
                  All vendors
                </button>

                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <button
                      key={vendor}
                      onClick={() => {
                        updateFilter("vendor", vendor);
                        setShowVendorDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        filters.vendor === vendor
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      {vendor}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No vendors found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Type Filter with Search */}
        <div ref={productTypeDropdownRef} className="relative">
          <label className="text-sm font-medium mb-2 block text-gray-700">
            Product Type
          </label>
          <button
            onClick={() => setShowProductTypeDropdown(!showProductTypeDropdown)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
          >
            <span className="text-sm truncate text-gray-900">
              {filters.productType || "All types"}
            </span>
            {showProductTypeDropdown ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showProductTypeDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={productTypeSearch}
                    onChange={(e) => setProductTypeSearch(e.target.value)}
                    placeholder="Search product types..."
                    className="w-full pl-8 pr-2 py-1.5 text-black text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    updateFilter("productType", "");
                    setShowProductTypeDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    !filters.productType
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-900"
                  }`}
                >
                  All types
                </button>

                {filteredProductTypes.length > 0 ? (
                  filteredProductTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        updateFilter("productType", type);
                        setShowProductTypeDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        filters.productType === type
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      {type}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No product types found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
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

        {/* In Stock Filter */}
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
