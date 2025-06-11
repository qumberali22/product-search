"use client";

import Image from "next/image";
import { ShoppingCart, ExternalLink } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.priceRange?.minVariantPrice?.amount || 0;
  const maxPrice = product.priceRange?.maxVariantPrice?.amount || 0;
  const currency = product.priceRange?.minVariantPrice?.currencyCode || "USD";

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm group hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
        {product.featuredImage ? (
          <Image
            src={
              product.featuredImage || "/placeholder.svg?height=300&width=300"
            }
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-sm">No image</div>
            </div>
          </div>
        )}
        {product.status === "ACTIVE" && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Available
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {product.vendor && (
            <p className="text-sm text-gray-600">by {product.vendor}</p>
          )}

          {product.productType && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {product.productType}
            </span>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-bold text-gray-900">
              {price === maxPrice
                ? `$${price.toFixed(2)} ${currency}`
                : `$${price.toFixed(2)} - $${maxPrice.toFixed(2)} ${currency}`}
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
              {product.description.replace(/<[^>]*>/g, "")}
            </p>
          )}

          <div className="flex gap-2 pt-3">
            <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            {product.onlineStoreUrl && (
              <a
                href={product.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
