"use client";

import { useState, useEffect, useMemo } from "react";
import { Upload, Database, Trash2, RefreshCw, Download } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { Filters } from "@/components/search/Filters";
import { ResultsGrid } from "@/components/search/ResultsGrid";
import { ProductTable } from "@/components/search/ProductTable";
import { ViewToggle } from "@/components/search/ViewToggle";
import { CsvUpload } from "@/components/upload/CsvUpload";
import { ProductDetailsModal } from "@/components/product/ProductDetailsModal";
import { searchProducts } from "@/lib/search";
import {
  loadProductsFromStorage,
  clearProductsFromStorage,
  getStorageInfo,
  saveProductsToStorage,
} from "@/lib/localStorage";
import type { Product, SearchFilters } from "@/types/product";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [view, setView] = useState<"grid" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [storedFilename, setStoredFilename] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    vendor: "",
    productType: "",
    priceRange: { min: 0, max: 1000 },
    inStock: false,
  });
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "name" | "date" | "date-asc"
  >("name");

  // Adjust items per page based on view
  useEffect(() => {
    if (view === "grid") {
      setItemsPerPage(24);
    } else {
      setItemsPerPage(25);
    }
    setCurrentPage(1);
  }, [view]);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  useEffect(() => {
    const loadStoredData = () => {
      setLoading(true);
      try {
        const storedData = loadProductsFromStorage();
        if (storedData && storedData.products.length > 0) {
          console.log("Loading products from localStorage...");
          setProducts(storedData.products);
          setStoredFilename(storedData.filename || "");
          setHasData(true);
          setShowSuccessMessage(true);

          const prices = storedData.products
            .map((p) => p.priceRange?.minVariantPrice.amount || 0)
            .filter((price) => price > 0);

          if (prices.length > 0) {
            const maxPrice = Math.max(...prices);
            setFilters((prev) => ({
              ...prev,
              priceRange: { min: 0, max: Math.ceil(maxPrice) },
            }));
          }
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  const handleCsvDataLoaded = (csvProducts: Product[], filename?: string) => {
    console.log("Loading CSV products:", csvProducts.length);
    setProducts(csvProducts);
    setStoredFilename(filename || "");
    setHasData(true);
    setShowSuccessMessage(true);
    setLoading(false);
    setCurrentPage(1);

    const prices = csvProducts
      .map((p) => p.priceRange?.minVariantPrice.amount || 0)
      .filter((price) => price > 0);

    if (prices.length > 0) {
      const maxPrice = Math.max(...prices);
      setFilters((prev) => ({
        ...prev,
        priceRange: { min: 0, max: Math.ceil(maxPrice) },
      }));
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all stored data? This action cannot be undone."
      )
    ) {
      clearProductsFromStorage();
      setProducts([]);
      setHasData(false);
      setStoredFilename("");
      setFilters({
        vendor: "",
        productType: "",
        priceRange: { min: 0, max: 1000 },
        inStock: false,
      });
    }
  };

  const handleRefreshData = () => {
    setLoading(true);
    if (products.length > 0) {
      saveProductsToStorage(products, storedFilename);
    }
    setTimeout(() => setLoading(false), 500);
  };

  const downloadSampleCSV = () => {
    const sampleCSV = `ID,TITLE,STATUS,IMAGE,VENDOR,PRODUCT_TYPE,DESCRIPTION,PRICE_RANGE,TOTAL_INVENTORY,HAS_OUT_OF_STOCK_VARIANTS,CREATED_AT,MODIFIED_AT,TAGS
8121622593775,Sample Product,ACTIVE,https://example.com/image1.jpg,Thorne,Stress Tablets,"Helps with stress and anxiety","{'max_variant_price': 18.55, 'min_variant_price': 18.55}",10,FALSE,2023-09-25 15:52:45.000 Z,2025-03-21 13:10:43.000 Z,"sample,product,tags"
8121622626543,Another Sample Product,ACTIVE,https://example.com/image2.jpg,Nordic Naturals,Vitamins & Supplements,"High-quality vitamins for daily nutrition","{'max_variant_price': 18.55, 'min_variant_price': 18.55}",25,FALSE,2023-10-15 10:30:22.000 Z,2025-03-21 13:10:43.000 Z,"vitamins,health,supplements"
8121622659311,Out of Stock Product,ARCHIVED,https://example.com/image3.jpg,Thorne,Minerals,"Essential minerals for body function","{'max_variant_price': 18.55, 'min_variant_price': 18.55}",0,TRUE,2023-11-05 08:15:33.000 Z,2025-03-21 13:10:43.000 Z,"minerals,health"`;

    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-products.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredProducts = useMemo(() => {
    return searchProducts(products, searchQuery, filters, sortBy);
  }, [products, searchQuery, filters, sortBy]);

  const vendors = useMemo(() => {
    return [
      ...new Set(products.map((p) => p.vendor).filter(Boolean)),
    ].sort() as string[];
  }, [products]);

  const productTypes = useMemo(() => {
    return [
      ...new Set(products.map((p) => p.productType).filter(Boolean)),
    ].sort() as string[];
  }, [products]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const storageInfo = getStorageInfo();

  // Show welcome screen if no data is loaded
  if (!hasData && !loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-8">
            <div className="max-w-md mx-auto">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Product Search Application
              </h1>
              <p className="text-gray-600 mb-8">
                Upload your CSV file to start searching and analyzing your
                product data.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-3 mx-auto"
                >
                  <Upload className="h-5 w-5" />
                  Upload CSV File
                </button>

                <button
                  onClick={downloadSampleCSV}
                  className="border border-gray-300 text-gray-700 bg-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-3 mx-auto transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download Sample CSV Template
                </button>
              </div>

              {storageInfo.hasData && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Previous Data Found</p>
                      <p className="text-xs">
                        {storageInfo.productCount} products from{" "}
                        {storageInfo.filename || "previous upload"}
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-xs text-amber-700 hover:text-amber-900 underline"
                      >
                        Load previous data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {showUpload && (
          <CsvUpload
            onDataLoaded={handleCsvDataLoaded}
            onClose={() => setShowUpload(false)}
          />
        )}
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
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload New CSV
              </button>
            </div>
          </div>

          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700 font-medium">
                  CSV data loaded successfully ({products.length} products)
                </span>
                <span className="text-xs text-green-600 ml-auto flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  {vendors.length} vendors • {productTypes.length} product types
                  • Stored in browser
                </span>
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
                placeholder="Search by product name, vendor...."
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

          <main className="flex-1">
            {view === "table" ? (
              <ProductTable
                products={filteredProducts}
                loading={false}
                searchQuery={searchQuery}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onProductClick={handleProductClick}
              />
            ) : (
              <ResultsGrid
                products={filteredProducts}
                loading={false}
                searchQuery={searchQuery}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                onProductClick={handleProductClick}
              />
            )}
          </main>
        </div>
      </div>

      {showUpload && (
        <CsvUpload
          onDataLoaded={handleCsvDataLoaded}
          onClose={() => setShowUpload(false)}
        />
      )}

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
