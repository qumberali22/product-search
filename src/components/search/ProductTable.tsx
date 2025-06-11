"use client";

import Image from "next/image";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// Table Header Component
const TableHeader = () => {
  const headers = [
    "Product",
    "Vendor",
    "Type",
    "Price",
    "Stock",
    "Status",
    "Created",
    "Actions",
  ];

  return (
    <thead className="bg-gray-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

// Product Cell Component
const ProductCell = ({ product }: { product: Product }) => {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-12 w-12">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage}
            alt={product.title}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No img</span>
          </div>
        )}
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
          {product.title}
        </div>
        <div className="text-sm text-gray-500 max-w-xs truncate">
          ID: {product.id}
        </div>
      </div>
    </div>
  );
};

// Text Cell Component
const TextCell = ({
  value,
  className = "",
}: {
  value: string | undefined;
  className?: string;
}) => (
  <div className={`text-sm text-gray-900 ${className}`}>{value || "N/A"}</div>
);

// Price Cell Component
const PriceCell = ({ product }: { product: Product }) => {
  const formatPrice = (product: Product) => {
    if (!product.priceRange) return "N/A";
    const min = product.priceRange.minVariantPrice.amount;
    const max = product.priceRange.maxVariantPrice.amount;
    const currency = product.priceRange.minVariantPrice.currencyCode;

    if (min === max) {
      return `$${min.toFixed(2)} ${currency}`;
    }
    return `$${min.toFixed(2)} - $${max.toFixed(2)} ${currency}`;
  };

  return (
    <div className="text-sm font-medium text-gray-900">
      {formatPrice(product)}
    </div>
  );
};

// Stock Cell Component
const StockCell = ({ product }: { product: Product }) => {
  const getStockStatus = (product: Product) => {
    if (product.totalInventory === 0 || product.hasOutOfStockVariants) {
      return { text: "Out of Stock", color: "text-red-600" };
    }
    if ((product.totalInventory || 0) < 10) {
      return { text: "Low Stock", color: "text-yellow-600" };
    }
    return { text: "In Stock", color: "text-green-600" };
  };

  const stockStatus = getStockStatus(product);

  return (
    <div className="flex flex-col">
      <span className={`text-sm font-medium ${stockStatus.color}`}>
        {stockStatus.text}
      </span>
      <span className="text-xs text-gray-500">
        Qty: {product.totalInventory || 0}
      </span>
    </div>
  );
};

// Status Cell Component
const StatusCell = ({ status }: { status: string }) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      ACTIVE: "bg-green-100 text-green-800",
      ARCHIVED: "bg-gray-100 text-gray-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
        status
      )}`}
    >
      {status}
    </span>
  );
};

// Date Cell Component
const DateCell = ({ dateString }: { dateString?: string }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return <div className="text-sm text-gray-500">{formatDate(dateString)}</div>;
};

export function ProductTable({
  products,
  loading,
  searchQuery,
  currentPage,
  itemsPerPage,
  onPageChange,
}: ProductTableProps) {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-t-lg"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-t border-gray-200">
              <div className="h-16 bg-gray-100"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <div className="text-center">
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Products ({products.length} total)
          </h3>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of{" "}
            {products.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <ProductCell product={product} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TextCell value={product.vendor} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TextCell value={product.productType} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriceCell product={product} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StockCell product={product} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusCell status={product.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DateCell dateString={product.createdAt} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {product.onlineStoreUrl && (
                      <a
                        href={product.onlineStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                        title="View product"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
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
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
