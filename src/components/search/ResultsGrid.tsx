"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

interface ResultsGridProps {
  products: Product[];
  loading: boolean;
  searchQuery: string;
}

export function ResultsGrid({
  products,
  loading,
  searchQuery,
}: ResultsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border animate-pulse"
          >
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No products found</div>
        {searchQuery && (
          <p className="text-gray-400">
            Try adjusting your search terms or filters
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        {products.length} product{products.length !== 1 ? "s" : ""} found
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
