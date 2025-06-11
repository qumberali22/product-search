"use client";

import { useState, useEffect, useMemo } from "react";
import { Upload } from "lucide-react";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { ProductCard } from "@/components/search/ProductCard";
import type { Product } from "@/types/product";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [dataSource] = useState<"sample" | "uploaded">("sample");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    vendor: "all",
    productType: "all",
    priceRange: [0, 1000],
  });

  // Demo data
  const demoProducts: Product[] = [
    {
      id: "1",
      title: "Craving and Stress Support",
      handle: "craving-stress-support",
      vendor: "Thorne",
      productType: "Stress Tablets",
      status: "ACTIVE",
      description: "Reduces stress, improves sleep quality, Keeps your...",
      priceRange: {
        minVariantPrice: { amount: 18.55, currencyCode: "USD" },
        maxVariantPrice: { amount: 18.55, currencyCode: "USD" },
      },
    },
    {
      id: "2",
      title: "PharmaGABA-100",
      handle: "pharmagaba-100",
      vendor: "Thorne",
      productType: "Vitamins & Supplements",
      status: "ACTIVE",
      description:
        "Clinical studies have shown that PharmaGABA can reduce stress...",
      priceRange: {
        minVariantPrice: { amount: 24.49, currencyCode: "USD" },
        maxVariantPrice: { amount: 24.49, currencyCode: "USD" },
      },
    },
    {
      id: "3",
      title: "Omega-3 Fish Oil",
      handle: "omega-3-fish-oil",
      vendor: "Nordic Naturals",
      productType: "Vitamins & Supplements",
      status: "ACTIVE",
      description:
        "High-quality omega-3 fatty acids for heart and brain health. Sourced...",
      priceRange: {
        minVariantPrice: { amount: 32.99, currencyCode: "USD" },
        maxVariantPrice: { amount: 32.99, currencyCode: "USD" },
      },
    },
    {
      id: "4",
      title: "Vitamin D3 + K2",
      handle: "vitamin-d3-k2",
      vendor: "Pure Encapsulations",
      productType: "Vitamins & Supplements",
      status: "ACTIVE",
      description:
        "Supports bone health and immune function with optimal D3 and K2 ratio",
      priceRange: {
        minVariantPrice: { amount: 22.75, currencyCode: "USD" },
        maxVariantPrice: { amount: 22.75, currencyCode: "USD" },
      },
    },
    {
      id: "5",
      title: "Magnesium Glycinate",
      handle: "magnesium-glycinate",
      vendor: "NOW Foods",
      productType: "Minerals",
      status: "ARCHIVED",
      description:
        "Highly absorbable form of magnesium for relaxation and muscle support",
      priceRange: {
        minVariantPrice: { amount: 15.99, currencyCode: "USD" },
        maxVariantPrice: { amount: 15.99, currencyCode: "USD" },
      },
    },
    {
      id: "6",
      title: "Probiotic 10",
      handle: "probiotic-10",
      vendor: "Garden of Life",
      productType: "Probiotics",
      status: "ACTIVE",
      description:
        "10 probiotic strains for digestive and immune system support",
      priceRange: {
        minVariantPrice: { amount: 29.95, currencyCode: "USD" },
        maxVariantPrice: { amount: 29.95, currencyCode: "USD" },
      },
    },
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchProducts = async () => {
      try {
        setTimeout(() => {
          setProducts(demoProducts);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to load products:", error);
        setLoading(false);
      }
    };

    if (dataSource === "sample") {
      fetchProducts();
    }
  }, [dataSource]);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false) ||
        (product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);

      // Vendor filter
      const matchesVendor =
        filters.vendor === "all" || product.vendor === filters.vendor;

      // Product type filter
      const matchesProductType =
        filters.productType === "all" ||
        product.productType === filters.productType;

      // Price range filter
      const matchesPriceRange =
        (product.priceRange?.minVariantPrice?.amount ?? 0) >=
          filters.priceRange[0] &&
        (product.priceRange?.maxVariantPrice?.amount ?? 0) <=
          filters.priceRange[1];

      return (
        matchesSearch &&
        matchesVendor &&
        matchesProductType &&
        matchesPriceRange
      );
    });
  }, [products, searchQuery, filters]);

  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  // Get unique vendors and categories for filters
  const vendors = Array.from(
    new Set(products.map((p) => p.vendor).filter(Boolean))
  );
  const productTypes = Array.from(
    new Set(products.map((p) => p.productType).filter(Boolean))
  );

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Search
              </h1>
              <p className="text-gray-600">
                Find the perfect products from our extensive catalog
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload CSV
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, vendor, or description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1 text-sm rounded-md ${
                  view === "grid"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1 text-sm rounded-md ${
                  view === "table"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h3 className="font-medium mb-3">Filters</h3>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Vendor</h4>
                <select
                  value={filters.vendor}
                  onChange={(e) =>
                    setFilters({ ...filters, vendor: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All vendors</option>
                  {vendors.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Product Type</h4>
                <select
                  value={filters.productType}
                  onChange={(e) =>
                    setFilters({ ...filters, productType: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All types</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [0, parseInt(e.target.value)],
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {view === "table" ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product: any) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.vendor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.productType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          $
                          {product.priceRange?.minVariantPrice?.amount.toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ResultsGrid
                products={filteredProducts}
                loading={loading}
                searchQuery={searchQuery}
              />
            )}
          </main>
        </div>
      </div>

      {/* Simple modal for CSV upload - would need proper implementation */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Upload CSV</h3>
            <p className="text-sm text-gray-600 mb-4">
              This feature is not implemented yet in this demo.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUpload(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
