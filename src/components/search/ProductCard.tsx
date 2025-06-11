"use client";

import Image from "next/image";
import { Tag, Calendar } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductImage, getProductImageAlt } from "@/lib/productImages";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const price = product.priceRange?.minVariantPrice?.amount || 0;
  const maxPrice = product.priceRange?.maxVariantPrice?.amount || 0;
  const currency = product.priceRange?.minVariantPrice?.currencyCode || "USD";

  const formatPrice = () => {
    if (price === maxPrice) {
      return `${currency === "GBP" ? "£" : "$"}${price.toFixed(2)}`;
    }
    return `${currency === "GBP" ? "£" : "$"}${price.toFixed(2)} - ${
      currency === "GBP" ? "£" : "$"
    }${maxPrice.toFixed(2)}`;
  };

  const getStockStatus = () => {
    const inventory = product.totalInventory || 0;
    const hasOutOfStock = product.hasOutOfStockVariants;

    if (inventory === 0 || hasOutOfStock) {
      return {
        text: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    }
    if (inventory < 10) {
      return {
        text: "Low Stock",
        color: "text-amber-600",
        bgColor: "bg-amber-100",
      };
    }
    return {
      text: "In Stock",
      color: "text-green-600",
      bgColor: "bg-green-100",
    };
  };

  const stockStatus = getStockStatus();

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm group hover:shadow-lg transition-all duration-200 hover:border-gray-300 cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-50">
        <Image
          src={getProductImage(product.id, product.title) || "/placeholder.svg"}
          alt={getProductImageAlt(product.title)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            // Fallback to default image if there's an error
            const target = e.target as HTMLImageElement;
            target.src = "/images/default-product.png";
          }}
        />

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}
          >
            {stockStatus.text}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
              {product.title}
            </h3>
            <div className="flex items-center justify-between mt-2">
              {product.vendor && (
                <p className="text-sm text-gray-600 font-medium">
                  by {product.vendor}
                </p>
              )}
            </div>
          </div>

          {product.productType && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {product.productType}
            </span>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
              {formatPrice()}
            </div>
            <div className="text-sm text-gray-500">
              Qty: {product.totalInventory || 0}
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-3 min-h-[3.75rem]">
              {truncateText(product.description, 120)}
            </p>
          )}

          {product.seoTags && product.seoTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.seoTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  title={tag}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {truncateText(tag, 12)}
                </span>
              ))}
              {product.seoTags.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{product.seoTags.length - 3} more
                </span>
              )}
            </div>
          )}

          {product.createdAt && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              Created: {formatDate(product.createdAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
