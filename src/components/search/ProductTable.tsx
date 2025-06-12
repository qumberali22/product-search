"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Package, Tag, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import { getProductImage, getProductImageAlt } from "@/lib/productImages";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onProductClick: (product: Product) => void;
}

const COLUMNS = [
  { key: "product", label: "Product", width: "320px" },
  { key: "title", label: "Title", width: "200px" }, // New column added here
  { key: "vendor", label: "Vendor", width: "120px" },
  { key: "type", label: "Type", width: "160px" },
  { key: "minPrice", label: "Min Price", width: "100px" },
  { key: "maxPrice", label: "Max Price", width: "100px" },
  { key: "stock", label: "Stock", width: "140px" },
  { key: "tags", label: "Tags", width: "180px" },
  { key: "created", label: "Created", width: "120px" },
  { key: "actions", label: "Actions", width: "80px" },
] as const;

const STOCK_STATUS = {
  OUT_OF_STOCK: {
    text: "Out of Stock",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  LOW_STOCK: {
    text: "Low Stock",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  IN_STOCK: {
    text: "In Stock",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
} as const;

const STYLES = {
  tableHeader:
    "px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tableCell: "px-4 py-4",
  skeletonBase: "animate-pulse bg-gray-300 rounded",
  buttonBase:
    "inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50",
  tagBase: "inline-flex items-center px-2 py-1 rounded-full text-xs",
} as const;

export function ProductTable({
  products,
  loading,
  searchQuery,
  currentPage,
  itemsPerPage,
  onPageChange,
  onProductClick,
}: ProductTableProps) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);

  // Handle initial load and data readiness
  useEffect(() => {
    if (products.length > 0 && !loading) {
      const timer = setTimeout(() => {
        setIsDataReady(true);
        setIsInitialLoad(false);
      }, 100);
      return () => clearTimeout(timer);
    } else if (loading) {
      setIsDataReady(false);
    }
  }, [products, loading]);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setIsInitialLoad(false);
    }
  }, [searchQuery]);

  const formatMinPrice = (product: Product) => {
    if (!product.priceRange) return "N/A";
    const { minVariantPrice } = product.priceRange;
    const symbol = minVariantPrice.currencyCode === "GBP" ? "£" : "$";
    return `${symbol}${minVariantPrice.amount.toFixed(2)}`;
  };

  const formatMaxPrice = (product: Product) => {
    if (!product.priceRange) return "N/A";
    const { maxVariantPrice } = product.priceRange;
    const symbol = maxVariantPrice.currencyCode === "GBP" ? "£" : "$";
    return `${symbol}${maxVariantPrice.amount.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStockStatus = (product: Product) => {
    const inventory = product.totalInventory || 0;
    const hasOutOfStock = product.hasOutOfStockVariants;

    if (inventory === 0 || hasOutOfStock) return STOCK_STATUS.OUT_OF_STOCK;
    if (inventory < 10) return STOCK_STATUS.LOW_STOCK;
    return STOCK_STATUS.IN_STOCK;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const getPaginationNumbers = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return Array.from({ length: maxVisible }, (_, i) => i + 1);
    }

    if (currentPage >= totalPages - 2) {
      return Array.from(
        { length: maxVisible },
        (_, i) => totalPages - maxVisible + 1 + i
      );
    }

    return Array.from({ length: maxVisible }, (_, i) => currentPage - 2 + i);
  };

  const createSkeleton = (className: string, width?: string) => (
    <div
      className={`${STYLES.skeletonBase} ${className}`}
      style={width ? { width } : {}}
    />
  );

  const TableHeader = () => (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {COLUMNS.map(({ key, label, width }) => (
          <th key={key} className={STYLES.tableHeader} style={{ width }}>
            {loading ? createSkeleton("h-4", "w-16") : label}
          </th>
        ))}
      </tr>
    </thead>
  );

  const SkeletonRow = ({ index }: { index: number }) => (
    <tr key={index} className="animate-pulse">
      <td className={STYLES.tableCell} style={{ width: COLUMNS[0].width }}>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 bg-gray-300 rounded-lg" />
          <div className="ml-3 space-y-2 flex-1">
            {createSkeleton("h-4", "w-3/4")}
            {createSkeleton("h-3", "w-1/2")}
          </div>
        </div>
      </td>
      {/* New Title column skeleton */}
      <td className={STYLES.tableCell} style={{ width: COLUMNS[1].width }}>
        {createSkeleton("h-4", "w-32")}
      </td>
      {COLUMNS.slice(2, -4).map(({ key, width }) => (
        <td key={key} className={STYLES.tableCell} style={{ width }}>
          {createSkeleton("h-4", "w-16")}
        </td>
      ))}
      {/* Min Price skeleton */}
      <td className={STYLES.tableCell} style={{ width: COLUMNS[4].width }}>
        {createSkeleton("h-4", "w-16")}
      </td>
      {/* Max Price skeleton */}
      <td className={STYLES.tableCell} style={{ width: COLUMNS[5].width }}>
        {createSkeleton("h-4", "w-16")}
      </td>
      {/* Stock skeleton */}
      <td className={STYLES.tableCell} style={{ width: COLUMNS[6].width }}>
        <div className="space-y-2">
          {createSkeleton("h-6 rounded-full", "w-20")}
          {createSkeleton("h-3", "w-12")}
        </div>
      </td>
      {/* Tags skeleton */}
      <td className={STYLES.tableCell} style={{ width: COLUMNS[7].width }}>
        <div className="flex gap-1">
          {createSkeleton("h-6 rounded-full", "w-16")}
          {createSkeleton("h-6 rounded-full", "w-16")}
        </div>
      </td>
      {/* Created skeleton */}
      <td className={STYLES.tableCell} style={{ width: COLUMNS[8].width }}>
        {createSkeleton("h-4", "w-16")}
      </td>
      {/* Actions skeleton */}
      <td className={STYLES.tableCell} style={{ width: COLUMNS[9].width }}>
        <div className="flex justify-center">
          {createSkeleton("h-8 w-8 rounded-full")}
        </div>
      </td>
    </tr>
  );

  const ProductRow = ({
    product,
    index,
  }: {
    product: Product;
    index: number;
  }) => {
    const stockStatus = getStockStatus(product);

    return (
      <tr
        key={product.id}
        className={`hover:bg-blue-50 cursor-pointer transition-colors ${
          index % 2 === 0 ? "bg-white" : "bg-gray-25"
        }`}
        onClick={() => onProductClick(product)}
      >
        <td className={STYLES.tableCell} style={{ width: COLUMNS[0].width }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12">
              <Image
                src={
                  getProductImage(product.id, product.title) ||
                  "/placeholder.svg"
                }
                alt={getProductImageAlt(product.title)}
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-product.png";
                }}
              />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <div
                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors leading-tight"
                title={product.title}
              >
                {truncateText(product.title, 35)}
              </div>
              <div
                className="text-xs text-gray-500 mt-1"
                title={product.handle}
              >
                {truncateText(product.handle, 40)}
              </div>
            </div>
          </div>
        </td>
        {/* New Title column */}
        <td className={STYLES.tableCell} style={{ width: COLUMNS[1].width }}>
          <div className="text-sm font-medium text-gray-900">
            {truncateText(product.title || "N/A", 25)}
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[2].width }}>
          <div className="text-sm font-medium text-gray-900">
            {truncateText(product.vendor || "Unknown", 15)}
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[3].width }}>
          <div className="text-sm text-gray-900">
            {truncateText(product.productType || "Uncategorized", 20)}
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[4].width }}>
          <div className="text-sm font-medium text-gray-900">
            {formatMinPrice(product)}
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[5].width }}>
          <div className="text-sm font-medium text-gray-900">
            {formatMaxPrice(product)}
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[6].width }}>
          <div className="flex flex-col space-y-1">
            <span
              className={`${STYLES.tagBase} font-medium w-fit ${stockStatus.bgColor} ${stockStatus.color}`}
            >
              {stockStatus.text}
            </span>
            <span className="text-xs text-gray-500">
              Qty: {product.totalInventory || 0}
            </span>
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[7].width }}>
          <div className="flex flex-wrap gap-1">
            {product.seoTags?.slice(0, 2).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className={`${STYLES.tagBase} bg-blue-100 text-blue-800`}
                title={tag}
              >
                <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate max-w-12">
                  {truncateText(tag, 6)}
                </span>
              </span>
            ))}
            {(product.seoTags?.length || 0) > 2 && (
              <span className="text-xs text-gray-500 px-1">
                +{(product.seoTags?.length || 0) - 2}
              </span>
            )}
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[8].width }}>
          <div className="text-sm text-gray-500">
            {formatDate(product.createdAt)}
          </div>
        </td>
        <td className={STYLES.tableCell} style={{ width: COLUMNS[9].width }}>
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">{createSkeleton("h-6", "w-48")}</div>
          <div className="animate-pulse">{createSkeleton("h-4", "w-32")}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: itemsPerPage || 10 }).map((_, i) => (
              <SkeletonRow key={i} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">{createSkeleton("h-4", "w-48")}</div>
          <div className="flex items-center space-x-2">
            <div className="animate-pulse">{createSkeleton("h-8", "w-20")}</div>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  {createSkeleton("h-8 w-8")}
                </div>
              ))}
            </div>
            <div className="animate-pulse">{createSkeleton("h-8", "w-16")}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading || !isDataReady) {
    return <LoadingSkeleton />;
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No products found</div>
          {searchQuery && (
            <p className="text-gray-400">
              Try adjusting your search terms or filters
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Products ({products.length.toLocaleString()} total)
          </h3>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of{" "}
            {products.length.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product, index) => (
              <ProductRow key={product.id} product={product} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages} •{" "}
              {products.length.toLocaleString()} total products
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${STYLES.buttonBase} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              <div className="flex space-x-1">
                {getPaginationNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${STYLES.buttonBase} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
