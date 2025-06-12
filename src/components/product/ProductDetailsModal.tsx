"use client";
import Image from "next/image";
import { X, Package, Tag } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductImage, getProductImageAlt } from "@/lib/productImages";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  if (!isOpen || !product) return null;

  const formatPrice = () => {
    if (!product.priceRange) return "N/A";
    const min = product.priceRange.minVariantPrice.amount;
    const max = product.priceRange.maxVariantPrice.amount;
    const currency = product.priceRange.minVariantPrice.currencyCode;

    if (min === max) {
      return `${currency === "GBP" ? "£" : "$"}${min.toFixed(2)} ${currency}`;
    }
    return `${currency === "GBP" ? "£" : "$"}${min.toFixed(2)} - ${
      currency === "GBP" ? "£" : "$"
    }${max.toFixed(2)} ${currency}`;
  };

  const getStockStatus = () => {
    const inventory = product.totalInventory || 0;
    const hasOutOfStock = product.hasOutOfStockVariants;

    if (inventory === 0 || hasOutOfStock) {
      return {
        text: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: "🔴",
      };
    }
    if (inventory < 10) {
      return {
        text: "Low Stock",
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        icon: "🟡",
      };
    }
    return {
      text: "In Stock",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: "🟢",
    };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Product Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                  <Image
                    src={
                      getProductImage(product.id, product.title) ||
                      "/placeholder.svg"
                    }
                    alt={getProductImageAlt(product.title)}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to default image if there's an error
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/default-product.png";
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Handle: {product.handle}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    Price
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatPrice()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Vendor
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {product.vendor || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Product Type
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {product.productType || "Uncategorized"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {product.seoTags && product.seoTags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.seoTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Inventory Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Total Inventory
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {product.totalInventory || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Stock Status
                    </div>
                    <div
                      className={`text-lg font-semibold ${stockStatus.color}`}
                    >
                      {stockStatus.icon} {stockStatus.text}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Out of Stock Variants
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {product.hasOutOfStockVariants ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dates
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Created At
                    </div>
                    <div className="text-gray-900">
                      {formatDate(product.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      Modified At
                    </div>
                    <div className="text-gray-900">
                      {formatDate(product.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
