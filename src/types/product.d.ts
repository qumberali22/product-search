export interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  vendor?: string;
  productType?: string;
  status: "ACTIVE" | "ARCHIVED" | "DRAFT";
  featuredImage?: string;
  images?: string[];
  priceRange?: {
    minVariantPrice: {
      amount: number;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: number;
      currencyCode: string;
    };
  };
  totalInventory?: number;
  hasOutOfStockVariants?: boolean;
  onlineStoreUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  seoTags?: string[];
  metafields?: Record<string, any>;
}

export interface SearchFilters {
  vendor: string;
  productType: string;
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
}
