"use client";

import { useState, useEffect, useMemo } from "react";
import { Upload } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { Filters } from "@/components/search/Filters";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { ProductTable } from "@/components/search/ProductTable";
import { ViewToggle } from "@/components/search/ViewToggle";
// import { PaginationControls } from "@/components/search/PaginationControls";
// import { CsvUpload } from "@/components/upload/CsvUpload";
import { loadProducts } from "@/lib/data";
import { searchProducts } from "@/lib/search";
import type { Product, SearchFilters } from "@/types/product";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [dataSource, setDataSource] = useState<"sample" | "uploaded">("sample");
  const [view, setView] = useState<"grid" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [filters, setFilters] = useState<SearchFilters>({
    vendor: "",
    productType: "",
    priceRange: { min: 0, max: 1000 },
    inStock: false,
  });
  const [sortBy, setSortBy] = useState<
    "relevance" | "price-asc" | "price-desc" | "name" | "date"
  >("relevance");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await loadProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dataSource === "sample") {
      fetchProducts();
    }
  }, [dataSource]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  const handleCsvDataLoaded = (csvProducts: Product[]) => {
    setProducts(csvProducts);
    setDataSource("uploaded");
    setLoading(false);
    setCurrentPage(1);
    setFilters({
      vendor: "",
      productType: "",
      priceRange: { min: 0, max: 1000 },
      inStock: false,
    });
  };

  const filteredProducts = useMemo(() => {
    return searchProducts(products, searchQuery, filters, sortBy);
  }, [products, searchQuery, filters, sortBy]);

  const vendors = useMemo(() => {
    return [
      ...new Set(
        products.map((p) => p.vendor).filter((v): v is string => Boolean(v))
      ),
    ];
  }, [products]);

  const productTypes = useMemo(() => {
    return [
      ...new Set(
        products
          .map((p) => p.productType)
          .filter((t): t is string => Boolean(t))
      ),
    ];
  }, [products]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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

          {dataSource === "uploaded" && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700 font-medium">
                  Using uploaded CSV data ({products.length} products)
                </span>
                <button
                  onClick={() => {
                    setDataSource("sample");
                    setProducts([]);
                    setLoading(true);
                  }}
                  className="text-xs text-green-600 hover:underline ml-auto"
                >
                  Switch to sample data
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSortChange={setSortBy}
                sortBy={sortBy}
                placeholder="Search by product name, vendor, or description..."
              />
            </div>
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              vendors={vendors}
              productTypes={productTypes}
            />
          </aside>

          <main className="flex-1 min-h-[calc(120vh-300px)]">
            {view === "table" ? (
              <ProductTable
                products={filteredProducts}
                loading={false}
                searchQuery={searchQuery}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            ) : (
              <>
                <ResultsGrid
                  products={filteredProducts.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )}
                  loading={false}
                  searchQuery={searchQuery}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
